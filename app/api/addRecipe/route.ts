import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils";
import { Recipe } from "@/utils/types/recipe";
import { Ingredient } from "@/utils/types/ingredient"; 
import { verifySession } from "@/lib/session";
import { ApiError } from "@/utils/types/response";
import { ErrorMessages } from "@/serverConfig";

const PROCESS = "Add Recipe";
export async function POST(req: Request) {
    return await GenericHandler(req, addRecipe, PROCESS);
}

async function addRecipe(req: Request, resp: ChefResponse) {

      const session = await verifySession();
      if (!session) // TODO: Error message string for invalid session
          throw new ApiError(ErrorMessages.INVALID_SESSION_ERROR, {status: 400})

    console.log("starting");

    const recipe = await req.json() as Recipe;
    console.log("Recipe: ", recipe);
    const row = await sql`INSERT INTO Recipes (name, user_id, instructions) 
        VALUES (${recipe.name}, ${1}, ${recipe.instructions}) RETURNING recipe_id;`;

    /**
     * Return for Neon statements has type Record<string, any>[]
     * We know that recipe_id is the record being returned
     * Create the id to make it look nice
     */
    const recipeId = row[0].recipe_id
    console.log("Return: ", recipeId)

    // Map all ingredients to a single comma-separated string for big insertion
    const ingredients = recipe.ingredients.map((ingredient: Ingredient) => ingredient.name.trim().toLowerCase())

    // On Conflict prevents issues where a known ingredient is inserted, but still allows the id and name to be returned
    const rows = await sql`INSERT INTO Ingredients (name) 
        SELECT unnest(${ingredients}::text[]) 
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING ingredient_id, name`


    // Map name to ingredient_id, then iterate through all ingredients and assign them their id  
    const idByName = new Map<string, number>(rows.map((r) => [r.name, r.ingredient_id]));


    for (let i = 0; i < recipe.ingredients.length; i++) {
        const id = idByName.get(recipe.ingredients[i].name) || 0; // 0 should NEVER happen
        recipe.ingredients[i].id = id;
    }

    // transform our Ingredients recipe into a string record that Postgres can read.
    // https://www.postgresql.org/docs/9.5/functions-json.html
    await sql`INSERT INTO Recipe_to_ingredients (recipe_id, ingredient_id, amount, unit, notes) 
        SELECT ${recipeId}, x.id, x.amount, x.unit, x.notes
        FROM jsonb_to_recordset(${JSON.stringify(recipe.ingredients)}::jsonb)
        AS x(id integer, amount numeric, unit text, notes text)`


    return;
}
