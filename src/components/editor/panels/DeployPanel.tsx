"use client";

import { Panel } from "../ui/primitives";
import type { DeployProvider } from "@/hooks/useDeployment";

interface DeployPanelProps {
  isPro: boolean;
  checkingAuth: boolean;
  isAuthenticated: boolean;
  paymentLoading: boolean;
  deploying: DeployProvider | null;
  deployUrl: string;
  onPay: () => void;
  onDeploy: (provider: DeployProvider) => void;
}

export function DeployPanel({
  isPro,
  checkingAuth,
  isAuthenticated,
  paymentLoading,
  deploying,
  deployUrl,
  onPay,
  onDeploy,
}: DeployPanelProps) {
  return (
    <Panel title="☁️ Mise en ligne" accent="gray">
      {!isPro ? (
        <div className="bg-gray-700/50 p-3 rounded border border-gray-600 text-center">
          <p className="text-sm font-bold text-white">Verrouillé</p>
          {checkingAuth ? (
            <button
              disabled
              className="w-full mt-2 bg-gray-500 text-white font-bold py-3 px-4 rounded-lg text-sm cursor-wait animate-pulse"
            >
              Vérification...
            </button>
          ) : !isAuthenticated ? (
            <button
              onClick={onPay}
              className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-lg hover:opacity-90 transition"
            >
              Se connecter pour payer
            </button>
          ) : (
            <button
              onClick={onPay}
              disabled={paymentLoading}
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {paymentLoading ? "Traitement..." : "Débloquer 10 000 FCFA"}
            </button>
          )}
          <p className="text-xs text-gray-500 mt-2">Orange Money • Wave • MoMo — validation rapide</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Publiez instantanément.</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onDeploy("netlify")}
              disabled={deploying === "netlify"}
              className="p-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold disabled:opacity-50 transition"
            >
              {deploying === "netlify" ? "⏳..." : "🚀 Netlify"}
            </button>
            <button
              onClick={() => onDeploy("vercel")}
              disabled={deploying === "vercel"}
              className="p-2 rounded bg-black hover:bg-gray-900 text-white text-xs font-bold disabled:opacity-50 border border-gray-500 transition"
            >
              {deploying === "vercel" ? "⏳..." : "▲ Vercel"}
            </button>
          </div>
        </div>
      )}
      {deployUrl && (
        <div className="bg-green-900/30 p-2 rounded border border-green-500 text-green-300 text-center mt-2">
          <p className="text-xs font-bold">🎉 Site en ligne :</p>
          <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="underline text-xs break-all">
            {deployUrl}
          </a>
        </div>
      )}
    </Panel>
  );
}