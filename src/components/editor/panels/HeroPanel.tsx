"use client";

import { useEditor } from "../SiteConfigContext";
import { Panel, ColorField, ImageUploadField, Field } from "../ui/primitives";
import { buildCtaLink, getCtaType, getCtaValue, type CtaType } from "@/lib/cta";
import { useTextRefine } from "@/hooks/useTextRefine";
import type { SectionData } from "@/lib/site-config";

const LOGO_STYLES = [
  { value: "minimal", label: "Simple" },
  { value: "circle", label: "Cercle" },
  { value: "square", label: "Carré" },
  { value: "gradient", label: "Dégradé" },
  { value: "drawn", label: "Dessiné" },
  { value: "neon", label: "Néon" },
  { value: "stamp", label: "Cachet" },
  { value: "embossed", label: "Embouti" },
];

const CTA_OPTIONS: { value: CtaType; label: string }[] = [
  { value: "tel", label: "📞 Appel" },
  { value: "whatsapp", label: "💬 WhatsApp" },
  { value: "mailto", label: "✉️ Email" },
  { value: "anchor", label: "⬇️ Formulaire" },
  { value: "url", label: "🔗 Lien externe" },
];

function TextFieldWithRefine({
  label,
  value,
  onChange,
  onRefine,
  refining,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onRefine: () => void;
  refining: boolean;
}) {
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
        />
        <button
          onClick={onRefine}
          disabled={refining}
          className="p-2 text-orange-400 hover:text-orange-300 disabled:opacity-50 bg-gray-700 rounded border border-gray-600"
        >
          {refining ? "⏳" : "✨"}
        </button>
      </div>
    </Field>
  );
}

export function HeroPanel() {
  const { config, patchMeta, patchTheme, patchSection, setSectionImage } = useEditor();
  const { refiningField, refine } = useTextRefine();

  const heroData: SectionData = config.sections.find((s) => s.type === "hero")?.data ?? {};
  const headline = heroData.headline ?? "";
  const subheadline = heroData.subheadline ?? "";
  const ctaLink = heroData.ctaLink ?? "";
  const ctaType = getCtaType(ctaLink);
  const updateHero = (patch: Partial<SectionData>) => patchSection("hero", patch);

  return (
    <Panel title="1. Hero" accent="orange">
      <input
        type="text"
        value={config.meta.siteName ?? ""}
        onChange={(e) => patchMeta({ siteName: e.target.value })}
        placeholder="Nom du site"
        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
      />

      <ImageUploadField
        label="Logo (Image)"
        onPicked={(dataUrl) => setSectionImage("logo", dataUrl)}
      />

      <div className="grid grid-cols-2 gap-2">
        <Field label="Logo Texte">
          <input
            type="text"
            maxLength={20}
            value={config.meta.theme.logoLetter ?? ""}
            onChange={(e) => patchTheme({ logoLetter: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-center font-bold"
          />
        </Field>
        <Field label="Style Logo">
          <select
            value={config.meta.theme.logoStyle ?? "minimal"}
            onChange={(e) => patchTheme({ logoStyle: e.target.value })}
            className="w-full h-9 rounded bg-gray-700 border border-gray-600 px-2 text-xs"
          >
            {LOGO_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <ColorField
        label="Couleur Logo"
        value={config.meta.theme.logoColor ?? config.meta.theme.brandColor}
        fallback="#F97316"
        onChange={(hex) => patchTheme({ logoColor: hex })}
        withTextInput
      />

      <TextFieldWithRefine
        label="Titre Principal"
        value={headline}
        onChange={(v) => updateHero({ headline: v })}
        onRefine={() => refine("hero-h", headline, (val) => updateHero({ headline: val }))}
        refining={refiningField === "hero-h"}
      />
      <TextFieldWithRefine
        label="Description"
        value={subheadline}
        onChange={(v) => updateHero({ subheadline: v })}
        onRefine={() => refine("hero-d", subheadline, (val) => updateHero({ subheadline: val }))}
        refining={refiningField === "hero-d"}
      />

      <div className="flex gap-2 items-center">
        <label className="text-xs text-gray-400 w-20">Titre</label>
        <input
          type="color"
          value={config.meta.theme.textColor ?? "#FFFFFF"}
          onChange={(e) => patchTheme({ textColor: e.target.value })}
          className="w-8 h-6 rounded cursor-pointer bg-transparent border p-0.5"
        />
        <input
          type="range"
          min={30}
          max={80}
          value={config.meta.theme.fontSize ?? 48}
          onChange={(e) => patchTheme({ fontSize: Number(e.target.value) })}
          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>
      <ColorField
        label="Texte"
        value={config.meta.theme.secondaryTextColor}
        fallback="#CCCCCC"
        onChange={(hex) => patchTheme({ secondaryTextColor: hex })}
      />
      <ColorField
        label="Bouton"
        value={config.meta.theme.primaryColor}
        fallback="#F97316"
        onChange={(hex) => patchTheme({ primaryColor: hex })}
      />

      <select
        value={ctaType}
        onChange={(e) => updateHero({ ctaLink: buildCtaLink(e.target.value as CtaType) })}
        className="w-full h-8 rounded bg-gray-700 border border-gray-600 px-2 text-xs"
      >
        {CTA_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {ctaType !== "anchor" && (
        <input
          type="text"
          value={getCtaValue(ctaLink)}
          onChange={(e) => updateHero({ ctaLink: buildCtaLink(ctaType, e.target.value) })}
          placeholder="Valeur..."
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-xs"
        />
      )}
    </Panel>
  );
}