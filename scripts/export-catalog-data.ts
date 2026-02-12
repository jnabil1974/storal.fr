/**
 * Script d'extraction des données du catalogue depuis Supabase
 * Usage: npx tsx scripts/export-catalog-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportCatalogData() {
  console.log('🔍 Extraction des données du catalogue...\n');

  // 1. Extraire toutes les toiles avec leurs types
  console.log('📦 Extraction des toiles...');
  const { data: fabrics, error: fabricsError } = await supabase
    .from('toile_colors')
    .select('*, toile_type:toile_types(*)')
    .order('ref', { ascending: true });

  if (fabricsError) {
    console.error('❌ Erreur extraction toiles:', fabricsError);
    process.exit(1);
  }

  console.log(`✅ ${fabrics?.length || 0} toiles extraites`);

  // 2. Extraire toutes les couleurs de coffre
  console.log('🎨 Extraction des couleurs RAL...');
  const { data: colors, error: colorsError } = await supabase
    .from('matest_colors')
    .select('*')
    .order('ral_code', { ascending: true });

  if (colorsError) {
    console.error('❌ Erreur extraction couleurs:', colorsError);
    process.exit(1);
  }

  console.log(`✅ ${colors?.length || 0} couleurs extraites`);

  // 3. Extraire les types de finitions
  console.log('✨ Extraction des types de finitions...');
  const { data: finishTypes, error: finishError } = await supabase
    .from('matest_finish_types')
    .select('*')
    .order('name', { ascending: true });

  if (finishError) {
    console.error('❌ Erreur extraction finitions:', finishError);
    process.exit(1);
  }

  console.log(`✅ ${finishTypes?.length || 0} types de finitions extraits\n`);

  // 4. Générer le fichier TypeScript
  const outputPath = path.join(process.cwd(), 'src/lib/static-catalog-data.ts');
  
  const fileContent = `/**
 * Données statiques du catalogue
 * 
 * ⚠️ FICHIER GÉNÉRÉ AUTOMATIQUEMENT
 * Ne pas modifier manuellement - utiliser \`npm run export-catalog\` pour mettre à jour
 * 
 * Dernière mise à jour : ${new Date().toISOString()}
 */

// ============================================
// TYPES
// ============================================

export interface ToileType {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  created_at: string;
}

export interface ToileColor {
  id: number;
  ref: string;
  name: string;
  collection: string | null;
  toile_type_id: number | null;
  image_url: string | null;
  price_coefficient: number | null;
  created_at: string;
  toile_type: ToileType | null;
}

export interface MatestColor {
  id: number;
  ral_code: string;
  name: string;
  finish: string;
  finish_type_id: number | null;
  image_url: string | null;
  is_standard: boolean;
  created_at: string;
}

export interface MatestFinishType {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  product_slug: string | null;
  created_at: string;
}

// ============================================
// DONNÉES - TOILES
// ============================================

export const STATIC_FABRICS: ToileColor[] = ${JSON.stringify(fabrics, null, 2)};

// ============================================
// DONNÉES - COULEURS RAL
// ============================================

export const STATIC_FRAME_COLORS: MatestColor[] = ${JSON.stringify(colors, null, 2)};

// ============================================
// DONNÉES - TYPES DE FINITIONS
// ============================================

export const STATIC_FINISH_TYPES: MatestFinishType[] = ${JSON.stringify(finishTypes, null, 2)};

// ============================================
// UTILITAIRES DE FILTRAGE
// ============================================

/**
 * Récupère les toiles filtrées par famille
 */
export function getFabricsByFamily(family: string): ToileColor[] {
  if (family === 'all') return STATIC_FABRICS;
  return STATIC_FABRICS.filter(f => f.collection?.toLowerCase().includes(family.toLowerCase()));
}

/**
 * Récupère les toiles Orchestra (toile principale)
 */
export function getOrchestraFabrics(): ToileColor[] {
  return STATIC_FABRICS.filter(f => 
    f.collection?.toLowerCase().includes('orchestra') && 
    !f.collection?.toLowerCase().includes('lambrequin')
  );
}

/**
 * Récupère les toiles MAX
 */
export function getMaxFabrics(): ToileColor[] {
  return STATIC_FABRICS.filter(f => f.collection?.toLowerCase().includes('max'));
}

/**
 * Récupère les toiles pour lambrequin
 */
export function getValanceFabrics(): ToileColor[] {
  return STATIC_FABRICS.filter(f => 
    f.collection?.toLowerCase().includes('lambrequin') ||
    f.collection?.toLowerCase().includes('soltis')
  );
}

/**
 * Récupère les couleurs standards
 */
export function getStandardColors(): MatestColor[] {
  return STATIC_FRAME_COLORS.filter(c => c.is_standard);
}

/**
 * Récupère les couleurs par type de finition
 */
export function getColorsByFinish(finishName: string): MatestColor[] {
  if (finishName === 'all') return STATIC_FRAME_COLORS;
  return STATIC_FRAME_COLORS.filter(c => c.finish === finishName);
}

/**
 * Récupère une toile par sa référence
 */
export function getFabricByRef(ref: string): ToileColor | undefined {
  return STATIC_FABRICS.find(f => f.ref === ref);
}

/**
 * Récupère une couleur par son code RAL
 */
export function getColorByRal(ralCode: string): MatestColor | undefined {
  return STATIC_FRAME_COLORS.find(c => c.ral_code === ralCode);
}

// ============================================
// STATISTIQUES
// ============================================

export const CATALOG_STATS = {
  totalFabrics: ${fabrics?.length || 0},
  totalColors: ${colors?.length || 0},
  standardColors: ${colors?.filter(c => c.is_standard).length || 0},
  finishTypes: ${finishTypes?.length || 0},
  lastUpdate: '${new Date().toISOString()}'
};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  
  console.log('✨ Fichier généré avec succès :');
  console.log(`   📁 ${outputPath}`);
  console.log('\n📊 Statistiques :');
  console.log(`   - ${fabrics?.length} toiles`);
  console.log(`   - ${colors?.length} couleurs RAL`);
  console.log(`   - ${colors?.filter(c => c.is_standard).length} couleurs standards`);
  console.log(`   - ${finishTypes?.length} types de finitions`);
  console.log('\n✅ Export terminé !');
}

// Exécution
exportCatalogData().catch(console.error);
