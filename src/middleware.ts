import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_LOGIN_PATH, ADMIN_PREFIX } from "@/lib/admin/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  if (pathname === ADMIN_LOGIN_PATH) {
    return NextResponse.next();
  }

  const session = request.cookies.get("firebase-auth-session")?.value;

  if (!session) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
