"use client"

import { useMemo } from "react";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NormalString } from "@/utils/constants";
import { Recipe, Ingredient } from "@/utils/types";
import { usePantry } from "@/components/providers";

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    const { pantry } = usePantry();

    // Build set of ingredient IDs user has from pantry
    const pantryIngredientIds = useMemo(() => {
        const ids = new Set<number>();
        pantry?.ingredients.forEach(ing => {
            if (ing.ingredientId) ids.add(ing.ingredientId);
        });
        return ids;
    }, [pantry]);

    // Calculate what user has vs needs
    const { have, need } = useMemo(() => {
        const byName = (a: Ingredient, b: Ingredient) => a.name.localeCompare(b.name);
        const have = recipe.ingredients.filter((i) => i.ingredientId && pantryIngredientIds.has(i.ingredientId)).sort(byName);
        const need = recipe.ingredients.filter((i) => !i.ingredientId || !pantryIngredientIds.has(i.ingredientId)).sort(byName);
        return { have, need };
    }, [recipe.ingredients, pantryIngredientIds]);

    const total = recipe.ingredients.length;
    const percent = total ? Math.round((have.length / total) * 100) : 0;
    const totalMinutes = (recipe.prepMinutes || 0) + (recipe.cookMinutes || 0);

    // Build URL with ingredient IDs from pantry
    const ingredientIds = Array.from(pantryIngredientIds).join(',');
    const href = `/recipes/${recipe.recipeId}${ingredientIds ? `?ingredientIds=${ingredientIds}` : ''}`;

    return (
        <Link href={href} className="group block">
            <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader className="gap-3">
                    <CardTitle className="text-lg group-hover:underline">{recipe.name}</CardTitle>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>By {recipe.createdBy}</span>
                        {totalMinutes > 0 && (
                            <span className="inline-flex items-center gap-1">
                                <Clock className="size-3" aria-hidden /> {totalMinutes} min
                            </span>
                        )}
                        {recipe.servings && (
                            <span className="inline-flex items-center gap-1">
                                <Users className="size-3" aria-hidden /> {recipe.servings}
                            </span>
                        )}
                        {recipe.difficulty && (
                            <Badge variant="secondary" className="text-xs">
                                {NormalString(recipe.difficulty)}
                            </Badge>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                        <Progress
                            value={percent}
                            aria-label={`${have.length} of ${total} ingredients owned`}
                            className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground">
                            {have.length}/{total}
                        </span>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Ingredient Chips */}
                    <div className="flex flex-wrap gap-1.5">
                        {have.slice(0, 4).map((ing) => (
                            <Badge key={ing.ingredientId} variant="default" className="text-xs">
                                {NormalString(ing.name)}
                            </Badge>
                        ))}
                        {have.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                                +{have.length - 4} more
                            </Badge>
                        )}
                        {need.slice(0, 3).map((ing) => (
                            <Badge key={ing.ingredientId} variant="outline" className="text-xs border-dashed">
                                {NormalString(ing.name)}
                            </Badge>
                        ))}
                        {need.length > 3 && (
                            <Badge variant="outline" className="text-xs border-dashed">
                                +{need.length - 3} more
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
