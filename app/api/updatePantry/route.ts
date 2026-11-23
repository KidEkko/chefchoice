import { ChefResponse, GenericHandler } from "@/utils/api"; 
import { verifySession } from "@/lib/session";
import { ApiError, Ingredient, Pantry, Recipe } from "@/utils/types";
import { ErrorMessages } from "@/serverConfig";
import { sql } from "@/utils/sql";

const PROCESS = "Update Recipe";
export async function POST(req: Request) {
    return await GenericHandler(req, updatePantry, PROCESS);
}

async function updatePantry(req: Request, resp: ChefResponse) {
    const session = await verifySession();
    if (!session) 
        throw new ApiError(ErrorMessages.INVALID_SESSION_ERROR, {status: 400})


    const pantry = await req.json() as Pantry;
    
    const row = await sql`INSERT INTO Pantries (user_id) VALUES (${session.id})
        ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id RETURNING pantry_id;`;

    const pantryId = row[0].pantry_id

    // Map all ingredients to a single comma-separated string for big insertion
    const ingredients = pantry.ingredients.map((ing: Ingredient) => ing.name.trim().toLowerCase())

    // On Conflict prevents issues where a known ingredient is inserted, but still allows the id and name to be returned
    const rows = await sql`INSERT INTO Ingredients (name) 
        SELECT unnest(${ingredients}::text[]) 
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING ingredient_id, name`


    // Map name to ingredient_id, then iterate through all ingredients and assign them their id  
    const idByName = new Map<string, number>(rows.map((r) => [r.name, r.ingredient_id]));


    // Assign Ids through map function
    pantry.ingredients.map(ing => { 
        return {
            ...ing, 
            id: idByName.get(ing.name) 
        }
    })

    // transform our Ingredients recipe into a string record that Postgres can read.
    // https://www.postgresql.org/docs/9.5/functions-json.html
    await sql`INSERT INTO Pantry_to_ingredients (pantry_id, ingredient_id, amount, unit, note) 
        SELECT ${pantryId}, x.id, x.amount, x.unit, x.note
        FROM jsonb_to_recordset(${JSON.stringify(pantry.ingredients)}::jsonb)
        AS x(id integer, amount numeric, unit text, note text)`


    return;
}
