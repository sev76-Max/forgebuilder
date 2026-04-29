"use client";

import { useState, useEffect } from "react";
import JSZip from 'jszip';
import DynamicRenderer from "@/components/renderer/DynamicRenderer";
import { SiteConfig } from "@/lib/site-config";
import { generateSiteFiles } from "@/lib/exporter";
import { generatePackageJson, generatePageTsx, generateLayoutTsx, generateNextConfig, generateTailwindConfig, generatePublicManifest, generatePublicIcon, generateProjectReadme } from "@/lib/projectGenerator";
import { getDemoImages } from "@/lib/unsplash";
import { TEMPLATES } from "@/lib/templates";
import { createClient } from '@supabase/supabase-js';

// Initialisation Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  
  // NOUVEAU : État pour gérer la vérification de connexion
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true); 

  useEffect(() => {
    // Fonction pour récupérer l'utilisateur
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setCheckingAuth(false); // On a fini de vérifier
    };
    
    // On écoute les changements d'état (connexion/deconnexion)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setCheckingAuth(false); // On a fini de vérifier
      
      // Si on reçoit un événement de connexion, on nettoie l'URL
      if (event === 'SIGNED_IN') {
         window.history.replaceState({}, document.title, window.location.pathname);
      }
    });

    // Vérification du retour de paiement
    const checkPaymentStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment');
      const projectId = params.get('projectId');

      if (paymentStatus === 'success' && projectId) {
        alert("Paiement réussi ! Votre projet est en cours de débloquage...");
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (paymentStatus === 'cancel') {
        alert("Le paiement a été annulé.");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    getUser();
    checkPaymentStatus();

    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  const handleLogin = async () => {
    const email = window.prompt("Entrez votre email pour recevoir le lien de connexion :");
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) alert("Erreur : " + error.message);
    else alert("Lien envoyé ! Vérifiez vos emails.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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

  const handleStaticExport = async () => { const zip = new JSZip(); const files = generateSiteFiles(config); for (const [filename, content] of Object.entries(files)) { zip.file(filename, content); } const content = await zip.generateAsync({ type: "blob" }); const url = window.URL.createObjectURL(content); const safeName = (config.meta?.siteName || "Site").replace(/\s+/g, '-'); const a = document.createElement('a'); a.href = url; a.download = `${safeName}.zip`; a.click(); };
  const handleDynamicExport = async () => { const zip = new JSZip(); const src = zip.folder("src"); const app = src?.folder("app"); const pub = zip.folder("public"); zip.file("package.json", generatePackageJson(config)); zip.file("next.config.js", generateNextConfig()); zip.file("tailwind.config.js", generateTailwindConfig()); zip.file("README.md", generateProjectReadme(config)); app?.file("page.tsx", generatePageTsx(config)); app?.file("layout.tsx", generateLayoutTsx(config)); app?.file("globals.css", `@tailwind base;\n@tailwind components;\n@tailwind utilities;`); pub?.file("manifest.json", generatePublicManifest(config)); pub?.file("icon.svg", generatePublicIcon(config)); const content = await zip.generateAsync({ type: "blob" }); const safeName = (config.meta?.siteName || "Site").replace(/\s+/g, '-'); const a = document.createElement('a'); a.href = window.URL.createObjectURL(content); a.download = `${safeName}-nextjs.zip`; a.click(); };
  
  const handleVercelDeploy = async () => { 
    setDeploying('vercel'); setDeployUrl(""); 
    try { 
      const files = generateSiteFiles(config);
      const safeName = (config.meta?.siteName || "Site").replace(/\s+/g, '-'); 
      const res = await fetch('/api/deploy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: 'vercel', files, siteName: safeName }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Erreur serveur"); setDeployUrl(data.url); alert(`▲ Site publié : ${data.url}`); } catch (e: any) { alert(`Erreur : ${e.message}`); } finally { setDeploying(null); } 
  };
  
  const handleNetlifyDeploy = async () => { setDeploying('netlify'); setDeployUrl(""); try { const files = generateSiteFiles(config); const safeName = (config.meta?.siteName || "Site").replace(/\s+/g, '-'); const res = await fetch('/api/deploy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: 'netlify', files, siteName: safeName }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Erreur serveur"); setDeployUrl(data.url); alert(`🚀 Site publié : ${data.url}`); } catch (e: any) { alert(`Erreur : ${e.message}`); } finally { setDeploying(null); } };

  const handlePayment = async () => { 
    setPaymentLoading(true); 
    
    try {
      if (!user) {
        handleLogin(); 
        setPaymentLoading(false);
        return;
      }

      const userId = user.id;

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          name: config.meta.siteName || "Mon Projet",
          content: config,
          is_paid: false 
        })
        .select('id')
        .single();

      if (projectError) {
        console.error("Erreur Supabase:", projectError);
        if (projectError.message.includes('JWT expired') || projectError.message.includes('not authenticated')) {
           await supabase.auth.signOut();
           setUser(null);
           alert("Votre session a expiré. Veuillez vous reconnecter.");
        } else {
           alert("Erreur base de données : " + projectError.message);
        }
        setPaymentLoading(false);
        return;
      }
      
      if (!projectData) {
        alert("Erreur : Aucune donnée retournée.");
        setPaymentLoading(false);
        return;
      }

      const projectId = projectData.id;

      const res = await fetch('/api/payment', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          amount: 10000, 
          userId: userId, 
          projectId: projectId 
        }) 
      }); 
      
      const data = await res.json(); 
      
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl; 
      } else {
        alert(data.message || "Impossible de lancer le paiement.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur de connexion au serveur.");
    } finally {
      setPaymentLoading(false); 
    }
  };

  return (
    <main className="flex h-screen">
      <div className="w-1/3 bg-gray-900 text-white p-8 flex flex-col border-r border-gray-700 relative overflow-y-auto">
        {isLoading && (<div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20"><div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-xl text-orange-500 font-bold">L'IA forge votre site...</p></div>)}
        <div className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold text-orange-500">ForgeBuilder</h1>
                <p className="text-gray-400 mt-2">Propulsez votre idée instantanément.</p>
            </div>
            <div>
                {/* MODIFICATION ICI : Gestion de l'état de chargement de l'authentification */}
                {checkingAuth ? (
                   <span className="text-xs text-gray-400 px-3 py-1">Vérification...</span>
                ) : user ? (
                    <button onClick={handleLogout} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-gray-300">
                        Déconnexion
                    </button>
                ) : (
                    <button onClick={handleLogin} className="text-xs bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded font-bold">
                        Connexion
                    </button>
                )}
            </div>
        </div>
        
        {/* Le reste du fichier reste identique... */}
        {/* Pour économiser de l'espace, je ne remets pas tout le JSX identique (thèmes, hero, etc.), assure-toi de garder le reste de ton fichier précédent à partir d'ici. */}
        {/* Si tu veux le fichier complet, dis-le-moi, mais seul le bloc du haut change vraiment. */}
        
        <div className="mb-8 border border-gray-700 bg-gray-800/50 rounded-lg p-4 space-y-3">
          <h3 className="text-md font-semibold text-gray-300 uppercase">💾 Projet</h3>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={handleSaveProject} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium">Sauvegarder</button>
            <label className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer text-xs font-medium">Charger<input type="file" accept="application/json" className="hidden" onChange={handleLoadProject} /></label>
            <button onClick={handleResetProject} className="p-2 rounded-lg bg-red-900/50 hover:bg-red-900 text-red-400 text-xs font-medium">Reset</button>
          </div>
        </div>
        
        {/* ... Le reste de ton code (Formulaire, Config, Deployment) reste inchangé ... */}
        {/* J'ai coupé ici pour la brièveté, mais tu dois garder tout le reste du JSX intact. */}
        
        {/* SECTION DÉPLOIEMENT (Assure-toi qu'elle est identique à la version précédente) */}
         <div className="border-t border-gray-700 pt-6 space-y-6 flex-1">
            {/* ... Contenu des onglets et configuration ... */}
            
             {/* Pour te faciliter la tâche, je te remets juste la section déploiement critique qui change un peu : */}
            
            <div className="border border-gray-500 bg-gray-800/50 rounded-lg p-4 space-y-3">
              <h3 className="text-md font-semibold text-white uppercase flex items-center gap-2"><span>☁️</span> Mise en ligne</h3>
              {!isPro ? (
                <div className="space-y-2">
                  <div className="bg-gray-700/50 p-3 rounded border border-gray-600 text-center">
                    <p className="text-sm font-bold text-white">Verrouillé</p>
                    {/* Modification ici aussi pour gérer checkingAuth */}
                    {checkingAuth ? (
                       <button disabled className="w-full mt-2 bg-gray-500 text-white font-bold py-3 px-4 rounded-lg text-sm">
                         Vérification de la session...
                       </button>
                    ) : !user ? (
                       <button onClick={handleLogin} className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-lg hover:opacity-90 transition">
                         Se connecter pour débloquer
                       </button>
                    ) : (
                       <button onClick={handlePayment} disabled={paymentLoading} className="w-full mt-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-lg hover:opacity-90 transition disabled:opacity-50">
                         {paymentLoading ? "Chargement..." : "Débloquer 10 000 FCFA"}
                       </button>
                    )}
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
         </div>
      </div>
      <div className="w-2/3 overflow-y-auto bg-white"><DynamicRenderer sections={config.sections} meta={config.meta} /></div>
    </main>
  );
}