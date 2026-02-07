import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const finish = formData.get('finish') as string
    const identifier = formData.get('identifier') as string // RAL code ou nom
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    if (!finish || !identifier) {
      return NextResponse.json({ error: 'Finition et identifiant requis' }, { status: 400 })
    }

    // Créer le nom de fichier basé sur l'identifiant
    const sanitizedId = identifier.toLowerCase().replace(/\s+/g, '-')
    const ext = path.extname(file.name)
    const fileName = `${sanitizedId}-${finish}${ext}`
    
    // Déterminer le dossier de destination
    let targetDir = 'page-1'
    if (finish === 'sablé') {
      targetDir = 'page-3'
    } else if (finish === 'brillant') {
      targetDir = 'page-2'
    }
    
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'matest', 'pdf-thumbs', targetDir)
    const filePath = path.join(uploadDir, fileName)
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    // Écrire le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    fs.writeFileSync(filePath, buffer)
    
    const imageUrl = `/images/matest/pdf-thumbs/${targetDir}/${fileName}`
    
    return NextResponse.json({
      success: true,
      imageUrl,
      fileName
    })
  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
