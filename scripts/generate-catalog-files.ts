#!/usr/bin/env ts-node
/**
 * Script de génération des fichiers catalogues statiques
 * Extrait les données de Supabase et génère des fichiers TypeScript
 * 
 * Usage: npx ts-node scripts/generate-catalog-files.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables SUPABASE manquantes dans .env.local');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// GÉNÉRATION DU CATALOGUE TOILES (VERSION COMPACTE)
// ============================================

async function generateToilesCatalog() {
  console.log('🎨 Génération du catalogue toiles (version compacte)...');

  // 1. Récupérer les types de toiles
  const { data: toileTypes, error: typesError } = await supabase
    .from('toile_types')
    .select('*')
    .order('id');

  if (typesError) {
    console.error('❌ Erreur récupération types:', typesError);
    return;
  }

  // 2. Récupérer toutes les couleurs disponibles
  const { data: toileColors, error: colorsError } = await supabase
    .from('toile_colors')
    .select('id, toile_type_id, ref, name, color_family, category')
    .eq('is_available', true)
    .order('toile_type_id')
    .order('ref');

  if (colorsError) {
    console.error('❌ Erreur récupération couleurs:', colorsError);
    return;
  }

  // 3. Grouper les références par type de toile
  const typeRefsMap = new Map<number, string[]>();
  const typeExamplesMap = new Map<number, Array<{ref: string, name: string, family: string}>>();
  
  toileColors?.forEach(color => {
    // Ajouter la référence
    if (!typeRefsMap.has(color.toile_type_id)) {
      typeRefsMap.set(color.toile_type_id, []);
      typeExamplesMap.set(color.toile_type_id, []);
    }
    typeRefsMap.get(color.toile_type_id)!.push(color.ref);
    
    // Garder quelques exemples pour la documentation
    const examples = typeExamplesMap.get(color.toile_type_id)!;
    if (examples.length < 10) {
      examples.push({ 
        ref: color.ref, 
        name: color.name, 
        family: color.color_family 
      });
    }
  });

  // 4. Créer les types enrichis avec les références
  const enrichedTypes = toileTypes?.map(type => ({
    ...type,
    available_refs: typeRefsMap.get(type.id) || [],
    ref_count: (typeRefsMap.get(type.id) || []).length,
    examples: typeExamplesMap.get(type.id) || []
  }));

  // 5. Générer le contenu TypeScript
  const totalRefs = toileColors?.length || 0;
  const content = `/**
 * Catalogue des toiles - Version compacte - Généré automatiquement depuis Supabase
 * Date de génération: ${new Date().toISOString()}
 * 
 * ⚠️ NE PAS MODIFIER MANUELLEMENT
 * Pour mettre à jour: npm run generate:catalogs
 * 
 * Structure optimisée : ${totalRefs} références groupées par ${toileTypes?.length || 0} types
 */

// ============================================
// INTERFACES
// ============================================

export interface ToileTypeCompact {
  id: number;
  name: string;
  manufacturer: string;
  code: string;
  purchase_price_ht: number;
  sales_coefficient: number;
  composition: string | null;
  description: string | null;
  compatible_categories: string[];
  is_active: boolean;
  // Liste des références disponibles (ex: ["U095", "6088", "7124", ...])
  available_refs: string[];
  ref_count: number;
  // Quelques exemples pour la documentation
  examples: Array<{ref: string, name: string, family: string}>;
}

// ============================================
// TYPES DE TOILES (${toileTypes?.length || 0} gammes, ${totalRefs} références)
// ============================================

export const TOILE_TYPES: ToileTypeCompact[] = ${JSON.stringify(enrichedTypes, null, 2)};

// ============================================
// HELPERS
// ============================================

/**
 * Récupère un type de toile par son code
 */
export function getToileTypeByCode(code: string): ToileTypeCompact | undefined {
  return TOILE_TYPES.find(t => t.code === code);
}

/**
 * Récupère un type de toile par son ID
 */
export function getToileTypeById(id: number): ToileTypeCompact | undefined {
  return TOILE_TYPES.find(t => t.id === id);
}

/**
 * Récupère un type de toile par son nom
 */
export function getToileTypeByName(name: string): ToileTypeCompact | undefined {
  return TOILE_TYPES.find(t => t.name.toLowerCase() === name.toLowerCase());
}

