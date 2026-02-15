/**
 * Script de test pour diagnostiquer l'API cart
 * Usage: npx tsx scripts/test-cart-api.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { createHash } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Convert a product ID string to a stable UUID v5 using crypto
 * This ensures kissimy-store-banne always gets the same UUID
 */
function productIdToUUID(productId: string): string {
  try {
    // Generate UUID v5 using SHA1 hash
    const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    const hash = createHash('sha1').update(NAMESPACE + productId).digest();
    
    // Format as UUID v5
    hash[6] = (hash[6] & 0x0f) | 0x50; // version
    hash[8] = (hash[8] & 0x3f) | 0x80; // variant
    
    const uuid = [
      hash.slice(0, 4).toString('hex'),
      hash.slice(4, 6).toString('hex'),
      hash.slice(6, 8).toString('hex'),
      hash.slice(8, 10).toString('hex'),
      hash.slice(10, 16).toString('hex'),
    ].join('-');
    
    console.log(`🔑 productIdToUUID: "${productId}" -> "${uuid}"`);
    return uuid;
  } catch (error) {
    console.error('❌ productIdToUUID failed:', error);
    return productId;
  }
}

async function testCartAPI() {
  console.log('🧪 Test de l\'API Cart');
  console.log('='.repeat(50));

  // Générer un sessionId de test
  const testSessionId = crypto.randomUUID();
  console.log('\n📝 SessionId de test:', testSessionId);

  // Test 1: Vérifier que la table existe
  console.log('\n1️⃣ Vérification de la table cart_items...');
  const { data: tableCheck, error: tableError } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true });

  if (tableError) {
    console.error('❌ Erreur:', tableError.message);
    console.error('Code:', tableError.code);
    return;
  }
  console.log('✅ Table cart_items existe et est accessible');

  // Test 2: Ajouter un item de test
  console.log('\n2️⃣ Ajout d\'un item de test...');
  const productId = 'store-kissimy';
  const productUUID = productIdToUUID(productId);
  
  const testItem = {
    session_id: testSessionId,
    product_id: productUUID, // UUID converti
    product_type: 'store_banne',
    product_name: 'Store Kissimy Test',
    base_price: 1500.00,
    configuration: {
      width: 5000,
      projection: 3000,
      motorized: true,
      frameColor: 'blanc',
      fabricColor: 'test-fabric'
    },
    quantity: 1,
    price_per_unit: 1650.00,
    total_price: 1650.00
  };

  const { data: insertData, error: insertError } = await supabase
    .from('cart_items')
    .insert([testItem])
    .select();

  if (insertError) {
    console.error('❌ Erreur lors de l\'insertion:', insertError.message);
    console.error('Code:', insertError.code);
    console.error('Details:', insertError.details);
    return;
  }

  console.log('✅ Item ajouté avec succès');
  console.log('📦 Données insérées:', JSON.stringify(insertData, null, 2));

  // Test 3: Récupérer les items par sessionId
  console.log('\n3️⃣ Récupération des items par sessionId...');
  const { data: cartItems, error: fetchError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', testSessionId);

  if (fetchError) {
    console.error('❌ Erreur lors de la récupération:', fetchError.message);
    return;
  }

  console.log('✅ Items récupérés:', cartItems?.length || 0);
  console.log('📦 Données:', JSON.stringify(cartItems, null, 2));

  // Test 4: Calculer les totaux
  console.log('\n4️⃣ Calcul des totaux...');
  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = cartItems?.reduce((sum, item) => sum + parseFloat(item.total_price), 0) || 0;
  
  console.log('📊 Total items:', totalItems);
  console.log('💰 Total price:', totalPrice.toFixed(2), '€');

  // Test 5: Nettoyer les données de test
  console.log('\n5️⃣ Nettoyage des données de test...');
  const { error: deleteError } = await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', testSessionId);

  if (deleteError) {
    console.error('❌ Erreur lors du nettoyage:', deleteError.message);
    return;
  }

  console.log('✅ Données de test supprimées');
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Tous les tests sont passés avec succès!');
}

testCartAPI().catch(err => {
  console.error('💥 Erreur fatale:', err);
  process.exit(1);
});
