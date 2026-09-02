import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categorySchema } from "@/lib/validators";
import { getAdminSession, unauthorized } from "@/lib/api-auth";
import { slugify } from "@/lib/markdown";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const { name, slug, description, type } = parsed.data;
    const finalSlug = slug || slugify(name);

    if (type === "portfolio") {
      const existing = await db.portfolioCategory.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

      const nameTaken = await db.portfolioCategory.findFirst({
        where: { name, id: { not: id } },
      });
      if (nameTaken) return NextResponse.json({ error: "Nama kategori sudah ada" }, { status: 409 });
      const slugTaken = await db.portfolioCategory.findFirst({
        where: { slug: finalSlug, id: { not: id } },
      });
      if (slugTaken) return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 409 });

      const updated = await db.portfolioCategory.update({
        where: { id },
        data: { name, slug: finalSlug, description: description || null },
      });
      return NextResponse.json({ category: updated });
    }

    const existing = await db.journalCategory.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    const nameTaken = await db.journalCategory.findFirst({
      where: { name, id: { not: id } },
    });
    if (nameTaken) return NextResponse.json({ error: "Nama kategori sudah ada" }, { status: 409 });
    const slugTaken = await db.journalCategory.findFirst({
      where: { slug: finalSlug, id: { not: id } },
    });
    if (slugTaken) return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 409 });

    const updated = await db.journalCategory.update({
      where: { id },
      data: { name, slug: finalSlug, description: description || null },
    });
    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error("[CATEGORY_PUT]", error);
    return NextResponse.json({ error: "Gagal memperbarui kategori" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const type = req.nextUrl.searchParams.get("type");

  try {
    if (type === "portfolio") {
      await db.portfolioCategory.delete({ where: { id } });
    } else if (type === "journal") {
      await db.journalCategory.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: "Tipe kategori tidak valid" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return NextResponse.json({ error: "Gagal menghapus kategori" }, { status: 500 });
  }
}
