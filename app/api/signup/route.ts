import { GenericHandler, confirmRoleLevel, sql } from "@/app/api/utils/_utils.js";
import { ApiError } from "@/utils/classes/response";
import { SaltyPass } from "@/app/api/utils/_passwords";
import { createSession } from "@lib/session";
import { ChefResponse } from "../utils/_utils.js";
import { RoleLevels, RoleString } from "@/serverConfig.js";

/**
 * User Schema
 * 
 * ID primary key
 * Email varchar(256) 
 * Name varchar(64)
 * Password varchar(64)
 * isDeleted boolean
 * Dateadded date? string?
 * datemodified/removed date? string? -- there's a type for postgres
 * Role int -- this or isAdmin/isOwner. not sure which is better
 * 
 */


const PROCESS = "User Signup";
export async function POST(req: Request) {
  return await GenericHandler(req, addUser, PROCESS);
}

async function addUser(req: Request, resp: ChefResponse) {
  const user = await req.json();

  var query =
    await sql`SELECT 1 FROM Users WHERE Email = ${user.email};`;

  if (!!query.length) throw new ApiError("Invalid Email. Please Try A Different One.", 400, "");

  const pass = SaltyPass(user.password);

  query =
    await sql`WITH Id AS (INSERT INTO Users (Username, Email, Password) VALUES (${user.username}, ${user.email}, ${pass}) RETURNING UserId) 
      SELECT UserId FROM Id;`;

  const id = query[0].userid
  await createSession({ id: id, username: user.username, role: RoleString.Basic});
  resp.setData({ username: user.username });
  return;
}
