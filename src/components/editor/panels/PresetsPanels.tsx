"use client";

import { useEditor } from "../SiteConfigContext";
import { Panel } from "../ui/primitives";
import { THEME_PRESETS } from "@/lib/themes";
import { TEMPLATES } from "@/lib/templates";

export function ThemePresetsPanel() {
  const { applyThemePreset } = useEditor();
  return (
    <Panel title="✨ Thèmes" accent="teal">
      <div className="grid grid-cols-2 gap-2">
        {THEME_PRESETS.map((t) => (
          <button
            key={t.name}
            onClick={() => applyThemePreset(t)}
            className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs font-medium"
          >
            <span>{t.icon}</span> {t.name}
          </button>
        ))}
      </div>
    </Panel>
  );
}

export function TemplatesPanel() {
  const { setConfig } = useEditor();
  return (
    <Panel title="📦 Templates Rapides" accent="pink">
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
        {TEMPLATES.map((t, idx) => (
          <button
            key={idx}
            onClick={() => setConfig(t.config)}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs font-medium transition-all hover:scale-105 group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{t.icon}</span>
            <span className="text-gray-200 truncate w-full text-center">{t.name}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}