/**
 * Vérifie si une référence existe pour un type
 */
export function isRefAvailable(typeId: number, ref: string): boolean {
  const type = getToileTypeById(typeId);
  return type?.available_refs.includes(ref) || false;
}

/**
 * Récupère tous les types compatibles avec un produit
 */
export function getCompatibleToileTypes(productSlug: string): ToileTypeCompact[] {
  const upperSlug = productSlug.toUpperCase();
  return TOILE_TYPES.filter(t => 
    t.compatible_categories?.includes(upperSlug) || 
    t.compatible_categories?.includes('ALL')
  );
}

/**
 * Calcule le prix de vente TTC d'une toile (par m²)
 * Le prix ne dépend que du TYPE de toile, pas de la couleur
 */
export function calculateToilePriceTTC(
  typeIdOrCode: number | string, 
  surface_m2: number = 1, 
  tva: number = 1.20
): number {
  const type = typeof typeIdOrCode === 'number' 
    ? getToileTypeById(typeIdOrCode)
    : getToileTypeByCode(typeIdOrCode);
    
  if (!type) return 0;
  
  const priceHT = type.purchase_price_ht * type.sales_coefficient * surface_m2;
  return priceHT * tva;
}

/**
 * Récupère le nombre total de références disponibles
 */
export function getTotalRefsCount(): number {
  return TOILE_TYPES.reduce((sum, type) => sum + type.ref_count, 0);
}

/**
 * Récupère les types par fabricant
 */
