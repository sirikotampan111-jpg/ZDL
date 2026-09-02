import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Returns the admin session, or null if unauthorized. */
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  return session;
}

/** Standard 401 response helper. */
export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
