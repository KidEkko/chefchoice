import { RecipeToIngredientRow } from "./recipeToIngredient";

export interface Ingredient {
  ingredientId: number,
  name: string;
  amount?: number;
  unit?: string;
  cost?: number;
  note?: string;
  selected?: boolean;
}

// Do not need to add selected. Purely front-end field
export interface IngredientRow {
  ingredient_id: number;
  name: string;
  amount?: number;
  unit?: string;
  cost?: number;
  note?: string; 
}

function rowToIngredient(row: IngredientRow, selecting: boolean = false): Ingredient {
  return {
    ingredientId: row.ingredient_id,
    name: row.name,
    amount: row.amount,
    unit: row.unit,
    cost: row.cost,
    note: row.note,
    selected: selecting,
  }
}

function rToIRowToIngredient(iRow: IngredientRow, rToIRow: RecipeToIngredientRow, selecting: boolean = false): Ingredient {
  return {
    ingredientId: iRow.ingredient_id,
    name: iRow.name,
    cost: iRow.cost,
    amount: rToIRow.amount,
    unit: rToIRow.unit,
    note: rToIRow.note,
    selected: selecting,
  }
}

export function IngredientRowsToIngredient(rows: IngredientRow[], selecting: boolean = false): Ingredient[] {
  return rows.map((row: IngredientRow) => rowToIngredient(row, selecting));;
}

export function MergeIngredients(ingredientRows: IngredientRow[], rToIRows: RecipeToIngredientRow[], selecting: boolean = false): Ingredient[] {
  // Each ingredient should have a row. Prevent overflow
  if (ingredientRows.length !== rToIRows.length) return [];
  return ingredientRows.map((ingredient, idx) => {
    return rToIRowToIngredient(ingredient, rToIRows[idx], selecting);
  })
}