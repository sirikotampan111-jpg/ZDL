import { db } from "@/lib/db";
import { PortfolioForm } from "@/components/admin/portfolio-form";

export const dynamic = "force-dynamic";

export default async function NewPortfolioPage() {
  const categories = await db.portfolioCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return <PortfolioForm categories={categories} />;
}
