import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils";
import { checkPassword } from "@/app/api/utils/_passwords";
import { createSession } from "@lib/session";
import {  ApiError } from "@/utils/classes/response";
import { User } from "@/utils/classes/user";
import { GetRoleString } from "@/serverConfig";

const PROCESS = "Authentication";
export async function POST(req: Request) {
  return await GenericHandler(req, logInCheck, PROCESS);
}

/*
    need to finish vercel integration
    buy a new domain and then set it up to deploy off my github
    apply the vercel env variables to the repository and tell groupmates how to do this

    we can say that the generic handler function was created because I was getting tired of writing try/catches in all of our routes

    had a moment where I had to add typing to the Maps in Serverconfig to allow map references to 
*/

// TODO: update createSessions to use User type
async function logInCheck(req: Request, resp: ChefResponse) {
  const user = await req.json();
  const query =
    await sql`SELECT Userid, Username, Password, Role, TrialExpiration AS Exp FROM Users WHERE Email = ${user.email};`;

  if (!query.length) throw new ApiError("Incorrect email/password", 400, "");
  const userInfo = query[0];

  checkPassword(user.password, userInfo.password);

  const response = { username: userInfo.username },
    session = new User(userInfo.userid, userInfo.username, GetRoleString(userInfo.role)) ;


  await createSession(session);
  

  resp.setData(response);
  return;
}
