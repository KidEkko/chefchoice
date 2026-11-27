import { ChefResponse, GenericHandler } from "@/utils/api/response";
import { verifySession } from "@lib/session";  
import { ApiError, User, UserAuthRow } from "@/utils/types";
import { ErrorMessages } from "@/serverConfig";
import { sql, checkPassword } from "@/utils";

const PROCESS = "Update User";
export async function POST(req: Request) {
  return await GenericHandler(req, updateUser, PROCESS);
}

async function updateUser(req: Request, resp: ChefResponse) {
    const session = await verifySession();
    if (!session)
        throw new ApiError(ErrorMessages.Auth.INVALID_SESSION, { status: 400 })

    const { username, email, currentPassword } = await req.json() as { username: string, email: string, currentPassword: string };

    // Get current user info
    const query =
    (await sql`SELECT user_id, username, email, password FROM users WHERE user_id = ${session.id}`) as UserAuthRow[];

    if (!query.length) throw new ApiError(ErrorMessages.Auth.INVALID_CREDENTIALS, { status: 400 });
    const userInfo = query[0];

    // Verify current password
    checkPassword(currentPassword, userInfo.password);

    // Check if email is already taken by another user
    if (email !== userInfo.email) {
        const emailCheck = await sql`SELECT user_id FROM users WHERE email = ${email} AND user_id != ${session.id}`;
        if (emailCheck.length > 0) {
            throw new ApiError(ErrorMessages.Auth.EMAIL_IN_USE, { status: 400 });
        }
    }

    // Update user
    await sql`
        UPDATE users
        SET username = ${username}, email = ${email}
        WHERE user_id = ${session.id}
    `;

    resp.setData({ username, email });
    return;
}
