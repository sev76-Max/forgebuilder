"use client";
import React from 'react';
import LogoDisplay from '../ui/LogoDisplay';

interface HeroBlockProps {
  siteName: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  logoLetter?: string;
  logoStyle?: string;
  logoColor?: string;
  brandFont?: string;
  logoUrl?: string;
  textColor?: string;
  secondaryTextColor?: string;
  primaryColor?: string;
}

const HeroBlock: React.FC<HeroBlockProps> = ({
  siteName,
  headline,
  subheadline,
  ctaText,
  ctaLink,
  imageUrl,
  logoLetter,
  logoStyle,
  logoColor,
  brandFont,
  logoUrl,
  textColor = "#ffffff",
  secondaryTextColor = "#e5e7eb",
  primaryColor = "#F97316"
}) => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
      {/* Background Image */}
      <img 
        src={imageUrl} 
        alt="Hero Background" 
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
      />
      
      {/* Content Container */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        
        <div className="mb-6">
            {/* On passe les props explicitement */}
            <LogoDisplay 
                siteName={siteName}
                letter={logoLetter}
                style={logoStyle}
                color={logoColor}
                font={brandFont}
                imageUrl={logoUrl}
            />
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', color: textColor }}>
            {headline}
        </h1>
        
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: secondaryTextColor }}>
            {subheadline}
        </p>
        
        <a 
          href={ctaLink} 
          style={{ display: 'inline-block', padding: '1rem 2.5rem', backgroundColor: primaryColor, color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)' }}
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
};

export default HeroBlock;