import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/(api|trpc)(.*)"],
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Matches all routes except those with a file extension or _next
    "/", // Matches the root route
    "/(api|trpc)(.*)", // Matches all api and trpc routes
  ],
};
