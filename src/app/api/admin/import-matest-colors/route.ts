import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST() {
  try {
    console.log('🎨 Import des couleurs Matest...')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Vérifier que la table existe et obtenir le nombre actuel
    const { count: existingCount } = await supabase
      .from('matest_colors')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Couleurs existantes: ${existingCount}`)

    // Préparer les données pour l'insertion
    const dataPath = path.join(process.cwd(), 'data', 'matest-colors-from-pdf.json')
    const matestColors = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

    const rawColors = matestColors.items.map((color: { ral_code: string | null; name: string | null; finish: string }) => ({
      ral_code: color.ral_code,
      name: color.name,
      finish: color.finish,
      image_url: null
    }))

    const seen = new Set<string>()
    const colorsToInsert = rawColors.filter((color: any) => {
      const key = `${color.ral_code ?? ''}::${color.finish}::${color.name ?? ''}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    console.log(`📦 ${colorsToInsert.length} couleurs à importer`)

    // Insérer les couleurs
    const { data, error } = await supabase
      .from('matest_colors')
      .insert(colorsToInsert)
      .select()

    if (error) {
      console.error('❌ Erreur lors de l\'import:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obtenir la distribution finale
    const { data: distribution, error: distError } = await supabase
      .from('matest_colors')
      .select('finish')
      .order('finish')

    if (distError) {
      console.error('❌ Erreur distribution:', distError)
    }

    const finishCounts = distribution?.reduce((acc: Record<string, number>, curr) => {
      acc[curr.finish] = (acc[curr.finish] || 0) + 1
      return acc
    }, {}) || {}

    const { count: totalCount } = await supabase
      .from('matest_colors')
      .select('*', { count: 'exact', head: true })

    console.log('✅ Import terminé')
    console.log('📊 Distribution:', finishCounts)

    return NextResponse.json({
      success: true,
      message: `${colorsToInsert.length} couleurs Matest importées`,
      imported: colorsToInsert.length,
      total: totalCount,
      distribution: finishCounts
    })

  } catch (error) {
    console.error('❌ Erreur:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
