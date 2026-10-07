"use client";

import { useCallback, useState } from "react";

export type DeployProvider = "vercel" | "netlify";

export function useDeployment(
  getFiles: () => Record<string, string>,
  siteName: string
) {
  const [deploying, setDeploying] = useState<DeployProvider | null>(null);
  const [deployUrl, setDeployUrl] = useState("");

  const deploy = useCallback(
    async (provider: DeployProvider) => {
      setDeploying(provider);
      setDeployUrl("");
      try {
        const res = await fetch("/api/deploy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, files: getFiles(), siteName }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur serveur");
        setDeployUrl(data.url);
        alert(`🚀 Site publié : ${data.url}`);
      } catch (e) {
        alert(`Erreur : ${e instanceof Error ? e.message : "Erreur inconnue"}`);
      } finally {
        setDeploying(null);
      }
    },
    [getFiles, siteName]
  );

  return { deploying, deployUrl, deploy };
}

export type UseDeploymentReturn = ReturnType<typeof useDeployment>;