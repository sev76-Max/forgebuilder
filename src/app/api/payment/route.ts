import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // On récupère le projectId envoyé par le frontend
    const { amount, userId, projectId } = body; 

    const apiKey = process.env.PAYTECH_API_KEY;
    const secretKey = process.env.PAYTECH_SECRET_KEY;

    if (!apiKey || !secretKey) {
      return NextResponse.json({ 
        success: false, 
        message: "Erreur Serveur : Les clés API PayTech sont introuvables." 
      }, { status: 500 });
    }

    // On prépare les données personnalisées pour l'IPN
    const customDataString = JSON.stringify({ userId, projectId });

    const paymentData = {
      item_name: "Déploiement Pro ForgeBuilder",
      item_price: amount,
      command_name: `CMD-${projectId}-${Date.now()}`,
      ref_command: `REF-${Date.now()}`,
      currency: "XOF",
      lang: "fr",
      env: "test", // Mettre "prod" en production
      // MODIFICATION : On ajoute projectId à l'URL pour le récupérer au retour
      success_url: `https://forgebuilder.vercel.app/?payment=success&projectId=${projectId}`,
      cancel_url: "https://forgebuilder.vercel.app/?payment=cancel",
      ipn_url: "https://forgebuilder.vercel.app/api/payment/ipn",
      custom_data: customDataString 
    };

    const response = await fetch('https://paytech.sn/api/payment/request-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API_KEY': apiKey,
        'API_SECRET': secretKey
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
          message: data.error || "La requête de paiement a été refusée par PayTech.",
          details: data
        }, { status: 400 });
      }
    } catch (jsonError) {
      console.error("Erreur de parsing JSON:", textResponse);
      return NextResponse.json({ 
        success: false, 
        message: "Réponse invalide reçue de PayTech.",
        raw: textResponse 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Erreur API Payment:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Erreur interne du serveur." 
    }, { status: 500 });
  }
}