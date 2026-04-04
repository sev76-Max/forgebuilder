export default function VideoBlock({ data, themeColor }: { data: any, themeColor: string }) {
  // Conversion du lien YouTube normal en lien "embed"
  let embedUrl = data.url;
  if (data.url && data.url.includes("watch?v=")) {
    embedUrl = data.url.replace("watch?v=", "embed/");
  }
  // Gestion des liens courts youtu.be
  if (data.url && data.url.includes("youtu.be/")) {
    const videoId = data.url.split("youtu.be/")[1];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          {data.title || "Découvrez notre activité"}
        </h2>
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
          {embedUrl ? (
            <iframe 
              src={embedUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              Aperçu vidéo non disponible
            </div>
          )}
        </div>
      </div>
    </section>
  );
}