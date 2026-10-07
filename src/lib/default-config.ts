import type { SiteConfig } from "./site-config";

export const DEFAULT_CONFIG: SiteConfig = {
  meta: {
    siteName: "ForgeBuilder",
    description: "Attente",
    phone: "",
    address: "",
    theme: { primaryColor: "#F97316", fontFamily: "Inter" },
  },
  sections: [
    {
      type: "hero",
      data: {
        headline: "Bienvenue",
        subheadline: "Décrivez votre projet.",
        ctaText: "Commencer",
        ctaLink: "#",
        imageUrl:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80",
      },
    },
  ],
};