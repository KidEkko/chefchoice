import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { CookieString, Seconds } from "@generic/constants";
import { RoleLevels, RoleMap } from "serverConfig";
import { cookies } from "next/headers";
import { secureCookie } from "@generic/functions";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

// Current session format: { id, username, role, exp (expiration) }
export async function createSession(session) {
  const time = Seconds.Week;
  const token = await encrypt({ ...session, time });

  cookies().set(CookieString.UserToken, token, secureCookie(time));
}

// TODO: add other local interactions in routes, to avoid issues and such
export async function createLocalSession() {
  const localSesh = JSON.parse(process.env.LOCAL_SESSION);
  const token = await encrypt(localSesh);
  cookies().set(CookieString.UserToken, token, secureCookie(Seconds.Week));
  return localSesh;
}

export async function updateSession(session) {
  if (!session) return null;
  if (session.role > RoleLevels.Temp && slightlyOld(session.exp)) await createSession(session);
  return session;
}

function slightlyOld(expirationDate) {
  return new Date(expirationDate * 1000) - new Date() < Seconds.SixDays;
}

export async function verifyWLSession() {
  const session = await verifySession();
  return RoleMap.get(session?.role) > RoleLevels.Loser ? session : null;
}

export async function verifySession() {
  const token = cookies().get(CookieString.UserToken)?.value;
  if (!token) return null;

  const session = await decrypt(token);

  switch (true) {
    case !session:
    case typeof RoleMap.get(session.role) !== "number":
      return deleteSession();
  }

  return await updateSession(session);
}

export function deleteSession() {
  cookies().delete(CookieString.UserToken);
}