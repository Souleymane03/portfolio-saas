import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { credentialsSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = credentialsSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Identifiants invalides." }, { status: 400 });

  const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (!user || !(await compare(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "E-mail ou mot de passe incorrect." }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
