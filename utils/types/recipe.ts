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
  imageUrl?: string;
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
  is_deleted?: boolean,
  created_on?: Date,
  rating?: number,
  source_url: string;
  image_url?: string;
  cook_minutes: number;
  prep_minutes: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  dietary_tags?: string[];
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
    createdOn: recipeRow.created_on || new Date(),
    rating: recipeRow.rating,
    sourceUrl: recipeRow.source_url,
    imageUrl: recipeRow.image_url,
    cookMinutes: recipeRow.cook_minutes,
    prepMinutes: recipeRow.prep_minutes,
    servings: recipeRow.servings,
    difficulty: recipeRow.difficulty,
    dietaryTags: recipeRow.dietary_tags || [],
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
