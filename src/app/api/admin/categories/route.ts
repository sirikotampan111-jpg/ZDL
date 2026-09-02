import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categorySchema } from "@/lib/validators";
import { getAdminSession, unauthorized } from "@/lib/api-auth";
import { slugify } from "@/lib/markdown";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const type = req.nextUrl.searchParams.get("type");
  const portfolioCategories = await db.portfolioCategory.findMany({
    orderBy: { name: "asc" },
  });
  const journalCategories = await db.journalCategory.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    portfolio: type === "journal" ? undefined : portfolioCategories,
    journal: type === "portfolio" ? undefined : journalCategories,
  });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
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
    if (!finalSlug) {
      return NextResponse.json({ error: "Slug tidak valid" }, { status: 400 });
    }

    if (type === "portfolio") {
      const nameTaken = await db.portfolioCategory.findFirst({ where: { name } });
      if (nameTaken) return NextResponse.json({ error: "Nama kategori sudah ada" }, { status: 409 });
      const slugTaken = await db.portfolioCategory.findUnique({ where: { slug: finalSlug } });
      if (slugTaken) return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 409 });

      const created = await db.portfolioCategory.create({
        data: { name, slug: finalSlug, description: description || null },
      });
      return NextResponse.json({ category: created }, { status: 201 });
    }

    const nameTaken = await db.journalCategory.findFirst({ where: { name } });
    if (nameTaken) return NextResponse.json({ error: "Nama kategori sudah ada" }, { status: 409 });
    const slugTaken = await db.journalCategory.findUnique({ where: { slug: finalSlug } });
    if (slugTaken) return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 409 });

    const created = await db.journalCategory.create({
      data: { name, slug: finalSlug, description: description || null },
    });
    return NextResponse.json({ category: created }, { status: 201 });
  } catch (error) {
    console.error("[CATEGORY_POST]", error);
    return NextResponse.json({ error: "Gagal membuat kategori" }, { status: 500 });
  }
}
