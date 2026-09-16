import { NextResponse } from "next/server";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getTemplate } from "@/lib/templates";

const slugify = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const template = getTemplate(String(body.template ?? ""));
  const title = String(body.title ?? "").trim().slice(0, 100);
  if (!title) return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });

  const baseSlug = slugify(String(body.slug || title)) || "portfolio";
  let slug = baseSlug;
  let suffix = 1;
  while (await db.query.portfolios.findFirst({ where: (table, { eq }) => eq(table.slug, slug), columns: { id: true } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  const [portfolio] = await db.insert(portfolios).values({
    userId: user.id,
    title,
    slug,
    template: template.id,
    theme: template.theme,
    sections: template.createSections(),
  }).returning({ id: portfolios.id });
  return NextResponse.json({ id: portfolio.id }, { status: 201 });
}
