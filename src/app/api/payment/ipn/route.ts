import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialisation Supabase avec la clé SERVICE ROLE (droits admin pour bypass RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log("✅ Notification IPN reçue de PayTech:", body);

    // Vérification du statut du paiement
    const status = body.status;
    
    // En mode test, le statut est souvent 'completed' ou 'success'
    if (status === 'completed' || status === 'success') { 
      
      // Récupération des données personnalisées (projectId et userId)
      let customData = body.custom_data;
      
      // Si custom_data est une string JSON, on la parse
      if (typeof customData === 'string') {
        try { 
          customData = JSON.parse(customData); 
        } catch (e) { 
          console.error("Erreur parsing custom_data", e); 
        }
      }
      
      if (customData && customData.projectId) {
        const { projectId, userId } = customData;

        // MISE À JOUR DANS SUPABASE
        const { error } = await supabase
          .from('projects')
          .update({ 
            is_paid: true, 
            status: 'active', // On passe le statut à 'active'
            paid_at: new Date().toISOString()
          })
          .eq('id', projectId)
          .eq('user_id', userId); // Sécurité : on vérifie que le projet appartient bien à l'utilisateur

        if (error) {
          console.error("❌ Erreur mise à jour Supabase:", error);
          return NextResponse.json({ error: "Erreur base de données" }, { status: 500 });
        }

        console.log(`🚀 Projet ${projectId} débloqué avec succès !`);
        return NextResponse.json({ message: "Paiement enregistré et projet débloqué" });
        
      } else {
        console.error("❌ Données personnalisées manquantes", body);
        return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
      }
    } else {
      console.log("ℹ️ Paiement non validé, statut:", status);
      return NextResponse.json({ message: "Paiement non validé" });
    }

  } catch (error) {
    console.error("❌ Erreur critique IPN:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}