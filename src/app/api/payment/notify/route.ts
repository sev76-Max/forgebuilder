// src/app/api/payment/notify/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // PayTech envoie les données ici
    const { status, custom_field, amount } = body;

    // Vérification du statut (Codes PayTech)
    // 1 = Paiement effectué
    if (status === '1' || status === 1) {
      const userData = JSON.parse(custom_field || '{}');
      const userId = userData.user_id;
      
      console.log(`✅ PAIEMENT VALIDÉ PAR PAYTECH`);
      console.log(`Montant: ${amount} FCFA`);
      console.log(`User ID: ${userId}`);

      // ICI : Mise à jour de la base de données
      // await db.user.update({ where: { id: userId }, data: { isPro: true } });
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    return NextResponse.json({ status: 'ERROR' }, { status: 500 });
  }
}