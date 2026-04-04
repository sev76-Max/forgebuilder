export default function ContactFormBlock({ theme }: { theme: any }) {
  // Utilisation des styles COLONNES (Bas de page)
  const titleColor = theme?.featureTitleColor || "#111827";
  const textColor = theme?.featureDescColor || "#4b5563";
  // Le bouton utilise la même couleur que les titres des colonnes
  const btnColor = theme?.featureTitleColor || "#111827";

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: titleColor }}>
          Contactez-nous
        </h2>
        
        <form 
          action="https://formsubmit.co/your-email@example.com" 
          method="POST"
          className="space-y-6 bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100"
        >
          <input type="hidden" name="_subject" value="Nouveau message" />
          <input type="hidden" name="_captcha" value="false" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Votre Nom</label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Votre Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="jean@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              name="message" 
              rows={4} 
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Bonjour, je suis intéressé par..."
            />
          </div>

          <button 
            type="submit"
            style={{ backgroundColor: btnColor }}
            className="w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-lg transition-all hover:opacity-90"
          >
            Envoyer le message
          </button>
        </form>
      </div>
    </section>
  );
}