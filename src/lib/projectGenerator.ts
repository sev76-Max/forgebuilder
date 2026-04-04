// src/lib/projectGenerator.ts
import { SiteConfig } from "./site-config";

export function generatePackageJson(config: SiteConfig) {
  return JSON.stringify({
    name: config.meta.siteName.toLowerCase().replace(/\s+/g, '-'),
    version: "1.0.0",
    private: true,
    scripts: { dev: "next dev", build: "next build", start: "next start" },
    dependencies: { "next": "14.2.3", "react": "^18", "react-dom": "^18", "@supabase/supabase-js": "^2.43.0" },
    devDependencies: { "typescript": "^5", "@types/node": "^20", "@types/react": "^18", "@types/react-dom": "^18", "postcss": "^8", "tailwindcss": "^3.4.1", "autoprefixer": "^10.0.1" }
  }, null, 2);
}

export function generatePublicManifest(config: SiteConfig) {
  const faviconLetter = config.meta.theme.logoLetter || config.meta.siteName?.charAt(0) || "F";
  const bgColor = config.meta.theme.brandColor || config.meta.theme.primaryColor || "#F97316";
  return JSON.stringify({
    name: config.meta.siteName, short_name: config.meta.siteName.substring(0, 12), description: `Site pour ${config.meta.siteName}`, start_url: "/", display: "standalone", background_color: "#ffffff", theme_color: bgColor,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }]
  }, null, 2);
}

export function generatePublicIcon(config: SiteConfig) {
  const letter = config.meta.theme.logoLetter || config.meta.siteName?.charAt(0) || "F";
  const bgColor = config.meta.theme.brandColor || config.meta.theme.primaryColor || "#F97316";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="${bgColor}" rx="100"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-size="280" font-weight="800" fill="white">${letter}</text></svg>`;
}

export function generateProjectReadme(config: SiteConfig) {
  return `
# ${config.meta.siteName}

Site web dynamique généré par **ForgeBuilder** (Next.js + Supabase).

## 🛠️ Installation Locale

1. Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé.
2. Ouvrez un terminal dans ce dossier.
3. Installez les dépendances :
   \`\`\`bash
   npm install
   \`\`\`
4. Lancez le serveur :
   \`\`\`bash
   npm run dev
   \`\`\`
5. Ouvrez [http://localhost:3000](http://localhost:3000).

## 🚀 Déploiement sur Vercel

1. Poussez ce dossier sur un dépôt GitHub.
2. Importez le projet sur [Vercel](https://vercel.com).
3. C'est prêt !

## 🔐 Configuration Base de Données (Supabase)

Pour que le formulaire fonctionne :
1. Créez un projet sur [Supabase](https://supabase.com).
2. Exécutez cette requête SQL pour créer la table :
   \`\`\`sql
   create table contacts (
     id serial primary key,
     created_at timestamp default now(),
     name text,
     email text,
     message text
   );
   \`\`\`
3. Créez un fichier \`.env.local\` à la racine avec vos clés :
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=VOTRE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_CLE
   \`\`\`

---
Généré avec ❤️ par ForgeBuilder.
`;
}

