import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils";
import { verifySession } from "@/lib/session";
import { ErrorMessages } from "@/serverConfig";
import { ApiError } from "@/utils/types";


const PROCESS = "Get Meal Prep";
export async function GET(req: Request) {
  return await GenericHandler(req, getMealPrep, PROCESS);
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

async function getMealPrep(req: Request, resp: ChefResponse) {
  const recipe = await req.json();

  const session = await verifySession();
  if (!session)
    throw new ApiError(ErrorMessages.INVALID_SESSION_ERROR, {status: 400})





  return;
}
