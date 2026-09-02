import { db } from "@/lib/db";
import { JournalForm } from "@/components/admin/journal-form";

export const dynamic = "force-dynamic";

export default async function NewJournalPage() {
  const categories = await db.journalCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return <JournalForm categories={categories} />;
}
