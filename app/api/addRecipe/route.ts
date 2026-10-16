import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils";
import { checkPassword } from "@/app/api/utils/_passwords";
import { createSession, verifySession } from "@lib/session";
import { RoleLevels, RoleString } from "@/serverConfig";
import { SqlResponse, ApiError } from "@/utils/classes/response";
import { User } from "@/utils/classes/user";

const PROCESS = "Add Recipe";
export async function POST(req: Request) {
  return await GenericHandler(req, addRecipe, PROCESS);
}

/*
    Meal Prep Schema

    ... what the fuck goes in this?
    how are we relating this to code
    A meal prep is essentially a multidimensional array
    First layer would be the date that the prep is for
    second layer would be what time of day
    third layer would be the meal they're eating
    could include nutritional facts. those will either be a separate query... should probably be computed when the meal prep is created
        sounds like a thing to be done on the front end. actually it has to be front end because the whole point is for the user to know 
        what they're eating in the first place
    
    so where does that leave the schema?
        columns from above would be 
            DateFor column, 
            Mealtype column
                breakfast, lunch, dinner, and some optional category
                could also just be a time, and we have some code that associates the time with breakfast, lunch, dinner, snack, or alternative meal based on how close it is
                    to standard eating times
                the user could also label what type it is
                ACTUALLY: instead, when the user is creating the meal prep or our code is, we assign standard labels, and we allow the user to edit them.
                for the meal, we're just storing a string. make sure to limit the character length, we don't want this to mess up the look of a component
            TimeofDay column
                similar to above, something we generate in code that the user can alter. schema will just store the date
            

    ID primary key -- necessary? probably not
    UserId primary key from user schema. easy to filter based on the user
    Meal - primary key from recipe schema to identify what will be eaten at this meal
    DateFor - date. name isn't ideal, change it
    Mealtype - string. describes what the meal is meant to be (breakfast, lunch, dinner, snack, user-defined name)
    Time - date or time. describes what time the meal is meant to be eaten.
        in a super in depth version of the website, users could have a scheduling calendar similar to google.
        in our version, this will just be a string shown on a calendar and on a component when the user selects a specific date
    DateAdded - not sure if this is necessary for this. do we care when they add a meal? not really.
        same goes for datemodified 
        if the user decides to update a meal prep, though, what do we do?
        we can modify the row, but what if they remove a meal?
        probably need isDeleted
    isDeleted - boolean
    


*/

// TODO: update createSessions to use User type
/**
 * 
 * verify session to ensure a user is doing this and get their Id
 * pull recipe information from the request variable
 * insert into recipe table
 * insert ingredients in a transaction
 * 
 */
async function addRecipe(req: Request, resp: ChefResponse) {
  const session = await verifySession();
  if (!session) 
      throw new ApiError("", 400, "")

  const recipe = await req.json();
  var query =
    await sql`INSERT INTO Recipes (name, user_id, instructions) VALUES (${recipe.name}, ${session.id}, ${recipe.instructions});`;

  // Map all ingredients to a single comma-separated string for big insertion
  const ingredients = recipe.ingredients.map((name: string) => name.trim().toLowerCase())

  // On Conflict prevents issues where a known ingredient is inserted, but still allows the id and name to be returned
  // TODO: confirm that this works as intended in terms of the return
  const rows = await sql`INSERT INTO Ingredients (name) 
    SELECT unnest(${ingredients}::text[]) 
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING ingredient_id, name`

  const idByName = new Map<string, number>(rows.map((r) => [r.name, r.ingredient_id]));

  // TODO: need to do a map of information from recipe variable about each ingredient to the id and use that for this insertion
  await sql`INSERT INTO Recipe_to_ingredients`

  return;
}
