export interface CookieOptions {
  secure: boolean;
  sameSite: "none" | "strict";
  httpOnly?: boolean;
  path: string;
  maxAge: number;
}

export function secureCookie(age: number, noss?: boolean): CookieOptions {
  return {
    secure: true,
    sameSite: noss ? "none" : "strict",
    httpOnly: true,
    path: "/",
    maxAge: age,
  };
}

export function readableCookie(age: number, noss?: boolean): CookieOptions {
  return {
    secure: true,
    sameSite: noss ? "none" : "strict",
    path: "/",
    maxAge: age,
  };
}