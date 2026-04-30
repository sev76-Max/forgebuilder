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

const getContactLink = (phone: string, type: string) => {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/\s+/g, '');
  
  if (type === 'whatsapp') {
    return `https://wa.me/${cleanPhone}?text=Bonjour, je suis intéressé par vos services.`;
  }
  return `tel:${cleanPhone}`;
};

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ sections, meta }) => {
  const currentMeta = meta || {};
  const currentTheme = currentMeta.theme || {};

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      
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

      {/* FOOTER */}
      {(currentMeta.phone || currentMeta.contactEmail || currentMeta.address || currentMeta.socialFacebook || currentMeta.socialInstagram || currentMeta.socialTwitter || currentMeta.socialLinkedin) && (
        <footer className="bg-gray-900 text-white py-12 px-4 mt-auto">
          <div className="max-w-6xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left mb-8">
              
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

            {/* Réseaux Sociaux */}
            {(currentMeta.socialFacebook || currentMeta.socialInstagram || currentMeta.socialTwitter || currentMeta.socialLinkedin) && (
              <div className="flex justify-center gap-6 mb-6 border-t border-gray-800 pt-6">
                {currentMeta.socialFacebook && (
                  <a href={currentMeta.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Facebook">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {currentMeta.socialInstagram && (
                  <a href={currentMeta.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Instagram">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {currentMeta.socialTwitter && (
                  <a href={currentMeta.socialTwitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Twitter / X">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                 {currentMeta.socialLinkedin && (
                  <a href={currentMeta.socialLinkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                )}
              </div>
            )}

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