import { sql } from "@/utils";
import { RecipeRow } from "@/utils/types/recipe";
import { RowsToRecipes } from "@/utils/types/recipe";
import { INGREDIENTS_SUBQUERY } from "@/utils/queries/recipe";
import { RecipesDisplay } from "./RecipesDisplay";

const RECIPES_PER_PAGE = 12;

type SortOption = "newest" | "oldest" | "most_ingredients" | "fewest_ingredients" | "a-z";
type DifficultyFilter = "all" | "easy" | "medium" | "hard";

export default async function RecipesPage({
    searchParams
}: {
    searchParams: Promise<{
        page?: string;
        sort?: SortOption;
        difficulty?: DifficultyFilter;
    }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const sort = params.sort || "newest";
    const difficulty = params.difficulty || "all";

    const offset = (page - 1) * RECIPES_PER_PAGE;

    // Build sort clause
    // TODO: Review sql.unsafe usage for security - currently safe as sortClause is built from controlled enum
    let sortClause = "r.created_on DESC";
    switch (sort) {
        case "oldest":
            sortClause = "r.created_on ASC";
            break;
        case "most_ingredients":
            sortClause = "ingredient_count DESC, r.created_on DESC";
            break;
        case "fewest_ingredients":
            sortClause = "ingredient_count ASC, r.created_on DESC";
            break;
        case "a-z":
            sortClause = "r.name ASC";
            break;
    }

    // Build difficulty filter
    const difficultyFilter = difficulty !== "all" ? sql`AND r.difficulty = ${difficulty}` : sql``;

    // Get total count for pagination
    const countResult = await sql`
        SELECT COUNT(DISTINCT r.recipe_id) as total
        FROM recipes r
        WHERE NOT r.is_deleted ${difficultyFilter}
    `;
    const totalRecipes = parseInt(countResult[0].total);
    const totalPages = Math.ceil(totalRecipes / RECIPES_PER_PAGE);

    // Fetch recipes with pagination
    // TODO: ingredient_count subquery is redundant since INGREDIENTS_SUBQUERY already fetches ingredients
    // Could use recipe.ingredients.length after parsing instead
    const recipes = (await sql`
        SELECT r.recipe_id, r.name, u.username, r.instructions,
               r.source_url, r.image_url, r.servings, r.prep_minutes, r.cook_minutes,
               r.difficulty, r.created_on,
            (
                SELECT COUNT(*)
                FROM recipe_to_ingredients rti
                WHERE rti.recipe_id = r.recipe_id
            ) as ingredient_count,
            ${INGREDIENTS_SUBQUERY}
        FROM recipes r
        INNER JOIN users u ON u.user_id = r.user_id
        WHERE NOT r.is_deleted ${difficultyFilter}
        ORDER BY ${sql.unsafe(sortClause)}
        LIMIT ${RECIPES_PER_PAGE} OFFSET ${offset}
    `) as RecipeRow[];

    const recipeList = RowsToRecipes(recipes);

    return (
        <RecipesDisplay
            recipes={recipeList}
            currentPage={page}
            totalPages={totalPages}
            totalRecipes={totalRecipes}
            currentSort={sort}
            currentDifficulty={difficulty}
        />
    );
}
