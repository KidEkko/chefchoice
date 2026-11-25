"use server";

import { SignJWT, type JWTPayload, jwtVerify } from "jose";
import { CookieString } from "@util/constants";
import { cookies } from "next/headers";
import { secureCookie } from "@/utils/cookies";
import { User } from "@/utils/types/user";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export type DecodedSession = User & JWTPayload;

// Encrypt a payload using with jose
// Uses a default of 1 week of time
export async function encrypt(payload: JWTPayload): Promise<string> {
  var encoder = new SignJWT(payload)
  encoder.setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d");
  return encoder
    .sign(encodedKey);
}

// Decrypt a token
// Expected to be a User session token
export async function decrypt(session: string | Uint8Array | undefined): Promise<DecodedSession | undefined> {
  if (session !== undefined) {
    try {
      const { payload } = await jwtVerify<DecodedSession>(session, encodedKey, {
        algorithms: ["HS256"],
      });

      return payload;
    } catch (error) {
      console.log("Failed to verify session");
    }
  }
  return;
}

const WEEK_IN_SECONDS: number = 60 * 60 * 24 * 7;

// Current session format: { id, username, email }
export async function createSession(session: User) {
  const token = await encrypt({ ...session, WEEK_IN_SECONDS });

  const cookie = await cookies();
  cookie.set(CookieString.UserToken, token, secureCookie(WEEK_IN_SECONDS));
}

// Return a basic User object for Local testing
export async function createLocalSession(): Promise<User> {
  const localSesh = JSON.parse(`{"id": 1, "username": "dev", "email": "dev@test.com"}`);
  return localSesh as User;
}

// Update a user's session
// Function is called whenever a user is verified to extend their current cookie
export async function updateSession(session: User | undefined): Promise<User | undefined> {
  if (!session) return;
  await createSession(session);
  return session;
}

// Verify a user's session
// Check if they have cookies, confirm they have a user token, then try to decrypt the token
// If they have an invalid token, delete it. Otherwise, update their session 
export async function verifySession(): Promise<User | undefined> {
  const token = await cookies();
  if (!token) return;

  const tokenString = token.get(CookieString.UserToken)?.value;
  const session = await decrypt(tokenString);

  if (!session && tokenString) {
    deleteSession();
    return;
  } 
  return await updateSession(session);
}

export async function deleteSession() {
  const cookie = await cookies()
  cookie.delete(CookieString.UserToken);
}