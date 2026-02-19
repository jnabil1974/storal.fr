import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { STORE_MODELS, getMinimumPrice, checkDeliveryConditions, getModelDimensions, getModelBySlug, getModelSlug, META_DESCRIPTIONS } from '@/lib/catalog-data';
import Link from 'next/link';
import Image from 'next/image';
import { Ruler, Shield, Truck, AlertCircle } from 'lucide-react';
import ImageCarousel from '@/components/ImageCarousel';
import InlineConfigurator from '@/components/InlineConfigurator';
import ExpertAdvice from '@/components/ExpertAdvice';
import ProductSchema from '@/components/ProductSchema';
import ProductSpecifications from '@/components/ProductSpecifications';
import ScrollToConfigurator from '@/components/ScrollToConfigurator';

/**
 * Génère les paramètres statiques pour toutes les pages produits
 * Next.js va pré-générer ces pages au moment du build
 */
export async function generateStaticParams() {
  return Object.values(STORE_MODELS).map((model) => ({
    slug: getModelSlug(model),
  }));
}

/**
 * Génère les métadonnées SEO dynamiques pour chaque produit
 * Utilise le nom et la description du catalogue
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const model = getModelBySlug(slug);

  if (!model) {
    return {
      title: 'Produit non trouvé - Storal',
      description: 'Ce produit n\'existe pas ou a été retiré de notre catalogue.',
    };
  }

  const minPrice = getMinimumPrice(model);
  const dimensions = getModelDimensions(model);

  // Utilise la méta-description SEO personnalisée si disponible, sinon génère automatiquement
  const metaDescription = META_DESCRIPTIONS[slug] || 
    `${model.description} Prix à partir de ${minPrice}€ TTC. Disponible de ${dimensions.minWidth}mm à ${dimensions.maxWidth}mm de large. ${model.features.slice(0, 3).join(' • ')}. Devis gratuit en ligne.`;

  return {
    title: `${model.name} - Store banne sur mesure | Storal`,
    description: metaDescription,
    keywords: [
      model.name,
      'store banne',
      'store sur mesure',
      model.marketingRange || '',
      ...model.features,
      model.type === 'coffre' ? 'store coffre' : '',
      model.type === 'monobloc' ? 'store monobloc' : '',
      'Storal',
    ].filter(Boolean),
    openGraph: {
      title: `${model.name} - À partir de ${minPrice}€ TTC`,
      description: metaDescription,
      images: [
        {
          url: model.image || '/images/stores/default.png',
          width: 1200,
          height: 630,
          alt: model.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${model.name} - Store banne sur mesure`,
      description: metaDescription,
      images: [model.image || '/images/stores/default.png'],
    },
  };
}

/**
 * Page produit dynamique (Server Component)
 */
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModelBySlug(slug);

  // Si le produit n'existe pas, afficher la page 404
  if (!model) {
    notFound();
  }

  const minPrice = getMinimumPrice(model);
  const dimensions = getModelDimensions(model);
  const deliveryAlert = checkDeliveryConditions(model, dimensions.maxWidth);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Données structurées JSON-LD pour Rich Snippets Google */}
      <ProductSchema productId={model.id} slug={slug} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <Link href="/gammes" className="hover:text-blue-600 transition-colors">
              Nos Gammes
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{model.name}</span>
          </nav>
        </div>
      </div>

      {/* ========================================
          BLOC 1 : HERO - VISUEL & PRIX
      ======================================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* CARROUSEL À GAUCHE */}
            <div>
              <ImageCarousel 
                productId={model.id} 
                productName={model.name}
                fallbackImage={model.image || undefined}
              />
            </div>

            {/* INFOS À DROITE */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex items-center gap-3">
                {model.marketingRange && (
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold text-sm">
                    {model.marketingRange.replace('GAMME_', '')}
                  </span>
                )}
                {model.is_promo && (
                  <span className="inline-flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
                    🔥 PROMO
                  </span>
                )}
              </div>

              {/* Nom du modèle */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3">
                  {model.name}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {model.description}
                </p>
              </div>

              {/* 3 POINTS FORTS */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                  Points Forts
                </h3>
                {model.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      ✓
                    </div>
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Prix minimum discret */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-600">À partir de</span>
                  <span className="text-2xl font-semibold text-gray-900">{minPrice}</span>
                  <span className="text-sm font-normal text-gray-500">€ TTC</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Prix pour les dimensions minimales
                </p>
              </div>

              {/* Bouton d'ancrage vers le configurateur */}
              <ScrollToConfigurator />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          BLOC 2 : DIMENSIONS ET CONFIGURATION SUR MESURE
      ======================================== */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-3">
              Dimensions et Configuration sur Mesure
            </h2>
            <p className="text-gray-600 text-lg">
              Toutes les dimensions disponibles et options de personnalisation pour votre projet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* DIMENSIONS MAX */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Ruler className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Dimensions</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600 font-medium">Largeur max</span>
                  <span className="text-2xl font-black text-blue-600">
                    {(dimensions.maxWidth / 1000).toFixed(1)}m
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600 font-medium">Avancée max</span>
                  <span className="text-2xl font-black text-blue-600">
                    {(dimensions.maxProjection / 1000).toFixed(1)}m
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Largeur min</span>
                  <span className="text-lg font-bold text-gray-700">
                    {(dimensions.minWidth / 1000).toFixed(2)}m
                  </span>
                </div>
              </div>
            </div>

            {/* TYPE DE COFFRE */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-purple-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Type de Store</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600 font-medium">Coffre</span>
                  <span className="text-lg font-bold text-gray-900 capitalize">
                    {model.shape === 'carre' ? '⬜ Carré' : '〰️ Galbé'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600 font-medium">Type</span>
                  <span className="text-lg font-bold text-gray-900 capitalize">
                    {model.type}
                  </span>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-purple-800 font-medium">
                    {model.type === 'coffre' && '✨ Protection intégrale de la toile'}
                    {model.type === 'monobloc' && '💰 Solution économique'}
                    {model.type === 'traditionnel' && '🎨 Charme authentique'}
                  </p>
                </div>
              </div>
            </div>

            {/* LIVRAISON */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Truck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Livraison</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-900 font-medium leading-relaxed">
                    {model.deliveryNote}
                  </p>
                </div>
                {deliveryAlert && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 font-medium">
                        {deliveryAlert}
                      </p>
                    </div>
                  </div>
                )}
                {!deliveryAlert && (
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-2xl">✓</span>
                    <span className="text-sm font-semibold">Livraison en une seule fois</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Options disponibles en grille */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span>⚙️</span>
              Options Premium et Personnalisations Disponibles
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border-2 ${model.compatibility.led_arms ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{model.compatibility.led_arms ? '✅' : '❌'}</span>
                  <span className={`font-bold ${model.compatibility.led_arms ? 'text-green-900' : 'text-gray-400'}`}>
                    LED Bras
                  </span>
                </div>
                <p className="text-xs text-gray-600">Éclairage intégré dans les bras</p>
              </div>

              <div className={`p-4 rounded-xl border-2 ${model.compatibility.led_box ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{model.compatibility.led_box ? '✅' : '❌'}</span>
                  <span className={`font-bold ${model.compatibility.led_box ? 'text-green-900' : 'text-gray-400'}`}>
                    LED Coffre
                  </span>
                </div>
                <p className="text-xs text-gray-600">Éclairage dans le caisson</p>
              </div>

              <div className={`p-4 rounded-xl border-2 ${model.compatibility.lambrequin_fixe ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{model.compatibility.lambrequin_fixe ? '✅' : '❌'}</span>
                  <span className={`font-bold ${model.compatibility.lambrequin_fixe ? 'text-green-900' : 'text-gray-400'}`}>
                    Lambrequin
                  </span>
                </div>
                <p className="text-xs text-gray-600">Lambrequin droit ou vague</p>
              </div>

              <div className={`p-4 rounded-xl border-2 ${model.compatibility.lambrequin_enroulable ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{model.compatibility.lambrequin_enroulable ? '✅' : '❌'}</span>
                  <span className={`font-bold ${model.compatibility.lambrequin_enroulable ? 'text-green-900' : 'text-gray-400'}`}>
                    Enroulable
                  </span>
                </div>
                <p className="text-xs text-gray-600">Lambrequin store dans store</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          BLOC 3 : MENTION PRÊT À POSER
      ======================================== */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 border-y border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl">
                🌟
              </div>
            </div>
            <div className="flex-1">
              {dimensions.maxWidth <= 6000 ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    100% Prêt à poser : Zéro réglage, zéro tracas !
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Contrairement aux modèles standards, votre store vous est livré <strong className="text-green-700">entièrement assemblé et paramétré</strong>. 
                    Plus besoin de passer du temps à ajuster les butées ou les fins de course — tout est déjà configuré en usine par nos techniciens. 
                    Vous n&apos;avez qu&apos;à le fixer au mur, et c&apos;est prêt !
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Prêt à poser pour dimensions ≤ 6m
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    <strong className="text-green-700">Si vous configurez une largeur de 6 mètres ou moins</strong>, votre store vous sera livré entièrement assemblé et paramétré. 
                    Plus besoin de passer du temps à ajuster les butées ou les fins de course — tout est déjà configuré en usine par nos techniciens. 
                    Vous n&apos;avez qu&apos;à le fixer au mur, et c&apos;est prêt !
                  </p>
                </>
              )}
              <div className="mt-4 flex items-center gap-2 text-green-700 font-semibold">
                <Truck className="w-5 h-5" />
                <span>Livraison rapide partout en France</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          BLOC 4 : FICHE TECHNIQUE & QUALITÉ
      ======================================== */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductSpecifications />
        </div>
      </section>

      {/* ========================================
          BLOC 5 : CONFIGURATEUR EXPRESS
      ======================================== */}
      <section id="configurateur" className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 border-y border-blue-100 scroll-mt-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <InlineConfigurator model={model} />
        </div>
      </section>

      {/* ========================================
          BLOC 6 : IMAGES TECHNIQUES / PERSONNALISÉES
      ======================================== */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-3">
              Plans d'Installation et Schémas de Montage
            </h2>
            <p className="text-gray-600 text-lg">
              Plans techniques détaillés pour comprendre l'encombrement, les fixations murales et l'inclinaison
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image 1 : Encombrement coffre */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📐</span>
                Dimensions du Coffre et Encombrement Mural
              </h3>
              <div className="relative aspect-video bg-white rounded-xl overflow-hidden border-2 border-gray-300">
                <Image
                  src={`/images/produits/${model.id}/tech/encombrement.jpg`}
                  alt={`Schéma technique encombrement coffre store banne ${model.name} - Dimensions et fixation murale`}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                Dimensions précises du coffre {model.shape === 'carre' ? 'carré' : 'galbé'} et 
                espace nécessaire pour l'installation murale ou plafond.
              </p>
            </div>

            {/* Image 2 : Inclinaison */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📏</span>
                Angle d'Inclinaison et Projection Maximale
              </h3>
              <div className="relative aspect-video bg-white rounded-xl overflow-hidden border-2 border-gray-300">
                <Image
                  src={`/images/produits/${model.id}/tech/inclinaison.jpg`}
                  alt={`Schéma technique inclinaison et projection store ${model.name} - Angle réglable et avancée maximale`}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                Angle d'inclinaison réglable et projection maximale de {(dimensions.maxProjection / 1000).toFixed(1)}m 
                pour une protection optimale.
              </p>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-blue-500 text-white p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-blue-900 mb-2">Besoin d'aide ?</h4>
                <p className="text-blue-800 leading-relaxed">
                  Nos experts sont disponibles pour vous conseiller sur les dimensions idéales 
                  et les options adaptées à votre projet. N'hésitez pas à nous contacter ou 
                  utilisez notre configurateur intelligent pour un devis instantané.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONSEILS D'EXPERT */}
      <ExpertAdvice />

      {/* CTA FINAL */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">
            Prêt à configurer votre {model.name} ?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Obtenez un devis personnalisé en quelques clics grâce à notre assistant intelligent. 
            Choisissez vos dimensions, couleurs et options en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href={`/assistant?model=${model.id}`}
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-lg py-5 px-10 rounded-xl transition-all shadow-2xl transform hover:scale-105"
            >
              🚀 Configurer maintenant
            </Link>
            <Link
              href="/gammes"
              className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-lg py-5 px-10 rounded-xl transition-all border-2 border-white/30"
            >
              Voir toutes les gammes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
