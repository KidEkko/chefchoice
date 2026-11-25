"use client"

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { NormalString } from "@/utils/constants";
import { Ingredient } from "@/utils/types";
import { Label } from "../ui/label";

interface IngredientPickerProps {
    ingredients: Ingredient[];
    /** Ids of ingredients in the user's saved pantry. They get their own section. */
    pantryIds: ReadonlySet<number>;
    selectedIds: ReadonlySet<number>;
    onToggle: (id: number, selected: boolean) => void;
    /** Select every ingredient in the list that is currently visible (respects the search box). */
    onSelectMany: (ids: number[]) => void;
    onClear: () => void;
}

// Fully controlled: the parent owns the selection so the recommend button and results can use it.
export function IngredientPicker({ ingredients, pantryIds, selectedIds, onToggle, onSelectMany, onClear }: IngredientPickerProps) {
    const [query, setQuery] = useState("");

    const { pantry, others } = useMemo(() => {
        const q = query.trim().toLowerCase();
        const visible = ingredients
            .filter((ing) => !q || ing.name.toLowerCase().includes(q))
            .sort((a, b) => a.name.localeCompare(b.name));
        return {
            pantry: visible.filter((ing) => pantryIds.has(ing.ingredientId)),
            others: visible.filter((ing) => !pantryIds.has(ing.ingredientId)),
        };
    }, [ingredients, pantryIds, query]);

    const visibleIds = [...pantry, ...others].map((ing) => ing.ingredientId);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-lg">What&apos;s in your kitchen?</CardTitle>
                    <Badge variant="secondary" aria-live="polite">{selectedIds.size} selected</Badge>
                    <div className="ml-auto flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onSelectMany(visibleIds)} disabled={!visibleIds.length}>
                            Select all
                        </Button>
                        <Button variant="outline" size="sm" onClick={onClear} disabled={!selectedIds.size}>
                            Clear
                        </Button>
                    </div>
                </div>
                <CardDescription>
                    Tell Chef Choice what you have on hand and we&apos;ll pick the dishes you can make tonight.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search ingredients"
                    aria-label="Search ingredients"
                />
                <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
                    {pantry.length > 0 && (
                        <IngredientSection title="Your pantry" ingredients={pantry} selectedIds={selectedIds} onToggle={onToggle} />
                    )}
                    <IngredientSection
                        title="All ingredients"
                        ingredients={others}
                        selectedIds={selectedIds}
                        onToggle={onToggle}
                        muted
                    />
                    {!visibleIds.length && (
                        <p className="text-sm text-muted-foreground">No ingredients match &quot;{query}&quot;.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

interface SectionProps {
    title: string;
    ingredients: Ingredient[];
    selectedIds: ReadonlySet<number>;
    onToggle: (id: number, selected: boolean) => void;
    muted?: boolean;
}

function IngredientSection({ title, ingredients, selectedIds, onToggle, muted }: SectionProps) {
    if (!ingredients.length) return null;

    return (
        <section aria-label={title} className="space-y-1">
            <h3 className={muted ? "text-sm font-medium text-muted-foreground" : "text-sm font-medium"}>
                {title} · {ingredients.length}
            </h3>
            <ul className="space-y-1">
                {ingredients.map((ing) => (
                    <IngredientRow
                        key={ing.ingredientId}
                        ingredient={ing}
                        selected={selectedIds.has(ing.ingredientId)}
                        onToggle={onToggle}
                    />
                ))}
            </ul>
        </section>
    )
}

interface RowProps {
    ingredient: Ingredient;
    selected: boolean;
    onToggle: (id: number, selected: boolean) => void;
}

function IngredientRow({ ingredient, selected, onToggle }: RowProps) {
    const id = `ingredient-${ingredient.ingredientId}`;

    return (
        <li>
            {/* The whole row is the label, so the click target is at least as tall as the row */}
            <Label
                htmlFor={id}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 text-sm transition-colors ${
                    selected ? "border-border bg-accent font-semibold text-accent-foreground" : "border-transparent hover:bg-accent/50"
                }`}
            >
                <Checkbox
                    id={id}
                    checked={selected}
                    onCheckedChange={(checked) => onToggle(ingredient.ingredientId, checked === true)}
                />
                {NormalString(ingredient.name)}
            </Label>
        </li>
    )
}