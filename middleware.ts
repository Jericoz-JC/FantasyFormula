import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/api/auth/register",
    "/api/auth/signin",
    "/api/auth/callback",
    "/api/auth/session",
  ];

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected API routes
  if (pathname.startsWith("/api")) {
    if (!req.auth && pathname !== "/api/auth/[...nextauth]") {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

