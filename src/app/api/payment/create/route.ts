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
      }, { status: 500 });
    }

    const paymentData = {
      item_name: "Déploiement Pro ForgeBuilder",
      item_price: amount,
      command_name: `CMD-${Date.now()}`,
      ref_command: `REF-${Date.now()}`,
      currency: "XOF",
      lang: "fr",
      env: "test", // Mettre "prod" en production
      success_url: "https://forgebuilder.vercel.app/?payment=success",
      cancel_url: "https://forgebuilder.vercel.app/?payment=cancel",
      ipn_url: "https://forgebuilder.vercel.app/api/payment/ipn"
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
        // Cas où PayTech répond mais indique un échec
        return NextResponse.json({ 
          success: false, 
          message: data.error || "La requête de paiement a été refusée par PayTech.",
          details: data
        }, { status: 400 });
      }
    } catch (jsonError) {
      // Cas où la réponse de PayTech n'est pas du JSON valide
      console.error("Erreur de parsing JSON:", textResponse);
      return NextResponse.json({ 
        success: false, 
        message: "Réponse invalide reçue de PayTech.",
        raw: textResponse 
      }, { status: 500 });
    }

  } catch (error) {
    // Cas d'une erreur serveur globale (réseau, code, etc.)
    console.error("Erreur API Payment:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Erreur interne du serveur." 
    }, { status: 500 });
  }
}