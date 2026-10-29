import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils";
import { verifySession } from "@lib/session";
import { ApiError } from "@/utils/types";
import { RecipeRow, RowToRecipe, IngredientRow } from "../utils/db"; 
import { ErrorMessages } from "@/serverConfig";

const PROCESS = "Get Recipe";
export async function GET(req: Request) {
  return await GenericHandler(req, getRecipe, PROCESS);
}

async function getRecipe(req: Request, resp: ChefResponse) {
  const session = await verifySession();
  if (!session)
    throw new ApiError(ErrorMessages.INVALID_SESSION_ERROR, {status: 400})


  const recipe = await req.json();

  if (!recipe)
    throw new ApiError("No recipe provided", {status: 401})


  // Query for basic recipe information, confirming that it is not currently deleted
  const recipeInfo =
    (await sql`SELECT r.name, u.username, r.instructions, r.is_deleted FROM recipes r
      INNER JOIN users u ON u.user_id = r.user_id
      WHERE r.recipe_id = ${recipe.id} AND r.id_deleted = false;`) as RecipeRow[];

  if (!recipeInfo.length) throw new ApiError("No Recipe Found", {status: 400});
 
  // Perform the more expensive query that also requires multiple rows now that we know we're good
  const ingredients =
    (await sql`SELECT rti.ingredient_id, i.name, rti.amount, rti.unit, rti.notes FROM recipe_to_ingredients rti
      INNER JOIN ingredients i ON i.ingredient_id = rti.ingredient_id
      WHERE rti.recipe_id = ${recipe.id};`) as IngredientRow[];

  resp.setData(RowToRecipe(recipe.id, recipeInfo[0], ingredients))


  return;
}
