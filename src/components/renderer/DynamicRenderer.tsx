import NavbarBlock from "./NavbarBlock";
import HeroBlock from "./HeroBlock";
import FeaturesBlock from "./FeaturesBlock";
import TestimonialsBlock from "./TestimonialsBlock";
import ContactFormBlock from "./ContactFormBlock";
import AboutBlock from "./AboutBlock";
import BlogBlock from "./BlogBlock";
import NewsletterBlock from "./NewsletterBlock";
import FooterBlock from "./FooterBlock";
import { SiteConfig } from "@/lib/site-config";

export default function DynamicRenderer({ config }: { config: SiteConfig }) {
  const { meta, sections } = config;

  return (
    <div className="font-sans antialiased">
      {/* Ajout du Navbar en haut */}
      <NavbarBlock 
        siteName={meta.siteName} 
        themeColor={meta.theme.primaryColor} 
        sections={sections} 
      />
      
      <div className="pt-16"> {/* Padding pour ne pas être caché par le navbar fixe */}
        {sections.map((section, index) => {
          switch (section.type) {
            case 'hero':
              return <HeroBlock key={index} data={section.data} themeColor={meta.theme.primaryColor} layoutStyle={meta.layoutStyle} theme={meta.theme} siteName={meta.siteName} />;
            case 'features':
              return <FeaturesBlock key={index} data={section.data} theme={meta.theme} />;
            case 'testimonials':
              return <TestimonialsBlock key={index} data={section.data} theme={meta.theme} />;
            case 'about':
              return <AboutBlock key={index} data={section.data} theme={meta.theme} />;
            case 'blog':
              return <BlogBlock key={index} data={section.data} theme={meta.theme} />;
            case 'newsletter':
              return <NewsletterBlock key={index} data={section.data} theme={meta.theme} />;
            case 'contact_form':
              return <ContactFormBlock key={index} theme={meta.theme} />;
            case 'footer':
              return <FooterBlock key={index} siteName={meta.siteName} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}