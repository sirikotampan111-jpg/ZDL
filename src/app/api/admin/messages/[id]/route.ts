import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, unauthorized } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  try {
    const message = await db.contactMessage.findUnique({ where: { id } });
    if (!message) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    const updated = await db.contactMessage.update({
      where: { id },
      data: { isRead: !message.isRead },
    });
    return NextResponse.json({ message: updated });
  } catch (error) {
    console.error("[MESSAGE_PATCH]", error);
    return NextResponse.json({ error: "Gagal memperbarui pesan" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  try {
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[MESSAGE_DELETE]", error);
    return NextResponse.json({ error: "Gagal menghapus pesan" }, { status: 500 });
  }
}
