"use client";

import { useEditor } from "../SiteConfigContext";
import { exportNextJsProject, exportStaticZip } from "@/lib/project-io";

export function ExportPanel() {
  const { config } = useEditor();
  return (
    <div className="pt-6 border-t border-gray-700 space-y-3">
      <p className="text-xs text-gray-500 text-center">Téléchargement manuel</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => exportStaticZip(config)}
          className="p-2 rounded bg-gray-600 hover:bg-gray-500 text-white text-xs font-medium"
        >
          📱 ZIP
        </button>
        <button
          onClick={() => exportNextJsProject(config)}
          className="p-2 rounded bg-gray-600 hover:bg-gray-500 text-white text-xs font-medium"
        >
          📦 Next.js
        </button>
      </div>
    </div>
  );
}