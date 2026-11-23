import { ChefResponse, GenericHandler } from "@/utils/api"; 
import { verifySession } from "@/lib/session";
import { ApiError, Ingredient, Recipe } from "@/utils/types";
import { ErrorMessages } from "@/serverConfig";
import { sql } from "@/utils/sql";

const PROCESS = "Add Recipe";
export async function POST(req: Request) {
    return await GenericHandler(req, addRecipe, PROCESS);
}

async function addRecipe(req: Request, resp: ChefResponse) {

      const session = await verifySession();
      if (!session) // TODO: Error message string for invalid session
          throw new ApiError(ErrorMessages.INVALID_SESSION_ERROR, {status: 400})


    const recipe = await req.json() as Recipe;
    
    const row = await sql`INSERT INTO Recipes (name, user_id, instructions, servings, prep_minutes, cook_minutes, difficulty) 
        VALUES (${recipe.name}, ${session.id}, ${recipe.instructions}, ${recipe.servings}, ${recipe.prepMinutes}, ${recipe.cookMinutes}, ${recipe.difficulty}) RETURNING recipe_id;`;

    /**
     * Return for Neon statements has type Record<string, any>[]
     * We know that recipe_id is the record being returned
     * Create the id to make it look nice
     */
    const recipeId = row[0].recipe_id

    // Map all ingredients to a single comma-separated string for big insertion
    const ingredients = recipe.ingredients.map((ing: Ingredient) => ing.name.trim().toLowerCase())

    // On Conflict prevents issues where a known ingredient is inserted, but still allows the id and name to be returned
    const rows = await sql`INSERT INTO Ingredients (name) 
        SELECT unnest(${ingredients}::text[]) 
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING ingredient_id, name`


    // Map name to ingredient_id, then iterate through all ingredients and assign them their id  
    const idByName = new Map<string, number>(rows.map((r) => [r.name, r.ingredient_id]));


    // Assign Ids through map function
    recipe.ingredients.map(ing => { 
        return {
            ...ing, 
            id: idByName.get(ing.name) 
        }
    })

    // transform our Ingredients recipe into a string record that Postgres can read.
    // https://www.postgresql.org/docs/9.5/functions-json.html
    await sql`INSERT INTO Recipe_to_ingredients (recipe_id, ingredient_id, amount, unit, note) 
        SELECT ${recipeId}, x.id, x.amount, x.unit, x.note
        FROM jsonb_to_recordset(${JSON.stringify(recipe.ingredients)}::jsonb)
        AS x(id integer, amount numeric, unit text, note text)`


    return;
}
