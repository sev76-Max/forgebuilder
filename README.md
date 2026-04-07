ForgeBuilder 🚀
ForgeBuilder est un générateur de sites web professionnel propulsé par l'IA. Il permet de créer, personnaliser et publier des sites web modernes en quelques secondes, sans compétences techniques, avec un accent particulier sur le marché ouest-africain (paiement Wave/Orange via PayTech).


✨ Fonctionnalités
Génération IA : Décrivez votre activité, l'IA génère le contenu, les images et la structure complète.
Design Premium : Sites générés avec un design moderne, responsive, SEO-friendly et animations fluides.
Multi-Pages : Crée automatiquement les pages Accueil, À Propos, Services, Blog, Témoignages et Contact.
Paiement Local Intégré : Accepte les paiements via PayTech (Wave, Orange Money, Free Money, Cartes Bancaires).
Déploiement 1 Clic : Publication instantanée sur Netlify ou Vercel (Statique ou Dynamique).
Thèmes Prédéfinis : 5 palettes de couleurs professionnelles (Nuit, Nature, Océan, Manga, Luxe).
Assistants IA : Bouton "Améliorer" pour reformater et professionaliser les textes automatiquement.

🛠️ Prérequis
Node.js (v18 ou supérieur recommandé)
Un compte Groq (pour l'IA)
Un compte PayTech (pour les paiements)
Des comptes Netlify et/ou Vercel (pour le déploiement)

🚀 Installation
Cloner le projet
git clone https://github.com/votre-utilisateur/forge-builder.gitcd forge-builder
Installer les dépendances
bash

npm install
Configurer les variables d'environnement
Créez un fichier .env.local à la racine du projet et ajoutez vos clés :
env

# IA (Groq)
GROQ_API_KEY=votre_cle_api_groq

# Paiement (PayTech)
PAYTECH_API_KEY=votre_cle_api_paytech
PAYTECH_SECRET_KEY=votre_cle_secrete_paytech

# Déploiement (Vos tokens personnels pour déployer pour vos clients)
NETLIFY_TOKEN=votre_token_netlify
VERCEL_TOKEN=votre_token_vercel

# URL publique de votre application (changez ceci en production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
Lancer l'application
bash

npm run dev

L'application sera accessible sur http://localhost:3000.

📖 Guide d'utilisation
Génération : Entrez la description de votre activité (ex: "Restaurant sénégalais à Abidjan") et cliquez sur "Générer".
Personnalisation : Modifiez les textes, les couleurs, le logo et les images via la barre latérale gauche.
Monétisation : L'utilisateur doit cliquer sur "Débloquer la mise en ligne" pour payer via PayTech.
Publication : Une fois le paiement validé, les boutons "Publier sur Netlify/Vercel" se débloquent et le site est en ligne en 1 clic.

🏗️ Architecture Technique
Frontend : Next.js 14 (App Router), React, Tailwind CSS.
Backend : API Routes Next.js.
IA : Llama 3 via l'API Groq.
Paiement : API PayTech.
Déploiement : API Netlify & Vercel.

📄 Licence
MIT License."# forgebuilder" 
