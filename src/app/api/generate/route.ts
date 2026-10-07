import OpenAI from "openai";
import { NextResponse } from "next/server";

// ============================================================
// Configuration IA — 100% pilotée par variables d'environnement
// Fournisseur interchangeable (Groq aujourd'hui, autre demain)
// ============================================================
const AI_API_KEY = process.env.AI_API_KEY || process.env.GROQ_API_KEY;
const AI_BASE_URL = process.env.AI_BASE_URL || "https://api.groq.com/openai/v1";
const AI_MODEL = process.env.AI_MODEL || "openai/gpt-oss-120b";
// Optionnel : réduit le "raisonnement" des modèles gpt-oss (plus rapide, moins cher)
const AI_REASONING_EFFORT = process.env.AI_REASONING_EFFORT as "low" | "medium" | "high" | undefined;

const client = new OpenAI({
  apiKey: AI_API_KEY,
  baseURL: AI_BASE_URL,
});

// --- 1. DICTIONNAIRE DE MOTS-CLÉS PAR SECTEUR ---
const SECTOR_KEYWORDS: Record<string, { keywords: string[], image: string }> = {
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

const PRODUCT_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80"
];

function getSectorContext(prompt: string) {
  const p = prompt.toLowerCase();
  if (p.includes("boutique") || p.includes("shop") || p.includes("e-commerce") || p.includes("vendeur") || p.includes("magasin") || p.includes("vêtements")) return "boutique";
  if (p.includes("restaurant") || p.includes("sushi") || p.includes("café") || p.includes("pizza") || p.includes("traiteur")) return "restaurant";
  if (p.includes("sport") || p.includes("gym") || p.includes("fitness") || p.includes("coaching")) return "sport";
  if (p.includes("médecin") || p.includes("dentiste") || p.includes("clinique") || p.includes("santé")) return "sante";
  if (p.includes("tech") || p.includes("agence web") || p.includes("logiciel") || p.includes("startup")) return "tech";
  if (p.includes("avocat") || p.includes("notaire") || p.includes("juridique")) return "law";
  if (p.includes("beauté") || p.includes("coiffeur") || p.includes("spa") || p.includes("ongles")) return "beauty";
  return "default";
}

// --- 2. EXTRACTION JSON ROBUSTE ---
// Gère : JSON pur, JSON dans des fences markdown, JSON noyé dans du texte
function extractJson(raw: string | null | undefined): Record<string, unknown> | null {
  if (!raw) return null;

  // a. JSON direct
  try {
    const direct = JSON.parse(raw);
    if (direct && typeof direct === "object" && !Array.isArray(direct)) return direct;
  } catch { /* on continue */ }

  // b. JSON dans des fences markdown ```json ... ```
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      const parsed = JSON.parse(fenced[1].trim());
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch { /* on continue */ }
  }

  // c. Premier "{" au dernier "}"
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      const parsed = JSON.parse(raw.slice(start, end + 1));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch { /* abandon */ }
  }

  return null;
}

