import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { JournalForm } from "@/components/admin/journal-form";

export const dynamic = "force-dynamic";

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [journal, categories] = await Promise.all([
    db.journal.findUnique({
      where: { id },
      include: { tags: { select: { tag: { select: { name: true } } } } },
    }),
    db.journalCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!journal) notFound();

  return (
    <JournalForm
      categories={categories}
      initial={{
        id: journal.id,
        title: journal.title,
        slug: journal.slug,
        excerpt: journal.excerpt,
        content: journal.content,
        featuredImage: journal.featuredImage,
        categoryId: journal.categoryId,
        authorName: journal.authorName,
        status: journal.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        publishedAt: journal.publishedAt ? journal.publishedAt.toISOString() : null,
        seoTitle: journal.seoTitle,
        seoDescription: journal.seoDescription,
        canonicalUrl: journal.canonicalUrl,
        ogImage: journal.ogImage,
        tags: journal.tags.map((t) => t.tag.name),
      }}
    />
  );
}
