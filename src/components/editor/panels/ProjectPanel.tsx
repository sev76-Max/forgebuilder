"use client";

import { useRef, type ChangeEvent } from "react";
import { useEditor } from "../SiteConfigContext";
import { downloadConfigJson, loadConfigFromFile } from "@/lib/project-io";

export function ProjectPanel({ onReset }: { onReset: () => void }) {
  const { config, setConfig } = useEditor();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLoad = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setConfig(await loadConfigFromFile(file));
    } catch {
      alert("Fichier invalide");
    }
  };

  return (
    <div className="mb-8 border border-gray-700 bg-gray-800/50 rounded-lg p-4 space-y-3">
      <h3 className="text-md font-semibold text-gray-300 uppercase">💾 Projet</h3>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => downloadConfigJson(config)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
        >
          Sauvegarder
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs font-medium"
        >
          Charger
        </button>
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-red-900/50 hover:bg-red-900 text-red-400 text-xs font-medium"
        >
          Reset
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleLoad}
        />
      </div>
    </div>
  );
}