import React from 'react';
import Image from 'next/image';

export default function LogoDisplay({ 
  siteName, 
  letter, 
  style = "minimal", 
  color, 
  font = "Inter",
  imageUrl // NOUVEAU : URL de l'image logo
}: { 
  siteName: string, 
  letter?: string, 
  style?: string, 
  color?: string,
  font?: string,
  imageUrl?: string
}) {
  // Si une URL d'image est fournie, on affiche l'image
  if (imageUrl) {
    return (
      <div style={{ width: '80px', height: '80px', position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src={imageUrl} 
          alt="Logo" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  // Sinon, on affiche le logo texte
  const text = letter || siteName?.substring(0, 20) || "LOGO";
  
  const getFontSize = (base: number) => {
    if (text.length > 10) return `${base * 0.6}px`;
    if (text.length > 5) return `${base * 0.8}px`;
    return `${base}px`;
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: font,
    fontWeight: 800,
    transition: 'all 0.3s',
    lineHeight: 1
  };

  const styles: Record<string, React.CSSProperties> = {
    minimal: { ...baseStyle, fontSize: getFontSize(24), letterSpacing: '0.05em', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: `2px solid ${color}`, backgroundColor: 'transparent', color: color },
    circle: { ...baseStyle, width: '4rem', height: '4rem', borderRadius: '9999px', fontSize: getFontSize(24), backgroundColor: color, color: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
    square: { ...baseStyle, width: '4rem', height: '4rem', borderRadius: '1rem', fontSize: getFontSize(24), backgroundColor: color, color: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
    gradient: { ...baseStyle, width: '4rem', height: '4rem', borderRadius: '1rem', fontSize: getFontSize(24), backgroundImage: `linear-gradient(135deg, ${color}, ${adjustColor(color, -40)})`, color: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
    drawn: { ...baseStyle, fontSize: getFontSize(48), fontFamily: 'Georgia, serif', fontStyle: 'italic', color: color, textShadow: '2px 2px 0px rgba(0,0,0,0.1)' },
    neon: { ...baseStyle, fontSize: getFontSize(40), fontFamily: 'monospace', color: '#fff', textShadow: `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${color}, 0 0 40px ${color}` },
    stamp: { ...baseStyle, fontSize: getFontSize(24), padding: '0.75rem 1.5rem', border: `3px solid ${color}`, color: color, textTransform: 'uppercase', letterSpacing: '0.1em', transform: 'rotate(-3deg)', boxShadow: `4px 4px 0px ${color}`, background: 'transparent' },
    embossed: { ...baseStyle, fontSize: getFontSize(40), color: 'transparent', backgroundColor: 'transparent', textShadow: `1px 1px 1px ${adjustColor(color, 100)}, -1px -1px 1px ${adjustColor(color, -100)}, 2px 2px 4px rgba(0,0,0,0.2)` }
  };

  const currentStyle = styles[style] || styles.minimal;
  return <div style={currentStyle}>{text}</div>;
}

function adjustColor(hex: string, amount: number) {
  if(!hex) return '#000000';
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}