import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClientWithAuth } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

// Fonction pour vérifier si l'email est admin
function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const adminEmailsEnv = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  const allow = adminEmailsEnv.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return allow.includes(email.toLowerCase());
}

// Fonction pour vérifier si l'utilisateur est admin
async function isAdmin(req: NextRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    const supabase = getSupabaseClientWithAuth(token);
    if (!supabase) return false;

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return false;

    return isAdminEmail(user.email);
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

  // Extraire salesCoefficient ET name par modèle
  const modelCoefficients: { [key: string]: number } = {};
  const modelNames: { [key: string]: string } = {};
  
  // Regex pour capturer id, name et salesCoefficient d'un modèle
  // Utiliser [\s\S]*? pour traverser plusieurs lignes et objets imbriqués (non-greedy)
  const modelBlockRegex = /"([^"]+)":\s*\{[\s\S]*?id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?salesCoefficient:\s*([\d.]+)/g;
  let match;
  
  while ((match = modelBlockRegex.exec(content)) !== null) {
    const modelId = match[2];
    const modelName = match[3];
    const salesCoeff = parseFloat(match[4]);
    
    modelCoefficients[modelId] = salesCoeff;
    modelNames[modelId] = modelName;
  }

  // Extraire optionsCoefficients par modèle
  const modelOptionsCoefficients: { [key: string]: any } = {};
  
  // Regex pour capturer le bloc optionsCoefficients de chaque modèle
  // On cherche "model_id": { ... optionsCoefficients: { LED_ARMS: 2.0, ... } ... }
  const allModelsRegex = /"([^"]+)":\s*\{[\s\S]*?\}/g;
  const contentWithModels = content.match(/export const STORE_MODELS[\s\S]+?(?=\n\nexport|$)/);
  
  if (contentWithModels) {
    const modelsContent = contentWithModels[0];
    
    // Pour chaque modèle dans STORE_MODELS
    const modelEntryRegex = /"([^"]+)":\s*\{([\s\S]*?)(?=\n  "},?\n  "|"\w+": \{|$)/g;
    let modelMatch;
    
    while ((modelMatch = modelEntryRegex.exec(modelsContent)) !== null) {
      const modelId = modelMatch[1];
      const modelContent = modelMatch[2];
      
      // Chercher optionsCoefficients dans ce modèle
      const optionsBlockMatch = modelContent.match(/optionsCoefficients:\s*\{([^}]+)\}/);
      
      if (optionsBlockMatch) {
        const optionsStr = optionsBlockMatch[1];
        const optionsObj: any = {};
        
        // Parser chaque ligne d'option
        const optionLines = optionsStr.split(',');
        for (const line of optionLines) {
          const optMatch = line.trim().match(/(\w+):\s*([\d.]+)/);
          if (optMatch) {
            optionsObj[optMatch[1]] = parseFloat(optMatch[2]);
          }
        }
        
        if (Object.keys(optionsObj).length > 0) {
          modelOptionsCoefficients[modelId] = optionsObj;
        }
      }
    }
  }

  // Filtrer modelCoefficients pour ne garder que ceux différents du COEFF_MARGE global
  // Un produit n'est "personnalisé" que si son coefficient diffère du coefficient global
  const filteredModelCoefficients: { [key: string]: number } = {};
  const filteredModelNames: { [key: string]: string } = {};
  
  for (const [modelId, coeff] of Object.entries(modelCoefficients)) {
    if (Math.abs(coeff - COEFF_MARGE) > 0.001) { // Éviter les problèmes de précision float
      filteredModelCoefficients[modelId] = coeff;
      filteredModelNames[modelId] = modelNames[modelId];
    }
  }

  // Filtrer modelOptionsCoefficients pour ne garder que ceux qui ont au moins une option différente du global
  const filteredModelOptionsCoefficients: { [key: string]: any } = {};
  
  for (const [modelId, options] of Object.entries(modelOptionsCoefficients)) {
    let hasDifference = false;
    
    // Vérifier si au moins une option diffère du coefficient global
    for (const [optionKey, optionValue] of Object.entries(options)) {
      const globalValue = OPTIONS_COEFFICIENTS[optionKey as keyof typeof OPTIONS_COEFFICIENTS];
      if (Math.abs(optionValue - globalValue) > 0.001) {
        hasDifference = true;
        break;
      }
    }
    
    // Ne garder que si au moins une option est différente
    if (hasDifference) {
      filteredModelOptionsCoefficients[modelId] = options;
    }
  }

  return {
    COEFF_MARGE,
    OPTIONS_COEFFICIENTS,
    modelCoefficients: filteredModelCoefficients,
    modelNames: filteredModelNames,
    modelOptionsCoefficients: filteredModelOptionsCoefficients,
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
    const { COEFF_MARGE, OPTIONS_COEFFICIENTS, modelCoefficients, modelOptionsCoefficients } = body;

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
        // Utiliser [\s\S]*? pour capturer sur plusieurs lignes (non-greedy)
        const modelRegex = new RegExp(
          `(["']${modelId}["']:\\s*\\{[\\s\\S]*?salesCoefficient:\\s*)([\\d.]+)`,
          'g'
        );
        content = content.replace(modelRegex, `$1${coeff}`);
      }
    }

    // Mettre à jour optionsCoefficients par modèle
    if (modelOptionsCoefficients && typeof modelOptionsCoefficients === 'object') {
      for (const [modelId, options] of Object.entries(modelOptionsCoefficients)) {
        if (options && typeof options === 'object') {
          // Construire le bloc optionsCoefficients formaté
          const optionsEntries = Object.entries(options)
            .filter(([_, value]) => typeof value === 'number' && value > 0)
            .map(([key, value]) => `      ${key}: ${value}`)
            .join(',\n');

          if (optionsEntries) {
            const optionsBlock = `optionsCoefficients: {\n${optionsEntries}\n    }`;

            // Remplacer le bloc optionsCoefficients existant pour ce modèle
            // On recherche le bloc du modèle et son optionsCoefficients
            const modelBlockRegex = new RegExp(
              `(["']${modelId}["']:\\s*\\{[\\s\\S]*?)optionsCoefficients:\\s*\\{[^}]*\\}`,
              'g'
            );

            content = content.replace(modelBlockRegex, `$1${optionsBlock}`);
          }
        }
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
