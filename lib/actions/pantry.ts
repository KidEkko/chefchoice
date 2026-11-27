"use server"

import { sql } from "@/utils";
import { IngredientRow, IngredientRowsToIngredient, Pantry, User } from "@/utils/types";

/**
 * Pantry-related server actions
 */

// Function to load a user's pantry on page load
// Optionally returns a pantry object to feed into the Pantry Provider
export async function GetUserPantry(user: User | undefined): Promise<Pantry | undefined> {
  if (!user) return;

  const ingredients = (await
      sql`
      SELECT i.ingredient_id, i.name, i.cost, pti.unit, pti.amount, pti.note FROM ingredients i
      INNER JOIN pantry_to_ingredients pti ON pti.ingredient_id = i.ingredient_id
      INNER JOIN pantries p ON p.pantry_id = pti.pantry_id
      WHERE p.user_id = ${user.id};`
    ) as IngredientRow[];

  return { ingredients: IngredientRowsToIngredient(ingredients) } as Pantry
}
