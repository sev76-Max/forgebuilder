"use client";

import { useEditor } from "../SiteConfigContext";
import { Panel, Field } from "../ui/primitives";
import type { SiteMeta } from "@/lib/site-config";

const SOCIAL_FIELDS: { key: keyof SiteMeta; icon: string; placeholder: string }[] = [
  { key: "socialFacebook", icon: "📘", placeholder: "Lien Facebook" },
  { key: "socialInstagram", icon: "📸", placeholder: "Lien Instagram" },
  { key: "socialTwitter", icon: "🐦", placeholder: "Lien Twitter / X" },
  { key: "socialLinkedin", icon: "💼", placeholder: "Lien LinkedIn" },
];

export function ContactPanel() {
  const { config, patchMeta } = useEditor();
  const meta = config.meta;

  return (
    <Panel title="6. Contact & Footer" accent="cyan">
      <Field label="Email de réception">
        <input
          type="email"
          value={meta.contactEmail ?? ""}
          onChange={(e) => patchMeta({ contactEmail: e.target.value })}
          placeholder="contact@email.com"
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
        />
      </Field>
      <Field label="Téléphone">
        <input
          type="text"
          value={meta.phone ?? ""}
          onChange={(e) => patchMeta({ phone: e.target.value })}
          placeholder="+221 77 000 00 00"
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
        />
      </Field>
      <Field label="Action du bouton Contact">
        <select
          value={meta.phoneType ?? "tel"}
          onChange={(e) => patchMeta({ phoneType: e.target.value as "tel" | "whatsapp" })}
          className="w-full h-8 rounded bg-gray-700 border border-gray-600 px-2 text-xs"
        >
          <option value="tel">📞 Appel téléphonique</option>
          <option value="whatsapp">💬 Ouvrir WhatsApp</option>
        </select>
      </Field>
      <Field label="Adresse">
        <input
          type="text"
          value={meta.address ?? ""}
          onChange={(e) => patchMeta({ address: e.target.value })}
          placeholder="Dakar, Sénégal"
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
        />
      </Field>

      <div className="space-y-2 pt-2 border-t border-gray-700 mt-2">
        <label className="text-xs text-gray-400 block">Réseaux Sociaux (URLs)</label>
        {SOCIAL_FIELDS.map((f) => (
          <div key={f.key} className="flex gap-2 items-center">
            <span className="text-lg">{f.icon}</span>
            <input
              type="text"
              value={(meta[f.key] as string | undefined) ?? ""}
              onChange={(e) => patchMeta({ [f.key]: e.target.value } as Partial<SiteMeta>)}
              placeholder={f.placeholder}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
            />
          </div>
        ))}
      </div>
    </Panel>
  );
}