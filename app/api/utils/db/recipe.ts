import "server-only"
import { Recipe } from "@/utils/types"
import { IngredientRow, IngredientRowsToIngredient } from "./ingredient"

export interface RecipeRow {
  name: string,
  username: string,
  instructions: string,
  is_deleted: boolean,
  created_on: Date,
  rating: number | undefined,
}

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