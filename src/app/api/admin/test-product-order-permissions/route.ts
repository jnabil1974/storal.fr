import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const checks = {
      config: {
        supabaseUrl: !!supabaseUrl,
        supabaseServiceKey: !!supabaseServiceKey,
        supabaseAnonKey: !!supabaseAnonKey,
      },
      tests: {} as any,
    };

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        ...checks,
        error: 'Configuration Supabase incomplète',
      });
    }

    // Test avec service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Test lecture
    const { data: readData, error: readError } = await supabaseAdmin
      .from('sb_products')
      .select('id, name, display_order')
      .limit(1);

    checks.tests.read = {
      success: !readError,
      error: readError?.message,
      count: readData?.length || 0,
    };

    // 2. Test mise à jour (si on a des données)
    if (readData && readData.length > 0) {
      const testProduct = readData[0];
      const currentOrder = testProduct.display_order || 0;

      const { data: updateData, error: updateError } = await supabaseAdmin
        .from('sb_products')
        .update({ display_order: currentOrder })
        .eq('id', testProduct.id)
        .select();

      checks.tests.update = {
        success: !updateError,
        error: updateError?.message,
        productId: testProduct.id,
        displayOrder: currentOrder,
      };
    }

    // 3. Vérifier la colonne display_order existe
    const { data: columnData, error: columnError } = await supabaseAdmin
      .from('sb_products')
      .select('display_order')
      .limit(1);

    checks.tests.columnExists = {
      success: !columnError,
      error: columnError?.message,
    };

    return NextResponse.json(checks);
  } catch (error) {
    console.error('Erreur test permissions:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: String(error) },
      { status: 500 }
    );
  }
}
