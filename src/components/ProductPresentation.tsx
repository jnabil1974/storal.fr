'use client';
import { useState, useEffect } from 'react';

type ProductPageProps = {
  product: {
    id: number | string;
    name: string;
    slug: string;
    description: string;
    hero_title?: string;
    hero_subtitle?: string;
    hero_tagline?: string;
    hero_text?: string;
    hero_points?: any;
    image_hero?: string;
    img_store?: string[];
    min_width?: number;
    max_width?: number;
    min_projection?: number;
    max_projection?: number;
    product_type?: string;
    tags?: any[];
    features?: any;
    warranty?: any;
    options_description?: any;
    options_cards?: any;
    comparison_table?: any;
    guarantees?: any;
    certifications?: any;
  };
  showCarousel?: boolean;
};

export default function ProductPresentation({ product, showCarousel = false }: ProductPageProps) {
  const tags = Array.isArray(product.tags) ? product.tags : [];
  const features = product.features || {};
  const warranty = product.warranty || {};
  const optionsDesc = product.options_description || {};

  console.log('🎨 ProductPresentation loaded with:', {
    product: product.name,
    tags: tags.length,
    features: Object.keys(features).length,
    warranty: Object.keys(warranty).length,
    options: Object.keys(optionsDesc).length,
  });

  // Parser les données JSON si elles sont des strings
  const parsedTags = typeof product.tags === 'string'
    ? JSON.parse(product.tags)
    : (Array.isArray(product.tags) ? product.tags : []);
  const parsedFeatures = typeof product.features === 'string'
    ? JSON.parse(product.features)
    : (product.features || {});
  const parsedWarranty = typeof product.warranty === 'string'
    ? JSON.parse(product.warranty)
    : (product.warranty || {});
  const parsedOptions = typeof product.options_description === 'string'
    ? JSON.parse(product.options_description)
    : (product.options_description || {});
  const parsedHeroPoints = typeof product.hero_points === 'string'
    ? JSON.parse(product.hero_points)
    : (Array.isArray(product.hero_points) ? product.hero_points : []);
  const parsedOptionsCards = typeof product.options_cards === 'string'
    ? JSON.parse(product.options_cards)
    : (Array.isArray(product.options_cards) ? product.options_cards : []);
  const parsedComparison = typeof product.comparison_table === 'string'
    ? JSON.parse(product.comparison_table)
    : (product.comparison_table || null);
  const parsedGuarantees = typeof product.guarantees === 'string'
    ? JSON.parse(product.guarantees)
    : (Array.isArray(product.guarantees) ? product.guarantees : []);
  const parsedCertifications = typeof product.certifications === 'string'
    ? JSON.parse(product.certifications)
    : (Array.isArray(product.certifications) ? product.certifications : []);

  // Carousel logic
  const carouselImages = (product?.img_store || []).filter(Boolean);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  useEffect(() => {
    setCarouselIndex(0);
  }, [carouselImages.length]);

  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-slate-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
            {product.hero_title || product.name}
          </h1>
          <p className="text-lg opacity-90">
            {product.hero_subtitle || product.description}
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tags */}
       {parsedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
           {parsedTags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="bg-rose-100 text-rose-900 border border-rose-200 px-4 py-1 rounded-full text-sm font-bold uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Hero Section avec carousel à droite */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            {product.hero_tagline && (
              <span className="inline-block bg-rose-100 text-rose-900 border border-rose-200 px-4 py-1 rounded-full text-sm font-bold uppercase mb-4">
                {product.hero_tagline}
              </span>
            )}
            <h2 className="text-3xl font-bold border-b-4 border-rose-700 inline-block pb-2 mb-6">
              {product.hero_text ? 'La Protection Totale' : (product.product_type === 'HELiOM PLUS' ? 'La Protection Maximale' : 'La Protection Totale')}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              {product.hero_text || product.description}
            </p>

            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Dimensions Disponibles :</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Largeur :</span>
                  <span className="font-bold text-rose-800">
                    {product.min_width} mm à {product.max_width} mm
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Avancée :</span>
                  <span className="font-bold text-rose-800">
                    jusqu'à {product.max_projection} mm
                  </span>
                </li>
              </ul>

              {parsedHeroPoints.length > 0 && (
                <ul className="mt-4 list-disc list-inside text-gray-700">
                  {parsedHeroPoints.map((point: string, idx: number) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            {showCarousel && carouselImages.length > 0 ? (
              <div className="rounded-xl border border-gray-200 p-5 shadow-lg bg-white">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Galerie Photos</h2>
                <div className="relative w-full rounded-lg border border-gray-200 bg-gray-50 overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                  <button
                    type="button"
                    onClick={() => setZoomImage(carouselImages[carouselIndex])}
                    className="w-full h-full"
                    aria-label="Agrandir l'image"
                  >
                    <img
                      src={carouselImages[carouselIndex]}
                      alt={`${product.name} ${carouselIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {carouselImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg shadow hover:bg-white font-bold"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => setCarouselIndex((prev) => (prev + 1) % carouselImages.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg shadow hover:bg-white font-bold"
                      >
                        →
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {carouselImages.map((_, idx) => (
                          <span
                            key={`dot-${idx}`}
                            className={`h-2 w-2 rounded-full ${idx === carouselIndex ? 'bg-blue-600' : 'bg-white/80'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : product.image_hero ? (
              <img
                src={product.image_hero}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 italic">[ Schéma {product.name} ]</p>
              </div>
            )}
          </div>
        </section>

        {/* Comparison Table (if provided) */}
        {parsedComparison?.rows?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold border-b-4 border-rose-700 inline-block pb-2 mb-6">
              {parsedComparison.title || 'Comparatif'}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr>
                    {(parsedComparison.headers || []).map((header: string, idx: number) => (
                      <th key={idx} className="px-6 py-4 border border-gray-200 bg-gray-100 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(parsedComparison.rows || []).map((row: any, idx: number) => {
                    const label = Array.isArray(row) ? row[0] : row?.label;
                    const rawValues = Array.isArray(row)
                      ? row.slice(1)
                      : Array.isArray(row?.values)
                        ? row.values
                        : row?.values != null
                          ? [row.values]
                          : [];

                    return (
                      <tr key={idx} className="border-b-2 border-gray-200">
                        <td className="px-6 py-4 font-bold bg-gray-50">{label}</td>
                        {rawValues.map((value: string, valueIdx: number) => (
                          <td key={valueIdx} className="px-6 py-4">{value}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Features Table fallback */}
        {!parsedComparison?.rows?.length && parsedFeatures.arm_type && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold border-b-4 border-rose-700 inline-block pb-2 mb-6">
              Caractéristiques Techniques
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <tbody>
                  <tr className="border-b-2 border-gray-200">
                    <td className="px-6 py-4 font-bold bg-gray-100">Type de Bras</td>
                     <td className="px-6 py-4">{parsedFeatures.arm_type}</td>
                  </tr>
                  <tr className="border-b-2 border-gray-200">
                    <td className="px-6 py-4 font-bold bg-gray-100">Coffre</td>
                    <td className="px-6 py-4">
                       {parsedFeatures.coffre_height} mm × {parsedFeatures.coffre_depth} mm
                    </td>
                  </tr>
                   {parsedFeatures.lambrequin && (
                    <tr className="border-b-2 border-gray-200">
                      <td className="px-6 py-4 font-bold bg-gray-100">Lambrequin</td>
                       <td className="px-6 py-4">{parsedFeatures.lambrequin}</td>
                    </tr>
                  )}
                  <tr className="border-b-2 border-gray-200">
                    <td className="px-6 py-4 font-bold bg-gray-100">Certifications</td>
                    <td className="px-6 py-4">
                       {Array.isArray(parsedFeatures.certifications)
                         ? parsedFeatures.certifications.join(', ')
                         : parsedFeatures.certifications}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Options/Equipment */}
        {(parsedOptionsCards.length > 0 || Object.keys(parsedOptions).length > 0) && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold border-b-4 border-rose-700 inline-block pb-2 mb-6">
              Équipements et Options Premium
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parsedOptionsCards.length > 0
                ? parsedOptionsCards.map((card: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-lg border-t-4 border-slate-800">
                      <h4 className="font-bold text-lg mb-3 text-slate-800">
                        {card.title}
                      </h4>
                      <p className="text-gray-700">{card.description}</p>
                    </div>
                  ))
                : Object.entries(parsedOptions).map(([key, description]) => (
                    <div key={key} className="bg-slate-50 p-6 rounded-lg border-t-4 border-slate-800">
                      <h4 className="font-bold text-lg mb-3 text-slate-800">
                        {key.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-gray-700">{String(description)}</p>
                    </div>
                  ))}
            </div>
          </section>
        )}

        {/* Warranty */}
        {(parsedGuarantees.length > 0 || Object.keys(parsedWarranty).length > 0) && (
          <section className="mb-12">
            <div className="border-2 border-green-600 rounded-lg p-8 flex justify-around flex-wrap gap-6">
              {parsedGuarantees.length > 0
                ? parsedGuarantees.map((item: any, idx: number) => (
                    <div key={idx} className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {item.years} <span className="text-xl">ANS</span>
                      </div>
                      <div className="text-gray-700 font-semibold">{item.label}</div>
                    </div>
                  ))
                : Object.entries(parsedWarranty).map(([key, years]: [string, any]) => (
                    <div key={key} className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {years} <span className="text-xl">ANS</span>
                      </div>
                      <div className="text-gray-700 font-semibold">
                        {key === 'armature'
                          ? 'Garantie Armature'
                          : key === 'paint'
                          ? 'Tenue du Laquage'
                          : key === 'motor'
                          ? 'Moteur'
                          : key === 'fabric'
                          ? 'Toile'
                          : key}
                      </div>
                    </div>
                  ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal Zoom Image */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <button
            onClick={() => setZoomImage(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            aria-label="Fermer"
          >
            ×
          </button>
          <img
            src={zoomImage}
            alt="Image agrandie"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
