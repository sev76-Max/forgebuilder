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

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ sections, meta }) => {
  return (
    <div>
      {sections.map((section, index) => {
        // On s'assure que meta.theme existe, sinon on met un objet vide par défaut
        const currentTheme = meta?.theme || {}; 
        
        switch (section.type) {
          case 'hero':
            return <HeroBlock key={index} data={section.data} theme={currentTheme} siteName={meta.siteName} />;
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
  );
};

export default DynamicRenderer;