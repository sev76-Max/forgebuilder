"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PAYMENT_OPERATORS, formatPrice } from "@/lib/payment-config";

interface PaymentRequestRow {
  id: string;
  user_id: string;
  project_id: string | null;
  operator: string;
  payer_name: string;
  payer_phone: string;
  transaction_ref: string;
  amount: number;
  status: string;
  created_at: string;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-900/40 text-yellow-300 border-yellow-600",
  approved: "bg-green-900/40 text-green-300 border-green-600",
  rejected: "bg-red-900/40 text-red-300 border-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "⏳ En attente",
  approved: "✅ Approuvée",
  rejected: "❌ Rejetée",
};

export default function AdminPage() {
  const [rows, setRows] = useState<PaymentRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Connectez-vous avec le compte admin pour voir les demandes.");
        setRows([]);
        return;
      }
      const res = await fetch("/api/admin/payment-requests", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);
      // Tri : pending en premier, puis les plus récentes
      const sorted = (data.requests ?? []).sort((a: PaymentRequestRow, b: PaymentRequestRow) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setRows(sorted);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000); // auto-refresh
    return () => clearInterval(t);
  }, [load]);

  const act = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch("/api/admin/payment-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ id, action }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const operatorLabel = (id: string) =>
    PAYMENT_OPERATORS.find((o) => o.id === id)?.label ?? id;

  const pendingCount = rows.filter((r) => r.status === "pending").length;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">🛠️ Admin ForgeBuilder</h1>
            <p className="text-gray-400 text-sm mt-1">
              {pendingCount > 0
                ? `${pendingCount} demande(s) en attente de validation`
                : "Aucune demande en attente"}
            </p>
          </div>
          <a href="/" className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-700">
            ← Retour à l'éditeur
          </a>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {loading && rows.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Chargement...</p>
        ) : rows.length === 0 && !error ? (
          <p className="text-gray-500 text-center py-10">Aucune demande de paiement pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div
                key={r.id}
                className={`bg-gray-900 border rounded-xl p-4 ${
                  r.status === "pending" ? "border-yellow-700" : "border-gray-800"
                }`}
              >
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_BADGE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      <span className="font-bold">{formatPrice(r.amount)}</span>
                      <span className="text-gray-500">•</span>
                      <span>{operatorLabel(r.operator)}</span>
                    </div>
                    <p><span className="text-gray-500">👤 Payeur :</span> {r.payer_name} <span className="text-gray-500">({r.payer_phone})</span></p>
                    <p><span className="text-gray-500">🧾 Réf. :</span> <span className="font-mono">{r.transaction_ref}</span></p>
                    <p className="text-xs text-gray-500">
                      Reçue le {new Date(r.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>

                  {r.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => act(r.id, "approve")}
                        disabled={busyId === r.id}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg text-xs font-bold"
                      >
                        {busyId === r.id ? "..." : "✅ Valider"}
                      </button>
                      <button
                        onClick={() => act(r.id, "reject")}
                        disabled={busyId === r.id}
                        className="bg-red-900/60 hover:bg-red-900 disabled:opacity-50 px-4 py-2 rounded-lg text-xs font-bold text-red-300"
                      >
                        ❌ Rejeter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}