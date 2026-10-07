import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ── Client Admin (service role) — serveur uniquement ──
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔐 Le prix est fixé côté serveur — jamais lu depuis le client
const PRICE_XOF = 10_000;
const MAX_CONFIG_CHARS = 2_000_000;
const VALID_OPERATORS = new Set(["orange", "wave_moov", "wave_mtn"]);

export async function POST(req: Request) {
  try {
    // 1. Authentification par token de session
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentification requise" }, { status: 401 });
    }
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Session invalide ou expirée" }, { status: 401 });
    }
    const userId = user.id;

    // 2. Validation du body
    const body = await req.json().catch(() => null);
    const { operator, payerName, payerPhone, transactionRef, config } = body ?? {};
    if (!operator || !VALID_OPERATORS.has(operator)) {
      return NextResponse.json({ success: false, message: "Opérateur invalide" }, { status: 400 });
    }
    if (!payerName?.trim() || !payerPhone?.trim() || !transactionRef?.trim()) {
      return NextResponse.json({ success: false, message: "Champs du paiement manquants" }, { status: 400 });
    }
    if (!config?.meta || !Array.isArray(config?.sections)) {
      return NextResponse.json({ success: false, message: "Config de projet invalide" }, { status: 400 });
    }
    if (JSON.stringify(config).length > MAX_CONFIG_CHARS) {
      return NextResponse.json({ success: false, message: "Projet trop volumineux (images trop lourdes ?)" }, { status: 413 });
    }

    // 3. Déjà Pro ? Évite un paiement inutile
    const { data: paidProjects } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", userId)
      .eq("is_paid", true)
      .limit(1);
    if (paidProjects && paidProjects.length > 0) {
      return NextResponse.json({ success: true, alreadyPro: true });
    }

    // 4. Anti-doublon : une seule demande en attente par utilisateur
    const { data: pending } = await supabase
      .from("payment_requests")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "pending")
      .limit(1);
    if (pending && pending.length > 0) {
      return NextResponse.json({ success: true, alreadyPending: true, requestId: pending[0].id });
    }

    // 5. Création du projet (snapshot de la config payée)
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        name: config.meta?.siteName || "Nouveau Projet",
        content: config,
        is_paid: false,
      })
      .select("id")
      .single();
    if (projectError || !projectData) {
      console.error("Erreur création projet:", projectError);
      return NextResponse.json({ success: false, message: "Erreur base de données" }, { status: 500 });
    }
    const projectId = projectData.id as string;

    // 6. Création de la demande de paiement
    const { data: requestData, error: requestError } = await supabase
      .from("payment_requests")
      .insert({
        user_id: userId,
        project_id: projectId,
        operator,
        payer_name: String(payerName).slice(0, 120),
        payer_phone: String(payerPhone).slice(0, 40),
        transaction_ref: String(transactionRef).slice(0, 80),
        amount: PRICE_XOF,
      })
      .select("id")
      .single();
    if (requestError || !requestData) {
      console.error("Erreur création demande:", requestError);
      return NextResponse.json({ success: false, message: "Erreur base de données (demande)" }, { status: 500 });
    }

    return NextResponse.json({ success: true, requestId: requestData.id, projectId });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur interne" }, { status: 500 });
  }
}