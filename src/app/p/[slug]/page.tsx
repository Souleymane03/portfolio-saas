import type { Metadata } from "next";
import { eq, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PortfolioView } from "@/components/portfolio-view";
import { db } from "@/db";
import { portfolios } from "@/db/schema";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await db.query.portfolios.findFirst({
    where: (table, { and, eq, ne }) => and(eq(table.slug, slug), ne(table.status, "draft")),
    columns: { title: true, status: true },
  });
  if (!portfolio) return {};
  return {
    title: portfolio.title,
    robots: portfolio.status === "unlisted" ? { index: false, follow: false } : undefined,
  };
}

export default async function PublicPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.slug, slug)).limit(1);
  if (!portfolio || portfolio.status === "draft") notFound();
  return (
    <main className="min-h-screen">
      <PortfolioView title={portfolio.title} theme={portfolio.theme} sections={portfolio.sections} />
    </main>
  );
}
