import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, userId } = body;

    const apiKey = process.env.PAYTECH_API_KEY;
    const secretKey = process.env.PAYTECH_SECRET_KEY;

    // DEBUG: On vérifie si les clés sont chargées
    if (!apiKey || !secretKey) {
      return NextResponse.json({ 
        success: false, 
        message: "Erreur Serveur : Les clés API PayTech sont introuvables dans les variables d'environnement." 
      });
    }

    // Préparation des données pour PayTech
    const paymentData = {
      item_name: "Déploiement Pro ForgeBuilder",
      item_price: amount,
      command_name: `Commande Pro - ${userId}`,
      ref_command: `REF-${Date.now()}`,
      currency: "XOF",
      lang: "fr",
      // REMPLACEZ BIEN L'URL CI-DESSOUS PAR VOTRE VRAIE URL VERCEL
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

    const data = await response.json();

    // DEBUG: On renvoie le message exact de PayTech si ça échoue
    if (data.success === 1 && data.redirect_url) {
      return NextResponse.json({ success: true, paymentUrl: data.redirect_url });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Erreur PayTech : " + (data.message || JSON.stringify(data))
      });
    }

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: "Erreur interne : " + error.message 
    });
  }
}