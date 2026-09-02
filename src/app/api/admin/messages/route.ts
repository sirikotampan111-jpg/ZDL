import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, unauthorized } from "@/lib/api-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ messages });
}
