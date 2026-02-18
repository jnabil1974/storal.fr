import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateFolderNames() {
  console.log('🔄 Mise à jour des chemins d\'images dans Supabase...\n');

  // Mise à jour des 3 dossiers renommés
  const updates = [
    { old: '/DICKSON ORCHESTREA UNI/', new: '/DICKSON_ORCHESTREA_UNI/' },
    { old: '/ORCHESTRA MAX/', new: '/ORCHESTRA_MAX/' },
    { old: '/ORCHESTRA DECORS/', new: '/ORCHESTRA_DECORS/' },
  ];

  for (const update of updates) {
    console.log(`📝 Mise à jour: ${update.old} → ${update.new}`);
    
    // Compter les enregistrements à mettre à jour
    const { count: beforeCount } = await supabase
      .from('toile_colors')
      .select('*', { count: 'exact', head: true })
      .like('image_url', `%${update.old}%`);
    
    console.log(`   Trouvé: ${beforeCount} enregistrements`);

    if (beforeCount && beforeCount > 0) {
      // Récupérer les enregistrements
      const { data: records } = await supabase
        .from('toile_colors')
        .select('id, ref, image_url')
        .like('image_url', `%${update.old}%`);

      // Mettre à jour chaque enregistrement
      if (records) {
        for (const record of records) {
          const newUrl = record.image_url?.replace(update.old, update.new);
          if (newUrl && newUrl !== record.image_url) {
            const { error } = await supabase
              .from('toile_colors')
              .update({ image_url: newUrl })
              .eq('id', record.id);

            if (error) {
              console.error(`   ❌ Erreur pour ${record.ref}:`, error.message);
            } else {
              console.log(`   ✅ Mis à jour: ${record.ref}`);
            }
          }
        }
      }
    }
    console.log('');
  }

  console.log('✅ Mise à jour terminée !');
}

updateFolderNames().catch(console.error);
