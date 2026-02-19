import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

// Fonction pour vérifier si l'utilisateur est admin
async function isAdmin(req: NextRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    return profile?.is_admin === true;
  } catch (error) {
    console.error('Erreur vérification admin:', error);
    return false;
  }
}

// Fonction pour lire les coefficients du fichier catalog-data.ts
function readCoefficients() {
  const catalogPath = path.join(process.cwd(), 'src/lib/catalog-data.ts');
  const content = fs.readFileSync(catalogPath, 'utf-8');

  // Extraire COEFF_MARGE
  const coeffMargeMatch = content.match(/COEFF_MARGE:\s*([\d.]+)/);
  const COEFF_MARGE = coeffMargeMatch ? parseFloat(coeffMargeMatch[1]) : 1.8;

  // Extraire OPTIONS_COEFFICIENTS
  const optionsMatch = content.match(/OPTIONS_COEFFICIENTS:\s*\{([\s\S]+?)\n\s*\}/);
  const OPTIONS_COEFFICIENTS: any = {
    LED_ARMS: 2.0,
    LED_CASSETTE: 2.0,
    LAMBREQUIN_FIXE: 1.5,
    LAMBREQUIN_ENROULABLE: 1.8,
    CEILING_MOUNT: 1.6,
    AUVENT: 1.7,
    FABRIC: 1.4,
    FRAME_COLOR_CUSTOM: 1.8,
    INSTALLATION: 1.3,
  };

  if (optionsMatch) {
    const optionsStr = optionsMatch[1];
    const lines = optionsStr.split('\n');
    for (const line of lines) {
      const match = line.match(/(\w+):\s*([\d.]+)/);
      if (match) {
        OPTIONS_COEFFICIENTS[match[1]] = parseFloat(match[2]);
      }
    }
  }

  // Extraire salesCoefficient par modèle
  const modelCoefficients: { [key: string]: number } = {};
  const modelRegex = /id:\s*['"]([^'"]+)['"][^}]*salesCoefficient:\s*([\d.]+)/g;
  let match;
  while ((match = modelRegex.exec(content)) !== null) {
    modelCoefficients[match[1]] = parseFloat(match[2]);
  }

  return {
    COEFF_MARGE,
    OPTIONS_COEFFICIENTS,
    modelCoefficients,
  };
}

// GET - Récupérer les coefficients actuels
export async function GET(req: NextRequest) {
  try {
    const coefficients = readCoefficients();
    return NextResponse.json(coefficients);
  } catch (error) {
    console.error('Erreur lecture coefficients:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des coefficients' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les coefficients
export async function PUT(req: NextRequest) {
  try {
    // Vérifier les permissions admin
    const admin = await isAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { COEFF_MARGE, OPTIONS_COEFFICIENTS, modelCoefficients } = body;

    // Validation
    if (typeof COEFF_MARGE !== 'number' || COEFF_MARGE <= 0) {
      return NextResponse.json(
        { error: 'COEFF_MARGE invalide' },
        { status: 400 }
      );
    }

    const catalogPath = path.join(process.cwd(), 'src/lib/catalog-data.ts');
    let content = fs.readFileSync(catalogPath, 'utf-8');

    // Mettre à jour COEFF_MARGE
    content = content.replace(
      /COEFF_MARGE:\s*[\d.]+/,
      `COEFF_MARGE: ${COEFF_MARGE}`
    );

    // Mettre à jour OPTIONS_COEFFICIENTS
    for (const [key, value] of Object.entries(OPTIONS_COEFFICIENTS)) {
      if (typeof value === 'number' && value > 0) {
        const regex = new RegExp(`(${key}:\\s*)([\\d.]+)`, 'g');
        content = content.replace(regex, `$1${value}`);
      }
    }

    // Mettre à jour salesCoefficient par modèle
    for (const [modelId, coeff] of Object.entries(modelCoefficients)) {
      if (typeof coeff === 'number' && coeff > 0) {
        // Rechercher le bloc du modèle et mettre à jour son salesCoefficient
        const modelRegex = new RegExp(
          `(id:\\s*['"]${modelId}['"][^}]*salesCoefficient:\\s*)([\\d.]+)`,
          'g'
        );
        content = content.replace(modelRegex, `$1${coeff}`);
      }
    }

    // Sauvegarder le fichier
    fs.writeFileSync(catalogPath, content, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Coefficients mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur mise à jour coefficients:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des coefficients' },
      { status: 500 }
    );
  }
}
