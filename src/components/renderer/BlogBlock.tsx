export default function BlogBlock({ data, theme }: { data: any, theme: any }) {
  const titleColor = theme?.featureTitleColor || "#111827";
  const textColor = theme?.featureDescColor || "#4b5563";

  if (!data.items || data.items.length === 0) return null;

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: titleColor }}>{data.title || "Notre Blog"}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {data.items.map((item: any, idx: number) => (
            <article key={idx} className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300">
              <div className="overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <span className="text-xs text-gray-400 uppercase">{item.date || "Actualité"}</span>
                <h3 className="text-xl font-bold mt-2 mb-3 group-hover:text-orange-500 transition-colors" style={{ color: titleColor }}>{item.title}</h3>
                <p style={{ color: textColor }} className="text-sm line-clamp-3">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}