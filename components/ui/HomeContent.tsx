"use client"

import Link from "next/link"
import { useUser } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { IngredientPicker } from "@/components/ingredients/IngredientPicker"
import { RecipeCard } from "@/components/recipe/RecipeCard"
import { Ingredient, Recipe } from "@/utils/types"

export function HomeContent({
  ingredients,
  recipes,
}: {
  ingredients: Ingredient[]
  recipes: Recipe[]
}) {
  const { user } = useUser()

  // Logged-out homepage (no sidebar)
  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to ChefChoice
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Pick the ingredients in your kitchen and discover recipes you can make right now.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild className="bg-purple-700 hover:bg-purple-800 text-white">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Logged-in dashboard (with sidebar)
  return (
    <div className="flex-1 w-full font-sans dark:bg-black">
      <main className="w-full max-w-6xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
          <IngredientPicker ings={ingredients} />

          <div className="space-y-4 w-full">
            {recipes.map((recipe) => (
              <RecipeCard recipe={recipe} key={recipe.id} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
