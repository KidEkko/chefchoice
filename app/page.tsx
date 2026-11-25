import { sql } from "@/utils";
import { Ingredient, IngredientRow, IngredientRowsToIngredient } from "@/utils/types";
import { cacheLife } from "next/cache";
import { PantryRecommender } from "@/components/pantry/PantryRecommender"; 

/**
 * Base page requirements:
 *  primary component with options for uploading ingredients. 
 *    CSV, select from a pre-provided list, general text input
 *    For CSV
 *       csv should be ingredient name
 *       amount should be an expected input, but for now don't do anything with it.
 *    For pre-provided list
 *       this will be a list of ingredients we currently have in our database. 
 *       for now, create some Ingredient array in the page that you add to the list component. I'll create logic for getting these ingredients
 *    For general text input
 *       expect some form of formatted input. Show the user that input in the placeholder text
 *       write a function that parses line by line. should be simple
 *       this is more luxury than the other two
 * 
 * All of the options should result in an array of ingredients that will be displayed in a list component
 * List component requirements:
 *  receives an array of ingredients.
 *  if no ingredients are currently received, it can either be invisible or it can be a skeleton
 *  display ingredient name and unit amount. each list item should have a delete button that removes it from the current list
 *  Luxury idea: (implement if there's time)
 *    use a basic stack structure to retain deleted ingredients. (when deleting, add to the stack. can just be an array but make sure you're pulling from the same spot you're inserting new items)
 *    there should be an undo button utilizing the stack structure. likely in upper right or left of the list component
 *  Another Luxury idea:
 *    find a way to prioritize different ingredients in the list
 *    this might not actually be part of the component.
 * 
 * Button that finds recipes
 * Requirements
 *   not many requirements for this. Really just a button that calls a placeholder function yet to be implemented
 *   add a feature that shows there's loading. can be in the button or somewhere else visible on the page.
 *   button should not be clickable while loading
 * 
 * Recipe display component
 *  same as the list. invisible or skeleton while no recipes currently are in it
 *  receives an array of recipes to display
 *  should utilize a generic recipe card that can also be used on the recipe page
 *  Luxury feature:
 *    cards include tags for matching ingredients
 *  
 */


export default async function Home() {
  const ingredients = await GetIngredients();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Chef Choice</h1>
        <p className="text-muted-foreground">Pick what you have, and we&apos;ll choose what&apos;s for dinner.</p>
      </div>
      <PantryRecommender ingredients={ingredients} />
    </main>
  );
}

// Server Component Query to retrieve Ingredients from DB
// Ingredients table is intended to be lightweight, making fetches on the whole table inexpensive
async function GetIngredients(): Promise<Ingredient[]> {
  'use cache'
  cacheLife('hours')
  
  try {
    const query = (await sql`SELECT * FROM ingredients `) as IngredientRow[];
    return IngredientRowsToIngredient(query);
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}
