import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/** Routes exempt from "no interests" redirect (logged-in user without publicMetadata.interests) */
const isOnboardingExempt = createRouteMatcher([
  "/preferences(.*)",
  "/analysis(.*)",
  "/settings(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/(.*)",
  "/proxy(.*)", // Add your proxy route here to prevent redirect loops
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const isHomePage = req.nextUrl.pathname === "/";

  if (userId) {
    // If they are on the Home page, let the request through so the cards can render
    if (isHomePage) {
      return NextResponse.next();
    }

    if (!isOnboardingExempt(req)) {
      const interests = (sessionClaims?.metadata as { interests?: unknown })?.interests;
      const hasInterests = Array.isArray(interests) && interests.length > 0;
      
      if (!hasInterests) {
        return NextResponse.redirect(new URL("/preferences", req.url));
      }
    }
  } else {
    if (!isOnboardingExempt(req)) {
      return (await auth()).redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};