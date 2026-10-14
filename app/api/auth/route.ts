import { ChefResponse, GenericHandler, confirmRoleLevel, sql } from "@/app/api/utils/_utils";
import { checkPassword } from "@/app/api/utils/_passwords";
import { createSession } from "@lib/session";
import { RoleLevels, RoleString } from "@/serverConfig";
import { SqlResponse, ApiError } from "@/utils/classes/response";
import { User } from "@/utils/classes/user";

const PROCESS = "Authentication";
export async function POST(req: Request) {
  return await GenericHandler(req, logInCheck, PROCESS);
}

/*
    need to finish vercel integration
    buy a new domain and then set it up to deploy off my github
    apply the vercel env variables to the repository and tell groupmates how to do this
*/

// TODO: update createSessions to use User type
async function logInCheck(req: Request, resp: ChefResponse) {
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
