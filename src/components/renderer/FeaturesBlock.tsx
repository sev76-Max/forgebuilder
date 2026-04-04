export default function FeaturesBlock({ data, theme }: { data: any, theme: any }) {
  const titleColor = theme?.featureTitleColor || "#111827";
  const descColor = theme?.featureDescColor || "#4b5563";
  const fSize = theme?.featureFontSize ? `${theme.featureFontSize}px` : "16px";
  const fFont = theme?.featureFontFamily || "'Inter', sans-serif";
  const pColor = theme?.primaryColor || "#F97316";

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: titleColor, fontFamily: fFont }}>{data.title || "Services"}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {(data.items || []).map((item: any, idx: number) => (
            <div key={idx} className="text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition bg-white">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-4"/>
              ) : (
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl" style={{ color: pColor }}>
                  {item.icon === 'Zap' ? '⚡' : item.icon === 'Shield' ? '🛡️' : '❤️'}
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2" style={{ color: titleColor }}>{item.title}</h3>
              <p style={{ color: descColor, fontSize: fSize }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}