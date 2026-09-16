import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().email("Adresse e-mail invalide").transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const signupSchema = credentialsSchema.extend({
  name: z.string().trim().min(2, "Votre nom est requis").max(80),
});

export const portfolioUpdateSchema = z.object({
  title: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(3).max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide"),
  status: z.enum(["draft", "unlisted", "published"]),
  theme: z.object({
    primary: z.string(),
    background: z.string(),
    text: z.string(),
    font: z.enum(["sans", "serif", "mono"]),
    density: z.enum(["compact", "comfortable", "airy"]),
    radius: z.enum(["none", "soft", "round"]),
  }),
  sections: z.array(z.object({
    id: z.string(),
    type: z.enum(["hero", "about", "projects", "experience", "skills", "testimonials", "contact", "custom"]),
    title: z.string(),
    data: z.object({
      heading: z.string().optional(),
      text: z.string().optional(),
      image: z.string().optional(),
      eyebrow: z.string().optional(),
      cta: z.string().optional(),
      email: z.string().optional(),
      location: z.string().optional(),
      items: z.array(z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        url: z.string().optional(),
      })).optional(),
    }),
  })).max(30),
});
