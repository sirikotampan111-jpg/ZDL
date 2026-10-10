import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, unauthorized } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  try {
    const media = await db.media.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    // Binary lives in the database row — deleting the row removes the file.
    await db.media.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[MEDIA_DELETE]", error);
    return NextResponse.json({ error: "Gagal menghapus media" }, { status: 500 });
  }
}
