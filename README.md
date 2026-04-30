ForgeBuilder 🚀
ForgeBuilder est un générateur de sites web et de boutiques en ligne professionnel propulsé par l'IA. Il permet de créer, personnaliser et publier des sites web modernes ou des e-commerces en quelques secondes, sans compétences techniques, avec un accent particulier sur le marché ouest-africain (paiement Wave/Orange via PayTech).

✨ Fonctionnalités
Génération IA : Décrivez votre activité, l'IA génère le contenu, les images et la structure complète.
Boutique en Ligne (E-commerce) : Créez une boutique complète avec gestion de produits (nom, prix, description, image). Intégration d'un bouton "Acheter" redirigeant vers WhatsApp pour faciliter les transactions humaines.
Contact Intelligent : Choix entre boutons "Appeler" ou "Discuter sur WhatsApp" directement intégrés dans le site.
Réseaux Sociaux : Intégration facile de vos liens Facebook, Instagram, Twitter et LinkedIn dans le footer.
Design Premium : Sites générés avec un design moderne, responsive, SEO-friendly et animations fluides.
Multi-Pages : Crée automatiquement les pages Accueil, À Propos, Services, Produits, Blog, Témoignages et Contact.
Paiement Local Intégré : Système de débloquage pour les clients via PayTech (Wave, Orange Money, Cartes Bancaires).
Double Export :
Statique (HTML) : Pour des sites vitrines rapides et hébergés facilement.
Dynamique (Next.js + Supabase) : Pour des sites avec formulaire de contact sauvegardé en base de données et gestion utilisateur.
Déploiement 1 Clic : Publication instantanée sur Netlify ou Vercel.
Thèmes Prédéfinis : 5 palettes de couleurs professionnelles (Nuit, Nature, Océan, Manga, Luxe).
Assistants IA : Bouton "Améliorer" pour reformater et professionaliser les textes automatiquement.
🛠️ Prérequis
Node.js (v18 ou supérieur recommandé)
Un compte Groq (pour l'IA)
Un compte PayTech (pour les paiements)
Un compte Supabase (pour le backend des sites dynamiques et l'authentification)
Des comptes Netlify et/ou Vercel (pour le déploiement)
🚀 Installation
1. Cloner le projet
git clone https://github.com/votre-utilisateur/forge-builder.gitcd forge-builder
2. Installer les dépendances
npm install
3. Configurer les variables d'environnement
Créez un fichier .env.local à la racine du projet et ajoutez vos clés :
# IA (Groq)
GROQ_API_KEY=votre_cle_api_groq

# Base de données & Auth (Supabase)
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role_supabase

# Paiement (PayTech)
PAYTECH_API_KEY=votre_cle_api_paytech
PAYTECH_SECRET_KEY=votre_cle_secrete_paytech

# Déploiement (Vos tokens personnels)
NETLIFY_TOKEN=votre_token_netlify
VERCEL_TOKEN=votre_token_vercel

# URL publique
NEXT_PUBLIC_APP_URL=http://localhost:3000
4. Lancer l'application
npm run dev

📖 Guide d'utilisation
Génération : Entrez la description de votre activité (ex: "Boutique de vêtements stylés à Dakar") et cliquez sur "Générer".

Personnalisation :
Modifiez les textes, les couleurs, le logo.
Ajoutez vos produits (nom, prix, image) dans la section "Produits".
Configurez vos liens sociaux (Facebook, Instagram) et votre méthode de contact (WhatsApp ou Téléphone).

Monétisation : Cliquez sur "Débloquer la mise en ligne" pour payer via PayTech (Wave/Orange).

Publication : Une fois le paiement validé, choisissez votre mode de déploiement :
Netlify/Vercel : Publication en 1 clic.

Téléchargement : Récupérez un fichier ZIP du site (Statique ou Next.js) pour l'héberger vous-même.

🏗️ Architecture Technique
Frontend : Next.js 14 (App Router), React, Tailwind CSS.
Backend : API Routes Next.js, Supabase (Auth & Database).
IA : Llama 3 via l'API Groq.

Paiement : API PayTech.
Déploiement : API Netlify & Vercel.
Export : JSZip pour la génération d'archives téléchargeables.

📄 Licence
MIT License.