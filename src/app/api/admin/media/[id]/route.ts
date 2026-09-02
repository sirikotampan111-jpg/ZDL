import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
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

    // Remove physical file if it lives in /uploads
    if (media.url.startsWith("/uploads/")) {
      try {
        await unlink(path.join(process.cwd(), "public", media.url));
      } catch {
        // file may already be gone; ignore
      }
    }

    await db.media.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[MEDIA_DELETE]", error);
    return NextResponse.json({ error: "Gagal menghapus media" }, { status: 500 });
  }
}
