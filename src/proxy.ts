import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define which routes DON'T trigger the "No Interests" check
const isOnboardingExempt = createRouteMatcher([
  "/preferences(.*)",
  "/analysis(.*)",
  "/settings(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 2. If the user is logged in...
  if (userId) {
    // 3. ...and they are trying to access a page that REQUIRES interests (like the Home Page)
    if (!isOnboardingExempt(req)) {
      const interests = (sessionClaims?.metadata as any)?.interests;
      const hasInterests = Array.isArray(interests) && interests.length > 0;

      // 4. If they have no interests, send them to the picker
      if (!hasInterests) {
        return NextResponse.redirect(new URL("/preferences", req.url));
      }
    }
  } else {
    // 5. If NOT logged in, protect everything except the sign-in/up pages
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