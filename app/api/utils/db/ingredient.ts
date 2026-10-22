import { Ingredient } from "@/utils/types/ingredient"
import "server-only"

export interface IngredientRow {
  ingredient_id: number,
  name: string,
  amount: number,
  unit: string,
  notes: string
}

function rowToIngredient(row: IngredientRow): Ingredient {
  return {
    id: row.ingredient_id,
    name: row.name,
    amount: row.amount,
    unit: row.unit,
    notes: row.notes
  }
}

export function IngredientRowsToIngredient(rows: IngredientRow[]): Ingredient[] {
  return rows.map((row: IngredientRow) => rowToIngredient(row));;
}