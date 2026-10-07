import "server-only";

import { SignJWT, type JWTPayload, jwtVerify } from "jose";
import { CookieString, Seconds } from "@util/constants";
import { cookies } from "next/headers";
import { secureCookie } from "@util/functions";
import { User } from "@/utils/classes/user";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export type DecodedSession = User & JWTPayload;

export async function encrypt(payload: JWTPayload): Promise<string> {
  var encoder = new SignJWT(payload)
  encoder.setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d");
  return encoder
    .sign(encodedKey);
}

// TODO: confirm that this works as intended. will know when testing
export async function decrypt(session: string | Uint8Array): Promise<DecodedSession | null> {
  try {
    const { payload } = await jwtVerify<DecodedSession>(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
  return null;
}

// Current session format: { id, username, role, exp (expiration) }
export async function createSession(session: User) {
  const time = Seconds.Week;
  const token = await encrypt({ ...session, time });

  const cookie = await cookies();
  cookie.set(CookieString.UserToken, token, secureCookie(time));
}

// TODO: add other local interactions in routes, to avoid issues and such
// export async function createLocalSession() {
//   const localSesh = JSON.parse(process.env.LOCAL_SESSION);
//   const token = await encrypt(localSesh);
//   const cookie = await cookies();

//   cookie.set(CookieString.UserToken, token, secureCookie(Seconds.Week));
//   return localSesh;
// }

export async function updateSession(session: User) {
  if (!session) return null;
  await createSession(session);
  return session;
}

export async function verifySession() {
  const token = await cookies()
  const tokenString = token.get(CookieString.UserToken)?.value || "";
  if (!token) return null;

  const session = await decrypt(tokenString);

  if (!session) return deleteSession();

  return await updateSession(session);
}

export async function deleteSession() {
  const cookie = await cookies()
  cookie.delete(CookieString.UserToken);
}