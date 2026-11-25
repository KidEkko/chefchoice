"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Recipe } from "@/utils/types";
import { RecipeCard } from "./RecipeCard";

interface RecipesDisplayProps {
    recipes: Recipe[];
    currentPage: number;
    totalPages: number;
    totalRecipes: number;
    currentSort: string;
    currentDifficulty: string;
}

type SortOption = "newest" | "oldest" | "most_ingredients" | "fewest_ingredients" | "a-z";
type DifficultyFilter = "all" | "easy" | "medium" | "hard";

const SORT_LABELS: Record<SortOption, string> = {
    newest: "Newest First",
    oldest: "Oldest First",
    most_ingredients: "Most Ingredients",
    fewest_ingredients: "Fewest Ingredients",
    "a-z": "A-Z",
};

const DIFFICULTY_LABELS: Record<DifficultyFilter, string> = {
    all: "All Difficulties",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
};

export function RecipesDisplay({
    recipes,
    currentPage,
    totalPages,
    totalRecipes,
    currentSort,
    currentDifficulty,
}: RecipesDisplayProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "newest" || value === "all") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        // Reset to page 1 when changing filters
        params.delete("page");
        router.push(`/recipes?${params.toString()}`);
    };

    const buildPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page === 1) {
            params.delete("page");
        } else {
            params.set("page", page.toString());
        }
        return `/recipes?${params.toString()}`;
    };

    // Calculate page range for pagination
    const getPageRange = () => {
        const range: number[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            if (currentPage <= 3) {
                range.push(1, 2, 3, 4);
            } else if (currentPage >= totalPages - 2) {
                range.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                range.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }

        return range;
    };

    const pageRange = getPageRange();

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
            {/* Header with filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">All Recipes</h1>
                    <p className="text-sm text-muted-foreground">
                        {totalRecipes} {totalRecipes === 1 ? "recipe" : "recipes"} available
                    </p>
                </div>

                {/* Filter Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Filter className="size-4" />
                            Filter & Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                            value={currentSort}
                            onValueChange={(value) => updateFilter("sort", value)}
                        >
                            {Object.entries(SORT_LABELS).map(([value, label]) => (
                                <DropdownMenuRadioItem key={value} value={value}>
                                    {label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                            value={currentDifficulty}
                            onValueChange={(value) => updateFilter("difficulty", value)}
                        >
                            {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                                <DropdownMenuRadioItem key={value} value={value}>
                                    {label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* TODO: Add search box to filter recipes by name */}

            {/* Recipe Grid */}
            {recipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                    <p className="text-muted-foreground">No recipes found with current filters.</p>
                    <Button variant="outline" onClick={() => router.push("/recipes")}>
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.recipeId} recipe={recipe} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href={currentPage > 1 ? buildPageUrl(currentPage - 1) : "#"}
                                aria-disabled={currentPage === 1}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {currentPage > 3 && totalPages > 5 && (
                            <>
                                <PaginationItem>
                                    <PaginationLink href={buildPageUrl(1)}>1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            </>
                        )}

                        {pageRange.map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink href={buildPageUrl(page)} isActive={page === currentPage}>
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {currentPage < totalPages - 2 && totalPages > 5 && (
                            <>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href={buildPageUrl(totalPages)}>{totalPages}</PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        <PaginationItem>
                            <PaginationNext
                                href={currentPage < totalPages ? buildPageUrl(currentPage + 1) : "#"}
                                aria-disabled={currentPage === totalPages}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </main>
    );
}
