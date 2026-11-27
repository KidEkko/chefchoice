"use server"

import { sql, checkPassword, SaltyPass } from "@/utils";
import { verifySession, updateSession } from "@/lib/session";
import { UserAuthRow } from "@/utils/types";
import { revalidatePath } from "next/cache";

// TODO: should these be actions or in an endpoint?
export async function updateUserProfile(formData: FormData) {
  try {
    // Verify user is logged in
    const session = await verifySession(true);
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Get form data
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const currentPassword = formData.get("currentPassword") as string;

    if (!username || !email || !currentPassword) {
      return { success: false, error: "All fields are required" };
    }

    // Verify current password
    const userQuery = (await sql`
      SELECT user_id, username, email, password
      FROM users
      WHERE user_id = ${session.id}
    `) as UserAuthRow[];

    if (!userQuery.length) {
      return { success: false, error: "User not found" };
    }

    const user = userQuery[0];

    // Check password
    try {
      checkPassword(currentPassword, user.password);
    } catch (err) {
      return { success: false, error: "Incorrect password" };
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const emailCheck = await sql`
        SELECT user_id FROM users WHERE email = ${email} AND user_id != ${session.id}
      `;
      if (emailCheck.length > 0) {
        return { success: false, error: "Email is already in use" };
      }
    }

    // Update user
    await sql`
      UPDATE users
      SET username = ${username}, email = ${email}
      WHERE user_id = ${session.id}
    `;

    // Update session with new user data
    await updateSession({
      id: session.id,
      username,
      email
    });

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function updateUserPassword(formData: FormData) {
  try {
    // Verify user is logged in
    const session = await verifySession(true);
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Get form data
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "All fields are required" };
    }

    // Validate new password
    if (newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "New passwords do not match" };
    }

    // Get user from database
    const userQuery = (await sql`
      SELECT user_id, password
      FROM users
      WHERE user_id = ${session.id}
    `) as UserAuthRow[];

    if (!userQuery.length) {
      return { success: false, error: "User not found" };
    }

    const user = userQuery[0];

    // Verify current password
    try {
      checkPassword(currentPassword, user.password);
    } catch (err) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Hash new password
    const hashedPassword = await SaltyPass(newPassword);

    // Update password in database
    await sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE user_id = ${session.id}
    `;

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, error: "Failed to update password" };
  }
}
