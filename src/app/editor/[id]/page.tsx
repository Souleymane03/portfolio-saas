import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { PortfolioEditor } from "@/components/portfolio-editor";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  const { id } = await params;
  const [portfolio] = await db.select().from(portfolios).where(and(eq(portfolios.id, id), eq(portfolios.userId, user.id))).limit(1);
  if (!portfolio) notFound();

  return <PortfolioEditor initialPortfolio={{
    id: portfolio.id,
    userId: portfolio.userId,
    title: portfolio.title,
    slug: portfolio.slug,
    template: portfolio.template,
    status: portfolio.status,
    theme: portfolio.theme,
    sections: portfolio.sections,
  }} />;
}
