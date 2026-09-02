import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PortfolioForm } from "@/components/admin/portfolio-form";
import { parseJsonArray } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [portfolio, categories] = await Promise.all([
    db.portfolio.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    db.portfolioCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!portfolio) notFound();

  return (
    <PortfolioForm
      categories={categories}
      initial={{
        id: portfolio.id,
        title: portfolio.title,
        slug: portfolio.slug,
        categoryId: portfolio.categoryId,
        description: portfolio.description,
        thumbnail: portfolio.thumbnail,
        technologies: parseJsonArray(portfolio.technologies),
        client: portfolio.client,
        projectUrl: portfolio.projectUrl,
        githubUrl: portfolio.githubUrl,
        year: portfolio.year,
        featured: portfolio.featured,
        published: portfolio.published,
        seoTitle: portfolio.seoTitle,
        seoDescription: portfolio.seoDescription,
        images: portfolio.images.map((img) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder,
        })),
      }}
    />
  );
}
