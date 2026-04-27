// src/lib/exporter.ts
import { SiteConfig } from "./site-config";

// --- UTILS ---
function adjustColor(hex: string, amount: number) {
  if (!hex || typeof hex !== 'string') return '#000000';
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return '#000000';
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function generateLogoHtml(config: SiteConfig) {
  const letter = config.meta?.theme?.logoLetter || config.meta?.siteName?.substring(0, 20) || "F";
  const color = config.meta?.theme?.logoColor || config.meta?.theme?.brandColor || config.meta?.theme?.primaryColor || "#F97316";
  const font = config.meta?.theme?.brandFont || "Inter";
  const style = config.meta?.theme?.logoStyle || "minimal";
  const logoUrl = config.meta?.theme?.logoUrl;

  if (logoUrl) return `<img src="${logoUrl}" alt="Logo" style="height: 50px; width: auto; object-fit: contain;" />`;

  const getFontSize = (base: number) => {
    if (letter.length > 10) return `${base * 0.6}`;
    if (letter.length > 5) return `${base * 0.8}`;
    return `${base}`;
  };

  let styleCss = `font-family: ${font}; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; line-height: 1; transition: all 0.3s ease;`;
  switch(style) {
    case 'circle': styleCss += `width: 48px; height: 48px; border-radius: 9999px; background-color: ${color}; color: white; font-size: ${getFontSize(20)}px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);`; break;
    case 'square': styleCss += `width: 48px; height: 48px; border-radius: 12px; background-color: ${color}; color: white; font-size: ${getFontSize(20)}px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);`; break;
    case 'gradient': styleCss += `width: 48px; height: 48px; border-radius: 12px; background-image: linear-gradient(135deg, ${color}, ${adjustColor(color, -40)}); color: white; font-size: ${getFontSize(20)}px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);`; break;
    case 'drawn': styleCss += `font-size: 36px; font-family: Georgia, serif; font-style: italic; color: ${color};`; break;
    case 'neon': styleCss += `font-size: 32px; font-family: monospace; color: #fff; text-shadow: 0 0 5px #fff, 0 0 10px ${color};`; break;
    case 'stamp': styleCss += `font-size: 18px; padding: 8px 16px; border: 2px solid ${color}; color: ${color}; text-transform: uppercase; letter-spacing: 0.1em; transform: rotate(-3deg);`; break;
    case 'embossed': styleCss += `font-size: 32px; color: transparent; background-color: transparent; text-shadow: 1px 1px 1px ${adjustColor(color, 100)}, -1px -1px 1px ${adjustColor(color, -100)};`; break;
    default: styleCss += `font-size: 18px; padding: 6px 12px; border: 2px solid ${color}; border-radius: 6px; color: ${color};`;
  }
  return `<div style="${styleCss}">${letter}</div>`;
}

// --- GENERATEURS PWA ---
export function generateManifest(config: SiteConfig) {
  const bgColor = config.meta?.theme?.logoColor || config.meta?.theme?.brandColor || "#F97316";
  return JSON.stringify({ name: config.meta?.siteName || "Site", short_name: (config.meta?.siteName || "Site").substring(0, 12), start_url: "/", display: "standalone", background_color: "#ffffff", theme_color: bgColor, icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml" }] }, null, 2);
}
export function generateServiceWorker() { return `const CACHE_NAME = 'forge-v1'; const urlsToCache = ['/', '/index.html', '/about.html', '/testimonials.html', '/blog.html', '/contact.html', '/icon.svg']; self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))); }); self.addEventListener('fetch', event => { event.respondWith(caches.match(event.request).then(response => response || fetch(event.request))); });`; }
export function generateIconSvg(config: SiteConfig) { const letter = config.meta?.theme?.logoLetter || config.meta?.siteName?.charAt(0) || "F"; const bgColor = config.meta?.theme?.logoColor || config.meta?.theme?.brandColor || "#F97316"; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="${bgColor}" rx="100"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-size="280" font-weight="800" fill="white">${letter}</text></svg>`; }
export function generateReadme(config: SiteConfig) { return `# ${config.meta?.siteName || "Site"}`; }

// --- HELPERS LAYOUT ---
function getStyles() {
  return `<style>html{scroll-behavior:smooth}body{font-family:'Inter',sans-serif;margin:0;color:#1a202c;-webkit-font-smoothing:antialiased;line-height:1.6;background-color:#fff}*,::before,::after{box-sizing:border-box}a{text-decoration:none;color:inherit}img{max-width:100%;height:auto;display:block}h1,h2,h3{line-height:1.2;font-weight:800;letter-spacing:-0.02em}.container{max-width:1200px;margin:0 auto;padding:0 1.5rem}.section{padding:6rem 0}.btn-primary{display:inline-flex;align-items:center;justify-content:center;padding:1rem 2.5rem;border-radius:9999px;color:white;font-weight:700;font-size:1.1rem;transition:all .3s ease;box-shadow:0 4px 14px 0 rgba(0,0,0,.25)}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 20px 0 rgba(0,0,0,.3)}.card{background:white;border-radius:1rem;overflow:hidden;transition:all .3s ease;border:1px solid rgba(0,0,0,.05);box-shadow:0 4px 6px -1px rgba(0,0,0,.05)}.card:hover{transform:translateY(-5px);box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.nav-toggle{display:none}.hamburger{display:none;flex-direction:column;justify-content:space-around;width:2.5rem;height:2.5rem;cursor:pointer;z-index:100}.hamburger span{width:2.5rem;height:.2rem;background:#333;border-radius:10px;transition:all .3s linear;position:relative;transform-origin:1px}@media(max-width:768px){.hamburger{display:flex}.nav-links{position:absolute;top:0;right:0;height:100vh;width:300px;background:white;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:100px;gap:2rem;box-shadow:-5px 0 10px rgba(0,0,0,.1);transform:translateX(100%);transition:transform .3s ease-in-out;z-index:90;display:flex}.nav-toggle:checked~.nav-links{transform:translateX(0)}.nav-toggle:checked~.hamburger span:first-child{transform:rotate(45deg)}.nav-toggle:checked~.hamburger span:nth-child(2){opacity:0}.nav-toggle:checked~.hamburger span:last-child{transform:rotate(-45deg)}.nav-links a{font-size:1.2rem;color:#111!important}.section{padding:4rem 0}}</style>`;
}

// NOUVEAU : Fonction intelligente pour nettoyer et valider les liens
function getSafeLink(rawLink: string, cleanPhone: string): string {
  // Si c'est un lien WhatsApp
  if (rawLink.startsWith('https://wa.me/')) {
    // Si le numéro est vide ou le lien est malformé (ex: wa.me/?text)
    if (!cleanPhone || rawLink.includes('wa.me/?')) {
      return 'contact.html'; // Fallback sécurité vers la page contact
    }
  }
  // Si c'est un lien mailto sans email, on fallback
  if (rawLink.startsWith('mailto:') && rawLink === 'mailto:') {
     return 'contact.html';
  }
  
  return rawLink;
}

function getNavbarHtml(config: SiteConfig, activePage: string = 'home') {
  const meta = config.meta;
  const brandColor = meta?.theme?.brandColor || meta?.theme?.primaryColor || "#F97316";
  const logoHtml = `<a href="index.html" style="text-decoration: none; display: flex; align-items: center;">${generateLogoHtml(config)}</a>`;
  const linkStyle = 'font-size: 0.95rem; color: #4a5568; text-decoration: none; transition: color 0.2s; font-weight: 500;';
  const activeStyle = 'font-weight: 700; color: #111827;';
  const servicesLink = activePage === 'home' ? '#services' : 'index.html#services';

  // Sécurisation du lien Contact
  const rawHeroLink = config.sections.find(s => s.type === 'hero')?.data?.ctaLink || '#';
  const cleanPhone = (meta.phone || "").replace(/\D/g, '');
  const safeLink = getSafeLink(rawHeroLink, cleanPhone);
  
  const isExternalAction = safeLink.startsWith('tel:') || safeLink.startsWith('mailto:') || safeLink.startsWith('https://');
  const navContactHref = isExternalAction ? safeLink : 'contact.html';
  const navContactTarget = isExternalAction ? '_blank' : '_self';

  return `<nav style="position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(255,255,255,0.98); backdrop-filter: blur(10px); box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);"><div class="container" style="display: flex; justify-content: space-between; align-items: center; height: 80px; position: relative;">${logoHtml}<label for="nav-toggle" class="hamburger"><span></span><span></span><span></span></label><input type="checkbox" id="nav-toggle" class="nav-toggle"><div class="nav-links" style="display: flex; align-items: center; gap: 2rem;"><a href="index.html" style="${linkStyle} ${activePage === 'home' ? activeStyle : ''}">Accueil</a><a href="${servicesLink}" style="${linkStyle} ${activePage === 'services' ? activeStyle : ''}">Services</a><a href="about.html" style="${linkStyle} ${activePage === 'about' ? activeStyle : ''}">À Propos</a><a href="testimonials.html" style="${linkStyle} ${activePage === 'testimonials' ? activeStyle : ''}">Avis</a><a href="blog.html" style="${linkStyle} ${activePage === 'blog' ? activeStyle : ''}">Blog</a><a href="${navContactHref}" target="${navContactTarget}" class="btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem; background-color: ${brandColor};">Contact</a></div></div></nav><div style="height: 80px;"></div>`;
}

function getFooterHtml(meta: any) {
  const year = new Date().getFullYear();
  const p = meta.phone || "";
  const a = meta.address || "";
  const e = meta.contactEmail || "";
  const n = meta.siteName || "Site";
  let c = "";
  if(a) c += `<li style="margin-bottom:0.5rem;display:flex;align-items:start;gap:10px;"><span>📍</span><span>${a}</span></li>`;
  if(p) c += `<li style="margin-bottom:0.5rem;"><span>📞</span> <a href="tel:${p}" style="color:#9ca3af">${p}</a></li>`;
  if(e) c += `<li style="margin-bottom:0.5rem;"><span>✉️</span> <a href="mailto:${e}" style="color:#9ca3af">${e}</a></li>`;
  return `<footer style="background:#111827;color:#9ca3af;padding:4rem 0 2rem;border-top:1px solid #374151"><div class="container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:3rem"><div><h4 style="font-size:1.25rem;font-weight:bold;color:white;margin-bottom:1rem">${n}</h4><p style="font-size:0.9rem;line-height:1.6">Votre partenaire de confiance.</p></div><div><h4 style="font-size:1rem;font-weight:600;color:white;margin-bottom:1rem">Navigation</h4><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><a href="index.html" style="color:#9ca3af;font-size:0.9rem">Accueil</a></li><li><a href="about.html" style="color:#9ca3af;font-size:0.9rem">À Propos</a></li><li><a href="contact.html" style="color:#9ca3af;font-size:0.9rem">Contact</a></li></ul></div><div><h4 style="font-size:1rem;font-weight:600;color:white;margin-bottom:1rem">Contact</h4><ul style="list-style:none;padding:0;margin:0;font-size:0.9rem">${c}</ul></div></div><div style="border-top:1px solid #374151;padding-top:2rem;text-align:center;margin-top:2rem"><p style="font-size:0.875rem">© ${year} ${n}. Tous droits réservés.</p></div></footer>`;
}

function getSeoHead(meta: any, titleSuffix: string = "", imageUrl: string = "") {
  const title = `${meta.siteName}${titleSuffix ? ' | ' + titleSuffix : ''}`;
  return `<meta name="description" content="${meta.description || 'Site généré par ForgeBuilder'}" /><meta property="og:title" content="${title}" /><meta property="og:image" content="${imageUrl || meta.theme?.logoUrl || 'icon.svg'}" /><link rel="icon" href="icon.svg" type="image/svg+xml">`;
}

// --- PAGE GENERATORS ---
function generateHomePage(config: SiteConfig): string {
  const { meta, sections } = config;
  const theme = meta.theme;
  const brandColor = theme?.brandColor || theme?.primaryColor || "#F97316";
  const fTitleColor = theme?.featureTitleColor || "#111827";
  const fDescColor = theme?.featureDescColor || "#4b5563";
  
  const hero = sections.find(s => s.type === 'hero')?.data || {};
  const features = sections.find(s => s.type === 'features')?.data || { title: "Services", items: [] };
  const products = sections.find(s => s.type === 'products')?.data || null;

  const rawPhone = meta.phone || "";
  const cleanPhone = rawPhone.replace(/\D/g, '');

  const servicesHtml = (features.items || []).map((item: any, index: number) => `
    <a href="service-${index + 1}.html" style="text-decoration: none; color: inherit;">
      <div class="card" style="padding: 2rem; text-align: center; height: 100%;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, ${brandColor}22, ${brandColor}11); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.5rem; color: ${brandColor}; font-weight: bold;">${(item.title || 'S').charAt(0)}</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: ${fTitleColor};">${item.title}</h3>
        <p style="color: ${fDescColor}; font-size: 0.95rem;">${item.description}</p>
      </div>
    </a>
  `).join('');

  let productsHtml = '';
  if (products && products.items) {
    productsHtml = `
      <section id="products" class="section" style="background: #f9fafb;">
        <div class="container">
          <h2 style="text-align: center; font-size: 2.5rem; font-weight: 800; margin-bottom: 4rem; color: ${fTitleColor};">${products.title || "Nos Produits"}</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            ${products.items.map((item: any) => {
              let btnLink = "contact.html";
              let btnTarget = "_self";
              if (cleanPhone) {
                const message = encodeURIComponent(`Bonjour, je suis intéressé(e) par le produit : ${item.title}`);
                btnLink = `https://wa.me/${cleanPhone}?text=${message}`;
                btnTarget = "_blank";
              }
              return `
                <div class="card" style="padding: 0; overflow: hidden;">
                  <img src="${item.imageUrl}" style="width: 100%; height: 250px; object-fit: cover;" alt="${item.title}"/>
                  <div style="padding: 1.5rem;">
                    <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; color: ${fTitleColor};">${item.title}</h3>
                    <p style="color: ${fDescColor}; font-size: 0.9rem; margin-bottom: 1rem;">${item.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 1.25rem; font-weight: 800; color: ${brandColor};">${item.price}</span>
                      <a href="${btnLink}" target="${btnTarget}" style="padding: 0.5rem 1rem; background-color: ${brandColor}; color: white; border: none; border-radius: 6px; font-weight: 600; text-decoration: none; display: inline-block; cursor: pointer;">Acheter</a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // Sécurisation du bouton Hero
  const rawHeroLink = hero.ctaLink || '#';
  const safeHeroLink = getSafeLink(rawHeroLink, cleanPhone);
  const heroTarget = safeHeroLink.startsWith('http') || safeHeroLink.startsWith('tel') || safeHeroLink.startsWith('mailto') ? '_blank' : '_self';

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${meta.siteName}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">${getSeoHead(meta, "", hero.imageUrl)}${getStyles()}</head><body>${getNavbarHtml(config, 'home')}<section style="position: relative; min-height: 85vh; display: flex; align-items: center; justify-content: center; background-color: #000; overflow: hidden;"><img src="${hero.imageUrl}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.5; transform: scale(1.05);" /><div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);"></div><div class="container" style="position: relative; z-index: 10; text-align: center; padding: 2rem;"><h1 style="font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 800; margin-bottom: 1.5rem; color: ${theme.textColor || '#fff'}; letter-spacing: -0.03em;">${hero.headline}</h1><p style="font-size: clamp(1rem, 2vw, 1.35rem); margin-bottom: 2.5rem; color: ${theme.secondaryTextColor || '#e5e7eb'}; max-width: 800px; margin-left: auto; margin-right: auto;">${hero.subheadline}</p><a href="${safeHeroLink}" target="${heroTarget}" class="btn-primary" style="background-color: ${brandColor};">${hero.ctaText}</a></div></section><section id="services" class="section" style="background: #f9fafb;"><div class="container"><h2 style="text-align: center; font-size: 2.5rem; font-weight: 800; margin-bottom: 4rem; color: ${fTitleColor};">${features.title}</h2><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">${servicesHtml}</div></div></section>${productsHtml}<section class="section" style="background: white; text-align: center;"><div class="container"><h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 2rem; color: ${fTitleColor};">Ils nous font confiance</h2><a href="testimonials.html" class="btn-primary" style="background-color: ${fTitleColor}; font-size: 0.95rem; padding: 0.8rem 2rem;">Lire les témoignages</a></div></section>${getFooterHtml(meta)}</body></html>`;
}

function generateServicePage(config: SiteConfig, item: any, index: number): string {
  const { meta } = config;
  const theme = meta.theme;
  const brandColor = theme?.brandColor || theme?.primaryColor;
  const fTitleColor = theme?.featureTitleColor || "#111827";
  const fDescColor = theme?.featureDescColor || "#4b5563";
  
  const rawHeroLink = config.sections.find(s => s.type === 'hero')?.data?.ctaLink || '#';
  const cleanPhone = (meta.phone || "").replace(/\D/g, '');
  // Sécurisation du bouton "Demander un devis"
  const safeLink = getSafeLink(rawHeroLink, cleanPhone);
  const target = safeLink.startsWith('http') || safeLink.startsWith('mailto') || safeLink.startsWith('tel') ? '_blank' : '_self';

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${item.title} - ${meta.siteName}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">${getSeoHead(meta, item.title)}${getStyles()}</head><body>${getNavbarHtml(config, 'services')}<div class="container" style="padding: 6rem 1.5rem; max-width: 800px; margin: 0 auto;"><a href="index.html#services" style="color: ${brandColor}; font-weight: 600; display: inline-block; margin-bottom: 2rem;">← Retour aux services</a><article><div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${brandColor}22, ${brandColor}11); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; font-size: 2.5rem; color: ${brandColor}; font-weight: bold;">${(item.title || 'S').charAt(0)}</div><h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 1rem; color: ${fTitleColor}; line-height: 1.1;">${item.title}</h1><div style="font-size: 1.2rem; color: ${fDescColor}; line-height: 1.8; margin-bottom: 3rem;">${item.description}</div><a href="${safeLink}" target="${target}" class="btn-primary" style="background-color: ${brandColor};">Demander un devis</a></article></div>${getFooterHtml(meta)}</body></html>`;
}

function generateAboutPage(config: SiteConfig): string {
  const { meta } = config; const about = config.sections.find(s => s.type === 'about')?.data || {}; const theme = meta.theme; const brandColor = theme?.brandColor || theme?.primaryColor;
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>À Propos - ${meta.siteName}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">${getSeoHead(meta, "À Propos", about.imageUrl)}${getStyles()}</head><body style="background-color: ${theme.globalBgColor || '#fff'};">${getNavbarHtml(config, 'about')}<div class="container" style="padding: 6rem 1.5rem;"><div style="display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center;"><div><h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; color: ${theme.featureTitleColor || '#111'}; line-height: 1.1;">${about.title || "Notre Histoire"}</h1><div style="font-size: 1.1rem; line-height: 1.8; color: ${theme.featureDescColor || '#4b5563'}; white-space: pre-line;">${about.content || "Contenu..."}</div></div>${about.imageUrl ? `<div style="position: relative;"><div style="position: absolute; inset: 0; background: ${brandColor}; transform: rotate(3deg); border-radius: 1rem; opacity: 0.1;"></div><img src="${about.imageUrl}" style="width: 100%; height: auto; object-fit: cover; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); position: relative;"/></div>` : ''}</div><div style="margin-top: 4rem; text-align: center;"><a href="index.html" style="color: ${brandColor}; font-weight: 600;">← Retour</a></div></div>${getFooterHtml(meta)}</body></html>`;
}

function generateTestimonialsPage(config: SiteConfig): string {
  const { meta } = config; const testimonials = config.sections.find(s => s.type === 'testimonials')?.data || { title: "Avis", items: [] }; const theme = meta.theme; const brandColor = theme?.brandColor || theme?.primaryColor;
  const avisHtml = (testimonials.items || []).map((item: any) => `<div class="card" style="padding: 2rem; border-left: 4px solid ${brandColor};"><div style="font-size: 2.5rem; color: ${brandColor}; margin-bottom: 1rem; opacity: 0.2;">❝</div><p style="color: ${theme.featureDescColor || '#4b5563'}; font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem; font-style: italic;">"${item.quote}"</p><div style="display: flex; align-items: center; gap: 1rem;"><div style="width: 48px; height: 48px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #6b7280; background-image: url('${item.avatar}'); background-size: cover;">${!item.avatar ? (item.author || '?').charAt(0) : ''}</div><div><p style="font-weight: 700; color: ${theme.featureTitleColor || '#111'};">${item.author}</p><p style="font-size: 0.85rem; color: #9ca3af;">${item.role}</p></div></div></div>`).join('');
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Avis - ${meta.siteName}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">${getSeoHead(meta, "Avis")}${getStyles()}</head><body style="background-color: ${theme.globalBgColor || '#fff'};">${getNavbarHtml(config, 'testimonials')}<div class="container" style="padding: 6rem 1.5rem;"><h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 4rem; text-align: center; color: ${theme.featureTitleColor || '#111'};">${testimonials.title}</h1><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto;">${avisHtml}</div><div style="text-align: center; margin-top: 4rem;"><a href="index.html" style="color: ${brandColor}; font-weight: 600;">← Retour</a></div></div>${getFooterHtml(meta)}</body></html>`;
}

function generateBlogPage(config: SiteConfig): string {
  const { meta } = config; const blog = config.sections.find(s => s.type === 'blog')?.data || { title: "Blog", items: [] }; const theme = meta.theme; const brandColor = theme?.brandColor || theme?.primaryColor;
  const postsHtml = (blog.items || []).map((item: any, index: number) => `
    <a href="blog-${index + 1}.html" style="text-decoration: none; color: inherit;">
      <article class="card" style="cursor: pointer; height: 100%;">
        <div style="position: relative; overflow: hidden; height: 240px;">
          <img src="${item.imageUrl}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/>
        </div>
        <div style="padding: 1.5rem;">
          <span style="font-size: 0.75rem; color: ${brandColor}; text-transform: uppercase; font-weight: 700;">${item.date || ""}</span>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0; color: ${theme.featureTitleColor || '#111'};">${item.title}</h3>
          <p style="color: ${theme.featureDescColor || '#4b5563'}; font-size: 0.95rem;">${item.excerpt}</p>
        </div>
      </article>
    </a>
  `).join('');

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Blog - ${meta.siteName}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">${getSeoHead(meta, "Blog")}${getStyles()}</head><body>${getNavbarHtml(config, 'blog')}<div class="container" style="padding: 6rem 1.5rem;"><h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 4rem; text-align: center; color: ${theme.featureTitleColor || '#111'};">${blog.title}</h1><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">${postsHtml}</div><div style="text-align: center; margin-top: 4rem;"><a href="index.html" style="color: ${brandColor}; font-weight: 600;">← Retour</a></div></div>${getFooterHtml(meta)}</body></html>`;
}

function generateBlogPostPage(config: SiteConfig, post: any, index: number): string {
  const { meta } = config;
  const theme = meta.theme;
  const brandColor = theme?.brandColor || theme?.primaryColor;
  const fTitleColor = theme?.featureTitleColor || "#111827";
  const fDescColor = theme?.featureDescColor || "#4b5563";

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${post.title} - ${meta.siteName}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">${getSeoHead(meta, post.title, post.imageUrl)}${getStyles()}</head><body>${getNavbarHtml(config, 'blog')}<div class="container" style="padding: 6rem 1.5rem; max-width: 800px; margin: 0 auto;"><a href="blog.html" style="color: ${brandColor}; font-weight: 600; display: inline-block; margin-bottom: 2rem;">← Retour au blog</a><article><h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 1rem; color: ${fTitleColor}; line-height: 1.1;">${post.title}</h1><p style="font-size: 0.9rem; color: ${brandColor}; margin-bottom: 2rem; text-transform: uppercase;">${post.date || ""}</p><img src="${post.imageUrl}" style="width: 100%; height: auto; border-radius: 1rem; margin-bottom: 2rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);"/><div style="font-size: 1.1rem; color: ${fDescColor}; line-height: 1.8;">${post.excerpt}</div></article></div>${getFooterHtml(meta)}</body></html>`;
}

function generateContactPage(config: SiteConfig): string {
  const { meta } = config; const theme = meta.theme; const brandColor = theme?.brandColor || theme?.primaryColor; const email = meta.contactEmail || "email@example.com";
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Contact - ${meta.siteName}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">${getSeoHead(meta, "Contact")}${getStyles()}</head><body style="background-color: ${theme.globalBgColor || '#fff'};">${getNavbarHtml(config, 'contact')}<div class="container" style="padding: 6rem 1.5rem; max-width: 700px;"><h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 3rem; text-align: center; color: ${theme.featureTitleColor || '#111'};">Contactez-nous</h1><div class="card" style="padding: 2.5rem;"><form action="https://formsubmit.co/${email}" method="POST"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table"><div style="margin-bottom: 1.5rem;"><label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">Nom</label><input type="text" name="name" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-size: 1rem;"></div><div style="margin-bottom: 1.5rem;"><label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">Email</label><input type="email" name="email" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-size: 1rem;"></div><div style="margin-bottom: 2rem;"><label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">Message</label><textarea name="message" rows="5" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-size: 1rem; resize: vertical;"></textarea></div><button type="submit" class="btn-primary" style="width: 100%; background-color: ${theme.featureTitleColor || '#111'};">Envoyer</button></form></div></div>${getFooterHtml(meta)}</body></html>`;
}

export function generateSiteFiles(config: SiteConfig): Record<string, string> {
  const files: Record<string, string> = {
    'index.html': generateHomePage(config),
    'about.html': generateAboutPage(config),
    'testimonials.html': generateTestimonialsPage(config),
    'blog.html': generateBlogPage(config),
    'contact.html': generateContactPage(config),
    'manifest.json': generateManifest(config),
    'sw.js': generateServiceWorker(),
    'icon.svg': generateIconSvg(config),
    'README.md': generateReadme(config)
  };

  const blogSection = config.sections.find(s => s.type === 'blog');
  if (blogSection && blogSection.data.items) {
    blogSection.data.items.forEach((item: any, index: number) => {
      files[`blog-${index + 1}.html`] = generateBlogPostPage(config, item, index);
    });
  }

  const featuresSection = config.sections.find(s => s.type === 'features');
  if (featuresSection && featuresSection.data.items) {
    featuresSection.data.items.forEach((item: any, index: number) => {
      files[`service-${index + 1}.html`] = generateServicePage(config, item, index);
    });
  }

  return files;
}

export function generateHtmlFile(config: SiteConfig): string { return generateHomePage(config); }