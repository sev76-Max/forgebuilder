import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialisation Admin (Service Role) - Ne JAMAIS expirer
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, userId, config } = body; // On reçoit la config complète

    const apiKey = process.env.PAYTECH_API_KEY;
    const secretKey = process.env.PAYTECH_SECRET_KEY;

    if (!apiKey || !secretKey) {
      return NextResponse.json({ success: false, message: "Clés API manquantes" }, { status: 500 });
    }

    // 1. CRÉATION DU PROJET DANS SUPABASE (Côté Serveur)
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: config.meta?.siteName || "Nouveau Projet",
        content: config,
        is_paid: false
      })
      .select('id')
      .single();

    if (projectError || !projectData) {
      console.error("Erreur création projet:", projectError);
      return NextResponse.json({ success: false, message: "Erreur base de données" }, { status: 500 });
    }

    const projectId = projectData.id;

    // 2. Préparation des données pour PayTech
    const customDataString = JSON.stringify({ userId, projectId });

    const paymentData = {
      item_name: "Déploiement Pro ForgeBuilder",
      item_price: amount,
      command_name: `CMD-${projectId}`,
      ref_command: `REF-${Date.now()}`,
      currency: "XOF",
      lang: "fr",
      env: "prod", // Prod activé
      success_url: `https://forgebuilder.vercel.app/?payment=success&projectId=${projectId}`,
      cancel_url: "https://forgebuilder.vercel.app/?payment=cancel",
      ipn_url: "https://forgebuilder.vercel.app/api/payment/ipn",
      custom_data: customDataString 
    };

    // 3. Appel à PayTech
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
    const data = JSON.parse(textResponse);

    if (data.success === 1 && data.redirect_url) {
      return NextResponse.json({ success: true, paymentUrl: data.redirect_url });
    } else {
      return NextResponse.json({ success: false, message: data.error || "Erreur PayTech" }, { status: 400 });
    }

  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur interne" }, { status: 500 });
  }
}