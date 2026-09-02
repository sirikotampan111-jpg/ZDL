import { withAuth } from "next-auth/middleware";

/**
 * First security layer: blocks /admin/* routes for unauthenticated users.
 * The admin layout + every API route re-verify the session server-side.
 */
export default withAuth({
  pages: { signIn: "/admin/login" },
});

export const config = {
  matcher: [
    // Protect all /admin except the login page
    "/admin/((?!login).*)",
  ],
};
