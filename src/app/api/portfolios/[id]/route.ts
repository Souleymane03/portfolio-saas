import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { portfolioUpdateSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const parsed = portfolioUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  try {
    const [updated] = await db.update(portfolios).set({
      ...parsed.data,
      updatedAt: new Date(),
    }).where(and(eq(portfolios.id, id), eq(portfolios.userId, user.id))).returning({ id: portfolios.id });
    if (!updated) return NextResponse.json({ error: "Portfolio introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique")) {
      return NextResponse.json({ error: "Cette adresse publique est déjà utilisée." }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  await db.delete(portfolios).where(and(eq(portfolios.id, id), eq(portfolios.userId, user.id)));
  return NextResponse.json({ ok: true });
}
