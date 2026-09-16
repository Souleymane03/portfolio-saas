import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PortfolioView } from "@/components/portfolio-view";
import { db } from "@/db";
import { portfolios } from "@/db/schema";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await db.query.portfolios.findFirst({
    where: (table, { and, eq }) => and(eq(table.slug, slug), eq(table.status, "published")),
    columns: { title: true },
  });
  if (!portfolio) return {};
  return { title: portfolio.title };
}

export default async function PublicPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [portfolio] = await db.select().from(portfolios).where(and(eq(portfolios.slug, slug), eq(portfolios.status, "published"))).limit(1);
  if (!portfolio) notFound();
  return (
    <main className="min-h-screen">
      <PortfolioView title={portfolio.title} theme={portfolio.theme} sections={portfolio.sections} />
    </main>
  );
}
