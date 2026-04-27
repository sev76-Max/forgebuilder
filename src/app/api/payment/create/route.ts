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

    // CORRECTION FINALE : URL officielle trouvée sur le tableau de bord
    const response = await fetch('https://paytech.sn/payment/request-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':' + secretKey).toString('base64')
      },
      body: JSON.stringify(paymentData)
    });

    const textResponse = await response.text();
    
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
      return NextResponse.json({ 
        success: false, 
        message: "PayTech a retourné une erreur inattendue. Réponse : " + textResponse.substring(0, 200) 
      });
    }

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: "Erreur interne : " + error.message 
    });
  }
}