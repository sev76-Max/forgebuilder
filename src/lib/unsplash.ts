// src/lib/unsplash.ts

export function getDemoImages(query: string): string[] {
  if (!query) return [];
  
  // SOLUTION ULTIME (Fiable à 100%)
  // Utilise LoremFlickr qui fonctionne toujours sans clé API
  return Array.from({ length: 6 }, (_, i) => 
    `https://loremflickr.com/1600/900/${encodeURIComponent(query)}?random=${Date.now() + i}`
  );
}