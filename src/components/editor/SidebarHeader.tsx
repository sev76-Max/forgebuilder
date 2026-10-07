"use client";

import type { UseAuthReturn } from "@/hooks/useAuth";

export function SidebarHeader({
  auth,
  onEnterPreview,
}: {
  auth: UseAuthReturn;
  onEnterPreview: () => void;
}) {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-orange-500">ForgeBuilder</h1>
        <p className="text-gray-400 mt-2">Propulsez votre idée instantanément.</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEnterPreview}
          className="text-xs bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded font-bold"
        >
          Voir le site
        </button>
        {auth.checkingAuth ? (
          <span className="text-xs text-gray-400 px-3 py-1 animate-pulse">Vérification...</span>
        ) : auth.isAuthenticated ? (
          <button
            onClick={auth.logout}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-gray-300"
          >
            Déconnexion
          </button>
        ) : (
          <button
            onClick={() => auth.login()}
            className="text-xs bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded font-bold"
          >
            Connexion
          </button>
        )}
      </div>
    </div>
  );
}