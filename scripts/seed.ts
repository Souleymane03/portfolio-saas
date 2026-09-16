import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { portfolios, users } from "../src/db/schema";
import { getTemplate } from "../src/lib/templates";

async function seed() {
  const email = process.env.DEMO_USER_EMAIL ?? "demo@atelier.local";
  const password = process.env.DEMO_USER_PASSWORD ?? "DemoPortfolio123!";
  let [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) {
    [user] = await db.insert(users).values({
      name: "Camille Demo",
      email,
      passwordHash: await hash(password, 12),
    }).returning();
  }

  const existing = await db.query.portfolios.findFirst({ where: (table, { eq }) => eq(table.slug, "camille-demo") });
  if (!existing) {
    const template = getTemplate("studio");
    await db.insert(portfolios).values({
      userId: user.id,
      title: "Studio Camille",
      slug: "camille-demo",
      template: template.id,
      status: "published",
      theme: template.theme,
      sections: template.createSections(),
    });
  }

  console.log(`Démo créée : ${email} / ${password}`);
}

seed().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
