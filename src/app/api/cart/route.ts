import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing sessionId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return new Response(JSON.stringify({ items: [], totalItems: 0, totalPrice: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId);

    if (error) throw error;

    const totalItems = (data || []).reduce((sum, item) => sum + Number(item.quantity), 0);
    const totalPrice = (data || []).reduce((sum, item) => sum + Number(item.total_price), 0);

    return new Response(
      JSON.stringify({
        items: data || [],
        totalItems,
        totalPrice,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📦 POST /api/cart - Received:', body);
    
    const {
      sessionId,
      productId,
      productType,
      productName,
      basePrice,
      configuration,
      quantity,
      pricePerUnit,
    } = body;

    console.log('💰 Prices:', { basePrice, pricePerUnit, quantity });

    if (!sessionId || !productId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return new Response(JSON.stringify({ error: 'Supabase not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const insertData = {
      session_id: sessionId,
      product_id: productId,
      product_type: productType,
      product_name: productName,
      base_price: Number(basePrice),
      configuration,
      quantity: Number(quantity),
      price_per_unit: Number(pricePerUnit),
      total_price: Number(pricePerUnit) * Number(quantity),
    };
    
    console.log('💾 Inserting to Supabase:', insertData);

    const { data, error } = await supabase
      .from('cart_items')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    console.log('✅ Insert successful:', data);

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, quantity } = body;

    if (!id || !quantity || quantity < 1) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return new Response(JSON.stringify({ error: 'Supabase not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Récupérer l'item pour recalculer le prix total
    const { data: item, error: fetchError } = await supabase
      .from('cart_items')
      .select('price_per_unit')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from('cart_items')
      .update({
        quantity: Number(quantity),
        total_price: Number(item?.price_per_unit || 0) * Number(quantity),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const sessionId = searchParams.get('sessionId');

  const supabase = getSupabaseClient();
  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (id) {
      // Supprimer un item spécifique
      const { error } = await supabase.from('cart_items').delete().eq('id', id);
      if (error) throw error;
    } else if (sessionId) {
      // Vider le panier complet
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId);
      if (error) throw error;
    } else {
      return new Response(JSON.stringify({ error: 'Missing id or sessionId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting from cart:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
