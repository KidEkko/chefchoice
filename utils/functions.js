// TODO: update this to a TS file?

export function secureCookie(age, noss) {
  return {
    secure: true,
    sameSite: !!noss ? "none" : "strict",
    httpOnly: true,
    path: "/",
    maxAge: age,
  };
}

export function readableCookie(age, noss) {
  return {
    secure: true,
    sameSite: !!noss ? "none" : "strict",
    path: "/",
    maxAge: age,
  };
}
