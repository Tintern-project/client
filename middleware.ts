import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static files and excluded paths
  if (
    path.startsWith("/_next/") || // Next.js static assets
    path.startsWith("/api/auth/") || // Authentication API routes
    /\.(jpg|png|ico|svg|webp)$/.test(path) || // Image files
    path === "/favicon.ico" // Favicon
  ) {
    return NextResponse.next(); // Proceed without applying middleware logic
  }

  // Define public paths that don’t require authentication
  const isPublicPath =
    path === "/" ||
    path === "/jobs" ||
    path === "/auth/login" ||
    path === "/auth/signup";

  // Check for authentication token
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token;

  // Redirect unauthenticated users from private paths to login
  if (!isPublicPath && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup pages
  if (isAuthenticated && (path === "/auth/login" || path === "/auth/signup")) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // Proceed with the request
  return NextResponse.next();
}
