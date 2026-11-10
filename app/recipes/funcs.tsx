
// export async function GetInitialData(): Promise<Recipe[]> {
//   var query = 
//       (await sql`SELECT r.id, r.name, u.username, r.instructions FROM recipes r
//         INNER JOIN users u ON u.user_id = r.user_id
//         WHERE r.id_deleted = false;`) as RecipeRow[];
      

//   const ingredients =
//       (await sql`SELECT rti.ingredient_id, i.name, rti.amount, rti.unit, rti.notes FROM recipe_to_ingredients rti
//         INNER JOIN ingredients i ON i.ingredient_id = rti.ingredient_id
//         WHERE rti.recipe_id = ${recipe.id};`) as IngredientRow[];

//     RowToRecipe(recipe.id, recipeInfo[0], ingredients))
// }