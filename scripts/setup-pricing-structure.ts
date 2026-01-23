import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupPricingStructure() {
  console.log('💰 Setting up pricing structure...\n');

  try {
    // Create pricing table for product variants/options
    console.log('1️⃣ Creating pricing tables...\n');

    // Table for storing arm types
    const createArmTypesSQL = `
      CREATE TABLE IF NOT EXISTS product_arm_types (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subcategory_id UUID REFERENCES product_subcategories(id) ON DELETE CASCADE,
        arm_reference VARCHAR(50) NOT NULL,
        arm_name VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(subcategory_id, arm_reference)
      );
    `;

    // Table for advance options (depth)
    const createAdvancesSQL = `
      CREATE TABLE IF NOT EXISTS product_advances (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        arm_type_id UUID REFERENCES product_arm_types(id) ON DELETE CASCADE,
        advance_mm INT NOT NULL,
        min_price DECIMAL(10,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(arm_type_id, advance_mm)
      );
    `;

    // Table for width-based pricing tiers
    const createPricingTiersSQL = `
      CREATE TABLE IF NOT EXISTS product_pricing_tiers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        advance_id UUID REFERENCES product_advances(id) ON DELETE CASCADE,
        max_width_mm INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(advance_id, max_width_mm)
      );
    `;

    // Create indexes
    const createIndexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_arm_types_subcategory ON product_arm_types(subcategory_id);
      CREATE INDEX IF NOT EXISTS idx_advances_arm_type ON product_advances(arm_type_id);
      CREATE INDEX IF NOT EXISTS idx_pricing_tiers_advance ON product_pricing_tiers(advance_id);
    `;

    // Execute all table creations
    for (const sql of [createArmTypesSQL, createAdvancesSQL, createPricingTiersSQL, createIndexesSQL]) {
      await supabase.rpc('exec', { sql });
    }

    console.log('✓ Pricing tables created\n');

    // Get store-banne subcategory
    const { data: storeBanneSubcats } = await supabase
      .from('product_subcategories')
      .select('id, slug')
      .in('slug', ['coffre', 'semi-coffre', 'monoblocs', 'traditionnel']);

    console.log('2️⃣ Inserting arm types...');

    // Sample data from the tarif belharra.csv
    const armTypes = [
      { reference: '9000', name: 'Bras Réf. 9000', subcatSlug: 'coffre' },
      { reference: '9003', name: 'Bras Réf. 9003', subcatSlug: 'coffre' },
    ];

    for (const armType of armTypes) {
      const subcat = storeBanneSubcats?.find(s => s.slug === armType.subcatSlug);
      if (subcat) {
        await supabase
          .from('product_arm_types')
          .upsert({
            subcategory_id: subcat.id,
            arm_reference: armType.reference,
            arm_name: armType.name
          }, { onConflict: 'subcategory_id, arm_reference' });
      }
    }

    console.log('✓ Arm types inserted\n');

    console.log('3️⃣ Tarif structure created successfully!\n');
    console.log('📊 Tables created:');
    console.log('  • product_arm_types - Types de bras (9000, 9003, etc.)');
    console.log('  • product_advances - Avancées/profondeurs (1500, 2000, 2500, etc. mm)');
    console.log('  • product_pricing_tiers - Prix par plages de largeur\n');
    console.log('Structure:');
    console.log('  Subcategory (e.g., Coffre)');
    console.log('    └── Arm Type (e.g., Bras 9000)');
    console.log('        └── Advance (e.g., 1500mm)');
    console.log('            └── Price Tiers (width brackets)');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupPricingStructure();
