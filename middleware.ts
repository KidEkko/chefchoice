import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@lib/session";
import { CookieString } from "@util/constants";
import { Paths } from "@/serverConfig";

// Routes that require authentication
const protectedRoutes = [Paths.PROFILE];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the current path requires authentication
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute) {
    const cookie = req.cookies.get(CookieString.UserToken)?.value;
    const session = await decrypt(cookie);

    // Redirect to login if no valid session
    if (!session?.username) {
      return NextResponse.redirect(new URL(Paths.LOGIN, req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
