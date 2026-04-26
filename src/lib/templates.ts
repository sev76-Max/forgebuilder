// src/lib/templates.ts
import { SiteConfig } from "./site-config";

export interface Template {
  name: string;
  icon: string;
  category: string;
  config: SiteConfig;
}

export const TEMPLATES: Template[] = [
  {
    name: "Restaurant Gastronomique",
    icon: "🍽️",
    category: "Alimentation",
    config: {
      meta: {
        siteName: "Le Gourmet",
        description: "Restaurant gastronomique français, cuisine créative et vins fins.",
        phone: "+33 1 23 45 67 89",
        address: "12 Rue de la Paix, Paris",
        theme: { primaryColor: "#c2410c", fontFamily: "Playfair Display", brandColor: "#c2410c", logoColor: "#c2410c", textColor: "#1c1917", secondaryTextColor: "#78716c", featureTitleColor: "#1c1917", featureDescColor: "#57534e", globalBgColor: "#fafaf9" }
      },
      sections: [
        { type: 'hero', data: { headline: "L'Art Culinaire à l'État Pur", subheadline: "Une expérience gastronomique inoubliable au cœur de Paris. Produits de saison, cuisine raffinée.", ctaText: "Réserver une table", ctaLink: "tel:+33123456789", imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80" } },
        { type: 'products', data: { title: "Suggestions du Chef", items: [
          { title: "Filet de Bœuf Rossini", price: "45 €", description: "Foie gras poêlé, jus truffé.", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
          { title: "Saint-Jacques Dorées", price: "38 €", description: "Émulsion de champagne, caviar.", imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80" },
          { title: "Soufflé au Grand Marnier", price: "16 €", description: "La douceur classique revisitée.", imageUrl: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=600&q=80" }
        ]}},
        { type: 'testimonials', data: { title: "Ils ont savouré", items: [ { author: "Marie L.", quote: "Une mise en bouche divine ! Le service est impeccable.", role: "Critique Culinaire" } ] } },
        { type: 'footer', data: {} }
      ]
    }
  },
  {
    name: "Cabinet d'Avocat",
    icon: "⚖️",
    category: "Services",
    config: {
      meta: {
        siteName: "JurisDroit",
        description: "Cabinet d'avocats d'affaires et de droit des familles. Défense et conseil.",
        phone: "+33 1 98 76 54 32",
        address: "8 Avenue Matignon, Paris",
        theme: { primaryColor: "#1e293b", fontFamily: "Merriweather", brandColor: "#334155", logoColor: "#1e293b", textColor: "#0f172a", secondaryTextColor: "#475569", featureTitleColor: "#0f172a", featureDescColor: "#334155", globalBgColor: "#f8fafc" }
      },
      sections: [
        { type: 'hero', data: { headline: "Votre Défense, Notre Priorité", subheadline: "Expertise juridique et accompagnement personnalisé. Droit des affaires, immobilier et famille.", ctaText: "Prendre RDV", ctaLink: "#contact", imageUrl: "https://images.unsplash.com/photo-1505664194779-24be23b1e4b4?auto=format&fit=crop&w=1920&q=80" } },
        { type: 'features', data: { title: "Nos Domaines d'Expertise", items: [
          { title: "Droit des Affaires", description: "Création d'entreprises, contrats commerciaux, contentieux." },
          { title: "Droit Immobilier", description: "Acquisition, vente, litiges locatifs et copropriété." },
          { title: "Droit de la Famille", description: "Divorce, garde d'enfants, successions et héritages." }
        ]}},
        { type: 'testimonials', data: { title: "Témoignages", items: [ { author: "Pierre D.", quote: "Un cabinet à l'écoute, rigoureux et très réactif.", role: "Chef d'Entreprise" } ] } },
        { type: 'footer', data: {} }
      ]
    }
  },
  {
    name: "Agence Immobilière",
    icon: "🏠",
    category: "Immobilier",
    config: {
      meta: {
        siteName: "ImmoConseil",
        description: "Agence immobilière spécialisée dans le luxe et l'investissement locatif.",
        phone: "+33 1 11 22 33 44",
        address: "25 Boulevard Haussmann, Paris",
        theme: { primaryColor: "#2563eb", fontFamily: "Montserrat", brandColor: "#2563eb", logoColor: "#2563eb", textColor: "#0f172a", secondaryTextColor: "#64748b", featureTitleColor: "#0f172a", featureDescColor: "#334155", globalBgColor: "#ffffff" }
      },
      sections: [
        { type: 'hero', data: { headline: "Trouvez la Maison de Vos Rêves", subheadline: "Expertise de luxe, service sur mesure. Appartements, villas et investissements.", ctaText: "Voir les biens", ctaLink: "#contact", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80" } },
        { type: 'features', data: { title: "Nos Services", items: [
          { title: "Vente de Prestige", description: "Estimation précise et marketing international." },
          { title: "Gestion Locative", description: "Optimisation de rendement et sérénité." },
          { title: "Conseil Investissement", description: "Défiscalisation et stratégies patrimoniales." }
        ]}},
        { type: 'footer', data: {} }
      ]
    }
  },
  {
    name: "Salon de Coiffure",
    icon: "💇‍♀️",
    category: "Beauté",
    config: {
      meta: {
        siteName: "Style & Chic",
        description: "Salon de coiffure tendance, coloration, coupes et soins capillaires.",
        phone: "+33 6 55 44 33 22",
        address: "Rue du Commerce, Dakar",
        theme: { primaryColor: "#db2777", fontFamily: "Poppins", brandColor: "#db2777", logoColor: "#db2777", textColor: "#1f2937", secondaryTextColor: "#6b7280", featureTitleColor: "#1f2937", featureDescColor: "#4b5563", globalBgColor: "#fdf2f8" }
      },
      sections: [
        { type: 'hero', data: { headline: "Sublimez Votre Personnalité", subheadline: "Colorations naturelles, coupes tendance et soins profonds. Prenez rendez-vous dès maintenant.", ctaText: "Réserver", ctaLink: "https://wa.me/33655443322", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80" } },
        { type: 'products', data: { title: "Nos Soins Signature", items: [
          { title: "Coupe + Brushing", price: "25 000 FCFA", description: "Coupes modernes et mise en forme.", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
          { title: "Coloration Ammonia-Free", price: "35 000 FCFA", description: "Respect du cheveu et brillance.", imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80" },
          { title: "Tresses Africaines", price: "15 000 FCFA", description: "Styles variés, rapidité et soin.", imageUrl: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=600&q=80" }
        ]}},
        { type: 'testimonials', data: { title: "Avis Clients", items: [ { author: "Aminata S.", quote: "Le meilleur salon de Dakar ! Ambiance sympa et résultat top.", role: "Cliente Fidèle" } ] } },
        { type: 'footer', data: {} }
      ]
    }
  },
  {
    name: "Salle de Sport",
    icon: "🏋️",
    category: "Sport",
    config: {
      meta: {
        siteName: "Iron Gym",
        description: "Salle de musculation et fitness. Coaching personnel et cours collectifs.",
        phone: "+33 6 12 34 56 78",
        address: "Zone Commerciale, Abidjan",
        theme: { primaryColor: "#dc2626", fontFamily: "Oswald", brandColor: "#dc2626", logoColor: "#dc2626", textColor: "#171717", secondaryTextColor: "#525252", featureTitleColor: "#171717", featureDescColor: "#404040", globalBgColor: "#fafafa" }
      },
      sections: [
        { type: 'hero', data: { headline: "Dépassez Vos Limites", subheadline: "Equipements pro, coachs diplômés. Transformez votre corps et votre esprit.", ctaText: "Essai Gratuit", ctaLink: "#contact", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80" } },
        { type: 'features', data: { title: "Nos Disciplines", items: [
          { title: "Musculation", description: "Zone libre service et machines guidées." },
          { title: "CrossFit", description: "Cours intenses pour les plus motivés." },
          { title: "Yoga & Stretching", description: "Récupération et souplesse." }
        ]}},
        { type: 'testimonials', data: { title: "Résultats", items: [ { author: "Kofi A.", quote: "J'ai perdu 10kg en 3 mois grâce aux coachs. Merci !", role: "Membre depuis 2023" } ] } },
        { type: 'footer', data: {} }
      ]
    }
  },
  {
    name: "Boulangerie Artisanale",
    icon: "🥐",
    category: "Alimentation",
    config: {
      meta: {
        siteName: "Le Fournil Doré",
        description: "Boulangerie artisanale, pains anciens, pâtisseries fines et viennoiseries.",
        phone: "+33 1 55 66 77 88",
        address: "3 Rue de la Boulangerie, Lyon",
        theme: { primaryColor: "#a16207", fontFamily: "Crimson Pro", brandColor: "#a16207", logoColor: "#a16207", textColor: "#292524", secondaryTextColor: "#78716c", featureTitleColor: "#292524", featureDescColor: "#57534e", globalBgColor: "#fffbeb" }
      },
      sections: [
        { type: 'hero', data: { headline: "Le Goût de l'Authentique", subheadline: "Pains au levain, pâtisseries maison. Fait avec passion chaque matin.", ctaText: "Voir nos créations", ctaLink: "#products", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=80" } },
        { type: 'products', data: { title: "Aujourd'hui en Vitrine", items: [
          { title: "Pain Campagne", price: "4,50 €", description: "Levain naturel, croûte croustillante.", imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80" },
          { title: "Croissant Beurre", price: "1,20 €", description: "Pur beurre AOP, feuilleté 24h.", imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80" },
          { title: "Éclair Chocolat", price: "3,00 €", description: "Crème pâtissière onctueuse.", imageUrl: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=600&q=80" }
        ]}},
        { type: 'footer', data: {} }
      ]
    }
  },
  {
    name: "Startup Tech",
    icon: "🚀",
    category: "Tech",
    config: {
      meta: {
        siteName: "TechNova",
        description: "Solution SaaS pour la gestion d'entreprise. Automatisation et IA.",
        phone: "",
        address: "Station F, Paris",
        contactEmail: "contact@technova.io",
        // CORRECTION: suppression de layoutStyle
        theme: { primaryColor: "#6366f1", fontFamily: "Inter", brandColor: "#6366f1", logoColor: "#6366f1", textColor: "#0f172a", secondaryTextColor: "#94a3b8", featureTitleColor: "#0f172a", featureDescColor: "#475569", globalBgColor: "#0f172a" }
      },
      sections: [
        { type: 'hero', data: { headline: "L'Innovation Commence Ici", subheadline: "Automatisez vos processus avec notre IA nouvelle génération. Gagnez des heures par semaine.", ctaText: "Essai Gratuit 14j", ctaLink: "#contact", imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80" } },
        { type: 'features', data: { title: "Pourquoi Nous Choisir ?", items: [
          { title: "Intégration Rapide", description: "Connectez vos outils en 1 clic." },
          { title: "IA Intégrée", description: "Analyse prédictive de vos données." },
          { title: "Support 24/7", description: "Une équipe dédiée à votre succès." }
        ]}},
        { type: 'testimonials', data: { title: "Ce qu'ils disent", items: [ { author: "Sarah K.", quote: "Notre productivité a augmenté de 40% en 2 mois.", role: "CEO, LogiStart" } ] } },
        { type: 'footer', data: {} }
      ]
    }
  },
  {
    name: "Cabinet Dentaire",
    icon: "🦷",
    category: "Santé",
    config: {
      meta: {
        siteName: "DentairePlus",
        description: "Cabinet dentaire moderne. Soins, orthodontie et esthétique dentaire.",
        phone: "+33 1 44 55 66 77",
        address: "15 Avenue des Champs-Élysées, Paris",
        theme: { primaryColor: "#0891b2", fontFamily: "Lato", brandColor: "#0891b2", logoColor: "#0891b2", textColor: "#164e63", secondaryTextColor: "#67e8f9", featureTitleColor: "#0f172a", featureDescColor: "#334155", globalBgColor: "#ecfeff" }
      },
      sections: [
        { type: 'hero', data: { headline: "Sourire Éclatant Garanti", subheadline: "Technologies de pointe et soins doux. Votre santé dentaire entre de bonnes mains.", ctaText: "Prendre RDV", ctaLink: "tel:+33144556677", imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80" } },
        { type: 'features', data: { title: "Nos Soins", items: [
          { title: "Dentisterie Générale", description: "Détartrage, soins des caries, dévitalisation." },
          { title: "Orthodontie", description: "Appareils fixes et invisibles (Invisalign)." },
          { title: "Blanchiment", description: "Technique LED pour un sourire blanc éclatant." }
        ]}},
        { type: 'testimonials', data: { title: "Patients Satisfaits", items: [ { author: "Jean-Marc D.", quote: "Indolore et très professionnel. Je recommande vivement.", role: "Patient" } ] } },
        { type: 'footer', data: {} }
      ]
    }
  },
  {
    name: "Photographe Pro",
    icon: "📷",
    category: "Créatif",
    config: {
      meta: {
        siteName: "Studio Flash",
        description: "Photographe professionnel : Portrait, Mariage, Corporate.",
        phone: "+33 6 99 88 77 66",
        address: "Paris et Banlieue",
        theme: { primaryColor: "#ec4899", fontFamily: "Dancing Script", brandColor: "#ec4899", logoColor: "#ec4899", textColor: "#1f2937", secondaryTextColor: "#6b7280", featureTitleColor: "#1f2937", featureDescColor: "#374151", globalBgColor: "#fdf2f8" }
      },
      sections: [
        { type: 'hero', data: { headline: "L'Art de Capturer l'Instant", subheadline: "Photographie de portrait, mariage et événementiel. Créons ensemble vos souvenirs inoubliables.", ctaText: "Voir le Portfolio", ctaLink: "#contact", imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80" } },
        { type: 'features', data: { title: "Mes Prestations", items: [
          { title: "Portrait Studio", description: "Headshots pro et photos de famille." },
          { title: "Mariage", description: "Couverture complète de votre journée." },
          { title: "Événementiel", description: "Soirées, conférences, lancements." }
        ]}},
        { type: 'testimonials', data: { title: "Avis", items: [ { author: "Couple A.", quote: "Des photos magnifiques, nous sommes comblés !", role: "Mariés" } ] } },
        { type: 'footer', data: {} }
      ]
    }
  },
  {
    name: "Auto École",
    icon: "🚗",
    category: "Service",
    config: {
      meta: {
        siteName: "Conduite Pro",
        description: "Auto-école performante. Taux de réussite élevé, forfaits adaptés.",
        phone: "+33 1 23 45 67 89",
        address: "Centre ville, Nantes",
        theme: { primaryColor: "#f59e0b", fontFamily: "Poppins", brandColor: "#f59e0b", logoColor: "#f59e0b", textColor: "#1f2937", secondaryTextColor: "#6b7280", featureTitleColor: "#1f2937", featureDescColor: "#4b5563", globalBgColor: "#fffbeb" }
      },
      sections: [
        { type: 'hero', data: { headline: "Votre Permis, Notre Mission", subheadline: "Code et conduite accompagnée. Forfaits tout compris à prix compétitifs.", ctaText: "S'inscrire", ctaLink: "tel:+33123456789", imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80" } },
        { type: 'features', data: { title: "Nos Offres", items: [
          { title: "Forfait Permis B", description: "20h de conduite, code illimité." },
          { title: "Conduite Accompagnée", description: "Dès 16 ans, formule encadrée." },
          { title: "Perfectionnement", description: "Remise en confiance au volant." }
        ]}},
        { type: 'testimonials', data: { title: "Témoignages", items: [ { author: "Lucas M.", quote: "Mon permis du premier coup ! Merci à l'équipe.", role: "Jeune conducteur" } ] } },
        { type: 'footer', data: {} }
      ]
    }
  }
];