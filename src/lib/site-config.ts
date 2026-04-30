/// src/lib/site-config.ts
export interface SiteConfig {
  meta: {
    siteName: string;
    description: string;
    contactEmail?: string;
    phone?: string;
    address?: string;
    phoneType?: string; // 'tel' ou 'whatsapp'
    // Réseaux sociaux
    socialFacebook?: string;
    socialInstagram?: string;
    socialTwitter?: string;
    socialLinkedin?: string;
    
    theme: {
      primaryColor: string;
      textColor?: string;
      secondaryTextColor?: string;
      fontSize?: number;
      secondaryFontSize?: number;
      fontFamily?: string;
      brandColor?: string;
      brandFont?: string;
      logoUrl?: string;
      logoLetter?: string;
      logoStyle?: string;
      logoColor?: string;
      featureTitleColor?: string;
      featureDescColor?: string;
      featureFontSize?: number;
      featureFontFamily?: string;
      globalBgColor?: string;
      supabaseUrl?: string;
      supabaseKey?: string;
    };
    layoutStyle?: string;
  };
  sections: any[];
}

export interface Section {
  type: 'hero' | 'features' | 'testimonials' | 'video' | 'contact_form' | 'footer' | 'cta' | 'about' | 'newsletter' | 'blog';
  data: any;
}

export const currentSiteConfig: SiteConfig = {
  meta: {
    siteName: "ForgeBuilder Demo",
    description: "Un site généré par ForgeBuilder",
    theme: {
      primaryColor: "#F97316",
      fontFamily: "Inter"
    }
  },
  sections: [
    {
      type: 'hero',
      data: {
        headline: "Forgez votre présence digitale",
        subheadline: "En quelques clics, transformez votre idée en un site web performant et prêt à convertir.",
        ctaText: "Commencer à forger",
        ctaLink: "#start",
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
      }
    },
    {
      type: 'features',
      data: {
        title: "Nos outils de précision",
        items: [
          { icon: "Zap", title: "Vitesse Instantanée", description: "Génération du site en moins de 10 secondes grâce à l'IA." },
          { icon: "Shield", title: "Structure Robuste", description: "Code optimisé SEO pour résister aux aléas du web." },
          { icon: "Settings", title: "Personnalisation Totale", description: "Changez les couleurs et le texte sans écrire une ligne de code." }
        ]
      }
    },
    {
      type: 'cta',
      data: {
        title: "Prêt à lancer votre projet ?",
        buttonText: "Demander une démo",
        buttonLink: "#contact"
      }
    }
  ]
};