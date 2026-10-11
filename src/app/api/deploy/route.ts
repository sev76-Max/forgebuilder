import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🚀 Les fonctions de déploiement peuvent être lentes (upload + build)
export const maxDuration = 60;

const MAX_BODY_CHARS = 4_000_000; // garde-fou : limite la taille envoyée aux plateformes
const VALID_PROVIDERS = new Set(["vercel", "netlify"]);

// Génère un sous-domaine valide : "Chez Awa Couture" → "chez-awa-couture-k3x9"
function slugify(name: string): string {
  const base = (name || "site")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "site";
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

async function deployToNetlify(files: Record<string, string>, siteName: string): Promise<string> {
  const token = process.env.NETLIFY_TOKEN;
  if (!token) throw new Error("NETLIFY_TOKEN non configuré sur le serveur.");

  // 1. Création du site (nom unique grâce au suffixe aléatoire)
  const siteRes = await fetch("https://api.netlify.com/api/v1/sites", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: slugify(siteName) }),
  });
  const siteData = await siteRes.json();
  if (!siteRes.ok || !siteData?.id) {
    throw new Error(siteData?.message || "Création du site Netlify échouée");
  }

  // 2. Zip des fichiers (index.html doit être à la racine)
  const zip = new JSZip();
  for (const [filename, content] of Object.entries(files)) {
    zip.file(filename, content);
  }
  const zipBuffer = await zip.generateAsync({ type: "uint8array" });

  // 3. Déploiement du zip
  const deployRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteData.id}/deploys`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/zip" },
    body: zipBuffer,
  });
  const deployData = await deployRes.json();
  if (!deployRes.ok || !deployData?.id) {
    throw new Error(deployData?.message || "Déploiement Netlify échoué");
  }

  // 4. Attente de la publication (max ~20 s)
  for (let i = 0; i < 10; i++) {
    const pollRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteData.id}/deploys/${deployData.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const pollData = await pollRes.json();
    if (pollData?.state === "ready") break;
    if (pollData?.state === "error") throw new Error("Le déploiement Netlify a échoué");
    await new Promise((r) => setTimeout(r, 2000));
  }

  return siteData.ssl_url || siteData.url;
}

async function deployToVercel(files: Record<string, string>, siteName: string): Promise<string> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN non configuré sur le serveur.");

  const teamId = process.env.VERCEL_TEAM_ID;
  const url = `https://api.vercel.com/v13/deployments${teamId ? `?teamId=${teamId}` : ""}`;

  // v13 : fichiers encodés base64 + pas de framework (site statique pur)
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: slugify(siteName),
      target: "production",
      projectSettings: { framework: null },
      files: Object.entries(files).map(([file, data]) => ({
        file,
        data: Buffer.from(data, "utf-8").toString("base64"),
        encoding: "base64",
      })),
    }),
  });

  const data = await res.json();
  if (!res.ok || !data?.url) {
    throw new Error(data?.error?.message || data?.message || "Déploiement Vercel échoué");
  }
  return data.url.startsWith("http") ? data.url : `https://${data.url}`;
}

export async function POST(req: Request) {
  try {
    // 1. 🔐 Authentification — le userId vient du token, jamais du body
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, error: "Authentification requise" }, { status: 401 });
    }
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Session invalide ou expirée" }, { status: 401 });
    }
    const userId = user.id;

    // 2. 💰 LA SÉCURITÉ QUI MANQUAIT : vérification du paiement côté serveur.
    //    Sans ceci, n'importe qui pouvait appeler la route et déployer gratuitement.
    const { data: paidProjects, error: paidError } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", userId)
      .eq("is_paid", true)
      .limit(1);
    if (paidError) {
      console.error("Erreur check is_paid:", paidError);
      return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }
    if (!paidProjects || paidProjects.length === 0) {
      return NextResponse.json(
        { success: false, error: "Paiement requis pour déployer un site." },
        { status: 403 }
      );
    }

    // 3. Validation du body
    const body = await req.json().catch(() => null);
    const { provider, files, siteName } = body ?? {};
    if (!provider || !VALID_PROVIDERS.has(provider)) {
      return NextResponse.json({ success: false, error: "Provider invalide" }, { status: 400 });
    }
    if (!files || typeof files !== "object" || Array.isArray(files)) {
      return NextResponse.json({ success: false, error: "Fichiers manquants" }, { status: 400 });
    }
    if (JSON.stringify(files).length > MAX_BODY_CHARS) {
      return NextResponse.json(
        { success: false, error: "Site trop volumineux (images trop lourdes ?)" },
        { status: 413 }
      );
    }

    // 4. Déploiement selon le provider
    const deployUrl =
      provider === "netlify"
        ? await deployToNetlify(files, siteName || "site")
        : await deployToVercel(files, siteName || "site");

    return NextResponse.json({ success: true, url: deployUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur déploiement :", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}