import type { ThemeConfig } from "./site-config";

export interface ThemePreset {
  name: string;
  icon: string;
  // Patch de thème + éventuellement un style de layout
  theme: Partial<ThemeConfig> & { layoutStyle?: string };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Nuit",
    icon: "🌙",
    theme: {
      primaryColor: "#6366f1", textColor: "#ffffff", secondaryTextColor: "#e5e7eb",
      featureTitleColor: "#ffffff", featureDescColor: "#d1d5db",
      brandColor: "#818cf8", logoColor: "#818cf8", logoStyle: "neon",
    },
  },
  {
    name: "Nature",
    icon: "🌲",
    theme: {
      primaryColor: "#15803d", textColor: "#1f2937", secondaryTextColor: "#4b5563",
      featureTitleColor: "#166534", featureDescColor: "#374151",
      brandColor: "#15803d", logoColor: "#15803d", logoStyle: "stamp",
    },
  },
  {
    name: "Océan",
    icon: "🌊",
    theme: {
      primaryColor: "#0ea5e9", textColor: "#0c4a6e", secondaryTextColor: "#0369a1",
      featureTitleColor: "#0284c7", featureDescColor: "#334155",
      brandColor: "#0ea5e9", logoColor: "#0ea5e9", logoStyle: "circle",
    },
  },
  {
    name: "Manga",
    icon: "🎨",
    theme: {
      primaryColor: "#ec4899", textColor: "#831843", secondaryTextColor: "#be185d",
      featureTitleColor: "#be185d", featureDescColor: "#831843",
      brandColor: "#ec4899", logoColor: "#ec4899", logoStyle: "drawn",
    },
  },
  {
    name: "Luxe",
    icon: "👑",
    theme: {
      primaryColor: "#b91c1c", textColor: "#1c1917", secondaryTextColor: "#44403c",
      featureTitleColor: "#881337", featureDescColor: "#57534e",
      brandColor: "#ca8a04", logoColor: "#ca8a04", logoStyle: "embossed",
    },
  },
];