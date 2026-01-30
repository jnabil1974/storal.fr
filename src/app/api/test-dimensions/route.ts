import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('🔍 Test endpoint - ENV check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlStart: supabaseUrl?.substring(0, 30)
  });

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ 
      error: 'Missing env vars', 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey 
    }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('sb_products')
      .select('id, name, min_width, max_width, min_projection, max_projection')
      .eq('active', true)
      .order('name', { ascending: true })
      .limit(5);

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    console.log('✅ Query success, rows:', data?.length);
    return NextResponse.json({ 
      success: true, 
      count: data?.length, 
      products: data 
    });

  } catch (error: any) {
    console.error('❌ Exception:', error);
    return NextResponse.json({ 
      error: error.message, 
      stack: error.stack 
    }, { status: 500 });
  }
}
