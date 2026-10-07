import type {
  ListItemData,
  SectionData,
  SiteConfig,
  SiteMeta,
  ThemeConfig,
} from "./site-config";
import type { ThemePreset } from "./themes";

export function updateMeta(config: SiteConfig, patch: Partial<SiteMeta>): SiteConfig {
  return { ...config, meta: { ...config.meta, ...patch } };
}

export function updateTheme(config: SiteConfig, patch: Partial<ThemeConfig>): SiteConfig {
  return updateMeta(config, { theme: { ...config.meta.theme, ...patch } });
}

export function updateSectionData(
  config: SiteConfig,
  sectionType: string,
  patch: Partial<SectionData>
): SiteConfig {
  return {
    ...config,
    sections: config.sections.map((s) =>
      s.type === sectionType ? { ...s, data: { ...s.data, ...patch } } : s
    ),
  };
}

export function updateSectionItem(
  config: SiteConfig,
  sectionType: string,
  index: number,
  patch: Partial<ListItemData>
): SiteConfig {
  return {
    ...config,
    sections: config.sections.map((s) => {
      if (s.type !== sectionType || !s.data.items) return s;
      return {
        ...s,
        data: {
          ...s.data,
          items: s.data.items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
        },
      };
    }),
  };
}

export function addSectionItem(
  config: SiteConfig,
  sectionType: string,
  item: ListItemData
): SiteConfig {
  return {
    ...config,
    sections: config.sections.map((s) =>
      s.type === sectionType
        ? { ...s, data: { ...s.data, items: [...(s.data.items ?? []), item] } }
        : s
    ),
  };
}

export function removeSectionItem(
  config: SiteConfig,
  sectionType: string,
  index: number
): SiteConfig {
  return {
    ...config,
    sections: config.sections.map((s) => {
      if (s.type !== sectionType || !s.data.items) return s;
      return {
        ...s,
        data: { ...s.data, items: s.data.items.filter((_, i) => i !== index) },
      };
    }),
  };
}

export function setSectionImage(
  config: SiteConfig,
  sectionType: string,
  imageUrl: string,
  itemIndex?: number
): SiteConfig {
  if (sectionType === "logo") return updateTheme(config, { logoUrl: imageUrl });
  return {
    ...config,
    sections: config.sections.map((s) => {
      if (s.type !== sectionType) return s;
      if (itemIndex !== undefined && s.data.items) {
        const key = sectionType === "testimonials" ? "avatar" : "imageUrl";
        return {
          ...s,
          data: {
            ...s.data,
            items: s.data.items.map((it, i) =>
              i === itemIndex ? { ...it, [key]: imageUrl } : it
            ),
          },
        };
      }
      return { ...s, data: { ...s.data, imageUrl } };
    }),
  };
}

export function applyThemePreset(config: SiteConfig, preset: ThemePreset): SiteConfig {
  // Sépare layoutStyle (propriété de SiteMeta) du patch de thème
  const { layoutStyle, ...themePatch } = preset.theme;
  const meta: SiteMeta = {
    ...config.meta,
    theme: { ...config.meta.theme, ...themePatch },
  };
  if (layoutStyle) meta.layoutStyle = layoutStyle;
  return { ...config, meta };
}