import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolioSchema } from "@/lib/validators";
import { getAdminSession, unauthorized } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const portfolio = await db.portfolio.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!portfolio) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ portfolio });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = portfolioSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const existing = await db.portfolio.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    const slugTaken = await db.portfolio.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (slugTaken) {
      return NextResponse.json({ error: "Slug sudah digunakan project lain" }, { status: 409 });
    }

    const updated = await db.$transaction(async (tx) => {
      // Replace images wholesale
      await tx.portfolioImage.deleteMany({ where: { portfolioId: id } });
      return tx.portfolio.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          categoryId: data.categoryId || null,
          thumbnail: data.thumbnail || null,
          technologies: JSON.stringify(data.technologies),
          client: data.client || null,
          projectUrl: data.projectUrl || null,
          githubUrl: data.githubUrl || null,
          year: data.year ?? null,
          featured: data.featured,
          published: data.published,
          seoTitle: data.seoTitle || null,
          seoDescription: data.seoDescription || null,
          images: {
            create: data.images.map((img, i) => ({
              url: img.url,
              alt: img.alt || null,
              sortOrder: img.sortOrder ?? i,
            })),
          },
        },
      });
    });

    return NextResponse.json({ portfolio: updated });
  } catch (error) {
    console.error("[PORTFOLIO_PUT]", error);
    return NextResponse.json({ error: "Gagal memperbarui portfolio" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body as { action?: string };

    const portfolio = await db.portfolio.findUnique({ where: { id } });
    if (!portfolio) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    if (action === "toggle-published") {
      const updated = await db.portfolio.update({
        where: { id },
        data: { published: !portfolio.published },
      });
      return NextResponse.json({ portfolio: updated });
    }

    if (action === "toggle-featured") {
      const updated = await db.portfolio.update({
        where: { id },
        data: { featured: !portfolio.featured },
      });
      return NextResponse.json({ portfolio: updated });
    }

    return NextResponse.json({ error: "Aksi tidak dikenal" }, { status: 400 });
  } catch (error) {
    console.error("[PORTFOLIO_PATCH]", error);
    return NextResponse.json({ error: "Gagal memperbarui portfolio" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  try {
    await db.portfolio.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PORTFOLIO_DELETE]", error);
    return NextResponse.json({ error: "Gagal menghapus portfolio" }, { status: 500 });
  }
}
