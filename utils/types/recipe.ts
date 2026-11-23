import { Ingredient, IngredientRow, IngredientRowsToIngredient } from "./ingredient";

export interface Recipe {
  recipeId?: number,
  name: string;
  createdBy: string;
  instructions: string[];
  ingredients: Ingredient[];
  createdOn: Date;
  rating?: number | undefined;
  sourceUrl: string;
  cookMinutes: number;
  prepMinutes: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  dietaryTags: string[];
}

export interface RecipeRow {
  recipe_id?: number,
  name: string,
  username: string,
  instructions: string[],
  ingredients: Ingredient[];
  is_deleted: boolean,
  created_on: Date,
  rating?: number | undefined,
  sourceUrl: string;
  cookMinutes: number;
  prepMinutes: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  dietaryTags: string[];
}



// TODO: confirm we want id to be separate here or if we add the id to the row construction
export function RowToRecipe(recipeRow: RecipeRow, ingredientRows?: IngredientRow[]): Recipe {
  const ingredients = ingredientRows ? 
    IngredientRowsToIngredient(ingredientRows) : 
    recipeRow.ingredients;
  return {
    recipeId: recipeRow.recipe_id,
    name: recipeRow.name,
    createdBy: recipeRow.username,
    instructions: recipeRow.instructions,
    ingredients: ingredients, // TODO: are we adding selecting here?
    createdOn: recipeRow.created_on,
    rating: recipeRow.rating,
    sourceUrl: recipeRow.sourceUrl,
    cookMinutes: recipeRow.cookMinutes,
    prepMinutes: recipeRow.prepMinutes,
    servings: recipeRow.servings,
    difficulty: recipeRow.difficulty,
    dietaryTags: recipeRow.dietaryTags,
  }
}

export function RowsToRecipes(recipeRows: RecipeRow[], ingredientRows?: IngredientRow[][]): Recipe[] {
  const ingredientRowsProvided = !!ingredientRows;
  return recipeRows.map((row, i) => {
    if (ingredientRowsProvided) {
      row = { 
        ...row, 
        ingredients: IngredientRowsToIngredient(ingredientRows[i]) 
      }
    }
    return RowToRecipe(row)
  });
}
