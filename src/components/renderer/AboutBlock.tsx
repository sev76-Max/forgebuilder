export default function AboutBlock({ data, theme }: { data: any, theme: any }) {
  const titleColor = theme?.featureTitleColor || "#111827";
  const textColor = theme?.featureDescColor || "#4b5563";
  const fSize = theme?.featureFontSize ? `${theme.featureFontSize}px` : "16px";

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        {data.imageUrl && (
          <div className="md:w-1/2">
            <img src={data.imageUrl} alt="À propos" className="rounded-xl shadow-lg w-full h-auto object-cover aspect-video"/>
          </div>
        )}
        <div className={data.imageUrl ? "md:w-1/2" : "w-full text-center"}>
          <h2 className="text-3xl font-bold mb-6" style={{ color: titleColor }}>{data.title || "À Propos"}</h2>
          <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: textColor, fontSize: fSize }}>
            {data.content || "Notre histoire..."}
          </p>
        </div>
      </div>
    </section>
  );
}