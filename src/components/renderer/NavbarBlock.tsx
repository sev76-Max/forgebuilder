import React from 'react';

export default function NavbarBlock({ siteName, themeColor, sections }: { 
  siteName: string, 
  themeColor: string,
  sections: any[]
}) {
  const hasServices = sections.some(s => s.type === 'features');
  const hasTestimonials = sections.some(s => s.type === 'testimonials');
  const hasContact = sections.some(s => s.type === 'contact_form');

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <a href="#top" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', textDecoration: 'none' }}>
          {siteName}
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {hasServices && (
            <a href="#services" style={{ fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none' }}>Services</a>
          )}
          {hasTestimonials && (
            <a href="#avis" style={{ fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none' }}>Avis</a>
          )}
          {hasContact && (
            <a href="#contact" style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              backgroundColor: themeColor
            }}>
              Contact
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}