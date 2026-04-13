"use client";
import React from 'react';
import { SiteConfig } from '@/lib/site-config';

// Helper function
function adjustColor(hex: string, amount: number): string {
  if (!hex || typeof hex !== 'string') return '#000000';
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return '#000000';
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Interface HYBRIDE : Accepte soit 'config', soit les props individuelles
interface LogoDisplayProps {
  config?: SiteConfig;
  siteName?: string;
  letter?: string;
  style?: string;
  color?: string;
  font?: string;
  imageUrl?: string;
}

const LogoDisplay: React.FC<LogoDisplayProps> = (props) => {
  // Extraction intelligente des valeurs
  // On priorise 'config' s'il est présent, sinon on utilise les props individuelles
  const siteName = props.config?.meta?.siteName || props.siteName || "Site";
  const theme = props.config?.meta?.theme;
  
  const finalLetter = props.letter || theme?.logoLetter || siteName?.substring(0, 1) || "F";
  const finalColor = props.color || theme?.logoColor || theme?.brandColor || theme?.primaryColor || "#F97316";
  const finalStyle = props.style || theme?.logoStyle || "minimal";
  const finalFont = props.font || theme?.brandFont || "Inter";
  const finalImageUrl = props.imageUrl || theme?.logoUrl;

  if (finalImageUrl) {
    return <img src={finalImageUrl} alt="Logo" style={{ height: 50, width: 'auto', objectFit: 'contain' }} />;
  }

  const getFontSize = (base: number) => {
     const l = finalLetter.length;
     if (l > 10) return base * 0.6;
     if (l > 5) return base * 0.8;
     return base;
  };

  const baseStyle: React.CSSProperties = {
    fontFamily: finalFont,
    fontWeight: 800,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    transition: 'all 0.3s ease',
  };

  const stylesMap: Record<string, React.CSSProperties> = {
    circle: { ...baseStyle, width: '4rem', height: '4rem', borderRadius: '9999px', backgroundColor: finalColor, color: 'white', fontSize: getFontSize(24), boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
    square: { ...baseStyle, width: '4rem', height: '4rem', borderRadius: '1rem', backgroundColor: finalColor, color: 'white', fontSize: getFontSize(24), boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
    gradient: { ...baseStyle, width: '4rem', height: '4rem', borderRadius: '1rem', backgroundImage: `linear-gradient(135deg, ${finalColor}, ${adjustColor(finalColor, -40)})`, color: 'white', fontSize: getFontSize(24), boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
    drawn: { ...baseStyle, fontSize: getFontSize(48), fontFamily: 'Georgia, serif', fontStyle: 'italic', color: finalColor, textShadow: '2px 2px 0px rgba(0,0,0,0.1)' },
    neon: { ...baseStyle, fontSize: getFontSize(40), fontFamily: 'monospace', color: '#fff', textShadow: `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${finalColor}, 0 0 40px ${finalColor}` },
    stamp: { ...baseStyle, fontSize: getFontSize(24), padding: '0.75rem 1.5rem', border: `3px solid ${finalColor}`, color: finalColor, textTransform: 'uppercase', letterSpacing: '0.1em', transform: 'rotate(-3deg)', boxShadow: `4px 4px 0px ${finalColor}`, background: 'transparent' },
    embossed: { ...baseStyle, fontSize: getFontSize(40), color: 'transparent', background: 'transparent', textShadow: `1px 1px 1px ${adjustColor(finalColor, 100)}, -1px -1px 1px ${adjustColor(finalColor, -100)}` },
    minimal: { ...baseStyle, fontSize: getFontSize(24), padding: '0.5rem 1rem', border: `2px solid ${finalColor}`, borderRadius: '0.5rem', color: finalColor },
  };

  return <div style={stylesMap[finalStyle] || stylesMap.minimal}>{finalLetter}</div>;
};

export default LogoDisplay;