export async function POST(req: Request) {
  if (!AI_API_KEY) {
    return NextResponse.json({ error: "Clé API manquante sur le serveur (AI_API_KEY)." }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 2) {
      return NextResponse.json({ error: "Prompt invalide." }, { status: 400 });
    }

    const sector = getSectorContext(prompt);
    const context = SECTOR_KEYWORDS[sector];

    // --- 3. PROMPT SYSTÈME : règles métier + SCHÉMA JSON EXPLICITE ---
    let systemContent = `Tu es un copywriter marketing expert pour le secteur : "${sector}".
INTERDICTION ABSOLUE d'utiliser des termes génériques comme "Service 1", "Qualité", "Expertise".
Tu DOIS utiliser des termes spécifiques METIERS.

Mots-clés recommandés pour ce secteur : ${context.keywords.join(', ')}.

RÈGLES DE CONTENU :
- hero.headline : un titre percutant (max 6 mots).
- testimonials.items : 3 avis clients réalistes avec prénoms français.
- about.content : 2 phrases sur les valeurs de l'entreprise.
- N'invente JAMAIS d'URL d'image : laisse imageUrl vide ("") partout, des images seront ajoutées automatiquement.`;

    if (sector === "boutique") {
      systemContent += `
RÈGLE SPÉCIALE BOUTIQUE :
- Crée une section "products" avec 8 produits réalistes du domaine (title, price, description, imageUrl vide).
- Les prix doivent être réalistes pour le marché ouest-africain, en FCFA (ex: "12 000 FCFA").
- Crée AUSSI une section "features" intitulée "Nos Avantages" avec 3 points forts (ex: Livraison Rapide, Paiement Sécurisé, Support Client).`;
    } else {
      systemContent += `
- features.items : 3 services RÉELS du métier (ex: "Menu Dégustation" pour un restaurant).`;
    }

    systemContent += `

FORMAT DE RÉPONSE — réponds UNIQUEMENT avec cet objet JSON valide, sans texte avant ni après :
{
  "meta": {
    "siteName": "Nom commercial de l'entreprise (invente un nom crédible)",
    "description": "Description en une phrase",
    "theme": { "primaryColor": "#RRGGBB adapté au secteur" }
  },
  "sections": [
    { "type": "hero", "data": { "headline": "...", "subheadline": "...", "ctaText": "...", "ctaLink": "#", "imageUrl": "" } },
    { "type": "about", "data": { "title": "Notre Histoire", "content": "...", "imageUrl": "" } },
    { "type": "features", "data": { "title": "...", "items": [ { "icon": "Zap|Shield|Heart|Truck|Headphones|Star", "title": "...", "description": "..." } ] } },
    // boutique uniquement :
    { "type": "products", "data": { "title": "Nos Produits", "items": [ { "title": "...", "price": "... FCFA", "description": "...", "imageUrl": "" } ] } },
    { "type": "testimonials", "data": { "title": "Avis Clients", "items": [ { "author": "Prénom N.", "quote": "..." } ] } },
    { "type": "blog", "data": { "title": "Actualités", "items": [ { "title": "...", "excerpt": "..." } ] } }
  ]
}`;

    // --- 4. APPEL IA ---
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: `Crée le contenu JSON complet pour l'entreprise : "${prompt}"` },
      ],
      model: AI_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.7,
      ...(AI_REASONING_EFFORT ? { reasoning_effort: AI_REASONING_EFFORT } : {}),
    });

    const content = completion.choices[0]?.message?.content;
    const parsed = extractJson(content);

    if (!parsed) {
      console.error("Réponse IA non parsable :", (content || "").slice(0, 500));
      return NextResponse.json(
        { error: "L'IA n'a pas renvoyé de contenu exploitable. Réessayez." },
        { status: 502 }
      );
    }

    const jsonConfig: any = parsed;

    // --- 5. NETTOYAGE ET SÉCURISATION (logique d'origine conservée) ---
    if (!jsonConfig.meta) jsonConfig.meta = {};
    // FIX : siteName/description par défaut — évite un logo/header vides
    if (!jsonConfig.meta.siteName) jsonConfig.meta.siteName = String(prompt).slice(0, 40);
    if (!jsonConfig.meta.description) jsonConfig.meta.description = `Bienvenue chez ${jsonConfig.meta.siteName}`;
    if (!jsonConfig.meta.theme) jsonConfig.meta.theme = {};
    if (!jsonConfig.meta.theme.primaryColor) jsonConfig.meta.theme.primaryColor = "#F97316";
    if (!Array.isArray(jsonConfig.sections)) jsonConfig.sections = [];
    // FIX : écarte les sections malformées renvoyées par l'IA
    jsonConfig.sections = jsonConfig.sections.filter(
      (s: any) => s && typeof s === "object" && typeof s.type === "string"
    );

    // 1. Hero
    let hIdx = jsonConfig.sections.findIndex((s: any) => s.type === "hero");
    if (hIdx === -1) { jsonConfig.sections.unshift({ type: "hero", data: {} }); hIdx = 0; }

    jsonConfig.sections[hIdx].data = {
      headline: jsonConfig.sections[hIdx].data?.headline || `Bienvenue chez ${jsonConfig.meta.siteName}`,
      subheadline: jsonConfig.sections[hIdx].data?.subheadline || "Votre satisfaction est notre priorité.",
      ctaText: jsonConfig.sections[hIdx].data?.ctaText || "Contact",
      ctaLink: jsonConfig.sections[hIdx].data?.ctaLink || "#",
      imageUrl: jsonConfig.sections[hIdx].data?.imageUrl || context.image
    };

    // 2. About
    if (!jsonConfig.sections.some((s: any) => s.type === "about")) {
      jsonConfig.sections.splice(1, 0, {
        type: "about",
        data: {
          title: "Notre Histoire",
          content: `Depuis notre création, nous mettons tout en œuvre pour offrir les meilleurs services en tant que ${prompt}. Notre équipe passionnée vous accueille dans une ambiance professionnelle.`,
          imageUrl: context.image
        }
      });
    }

    // 3. LOGIQUE BOUTIQUE VS SERVICES
    if (sector === "boutique") {
      // A. Produits
      let pIdx = jsonConfig.sections.findIndex((s: any) => s.type === "products");
      if (pIdx === -1) {
        jsonConfig.sections.push({ type: "products", data: { title: "Nos Produits", items: [] } });
        pIdx = jsonConfig.sections.length - 1;
      }

      if (!jsonConfig.sections[pIdx].data.items || jsonConfig.sections[pIdx].data.items.length === 0) {
        jsonConfig.sections[pIdx].data.items = Array(8).fill(0).map((_, i) => ({
          title: `Produit ${i + 1}`, price: "10 000 FCFA", description: "Description..."
        }));
      }
      jsonConfig.sections[pIdx].data.items = jsonConfig.sections[pIdx].data.items.map((item: any, i: number) => ({
        ...item,
        price: item.price || "Prix sur demande",
        imageUrl: item.imageUrl || PRODUCT_PLACEHOLDERS[i % PRODUCT_PLACEHOLDERS.length]
      }));

      // B. Avantages (Features) pour Boutique
      let fIdx = jsonConfig.sections.findIndex((s: any) => s.type === "features");
      if (fIdx === -1) {
        jsonConfig.sections.push({ type: "features", data: { title: "Nos Avantages", items: [] } });
        fIdx = jsonConfig.sections.length - 1;
      }

      if (!jsonConfig.sections[fIdx].data.items || jsonConfig.sections[fIdx].data.items.length === 0) {
        jsonConfig.sections[fIdx].data.items = [
          { icon: "Truck", title: "Livraison Rapide", description: "Partout dans le pays." },
          { icon: "Shield", title: "Paiement Sécurisé", description: "Transactions 100% sécurisées." },
          { icon: "Headphones", title: "Support 7j/7", description: "Une équipe à votre écoute." }
        ];
      }
    } else {
      // Cas Classique : Services
      let fIdx = jsonConfig.sections.findIndex((s: any) => s.type === "features");
      if (fIdx === -1) {
        jsonConfig.sections.push({ type: "features", data: { title: "Nos Offres", items: [] } });
        fIdx = jsonConfig.sections.length - 1;
      }

      if (!jsonConfig.sections[fIdx].data.items || jsonConfig.sections[fIdx].data.items.length < 3 || jsonConfig.sections[fIdx].data.items[0]?.title?.includes("Service")) {
        jsonConfig.sections[fIdx].data.items = context.keywords.slice(0, 3).map((kw, i) => ({
          icon: ["Zap", "Shield", "Heart"][i],
          title: kw,
          description: `Découvrez notre approche unique en matière de ${kw.toLowerCase()}.`
        }));
      }
    }

    // 4. Testimonials
    let tIdx = jsonConfig.sections.findIndex((s: any) => s.type === "testimonials");
    if (tIdx === -1) {
      jsonConfig.sections.push({ type: "testimonials", data: { title: "Avis Clients", items: [] } });
      tIdx = jsonConfig.sections.length - 1;
    }
    if (!jsonConfig.sections[tIdx].data.items || jsonConfig.sections[tIdx].data.items.length === 0) {
      jsonConfig.sections[tIdx].data.items = [
        { author: "Marie D.", quote: "Une expérience incroyable, je recommande !" },
        { author: "Paul L.", quote: "Très professionnel et à l'écoute." },
        { author: "Sophie M.", quote: "Exactement ce que je cherchais." }
      ];
    }

    // 5. Blog & Footer
    if (!jsonConfig.sections.some((s: any) => s.type === "blog")) {
      const d = new Date().toLocaleDateString("fr-FR");
      jsonConfig.sections.push({
        type: "blog",
        data: {
          title: "Actualités",
          items: [
            { title: `Les tendances ${sector}`, excerpt: "Découvrez les dernières nouveautés.", imageUrl: context.image, date: d },
            { title: "Nos conseils", excerpt: "Astuces et conseils pratiques.", imageUrl: context.image, date: d }
          ]
        }
      });
    }
    if (!jsonConfig.sections.some((s: any) => s.type === "footer")) {
      jsonConfig.sections.push({ type: "footer", data: {} });
    }

    return NextResponse.json({ config: jsonConfig });

  } catch (error: any) {
    // FIX : erreur lisible + statut HTTP propagé (fini les [object])
    const status = typeof error?.status === "number" ? error.status : 500;
    console.error("Erreur API generate :", {
      status,
      message: error?.message || String(error),
      model: AI_MODEL,
    });
    return NextResponse.json({ error: "Erreur lors de la génération IA." }, { status: 500 });
  }
}