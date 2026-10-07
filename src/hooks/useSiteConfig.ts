"use client";

import { useCallback, useState } from "react";
import { DEFAULT_CONFIG } from "@/lib/default-config";
import * as ops from "@/lib/config-operations";
import type {
  ListItemData,
  SectionData,
  SiteConfig,
  SiteMeta,
  ThemeConfig,
} from "@/lib/site-config";
import type { ThemePreset } from "@/lib/themes";

export function useSiteConfig(initial: SiteConfig = DEFAULT_CONFIG) {
  const [config, setConfig] = useState<SiteConfig>(initial);

  const patchMeta = useCallback(
    (patch: Partial<SiteMeta>) => setConfig((c) => ops.updateMeta(c, patch)),
    []
  );
  const patchTheme = useCallback(
    (patch: Partial<ThemeConfig>) => setConfig((c) => ops.updateTheme(c, patch)),
    []
  );
  const patchSection = useCallback(
    (type: string, patch: Partial<SectionData>) =>
      setConfig((c) => ops.updateSectionData(c, type, patch)),
    []
  );
  const patchItem = useCallback(
    (type: string, index: number, patch: Partial<ListItemData>) =>
      setConfig((c) => ops.updateSectionItem(c, type, index, patch)),
    []
  );
  const addItem = useCallback(
    (type: string, item: ListItemData) => setConfig((c) => ops.addSectionItem(c, type, item)),
    []
  );
  const removeItem = useCallback(
    (type: string, index: number) => setConfig((c) => ops.removeSectionItem(c, type, index)),
    []
  );
  const setSectionImage = useCallback(
    (sectionType: string, imageUrl: string, itemIndex?: number) =>
      setConfig((c) => ops.setSectionImage(c, sectionType, imageUrl, itemIndex)),
    []
  );
  const applyThemePreset = useCallback(
    (preset: ThemePreset) => setConfig((c) => ops.applyThemePreset(c, preset)),
    []
  );

  const getSection = useCallback(
    (type: string) => config.sections.find((s) => s.type === type),
    [config]
  );
  const hasSection = useCallback(
    (type: string) => config.sections.some((s) => s.type === type),
    [config]
  );

  return {
    config,
    setConfig,
    patchMeta,
    patchTheme,
    patchSection,
    patchItem,
    addItem,
    removeItem,
    setSectionImage,
    applyThemePreset,
    getSection,
    hasSection,
  };
}

export type UseSiteConfigReturn = ReturnType<typeof useSiteConfig>;