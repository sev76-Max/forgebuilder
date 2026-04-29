"use client";
import React from 'react';
import HeroBlock from './HeroBlock';
import FeaturesBlock from './FeaturesBlock';
import TestimonialsBlock from './TestimonialsBlock';
import AboutBlock from './AboutBlock';
import BlogBlock from './BlogBlock';

interface DynamicRendererProps {
  sections: any[];
  meta: any;
}

// Fonction utilitaire pour générer le bon lien (Appel ou WhatsApp)
const getContactLink = (phone: string, type: string) => {
  if (!phone) return '#';
  // On nettoie le numéro (enlève les espaces)
  const cleanPhone = phone.replace(/\s+/g, '');
  
  if (type === 'whatsapp') {
    // Lien direct vers WhatsApp
    return `https://wa.me/${cleanPhone}?text=Bonjour, je suis intéressé par vos services.`;
  }
  // Par défaut, lien pour appeler
  return `tel:${cleanPhone}`;
};

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ sections, meta }) => {
  // S'assurer que meta existe
  const currentMeta = meta || {};
  const currentTheme = currentMeta.theme || {};

  return (
    // Structure flexible pour pousser le footer en bas
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      
      {/* Contenu principal de la page */}
      <div className="flex-grow">
        {sections.map((section, index) => {
          switch (section.type) {
            case 'hero':
              return <HeroBlock key={index} data={section.data} theme={currentTheme} siteName={currentMeta.siteName} />;
            case 'features':
              return <FeaturesBlock key={index} data={section.data} theme={currentTheme} />;
            case 'testimonials':
              return <TestimonialsBlock key={index} data={section.data} theme={currentTheme} />;
            case 'about':
              return <AboutBlock key={index} data={section.data} theme={currentTheme} />;
            case 'blog':
              return <BlogBlock key={index} data={section.data} theme={currentTheme} />;
            default:
              return null;
          }
        })}
      </div>

      {/* FOOTER - SECTION CONTACT */}
      {/* S'affiche uniquement si au moins une info de contact existe */}
      {(currentMeta.phone || currentMeta.contactEmail || currentMeta.address) && (
        <footer className="bg-gray-900 text-white py-12 px-4 mt-auto">
          <div className="max-w-6xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left mb-8">
              
              {/* Bloc Téléphone / WhatsApp */}
              {currentMeta.phone && (
                <div className="flex flex-col items-center md:items-start">
                  <h4 className="font-bold text-lg mb-3 text-orange-400 uppercase tracking-wider">Téléphone</h4>
                  <a 
                    href={getContactLink(currentMeta.phone, currentMeta.phoneType)}
                    target={currentMeta.phoneType === 'whatsapp' ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors text-gray-200 hover:text-white"
                  >
                    {currentMeta.phoneType === 'whatsapp' ? (
                      <>
                        <span className="text-green-500 text-xl">💬</span>
                        <span>Discuter sur WhatsApp</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">📞</span>
                        <span>{currentMeta.phone}</span>
                      </>
                    )}
                  </a>
                </div>
              )}

              {/* Bloc Email */}
              {currentMeta.contactEmail && (
                <div className="flex flex-col items-center md:items-start">
                  <h4 className="font-bold text-lg mb-3 text-orange-400 uppercase tracking-wider">Email</h4>
                  <a 
                    href={`mailto:${currentMeta.contactEmail}`}
                    className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors text-gray-200 hover:text-white"
                  >
                    <span className="text-xl">✉️</span>
                    <span>{currentMeta.contactEmail}</span>
                  </a>
                </div>
              )}

              {/* Bloc Adresse */}
              {currentMeta.address && (
                <div className="flex flex-col items-center md:items-start">
                  <h4 className="font-bold text-lg mb-3 text-orange-400 uppercase tracking-wider">Adresse</h4>
                  <p className="text-gray-300 flex items-start gap-2">
                    <span className="text-xl mt-1">📍</span>
                    <span>{currentMeta.address}</span>
                  </p>
                </div>
              )}
              
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 pt-8 border-t border-gray-800 text-sm">
              © {new Date().getFullYear()} {currentMeta.siteName}. Tous droits réservés.
            </div>
            
          </div>
        </footer>
      )}
    </div>
  );
};

export default DynamicRenderer;