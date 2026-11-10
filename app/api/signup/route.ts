import { GenericHandler, ChefResponse } from "@/utils/api";   
import { createSession } from "@lib/session";
import { RoleString } from "@/serverConfig";
import { ApiError, User } from "@/utils/types";
import { sql, SaltyPass } from "@/utils";

const PROCESS = "User Signup";
export async function POST(req: Request) {
  return await GenericHandler(req, addUser, PROCESS);
}

async function addUser(req: Request, resp: ChefResponse) {
  const user = await req.json();

  // TODO: should we do something different if is_deleted is true? think about it
  var query =
    await sql`SELECT 1 FROM Users WHERE Email = ${user.email};`;
  if (!!query.length) throw new ApiError("Invalid Email. Please Try A Different One.", {status: 400});

  const pass = SaltyPass(user.password);

  query =
    await sql`INSERT INTO Users (Username, Email, Password) 
      VALUES (${user.username}, ${user.email}, ${pass}) RETURNING user_id`;

  const id = query[0].user_id;
  await createSession({ id: id, username: user.username, role: RoleString.Basic } as User);
  resp.setData({ username: user.username });
  return;
}
