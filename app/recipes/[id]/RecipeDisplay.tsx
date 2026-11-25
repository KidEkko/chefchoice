"use client"

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, ExternalLink, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { NormalString } from "@/utils/constants";
import { Recipe, Ingredient } from "@/utils/types";
import { usePantry } from "@/components/providers";

interface RecipeDisplayProps {
    recipe: Recipe;
    userIngredientIds: number[];
}

export function RecipeDisplay({ recipe, userIngredientIds }: RecipeDisplayProps) {
    const { pantry } = usePantry();

    // Build set of ingredient IDs user has from either query params or pantry
    const pantryIngredientIds = useMemo(() => {
        const ids = new Set<number>();

        // Add from query params (from recommendation page)
        userIngredientIds.forEach(id => ids.add(id));

        // Add from user's saved pantry
        pantry?.ingredients.forEach(ing => {
            if (ing.ingredientId) ids.add(ing.ingredientId);
        });

        return ids;
    }, [userIngredientIds, pantry]);

    // Local state for checkbox toggles (doesn't persist to database)
    const [localHasIngredient, setLocalHasIngredient] = useState<Record<number, boolean>>(() => {
        const initial: Record<number, boolean> = {};
        recipe.ingredients.forEach(ing => {
            if (ing.ingredientId) {
                initial[ing.ingredientId] = pantryIngredientIds.has(ing.ingredientId);
            }
        });
        return initial;
    });

    // Calculate costs
    const { totalCost, adjustedCost, savedCost } = useMemo(() => {
        let total = 0;
        let adjusted = 0;

        recipe.ingredients.forEach(ing => {
            const cost = ing.cost || 0;
            total += cost;

            const hasIt = ing.ingredientId ? localHasIngredient[ing.ingredientId] : false;
            if (!hasIt) {
                adjusted += cost;
            }
        });

        return {
            totalCost: total,
            adjustedCost: adjusted,
            savedCost: total - adjusted
        };
    }, [recipe.ingredients, localHasIngredient]);

    const toggleIngredient = (ingredientId: number) => {
        setLocalHasIngredient(prev => ({
            ...prev,
            [ingredientId]: !prev[ingredientId]
        }));
    };

    const totalMinutes = (recipe.prepMinutes || 0) + (recipe.cookMinutes || 0);

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">{recipe.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>By {recipe.createdBy}</span>
                    {totalMinutes > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-4" aria-hidden /> {totalMinutes} min
                        </span>
                    )}
                    {recipe.servings && (
                        <span className="inline-flex items-center gap-1.5">
                            <Users className="size-4" aria-hidden /> {recipe.servings} servings
                        </span>
                    )}
                    {recipe.difficulty && <Badge variant="secondary">{NormalString(recipe.difficulty)}</Badge>}
                </div>
            </div>

            {/* Ingredients Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Ingredients</CardTitle>
                        <div className="text-sm">
                            <span className={totalCost === adjustedCost ? "" : "line-through text-muted-foreground"}>
                                ~${totalCost.toFixed(2)}
                            </span>
                            {totalCost !== adjustedCost && (
                                <span className="ml-2 font-semibold">~${adjustedCost.toFixed(2)}</span>
                            )}
                        </div>
                    </div>
                    {savedCost > 0 && (
                        <p className="text-xs text-muted-foreground">
                            You have {Object.values(localHasIngredient).filter(Boolean).length} ingredients
                            (saves ~${savedCost.toFixed(2)})
                        </p>
                    )}
                </CardHeader>
                <CardContent>
                    {/* TODO: Verify that ingredient Notes display correctly */}
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ing, idx) => {
                            const hasIt = ing.ingredientId ? localHasIngredient[ing.ingredientId] : false;
                            const checkboxId = `ingredient-${ing.ingredientId || idx}`;

                            return (
                                <li key={ing.ingredientId || idx} className="flex items-start gap-3">
                                    {ing.ingredientId && (
                                        <Checkbox
                                            id={checkboxId}
                                            checked={hasIt}
                                            onCheckedChange={() => toggleIngredient(ing.ingredientId!)}
                                            className="mt-1"
                                        />
                                    )}
                                    <Label
                                        htmlFor={checkboxId}
                                        className={`flex flex-1 cursor-pointer flex-col ${
                                            hasIt ? "text-muted-foreground" : ""
                                        }`}
                                    >
                                        <div className="flex items-baseline justify-between gap-2">
                                            <span className={hasIt ? "line-through" : ""}>
                                                {formatAmount(ing)} {NormalString(ing.name)}
                                                {ing.note && <span className="text-xs"> ({ing.note})</span>}
                                            </span>
                                            {ing.cost && (
                                                <span className={`text-sm ${hasIt ? "line-through" : ""}`}>
                                                    ${ing.cost.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </Label>
                                </li>
                            );
                        })}
                    </ul>
                </CardContent>
            </Card>

            {/* Instructions Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    {recipe.instructions && recipe.instructions.length > 0 ? (
                        <ol className="list-decimal space-y-3 pl-5">
                            {recipe.instructions.map((step, i) => (
                                <li key={i} className="text-sm leading-relaxed">
                                    {step}
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-sm text-muted-foreground">No instructions provided.</p>
                    )}
                </CardContent>
            </Card>

            {/* Source Link */}
            {recipe.sourceUrl && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                    <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                        View Original Recipe <ExternalLink className="size-4" />
                    </a>
                </Button>
            )}
        </main>
    );
}

function formatAmount(ing: Ingredient): string {
    if (ing.amount == null) return "";
    return `${ing.amount}${ing.unit ? ` ${ing.unit}` : ""}`;
}
