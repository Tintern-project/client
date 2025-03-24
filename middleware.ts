import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define public paths that don't need authentication
  const isPublicPath =
    path === "/" ||
    path === "/auth/login" ||
    path === "/auth/signup" ||
    path.startsWith("/api/auth/");

  // Check if the user is authenticated
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token;

  // Redirect logic
  if (!isPublicPath && !isAuthenticated) {
    // Store the original URL to redirect back after login
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and tries to access login/signup, redirect to profile
  if (isAuthenticated && (path === "/auth/login" || path === "/auth/signup")) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
