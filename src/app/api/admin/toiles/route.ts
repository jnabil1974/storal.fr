import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'toiles.json');

// Assurer que le dossier data existe
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Charger les toiles depuis le fichier JSON
async function loadToiles() {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, charger depuis le fichier TypeScript original
    const { DICKSON_TOILES } = await import('@/lib/dicksonToiles');
    await saveToiles(DICKSON_TOILES);
    return DICKSON_TOILES;
  }
}

// Sauvegarder les toiles dans le fichier JSON
async function saveToiles(toiles: any[]) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(toiles, null, 2), 'utf-8');
}

// GET - Récupérer toutes les toiles
export async function GET() {
  try {
    const toiles = await loadToiles();
    return NextResponse.json(toiles);
  } catch (error) {
    console.error('Erreur GET toiles:', error);
    return NextResponse.json({ error: 'Erreur chargement' }, { status: 500 });
  }
}

// POST - Ajouter une nouvelle toile
export async function POST(request: NextRequest) {
  try {
    const newToile = await request.json();
    const toiles = await loadToiles();

    // Vérifier que la référence n'existe pas déjà
    if (toiles.find((t: any) => t.ref === newToile.ref)) {
      return NextResponse.json(
        { error: 'Cette référence existe déjà' },
        { status: 400 }
      );
    }

    toiles.push(newToile);
    await saveToiles(toiles);

    return NextResponse.json({ success: true, toile: newToile });
  } catch (error) {
    console.error('Erreur POST toile:', error);
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 });
  }
}

// PUT - Modifier une toile existante
export async function PUT(request: NextRequest) {
  try {
    const updatedToile = await request.json();
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'Référence manquante' }, { status: 400 });
    }

    const toiles = await loadToiles();
    const index = toiles.findIndex((t: any) => t.ref === ref);

    if (index === -1) {
      return NextResponse.json({ error: 'Toile non trouvée' }, { status: 404 });
    }

    toiles[index] = updatedToile;
    await saveToiles(toiles);

    return NextResponse.json({ success: true, toile: updatedToile });
  } catch (error) {
    console.error('Erreur PUT toile:', error);
    return NextResponse.json({ error: 'Erreur modification' }, { status: 500 });
  }
}

// DELETE - Supprimer une toile
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'Référence manquante' }, { status: 400 });
    }

    const toiles = await loadToiles();
    const filteredToiles = toiles.filter((t: any) => t.ref !== ref);

    if (filteredToiles.length === toiles.length) {
      return NextResponse.json({ error: 'Toile non trouvée' }, { status: 404 });
    }

    await saveToiles(filteredToiles);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE toile:', error);
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
  }
}
