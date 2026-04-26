import OpenAI from "openai";
import { NextResponse } from "next/server";

if (!process.env.GROQ_API_KEY) {
  console.error("ERREUR CRITIQUE : La variable GROQ_API_KEY est manquante");
}

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// --- 1. DICTIONNAIRE DE MOTS-CLÉS PAR SECTEUR ---
const SECTOR_KEYWORDS: Record<string, { keywords: string[], image: string }> = {
  // NOUVEAU : Secteur Boutique
  boutique: { 
    keywords: ["Nouveautés", "Promotions", "Livraison", "Stock limité", "Mode", "Qualité"], 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1470&q=100" 
  },
  restaurant: { 
    keywords: ["Menu", "Chef", "Saveurs", "Réservation", "Ambiance", "Cuisine locale", "Carte des vins"], 
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=3840&q=100" 
  },
  sport: { 
    keywords: ["Entraînement", "Performance", "Coaching", "Fitness", "Musculation", "Nutrition", "Endurance"], 
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=3840&q=100" 
  },
  sante: { 
    keywords: ["Soins", "Bien-être", "Équipe médicale", "Rendez-vous", "Prévention", "Diagnostic", "Spécialistes"], 
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=3840&q=100" 
  },
  tech: { 
    keywords: ["Innovation", "Développement", "Solutions digitales", "Cloud", "Sécurité", "Automatisation"], 
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=3840&q=100" 
  },
  law: { 
    keywords: ["Justice", "Défense", "Contrat", "Conseil juridique", "Litige", "Droit des affaires"], 
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=3840&q=100" 
  },
  beauty: { 
    keywords: ["Soin visage", "Massage", "Produits naturels", "Épilation", "Manucure", "Bien-être"], 
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=3840&q=100" 
  },
  default: { 
    keywords: ["Qualité", "Service", "Expertise", "Engagement", "Innovation", "Résultats"], 
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=3840&q=100" 
  }
};

// Images par défaut pour les produits (fiables)
const PRODUCT_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80"
];

