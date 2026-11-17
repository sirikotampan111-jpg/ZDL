import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DemoForm } from "@/components/admin/demo-form";
import { parseJsonArray } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export default async function EditDemoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const demo = await db.demo.findUnique({ where: { id } });
  if (!demo) notFound();

  return (
    <DemoForm
      initial={{
        id: demo.id,
        title: demo.title,
        slug: demo.slug,
        description: demo.description,
        notes: demo.notes,
        category: demo.category,
        thumbnail: demo.thumbnail,
        demoUrl: demo.demoUrl,
        accessType: demo.accessType === "REQUEST" ? "REQUEST" : "PUBLIC",
        technologies: parseJsonArray(demo.technologies),
        featured: demo.featured,
        published: demo.published,
        sortOrder: demo.sortOrder,
        seoTitle: demo.seoTitle,
        seoDescription: demo.seoDescription,
      }}
    />
  );
}
