"use client";
import React from 'react';

interface TestimonialsBlockProps {
  data: any;
  theme?: any; // RENDU OPTIONNEL
}

const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ data, theme }) => {
  const { title, items } = data || {};
  const brandColor = theme?.brandColor || theme?.primaryColor || "#F97316";
  const textColor = theme?.featureTitleColor || "#111";
  const descColor = theme?.featureDescColor || "#4b5563";

  return (
    <section id="testimonials" style={{ padding: '4rem 1rem', background: '#f9fafb' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: textColor }}>{title || "Avis Clients"}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        {(items || []).map((item: any, idx: number) => (
          <div key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: descColor }}>"{item.quote}"</p>
            <p style={{ fontWeight: 'bold', color: textColor }}>{item.author}</p>
            {item.role && <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.role}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsBlock;