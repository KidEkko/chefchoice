import { sql } from "@/utils";
import { RecipeRow, RowToRecipe } from "@/utils/types/recipe";
import { notFound, redirect } from "next/navigation";
import { RecipeDisplay } from "./RecipeDisplay";

export default async function RecipePage({
    params,
    searchParams
}: {
    params: Promise<{id: string}>;
    searchParams: Promise<{ ingredientIds?: string }>;
}) {
    const { id } = await params;
    const { ingredientIds } = await searchParams;

    // Parse ingredient IDs from query string (e.g., ?ingredientIds=1,2,3)
    const userIngredientIds = ingredientIds
        ? ingredientIds.split(',').map(Number).filter(n => !isNaN(n))
        : [];

    try {
        // Fetch full recipe details
        const recipes = (await sql`
            SELECT r.recipe_id AS id, r.name, u.username, r.instructions,
                   r.source_url AS source, r.servings, r.prep_minutes, r.cook_minutes,
                   r.difficulty, r.is_deleted,
                (
                    SELECT json_agg(json_build_object(
                        'name', i.name, 'cost', i.cost,
                        'unit', rti.unit, 'amount', rti.amount, 'note', rti.note,
                        'ingredientId', i.ingredient_id) ORDER BY i.name)
                    FROM recipe_to_ingredients rti
                    INNER JOIN ingredients i ON i.ingredient_id = rti.ingredient_id
                    WHERE rti.recipe_id = r.recipe_id
                )
            ) AS ingredients
            FROM recipes r
            INNER JOIN users u ON u.user_id = r.user_id
            WHERE r.recipe_id = ${parseInt(id)};
        `) as RecipeRow[];

        if (!recipes.length) {
            notFound();
        }

        const recipeRow = recipes[0];

        // If recipe is deleted, show deleted message
        if (recipeRow.is_deleted) {
            return <RecipeDeleted />;
        }

        const recipe = RowToRecipe(recipeRow);

        return <RecipeDisplay recipe={recipe} userIngredientIds={userIngredientIds} />;
    } catch (error) {
        console.error("Error fetching recipe:", error);
        // Redirect to home after error
        redirect("/");
    }
}

function RecipeDeleted() {
    return (
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
            <div className="flex flex-col items-center justify-center gap-4 py-16">
                <h1 className="text-2xl font-semibold">Recipe No Longer Available</h1>
                <p className="text-muted-foreground">
                    This recipe has been removed and is no longer available.
                </p>
            </div>
        </main>
    );
}