import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// Simple rate limiting middleware
const rateLimitMap = new Map();

function rateLimit(ip: string, limit = 100, window = 60000) {
  const now = Date.now();
  const windowStart = now - window;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip);
  const validRequests = requests.filter((time: number) => time > windowStart);

  if (validRequests.length >= limit) {
    return false;
  }

  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);

  return true;
}

// Define public routes (no authentication required)
const isPublicRoute = (pathname: string) => {
  const publicRoutes = [
    "/",
    "/api/categories",
    "/api/user/register",
  ];

  return publicRoutes.some(route => pathname.startsWith(route));
};

export default async function middleware(req: NextRequest) {
  // Get client IP for rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  // Apply rate limiting
  if (!rateLimit(ip, 100, 60000)) { // 100 requests per minute
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  // Skip authentication for public routes
  if (isPublicRoute(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // For now, allow all other routes since we're using client-side wallet authentication
  // In the future, you might want to add server-side wallet signature verification
  return NextResponse.next();
}
