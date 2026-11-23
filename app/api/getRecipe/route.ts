import { ChefResponse, GenericHandler } from "@/utils/api"; 
import { ApiError, IngredientRow, RecipeRow, RowToRecipe } from "@/utils/types";  
import { sql } from "@/utils";

const PROCESS = "Get Recipe";
export async function POST(req: Request) {
  return await GenericHandler(req, getRecipe, PROCESS);
}

async function getRecipe(req: Request, resp: ChefResponse) {
  const recipe = await req.json();
  if (!recipe)
    throw new ApiError("No recipe provided", { status: 401 })

  // Query for basic recipe information, confirming that it is not currently deleted
  const recipeInfo =
    (await sql`SELECT r.name, u.username, r.instructions, r.is_deleted FROM recipes r
      INNER JOIN users u ON u.user_id = r.user_id
      WHERE r.recipe_id = ${recipe.id} AND NOT r.is_deleted;`) as RecipeRow[];

  if (!recipeInfo.length) throw new ApiError("No Recipe Found", { status: 400 });
 
  // Perform the more expensive query now that we know we're good
  const ingredients =
    (await sql`SELECT rti.ingredient_id, i.name, rti.amount, rti.unit, rti.note FROM recipe_to_ingredients rti
      INNER JOIN ingredients i ON i.ingredient_id = rti.ingredient_id
      WHERE rti.recipe_id = ${recipe.id};`) as IngredientRow[];

  // Construct recipe object in function call.
  // First, add recipe information from request 
  // Then overwrite all other fields with query information
  resp.setData(RowToRecipe({ ...recipe, ...recipeInfo[0] }, ingredients));
  return;
}
