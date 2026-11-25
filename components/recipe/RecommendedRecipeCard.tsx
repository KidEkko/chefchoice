"use client"

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronDown, ChevronUp, Clock, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { NormalString } from "@/utils/constants";
import { Ingredient, Recipe } from "@/utils/types";

interface RecommendedRecipeCardProps {
    recipe: Recipe;
    /** Ids of the ingredients the user searched with. Decides have vs. need. */
    ownedIds: ReadonlySet<number>;
}

// Each card owns its own open/closed state, so any number of cards can be open at once
export function RecommendedRecipeCard({ recipe, ownedIds }: RecommendedRecipeCardProps) {
    const [open, setOpen] = useState(false);
    const [stepsOpen, setStepsOpen] = useState(false);

    const { have, need, needCost, steps, totalMinutes } = useMemo(() => {
        const byName = (a: Ingredient, b: Ingredient) => a.name.localeCompare(b.name);
        const have = recipe.ingredients.filter((i) => ownedIds.has(i.ingredientId)).sort(byName);
        const need = recipe.ingredients.filter((i) => !ownedIds.has(i.ingredientId)).sort(byName);
        return {
            have,
            need,
            // Assumes `cost` is the price of this recipe line. Adjust if it is per base unit.
            needCost: need.reduce((sum, i) => sum + (i.cost ?? 0), 0),
            steps: recipe.instructions,
            totalMinutes: (recipe.prepMinutes ?? 0) + (recipe.cookMinutes ?? 0),
        };
    }, [recipe, ownedIds]);

    const total = recipe.ingredients.length;
    const percent = total ? Math.round((have.length / total) * 100) : 0;

    // Build URL with ingredient IDs so recipe page knows what user has
    const ingredientIds = Array.from(ownedIds).join(',');
    const href = `/recipes/${recipe.recipeId}${ingredientIds ? `?ingredientIds=${ingredientIds}` : ''}`;

    return (
        <Card>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CardHeader className="gap-3">
                    <div className="flex flex-wrap items-start gap-2">
                        <CardTitle className="text-base">
                            <Link href={href} className="inline-flex items-center gap-1.5 hover:underline">
                                {recipe.name}
                            </Link>
                        </CardTitle>
                        <Button asChild variant="outline" size="sm" className="ml-auto">
                            <Link href={href}>
                                View recipe <ArrowUpRight />
                            </Link>
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        <Progress value={percent} aria-label={`${have.length} of ${total} ingredients owned`} className="flex-1" />
                        <span className="text-sm text-muted-foreground">
                            {have.length} of {total} ingredients
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {have.map((ing) => (
                            <Badge key={ing.ingredientId} className="gap-1">
                                <Check aria-hidden /> {NormalString(ing.name)}
                                <span className="sr-only">(you have this)</span>
                            </Badge>
                        ))}
                        {need.map((ing) => (
                            <Badge key={ing.ingredientId} variant="outline" className="gap-1 border-dashed">
                                <Plus aria-hidden /> {NormalString(ing.name)}
                                <span className="sr-only">(you need this)</span>
                            </Badge>
                        ))}
                    </div>
                </CardHeader>

                <CollapsibleContent>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <IngredientList title="You have" items={have} emptyText="Nothing from your list is used here." />
                            <IngredientList title="You need" items={need} emptyText="You have everything!" showCost />
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            {needCost > 0 && <b>About ${needCost.toFixed(2)} to buy</b>}
                            {totalMinutes > 0 && (
                                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="size-4" aria-hidden /> {totalMinutes} min
                                </span>
                            )}
                            {recipe.servings && (
                                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                    <Users className="size-4" aria-hidden /> {recipe.servings} servings
                                </span>
                            )}
                            {recipe.difficulty && <Badge variant="secondary">{NormalString(recipe.difficulty)}</Badge>}
                        </div>

                        {steps.length > 0 && (
                            <Collapsible open={stepsOpen} onOpenChange={setStepsOpen} className="border-t">
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="min-h-11 w-full">
                                        {stepsOpen ? "Hide steps" : "Show steps"}
                                        {stepsOpen ? <ChevronUp /> : <ChevronDown />}
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <ol className="list-decimal space-y-2 pl-5 pt-2 text-sm text-muted-foreground">
                                        {steps.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ol>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </CardContent>
                </CollapsibleContent>

                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="mt-2 min-h-11 w-full rounded-none border-t">
                        {open ? "Hide details" : "Show details"}
                        {open ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                </CollapsibleTrigger>
            </Collapsible>
        </Card>
    )
}

interface IngredientListProps {
    title: string;
    items: Ingredient[];
    emptyText: string;
    showCost?: boolean;
}

function IngredientList({ title, items, emptyText, showCost }: IngredientListProps) {
    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium">{title}</h4>
            {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">{emptyText}</p>
            ) : (
                <ul className="space-y-1 text-sm">
                    {items.map((ing) => (
                        <li key={ing.ingredientId} className="flex gap-2">
                            <span>{NormalString(ing.name)}</span>
                            <span className="ml-auto text-muted-foreground">
                                {formatAmount(ing)}
                                {showCost && ing.cost ? ` · $${ing.cost}` : ""}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

function formatAmount(ing: Ingredient): string {
    if (ing.amount == null) return "";
    return `${ing.amount}${ing.unit ? ` ${ing.unit}` : ""}`;
}
