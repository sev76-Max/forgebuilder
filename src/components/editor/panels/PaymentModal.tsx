"use client";

import { useEffect, useState } from "react";
import { PAYMENT_OPERATORS, formatPrice, PRICE_XOF, type PaymentOperator } from "@/lib/payment-config";
import type { UsePaymentReturn } from "@/hooks/usePayment";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payment: UsePaymentReturn;
}

type Step = "operator" | "instructions" | "form" | "waiting";

export function PaymentModal({ open, onClose, onSuccess, payment }: PaymentModalProps) {
  const [step, setStep] = useState<Step>("operator");
  const [operator, setOperator] = useState<PaymentOperator | null>(null);
  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [pollTimedOut, setPollTimedOut] = useState(false);

  // Reset à chaque ouverture
  useEffect(() => {
    if (open) {
      setStep("operator");
      setOperator(null);
      setError("");
      setCopied(false);
      setPollTimedOut(false);
      setPayerName("");
      setPayerPhone("");
      setTransactionRef("");
    }
  }, [open]);

  // Étape "waiting" → sonde le statut Pro
  useEffect(() => {
    if (step !== "waiting") return;
    let cancelled = false;
    (async () => {
      const pro = await payment.pollProStatus();
      if (cancelled) return;
      if (pro) onSuccess();
      else setPollTimedOut(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [step, payment, onSuccess]);

  if (!open) return null;

  const copyNumber = async () => {
    if (!operator?.number) return;
    try {
      await navigator.clipboard.writeText(operator.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copie impossible — notez le numéro manuellement.");
    }
  };

  const notifyAdminViaWhatsapp = (op: PaymentOperator, ref: string) => {
    const admin = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP;
    if (!admin) return;
    const msg = [
      "🛠️ Nouvelle demande ForgeBuilder",
      `💰 ${formatPrice(PRICE_XOF)}`,
      `📲 ${op.label}`,
      `🧾 Réf. transaction : ${ref}`,
      `✅ Valide ici : ${window.location.origin}/admin`,
    ].join("\n");
    window.open(`https://wa.me/${admin.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleSubmitProof = async () => {
    if (!operator) return;
    if (!payerName.trim() || !payerPhone.trim() || !transactionRef.trim()) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    setError("");
    const result = await payment.submitPaymentProof({
      operator: operator.id,
      payerName: payerName.trim(),
      payerPhone: payerPhone.trim(),
      transactionRef: transactionRef.trim(),
    });

    if (result.status === "already_pro") {
      onSuccess();
      return;
    }
    if (result.status === "created" || result.status === "already_pending") {
      notifyAdminViaWhatsapp(operator, transactionRef.trim());
      setStep("waiting");
      return;
    }
    setError(result.message);
  };

  const verifyNow = async () => {
    const pro = await payment.refreshProStatus();
    if (pro) onSuccess();
    else setPollTimedOut(true);
  };

  const inputCls =
    "w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      {/* Panneau clair : contraste maximal pour la lisibilité */}
      <div
        className="bg-white text-gray-900 rounded-2xl w-full max-w-md p-6 relative border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#ffffff" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none"
          aria-label="Fermer"
        >
          ×
        </button>

        {/* ── Étape 1 : choix de l'opérateur ── */}
        {step === "operator" && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Débloquer l'accès Pro</h2>
            <p className="text-sm text-gray-600 mb-4">
              Paiement unique de{" "}
              <span className="text-orange-600 font-bold">{formatPrice(PRICE_XOF)}</span> — publication
              illimitée.
            </p>
            <div className="space-y-3">
              {PAYMENT_OPERATORS.map((op) => (
                <button
                  key={op.id}
                  onClick={() => {
                    if (!op.number) {
                      setError("Ce moyen de paiement n'est pas encore configuré. Contactez le support.");
                      return;
                    }
                    setError("");
                    setOperator(op);
                    setStep("instructions");
                  }}
                  disabled={!op.number}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition ${
                    op.number
                      ? "border-gray-200 bg-gray-50 hover:bg-white hover:border-orange-400 hover:shadow-md"
                      : "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                  }`}
                >
                  <span className="text-3xl">{op.icon}</span>
                  <span className="flex-1">
                    <span className="block font-bold text-gray-900">{op.label}</span>
                    <span className="block text-xs text-gray-500">{op.hint}</span>
                    {!op.number && (
                      <span className="block text-xs text-red-500 mt-1">⚠️ Non configuré</span>
                    )}
                  </span>
                  {op.number && <span className="text-gray-400">›</span>}
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          </>
        )}

        {/* ── Étape 2 : instructions de paiement ── */}
        {step === "instructions" && operator && (
          <>
            <button
              onClick={() => setStep("operator")}
              className="text-xs text-gray-500 hover:text-gray-800 mb-3"
            >
              ← Changer de moyen
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {operator.icon} {operator.label}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Envoyez exactement{" "}
              <span className="text-orange-600 font-bold">{formatPrice(PRICE_XOF)}</span> au numéro :
            </p>
            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 flex items-center justify-between gap-3">
              <span className="text-2xl font-mono font-bold tracking-wider text-gray-900">
                {operator.number}
              </span>
              <button
                onClick={copyNumber}
                className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg font-bold whitespace-nowrap"
              >
                {copied ? "✅ Copié" : "📋 Copier"}
              </button>
            </div>
            <ol className="text-sm text-gray-700 space-y-2 my-5 list-decimal list-inside">
              <li>
                Ouvrez votre application <strong>{operator.label}</strong>
              </li>
              <li>
                Envoyez {formatPrice(PRICE_XOF)} au numéro ci-dessus
              </li>
              <li>
                Vous recevrez un SMS avec un{" "}
                <strong className="text-gray-900">ID de transaction</strong> — gardez-le
              </li>
            </ol>
            <button
              onClick={() => setStep("form")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg"
            >
              ✅ J'ai envoyé l'argent
            </button>
          </>
        )}

        {/* ── Étape 3 : confirmation ── */}
        {step === "form" && operator && (
          <>
            <button
              onClick={() => setStep("instructions")}
              className="text-xs text-gray-500 hover:text-gray-800 mb-3"
            >
              ← Retour
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Confirmez votre paiement</h2>
            <p className="text-sm text-gray-600 mb-4">
              Ces informations permettent de retrouver votre transaction {operator.label}.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Votre nom complet</label>
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="Ex : Awa Traoré"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Numéro utilisé pour le paiement
                </label>
                <input
                  type="tel"
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="Ex : +226 70 00 00 00"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  ID de transaction (reçu par SMS)
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="Ex : MP240915.1432.A12345"
                  className={inputCls}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            <button
              onClick={handleSubmitProof}
              disabled={payment.paymentLoading}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
            >
              {payment.paymentLoading ? "Envoi..." : "Confirmer mon paiement"}
            </button>
          </>
        )}

        {/* ── Étape 4 : en attente de validation ── */}
        {step === "waiting" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Demande envoyée !</h2>
            <p className="text-sm text-gray-600 mb-1">
              Votre demande est en attente de validation.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Vous pouvez fermer cette fenêtre et continuer à éditer — les boutons de publication
              s'activeront automatiquement dès validation.
            </p>
            {pollTimedOut && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-sm text-gray-700">
                Toujours pas validé ? Le paiement est vérifié manuellement — cela peut prendre un
                instant.
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg text-sm"
              >
                Continuer l'édition
              </button>
              <button
                onClick={verifyNow}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-sm"
              >
                🔄 Vérifier maintenant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}