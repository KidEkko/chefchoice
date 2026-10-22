import { Ingredient } from "./ingredient";

export interface Recipe {
  id: number,
  name: string;
  createdBy: string;
  instructions: string;
  ingredients: Ingredient[];
  createdOn: Date;
  rating: number | undefined;
}


