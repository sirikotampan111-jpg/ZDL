import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { journalSchema } from "@/lib/validators";
import { getAdminSession, unauthorized } from "@/lib/api-auth";
import { slugify } from "@/lib/markdown";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const journals = await db.journal.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: { select: { name: true, slug: true } } },
  });
  return NextResponse.json({ journals });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const parsed = journalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const existing = await db.journal.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 409 });
    }

    const created = await db.$transaction(async (tx) => {
      const journal = await tx.journal.create({
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
            data.publishedAt && data.status === "PUBLISHED"
              ? new Date(data.publishedAt)
              : data.status === "PUBLISHED"
                ? new Date()
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

    return NextResponse.json({ journal: created }, { status: 201 });
  } catch (error) {
    console.error("[JOURNAL_POST]", error);
    return NextResponse.json({ error: "Gagal menyimpan artikel" }, { status: 500 });
  }
}
