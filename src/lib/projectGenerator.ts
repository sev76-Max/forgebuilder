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
  const meta = config.meta;
  const hero = config.sections.find(s => s.type === 'hero')?.data || {};
  const features = config.sections.find(s => s.type === 'features')?.data || { title: "Services", items: [] };
  
  // Récupération des données de contact
  const phone = meta.phone || "";
  const phoneType = meta.phoneType || "tel";
  const email = meta.contactEmail || "";
  const address = meta.address || "";
  
  // Logique pour le lien téléphone/whatsapp
  const cleanPhone = phone.replace(/\s+/g, '');
  const phoneHref = phoneType === 'whatsapp' 
    ? `https://wa.me/${cleanPhone}?text=Bonjour` 
    : `tel:${cleanPhone}`;
  const phoneLabel = phoneType === 'whatsapp' ? "Discuter sur WhatsApp" : phone;

  // Logique pour le lien principal (Hero)
  const ctaLink = hero.ctaLink || "#";
  let finalCtaLink = ctaLink;
  let ctaTarget = "_self";
  if (ctaLink.startsWith('tel:') || ctaLink.startsWith('mailto:') || ctaLink.startsWith('https://wa.me')) {
    finalCtaLink = ctaLink;
    ctaTarget = "_blank";
  } else if (ctaLink === '#') {
    finalCtaLink = '#contact';
  }

  return `
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '${config.meta.theme.supabaseUrl || ''}';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '${config.meta.theme.supabaseKey || ''}';
const supabase = createClient(supabaseUrl, supabaseKey);

// Icônes SVG pour les réseaux sociaux
const icons = {
  facebook: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  instagram: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  twitter: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  linkedin: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
};

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
      {/* HERO */}
      <section style={{ backgroundColor: '${theme.primaryColor}20' }} className="relative py-20 text-center px-4">
        <div className="absolute inset-0 z-0">
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
          <a href="${finalCtaLink}" target="${ctaTarget}" style={{ backgroundColor: '${theme.primaryColor}' }} className="inline-block px-8 py-3 text-white rounded-full font-bold text-lg shadow-lg hover:opacity-90">${hero.ctaText || 'Commencer'}</a>
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

      {/* FOOTER AMÉLIORÉ */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Colonne 1: Nom */}
          <div>
            <h4 className="text-lg font-bold mb-2" style={{ color: '${theme.primaryColor}' }}>${meta.siteName}</h4>
            <p className="text-gray-400 text-sm">${meta.description || ''}</p>
          </div>

          {/* Colonne 2: Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              ${address ? `<li className="flex items-center gap-2 justify-center md:justify-start"><span>📍</span> ${address}</li>` : ''}
              ${phone ? `
                <li className="flex items-center gap-2 justify-center md:justify-start">
                  <a href="${phoneHref}" target="${phoneType === 'whatsapp' ? '_blank' : '_self'}" className="hover:text-white flex items-center gap-2">
                    ${phoneType === 'whatsapp' ? '<span>💬</span>' : '<span>📞</span>'}
                    ${phoneLabel}
                  </a>
                </li>
              ` : ''}
              ${email ? `<li className="flex items-center gap-2 justify-center md:justify-start"><a href="mailto:${email}" className="hover:text-white flex items-center gap-2"><span>✉️</span> ${email}</a></li>` : ''}
            </ul>
          </div>

          {/* Colonne 3: Réseaux Sociaux */}
          ${(meta.socialFacebook || meta.socialInstagram || meta.socialTwitter || meta.socialLinkedin) ? `
          <div>
             <h4 className="text-lg font-bold mb-4 text-white">Suivez-nous</h4>
             <div className="flex gap-4 justify-center md:justify-start">
                ${meta.socialFacebook ? `<a href="${meta.socialFacebook}" target="_blank" className="text-gray-400 hover:text-white transition-colors">{icons.facebook}</a>` : ''}
                ${meta.socialInstagram ? `<a href="${meta.socialInstagram}" target="_blank" className="text-gray-400 hover:text-white transition-colors">{icons.instagram}</a>` : ''}
                ${meta.socialTwitter ? `<a href="${meta.socialTwitter}" target="_blank" className="text-gray-400 hover:text-white transition-colors">{icons.twitter}</a>` : ''}
                ${meta.socialLinkedin ? `<a href="${meta.socialLinkedin}" target="_blank" className="text-gray-400 hover:text-white transition-colors">{icons.linkedin}</a>` : ''}
             </div>
          </div>
          ` : ''}

        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ${meta.siteName}. Tous droits réservés.
        </div>
      </footer>

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