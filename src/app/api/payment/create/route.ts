// src/app/api/payment/create/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, userId } = body; // Montant en FCFA

    // Configuration PayTech
    const apiKey = process.env.PAYTECH_API_KEY;
    const secretKey = process.env.PAYTECH_SECRET_KEY;

    if (!apiKey || !secretKey) throw new Error("Clés PayTech manquantes");

    const paymentData = {
      item_name: "Abonnement ForgeBuilder Pro",
      item_price: amount,
      currency: "XOF",
      ref_command: `FORGE_${Date.now()}`, // Référence unique
      command_name: "Abonnement Mensuel",
      env: "prod", // Mettre "test" en mode test, "prod" en production
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?payment=cancel`,
      ipn_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/notify`, // Webhook
      custom_field: JSON.stringify({ user_id: userId }) // Données personnalisées
    };

    // Appel à l'API PayTech
    const response = await fetch('https://paytech.sn/api/payment/request-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API_KEY': apiKey,
        'API_SECRET': secretKey
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    // PayTech renvoie un objet avec 'redirect_url' si succès
    if (result.success === 1 || result.redirect_url) {
      return NextResponse.json({ 
        success: true, 
        paymentUrl: result.redirect_url 
      });
    } else {
      console.error("Erreur PayTech:", result);
      throw new Error(result.errors || "Erreur d'initialisation PayTech");
    }

  } catch (error: any) {
    console.error("Erreur paiement:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}