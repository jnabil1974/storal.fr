import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function PUT(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    // Utiliser le service role key pour bypasser RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Format invalide: updates doit être un tableau' },
        { status: 400 }
      );
    }

    // Mettre à jour tous les produits
    const results = [];
    const errors = [];

    for (const update of updates) {
      const { id, display_order } = update;

      if (!id || display_order === undefined) {
        errors.push({ id, error: 'ID ou display_order manquant' });
        continue;
      }

      const { data, error } = await supabase
        .from('sb_products')
        .update({ display_order })
        .eq('id', id)
        .select();

      if (error) {
        console.error(`Erreur mise à jour produit ${id}:`, error);
        errors.push({ id, error: error.message });
      } else {
        results.push({ id, success: true });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          message: `${results.length} produits mis à jour, ${errors.length} erreurs`,
          results,
          errors 
        },
        { status: 207 } // Multi-Status
      );
    }

    return NextResponse.json({ 
      message: `${results.length} produits mis à jour avec succès`,
      results 
    });

  } catch (error) {
    console.error('Erreur API update-product-order:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: String(error) },
      { status: 500 }
    );
  }
}
