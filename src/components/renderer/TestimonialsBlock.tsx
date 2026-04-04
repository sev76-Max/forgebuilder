export default function TestimonialsBlock({ data, theme }: { data: any, theme: any }) {
  // CORRECTION : On utilise les styles des COLONNES, pas du HERO
  const titleColor = theme?.featureTitleColor || "#111827";
  const textColor = theme?.featureDescColor || "#4b5563";
  const textSize = theme?.featureFontSize ? `${theme.featureFontSize}px` : "1rem";

  return (
    <section id="avis" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: titleColor }}>
          {data.title || "Ce que disent nos clients"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(data.items || []).map((item: any, index: number) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative">
              <div className="absolute top-4 left-4 text-6xl text-gray-200 font-serif leading-none select-none">“</div>
              
              <p className="relative z-10 mb-6 italic leading-relaxed" style={{ color: textColor, fontSize: textSize }}>
                {item.quote}
              </p>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-gray-500">{item.author?.charAt(0) || 'A'}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{item.author}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}