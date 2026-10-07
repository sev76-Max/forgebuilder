"use client";

import type { ChangeEvent, ReactNode } from "react";
import { readImageAsDataUrl } from "@/lib/image";

// ---------- Panel avec accent coloré ----------
const ACCENTS = {
  teal: { box: "border-teal-700 bg-teal-900/20", title: "text-teal-300" },
  pink: { box: "border-pink-700 bg-pink-900/20", title: "text-pink-300" },
  orange: { box: "border-orange-700 bg-orange-900/20", title: "text-orange-400" },
  purple: { box: "border-purple-700 bg-purple-900/20", title: "text-purple-400" },
  green: { box: "border-green-700 bg-green-900/20", title: "text-green-400" },
  amber: { box: "border-amber-700 bg-amber-900/20", title: "text-amber-400" },
  yellow: { box: "border-yellow-700 bg-yellow-900/20", title: "text-yellow-400" },
  red: { box: "border-red-700 bg-red-900/20", title: "text-red-400" },
  cyan: { box: "border-cyan-700 bg-cyan-900/20", title: "text-cyan-400" },
  gray: { box: "border-gray-500 bg-gray-800/50", title: "text-white" },
} as const;
export type PanelAccent = keyof typeof ACCENTS;

export function Panel({
  title,
  accent,
  children,
}: {
  title: string;
  accent: PanelAccent;
  children: ReactNode;
}) {
  const s = ACCENTS[accent];
  return (
    <div className={`border ${s.box} rounded-lg p-4 space-y-3`}>
      <h3 className={`text-md font-semibold uppercase ${s.title}`}>{title}</h3>
      {children}
    </div>
  );
}

// ---------- Champ avec label ----------
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{label}</label>
      {children}
    </div>
  );
}

// ---------- Sélecteur de couleur (normalise le "#") ----------
export function ColorField({
  label,
  value,
  fallback,
  onChange,
  withTextInput = false,
}: {
  label: string;
  value?: string;
  fallback: string;
  onChange: (hex: string) => void;
  withTextInput?: boolean;
}) {
  const current = value || fallback;
  const normalize = (v: string) => (v && !v.startsWith("#") ? `#${v}` : v);
  return (
    <div className="flex gap-2 items-center">
      <label className="text-xs text-gray-400 w-20">{label}</label>
      <input
        type="color"
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-6 rounded cursor-pointer bg-transparent border p-0.5"
      />
      {withTextInput && (
        <input
          type="text"
          value={current}
          onChange={(e) => onChange(normalize(e.target.value))}
          className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs uppercase"
        />
      )}
    </div>
  );
}

// ---------- Upload d'image ----------
const UPLOAD_COLORS = {
  orange: "file:bg-orange-50 file:text-orange-700",
  amber: "file:bg-amber-50 file:text-amber-700",
} as const;

export function ImageUploadField({
  label,
  accent = "orange",
  onPicked,
}: {
  label: string;
  accent?: keyof typeof UPLOAD_COLORS;
  onPicked: (dataUrl: string) => void;
}) {
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      onPicked(await readImageAsDataUrl(file));
    } catch (err) {
      console.error(err);
      alert("Impossible de lire l'image.");
    } finally {
      e.target.value = "";
    }
  };
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className={`w-full text-xs text-gray-400 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs cursor-pointer ${UPLOAD_COLORS[accent]}`}
      />
    </div>
  );
}