import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupProductOptions() {
  console.log('⚙️ Setting up product options...\n');

  try {
    // Create option groups table
    console.log('1️⃣ Creating option tables...');
    
    const createOptionGroupsSQL = `
      CREATE TABLE IF NOT EXISTS product_option_groups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        display_order INT DEFAULT 0,
        is_required BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const createOptionsSQL = `
      CREATE TABLE IF NOT EXISTS product_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID NOT NULL REFERENCES product_option_groups(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        description TEXT,
        price_adjustment DECIMAL(10,2) DEFAULT 0,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(group_id, slug)
      );
    `;

    const createProductOptionMappingSQL = `
      CREATE TABLE IF NOT EXISTS product_option_availability (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        option_id UUID NOT NULL REFERENCES product_options(id) ON DELETE CASCADE,
        price_override DECIMAL(10,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(product_id, option_id)
      );
    `;

    const createIndexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_option_groups_slug ON product_option_groups(slug);
      CREATE INDEX IF NOT EXISTS idx_options_group ON product_options(group_id);
      CREATE INDEX IF NOT EXISTS idx_option_availability_product ON product_option_availability(product_id);
    `;

    // Execute all
    for (const sql of [createOptionGroupsSQL, createOptionsSQL, createProductOptionMappingSQL, createIndexesSQL]) {
      await supabase.rpc('exec', { sql });
    }

    console.log('✓ Option tables created\n');

    // Insert option groups
    console.log('2️⃣ Creating option groups...');

    const optionGroups = [
      { name: 'Type de toile', slug: 'fabric', description: 'Choix de toile', required: true, order: 1 },
      { name: 'Motorisation', slug: 'motorization', description: 'Manuel ou motorisé', required: true, order: 2 },
      { name: 'Finitions', slug: 'finishes', description: 'Options de finition', required: false, order: 3 },
    ];

    for (const group of optionGroups) {
      await supabase
        .from('product_option_groups')
        .upsert({
          name: group.name,
          slug: group.slug,
          description: group.description,
          is_required: group.required,
          display_order: group.order
        }, { onConflict: 'slug' });
    }

    console.log('✓ Option groups created\n');

    // Get option groups for inserting options
    const { data: groups } = await supabase
      .from('product_option_groups')
      .select('id, slug');

    const groupMap = new Map(groups?.map(g => [g.slug, g.id]) || []);

    // Insert options
    console.log('3️⃣ Creating options...');

    const optionsData = [
      // Fabrics
      { group: 'fabric', name: 'Toile Acrylique Standard', slug: 'acrylic-standard', price: 0, order: 1 },
      { group: 'fabric', name: 'Toile Acrylique Premium', slug: 'acrylic-premium', price: 150, order: 2 },
      { group: 'fabric', name: 'Toile Microfibre', slug: 'microfiber', price: 250, order: 3 },
      { group: 'fabric', name: 'Toile Polyester Imperméable', slug: 'polyester-waterproof', price: 200, order: 4 },
      
      // Motorization
      { group: 'motorization', name: 'Manuel (chaîne)', slug: 'manual-chain', price: 0, order: 1 },
      { group: 'motorization', name: 'Motorisation standard', slug: 'motorized-standard', price: 350, order: 2 },
      { group: 'motorization', name: 'Motorisation + Télécommande', slug: 'motorized-remote', price: 500, order: 3 },
      
      // Finishes
      { group: 'finishes', name: 'Protection anti-UV renforcée', slug: 'uv-protection', price: 100, order: 1 },
      { group: 'finishes', name: 'Revêtement hydrophobe', slug: 'hydrophobic', price: 120, order: 2 },
      { group: 'finishes', name: 'Traitement ignifuge', slug: 'fireproof', price: 150, order: 3 },
    ];

    for (const opt of optionsData) {
      const groupId = groupMap.get(opt.group);
      if (groupId) {
        await supabase
          .from('product_options')
          .upsert({
            group_id: groupId,
            name: opt.name,
            slug: opt.slug,
            price_adjustment: opt.price,
            display_order: opt.order
          }, { onConflict: 'group_id, slug' });
      }
    }

    console.log('✓ Options created\n');

    // Display structure
    console.log('4️⃣ Verifying structure...\n');
    
    for (const group of groups || []) {
      const { data: opts } = await supabase
        .from('product_options')
        .select('name, price_adjustment')
        .eq('group_id', group.id)
        .order('display_order');

      console.log(`📁 ${group.slug.toUpperCase()}:`);
      opts?.forEach(o => {
        const price = o.price_adjustment > 0 ? ` (+${o.price_adjustment}€)` : '';
        console.log(`   • ${o.name}${price}`);
      });
      console.log('');
    }

    console.log('✅ Product options setup completed!');
    console.log('\n📊 Tables created:');
    console.log('  • product_option_groups - Groupes d\'options (Toile, Motorisation, Finitions)');
    console.log('  • product_options - Options avec prix additionnels');
    console.log('  • product_option_availability - Mapping produit → options disponibles');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupProductOptions();
