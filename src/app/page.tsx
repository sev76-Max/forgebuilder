"use client";

import { useCallback, useEffect, useState } from "react";
import DynamicRenderer from "@/components/renderer/DynamicRenderer";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { SiteConfigProvider } from "@/components/editor/SiteConfigContext";
import { PaymentModal } from "@/components/editor/panels/PaymentModal";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useAuth } from "@/hooks/useAuth";
import { usePayment } from "@/hooks/usePayment";
import { useGeneration } from "@/hooks/useGeneration";
import { useDeployment } from "@/hooks/useDeployment";
import { generateSiteFiles } from "@/lib/exporter";
import { safeFileName } from "@/lib/project-io";
import { DEFAULT_CONFIG } from "@/lib/default-config";

export default function Home() {
  // ── Logique ──
  const editor = useSiteConfig();
  const auth = useAuth();
  const payment = usePayment(auth.user?.id);
  const generation = useGeneration(editor.setConfig);
  const deployment = useDeployment(
    useCallback(() => generateSiteFiles(editor.config), [editor.config]),
    safeFileName(editor.config.meta.siteName)
  );

  // ── État UI local ──
  const [prompt, setPrompt] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Après connexion via magic-link : si l'utilisateur voulait payer, on rouvre le modal
  useEffect(() => {
    if (auth.isAuthenticated && payment.consumePayIntent()) {
      setPaymentModalOpen(true);
    }
  }, [auth.isAuthenticated, payment.consumePayIntent]);

  const handlePay = () => {
    payment.stashPending(editor.config); // mémorise le projet à payer (survit au login)
    if (!auth.user) {
      const email = window.prompt("Entrez votre email :");
      if (!email) return;
      payment.setPayIntent(); // le modal s'ouvrira automatiquement après connexion
      auth.login(email);
      return;
    }
    setPaymentModalOpen(true);
  };

  const handleReset = () => {
    if (!window.confirm("Réinitialiser le projet ?")) return;
    editor.setConfig(DEFAULT_CONFIG);
    setPrompt("");
  };

  return (
    <SiteConfigProvider value={editor}>
      <main className="flex h-screen">
        {isPreview && (
          <button
            onClick={() => setIsPreview(false)}
            className="fixed top-4 right-4 z-50 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span>←</span> Retour à l'édition
          </button>
        )}

        <EditorSidebar
          auth={auth}
          payment={payment}
          generation={generation}
          deployment={deployment}
          prompt={prompt}
          onPromptChange={setPrompt}
          isPreview={isPreview}
          onEnterPreview={() => setIsPreview(true)}
          onPay={handlePay}
          onReset={handleReset}
        />

        <div className={`${isPreview ? "w-full" : "w-2/3"} overflow-y-auto bg-white transition-all duration-300`}>
          <DynamicRenderer sections={editor.config.sections} meta={editor.config.meta} />
        </div>

        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={() => {
            setPaymentModalOpen(false);
            alert("🎉 Accès Pro activé ! Vous pouvez publier votre site.");
          }}
          payment={payment}
        />
      </main>
    </SiteConfigProvider>
  );
}