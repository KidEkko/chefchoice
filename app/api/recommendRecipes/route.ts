import { ChefResponse, GenericHandler } from "@/utils/api";
import { RecipeRow } from "@/utils/types";
import { sql } from "@/utils";
import { RowsToRecipes } from "@/utils/types/recipe";
import { INGREDIENTS_SUBQUERY } from "@/utils/queries/recipe";

const PROCESS = "Recommend Recipes";
export async function POST(req: Request) {
  return await GenericHandler(req, recommendRecipes, PROCESS);
}

async function recommendRecipes(req: Request, resp: ChefResponse) {
  const rawIds = await req.json();

  // Validate input is an array of numbers
  if (!Array.isArray(rawIds)) {
    resp.setData([]);
    return;
  }

  const ids = rawIds.filter(id => typeof id === 'number' && !isNaN(id));

  // If no valid ingredients selected, show default recipes with variety
  if (!ids.length) {
    const defaultRecipes = await getDefaultRecipes();
    resp.setData(defaultRecipes);
    return;
  }

  // Query basic recipe information
  // Prioritizes recipes by percentage of ingredients the user has
  // Inner query gets total ingredient count by recipe_id and number of matched ingredient_ids
  // Sort by match percentage (desc), then by fewest additional ingredients needed (asc)
  const recommendations =
    (await sql`
      SELECT recipe_id, matched, total
      FROM (
        SELECT rti.recipe_id,
              COUNT(*) AS total,
              COUNT(*) FILTER (WHERE rti.ingredient_id = ANY(${ids}::int[])) AS matched
        FROM recipe_to_ingredients rti
        INNER JOIN recipes r ON r.recipe_id = rti.recipe_id
        WHERE NOT r.is_deleted
        GROUP BY rti.recipe_id
      ) scored
      WHERE matched > 0
      ORDER BY matched::numeric / total DESC , total - matched ASC, recipe_id
      LIMIT 10;`) as RecommendationRow[];

  // Return empty array instead of throwing error when no recipes found
  if (!recommendations.length) {
    resp.setData([]);
    return;
  }

  // Create Recipe Id array for Full Query
  const recipeIds = recommendations.map(recipe => recipe.recipe_id);
 
  // More expensive query fetching all relevant information
  const recipes =
    (await sql`
      SELECT r.recipe_id, r.name, u.username, r.instructions,
             r.source_url, r.image_url, r.servings, r.prep_minutes, r.cook_minutes,
             r.difficulty, r.created_on,
             ${INGREDIENTS_SUBQUERY}
      FROM recipes r
      INNER JOIN users u ON u.user_id = r.user_id
      WHERE NOT r.is_deleted AND r.recipe_id = ANY(${recipeIds}::int[])
    `) as RecipeRow[];

  resp.setData(RowsToRecipes(recipes))
  return;
}

// Unique interface for Recommendation query
interface RecommendationRow {
  recipe_id: number,
  total: number,
  matched: number
}

interface DefaultRecipeIdRow {
  recipe_id: number
}

/**
 * Get default recipes when no ingredients are selected
 * Returns 10 recipes with variety in ingredients to provide diverse options
 *
 * TODO: Add ingredient categorization (meat, vegetable, dairy, grain, etc.) to database
 *       This would allow us to ensure better variety by selecting recipes with different
 *       types of ingredients (e.g., one chicken recipe, one beef, one vegetarian, etc.)
 *
 * Current approach: Select recipes with diverse ingredient lists by getting recipes
 * that use less common ingredient combinations, ordered by ingredient diversity
 */
async function getDefaultRecipes() {
  // Query for recipes with variety in their ingredient composition
  // We select recipes that have different sets of ingredients by using
  // a combination of ingredient count and recipe creation date for variety
  const recommendations = (await sql`
    SELECT recipe_id
    FROM (
      SELECT r.recipe_id,
             COUNT(DISTINCT rti.ingredient_id) as ingredient_count,
             r.created_on
      FROM recipes r
      INNER JOIN recipe_to_ingredients rti ON r.recipe_id = rti.recipe_id
      WHERE NOT r.is_deleted
      GROUP BY r.recipe_id, r.created_on
      ORDER BY
        -- Prioritize recipes with more ingredients (more variety)
        ingredient_count DESC,
        -- Then by creation date for freshness
        r.created_on DESC,
        r.recipe_id
      LIMIT 10
    ) diverse
  `) as DefaultRecipeIdRow[];

  // TODO: throw error here?
  if (!recommendations.length) {
    return [];
  }

  const recipeIds = recommendations.map(r => r.recipe_id);

  // Fetch full recipe details
  const recipes = (await sql`
    SELECT r.recipe_id, r.name, u.username, r.instructions,
           r.source_url, r.image_url, r.servings, r.prep_minutes, r.cook_minutes,
           r.difficulty, r.created_on,
           ${INGREDIENTS_SUBQUERY}
    FROM recipes r
    INNER JOIN users u ON u.user_id = r.user_id
    WHERE NOT r.is_deleted AND r.recipe_id = ANY(${recipeIds}::int[])
  `) as RecipeRow[];

  return RowsToRecipes(recipes);
}

