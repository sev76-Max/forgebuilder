"use client";
import React from 'react';

interface AboutBlockProps {
  data: any;
  theme?: any; // RENDU OPTIONNEL
}

const AboutBlock: React.FC<AboutBlockProps> = ({ data, theme }) => {
  const { title, content, imageUrl } = data || {};
  const brandColor = theme?.brandColor || theme?.primaryColor || "#F97316";
  const textColor = theme?.featureTitleColor || "#111";
  const descColor = theme?.featureDescColor || "#4b5563";

  return (
    <section id="about" style={{ padding: '4rem 1rem', background: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: textColor }}>{title || "À Propos"}</h2>
        {imageUrl && <img src={imageUrl} alt="About" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '0.5rem' }} />}
        <p style={{ color: descColor, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{content || "Contenu..."}</p>
      </div>
    </section>
  );
};

export default AboutBlock;