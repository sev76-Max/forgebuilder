"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { UseSiteConfigReturn } from "@/hooks/useSiteConfig";

const SiteConfigContext = createContext<UseSiteConfigReturn | null>(null);

export function SiteConfigProvider({
  value,
  children,
}: {
  value: UseSiteConfigReturn;
  children: ReactNode;
}) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useEditor(): UseSiteConfigReturn {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error("useEditor doit être utilisé dans <SiteConfigProvider>");
  return ctx;
}