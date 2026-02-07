import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Récupérer le paramètre productSlug de l'URL
  const { searchParams } = new URL(request.url)
  const productSlug = searchParams.get('productSlug')
  
  // Si un productSlug est fourni, filtrer par types compatibles
  if (productSlug) {
    // 1. Récupérer les types compatibles avec ce produit
    const { data: finishTypes, error: typesError } = await supabase
      .from('matest_finish_types')
      .select('name')
      .contains('product_slugs', [productSlug])
    
    if (typesError) {
      console.error('Erreur récupération types:', typesError)
      // Si erreur, retourner toutes les couleurs
      const { data, error } = await supabase
        .from('matest_colors')
        .select('*')
        .order('id')
      
      return NextResponse.json({ colors: data || [], count: data?.length || 0 })
    }
    
    const compatibleFinishes = finishTypes?.map(t => t.name) || []
    
    // 2. Récupérer les couleurs de ces types
    if (compatibleFinishes.length > 0) {
      const { data, error } = await supabase
        .from('matest_colors')
        .select('*')
        .in('finish', compatibleFinishes)
        .order('finish')
        .order('ral_code')
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ colors: data || [], count: data?.length || 0 })
    }
    
    // Si aucun type compatible, retourner tableau vide
    return NextResponse.json({ colors: [], count: 0 })
  }
  
  // Sans productSlug, retourner toutes les couleurs
  const { data, error } = await supabase
    .from('matest_colors')
    .select('*')
    .order('id')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ colors: data, count: data?.length || 0 })
}

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const body = await request.json()
  
  const { ral_code, name, finish, image_url } = body
  
  if (!finish || (!ral_code && !name)) {
    return NextResponse.json(
      { error: 'finish est requis + ral_code ou name' },
      { status: 400 }
    )
  }
  
  const { data, error } = await supabase
    .from('matest_colors')
    .insert({
      ral_code,
      name,
      finish,
      image_url: image_url || `/images/matest/RAL_${ral_code}.png`
    })
    .select()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true, color: data[0] })
}

export async function PUT(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const body = await request.json()

  const { id, ral_code, name, finish, image_url } = body

  if (!id) {
    return NextResponse.json({ error: 'id requis' }, { status: 400 })
  }

  if (!finish || (!ral_code && !name)) {
    return NextResponse.json(
      { error: 'finish est requis + ral_code ou name' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('matest_colors')
    .update({
      ral_code,
      name,
      finish,
      image_url: image_url || null
    })
    .eq('id', id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, color: data?.[0] })
}

export async function DELETE(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const body = await request.json().catch(() => ({}))

  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'id requis' }, { status: 400 })
  }

  const { error } = await supabase
    .from('matest_colors')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
