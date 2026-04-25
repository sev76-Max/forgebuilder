// src/lib/generator.ts
import { SiteConfig } from "./site-config";

const templates: Record<string, Partial<SiteConfig>> = {
  plombier: {
    meta: { 
      siteName: "Plombier Pro", 
      description: "Expert en plomberie et chauffage", 
      theme: { primaryColor: "#2563EB", fontFamily: "Inter" } 
    },
    sections: [
      { type: 'hero', data: { headline: "Plombier à Paris : Intervention en 30min", subheadline: "Fuite, dégât des eaux, chauffage. Dépannage rapide et tarifs clairs.", ctaText: "Appeler maintenant", ctaLink: "tel:+33123456789", imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1470&q=80" } },
      { type: 'features', data: { title: "Nos Engagements", items: [ { icon: "Zap", title: "Urgence 24/7", description: "Intervention rapide sur Paris et environs." }, { icon: "Shield", title: "Devis Gratuit", description: "Pas de mauvaise surprise, prix fixé à l'avance." } ] } },
      { type: 'cta', data: { title: "Une urgence ? Nous sommes disponibles.", buttonText: "Contacter l'expert", buttonLink: "tel:+33123456789" } },
      { type: 'footer', data: {} }
    ]
  },
  coach: {
    meta: { 
      siteName: "Coach Sportif", 
      description: "Coaching personnel et fitness", 
      theme: { primaryColor: "#10B981", fontFamily: "Inter" } 
    },
    sections: [
      { type: 'hero', data: { headline: "Transformez votre corps, changez de vie", subheadline: "Coaching sportif personnalisé. Perdez du poids, gagnez en énergie.", ctaText: "Réserver une séance", ctaLink: "#contact", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1469&q=80" } },
      { type: 'features', data: { title: "Ma Méthode", items: [ { icon: "Zap", title: "Programme Sur Mesure", description: "Adapté à vos objectifs et votre emploi du temps." }, { icon: "Heart", title: "Suivi Nutrition", description: "Conseils alimentaires pour maximiser vos résultats." } ] } },
      { type: 'cta', data: { title: "Prêt à reprendre le contrôle ?", buttonText: "Prendre RDV", buttonLink: "#contact" } },
      { type: 'footer', data: {} }
    ]
  },
  default: {
    meta: { 
      siteName: "ForgeBuilder Site", 
      description: "Site généré par ForgeBuilder", 
      theme: { primaryColor: "#F97316", fontFamily: "Inter" } 
    },
    sections: [
      { type: 'hero', data: { headline: "Forgez votre succès", subheadline: "Un site web puissant prêt en quelques secondes.", ctaText: "Commencer", ctaLink: "#start", imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1470&q=80" } },
      { type: 'cta', data: { title: "Créez votre site aujourd'hui.", buttonText: "Lancer ForgeBuilder", buttonLink: "#" } },
      { type: 'footer', data: {} }
    ]
  }
};

export function generateFromPrompt(prompt: string): SiteConfig {
  const lowerPrompt = prompt.toLowerCase();
  let selectedTemplate = templates.default;
  
  if (lowerPrompt.includes("plombier") || lowerPrompt.includes("plomberie") || lowerPrompt.includes("fuite")) {
    selectedTemplate = templates.plombier;
  } else if (lowerPrompt.includes("coach") || lowerPrompt.includes("sport") || lowerPrompt.includes("fitness")) {
    selectedTemplate = templates.coach;
  }

  return {
    meta: {
      ...(selectedTemplate.meta || {}),
      description: prompt
    },
    sections: selectedTemplate.sections || []
  } as SiteConfig;
}