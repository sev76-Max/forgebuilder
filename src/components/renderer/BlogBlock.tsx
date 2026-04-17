"use client";
import React from 'react';

interface BlogBlockProps {
  data: any;
  theme?: any; // RENDU OPTIONNEL
}

const BlogBlock: React.FC<BlogBlockProps> = ({ data, theme }) => {
  const { title, items } = data || {};
  const brandColor = theme?.brandColor || theme?.primaryColor || "#F97316";
  const textColor = theme?.featureTitleColor || "#111";
  const descColor = theme?.featureDescColor || "#4b5563";

  return (
    <section id="blog" style={{ padding: '4rem 1rem', background: '#f9fafb' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: textColor }}>{title || "Blog"}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        {(items || []).map((item: any, idx: number) => (
          <article key={idx} style={{ background: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: textColor }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', color: descColor }}>{item.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BlogBlock;