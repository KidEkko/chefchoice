export interface Ingredient {
  id: number,
  name: string;
  amount: number;
  unit: string; // TODO: should this be its own class?
  notes: string;
}