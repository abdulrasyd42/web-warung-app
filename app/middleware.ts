import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value;

  // Jika belum login dan bukan sedang di halaman /login
  if (!isLoggedIn && !req.nextUrl.pathname.startsWith("/login")) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login dan mencoba ke /login → arahkan ke /
  if (isLoggedIn && req.nextUrl.pathname.startsWith("/login")) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
