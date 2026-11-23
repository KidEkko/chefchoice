import { ChefResponse, GenericHandler } from "@/utils/api"; 
import { ApiError, Ingredient, RecipeRow } from "@/utils/types";  
import { sql } from "@/utils";
import { RowsToRecipes } from "@/utils/types/recipe";

const PROCESS = "Recommend Recipes";
export async function POST(req: Request) {
  return await GenericHandler(req, recommendRecipes, PROCESS);
}

async function recommendRecipes(req: Request, resp: ChefResponse) {
  // Parse ingredients from the user's request
  // Create variable for initial Recipe Id query. Not necessary, but looks better than putting the map in the statement
  const ingredients = await req.json() as Ingredient[];
  const ids = ingredients.filter(ing => !!ing.ingredientId).map(ingredient => ingredient.ingredientId);
  
  // Query for basic recipe information, confirming that it is not currently deleted
  // TODO: Comment more

  // Query basic recipe information
  // Base version of fetch prioritizes the percentage of ingredients in the user's query
  // To that end, perform an inner query that gets total ingredient count by Id and number of matched Ids
  // Sort within the query since it's simpler
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

  if (!recommendations.length) throw new ApiError("No Recipes Found", { status: 400 });

  // Create Recipe Id array for Full Query
  const recipeIds = recommendations.map(recipe => recipe.recipe_id);
 
  // More expensive query fetching all relevant information 
  const recipes =
    (await sql`
      SELECT r.recipe_id AS id, r.name, u.username, r.instructions, r.source, r.servings, r.prep_minutes, r.cook_minutes, r.difficulty,
        (
          SELECT json_agg(json_build_object(
              'name', i.name, 'cost', i.cost,
              'unit', rti.unit, 'amount', rti.amount, 'note', rti.note) ORDER BY i.name)
              FROM recipe_to_ingredients rti 
              INNER JOIN ingredients i ON i.ingredient_id = rti.ingredient_id  
              WHERE rti.recipe_id = r.recipe_id
          )
        ) AS ingredients
      FROM recipes r
      INNER JOIN users u ON u.user_id = r.user_id
      WHERE NOT r.is_deleted AND r.recipe_id = ANY(${recipeIds}::int[]);`) as RecipeRow[];

  resp.setData(RowsToRecipes(recipes))
  return;
}

// Unique interface for Recommendation query
interface RecommendationRow {
  recipe_id: number,
  total: number,
  matched: number
}

