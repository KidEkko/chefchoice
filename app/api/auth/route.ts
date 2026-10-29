import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils";
import { checkPassword } from "@/app/api/utils/_passwords";
import { createSession } from "@lib/session";
import { ApiError } from "@/utils/types";
import { UserAuthRow, UserAuthRowToUser } from "../utils/db";
import { ErrorMessages } from "@/serverConfig";

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
    (await sql`SELECT User_id, Username, Password, Is_Admin FROM Users WHERE Email = ${user.email};`) as UserAuthRow[];

  if (!query.length) throw new ApiError(ErrorMessages.INVALID_EMAIL_PASSWORD_ERROR, { status: 400 });
  const userInfo = query[0];

  checkPassword(user.password, userInfo.password);

  const response = { username: userInfo.username },
    session = UserAuthRowToUser(userInfo);

  await createSession(session);

  resp.setData(response);
  return;
}
