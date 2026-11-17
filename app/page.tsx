import { IngredientPicker } from "@/components/ingredients/IngredientPicker";
import { PantryItemRow } from "@/components/ingredients/PantryItemRow";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { sql } from "@/utils";
import { testRecipes } from "@/utils/testData";
import { Ingredient, IngredientRow, IngredientRowsToIngredient } from "@/utils/types";

/**
 * 
 * implement the following hook for client components
 * 
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ["recipes", category],
  queryFn: ({ pageParam }) => getRecipes({ category, cursor: pageParam }),
  initialPageParam: null as number | null,
  getNextPageParam: (last) => last.nextCursor,   // null stops it
});
 */



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
    <div className="flex flex-col flex-1 items-center justify-center font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="flex flex-row max-w-5xl mx-auto space-x-5">
          <IngredientPicker ings={ingredients} />
          <div className="space-y-2"> 
            {testRecipes.map((recipe) => {
              return <RecipeCard recipe={recipe} key={recipe.id}/>
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

// Server Component Query to retrieve Ingredients from DB
// Ingredients table is intended to be lightweight, making fetches on the whole table inexpensive
async function GetIngredients(): Promise<Ingredient[]> {
  const query = (await sql`SELECT * FROM Ingredients i`) as IngredientRow[];
  return IngredientRowsToIngredient(query)
}
