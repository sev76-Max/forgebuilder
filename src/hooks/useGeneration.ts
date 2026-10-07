"use client";

import { useCallback, useState } from "react";
import type { SiteConfig } from "@/lib/site-config";

export function useGeneration(onConfig: (config: SiteConfig) => void) {
  const [isLoading, setIsLoading] = useState(false);

  const generate = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return;
      setIsLoading(true);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        // La réponse peut être du JSON ou du HTML (si timeout passerelle)
        let data: { config?: SiteConfig; error?: string } = {};
        try {
          data = await res.json();
        } catch {
          /* corps non-JSON → on passe au message ci-dessous */
        }

        if (res.ok && data.config) {
          onConfig(data.config);
        } else if (res.status === 504 || res.status === 502) {
          alert(
            "⏱️ La génération a pris trop de temps (timeout serveur). " +
            "Réessayez ; si ça persiste, le modèle IA est trop lent."
          );
        } else {
          alert(`❌ Génération échouée : ${data.error || `erreur HTTP ${res.status}`}`);
        }
      } catch (err) {
        console.error(err);
        alert("❌ Erreur de connexion au serveur.");
      } finally {
        setIsLoading(false);
      }
    },
    [onConfig]
  );

  return { isLoading, generate };
}

export type UseGenerationReturn = ReturnType<typeof useGeneration>;