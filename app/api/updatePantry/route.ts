import { ChefResponse, GenericHandler } from "@/utils/api";
import { verifySession } from "@/lib/session";
import { ApiError, Ingredient, Pantry } from "@/utils/types";
import { ErrorMessages } from "@/serverConfig";
import { sql } from "@/utils/sql";

const PROCESS = "Update Pantry";
export async function POST(req: Request) {
    return await GenericHandler(req, updatePantry, PROCESS);
}

async function updatePantry(req: Request, resp: ChefResponse) {
    const session = await verifySession();
    if (!session)
        throw new ApiError(ErrorMessages.Auth.INVALID_SESSION, {status: 401})

    const pantry = await req.json() as Pantry;

    // Get or create pantry for user
    const row = await sql`INSERT INTO Pantries (user_id) VALUES (${session.id})
        ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id RETURNING pantry_id;`;

    const pantryId = row[0].pantry_id

    // Always delete existing pantry items (even if updating to empty pantry)
    await sql`DELETE FROM Pantry_to_ingredients WHERE pantry_id = ${pantryId}`;

    // If no ingredients provided, return empty pantry
    // TODO: Add frontend confirmation alert when user is about to delete all pantry ingredients
    //       This should warn them that they're clearing their entire pantry before submission
    if (!pantry.ingredients || !pantry.ingredients.length) {
        resp.setData({
            pantryId,
            ingredients: []
        });
        return;
    }

    // Normalize ingredient names
    const ingredients = pantry.ingredients.map((ing: Ingredient) => ing.name.trim().toLowerCase())

    // Insert or get existing ingredient IDs
    const rows = await sql`INSERT INTO Ingredients (name)
        SELECT unnest(${ingredients}::text[])
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING ingredient_id, name`

    // Map ingredient names to their IDs
    const idByName = new Map<string, number>(rows.map((r) => [r.name, r.ingredient_id]));

    // Assign IDs to ingredients
    const ingredientsWithIds = pantry.ingredients.map(ing => ({
        ...ing,
        ingredientId: idByName.get(ing.name.trim().toLowerCase())
    }));

    // TODO: Revisit this JSON transformation approach - consider using a more type-safe method
    // Prepare ingredients for database insertion
    const ingredientsForDb = ingredientsWithIds.map(ing => ({
        id: ing.ingredientId,
        amount: ing.amount || 0,
        unit: ing.unit || '',
        note: ing.note || ''
    }));
    const ingredientsJson = JSON.stringify(ingredientsForDb);

    // Insert new pantry-to-ingredients relationships
    await sql`INSERT INTO Pantry_to_ingredients (pantry_id, ingredient_id, amount, unit, note)
        SELECT ${pantryId}, x.id, x.amount, x.unit, x.note
        FROM jsonb_to_recordset(${ingredientsJson}::jsonb)
        AS x(id integer, amount numeric, unit text, note text)`

    // Return the updated pantry
    resp.setData({
        pantryId,
        ingredients: ingredientsWithIds
    });
    return;
}
