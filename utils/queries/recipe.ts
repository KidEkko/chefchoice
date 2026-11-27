import { sql } from "@/utils";

/**
 * Shared SQL fragment for fetching recipe ingredients as JSON
 * Returns ingredients with camelCase field names to match TypeScript Ingredient type
 *
 * Usage: Include in SELECT clause when querying recipes table
 * Example: SELECT r.*, ${INGREDIENTS_SUBQUERY} FROM recipes r
 */
export const INGREDIENTS_SUBQUERY = sql`
  (SELECT json_agg(json_build_object(
      'ingredientId', i.ingredient_id,
      'name', i.name,
      'cost', i.cost,
      'unit', rti.unit,
      'amount', rti.amount,
      'note', rti.note
    ) ORDER BY i.name)
    FROM recipe_to_ingredients rti
    INNER JOIN ingredients i ON i.ingredient_id = rti.ingredient_id
    WHERE rti.recipe_id = r.recipe_id
  ) AS ingredients
`;
