import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { demoSchema } from "@/lib/validators";
import { getAdminSession, unauthorized } from "@/lib/api-auth";
import { revalidatePublic } from "@/lib/revalidate";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const demo = await db.demo.findUnique({ where: { id } });
  if (!demo) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ demo });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = demoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const existing = await db.demo.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    const slugTaken = await db.demo.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (slugTaken) {
      return NextResponse.json({ error: "Slug sudah digunakan demo lain" }, { status: 409 });
    }

    const updated = await db.demo.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        notes: data.notes || null,
        category: data.category || null,
        thumbnail: data.thumbnail || null,
        demoUrl: data.demoUrl,
        accessType: data.accessType,
        technologies: JSON.stringify(data.technologies),
        featured: data.featured,
        published: data.published,
        sortOrder: data.sortOrder,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    });

    revalidatePublic({ type: "demo", slugs: [existing.slug, updated.slug] });
    return NextResponse.json({ demo: updated });
  } catch (error) {
    console.error("[DEMO_PUT]", error);
    return NextResponse.json({ error: "Gagal memperbarui demo" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body as { action?: string };

    const demo = await db.demo.findUnique({ where: { id } });
    if (!demo) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    if (action === "toggle-published") {
      const updated = await db.demo.update({
        where: { id },
        data: { published: !demo.published },
      });
      revalidatePublic({ type: "demo", slugs: [updated.slug] });
      return NextResponse.json({ demo: updated });
    }

    if (action === "toggle-featured") {
      const updated = await db.demo.update({
        where: { id },
        data: { featured: !demo.featured },
      });
      revalidatePublic({ type: "demo", slugs: [updated.slug] });
      return NextResponse.json({ demo: updated });
    }

    return NextResponse.json({ error: "Aksi tidak dikenal" }, { status: 400 });
  } catch (error) {
    console.error("[DEMO_PATCH]", error);
    return NextResponse.json({ error: "Gagal memperbarui demo" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  try {
    const existing = await db.demo.findUnique({ where: { id } });
    await db.demo.delete({ where: { id } });
    revalidatePublic({ type: "demo", slugs: [existing?.slug] });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DEMO_DELETE]", error);
    return NextResponse.json({ error: "Gagal menghapus demo" }, { status: 500 });
  }
}
