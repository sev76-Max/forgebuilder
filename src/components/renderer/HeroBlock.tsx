"use client";
import React from 'react';
import LogoDisplay from '../ui/LogoDisplay';

interface HeroData {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

interface HeroBlockProps {
  data: HeroData;
  theme: any;
  siteName: string;
}

const HeroBlock: React.FC<HeroBlockProps> = ({ data, theme, siteName }) => {
  const {
    headline = "Bienvenue",
    subheadline = "Description",
    ctaText = "Commencer",
    ctaLink = "#",
    imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80"
  } = data || {};

  const primaryColor = theme?.primaryColor || "#F97316";
  const textColor = theme?.textColor || "#ffffff";
  const secondaryTextColor = theme?.secondaryTextColor || "#e5e7eb";

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
      <img src={imageUrl} alt="Hero Background" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="mb-6">
          <LogoDisplay siteName={siteName} letter={theme?.logoLetter} style={theme?.logoStyle} color={theme?.logoColor || theme?.brandColor} font={theme?.brandFont} imageUrl={theme?.logoUrl} />
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', color: textColor }}>{headline}</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: secondaryTextColor }}>{subheadline}</p>
        <a href={ctaLink} style={{ display: 'inline-block', padding: '1rem 2.5rem', backgroundColor: primaryColor, color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)' }}>{ctaText}</a>
      </div>
    </div>
  );
};

export default HeroBlock;