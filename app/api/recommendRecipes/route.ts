import { ChefResponse, GenericHandler } from "@/utils/api"; 
import { ApiError, Ingredient, IngredientRow, RecipeRow, RecipeToIngredientRow, RowToRecipe } from "@/utils/types";  
import { sql } from "@/utils";

const PROCESS = "Recommend Recipes";
export async function POST(req: Request) {
  return await GenericHandler(req, recommendRecipes, PROCESS);
}

/**
 * Expects a list of ingredients.
 * If a user inputs no ingredients, then they will be redirected to recipe page
 */

async function recommendRecipes(req: Request, resp: ChefResponse) {
  const ingredients = await req.json() as Ingredient[];
  const ids = ingredients.map((ingredient) => ingredient.id);
  
  // Query for basic recipe information, confirming that it is not currently deleted
  const recipeInfo =
    (await sql`SELECT rti.recipe_id, COUNT(*) AS ingredient_count FROM recipe_to_ingredients rti
      INNER JOIN recipes r ON r.recipe_id = rti.recipe_id
      WHERE NOT r.is_deleted AND rti.ingredient_id = ANY(${ids}::int[]) 
      GROUP BY rti.recipe_id ORDER BY ingredient_count DESC;`) as RecommendationRow[];

  if (!recipeInfo.length) throw new ApiError("No Recipe Found", { status: 400 });
 
  // Perform the more expensive query that also requires multiple rows now that we know we're good
  const i =
    (await sql`SELECT rti.ingredient_id, i.name, rti.amount, rti.unit, rti.notes FROM recipe_to_ingredients rti
      INNER JOIN ingredients i ON i.ingredient_id = rti.ingredient_id
      WHERE rti.recipe_id = ${recipe.id};`) as IngredientRow[];

  resp.setData(RowToRecipe(recipe.id, recipeInfo[0], ingredients))


  return;
}

interface RecommendationRow {
  recipe_id: number,
  amount: number,
  ingredient_count: number
}