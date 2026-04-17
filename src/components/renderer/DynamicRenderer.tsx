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
        switch (section.type) {
          case 'hero':
            return <HeroBlock key={index} data={section.data} theme={meta.theme} siteName={meta.siteName} />;
          
          case 'features':
            return <FeaturesBlock key={index} data={section.data} theme={meta.theme} />;
            
          case 'testimonials':
            // CORRECTION APPLIQUÉE ICI
            return <TestimonialsBlock key={index} data={section.data} theme={meta.theme} />;
            
          case 'about':
            // CORRECTION APPLIQUÉE ICI
            return <AboutBlock key={index} data={section.data} theme={meta.theme} />;
            
          case 'blog':
            // CORRECTION APPLIQUÉE ICI
            return <BlogBlock key={index} data={section.data} theme={meta.theme} />;
            
          default:
            return null;
        }
      })}
    </div>
  );
};

export default DynamicRenderer;