"use client";

import { useEditor } from "../SiteConfigContext";
import { Panel, ImageUploadField, type PanelAccent } from "../ui/primitives";
import type { ListItemData } from "@/lib/site-config";

export interface ListFieldDef {
  key: string;
  placeholder?: string;
  multiline?: boolean;
}

interface ListPanelProps {
  sectionType: string;
  title: string;
  accent: PanelAccent;
  fields: ListFieldDef[];
  manageItems?: boolean;
  addLabel?: string;
  newItemTemplate?: ListItemData;
  imageLabel?: string;
  renderAlways?: boolean;
}

export function ListPanel({
  sectionType,
  title,
  accent,
  fields,
  manageItems,
  addLabel,
  newItemTemplate,
  imageLabel,
  renderAlways,
}: ListPanelProps) {
  const { config, patchItem, addItem, removeItem, setSectionImage } = useEditor();
  const section = config.sections.find((s) => s.type === sectionType);

  if (!section && !renderAlways) return null;
  const items = section?.data?.items ?? [];

  return (
    <Panel title={title} accent={accent}>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-700 p-2 rounded space-y-1 bg-gray-800/50 relative"
          >
            {manageItems && (
              <button
                onClick={() => removeItem(sectionType, idx)}
                className="absolute top-1 right-1 text-red-400 hover:text-red-300 text-xs p-1 hover:bg-red-900/50 rounded"
                aria-label="Supprimer"
              >
                ×
              </button>
            )}
            {fields.map((f) =>
              f.multiline ? (
                <textarea
                  key={f.key}
                  rows={2}
                  placeholder={f.placeholder}
                  value={String(item[f.key] ?? "")}
                  onChange={(e) => patchItem(sectionType, idx, { [f.key]: e.target.value })}
                  className="w-full bg-gray-700 rounded px-2 py-1 text-xs"
                />
              ) : (
                <input
                  key={f.key}
                  type="text"
                  placeholder={f.placeholder}
                  value={String(item[f.key] ?? "")}
                  onChange={(e) => patchItem(sectionType, idx, { [f.key]: e.target.value })}
                  className="w-full bg-gray-700 rounded px-2 py-1 text-xs"
                />
              )
            )}
            {manageItems && (
              <ImageUploadField
                label={imageLabel ?? "Image"}
                accent="amber"
                onPicked={(dataUrl) => setSectionImage(sectionType, dataUrl, idx)}
              />
            )}
          </div>
        ))}
        {manageItems && (
          <button
            onClick={() => addItem(sectionType, newItemTemplate ?? { title: "Nouvel élément" })}
            className="w-full mt-2 p-2 bg-amber-600 hover:bg-amber-700 rounded text-xs font-bold transition-colors"
          >
            {addLabel ?? "+ Ajouter"}
          </button>
        )}
      </div>
    </Panel>
  );
}