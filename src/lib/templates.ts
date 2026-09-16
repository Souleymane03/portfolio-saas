import type { PortfolioSection, PortfolioTheme } from "./types";

const section = (
  type: PortfolioSection["type"],
  title: string,
  data: PortfolioSection["data"],
): PortfolioSection => ({ id: crypto.randomUUID(), type, title, data });

export type PortfolioTemplate = {
  id: string;
  name: string;
  genre: string;
  description: string;
  accent: string;
  theme: PortfolioTheme;
  createSections: () => PortfolioSection[];
};

const legacyTemplates: PortfolioTemplate[] = [
  {
    id: "studio",
    name: "Studio",
    genre: "Designer · Agence",
    description: "Une grille éditoriale audacieuse pour mettre les projets au premier plan.",
    accent: "#ff5c35",
    theme: { primary: "#ff5c35", background: "#f5f1e8", text: "#171717", font: "sans", density: "airy", radius: "none" },
    createSections: () => [
      section("hero", "Introduction", { eyebrow: "Studio indépendant · Paris", heading: "Des identités qui restent en tête.", text: "Direction artistique, design de marque et expériences numériques.", cta: "Voir nos projets" }),
      section("projects", "Projets sélectionnés", { items: [
        { title: "Maison Matisse", subtitle: "Identité · 2026", description: "Une identité solaire pour un lieu de vie méditerranéen.", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80" },
        { title: "Folio Objects", subtitle: "E-commerce · 2025", description: "Catalogue digital pour objets singuliers.", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80" },
      ] }),
      section("about", "Le studio", { heading: "Petit collectif, grandes idées.", text: "Nous collaborons avec des équipes ambitieuses pour créer des marques utiles, belles et cohérentes." }),
      section("contact", "Démarrons un projet", { email: "bonjour@studio.fr", location: "Paris · Disponible partout", text: "Parlez-nous de votre prochain défi." }),
    ],
  },
  {
    id: "lens",
    name: "Lens",
    genre: "Photographe · Artiste",
    description: "Un portfolio immersif et minimal pensé pour les images.",
    accent: "#b8ff3d",
    theme: { primary: "#b8ff3d", background: "#111111", text: "#f7f7f2", font: "sans", density: "compact", radius: "none" },
    createSections: () => [
      section("hero", "Ouverture", { eyebrow: "Photographe documentaire", heading: "Histoires humaines, lumière naturelle.", text: "Séries réalisées entre Dakar, Marseille et Montréal." }),
      section("projects", "Séries", { items: [
        { title: "Après la pluie", subtitle: "Dakar · 2026", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80" },
        { title: "Le grand bleu", subtitle: "Marseille · 2025", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd4297?auto=format&fit=crop&w=1200&q=80" },
        { title: "Nuits blanches", subtitle: "Montréal · 2024", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80" },
      ] }),
      section("about", "À propos", { text: "Je photographie les gestes, les lieux et les liens qui racontent notre époque." }),
      section("contact", "Contact", { email: "hello@lens.photo", text: "Commandes éditoriales, portraits et collaborations." }),
    ],
  },
  {
    id: "career",
    name: "Career",
    genre: "CV · Développeur",
    description: "Un profil clair et crédible pour raconter un parcours professionnel.",
    accent: "#6558f5",
    theme: { primary: "#6558f5", background: "#f8f9fc", text: "#162033", font: "sans", density: "comfortable", radius: "soft" },
    createSections: () => [
      section("hero", "Profil", { eyebrow: "Product Engineer", heading: "Je transforme des problèmes complexes en produits simples.", text: "7 ans d’expérience en TypeScript, React et systèmes distribués.", cta: "Me contacter" }),
      section("experience", "Expérience", { items: [
        { title: "Lead Engineer · Nova", subtitle: "2023 — Aujourd’hui", description: "Pilotage d’une équipe de 6 personnes et refonte de la plateforme B2B." },
        { title: "Frontend Engineer · Orbit", subtitle: "2020 — 2023", description: "Design system et applications utilisées par 40 000 clients." },
      ] }),
      section("skills", "Compétences", { items: [
        { title: "TypeScript & React" }, { title: "Node.js & PostgreSQL" }, { title: "Product thinking" }, { title: "Leadership technique" },
      ] }),
      section("projects", "Projets", { items: [{ title: "Open Metrics", description: "Suite open source de monitoring web.", url: "https://github.com" }] }),
      section("contact", "Travaillons ensemble", { email: "alex@example.com", location: "Lyon · Remote" }),
    ],
  },
  {
    id: "independent",
    name: "Independent",
    genre: "Freelance · Consultant",
    description: "Une vitrine chaleureuse qui convertit les visiteurs en clients.",
    accent: "#087f5b",
    theme: { primary: "#087f5b", background: "#fffdf7", text: "#24332e", font: "serif", density: "comfortable", radius: "round" },
    createSections: () => [
      section("hero", "Bienvenue", { eyebrow: "Consultante en stratégie de contenu", heading: "Votre expertise mérite d’être comprise.", text: "J’aide les entreprises engagées à trouver les mots justes et une voix qui leur ressemble.", cta: "Réserver un appel" }),
      section("about", "Mon approche", { heading: "Clarté, écoute, impact.", text: "Une méthode collaborative, de l’audit à la livraison, pour créer des contenus qui servent vraiment vos objectifs." }),
      section("testimonials", "Ce qu’ils en disent", { items: [
        { title: "Camille, fondatrice de Noma", description: "Une collaboration fluide et un résultat qui a dépassé nos attentes." },
        { title: "Yanis, CEO de Sobri", description: "Notre positionnement est enfin limpide. Les résultats ont suivi." },
      ] }),
      section("contact", "Votre projet", { email: "bonjour@example.com", text: "Racontez-moi où vous en êtes. Je réponds sous 48 heures." }),
    ],
  },
];

const productTemplate = (
  id: "creatif" | "cv_freelance" | "agence" | "photo",
  name: string,
  genre: string,
  description: string,
  accent: string,
  theme: PortfolioTheme,
  createContent: () => PortfolioSection[],
): PortfolioTemplate => ({
  id,
  name,
  genre,
  description,
  accent,
  theme,
  createSections: () => createContent().map((item, order) => ({ ...item, order })),
});

export const templates: PortfolioTemplate[] = [
  productTemplate(
    "creatif",
    "Studio",
    "Créatif",
    "Une grille éditoriale audacieuse pour présenter une pratique et ses projets.",
    "#ff5c35",
    legacyTemplates[0].theme,
    () => [
      section("hero", "Hero", { eyebrow: "Designer indépendant · Paris", heading: "Des idées qui prennent forme.", text: "Identité, direction artistique et expériences numériques.", cta: "Voir mes projets", ctaUrl: "#projets" }),
      section("projects", "Projets", { items: [
        { title: "Maison Matisse", description: "Une identité solaire pour un lieu de vie méditerranéen.", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80", url: "#" },
        { title: "Folio Objects", description: "Un catalogue digital pour des objets singuliers.", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", url: "#" },
      ] }),
      section("about", "À propos", { heading: "Petit studio, grandes idées.", text: "Je collabore avec des équipes ambitieuses pour créer des marques utiles, belles et cohérentes.", image: "" }),
      section("contact", "Contact", { email: "bonjour@studio.fr", phone: "", text: "Parlons de votre prochain projet.", links: [{ label: "Instagram", url: "https://instagram.com" }], messageEnabled: true }),
    ],
  ),
  productTemplate(
    "cv_freelance",
    "Career",
    "CV · Freelance",
    "Un profil clair et crédible pour raconter un parcours et convertir des missions.",
    "#6558f5",
    legacyTemplates[2].theme,
    () => [
      section("hero", "Hero", { eyebrow: "Product Engineer · Freelance", heading: "Je transforme des problèmes complexes en produits simples.", text: "7 ans d’expérience en TypeScript, React et systèmes distribués.", cta: "Me contacter", ctaUrl: "#contact" }),
      section("projects", "Projets", { items: [
        { title: "Plateforme Nova", description: "Refonte d’une plateforme B2B utilisée par 40 000 clients.", url: "#" },
        { title: "Open Metrics", description: "Suite open source de monitoring web.", url: "https://github.com" },
      ] }),
      section("about", "À propos", { heading: "Produit, code et transmission.", text: "J’accompagne les équipes de la stratégie jusqu’à la mise en production, avec une attention particulière à la qualité et à l’autonomie." }),
      section("contact", "Contact", { email: "alex@example.com", phone: "+33 6 00 00 00 00", text: "Disponible pour une nouvelle mission.", links: [{ label: "LinkedIn", url: "https://linkedin.com" }, { label: "GitHub", url: "https://github.com" }], messageEnabled: true }),
    ],
  ),
  productTemplate(
    "agence",
    "Independent",
    "Agence",
    "Une vitrine chaleureuse qui présente l’expertise, les réalisations et le contact.",
    "#087f5b",
    legacyTemplates[3].theme,
    () => [
      section("hero", "Hero", { eyebrow: "Agence de stratégie & contenu", heading: "Votre expertise mérite d’être comprise.", text: "Nous aidons les entreprises engagées à trouver les mots justes et une voix qui leur ressemble.", cta: "Découvrir nos projets", ctaUrl: "#projets" }),
      section("projects", "Projets", { items: [
        { title: "Noma", description: "Plateforme de marque et campagne de lancement.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80", url: "#" },
        { title: "Sobri", description: "Positionnement, identité verbale et site éditorial.", image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80", url: "#" },
      ] }),
      section("about", "À propos", { heading: "Clarté, écoute, impact.", text: "Une équipe senior et une méthode collaborative, de l’audit à la livraison, pour créer des expériences qui servent vos objectifs." }),
      section("contact", "Contact", { email: "bonjour@agence.fr", phone: "+33 1 84 80 20 20", text: "Construisons la suite ensemble.", links: [{ label: "LinkedIn", url: "https://linkedin.com" }], messageEnabled: true }),
    ],
  ),
  productTemplate(
    "photo",
    "Lens",
    "Photo",
    "Un portfolio immersif et minimal pensé pour laisser toute la place aux images.",
    "#b8ff3d",
    legacyTemplates[1].theme,
    () => [
      section("hero", "Hero", { eyebrow: "Photographe documentaire", heading: "Histoires humaines, lumière naturelle.", text: "Séries réalisées entre Dakar, Marseille et Montréal.", cta: "Voir les séries", ctaUrl: "#projets", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd4297?auto=format&fit=crop&w=1600&q=80" }),
      section("projects", "Projets", { items: [
        { title: "Après la pluie", description: "Dakar · 2026", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80" },
        { title: "Le grand bleu", description: "Marseille · 2025", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd4297?auto=format&fit=crop&w=1200&q=80" },
        { title: "Nuits blanches", description: "Montréal · 2024", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80" },
      ] }),
      section("about", "À propos", { heading: "Observer avant de cadrer.", text: "Je photographie les gestes, les lieux et les liens qui racontent notre époque." }),
      section("contact", "Contact", { email: "hello@lens.photo", phone: "", text: "Commandes éditoriales, portraits et collaborations.", links: [{ label: "Instagram", url: "https://instagram.com" }], messageEnabled: false }),
    ],
  ),
];

export const defaultSection = (type: PortfolioSection["type"]): PortfolioSection => {
  const names: Record<PortfolioSection["type"], string> = {
    hero: "Introduction", about: "À propos", projects: "Projets", experience: "Expérience",
    skills: "Compétences", testimonials: "Témoignages", contact: "Contact", custom: "Nouveau bloc",
  };
  return section(type, names[type], type === "hero"
    ? { heading: "Votre grand titre", text: "Présentez votre univers en quelques mots." }
    : type === "contact"
      ? { email: "vous@example.com", text: "Une invitation à vous contacter." }
      : type === "projects" || type === "experience" || type === "skills" || type === "testimonials"
        ? { items: [{ title: "Premier élément", description: "Ajoutez une description." }] }
        : { heading: names[type], text: "Écrivez votre contenu ici." });
};

const legacyAliases: Record<string, string> = {
  studio: "creatif",
  career: "cv_freelance",
  independent: "agence",
  lens: "photo",
};

export const getTemplate = (id: string) => templates.find((template) => template.id === (legacyAliases[id] ?? id)) ?? templates[0];
