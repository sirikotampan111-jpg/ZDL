import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolioSchema } from "@/lib/validators";
import { getAdminSession, unauthorized } from "@/lib/api-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const portfolios = await db.portfolio.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: { select: { name: true, slug: true } } },
  });
  return NextResponse.json({ portfolios });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const parsed = portfolioSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const existing = await db.portfolio.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 409 });
    }

    const created = await db.portfolio.create({
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

    return NextResponse.json({ portfolio: created }, { status: 201 });
  } catch (error) {
    console.error("[PORTFOLIO_POST]", error);
    return NextResponse.json({ error: "Gagal menyimpan portfolio" }, { status: 500 });
  }
}
