import arcjet, { detectBot, shield } from "@arcjet/next";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// Only initialize Arcjet if the key is provided
const aj = process.env.ARCJET_KEY && process.env.ARCJET_KEY !== "arcjet_key_placeholder" 
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        // shield protects against common attacks such as SQL injection, XSS, etc
        shield(
          { mode: "DRY_RUN" } // Use DRY_RUN for development, LIVE for production
        ),

        detectBot({
          mode: "DRY_RUN", // Use DRY_RUN for development, LIVE for production
          // Block all bots except the following
          allow: [
            "CATEGORY:SEARCH_ENGINE",
            "CURL",
            "VERCEL_MONITOR_PREVIEW", // Vercel preview bot
            // Google, Bing, etc
            // Uncomment to allow these other common bot categories
            // See the full list at https://arcjet.com/bot-list
            //"CATEGORY:MONITOR", // Uptime monitoring services
            //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
          ],
        }),
      ],
    })
  : null;

// define public routes (no authentication required)
const isPublicRoute = (pathname: string) => {
  const publicRoutes = [
    "/",
    "/api/categories",
    "/api/user/register",
  ];
  
  return publicRoutes.some(route => pathname.startsWith(route));
};

export default async function middleware(req: any) {
  // run arcjet middleware first (only if configured)
  if (aj) {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Forbidden", reason: decision.reason },
        { status: 403 }
      );
    }
  }

  // skip authentication for public routes
  if (isPublicRoute(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // For now, allow all other routes since we're using client-side wallet authentication
  // In the future, you might want to add server-side wallet signature verification
  return NextResponse.next();
}
