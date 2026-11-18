"use server"

import { createLocalSession, verifySession } from "@/lib/session";
import { User } from "@/utils/types";


export async function GetUserWithToken(): Promise<User | undefined>{
  const session = await verifySession();
  if (!session) {
    if (process.env.ENV === "CHEF_DEV") {
      const local = await createLocalSession();
      return local;
    }
    return
  }
 
  return session;
}