import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt, deleteSession } from "@lib/session";
import { CookieString } from "@generic/constants";
import { Paths, RoleLevels, RoleMap, RoleString } from "serverConfig";

const OwnerProtectedRoutes = [Paths.OWNER];
const AdminProtectedRoutes = [Paths.ADMIN];

export default async function middleware(req) {
  const path = req.nextUrl.baseUrl;
  const isOwnerProtected = OwnerProtectedRoutes.includes(path);
  const isAdminProtected = AdminProtectedRoutes.includes(path);
  const isPublicRoute = !isOwnerProtected && !isAdminProtected;

  if (isPublicRoute) return NextResponse.next();

  const cookie = cookies().get(CookieString.UserToken)?.value;
  const session = await decrypt(cookie);

  const level = RoleMap.get(session?.role || RoleString.Basic);
  switch (true) {
    case !session?.username:
    case isOwnerProtected && level < RoleLevels.Owner:
    case isAdminProtected && level < RoleLevels.Admin:
      return NextResponse.redirect(new URL(Paths.NOT_FOUND, req.nextUrl));
  }

  if (!!session) {
    const list = await GetBannedList();
    const banned = list.find((id) => id === session.id);
    if (!!banned)  {
      await deleteSession();
      if (!isPublicRoute) return NextResponse.redirect(new URL(Paths.NOT_FOUND, req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
