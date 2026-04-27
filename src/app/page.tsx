"use client";

import { useState } from "react";
import JSZip from 'jszip';
import DynamicRenderer from "@/components/renderer/DynamicRenderer";
import { SiteConfig } from "@/lib/site-config";
import { generateSiteFiles } from "@/lib/exporter";
import { generatePackageJson, generatePageTsx, generateLayoutTsx, generateNextConfig, generateTailwindConfig, generatePublicManifest, generatePublicIcon, generateProjectReadme } from "@/lib/projectGenerator";
import { getDemoImages } from "@/lib/unsplash";
import { TEMPLATES } from "@/lib/templates";

const DEFAULT_CONFIG: SiteConfig = {
  meta: {
    siteName: "ForgeBuilder",
    description: "Attente",
    phone: "", address: "",
    theme: { primaryColor: "#F97316", fontFamily: "Inter" }
  },
  sections: [{ type: 'hero', data: { headline: "Bienvenue", subheadline: "Décrivez votre projet.", ctaText: "Commencer", ctaLink: "#", imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80" } }]
};

export default function Home() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [imageSearch, setImageSearch] = useState("");
  const [foundImages, setFoundImages] = useState<string[]>([]);
  const [refiningField, setRefiningField] = useState<string | null>(null);
  const [deploying, setDeploying] = useState<string | null>(null);
  const [deployUrl, setDeployUrl] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const themes = [
    { name: "Nuit", icon: "🌙", theme: { primaryColor: "#6366f1", textColor: "#ffffff", secondaryTextColor: "#e5e7eb", featureTitleColor: "#ffffff", featureDescColor: "#d1d5db", brandColor: "#818cf8", logoColor: "#818cf8", logoStyle: "neon" } },
    { name: "Nature", icon: "🌲", theme: { primaryColor: "#15803d", textColor: "#1f2937", secondaryTextColor: "#4b5563", featureTitleColor: "#166534", featureDescColor: "#374151", brandColor: "#15803d", logoColor: "#15803d", logoStyle: "stamp" } },
    { name: "Océan", icon: "🌊", theme: { primaryColor: "#0ea5e9", textColor: "#0c4a6e", secondaryTextColor: "#0369a1", featureTitleColor: "#0284c7", featureDescColor: "#334155", brandColor: "#0ea5e9", logoColor: "#0ea5e9", logoStyle: "circle" } },
    { name: "Manga", icon: "🎨", theme: { primaryColor: "#ec4899", textColor: "#831843", secondaryTextColor: "#be185d", featureTitleColor: "#be185d", featureDescColor: "#831843", brandColor: "#ec4899", logoColor: "#ec4899", logoStyle: "drawn" } },
    { name: "Luxe", icon: "👑", theme: { primaryColor: "#b91c1c", textColor: "#1c1917", secondaryTextColor: "#44403c", featureTitleColor: "#881337", featureDescColor: "#57534e", brandColor: "#ca8a04", logoColor: "#ca8a04", logoStyle: "embossed" } }
  ];

  const applyTheme = (preset: any) => setConfig(prev => ({ ...prev, meta: { ...prev.meta, theme: { ...prev.meta.theme, ...preset.theme }, layoutStyle: preset.theme.layoutStyle } }));
  const updateSiteName = (value: string) => setConfig(prev => ({ ...prev, meta: { ...prev.meta, siteName: value } }));
  const updateTheme = (key: string, value: string) => {
    let cleanValue = value;
    if (key.includes('Color') && value && !value.startsWith('#') && value.length > 0) cleanValue = '#' + value;
    setConfig(prev => ({ ...prev, meta: { ...prev.meta, theme: { ...prev.meta.theme, [key]: cleanValue } } }));
  };
  const updateContactEmail = (value: string) => setConfig(prev => ({ ...prev, meta: { ...prev.meta, contactEmail: value } }));
  const updatePhone = (value: string) => setConfig(prev => ({ ...prev, meta: { ...prev.meta, phone: value } }));
  const updateAddress = (value: string) => setConfig(prev => ({ ...prev, meta: { ...prev.meta, address: value } }));
  const updateHeroLink = (value: string) => setConfig(prev => ({ ...prev, sections: prev.sections.map(s => s.type === 'hero' ? { ...s, data: { ...s.data, ctaLink: value } } : s) }));
  const updateListItem = (type: string, idx: number, key: string, value: any) => setConfig(prev => ({ ...prev, sections: prev.sections.map(s => { if (s.type === type && s.data.items) { const newItems = s.data.items.map((it: any, i: number) => i === idx ? { ...it, [key]: value } : it); return { ...s, data: { ...s.data, items: newItems } }; } return s; }) }));
  
  const addProduct = () => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.type === 'products') {
          const newItems = [...(s.data.items || []), { title: "Nouveau Produit", price: "10 000 FCFA", description: "Description du produit", imageUrl: "" }];
          return { ...s, data: { ...s.data, items: newItems } };
        }
        return s;
      })
    }));
  };

  const removeProduct = (idx: number) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.type === 'products' && s.data.items) {
          const newItems = s.data.items.filter((_: any, i: number) => i !== idx);
          return { ...s, data: { ...s.data, items: newItems } };
        }
        return s;
      })
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, sectionType: string, itemIndex?: number) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (sectionType === 'logo') setConfig(prev => ({ ...prev, meta: { ...prev.meta, theme: { ...prev.meta.theme, logoUrl: base64 } } }));
      else setConfig(prev => ({ ...prev, sections: prev.sections.map(s => { if (s.type === sectionType) { if (itemIndex !== undefined && s.data.items) { const key = sectionType === 'testimonials' ? 'avatar' : 'imageUrl'; const newItems = s.data.items.map((it: any, i: number) => i === itemIndex ? { ...it, [key]: base64 } : it); return { ...s, data: { ...s.data, items: newItems } }; } return { ...s, data: { ...s.data, imageUrl: base64 } }; } if (sectionType === 'hero' && s.type === 'hero') return { ...s, data: { ...s.data, imageUrl: base64 } }; return s; }) }));
    };
    reader.readAsDataURL(file);
  };
  const getActionType = (link: string | undefined) => { if (!link || link === "#") return "anchor"; if (link.startsWith("https://wa.me")) return "whatsapp"; if (link.startsWith("mailto:")) return "mailto"; if (link.startsWith("tel:")) return "tel"; return "url"; };
  const handleActionTypeChange = (type: string) => { let newLink = "#"; switch (type) { case 'whatsapp': newLink = "https://wa.me/33?text=Bonjour"; break; case 'mailto': newLink = "mailto:contact@email.com"; break; case 'tel': newLink = "tel:+33"; break; case 'url': newLink = "https://"; break; } updateHeroLink(newLink); };
  const handleActionValueChange = (value: string) => { const type = getActionType(config.sections.find(s => s.type === 'hero')?.data?.ctaLink); let newLink = value; if (type === 'tel') newLink = `tel:${value}`; else if (type === 'mailto') newLink = `mailto:${value}`; else if (type === 'whatsapp') newLink = `https://wa.me/${value}?text=Bonjour`; updateHeroLink(newLink); };
  const getActionValue = () => { const link = config.sections.find(s => s.type === 'hero')?.data?.ctaLink || ""; const type = getActionType(link); if (type === 'tel') return link.replace("tel:", ""); if (type === 'mailto') return link.replace("mailto:", ""); if (type === 'whatsapp') return link.replace("https://wa.me/", "").split("?")[0]; return link; };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => { e.preventDefault(); if (!prompt) return; setIsLoading(true); try { const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) }); const data = await res.json(); if (res.ok && data.config) setConfig(data.config); } catch (err) { console.error(err); alert("Erreur"); } finally { setIsLoading(false); } };
  const handleImageSearch = (query: string) => { setImageSearch(query); if (query.length > 2) { setFoundImages(getDemoImages(query)); } else { setFoundImages([]); } };
  const selectImage = (url: string) => { setConfig(prev => ({ ...prev, sections: prev.sections.map(s => s.type === 'hero' ? { ...s, data: { ...s.data, imageUrl: url } } : s) })); setFoundImages([]); setImageSearch(""); };
  const refineText = async (fieldKey: string, currentValue: string, updater: (val: string) => void) => { if (!currentValue || currentValue.length < 3) return; setRefiningField(fieldKey); try { const res = await fetch('/api/refine', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: currentValue, instruction: "Rendre plus professionnel." }) }); const data = await res.json(); if (res.ok && data.result) { updater(data.result); } } catch (err) { console.error(err); } finally { setRefiningField(null); } };
  const scrollToSection = (id: string) => { const element = document.getElementById(id); if (element) { element.scrollIntoView({ behavior: 'smooth' }); } };
  const handleSaveProject = () => { const dataStr = JSON.stringify(config, null, 2); const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr); const exportFileDefaultName = `${(config.meta?.siteName || "projet").replace(/\s+/g, '-')}.json`; const linkElement = document.createElement('a'); linkElement.setAttribute('href', dataUri); linkElement.setAttribute('download', exportFileDefaultName); linkElement.click(); };
  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (evt) => { try { const result = evt.target?.result; if (typeof result === 'string') { const parsed = JSON.parse(result); if (parsed.meta && parsed.sections) setConfig(parsed); } } catch (err) { alert("Fichier invalide"); } }; reader.readAsText(file); } };
  const handleResetProject = () => { if (confirm("Réinitialiser ?")) { setConfig(DEFAULT_CONFIG); setPrompt(""); setImageSearch(""); setFoundImages([]); } };

  // EXPORTS AVEC SECURISATION DES NOMS
  const handleStaticExport = async () => { const zip = new JSZip(); const files = generateSiteFiles(config); for (const [filename, content] of Object.entries(files)) { zip.file(filename, content); } const content = await zip.generateAsync({ type: "blob" }); const url = window.URL.createObjectURL(content); const safeName = (config.meta?.siteName || "Site").replace(/\s+/g, '-'); const a = document.createElement('a'); a.href = url; a.download = `${safeName}.zip`; a.click(); };
  
  const handleDynamicExport = async () => { const zip = new JSZip(); const src = zip.folder("src"); const app = src?.folder("app"); const pub = zip.folder("public"); zip.file("package.json", generatePackageJson(config)); zip.file("next.config.js", generateNextConfig()); zip.file("tailwind.config.js", generateTailwindConfig()); zip.file("README.md", generateProjectReadme(config)); app?.file("page.tsx", generatePageTsx(config)); app?.file("layout.tsx", generateLayoutTsx(config)); app?.file("globals.css", `@tailwind base;\n@tailwind components;\n@tailwind utilities;`); pub?.file("manifest.json", generatePublicManifest(config)); pub?.file("icon.svg", generatePublicIcon(config)); const content = await zip.generateAsync({ type: "blob" }); const safeName = (config.meta?.siteName || "Site").replace(/\s+/g, '-'); const a = document.createElement('a'); a.href = window.URL.createObjectURL(content); a.download = `${safeName}-nextjs.zip`; a.click(); };
  
  // CORRECTION DEPLOIEMENT: Utilisation de generateSiteFiles pour Vercel (Site Statique)
  const handleVercelDeploy = async () => { 
    setDeploying('vercel'); setDeployUrl(""); 
    try { 
      const files = generateSiteFiles(config); // On envoie les fichiers HTML statiques
      const safeName = (config.meta?.siteName || "Site").replace(/\s+/g, '-'); 
      const res = await fetch('/api/deploy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: 'vercel', files, siteName: safeName }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Erreur serveur"); setDeployUrl(data.url); alert(`▲ Site publié : ${data.url}`); } catch (e: any) { alert(`Erreur : ${e.message}`); } finally { setDeploying(null); } 
  };
  
  const handleNetlifyDeploy = async () => { setDeploying('netlify'); setDeployUrl(""); try { const files = generateSiteFiles(config); const safeName = (config.meta?.siteName || "Site").replace(/\s+/g, '-'); const res = await fetch('/api/deploy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: 'netlify', files, siteName: safeName }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Erreur serveur"); setDeployUrl(data.url); alert(`🚀 Site publié : ${data.url}`); } catch (e: any) { alert(`Erreur : ${e.message}`); } finally { setDeploying(null); } };

  const handlePayment = async () => { setPaymentLoading(true); try { const res = await fetch('/api/payment/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 10000, userId: "user_demo_123" }) }); const data = await res.json(); if (data.success && data.paymentUrl) window.location.href = data.paymentUrl; else alert("Impossible de lancer le paiement."); } catch (e) { alert("Erreur de connexion."); } finally { setPaymentLoading(false); } };

  return (
    <main className="flex h-screen">
      <div className="w-1/3 bg-gray-900 text-white p-8 flex flex-col border-r border-gray-700 relative overflow-y-auto">
        {isLoading && (<div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20"><div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-xl text-orange-500 font-bold">L'IA forge votre site...</p></div>)}
        <div className="mb-8"><h1 className="text-4xl font-bold text-orange-500">ForgeBuilder</h1><p className="text-gray-400 mt-2">Propulsez votre idée instantanément.</p></div>
        <div className="mb-8 border border-gray-700 bg-gray-800/50 rounded-lg p-4 space-y-3">
          <h3 className="text-md font-semibold text-gray-300 uppercase">💾 Projet</h3>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={handleSaveProject} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium">Sauvegarder</button>
            <label className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer text-xs font-medium">Charger<input type="file" accept="application/json" className="hidden" onChange={handleLoadProject} /></label>
            <button onClick={handleResetProject} className="p-2 rounded-lg bg-red-900/50 hover:bg-red-900 text-red-400 text-xs font-medium">Reset</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 z-10 mb-10">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Votre activité</label><textarea rows={3} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 focus:ring-2 focus:ring-orange-500 focus:outline-none text-white" value={prompt} onChange={(e) => setPrompt(e.target.value)} /></div>
          <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg">{isLoading ? "Génération..." : "Générer mon site"}</button>
        </form>
        {config.meta.siteName !== "ForgeBuilder" && (
          <div className="border-t border-gray-700 pt-6 space-y-6 flex-1">
            <h2 className="text-xl font-bold text-gray-200">🎨 Palette & Contenu</h2>

            {/* Thèmes */}
            <div className="border border-teal-700 bg-teal-900/20 rounded-lg p-4">
              <h3 className="text-md font-semibold text-teal-300 uppercase mb-3">✨ Thèmes</h3>
              <div className="grid grid-cols-2 gap-2">{themes.map((t, idx) => (<button key={idx} onClick={() => applyTheme(t)} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs font-medium"><span>{t.icon}</span> {t.name}</button>))}</div>
            </div>

            {/* SECTION TEMPLATES */}
            <div className="border border-pink-700 bg-pink-900/20 rounded-lg p-4">
              <h3 className="text-md font-semibold text-pink-300 uppercase mb-3">📦 Templates Rapides</h3>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
                {TEMPLATES.map((t, idx) => (<button key={idx} onClick={() => setConfig(t.config)} className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs font-medium transition-all hover:scale-105 group"><span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{t.icon}</span><span className="text-gray-200 truncate w-full text-center">{t.name}</span></button>))}
              </div>
            </div>

            {/* SECTION 1 : HERO */}
            <div className="border border-orange-700 bg-orange-900/20 rounded-lg p-4 space-y-3">
              <h3 onClick={() => scrollToSection('top')} className="text-md font-semibold text-orange-400 uppercase cursor-pointer hover:text-orange-300 flex justify-between items-center">1. Hero <span className="text-xs opacity-50">↓ Aller</span></h3>
              <input type="text" value={config.meta.siteName || ""} onChange={(e) => updateSiteName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm" />
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Logo (Image)</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="w-full text-xs text-gray-400 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700 cursor-pointer" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-gray-400">Logo Texte</label><input type="text" maxLength={20} value={config.meta.theme.logoLetter || ""} onChange={(e) => updateTheme('logoLetter', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm mt-1 text-center font-bold" /></div>
                <div><label className="text-xs text-gray-400">Style Logo</label><select value={config.meta.theme.logoStyle || "minimal"} onChange={(e) => updateTheme('logoStyle', e.target.value)} className="w-full h-9 rounded bg-gray-700 border border-gray-600 px-2 text-xs mt-1"><option value="minimal">Simple</option><option value="circle">Cercle</option><option value="square">Carré</option><option value="gradient">Dégradé</option><option value="drawn">Dessiné</option><option value="neon">Néon</option><option value="stamp">Cachet</option><option value="embossed">Embouti</option></select></div>
              </div>

              <div className="flex gap-2 items-center">
                <label className="text-xs text-gray-400 w-20">Couleur Logo</label>
                <input type="color" value={config.meta.theme.logoColor || config.meta.theme.brandColor || "#F97316"} onChange={(e) => updateTheme('logoColor', e.target.value)} className="w-8 h-6 rounded cursor-pointer bg-transparent border p-0.5" />
                <input type="text" value={config.meta.theme.logoColor || config.meta.theme.brandColor || "#F97316"} onChange={(e) => updateTheme('logoColor', e.target.value)} className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs uppercase" />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400">Titre Principal</label>
                <div className="flex gap-2">
                  <input type="text" value={config.sections.find(s => s.type === 'hero')?.data?.headline || ""} onChange={(e) => setConfig(p => ({ ...p, sections: p.sections.map(s => s.type === 'hero' ? { ...s, data: { ...s.data, headline: e.target.value } } : s) }))} className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm" />
                  <button onClick={() => refineText('hero-h', config.sections.find(s => s.type === 'hero')?.data?.headline || "", (val) => setConfig(p => ({ ...p, sections: p.sections.map(s => s.type === 'hero' ? { ...s, data: { ...s.data, headline: val } } : s) })))} disabled={refiningField === 'hero-h'} className="p-2 text-orange-400 hover:text-orange-300 disabled:opacity-50 bg-gray-700 rounded border border-gray-600">{refiningField === 'hero-h' ? "⏳" : "✨"}</button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Description</label>
                <div className="flex gap-2">
                  <input type="text" value={config.sections.find(s => s.type === 'hero')?.data?.subheadline || ""} onChange={(e) => setConfig(p => ({ ...p, sections: p.sections.map(s => s.type === 'hero' ? { ...s, data: { ...s.data, subheadline: e.target.value } } : s) }))} className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm" />
                  <button onClick={() => refineText('hero-d', config.sections.find(s => s.type === 'hero')?.data?.subheadline || "", (val) => setConfig(p => ({ ...p, sections: p.sections.map(s => s.type === 'hero' ? { ...s, data: { ...s.data, subheadline: val } } : s) })))} disabled={refiningField === 'hero-d'} className="p-2 text-orange-400 hover:text-orange-300 disabled:opacity-50 bg-gray-700 rounded border border-gray-600">{refiningField === 'hero-d' ? "⏳" : "✨"}</button>
                </div>
              </div>
              <div className="flex gap-2 items-center"><label className="text-xs text-gray-400">Titre</label><input type="color" value={config.meta.theme.textColor || '#FFFFFF'} onChange={(e) => updateTheme('textColor', e.target.value)} className="w-8 h-6 rounded cursor-pointer bg-transparent border p-0.5" /><input type="range" min="30" max="80" value={config.meta.theme.fontSize || 48} onChange={(e) => updateTheme('fontSize', e.target.value)} className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" /></div>
              <div className="flex gap-2 items-center"><label className="text-xs text-gray-400">Texte</label><input type="color" value={config.meta.theme.secondaryTextColor || '#CCCCCC'} onChange={(e) => updateTheme('secondaryTextColor', e.target.value)} className="w-8 h-6 rounded cursor-pointer bg-transparent border p-0.5" /></div>
              <div className="flex gap-2 items-center"><label className="text-xs text-gray-400">Bouton</label><input type="color" value={config.meta.theme.primaryColor} onChange={(e) => updateTheme('primaryColor', e.target.value)} className="w-8 h-6 rounded cursor-pointer bg-transparent border p-0.5" /></div>
              <select value={getActionType(config.sections.find(s => s.type === 'hero')?.data?.ctaLink)} onChange={(e) => handleActionTypeChange(e.target.value)} className="w-full h-8 rounded bg-gray-700 border border-gray-600 px-2 text-xs mt-1"><option value="tel">📞 Appel</option><option value="whatsapp">💬 WhatsApp</option><option value="mailto">✉️ Email</option><option value="anchor">⬇️ Formulaire</option></select>
              {getActionType(config.sections.find(s => s.type === 'hero')?.data?.ctaLink) !== 'anchor' && (<input type="text" value={getActionValue()} onChange={(e) => handleActionValueChange(e.target.value)} placeholder="Valeur..." className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-xs mt-1" />)}
            </div>

            {/* SECTION 2 : STYLES GLOBAUX */}
            <div className="border border-purple-700 bg-purple-900/20 rounded-lg p-4 space-y-2">
              <h3 className="text-md font-semibold text-purple-400 uppercase">2. Styles Globaux</h3>
              <div className="flex gap-2 items-center">
                <label className="text-xs text-gray-400 w-20">Titres</label>
                <input type="color" value={config.meta.theme.featureTitleColor || '#111111'} onChange={(e) => updateTheme('featureTitleColor', e.target.value)} className="w-8 h-6 rounded cursor-pointer bg-transparent border p-0.5" />
                <input type="text" value={config.meta.theme.featureTitleColor || '#111111'} onChange={(e) => updateTheme('featureTitleColor', e.target.value)} className="flex-1 bg-gray-700 rounded px-2 py-1 text-xs" />
              </div>
            </div>

            {/* SECTION 3 : SERVICES */}
            <div className="border border-green-700 bg-green-900/20 rounded-lg p-4 space-y-2">
              <h3 onClick={() => scrollToSection('services')} className="text-md font-semibold text-green-400 uppercase cursor-pointer hover:text-green-300 flex justify-between items-center">3. Services <span className="text-xs opacity-50">↓ Aller</span></h3>
              {config.sections.find(s => s.type === 'features')?.data?.items?.map((item: any, idx: number) => (
                <div key={idx} className="border border-gray-700 p-2 rounded space-y-1 bg-gray-800/50">
                  <input type="text" value={item.title || ""} onChange={(e) => updateListItem('features', idx, 'title', e.target.value)} className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                  <textarea value={item.description || ""} onChange={(e) => updateListItem('features', idx, 'description', e.target.value)} rows={1} className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                </div>
              ))}
            </div>

            {/* SECTION PRODUITS */}
            {config.sections.find(s => s.type === 'products') && (
              <div className="border border-amber-700 bg-amber-900/20 rounded-lg p-4 space-y-2">
                <h3 className="text-md font-semibold text-amber-400 uppercase">🛍️ Produits</h3>
                {config.sections.find(s => s.type === 'products')?.data?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="border border-gray-700 p-2 rounded space-y-1 bg-gray-800/50 relative">
                    <button onClick={() => removeProduct(idx)} className="absolute top-1 right-1 text-red-400 hover:text-red-300 text-xs p-1 hover:bg-red-900/50 rounded">×</button>
                    <input type="text" value={item.title || ""} onChange={(e) => updateListItem('products', idx, 'title', e.target.value)} placeholder="Nom du produit" className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                    <input type="text" value={item.price || ""} onChange={(e) => updateListItem('products', idx, 'price', e.target.value)} placeholder="Prix (ex: 15 000 FCFA)" className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                    <textarea value={item.description || ""} onChange={(e) => updateListItem('products', idx, 'description', e.target.value)} placeholder="Description" rows={2} className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400">Image du produit</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'products', idx)} className="w-full text-xs text-gray-400 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-amber-50 file:text-amber-700 cursor-pointer" />
                    </div>
                  </div>
                ))}
                <button onClick={addProduct} className="w-full mt-2 p-2 bg-amber-600 hover:bg-amber-700 rounded text-xs font-bold transition-colors">+ Ajouter un produit</button>
              </div>
            )}

            {/* SECTION 4 : TÉMOIGNAGES */}
            {config.sections.find(s => s.type === 'testimonials') && (
              <div className="border border-yellow-700 bg-yellow-900/20 rounded-lg p-4 space-y-2">
                <h3 className="text-md font-semibold text-yellow-400 uppercase">4. Témoignages</h3>
                {config.sections.find(s => s.type === 'testimonials')?.data?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="border border-gray-700 p-2 rounded space-y-1 bg-gray-800/50">
                    <input type="text" value={item.author || ""} onChange={(e) => updateListItem('testimonials', idx, 'author', e.target.value)} placeholder="Auteur" className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                    <textarea value={item.quote || ""} onChange={(e) => updateListItem('testimonials', idx, 'quote', e.target.value)} placeholder="Citation" rows={2} className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 5 : BLOG */}
            {config.sections.find(s => s.type === 'blog') && (
              <div className="border border-red-700 bg-red-900/20 rounded-lg p-4 space-y-2">
                <h3 className="text-md font-semibold text-red-400 uppercase">5. Blog</h3>
                {config.sections.find(s => s.type === 'blog')?.data?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="border border-gray-700 p-2 rounded space-y-1 bg-gray-800/50">
                    <input type="text" value={item.title || ""} onChange={(e) => updateListItem('blog', idx, 'title', e.target.value)} placeholder="Titre" className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                    <textarea value={item.excerpt || ""} onChange={(e) => updateListItem('blog', idx, 'excerpt', e.target.value)} placeholder="Extrait" rows={2} className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 6 : CONTACT & FOOTER */}
            <div className="border border-cyan-700 bg-cyan-900/20 rounded-lg p-4 space-y-2">
              <h3 className="text-md font-semibold text-cyan-400 uppercase">6. Contact & Footer</h3>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Email de réception</label>
                <input type="email" value={config.meta.contactEmail || ""} onChange={(e) => updateContactEmail(e.target.value)} placeholder="contact@email.com" className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Téléphone</label>
                <input type="text" value={config.meta.phone || ""} onChange={(e) => updatePhone(e.target.value)} placeholder="+225 07 00 00 00 00" className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Adresse</label>
                <input type="text" value={config.meta.address || ""} onChange={(e) => updateAddress(e.target.value)} placeholder="Abidjan, Cocody" className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm" />
              </div>
            </div>

            {/* SECTION DÉPLOIEMENT */}
            <div className="border border-gray-500 bg-gray-800/50 rounded-lg p-4 space-y-3">
              <h3 className="text-md font-semibold text-white uppercase flex items-center gap-2"><span>☁️</span> Mise en ligne</h3>
              {!isPro ? (
                <div className="space-y-2">
                  <div className="bg-gray-700/50 p-3 rounded border border-gray-600 text-center">
                    <p className="text-sm font-bold text-white">Verrouillé</p>
                    <button onClick={handlePayment} disabled={paymentLoading} className="w-full mt-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-lg hover:opacity-90 transition disabled:opacity-50">
                      {paymentLoading ? "Chargement..." : "Débloquer 10 000 FCFA"}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">PayTech (Wave/Orange/Card)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Publiez instantanément.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleNetlifyDeploy} disabled={deploying === 'netlify'} className="p-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold disabled:opacity-50 transition">{deploying === 'netlify' ? "⏳..." : "🚀 Netlify"}</button>
                    <button onClick={handleVercelDeploy} disabled={deploying === 'vercel'} className="p-2 rounded bg-black hover:bg-gray-900 text-white text-xs font-bold disabled:opacity-50 border border-gray-500 transition">{deploying === 'vercel' ? "⏳..." : "▲ Vercel"}</button>
                  </div>
                </div>
              )}
              {deployUrl && (<div className="bg-green-900/30 p-2 rounded border border-green-500 text-green-300 text-center mt-2"><p className="text-xs font-bold">🎉 Site en ligne :</p><a href={deployUrl} target="_blank" className="underline text-xs break-all">{deployUrl}</a></div>)}
            </div>

            <div className="pt-6 border-t border-gray-700 space-y-3">
              <p className="text-xs text-gray-500 text-center">Téléchargement manuel</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleStaticExport} className="p-2 rounded bg-gray-600 hover:bg-gray-500 text-white text-xs font-medium">📱 ZIP</button>
                <button onClick={handleDynamicExport} className="p-2 rounded bg-gray-600 hover:bg-gray-500 text-white text-xs font-medium">📦 Next.js</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-2/3 overflow-y-auto bg-white"><DynamicRenderer sections={config.sections} meta={config.meta} /></div>
    </main>
  );
}