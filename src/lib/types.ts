export type SectionType =
  | "hero"
  | "about"
  | "projects"
  | "experience"
  | "skills"
  | "testimonials"
  | "contact"
  | "custom";

export type PortfolioSection = {
  id: string;
  type: SectionType;
  title: string;
  data: {
    heading?: string;
    text?: string;
    image?: string;
    eyebrow?: string;
    cta?: string;
    email?: string;
    location?: string;
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
