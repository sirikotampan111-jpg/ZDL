import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { journalSchema } from "@/lib/validators";
import { getAdminSession, unauthorized } from "@/lib/api-auth";
import { slugify } from "@/lib/markdown";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const journal = await db.journal.findUnique({
    where: { id },
    include: { tags: { select: { tag: { select: { name: true, slug: true } } } } },
  });
  if (!journal) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ journal });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = journalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const existing = await db.journal.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    const slugTaken = await db.journal.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (slugTaken) {
      return NextResponse.json({ error: "Slug sudah digunakan artikel lain" }, { status: 409 });
    }

    const updated = await db.$transaction(async (tx) => {
      await tx.journalTag.deleteMany({ where: { journalId: id } });

      const journal = await tx.journal.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || null,
          content: data.content,
          featuredImage: data.featuredImage || null,
          categoryId: data.categoryId || null,
          authorName: data.authorName || null,
          status: data.status,
          publishedAt:
            data.status === "PUBLISHED"
              ? data.publishedAt
                ? new Date(data.publishedAt)
                : existing.publishedAt || new Date()
              : null,
          seoTitle: data.seoTitle || null,
          seoDescription: data.seoDescription || null,
          canonicalUrl: data.canonicalUrl || null,
          ogImage: data.ogImage || null,
        },
      });

      for (const tagName of data.tags) {
        const slug = slugify(tagName);
        if (!slug) continue;
        const tag = await tx.tag.upsert({
          where: { slug },
          update: {},
          create: { name: tagName, slug },
        });
        await tx.journalTag.create({
          data: { journalId: journal.id, tagId: tag.id },
        });
      }

      return journal;
    });

    return NextResponse.json({ journal: updated });
  } catch (error) {
    console.error("[JOURNAL_PUT]", error);
    return NextResponse.json({ error: "Gagal memperbarui artikel" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const { action, publishedAt } = body as { action?: string; publishedAt?: string };

    const journal = await db.journal.findUnique({ where: { id } });
    if (!journal) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    if (action === "publish") {
      const updated = await db.journal.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedAt: publishedAt ? new Date(publishedAt) : journal.publishedAt || new Date(),
        },
      });
      return NextResponse.json({ journal: updated });
    }

    if (action === "unpublish") {
      const updated = await db.journal.update({
        where: { id },
        data: { status: "DRAFT" },
      });
      return NextResponse.json({ journal: updated });
    }

    return NextResponse.json({ error: "Aksi tidak dikenal" }, { status: 400 });
  } catch (error) {
    console.error("[JOURNAL_PATCH]", error);
    return NextResponse.json({ error: "Gagal memperbarui artikel" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  try {
    await db.journal.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[JOURNAL_DELETE]", error);
    return NextResponse.json({ error: "Gagal menghapus artikel" }, { status: 500 });
  }
}
