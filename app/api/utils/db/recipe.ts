import "server-only"
import { Recipe } from "@/utils/types"
import { IngredientRow, IngredientRowsToIngredient } from "./ingredient"

export interface RecipeRow {
  id: number,
  name: string,
  username: string,
  instructions: string,
  is_deleted: boolean,
  created_on: Date,
  rating: number | undefined,
}

// TODO: confirm we want id to be separate here or if we add the id to the row construction
export function RowToRecipe(id: number, recipeRow: RecipeRow, ingredientRows: IngredientRow[]): Recipe {
  return {
    id: id,
    name: recipeRow.name,
    createdBy: recipeRow.username,
    instructions: recipeRow.instructions,
    ingredients: IngredientRowsToIngredient(ingredientRows),
    createdOn: recipeRow.created_on,
    rating: recipeRow.rating,
  }
}

export function RowsToRecipes(recipeRows: RecipeRow[], ingredientRows: IngredientRow[][]): Recipe[] {
  return recipeRows.map((row, i) => {
    return RowToRecipe(row.id, row, ingredientRows[i])
  })
}