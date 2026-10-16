import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils";
import { checkPassword } from "@/app/api/utils/_passwords";
import { createSession, verifySession } from "@lib/session";
import { RoleLevels, RoleString } from "@/serverConfig";
import { SqlResponse, ApiError } from "@/utils/classes/response";
import { User } from "@/utils/classes/user";

/*
    Recipe Schema

    components of a recipe
    ingredients: array of ingredients. these will go in a separate schema
    instructions: array of strings
        should probably be its own table as well?
    picture: image file hosted in blob or some other server. images shouldn't be stored in public due to processing
        maybe don't need to store anything here actually. pull from the blob based on the recipe id.
        when a user loads a page with a recipe, we're going to be querying our DB for recipes. IDs returned can be used to pull from the blob
        unsure whether I would be calling the blob from here or on the front end.. probably here. would be asynchronous while also performing sql queries. 
        can await the result before returning
    description: string (unsure if desirable for us to have)
    name: string
    nutrition facts: array of nutrition
    Date added: date? (string or number or something)
    Date modified: date? ^^^^^
    isRemoved: boolean

    
    Ingredient schema
    
    ID primary key
    int quantity of ingredient
    string name of ingredient


    Recipe to Ingredients Junction table Schema

    Ingredient primary ID key
    Recipe primary ID key
    quantity int
    notes string
    unit string?

    

    when a user loads the page to create a recipe, we perform a query to pull all existing ingredients?
        ... that sounds way too expensive, but i also don't know how we would load those
        obviously caching the result would be the most sensible. In a popular recipe page, this cache would almost never expire
        but for our website, what's the best way to do this?
        definitely an AI question


      
    Rating Schema
      table where ratings of individual recips will be scored. We can maybe use a default value for unrated recipes
      but for this, we're going to store ratings, which users rated them
      A rollup table can be used to store the total rating of all recipes so we don't have to waste time running the calculation when a user loads a page
      ratings would be cached
    
    ID key probably not necessary
    RecipeID key from recipe table
    Rating int 1-5 limitation
    UserID key from user table for the user that rated. the recipeid to userid should be unique
    DateAdded date

    Comments aren't going to be the same thing
    
*/

const PROCESS = "Get Recipe";
export async function GET(req: Request) {
  return await GenericHandler(req, getRecipe, PROCESS);
} 

async function getRecipe(req: Request, resp: ChefResponse) {
  const recipe = await req.json();

  // TODO: It might be a good idea to generalize this?
  // IDK it's cheap in terms of line cost and it might be more effort than it's worth.
  const session = await verifySession();
  if (!session) 
      throw new ApiError("", 400, "")
  
  
  // TODO: update error message
  // REAL TODO: Update the ApiError system in general. Simple is fine for personal website, but this new version should have something else.
  // Should still be a global error type, but might have to duplicate in backend and frontend. Can just be more detailed in backend?
  // Also man do I need that third string or what. Another part of TS I'm not fully used to getting around
  if (!recipe) {
    throw new ApiError("No recipe provided", 401, "")
  }

  /*
    what do we want from the recipe here? we're going to want instructions, the picture (fetch from blob which I still need to set up)
    its current rating from the rollup table (implement later)
    ingredient list and quantity. probably another selection. We can probably group that into a single query but idk
    get the username of the user that uploaded the recipe. Should that be unique? meh, probably doesn't matter

    So select from recipe join the username from users
    possible second selection from Recipe_to_ingredients for all ingredients, quantity and other such stuff
  */
  const query =
    await sql`SELECT Userid, Username, Password, Role, TrialExpiration AS Exp FROM Users WHERE RecipeId = ${recipe.id};`;

  if (!query.length) throw new ApiError("No Recipe Found", 400, "");
  const recipeInfo = query[0];



  
  return;
}