export function generateLayoutTsx(config: SiteConfig) {
  const hero = config.sections.find(s => s.type === 'hero')?.data || {};
  const metaDescription = hero.subheadline || `Site de ${config.meta.siteName}`;
  const pageTitle = hero.headline || config.meta.siteName;
  const faviconLetter = config.meta.theme.logoLetter || config.meta.siteName?.charAt(0) || "F";
  const svgFavicon = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='${encodeURIComponent(config.meta.theme.brandColor || config.meta.theme.primaryColor)}'/><text x='50' y='68' font-family='Inter' font-size='60' font-weight='bold' text-anchor='middle' fill='white'>${faviconLetter}</text></svg>`;

  return `
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${pageTitle} | ${config.meta.siteName}',
  description: '${metaDescription}',
  icons: { icon: '/icon.svg' },
  manifest: '/manifest.json'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>
}
`;
}

export function generatePageTsx(config: SiteConfig) {
  const theme = config.meta.theme;
  const hero = config.sections.find(s => s.type === 'hero')?.data || {};
  const features = config.sections.find(s => s.type === 'features')?.data || { title: "Services", items: [] };

  return `
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '${config.meta.theme.supabaseUrl || ''}';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '${config.meta.theme.supabaseKey || ''}';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const { error } = await supabase.from('contacts').insert([{ name: data.get('name'), email: data.get('email'), message: data.get('message') }]);
    if (!error) setSubmitted(true); else alert('Erreur');
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO - NETTETE MAXIMALE */}
      <section style={{ backgroundColor: '${theme.primaryColor}20' }} className="relative py-20 text-center px-4">
        <div className="absolute inset-0 z-0">
           {/* 
              IMPORTANT : 
              unoptimized={true} -> Désactive la compression Next.js pour garder la qualité originale.
              quality={100} -> Qualité maximale.
           */}
           <Image 
             src="${hero.imageUrl}" 
             alt="Hero background" 
             fill 
             priority
             unoptimized={true} 
             quality={100}      
             sizes="100vw"
             className="object-cover"
           />
           <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}></div>
        </div>
        <div className="relative z-10">
          <h1 style={{ color: '${theme.textColor || '#fff'}', fontSize: '${theme.fontSize || 48}px' }} className="font-bold mb-4 drop-shadow-lg">${hero.headline || 'Titre'}</h1>
          <p style={{ color: '${theme.secondaryTextColor || '#eee'}', fontSize: '${theme.secondaryFontSize || 18}px' }} className="mb-8 max-w-2xl mx-auto">${hero.subheadline || 'Desc'}</p>
          <a href="#contact" style={{ backgroundColor: '${theme.primaryColor}' }} className="inline-block px-8 py-3 text-white rounded-full font-bold text-lg shadow-lg hover:opacity-90">${hero.ctaText || 'Commencer'}</a>
        </div>
      </section>
      {/* FEATURES */}
      <section id="services" className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '${theme.featureTitleColor || '#111'}' }}>${features.title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          ${(features.items || []).map((item: any, idx: number) => `
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border text-center overflow-hidden">
              {item.imageUrl ? <Image src={item.imageUrl} alt="${item.title}" width={400} height={200} className="w-full h-48 object-cover rounded mb-4" loading="lazy" /> : null}
              <h3 className="font-bold text-xl mb-2" style={{ color: '${theme.featureTitleColor || '#111'}' }}>${item.title}</h3>
              <p style={{ color: '${theme.featureDescColor || '#555'}' }>${item.description}</p>
            </div>
          `).join('')}
        </div>
      </section>
      {/* CONTACT */}
      <section id="contact" className="py-16 px-4 max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Contactez-nous</h2>
        {submitted ? <div className="text-center text-green-600 font-bold p-8 bg-green-50 rounded-lg">Message envoyé !</div> : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-lg shadow-sm border">
            <div><label className="block text-sm font-medium mb-1">Nom</label><input name="name" required className="w-full p-3 border rounded-lg outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1">Email</label><input name="email" type="email" required className="w-full p-3 border rounded-lg outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1">Message</label><textarea name="message" rows={4} required className="w-full p-3 border rounded-lg outline-none"></textarea></div>
            <button type="submit" style={{ backgroundColor: '${theme.featureTitleColor || '#111}' }} className="w-full text-white font-bold py-3 rounded-lg hover:opacity-90">Envoyer</button>
          </form>
        )}
      </section>
      <footer className="py-8 text-center text-gray-500 text-sm border-t">© {new Date().getFullYear()} ${config.meta.siteName}.</footer>
    </main>
  );
}
`;
}

export function generateNextConfig() {
  return `/** @type {import('next').NextConfig} */
const nextConfig = { images: { unoptimized: true, remotePatterns: [{ protocol: 'https', hostname: '**.unsplash.com' }, { protocol: 'https', hostname: 'images.unsplash.com' }] } };
module.exports = nextConfig;`;
}

export function generateTailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
module.exports = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: {} }, plugins: [] };`;
}