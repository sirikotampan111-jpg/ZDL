import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, unauthorized } from "@/lib/api-auth";

/** Checks whether a slug is available (portfolio or journal). */
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const slug = req.nextUrl.searchParams.get("slug")?.trim();
  const type = req.nextUrl.searchParams.get("type") || "portfolio";
  const excludeId = req.nextUrl.searchParams.get("excludeId") || undefined;

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json(
      { available: false, reason: "Slug hanya boleh huruf kecil, angka, dan tanda hubung" },
      { status: 200 }
    );
  }

  if (type === "journal") {
    const taken = await db.journal.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    return NextResponse.json({ available: !taken });
  }

  const taken = await db.portfolio.findFirst({
    where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
  });
  return NextResponse.json({ available: !taken });
}
