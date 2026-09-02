import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediaSchema } from "@/lib/validators";
import { getAdminSession, unauthorized } from "@/lib/api-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const media = await db.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ media });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const parsed = mediaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const created = await db.media.create({ data: parsed.data });
    return NextResponse.json({ media: created }, { status: 201 });
  } catch (error) {
    console.error("[MEDIA_POST]", error);
    return NextResponse.json({ error: "Gagal menyimpan media" }, { status: 500 });
  }
}
