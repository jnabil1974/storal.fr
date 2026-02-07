import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Charger le mapping des fichiers renommés
    const mappingPath = path.join(process.cwd(), 'data', 'matest-renamed-mapping.json')
    const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'))
    
    let updatedCount = 0
    const errors: string[] = []
    
    for (const item of mapping) {
      // Mettre à jour chaque couleur avec son nouveau chemin d'image
      const { error } = await supabase
        .from('matest_colors')
        .update({ image_url: item.new_path })
        .eq('ral_code', item.ral_code)
        .eq('finish', item.finish)
      
      if (error) {
        errors.push(`Erreur mise à jour ${item.ral_code} ${item.finish}: ${error.message}`)
      } else {
        updatedCount++
      }
    }
    
    return NextResponse.json({
      success: true,
      updated: updatedCount,
      total: mapping.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
