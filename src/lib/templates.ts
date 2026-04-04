// src/lib/templates.ts
import { SiteConfig } from "./site-config";

export interface Template {
  name: string;
  icon: string;
  category: string;
  config: SiteConfig;
}

const createBaseConfig = (name: string, headline: string, subheadline: string, image: string, primaryColor: string): SiteConfig => ({
  meta: {
    siteName: name,
    description: `Site pour ${name}`,
    phone: "",
    address: "",
    theme: {
      primaryColor: primaryColor,
      fontFamily: "Inter",
      brandColor: primaryColor,
      logoColor: primaryColor,
      textColor: "#ffffff",
      secondaryTextColor: "#e5e7eb",
      featureTitleColor: "#111827",
      featureDescColor: "#4b5563",
      globalBgColor: "#ffffff"
    }
  },
  sections: [
    { type: 'hero', data: { headline, subheadline, ctaText: "Découvrir", ctaLink: "#", imageUrl: image } },
    { type: 'features', data: { title: "Nos Services", items: [
      { title: "Service 1", description: "Description professionnelle." },
      { title: "Service 2", description: "Description du deuxième point fort." },
      { title: "Service 3", description: "Troisième élément clé." }
    ]}},
    { type: 'testimonials', data: { title: "Avis Clients", items: [ { author: "Client Satisfait", quote: "Un service exceptionnel !", role: "Client Fidèle" } ] } },
    { type: 'about', data: { title: "À Propos", content: `Chez ${name}, nous nous engageons à offrir le meilleur.`, imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" } }
  ]
});

export const TEMPLATES: Template[] = [
  { name: "Restaurant", icon: "🍽️", category: "Alimentation", config: createBaseConfig("Le Gourmet", "Une expérience culinaire unique", "Savourez des plats raffinés.", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80", "#d97706") },
  { name: "Immobilier", icon: "🏠", category: "Immobilier", config: createBaseConfig("ImmoConseil", "Trouvez la maison de vos rêves", "Experts en biens immobiliers.", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80", "#2563eb") },
  { name: "Avocat", icon: "⚖️", category: "Services", config: createBaseConfig("JurisDroit", "Votre défense, notre priorité", "Excellence juridique.", "https://images.unsplash.com/photo-1505664194779-24be23b1e4b4?auto=format&fit=crop&w=1920&q=80", "#1f2937") },
  { name: "Photographe", icon: "📷", category: "Créatif", config: createBaseConfig("Studio Flash", "L'art de capturer l'instant", "Photographie professionnelle.", "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80", "#ec4899") },
  { name: "Startup", icon: "🚀", category: "Tech", config: createBaseConfig("TechNova", "L'innovation commence ici", "Solutions SaaS révolutionnaires.", "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80", "#6366f1") },
  { name: "Santé", icon: "🦷", category: "Santé", config: createBaseConfig("DentairePlus", "Sourire éclatant garanti", "Soins dentaires de pointe.", "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80", "#14b8a6") },
  { name: "Beauté", icon: "💇‍♀️", category: "Beauté", config: createBaseConfig("Style & Chic", "Sublimez votre personnalité", "Colorations et soins.", "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80", "#f43f5e") },
  { name: "Sport", icon: "🏋️", category: "Sport", config: createBaseConfig("Iron Gym", "Dépassez vos limites", "Coaching personnalisé.", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80", "#ef4444") },
  { name: "Éducation", icon: "🎓", category: "Éducation", config: createBaseConfig("Académie Savoir", "Excellence académique", "Formation d'excellence.", "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80", "#0ea5e9") },
  { name: "Auto École", icon: "🚗", category: "Service", config: createBaseConfig("Conduite Pro", "Votre permis, notre mission", "Apprentissage rapide.", "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80", "#f59e0b") },
  { name: "Hôtel", icon: "🏨", category: "Hôtellerie", config: createBaseConfig("Palace Resort", "Séjour inoubliable", "Luxe et calme.", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80", "#ca8a04") },
  { name: "ONG", icon: "🤝", category: "ONG", config: createBaseConfig("Solidarité Monde", "Ensemble, changeons des vies", "Aide humanitaire.", "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1920&q=80", "#22c55e") },
  { name: "Boulangerie", icon: "🥐", category: "Alimentation", config: createBaseConfig("Le Fournil", "Pains artisanaux", "Le bon goût du fait maison.", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=80", "#a16207") },
  { name: "Événementiel", icon: "🎉", category: "Service", config: createBaseConfig("Dream Events", "Créateurs de moments magiques", "Organisation de soirées.", "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80", "#a855f7") },
  { name: "Bâtiment", icon: "🔧", category: "Bâtiment", config: createBaseConfig("Plomberie Express", "Intervention rapide 24h/24", "Dépannage et installation.", "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1920&q=80", "#3b82f6") }
];