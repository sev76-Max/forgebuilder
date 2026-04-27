import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, userId } = body;

    const apiKey = process.env.PAYTECH_API_KEY;
    const secretKey = process.env.PAYTECH_SECRET_KEY;

    if (!apiKey || !secretKey) {
      return NextResponse.json({ 
        success: false, 
        message: "Erreur Serveur : Les clés API PayTech sont introuvables." 
      });
    }

    const paymentData = {
      item_name: "Déploiement Pro ForgeBuilder",
      item_price: amount,
      command_name: `CMD-${Date.now()}`,
      ref_command: `REF-${Date.now()}`,
      currency: "XOF",
      lang: "fr",
      // REMPLACEZ BIEN PAR VOTRE VRAIE URL VERCEL CI-DESSOUS
      success_url: "https://forgebuilder.vercel.app/?payment=success",
      cancel_url: "https://forgebuilder.vercel.app/?payment=cancel",
    };

    const response = await fetch('https://paytech.sn/api/payment/request-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':' + secretKey).toString('base64')
      },
      body: JSON.stringify(paymentData)
    });

    // On essaie de lire le texte brut d'abord pour voir l'erreur HTML si ça échoue
    const textResponse = await response.text();
    
    // On essaie de parser en JSON
    try {
      const data = JSON.parse(textResponse);
      if (data.success === 1 && data.redirect_url) {
        return NextResponse.json({ success: true, paymentUrl: data.redirect_url });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: "Erreur PayTech : " + (data.message || "Erreur inconnue") 
        });
      }
    } catch (parseError) {
      // Si ce n'est pas du JSON, c'est que PayTech a renvoyé une page HTML (Erreur serveur ou 404)
      return NextResponse.json({ 
        success: false, 
        message: "PayTech a retourné une erreur inattendue (HTML au lieu de JSON). Réponse : " + textResponse.substring(0, 200) 
      });
    }

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: "Erreur interne : " + error.message 
    });
  }
}