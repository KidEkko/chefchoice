"use server"

import { createLocalSession, verifySession } from "@/lib/session";
import { User } from "@/utils/types";

/**
 * User-related server actions
 */

// Function to check User Cookie on page load
// Will return a basic local user session for testing
export async function GetUserWithToken(): Promise<User | undefined> {
  const session = await verifySession();
  if (!session && process.env.ENV === "CHEF_DEV") {
    return await createLocalSession();
  }

  return session;
}
