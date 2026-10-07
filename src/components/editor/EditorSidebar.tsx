"use client";

import { useEditor } from "./SiteConfigContext";
import { SidebarHeader } from "./SidebarHeader";
import { ProjectPanel } from "./panels/ProjectPanel";
import { PromptForm } from "./panels/PromptForm";
import { ThemePresetsPanel, TemplatesPanel } from "./panels/PresetsPanels";
import { HeroPanel } from "./panels/HeroPanel";
import { GlobalStylesPanel } from "./panels/GlobalStylesPanel";
import { ListPanel } from "./panels/ListPanel";
import { ContactPanel } from "./panels/ContactPanel";
import { DeployPanel } from "./panels/DeployPanel";
import { ExportPanel } from "./panels/ExportPanel";
import { LoadingOverlay, PaymentOverlay } from "@/components/overlays/BusyOverlays";
import { DEFAULT_CONFIG } from "@/lib/default-config";
import type { UseAuthReturn } from "@/hooks/useAuth";
import type { UsePaymentReturn } from "@/hooks/usePayment";
import type { UseGenerationReturn } from "@/hooks/useGeneration";
import type { UseDeploymentReturn } from "@/hooks/useDeployment";

interface EditorSidebarProps {
  auth: UseAuthReturn;
  payment: UsePaymentReturn;
  generation: UseGenerationReturn;
  deployment: UseDeploymentReturn;
  prompt: string;
  onPromptChange: (v: string) => void;
  isPreview: boolean;
  onEnterPreview: () => void;
  onPay: () => void;
  onReset: () => void;
}

export function EditorSidebar({
  auth,
  payment,
  generation,
  deployment,
  prompt,
  onPromptChange,
  isPreview,
  onEnterPreview,
  onPay,
  onReset,
}: EditorSidebarProps) {
  const { config } = useEditor();
  const showEditor =
    config.meta.siteName !== DEFAULT_CONFIG.meta.siteName || auth.isAuthenticated;

  return (
    <div
      className={`${isPreview ? "hidden" : "w-1/3"} bg-gray-900 text-white p-8 flex flex-col border-r border-gray-700 relative overflow-y-auto transition-all duration-300`}
    >
      <LoadingOverlay visible={generation.isLoading} />
      <PaymentOverlay visible={payment.paymentLoading} />

      <SidebarHeader auth={auth} onEnterPreview={onEnterPreview} />
      <ProjectPanel onReset={onReset} />
      <PromptForm prompt={prompt} onPromptChange={onPromptChange} generation={generation} />

      {showEditor && (
        <div className="border-t border-gray-700 pt-6 space-y-6 flex-1">
          <h2 className="text-xl font-bold text-gray-200">🎨 Palette & Contenu</h2>
          <ThemePresetsPanel />
          <TemplatesPanel />
          <HeroPanel />
          <GlobalStylesPanel />
          <ListPanel
            sectionType="features"
            title="3. Services"
            accent="green"
            renderAlways
            fields={[{ key: "title" }, { key: "description", multiline: true }]}
          />
          <ListPanel
            sectionType="products"
            title="🛍️ Produits"
            accent="amber"
            manageItems
            addLabel="+ Ajouter un produit"
            imageLabel="Image du produit"
            newItemTemplate={{
              title: "Nouveau Produit",
              price: "10 000 FCFA",
              description: "Description du produit",
              imageUrl: "",
            }}
            fields={[
              { key: "title", placeholder: "Nom du produit" },
              { key: "price", placeholder: "Prix (ex: 15 000 FCFA)" },
              { key: "description", placeholder: "Description", multiline: true },
            ]}
          />
          <ListPanel
            sectionType="testimonials"
            title="4. Témoignages"
            accent="yellow"
            fields={[
              { key: "author", placeholder: "Auteur" },
              { key: "quote", placeholder: "Citation", multiline: true },
            ]}
          />
          <ListPanel
            sectionType="blog"
            title="5. Blog"
            accent="red"
            fields={[
              { key: "title", placeholder: "Titre" },
              { key: "excerpt", placeholder: "Extrait", multiline: true },
            ]}
          />
          <ContactPanel />
          <DeployPanel
            isPro={payment.isPro}
            checkingAuth={auth.checkingAuth}
            isAuthenticated={auth.isAuthenticated}
            paymentLoading={payment.paymentLoading}
            deploying={deployment.deploying}
            deployUrl={deployment.deployUrl}
            onPay={onPay}
            onDeploy={deployment.deploy}
          />
          <ExportPanel />
        </div>
      )}
    </div>
  );
}