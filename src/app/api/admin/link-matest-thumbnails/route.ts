import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const dataPath = path.join(process.cwd(), 'data', 'matest-colors-from-pdf.json')
    const matestColors = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as {
      items: Array<{ ral_code: string | null; name: string | null; finish: string }>
    }

    let brilliantIndex = 0
    let sableIndex = 0
    let updated = 0

    for (const color of matestColors.items) {
      let imageUrl: string | null = null

      if (color.finish === 'brillant') {
        brilliantIndex += 1
        const page = brilliantIndex <= 26 ? 1 : 2
        const indexInPage = brilliantIndex <= 26 ? brilliantIndex : brilliantIndex - 26
        imageUrl = `/images/matest/pdf-thumbs/page-${page}/color_${String(indexInPage).padStart(2, '0')}.png`
      } else if (color.finish === 'sablé') {
        sableIndex += 1
        imageUrl = `/images/matest/pdf-thumbs/page-3/color_${String(sableIndex).padStart(2, '0')}.png`
      }

      if (!imageUrl) continue

      let query = supabase
        .from('matest_colors')
        .update({ image_url: imageUrl })
        .eq('finish', color.finish)

      if (color.ral_code) {
        query = query.eq('ral_code', color.ral_code)
      } else {
        query = query.is('ral_code', null)
      }

      if (color.name) {
        query = query.eq('name', color.name)
      } else {
        query = query.is('name', null)
      }

      const { error } = await query

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      updated += 1
    }

    return NextResponse.json({ success: true, updated })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
