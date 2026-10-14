import { ChefResponse, GenericHandler, confirmRoleLevel, sql } from "@/app/api/utils/_utils";
import { checkPassword } from "@/app/api/utils/_passwords";
import { createSession } from "@lib/session";
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
    
*/

const PROCESS = "Get Recipe";
export async function GET(req: Request) {
  return await GenericHandler(req, getRecipe, PROCESS);
}

// TODO: update createSessions to use User type
async function getRecipe(req: Request, resp: ChefResponse) {
  const user = await req.json();
  const query =
    await sql`SELECT Userid, Username, Password, Role, TrialExpiration AS Exp FROM Users WHERE Email = ${user.email};`;

  if (!query.length) throw new ApiError("Incorrect email/password", 400, "");
  const userInfo = query[0];

  checkPassword(user.password, userInfo.password);

  // TODO: verify that pulling trial expiration can be compared to current date
  const response = { username: userInfo.username },
    session = new User(userInfo.userid, userInfo.username, confirmRoleLevel(userInfo.role)) ;


  await createSession(session);
  

  resp.setData(response);
  return;
}
