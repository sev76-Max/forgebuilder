// Ajout de imageUrl dans les props
import LogoDisplay from "../ui/LogoDisplay"; 
import React from "react";

export default function HeroBlock({ data, themeColor, layoutStyle, theme, siteName }: { 
  data: any, 
  themeColor: string, 
  layoutStyle?: string,
  theme?: any,
  siteName?: string
}) {
  const isDark = layoutStyle !== 'light';
  const titleColor = theme?.textColor || (isDark ? '#ffffff' : '#111827');
  const descColor = theme?.secondaryTextColor || (isDark ? '#e5e7eb' : '#4b5563');
  const titleSize = theme?.fontSize ? `${theme.fontSize}px` : '3.5rem';
  const descSize = theme?.secondaryFontSize ? `${theme.secondaryFontSize}px` : '1.25rem';
  
  const brandColor = theme?.brandColor || themeColor;
  const logoColor = theme?.logoColor || brandColor;
  const brandFont = theme?.brandFont || 'inherit';
  const logoStyle = theme?.logoStyle || 'minimal';
  const logoLetter = theme?.logoLetter;
  const logoUrl = theme?.logoUrl; // NOUVEAU

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 h-full w-full">
        <img src={data.imageUrl} alt="Hero background" className="w-full h-full object-cover" style={{ objectFit: 'cover' }} />
        {isDark ? (<div className="absolute inset-0 bg-black/50"></div>) : (<div className="absolute inset-0 bg-white/60"></div>)}
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20">
        {siteName && (
          <div className="mb-6">
            <LogoDisplay 
                siteName={siteName} 
                letter={logoLetter}
                style={logoStyle} 
                color={logoColor}
                font={brandFont}
                imageUrl={logoUrl} // PASSAGE DE L'URL
            />
          </div>
        )}
        <h1 className="font-extrabold tracking-tight mb-6 leading-tight drop-shadow-xl" style={{ color: titleColor, fontSize: titleSize }}>{data?.headline || "Bienvenue"}</h1>
        <p className="max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: descColor, fontSize: descSize }}>{data?.subheadline || "Description."}</p>
        <a href={data?.ctaLink || "#"} className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-white font-bold text-lg shadow-2xl transition-all transform hover:scale-105" style={{ backgroundColor: brandColor }}>
          {data?.ctaText || "Démarrer"}
        </a>
      </div>
    </section>
  );
}