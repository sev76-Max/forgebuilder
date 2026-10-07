import JSZip from "jszip";
import type { SiteConfig } from "./site-config";
import { generateSiteFiles } from "./exporter";
import {
  generatePackageJson,
  generatePageTsx,
  generateLayoutTsx,
  generateNextConfig,
  generateTailwindConfig,
  generatePublicManifest,
  generatePublicIcon,
  generateProjectReadme,
} from "./projectGenerator";

export function safeFileName(name: string): string {
  return (name || "Site").trim().replace(/\s+/g, "-") || "Site";
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function downloadConfigJson(config: SiteConfig) {
  const dataUri =
    "data:application/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(config, null, 2));
  const link = document.createElement("a");
  link.href = dataUri;
  link.download = `${safeFileName(config.meta?.siteName)}.json`;
  link.click();
}

export function loadConfigFromFile(file: File): Promise<SiteConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed?.meta && parsed?.sections) resolve(parsed as SiteConfig);
        else reject(new Error("Structure invalide"));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function exportStaticZip(config: SiteConfig) {
  const zip = new JSZip();
  const files = generateSiteFiles(config);
  for (const [filename, content] of Object.entries(files)) {
    zip.file(filename, content);
  }
  downloadBlob(
    await zip.generateAsync({ type: "blob" }),
    `${safeFileName(config.meta?.siteName)}.zip`
  );
}

export async function exportNextJsProject(config: SiteConfig) {
  const zip = new JSZip();
  const src = zip.folder("src");
  const app = src?.folder("app");
  const pub = zip.folder("public");

  zip.file("package.json", generatePackageJson(config));
  zip.file("next.config.js", generateNextConfig());
  zip.file("tailwind.config.js", generateTailwindConfig());
  zip.file("README.md", generateProjectReadme(config));
  app?.file("page.tsx", generatePageTsx(config));
  app?.file("layout.tsx", generateLayoutTsx(config));
  app?.file("globals.css", `@tailwind base;\n@tailwind components;\n@tailwind utilities;`);
  pub?.file("manifest.json", generatePublicManifest(config));
  pub?.file("icon.svg", generatePublicIcon(config));

  downloadBlob(
    await zip.generateAsync({ type: "blob" }),
    `${safeFileName(config.meta?.siteName)}-nextjs.zip`
  );
}