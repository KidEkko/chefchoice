"use client"

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { RecommendedRecipeCard } from "@/components/recipe/RecommendedRecipeCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Ingredient, Recipe } from "@/utils/types";
import { usePantry } from "../providers";
import { RecommendRecipes } from "@/utils/api/endpoints";
import { IngredientPicker } from "../ingredients/IngredientPicker";

// Basic Status object for API query state
type Status = "idle" | "loading" | "done" | "error";

export function PantryRecommender({ ingredients }: { ingredients: Ingredient[]}) {
    const { pantry } = usePantry();
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState("");
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    // Snapshot of what was searched, so chips don't change when the user keeps editing the picker
    const [searchedIds, setSearchedIds] = useState<Set<number>>(new Set());

    const [pantrySet] = useState(() => new Set(pantry?.ingredients.map(ing => ing.ingredientId)));

    // Toggle function to update the selection state of individual checkboxes
    const toggle = useCallback((id: number, selected: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (selected) next.add(id);
            else next.delete(id);
            return next;
        });
    }, []);

    // Helpful Select All Button funcionality.
    // Adds all existing selected ids to new selections
    const selectMany = useCallback((ids: number[]) => {
        setSelectedIds((prev) => new Set([...prev, ...ids]));
    }, []);

    const clear = useCallback(() => setSelectedIds(new Set()), []);

    // Call recommendRecipes endpoint
    // Set status to loading to prevent extra button clicks
    // Set Error text on error, otherwise update current recipes
    async function findRecipes() {
        if (!selectedIds.size || status === "loading") return;

        const ids = [...selectedIds];
        setStatus("loading");
        const result = await RecommendRecipes(ids);

        if (!result.ok) {
            setError(result.error.message);
            setStatus("error");
            return;
        }
        setSearchedIds(new Set(ids));
        setRecipes(result.data);
        setStatus("done");
    }

    const loading = status === "loading";

    return (
        <div className="flex w-full flex-col gap-4">
            <IngredientPicker
                ingredients={ingredients}
                pantryIds={pantrySet}
                selectedIds={selectedIds}
                onToggle={toggle}
                onSelectMany={selectMany}
                onClear={clear}
            />

            <Button size="lg" className="w-full" onClick={findRecipes} disabled={!selectedIds.size || loading}>
                {loading && <Loader2 className="animate-spin" aria-hidden />}
                {loading ? "Finding recipes..." : `Find recipes (${selectedIds.size} selected)`}
            </Button>

            <section aria-live="polite" className="flex flex-col gap-3">
                {status !== "idle" && (
                    <div className="flex flex-wrap items-baseline gap-2">
                        <h2 className="text-lg font-semibold">Recommended recipes</h2>
                        {status === "done" && recipes.length > 0 && (
                            <span className="ml-auto text-sm text-muted-foreground">Sorted by best match</span>
                        )}
                    </div>
                )}

                {loading && (
                    <>
                        <Skeleton className="h-36 w-full rounded-xl" />
                        <Skeleton className="h-36 w-full rounded-xl" />
                    </>
                )}

                {status === "error" && <p role="alert" className="text-sm text-destructive">{error}</p>}

                {status === "done" && recipes.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No recipes use those ingredients yet. Try adding a few more.
                    </p>
                )}

                {status === "done" &&
                    recipes.map((recipe) => (
                        <RecommendedRecipeCard key={recipe.recipeId} recipe={recipe} ownedIds={searchedIds} />
                    ))}
            </section>
        </div>
    )
}