import { RecipeToIngredientRow } from "./recipeToIngredient";

export interface Ingredient {
  id: number,
  name: string;
  amount: number;
  unit: string;
  cost: number;
  notes: string;
}

export interface IngredientRow {
  ingredient_id: number,
  name: string,
  amount: number,
  unit: string,
  cost: number
  notes: string
}

function rowToIngredient(row: IngredientRow): Ingredient {
  return {
    id: row.ingredient_id,
    name: row.name,
    amount: row.amount,
    unit: row.unit,
    cost: row.cost,
    notes: row.notes
  }
}

function rToIRowToIngredient(iRow: IngredientRow, rToIRow: RecipeToIngredientRow): Ingredient {
  return {
    id: iRow.ingredient_id,
    name: iRow.name,
    cost: iRow.cost,
    amount: rToIRow.amount,
    unit: rToIRow.unit,
    notes: rToIRow.notes
  }
}

export function IngredientRowsToIngredient(rows: IngredientRow[]): Ingredient[] {
  return rows.map((row: IngredientRow) => rowToIngredient(row));;
}

export function MergeIngredients(ingredientRows: IngredientRow[], rToIRows: RecipeToIngredientRow[]): Ingredient[] {
  // Each ingredient should have a row. Prevent overflow
  if (ingredientRows.length !== rToIRows.length) return [];
  return ingredientRows.map((ingredient, idx) => {
    return rToIRowToIngredient(ingredient, rToIRows[idx]);
  })
}