import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils";
import { verifySession } from "@lib/session";
import { ApiError } from "@/utils/types/response";
import { Recipe } from "@/utils/types/recipe";
import { RecipeRow, RowToRecipe } from "../utils/db/recipe";
import { IngredientRow } from "../utils/db/ingredient";
import { ErrorMessages } from "@/serverConfig";

const PROCESS = "Get Recipe";
export async function GET(req: Request) {
  return await GenericHandler(req, getRecipe, PROCESS);
}

async function getRecipe(req: Request, resp: ChefResponse) {
  const session = await verifySession();
  if (!session)
    throw new ApiError(ErrorMessages.INVALID_SESSION_ERROR, 400)


  const recipe = await req.json();

  // REAL TODO: Update the ApiError system in general. Simple is fine for personal website, but this new version should have something else.
  // Should still be a global error type, but might have to duplicate in backend and frontend. Can just be more detailed in backend?
  // Also man do I need that third string or what. Another part of TS I'm not fully used to getting around
  if (!recipe)
    throw new ApiError("No recipe provided", 401)


  // Query for basic recipe information, confirming that it is not currently deleted
  const recipeInfo =
    (await sql`SELECT r.name, u.username, r.instructions, r.is_deleted FROM recipes r
      INNER JOIN users u ON u.user_id = r.user_id
      WHERE r.recipe_id = ${recipe.id} AND r.id_deleted = false;`) as RecipeRow[];

  if (!recipeInfo.length) throw new ApiError("No Recipe Found", 400);
 
  // Perform the more expensive query that also requires multiple rows now that we know we're good
  const ingredients =
    (await sql`SELECT rti.ingredient_id, i.name, rti.amount, rti.unit, rti.notes FROM recipe_to_ingredients rti
      INNER JOIN ingredients i ON i.ingredient_id = rti.ingredient_id
      WHERE rti.recipe_id = ${recipe.id};`) as IngredientRow[];

  resp.setData(RowToRecipe(recipe.id, recipeInfo[0], ingredients))


  return;
}
