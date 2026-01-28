import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function checkKissimyPrices() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement Supabase manquantes');
    console.error('URL:', supabaseUrl);
    console.error('Key:', supabaseKey ? 'Présente' : 'Manquante');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🔍 Vérification des données KISSIMY...\n');

  // 1. Vérifier le produit
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('slug', 'store-banne-kissimy')
    .single();

  if (productError || !product) {
    console.error('❌ Produit KISSIMY non trouvé !', productError);
    return;
  }

  console.log('✅ Produit trouvé:');
  console.log(`   ID: ${product.id}`);
  console.log(`   Nom: ${product.name}`);
  console.log(`   Coefficient de marge: ${product.sales_coefficient}`);
  console.log(`   Garantie: ${product.warranty_years} ans`);
  console.log();

  // 2. Vérifier les prix
  const { data: prices, error: pricesError } = await supabase
    .from('product_purchase_prices')
    .select('*')
    .eq('product_id', product.id)
    .order('projection', { ascending: true })
    .order('width_max', { ascending: true });

  if (pricesError) {
    console.error('❌ Erreur lors de la récupération des prix:', pricesError);
    return;
  }

  if (!prices || prices.length === 0) {
    console.error('❌ Aucun prix trouvé pour KISSIMY !');
    return;
  }

  console.log(`✅ ${prices.length} prix trouvés:\n`);
  console.log('┌──────────┬────────────┬────────────┐');
  console.log('│ Largeur  │ Projection │   Prix HT  │');
  console.log('├──────────┼────────────┼────────────┤');

  // Grouper par projection
  const projections = [...new Set(prices.map(p => p.projection))].sort((a, b) => a - b);
  
  projections.forEach(proj => {
    const pricesForProj = prices.filter(p => p.projection === proj);
    pricesForProj.forEach((price, index) => {
      if (index === 0) {
        console.log(`│ ${price.width_max.toString().padEnd(8)} │ ${proj.toString().padEnd(10)} │ ${price.price_ht.toFixed(2).padStart(9)} € │`);
      } else {
        console.log(`│ ${price.width_max.toString().padEnd(8)} │            │ ${price.price_ht.toFixed(2).padStart(9)} € │`);
      }
    });
    console.log('├──────────┼────────────┼────────────┤');
  });
  console.log('└──────────┴────────────┴────────────┘\n');

  // 3. Vérifier les projections disponibles
  console.log('📊 Projections disponibles:');
  projections.forEach(proj => {
    const count = prices.filter(p => p.projection === proj).length;
    console.log(`   - ${proj}mm : ${count} paliers de largeur`);
  });
  console.log();

  // 4. Vérifier les gammes de toiles
  const { data: fabrics } = await supabase
    .from('fabric_ranges')
    .select('*')
    .order('id');

  if (fabrics && fabrics.length > 0) {
    console.log('🎨 Gammes de toiles:');
    fabrics.forEach(fabric => {
      console.log(`   - ${fabric.name}: +${fabric.surcharge_price_m2}€/m² (marge: ${fabric.sales_coefficient})`);
    });
    console.log();
  }

  // 5. Vérifier les options
  const { data: options } = await supabase
    .from('product_options')
    .select('*')
    .order('id');

  if (options && options.length > 0) {
    console.log('⚙️ Options disponibles:');
    options.forEach(option => {
      console.log(`   - ${option.name} (${option.category}): ${option.purchase_price_ht}€ HT (marge: ${option.sales_coefficient})`);
    });
    console.log();
  }

  // 6. Vérifier les règles de transport
  const { data: shipping } = await supabase
    .from('shipping_rules')
    .select('*')
    .order('id');

  if (shipping && shipping.length > 0) {
    console.log('🚚 Règles de transport:');
    shipping.forEach(rule => {
      console.log(`   - ${rule.name}: ${rule.surcharge_price_ht}€ si largeur > ${rule.condition_min_width_mm}mm`);
    });
    console.log();
  }

  console.log('✅ Vérification terminée !');
}

checkKissimyPrices().catch(console.error);
