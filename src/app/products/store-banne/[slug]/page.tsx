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
      hero_title: 'Store HELiOM & HELiOM PLUS',
      hero_subtitle: 'Le coffre intégral haute performance pour une protection absolue',
      hero_tagline: 'Coffre Intégral',
      hero_text: "Le store HELiOM est conçu pour abriter intégralement la toile et les bras dans un coffre hermétique une fois refermé. Cette conception garantit une longévité maximale à vos composants face à la pollution et aux intempéries.",
      hero_points: [
        'Largeur : de 2 340 mm à 6 000 mm',
        'Avancée HELiOM : jusqu\'à 3 500 mm',
        'Avancée HELiOM PLUS : jusqu\'à 4 000 mm',
      ],
      sales_coefficient: 1.5,
       image_hero: null,
      min_width: 1800,
      max_width: 5500,
      min_projection: 800,
      max_projection: 3000,
      product_type: 'Standard',
       tags: ['Coffre Standard', 'Polyvalent', 'Économique'],
      comparison_table: {
        title: 'HELiOM vs HELiOM PLUS',
        headers: ['Caractéristiques', 'HELiOM', 'HELiOM PLUS'],
        rows: [
          { label: 'Type de Bras', values: ['Articulés standard', 'Bras renforcés haute performance'] },
          { label: 'Projection Max', values: ['3,50 m (8 choix)', '4,00 m (5 choix)'] },
          { label: 'Lambrequin Déroulant', values: ['Non disponible', 'Optionnel (Manuel ou Motorisé)'] },
          { label: 'Encombrement Coffre', values: ['Hauteur 288 mm x Profondeur 206 mm', 'Hauteur 288 mm x Profondeur 206 mm'] },
        ],
      },
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
      guarantees: [
        { years: 12, label: 'Garantie Armature' },
        { years: 10, label: 'Tenue du Laquage' },
        { years: 5, label: 'Moteur & Toile' },
      ],
      options_description: {
         LED: 'Éclairage LED optionnel pour vos soirées',
         Motorisation: 'Motorisation Somfy avec télécommande',
         Wind_Security: 'Sécurité vent optionnelle avec capteur',
         Colors: 'Large gamme de coloris disponibles',
      },
      options_cards: [
        {
          title: 'Éclairage LED',
          description: 'Bandeaux LED intégrés sous le coffre ou directement dans les bras pour illuminer vos soirées.',
        },
        {
          title: 'Motorisation Somfy',
          description: 'Pilotage par télécommande ou smartphone via la technologie io-homecontrol®.',
        },
        {
          title: 'Sécurité Vent',
          description: 'Capteur Eolis 3D qui remonte automatiquement le store en cas de rafales de vent.',
        },
        {
          title: 'Bi-Coloration',
          description: 'Personnalisez votre design en choisissant une couleur différente pour le coffre et les bras.',
        },
      ],
      certifications: ['QUALICOAT', 'QUALIMARINE'],
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
