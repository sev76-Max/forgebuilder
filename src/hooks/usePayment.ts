"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const INTENT_KEY = "forge_intent";           // "payer après connexion"
const PENDING_CONFIG_KEY = "forge_pending_config";

// L'admin peut mettre quelques minutes à valider → on sonde pendant ~3 min
const POLL_MAX_ATTEMPTS = 18;
const POLL_DELAY_MS = 10_000;

export type PaymentOperatorId = "orange" | "wave_moov" | "wave_mtn";

export interface PaymentProof {
  operator: PaymentOperatorId;
  payerName: string;
  payerPhone: string;
  transactionRef: string;
}

export type PaymentSubmitResult =
  | { status: "already_pro" }
  | { status: "already_pending" }
  | { status: "created" }
  | { status: "error"; message: string };

export function usePayment(userId?: string | null) {
  const [isPro, setIsPro] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [awaitingApproval, setAwaitingApproval] = useState(false);

  // Mémorise le config à payer (survit au magic-link et au refresh)
  const stashPending = useCallback((config: unknown) => {
    try {
      localStorage.setItem(PENDING_CONFIG_KEY, JSON.stringify(config));
    } catch {
      alert("Impossible de préparer le paiement : le projet est trop volumineux. Réduisez la taille des images.");
    }
  }, []);

  const takePendingConfig = useCallback((): unknown | null => {
    const str = localStorage.getItem(PENDING_CONFIG_KEY);
    if (!str) return null;
    localStorage.removeItem(PENDING_CONFIG_KEY);
    return JSON.parse(str);
  }, []);

  // "Je voulais payer mais j'ai dû me connecter" → à consommer après SIGNED_IN
  const setPayIntent = useCallback(() => {
    localStorage.setItem(INTENT_KEY, "pay");
  }, []);

  const consumePayIntent = useCallback((): boolean => {
    if (localStorage.getItem(INTENT_KEY) === "pay") {
      localStorage.removeItem(INTENT_KEY);
      return true;
    }
    return false;
  }, []);

  // ── Statut Pro : au moins un projet is_paid ──
  const refreshProStatus = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      setIsPro(false);
      return false;
    }
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id")
        .eq("user_id", userId)
        .eq("is_paid", true)
        .limit(1);
      if (error) throw error;
      const pro = (data?.length ?? 0) > 0;
      setIsPro(pro);
      return pro;
    } catch (e) {
      console.error("Statut Pro indisponible :", e);
      setIsPro(false);
      return false;
    }
  }, [userId]);

  // Sonde pendant ~3 min pour attraper la validation de l'admin
  const pollProStatus = useCallback(async (): Promise<boolean> => {
    setAwaitingApproval(true);
    try {
      for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
        const pro = await refreshProStatus();
        if (pro) return true;
        await new Promise((r) => setTimeout(r, POLL_DELAY_MS));
      }
      return false;
    } finally {
      setAwaitingApproval(false);
    }
  }, [refreshProStatus]);

  // ── Soumission de la preuve de paiement ──
  const submitPaymentProof = useCallback(
    async (proof: PaymentProof): Promise<PaymentSubmitResult> => {
      setPaymentLoading(true);
      try {
        const config = takePendingConfig();
        if (!config) {
          return { status: "error", message: "Projet introuvable. Réessayez depuis l'éditeur." };
        }
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) {
          return { status: "error", message: "Session expirée. Reconnectez-vous puis réessayez." };
        }

        const res = await fetch("/api/payment-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...proof, config }),
        });
        const data = await res.json();

        if (data.success && data.alreadyPro) return { status: "already_pro" };
        if (data.success && data.alreadyPending) return { status: "already_pending" };
        if (data.success) return { status: "created" };
        return { status: "error", message: data.message || "Erreur inconnue" };
      } catch (e) {
        console.error(e);
        return { status: "error", message: "Erreur de connexion au serveur." };
      } finally {
        setPaymentLoading(false);
      }
    },
    [takePendingConfig]
  );

  // Statut Pro au chargement / changement d'utilisateur
  useEffect(() => {
    refreshProStatus();
  }, [refreshProStatus]);

  return {
    isPro,
    paymentLoading,
    awaitingApproval,
    stashPending,
    setPayIntent,
    consumePayIntent,
    submitPaymentProof,
    refreshProStatus,
    pollProStatus,
  };
}

export type UsePaymentReturn = ReturnType<typeof usePayment>;