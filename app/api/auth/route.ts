import { ChefResponse, GenericHandler } from "@/utils/api"; 
import { createSession } from "@lib/session";
import { ApiError, UserAuthRow, UserAuthRowToUser } from "@/utils/types"; 
import { ErrorMessages } from "@/serverConfig";
import { sql, checkPassword } from "@/utils"; 

const PROCESS = "Authentication";
export async function POST(req: Request) {
  return await GenericHandler(req, logInCheck, PROCESS);
}

/*
    we can say that the generic handler function was created because I was getting tired of writing try/catches in all of our routes

    had a moment where I had to add typing to the Maps in Serverconfig to allow map references to 

    started using interfaces for DB row returns with factories that transform them into their intended object. makes code cleaner while also being secure.
*/

async function logInCheck(req: Request, resp: ChefResponse) {
  const user = await req.json();
  const query =
    (await sql`SELECT User_id, username, password, email FROM Users WHERE Email = ${user.email} AND NOT is_deleted;`) as UserAuthRow[];

  if (!query.length) throw new ApiError(ErrorMessages.Auth.INVALID_CREDENTIALS, { status: 401 });
  const userInfo = query[0];

  checkPassword(user.password, userInfo.password);

  // Create session with full user info (including password for session)
  const session = UserAuthRowToUser(userInfo);
  await createSession(session);

  // Return safe user object without password
  const response = {
    id: userInfo.user_id,
    username: userInfo.username,
    email: userInfo.email
  };

  resp.setData(response);
  return;
}