export function getTypesByManufacturer(manufacturer: string): ToileTypeCompact[] {
  return TOILE_TYPES.filter(t => 
    t.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
}

/**
 * Génère un résumé pour le chatbot
 */
export function getToilesSummaryForChatbot(): string {
  return TOILE_TYPES.map(type => 
    \`- \${type.name} (\${type.manufacturer}): \${type.ref_count} références disponibles\n  Exemples: \${type.examples.slice(0, 5).map(e => \`\${e.ref} "\${e.name}"\`).join(', ')}\n  Prix: \${type.purchase_price_ht}€/m² HT × coeff \${type.sales_coefficient}\`
  ).join('\\n\\n');
}
`;

  // 4. Écrire le fichier
  const filePath = path.join(process.cwd(), 'src/lib/catalog-toiles.ts');
  fs.writeFileSync(filePath, content, 'utf-8');
  
  console.log(`✅ Fichier généré: ${filePath}`);
  console.log(`   - ${toileTypes?.length || 0} types de toiles`);
  console.log(`   - ${toileColors?.length || 0} couleurs de toiles`);
}

// ============================================
// GÉNÉRATION DU CATALOGUE COULEURS
// ============================================

async function generateCouleursCatalog() {
  console.log('\n🎨 Génération du catalogue couleurs...');

  // 1. Récupérer les types de finition
  const { data: finishTypes, error: finishError } = await supabase
    .from('matest_finish_types')
    .select('*')
    .order('id');

  if (finishError) {
    console.error('❌ Erreur récupération finitions:', finishError);
    return;
  }

  // 2. Récupérer toutes les couleurs (sans jointure)
  const { data: colors, error: colorsError } = await supabase
    .from('matest_colors')
    .select('*')
    .order('finish')
    .order('ral_code');

  if (colorsError) {
    console.error('❌ Erreur récupération couleurs:', colorsError);
    return;
  }

  // 3. Générer le contenu TypeScript
  const content = `/**
 * Catalogue des couleurs de structure (Matest) - Généré automatiquement depuis Supabase
 * Date de génération: ${new Date().toISOString()}
 * 
 * ⚠️ NE PAS MODIFIER MANUELLEMENT
 * Pour mettre à jour: npm run generate:catalogs
 */

// ============================================
// INTERFACES
// ============================================

export interface MatestFinishType {
  id: number;
  name: string;
  description: string | null;
  price_ht: number;
  image_url: string | null;
  product_slugs: string[];
  is_active: boolean;
}

export interface MatestColor {
  id: number;
  ral_code: string;
  name: string;
  hex_code: string;
  finish: string;
  category: string;
  image_url: string | null;
  swatch_url: string | null;
  is_available: boolean;
  is_standard: boolean;
  price_ht: number;
}

// ============================================
// TYPES DE FINITION (${finishTypes?.length || 0} finitions)
// ============================================

export const MATEST_FINISH_TYPES: MatestFinishType[] = ${JSON.stringify(finishTypes, null, 2)};

// ============================================
// COULEURS MATEST (${colors?.length || 0} références)
// ============================================

export const MATEST_COLORS: MatestColor[] = ${JSON.stringify(colors, null, 2)};

// ============================================
// COULEURS STANDARDS (Incluses sans supplément)
// ============================================

export const STANDARD_COLORS = MATEST_COLORS.filter(c => c.is_standard);

// ============================================
// HELPERS
// ============================================

/**
 * Récupère un type de finition par son nom
 */
export function getFinishTypeByName(name: string): MatestFinishType | undefined {
  return MATEST_FINISH_TYPES.find(f => f.name === name);
}

/**
 * Récupère un type de finition par son ID
 */
export function getFinishTypeById(id: number): MatestFinishType | undefined {
  return MATEST_FINISH_TYPES.find(f => f.id === id);
}

/**
 * Récupère les couleurs d'un type de finition
 */
export function getColorsByFinish(finishName: string): MatestColor[] {
  return MATEST_COLORS.filter(c => c.finish === finishName);
}

/**
 * Récupère les couleurs par catégorie
 */
export function getColorsByCategory(category: string): MatestColor[] {
  return MATEST_COLORS.filter(c => c.category === category);
}

/**
 * Récupère une couleur par son code RAL
 */
export function getColorByRAL(ralCode: string): MatestColor | undefined {
  return MATEST_COLORS.find(c => c.ral_code === ralCode);
}

/**
 * Récupère uniquement les couleurs standards (sans supplément)
 */
export function getStandardColors(): MatestColor[] {
  return STANDARD_COLORS;
}

/**
 * Calcule le prix total TTC d'une couleur + finition
 */
export function calculateColorPriceTTC(ralCode: string, tva: number = 1.20): number {
  const color = getColorByRAL(ralCode);
  if (!color) return 0;
  
  const finishType = getFinishTypeByName(color.finish);
  const finishPrice = finishType?.price_ht || 0;
  
  const totalHT = color.price_ht + finishPrice;
  return totalHT * tva;
}

/**
 * Récupère les couleurs compatibles avec un produit
 */
export function getCompatibleColors(productSlug: string): MatestColor[] {
  // Trouver les finitions compatibles avec ce produit
  const compatibleFinishes = MATEST_FINISH_TYPES
    .filter(f => f.product_slugs?.includes(productSlug))
    .map(f => f.name);
  
  // Retourner les couleurs de ces finitions
  return MATEST_COLORS.filter(c => compatibleFinishes.includes(c.finish));
}

/**
 * Vérifie si une couleur est disponible pour un produit en promo
 * (Les promos sont souvent limitées aux 3 couleurs standards)
 */
export function isColorAvailableForPromo(ralCode: string): boolean {
  const standardRals = ['9016', '1015', '7016']; // Blanc, Beige, Gris Anthracite
  return standardRals.includes(ralCode);
}

/**
 * Récupère le prix d'une finition
 */
export function getFinishPrice(finishName: string): number {
  const finish = getFinishTypeByName(finishName);
  return finish?.price_ht || 0;
}
`;

  // 4. Écrire le fichier
  const filePath = path.join(process.cwd(), 'src/lib/catalog-couleurs.ts');
  fs.writeFileSync(filePath, content, 'utf-8');
  
  console.log(`✅ Fichier généré: ${filePath}`);
  console.log(`   - ${finishTypes?.length || 0} types de finition`);
  console.log(`   - ${colors?.length || 0} couleurs Matest`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('🚀 Génération des catalogues statiques depuis Supabase\n');
  console.log('=' .repeat(60));
  
  try {
    await generateToilesCatalog();
    await generateCouleursCatalog();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Génération terminée avec succès !');
    console.log('\nFichiers générés:');
    console.log('  - src/lib/catalog-toiles.ts');
    console.log('  - src/lib/catalog-couleurs.ts');
    console.log('\n💡 Ces fichiers sont maintenant utilisables par le chatbot sans requêtes Supabase');
  } catch (error) {
    console.error('\n❌ Erreur lors de la génération:', error);
    process.exit(1);
  }
}

main();