function getSectorContext(prompt: string) {
  const p = prompt.toLowerCase();
  // NOUVEAU : Détection Boutique
  if (p.includes("boutique") || p.includes("shop") || p.includes("e-commerce") || p.includes("vendeur") || p.includes("magasin") || p.includes("vêtements")) return "boutique";
  if (p.includes("restaurant") || p.includes("sushi") || p.includes("café") || p.includes("pizza") || p.includes("traiteur")) return "restaurant";
  if (p.includes("sport") || p.includes("gym") || p.includes("fitness") || p.includes("coaching")) return "sport";
  if (p.includes("médecin") || p.includes("dentiste") || p.includes("clinique") || p.includes("santé")) return "sante";
  if (p.includes("tech") || p.includes("agence web") || p.includes("logiciel") || p.includes("startup")) return "tech";
  if (p.includes("avocat") || p.includes("notaire") || p.includes("juridique")) return "law";
  if (p.includes("beauté") || p.includes("coiffeur") || p.includes("spa") || p.includes("ongles")) return "beauty";
  return "default";
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "Clé API manquante sur le serveur." }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();
    const sector = getSectorContext(prompt);
    const context = SECTOR_KEYWORDS[sector];

    // --- 2. PROMPT AVEC INSTRUCTIONS SPÉCIALES BOUTIQUE ---
    let systemContent = `Tu es un copywriter marketing expert pour le secteur : "${sector}".
    INTERDICTION ABSOLUE d'utiliser des termes génériques comme "Service 1", "Qualité", "Expertise".
    Tu DOIS utiliser des termes spécifiques METIERS.
    
    Mots-clés recommandés pour ce secteur : ${context.keywords.join(', ')}.
    
    RÈGLES JSON :
    - hero.headline : Un titre percutant (max 6 mots).
    - testimonials.items : 3 avis clients réalistes avec prénoms français.
    - about.content : 2 phrases sur les valeurs de l'entreprise.`;

    // INJECTION DES RÈGLES BOUTIQUE (MODIFIÉ POUR 8 PRODUITS)
    if (sector === 'boutique') {
      systemContent += `
      RÈGLE SPÉCIALE BOUTIQUE:
      - Remplace la section "features" par une section "products".
      - "products" doit avoir un titre (ex: "Nos Meilleures Ventes") et un tableau "items".
      - Chaque item de "products" DOIT avoir : title, price (ex: "15 000 FCFA"), description (courte), imageUrl (laisser vide "").
      - Invente exactement 8 produits cohérents avec le prompt.`;
    } else {
      systemContent += `
      - features.items : 3 services RÉELS (ex: "Menu Dégustation" pour un resto).`;
    }

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: `Crée le contenu JSON complet pour l'entreprise : "${prompt}"` }
      ],
      model: "llama-3.3-70b-versatile", 
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    let jsonConfig: any = {};
    try {
      jsonConfig = JSON.parse(content || "{}");
    } catch (e) {
      console.error("Parsing error", e);
    }

    // --- 3. NETTOYAGE ET SÉCURISATION ---

    if (!jsonConfig.meta) jsonConfig.meta = {};
    if (!jsonConfig.meta.theme) jsonConfig.meta.theme = {};
    if (!jsonConfig.meta.theme.primaryColor) jsonConfig.meta.theme.primaryColor = "#F97316";
    if (!jsonConfig.sections) jsonConfig.sections = [];

    // 1. Hero
    let hIdx = jsonConfig.sections.findIndex((s: any) => s.type === 'hero');
    if (hIdx === -1) { jsonConfig.sections.unshift({ type: 'hero', data: {} }); hIdx = 0; }
    
    jsonConfig.sections[hIdx].data = {
      headline: jsonConfig.sections[hIdx].data?.headline || `Bienvenue chez ${prompt}`,
      subheadline: jsonConfig.sections[hIdx].data?.subheadline || "Votre satisfaction est notre priorité.",
      ctaText: jsonConfig.sections[hIdx].data?.ctaText || "Contact",
      ctaLink: jsonConfig.sections[hIdx].data?.ctaLink || "#",
      imageUrl: jsonConfig.sections[hIdx].data?.imageUrl || context.image
    };

    // 2. About
    if (!jsonConfig.sections.some((s: any) => s.type === 'about')) {
      jsonConfig.sections.splice(1, 0, { 
        type: 'about', 
        data: { 
          title: "Notre Histoire", 
          content: `Depuis notre création, nous mettons tout en œuvre pour offrir les meilleurs services en tant que ${prompt}. Notre équipe passionnée vous accueille dans une ambiance professionnelle.`, 
          imageUrl: context.image 
        } 
      });
    }

    // 3. LOGIQUE BOUTIQUE VS SERVICES
    if (sector === 'boutique') {
      // Cas Boutique : On force la section Products
      let pIdx = jsonConfig.sections.findIndex((s: any) => s.type === 'products');
      if (pIdx === -1) { 
        jsonConfig.sections.push({ type: 'products', data: { title: "Nos Produits", items: [] } }); 
        pIdx = jsonConfig.sections.length - 1; 
      }
      
      // Nettoyage des produits (Images + Prix)
      if (!jsonConfig.sections[pIdx].data.items || jsonConfig.sections[pIdx].data.items.length === 0) {
        // Fallback si l'IA oublie de créer les produits (on en met 8 par défaut ici aussi)
        jsonConfig.sections[pIdx].data.items = [
          { title: "Produit 1", price: "10 000 FCFA", description: "Description..." },
          { title: "Produit 2", price: "15 000 FCFA", description: "Description..." },
          { title: "Produit 3", price: "20 000 FCFA", description: "Description..." },
          { title: "Produit 4", price: "25 000 FCFA", description: "Description..." },
          { title: "Produit 5", price: "30 000 FCFA", description: "Description..." },
          { title: "Produit 6", price: "35 000 FCFA", description: "Description..." },
          { title: "Produit 7", price: "40 000 FCFA", description: "Description..." },
          { title: "Produit 8", price: "45 000 FCFA", description: "Description..." }
        ];
      }

      // On assigne des images correctes aux produits
      jsonConfig.sections[pIdx].data.items = jsonConfig.sections[pIdx].data.items.map((item: any, i: number) => ({
        ...item,
        price: item.price || "Prix sur demande",
        imageUrl: item.imageUrl || PRODUCT_PLACEHOLDERS[i % PRODUCT_PLACEHOLDERS.length] // On force une image valide
      }));

    } else {
      // Cas Classique : On force la section Features
      let fIdx = jsonConfig.sections.findIndex((s: any) => s.type === 'features');
      if (fIdx === -1) { jsonConfig.sections.push({ type: 'features', data: { title: "Nos Offres", items: [] } }); fIdx = jsonConfig.sections.length - 1; }
      
      if (!jsonConfig.sections[fIdx].data.items || jsonConfig.sections[fIdx].data.items.length < 3 || jsonConfig.sections[fIdx].data.items[0]?.title?.includes("Service")) {
        jsonConfig.sections[fIdx].data.items = context.keywords.slice(0, 3).map((kw, i) => ({
          icon: ["Zap", "Shield", "Heart"][i],
          title: kw,
          description: `Découvrez notre approche unique en matière de ${kw.toLowerCase()}.`
        }));
      }
    }

    // 4. Testimonials
    let tIdx = jsonConfig.sections.findIndex((s: any) => s.type === 'testimonials');
    if (tIdx === -1) { jsonConfig.sections.push({ type: 'testimonials', data: { title: "Avis Clients", items: [] } }); tIdx = jsonConfig.sections.length - 1; }
    if (!jsonConfig.sections[tIdx].data.items || jsonConfig.sections[tIdx].data.items.length === 0) {
      jsonConfig.sections[tIdx].data.items = [
        { author: "Marie D.", role: "Cliente", quote: `Une expérience incroyable, je recommande !` },
        { author: "Paul L.", role: "Client", quote: "Très professionnel et à l'écoute." },
        { author: "Sophie M.", role: "Cliente", quote: "Exactement ce que je cherchais." }
      ];
    }

    // 5. Blog & Footer
    if (!jsonConfig.sections.some((s: any) => s.type === 'blog')) {
      const d = new Date().toLocaleDateString('fr-FR');
      jsonConfig.sections.push({
        type: 'blog', data: { title: "Actualités", items: [
          { title: `Les tendances ${sector}`, excerpt: "Découvrez les dernières nouveautés.", imageUrl: context.image, date: d },
          { title: "Nos conseils", excerpt: "Astuces et conseils pratiques.", imageUrl: context.image, date: d }
        ]}
      });
    }
    if (!jsonConfig.sections.some((s: any) => s.type === 'footer')) {
      jsonConfig.sections.push({ type: 'footer', data: {} });
    }

    return NextResponse.json({ config: jsonConfig });

  } catch (error: any) {
    console.error("❌ Erreur API:", error);
    return NextResponse.json({ error: "Erreur lors de la génération IA." }, { status: 500 });
  }
}