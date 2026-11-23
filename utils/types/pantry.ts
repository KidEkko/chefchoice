import { Ingredient } from "./ingredient";

export interface Pantry {
    id?: number;
    userId?: number;
    createdOn?: Date;
    isDeleted?: boolean;
    ingredients: Ingredient[];
}

export interface PantryRow {
    pantry_id?: number;
    user_id?: number;
    created_on?: Date;
    is_deleted?: boolean;
    ingredients: Ingredient[];
}

export function RowToPantry(pantryRow: PantryRow, id?: number): Pantry {
    return {
        id: id,
        userId: pantryRow.user_id,
        createdOn: pantryRow.created_on,
        isDeleted: pantryRow.is_deleted,
        ingredients: pantryRow.ingredients
    };
}

export function RowsToPantries(pantryRows: PantryRow[]): Pantry[] {
    return pantryRows.map(pantry => RowToPantry(pantry));
}