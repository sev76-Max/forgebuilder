import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, userId } = body;

    const apiKey = process.env.PAYTECH_API_KEY;
    const secretKey = process.env.PAYTECH_SECRET_KEY;

    if (!apiKey || !secretKey) {
      return NextResponse.json({ success: false, message: "Clés API PayTech manquantes sur le serveur." });
    }

    // Préparation des données pour PayTech
    const paymentData = {
      item_name: "Déploiement Pro ForgeBuilder",
      item_price: amount, // Montant en FCFA
      command_name: `Commande Pro - ${userId}`,
      ref_command: `REF-${Date.now()}`,
      customer_phone: "", // Optionnel
      customer_email: "", // Optionnel
      currency: "XOF",
      lang: "fr",
      success_url: "https://forgebuilder.vercel.app/?payment=success", // Remplacez par votre URL
      cancel_url: "https://forgebuilder.vercel.app/?payment=cancel",   // Remplacez par votre URL
      callback_url: "https://forgebuilder.vercel.app/api/payment/callback" // Pour les notifications serveur
    };

    // Appel à l'API PayTech
    const response = await fetch('https://paytech.sn/api/payment/request-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':' + secretKey).toString('base64')
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();

    if (data.success === 1 && data.redirect_url) {
      return NextResponse.json({ success: true, paymentUrl: data.redirect_url });
    } else {
      return NextResponse.json({ success: false, message: data.message || "Erreur PayTech" });
    }

  } catch (error) {
    console.error("Erreur paiement:", error);
    return NextResponse.json({ success: false, message: "Erreur interne du serveur." });
  }
}