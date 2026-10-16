import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@lib/session";
import { CookieString } from "@util/constants";
import { GetRoleNum, Paths, RoleLevels, RoleString } from "@/serverConfig"; 

const OwnerProtectedRoutes: Array<string> = [Paths.OWNER];
const AdminProtectedRoutes: Array<string> = [Paths.ADMIN];

export default async function middleware(req: NextRequest ) {
  const path = req.nextUrl.pathname;
  const isOwnerProtected = OwnerProtectedRoutes.includes(path);
  const isAdminProtected = AdminProtectedRoutes.includes(path);
  const isPublicRoute = !isOwnerProtected && !isAdminProtected;

  if (isPublicRoute) return NextResponse.next();

  const cookie = req.cookies.get(CookieString.UserToken)?.value;
  const session = await decrypt(cookie);

  const level = GetRoleNum(session?.role || RoleString.Basic);
  switch (true) {
    case !session?.username:
    case isOwnerProtected && level < RoleLevels.Owner:
    case isAdminProtected && level < RoleLevels.Admin:
      return NextResponse.redirect(new URL(Paths.NOT_FOUND, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
