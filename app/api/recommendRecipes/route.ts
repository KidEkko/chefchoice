import { ChefResponse, GenericHandler } from "@/utils/api"; 
import { ApiError, Ingredient, RecipeRow } from "@/utils/types";  
import { sql } from "@/utils";
import { FullRowsToRecipes } from "@/utils/types/recipe";

const PROCESS = "Recommend Recipes";
export async function POST(req: Request) {
  return await GenericHandler(req, recommendRecipes, PROCESS);
}

/**
 * Expects a list of ingredients.
 * If a user inputs no ingredients, then they will be redirected to recipe page
 * 
 * Steps followed:
 *  Parse ingredients from the Request object
 *  Get an array of numbers from the ingredients to supply in our Query
 *  Retrieve a list of up to 5 recipe IDs that contain the ingredient IDs, sorted by the percentage of matching ingredients
 *  Once IDs have been retrieved, get all other important information for display
 */
async function recommendRecipes(req: Request, resp: ChefResponse) {
  const ingredients = await req.json() as Ingredient[];
  const ids = ingredients.map(ingredient => ingredient.id);
  
  // Query for basic recipe information, confirming that it is not currently deleted
  // TODO: Comment more
  const recipes =
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
      LIMIT 5;`) as RecommendationRow[];

  if (!recipes.length) throw new ApiError("No Recipes Found", { status: 400 });

  const recipeIds = recipes.map(recipe => recipe.recipe_id);
 
  // Perform the more expensive query that also requires multiple rows now that we know we're good
  const i =
    (await sql`
      SELECT r.recipe_id AS id, r.name, u.username, r.instructions, r.source, r.servings, r.prep_minutes, r.cook_minutes, r.difficulty,
        (
          SELECT json_agg(json_build_object(
              'name', i.name, 'cost', i.cost,
              'unit', rti.unit, 'amount', rti.amount, 'note', rti.notes) ORDER BY i.name)
              FROM recipe_to_ingredients rti 
              INNER JOIN ingredients i ON i.ingredient_id = rti.ingredient_id  
              WHERE rti.recipe_id = r.recipe_id
          )
        ) AS ingredients
      FROM recipes r
      INNER JOIN users u ON u.user_id = r.user_id
      WHERE NOT is_deleted AND recipe_id = ANY(${recipeIds}::int[]);`) as RecipeRow[];

  resp.setData(FullRowsToRecipes(i))


  return;
}

interface RecommendationRow {
  recipe_id: number,
  total: number,
  matched: number
}

