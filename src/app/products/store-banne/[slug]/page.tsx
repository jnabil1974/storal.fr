import { Metadata } from 'next';
import StoreBanneConfigurator from '@/components/StoreBanneConfigurator';
import ProductPresentation from '@/components/ProductPresentation';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('sb_products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  return {
    title: `${product?.name || 'Store Banne'} - Configurateur de Prix | Storal.fr`,
    description: product?.description || 'Configurez votre store banne et obtenez un prix instantané selon vos dimensions.',
  };
}

export default async function StoreBanneProductPage({ params }: Props) {
  const { slug } = await params;
  let product = await getProductBySlug(slug);

  // Si le produit n'existe pas, créer un produit par défaut
  if (!product) {
    product = {
       id: 1,
       name: slug
         .split('-')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' '),
       slug: slug,
      description: `Configurateur de store banne ${slug}. Choisissez vos dimensions, motorisation et coloris.`,
      sales_coefficient: 1.5,
       image_hero: null,
      min_width: 1800,
      max_width: 5500,
      min_projection: 800,
      max_projection: 3000,
      product_type: 'Standard',
       tags: ['Coffre Standard', 'Polyvalent', 'Économique'],
      features: {
        arm_type: 'Articulés standard',
        coffre_height: 250,
        coffre_depth: 180,
        certifications: ['QUALICOAT'],
         good_value: true,
      },
      warranty: {
        armature: 10,
        paint: 8,
        motor: 3,
        fabric: 3,
      },
      options_description: {
         LED: 'Éclairage LED optionnel pour vos soirées',
         Motorisation: 'Motorisation Somfy avec télécommande',
         Wind_Security: 'Sécurité vent optionnelle avec capteur',
         Colors: 'Large gamme de coloris disponibles',
      },
    };
  }

  return (
    <div>
      {/* Section de présentation avec les détails du produit */}
      <ProductPresentation product={product} />

      {/* Section du configurateur de prix */}
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div id="configurateur" className="scroll-mt-24">
            <StoreBanneConfigurator product={product} productSlug={product.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
