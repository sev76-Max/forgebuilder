// src/lib/deployer.ts

// --- NETLIFY DEPLOY (Pour le site statique PWA) ---
export async function deployToNetlify(files: Record<string, string>, siteName: string, token: string): Promise<string> {
  const formData = new FormData();
  
  // Création du fichier ZIP côté client
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  for (const [filename, content] of Object.entries(files)) {
    zip.file(filename, content);
  }
  const blob = await zip.generateAsync({ type: "blob" });

  formData.append('file', blob, `${siteName}.zip`);

  // Appel API Netlify
  const response = await fetch('https://api.netlify.com/api/v1/deploys', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur Netlify");
  }

  const result = await response.json();
  return result.ssl_url || result.url; // Renvoie l'URL HTTPS
}

// --- VERCEL DEPLOY (Pour le site dynamique Next.js) ---
// On utilise l'API Vercel pour créer un déploiement "Serverless"
export async function deployToVercel(files: Record<string, string>, siteName: string, token: string): Promise<string> {
  // Préparation des fichiers pour Vercel (structure JSON)
  const vercelFiles = Object.entries(files).map(([name, content]) => ({
    file: name,
    data: content, // Vercel accepte le contenu texte direct
  }));

  const response = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: siteName.replace(/\s+/g, '-').toLowerCase(),
      files: vercelFiles,
      projectSettings: {
        framework: "nextjs",
      },
      target: 'production', // ou 'preview'
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Erreur Vercel");
  }

  const result = await response.json();
  return `https://${result.url}`; // Renvoie l'URL du déploiement
}