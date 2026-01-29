import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // A. Récupérer les données envoyées par le client
    const { slug, largeur, avancee, motorisationId, emetteurId, toileId } = await req.json();
    console.log(
      `🔍 Demande reçue : ${slug} | ${largeur}x${avancee} | Motorisation: ${
        motorisationId || 'Aucune'
      } | Émetteur: ${emetteurId || 'Aucun'} | Toile: ${toileId || 'Aucune'}`
    );

    // B. Initialiser Supabase
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      );
    }

    // C. Requête à la base de données
    // On cherche le produit et son prix d'achat correspondant
    const { data, error } = await supabase
      .from('sb_product_purchase_prices')
      .select(
        `
        price_ht,
        products!inner (
          id,
          name,
          sales_coefficient
        )
      `
      )
      .eq('products.slug', slug) // Le bon produit
      .eq('projection', avancee) // La bonne avancée
      .gte('width_max', largeur) // Largeur >= Demande
      .order('width_max', { ascending: true }) // Le plus petit qui rentre
      .limit(1)
      .single();

    // D. Gestion des erreurs (Si on ne trouve rien)
    if (error || !data) {
      console.warn('❌ Pas de prix trouvé pour ces dimensions.', error);
      return NextResponse.json(
        { error: 'Dimensions non disponibles ou produit inconnu.' },
        { status: 404 }
      );
    }

    // E. Extraction des données brutes
    const prixAchat = data.price_ht;
    const product = Array.isArray(data.products) ? data.products[0] : data.products;
    const marge = product.sales_coefficient;
    const nomProduit = product.name;

    // F. Calculs Financiers
    // 1. Prix du store margé
    let prixVenteStore = prixAchat * marge;

    // 2. Ajouter le prix de la motorisation si sélectionnée
    let prixMotorisation = 0;
    if (motorisationId) {
      const { data: motorData, error: motorError } = await supabase
        .from('sb_product_options')
        .select('*')
        .eq('id', motorisationId)
        .single();

      if (!motorError && motorData) {
        prixMotorisation = motorData.purchase_price_ht * motorData.sales_coefficient;
        console.log(
          `⚙️ Motorisation ajoutée : ${motorData.name} = ${prixMotorisation.toFixed(2)}€`
        );
      }
    }

    // 2b. Ajouter le prix de l'émetteur (télécommande) si sélectionné
    let prixEmetteur = 0;
    if (emetteurId) {
      const { data: emetteurData, error: emetteurError } = await supabase
        .from('sb_product_options')
        .select('*')
        .eq('id', emetteurId)
        .single();

      if (!emetteurError && emetteurData) {
        prixEmetteur = emetteurData.purchase_price_ht * emetteurData.sales_coefficient;
        console.log(
          `📡 Émetteur ajouté : ${emetteurData.name} = ${prixEmetteur.toFixed(2)}€`
        );
      }
    }

    // 2c. Ajouter le prix de la toile si sélectionnée (prix au m²)
    let prixToile = 0;
    if (toileId) {
      const { data: toileData, error: toileError } = await supabase
        .from('sb_product_options')
        .select('*')
        .eq('id', toileId)
        .single();

      if (!toileError && toileData) {
        // Calculer la surface en m² (largeur et avancée sont en mm)
        const surfaceM2 = (largeur * avancee) / 1000000;
        prixToile =
          toileData.purchase_price_ht * toileData.sales_coefficient * surfaceM2;
        console.log(
          `🎨 Toile ajoutée : ${toileData.name} = ${toileData.purchase_price_ht}€/m² × ${toileData.sales_coefficient} × ${surfaceM2.toFixed(2)}m² = ${prixToile.toFixed(2)}€`
        );
      }
    }

    // 3. Gestion du Transport (Règle : > 3650mm = +139€)
    let fraisPort = 0;
    let messageTransport = '';

    if (largeur > 3650) {
      fraisPort = 139.0 * 1.0; // On refacture le port sans marge (x1.0)
      messageTransport = 'Surtaxe longueur incluse';
    }

    // 4. Total Final
    const prixFinal = prixVenteStore + prixMotorisation + prixEmetteur + prixToile + fraisPort;

    // G. Réponse au client
    console.log(
      `✅ Prix calculé : ${prixFinal.toFixed(2)} € (Store: ${prixVenteStore.toFixed(
        2
      )}€ + Motorisation: ${prixMotorisation.toFixed(2)}€ + Émetteur: ${prixEmetteur.toFixed(
        2
      )}€ + Toile: ${prixToile.toFixed(2)}€ + Transport: ${fraisPort.toFixed(2)}€)`
    );

    return NextResponse.json({
      success: true,
      product: nomProduit,
      prixClientHT: prixFinal.toFixed(2), // Arrondi à 2 décimales
      message: messageTransport,
    });
  } catch (err) {
    console.error('🔥 Erreur Serveur :', err);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
