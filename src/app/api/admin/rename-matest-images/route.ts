import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST() {
  try {
    // Charger les données
    const dataPath = path.join(process.cwd(), 'data', 'matest-colors-from-pdf.json')
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    
    const brillantColors = data.items.filter((item: any) => item.finish === 'brillant' && item.ral_code)
    const sableColors = data.items.filter((item: any) => item.finish === 'sablé' && item.ral_code)
    
    const renamedFiles: any[] = []
    let successCount = 0
    const errors: string[] = []
    
    // Renommer les images brillantes
    for (let i = 0; i < brillantColors.length; i++) {
      const color = brillantColors[i]
      const pageNum = i < 26 ? 1 : 2
      const colorNum = i < 26 ? i + 1 : i - 25
      
      const oldPath = path.join(process.cwd(), 'public', 'images', 'matest', 'pdf-thumbs', `page-${pageNum}`, `color_${String(colorNum).padStart(2, '0')}.png`)
      const newName = `ral-${color.ral_code}-brillant.png`
      const newPath = path.join(process.cwd(), 'public', 'images', 'matest', 'pdf-thumbs', `page-${pageNum}`, newName)
      
      if (fs.existsSync(oldPath)) {
        try {
          fs.renameSync(oldPath, newPath)
          successCount++
          renamedFiles.push({
            ral_code: color.ral_code,
            finish: 'brillant',
            old_path: `/images/matest/pdf-thumbs/page-${pageNum}/color_${String(colorNum).padStart(2, '0')}.png`,
            new_path: `/images/matest/pdf-thumbs/page-${pageNum}/${newName}`
          })
        } catch (err) {
          errors.push(`Erreur renommage ${oldPath}: ${err}`)
        }
      }
    }
    
    // Renommer les images sablé
    for (let i = 0; i < sableColors.length; i++) {
      const color = sableColors[i]
      const colorNum = i + 1
      
      const oldPath = path.join(process.cwd(), 'public', 'images', 'matest', 'pdf-thumbs', 'page-3', `color_${String(colorNum).padStart(2, '0')}.png`)
      const newName = `ral-${color.ral_code}-sable.png`
      const newPath = path.join(process.cwd(), 'public', 'images', 'matest', 'pdf-thumbs', 'page-3', newName)
      
      if (fs.existsSync(oldPath)) {
        try {
          fs.renameSync(oldPath, newPath)
          successCount++
          renamedFiles.push({
            ral_code: color.ral_code,
            finish: 'sablé',
            old_path: `/images/matest/pdf-thumbs/page-3/color_${String(colorNum).padStart(2, '0')}.png`,
            new_path: `/images/matest/pdf-thumbs/page-3/${newName}`
          })
        } catch (err) {
          errors.push(`Erreur renommage ${oldPath}: ${err}`)
        }
      }
    }
    
    // Sauvegarder le mapping
    const mappingPath = path.join(process.cwd(), 'data', 'matest-renamed-mapping.json')
    fs.writeFileSync(mappingPath, JSON.stringify(renamedFiles, null, 2))
    
    return NextResponse.json({
      success: true,
      renamed: successCount,
      total: brillantColors.length + sableColors.length,
      errors: errors.length > 0 ? errors : undefined,
      mapping: renamedFiles
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
