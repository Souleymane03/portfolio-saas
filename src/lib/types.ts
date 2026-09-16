export type SectionType =
  | "hero"
  | "about"
  | "projects"
  | "experience"
  | "skills"
  | "testimonials"
  | "contact"
  | "custom";

export type ProductSectionType = "hero" | "projects" | "about" | "contact";

export type PortfolioSection = {
  id: string;
  order?: number;
  type: SectionType;
  title: string;
  data: {
    heading?: string;
    text?: string;
    image?: string;
    eyebrow?: string;
    cta?: string;
    ctaUrl?: string;
    email?: string;
    phone?: string;
    location?: string;
    links?: Array<{ label: string; url: string }>;
    messageEnabled?: boolean;
    items?: Array<{
      title: string;
      subtitle?: string;
      description?: string;
      image?: string;
      url?: string;
    }>;
  };
};

export type PortfolioTheme = {
  primary: string;
  background: string;
  text: string;
  font: "sans" | "serif" | "mono";
  density: "compact" | "comfortable" | "airy";
  radius: "none" | "soft" | "round";
};

export type PortfolioStatus = "draft" | "unlisted" | "published";

export type Portfolio = {
  id: string;
  userId: string;
  title: string;
  slug: string;
  template: string;
  status: PortfolioStatus;
  theme: PortfolioTheme;
  sections: PortfolioSection[];
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};
