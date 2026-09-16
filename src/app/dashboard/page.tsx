import { desc, eq } from "drizzle-orm";
import { ArrowUpRight, Edit3, Eye } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatePortfolio } from "@/components/create-portfolio";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const statusLabel = { draft: "Brouillon", unlisted: "Non répertorié", published: "Publié" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  const items = await db.select().from(portfolios).where(eq(portfolios.userId, user.id)).orderBy(desc(portfolios.updatedAt));

  return (
    <main className="noise min-h-[calc(100vh-4rem)] py-12">
      <div className="container-app">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="label text-[#6c5ce7]">Votre espace</p><h1 className="text-4xl font-black tracking-tight md:text-6xl">Mes portfolios</h1><p className="mt-3 text-black/55">{items.length} création{items.length !== 1 && "s"} · Toutes vos histoires au même endroit.</p></div>
          <div className="flex gap-3">
            <form action="/api/auth/signout" method="post"><button className="btn btn-light">Déconnexion</button></form>
            <CreatePortfolio />
          </div>
        </div>

        {items.length ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((portfolio) => (
              <article key={portfolio.id} className="card overflow-hidden">
                <div className="flex h-52 items-center justify-center p-8" style={{ background: portfolio.theme.background, color: portfolio.theme.text }}>
                  <div className="w-full">
                    <span className="text-[10px] font-bold uppercase tracking-[.2em]" style={{ color: portfolio.theme.primary }}>{portfolio.template}</span>
                    <h2 className="mt-3 line-clamp-2 text-3xl font-black">{portfolio.sections[0]?.data.heading ?? portfolio.title}</h2>
                    <div className="mt-5 h-1 w-12" style={{ background: portfolio.theme.primary }} />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div><h3 className="text-xl font-black">{portfolio.title}</h3><p className="mt-1 text-xs text-black/45">/p/{portfolio.slug}</p></div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${portfolio.status === "published" ? "bg-green-100 text-green-800" : "bg-black/5 text-black/50"}`}>{statusLabel[portfolio.status]}</span>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Link href={`/editor/${portfolio.id}`} className="btn btn-dark !min-h-9 flex-1 !py-1"><Edit3 size={15} /> Modifier</Link>
                    {portfolio.status !== "draft" && <Link href={`/p/${portfolio.slug}`} target="_blank" className="btn btn-light !min-h-9 !px-3 !py-1" aria-label="Voir"><ArrowUpRight size={16} /></Link>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid min-h-96 place-items-center rounded-3xl border-2 border-dashed border-black/15 bg-white/40 text-center">
            <div className="max-w-sm p-7"><div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-[#d8ff5f]"><Eye /></div><h2 className="text-2xl font-black">La page est encore blanche</h2><p className="mt-2 text-black/55">Choisissez un modèle et publiez votre première histoire.</p><CreatePortfolio triggerClass="mt-6" /></div>
          </div>
        )}
      </div>
    </main>
  );
}
