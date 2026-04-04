export default function CtaBlock({ data, themeColor }: { data: any, themeColor: string }) {
  return (
    // ID "contact" ajouté pour la navigation
    <section id="contact" className="py-20 bg-gray-900 text-white text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        {data.title}
      </h2>
      <a 
        href={data.buttonLink} 
        className="inline-block px-8 py-4 rounded-full text-white font-bold text-lg shadow-2xl transition-all hover:scale-105"
        style={{ backgroundColor: themeColor }}
      >
        {data.buttonText}
      </a>
    </section>
  );
}