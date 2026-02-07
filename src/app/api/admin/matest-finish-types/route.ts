import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Essayer de créer la table si elle n'existe pas
    try {
      const { error: createError } = await supabase.rpc('create_matest_finish_types_if_not_exists')
      if (createError && !createError.message.includes('does not exist')) {
        console.error('Erreur création table:', createError)
      }
    } catch (err) {
      console.error('Erreur rpc:', err)
    }

    const { data, error } = await supabase
      .from('matest_finish_types')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      // Si la table n'existe pas, retourner les types par défaut
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        const defaultTypes = [
          { id: 1, name: 'brillant', icon: null, color: null, order_index: 1 },
          { id: 2, name: 'sablé', icon: null, color: null, order_index: 2 },
          { id: 3, name: 'mat', icon: null, color: null, order_index: 3 },
          { id: 4, name: 'promo', icon: null, color: null, order_index: 4 },
          { id: 5, name: 'spéciale', icon: null, color: null, order_index: 5 }
        ]
        return NextResponse.json({ types: defaultTypes })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ types: data || [] })
  } catch (error) {
    console.error('Erreur GET matest-finish-types:', error)
    // En cas d'erreur, retourner les types par défaut
    const defaultTypes = [
      { id: 1, name: 'brillant', icon: null, color: null, order_index: 1 },
      { id: 2, name: 'sablé', icon: null, color: null, order_index: 2 },
      { id: 3, name: 'mat', icon: null, color: null, order_index: 3 },
      { id: 4, name: 'promo', icon: null, color: null, order_index: 4 },
      { id: 5, name: 'spéciale', icon: null, color: null, order_index: 5 }
    ]
    return NextResponse.json({ types: defaultTypes })
  }
}

export async function POST(request: Request) {
  try {
    const { name, icon, color, order_index, product_slugs } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('matest_finish_types')
      .insert([{ 
        name, 
        icon, 
        color, 
        order_index: order_index || 0,
        product_slugs: product_slugs || []
      }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, type: data?.[0] })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase
      .from('matest_finish_types')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, icon, color, product_slugs } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('matest_finish_types')
      .update({ 
        name, 
        icon, 
        color,
        product_slugs: product_slugs || []
      })
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, type: data?.[0] })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
