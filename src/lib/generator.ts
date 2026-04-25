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
  // NOUVEAU TEMPLATE BOUTIQUE
  boutique: {
    meta: { 
      siteName: "Ma Boutique Africaine", 
      description: "Vente de produits artisanaux et mode", 
      theme: { primaryColor: "#D97706", fontFamily: "Inter" } 
    },
    sections: [
      { type: 'hero', data: { headline: "L'Artisanat Africain à Portée de Main", subheadline: "Découvrez notre collection unique de vêtements, bijoux et objets d'art faits main.", ctaText: "Voir la Boutique", ctaLink: "#products", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1470&q=80" } },
      { 
        type: 'products', 
        data: { 
          title: "Nos Produits Stars", 
          items: [
            { title: "Robe Wax Premium", price: "25 000 FCFA", imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80", description: "Coton 100% naturel, coupe moderne." },
            { title: "Sac en Cuir Artisanal", price: "25 000 FCFA", imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80", description: "Fabriqué à la main par des artisans locaux." },
            { title: "Bijoux Fantaisie Or", price: "10 000 FCFA", imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80", description: "Accessoires élégants pour toutes les occasions." },
            { title: "Tableau Décoratif", price: "45 000 FCFA", imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80", description: "Peinture abstraite unique." }
          ] 
        } 
      },
      { type: 'cta', data: { title: "Commande spéciale ou question ?", buttonText: "Nous Contacter sur WhatsApp", buttonLink: "https://wa.me/221000000000" } },
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
  // NOUVELLE CONDITION
  else if (lowerPrompt.includes("boutique") || lowerPrompt.includes("shop") || lowerPrompt.includes("vendeur") || lowerPrompt.includes("e-commerce")) {
    selectedTemplate = templates.boutique;
  }

  return {
    meta: {
      ...(selectedTemplate.meta || {}),
      description: prompt
    },
    sections: selectedTemplate.sections || []
  } as SiteConfig;
}