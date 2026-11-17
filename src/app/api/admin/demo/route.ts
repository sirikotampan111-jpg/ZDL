import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { demoSchema } from "@/lib/validators";
import { getAdminSession, unauthorized } from "@/lib/api-auth";
import { revalidatePublic } from "@/lib/revalidate";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const demos = await db.demo.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json({ demos });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const parsed = demoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const existing = await db.demo.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 409 });
    }

    const created = await db.demo.create({
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

    revalidatePublic({ type: "demo", slugs: [created.slug] });
    return NextResponse.json({ demo: created }, { status: 201 });
  } catch (error) {
    console.error("[DEMO_POST]", error);
    return NextResponse.json({ error: "Gagal menyimpan demo" }, { status: 500 });
  }
}
