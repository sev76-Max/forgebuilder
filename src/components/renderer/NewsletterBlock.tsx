export default function NewsletterBlock({ data, theme }: { data: any, theme: any }) {
  // Utilisation des styles COLONNES (Bas de page)
  const titleColor = theme?.featureTitleColor || "#111827";
  const textColor = theme?.featureDescColor || "#4b5563";
  // Le bouton utilise la même couleur que les titres des colonnes pour l'harmonie
  const btnColor = theme?.featureTitleColor || "#111827";

  return (
    <section id="newsletter" className="py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-4" style={{ color: titleColor }}>{data.title || "Restez informé"}</h2>
        <p className="mb-8" style={{ color: textColor }}>{data.subtitle || "Inscrivez-vous à notre newsletter."}</p>
        
        <form action="https://formsubmit.co/your-email@example.com" method="POST" className="flex flex-col sm:flex-row gap-4 justify-center">
          <input 
            type="email" 
            name="email" 
            required 
            placeholder="Votre email" 
            className="px-6 py-4 rounded-full border border-gray-300 flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input type="hidden" name="_captcha" value="false"/>
          <button 
            type="submit" 
            style={{ backgroundColor: btnColor }} 
            className="px-8 py-4 rounded-full text-white font-bold shadow-lg hover:opacity-90 transition"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </section>
  );
}