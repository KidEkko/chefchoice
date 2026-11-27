import { GenericHandler, ChefResponse } from "@/utils/api";
import { createSession } from "@lib/session";
import { ErrorMessages } from "@/serverConfig";
import { ApiError, User } from "@/utils/types";
import { sql, SaltyPass } from "@/utils";

const PROCESS = "User Signup";
export async function POST(req: Request) {
  return await GenericHandler(req, addUser, PROCESS);
}

async function addUser(req: Request, resp: ChefResponse) {
  const user = await req.json();

  // Check if email is already in use (excluding deleted accounts)
  var query =
    await sql`SELECT 1 FROM users WHERE email = ${user.email} AND NOT is_deleted;`;
  if (!!query.length) throw new ApiError(ErrorMessages.Auth.EMAIL_IN_USE, {status: 409});

  // Validate username format
  if (!user.username || user.username.length < 4) {
    throw new ApiError(ErrorMessages.Validation.USERNAME_TOO_SHORT, {status: 400});
  }
  if (!/^[a-zA-Z0-9]+$/.test(user.username)) {
    throw new ApiError(ErrorMessages.Validation.USERNAME_INVALID_FORMAT, {status: 400});
  }

  // Validate password length server-side
  if (!user.password || user.password.length < 8) {
    throw new ApiError(ErrorMessages.Validation.PASSWORD_TOO_SHORT, {status: 400});
  }

  const pass = SaltyPass(user.password);

  query =
    await sql`INSERT INTO users (username, email, password)
      VALUES (${user.username}, ${user.email}, ${pass}) RETURNING user_id`;

  if (!query.length) throw new ApiError(ErrorMessages.Auth.ACCOUNT_CREATION_FAILED, {status: 500});

  const newUser = query[0];
  const sessionUser = {
    id: newUser.user_id,
    username: user.username,
    email: user.email
  } as User;

  await createSession(sessionUser);

  // Return safe user object without password
  resp.setData({
    id: newUser.user_id,
    username: user.username,
    email: user.email
  });
  return;
}
