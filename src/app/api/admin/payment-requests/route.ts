import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔐 Admins autorisés (UUIDs Supabase, séparés par des virgules)
function getAdminIds(): string[] {
  return (process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Authentifie via token et vérifie le statut admin. Retourne l'userId ou null.
async function requireAdmin(req: Request): Promise<string | null> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data } = await supabase.auth.getUser(token);
  const user = data?.user;
  if (!user) return null;
  return getAdminIds().includes(user.id) ? user.id : null;
}

// GET : liste des demandes
export async function GET(req: Request) {
  const adminId = await requireAdmin(req);
  if (!adminId) {
    return NextResponse.json({ success: false, message: "Accès refusé" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("payment_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Erreur liste demandes:", error);
    return NextResponse.json({ success: false, message: "Erreur base de données" }, { status: 500 });
  }
  return NextResponse.json({ success: true, requests: data });
}

// PATCH : approuve ou rejette une demande
export async function PATCH(req: Request) {
  const adminId = await requireAdmin(req);
  if (!adminId) {
    return NextResponse.json({ success: false, message: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { id, action, note } = body ?? {};
  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ success: false, message: "Paramètres invalides" }, { status: 400 });
  }

  // Idempotence : on ne traite que les demandes "pending"
  const { data: request, error: fetchError } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !request) {
    return NextResponse.json({ success: false, message: "Demande introuvable" }, { status: 404 });
  }
  if (request.status !== "pending") {
    return NextResponse.json({ success: false, message: "Demande déjà traitée" }, { status: 409 });
  }

  const newStatus = action === "approve" ? "approved" : "rejected";
  const { error: updateError } = await supabase
    .from("payment_requests")
    .update({
      status: newStatus,
      reviewed_at: new Date().toISOString(),
      admin_note: note ?? null,
    })
    .eq("id", id);
  if (updateError) {
    console.error("Erreur mise à jour demande:", updateError);
    return NextResponse.json({ success: false, message: "Erreur base de données" }, { status: 500 });
  }

  // Approbation → on active le projet
  if (action === "approve" && request.project_id) {
    const { error: projError } = await supabase
      .from("projects")
      .update({ is_paid: true })
      .eq("id", request.project_id);
    if (projError) {
      console.error("⚠️ Demande approuvée mais activation projet échouée:", projError);
    }
  }

  return NextResponse.json({ success: true, status: newStatus });
}