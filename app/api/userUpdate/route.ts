import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils";
import { checkPassword } from "@/app/api/utils/_passwords";
import { verifySession } from "@lib/session"; 
import { UserAuthRow } from "../utils/db/user";
import { ApiError, User } from "@/utils/types";
import { ErrorMessages } from "@/serverConfig";

const PROCESS = "Update User";
export async function POST(req: Request) {
  return await GenericHandler(req, updateUser, PROCESS);
}

/**
 * Currently unsure about whether this even needs to be an endpoint. 
 * I have a lot in api/utils that makes having it as an endpoint make sense, but I could shift some things out and server components could just access it anyway
 * Learning more about server/client components would go a long way towards improving my understanding of this
 * 
 * Things to do now
 * this file is in a comfortable spot now
 * 
 * what else do I need to do?
 *    Add remainign planned routes
 *    create the endpoints
 *    create hooks and/or providers that can be used in the front end
 *    figure out how to get environment variables for group members. I could just share the file with them, but I want to look into the ideal way to handle this
 *    look into linting so that I stop getting annoyed by the random decision between space and tab
 *    confirm that the return types for "add something" POSTs are correct and whether I need them at all for somethig like recipe
 *   
 * Once I finish these, I believe that I can start giving thought to other features and how they would look
 * I can consider things like nextauth and how they would look
 * linting is one of those things
 */

async function updateUser(req: Request, resp: ChefResponse) {
    const session = await verifySession();
    if (!session)
        throw new ApiError(ErrorMessages.INVALID_SESSION_ERROR, { status: 400 })

    const user = await req.json() as User;
    const query =
    (await sql`SELECT User_id, Username, Password FROM Users WHERE Email = ${user.email};`) as UserAuthRow[];

    if (!query.length) throw new ApiError(ErrorMessages.INVALID_EMAIL_PASSWORD_ERROR, { status: 400 });
    const userInfo = query[0];

    checkPassword(user.password, userInfo.password);


    resp.setData(null);
    return;
}
