'use client';

import { useState } from 'react';

type ProductPageProps = {
  product: {
    id: number | string;
    name: string;
    slug: string;
    description: string;
    image_hero?: string;
    min_width?: number;
    max_width?: number;
    min_projection?: number;
    max_projection?: number;
    product_type?: string;
    tags?: any[];
    features?: any;
    warranty?: any;
    options_description?: any;
  };
};

export default function ProductPresentation({ product }: ProductPageProps) {
  const tags = Array.isArray(product.tags) ? product.tags : [];
  const features = product.features || {};
  const warranty = product.warranty || {};
  const optionsDesc = product.options_description || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-slate-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{product.name}</h1>
          <p className="text-lg opacity-90">{product.description}</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold border-b-4 border-orange-500 inline-block pb-2 mb-6">
              {product.product_type === 'HELiOM PLUS' ? 'La Protection Maximale' : 'La Protection Totale'}
            </h2>
            <p className="text-lg text-gray-700 mb-6">{product.description}</p>

            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Dimensions Disponibles :</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Largeur :</span>
                  <span className="font-bold text-orange-600">
                    {product.min_width} mm à {product.max_width} mm
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Avancée :</span>
                  <span className="font-bold text-orange-600">
                    jusqu'à {product.max_projection} mm
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            {product.image_hero ? (
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

        {/* Features Table (if comparing variants) */}
        {features.arm_type && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold border-b-4 border-orange-500 inline-block pb-2 mb-6">
              Caractéristiques Techniques
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <tbody>
                  <tr className="border-b-2 border-gray-200">
                    <td className="px-6 py-4 font-bold bg-gray-100">Type de Bras</td>
                    <td className="px-6 py-4">{features.arm_type}</td>
                  </tr>
                  <tr className="border-b-2 border-gray-200">
                    <td className="px-6 py-4 font-bold bg-gray-100">Coffre</td>
                    <td className="px-6 py-4">
                      {features.coffre_height} mm × {features.coffre_depth} mm
                    </td>
                  </tr>
                  {features.lambrequin && (
                    <tr className="border-b-2 border-gray-200">
                      <td className="px-6 py-4 font-bold bg-gray-100">Lambrequin</td>
                      <td className="px-6 py-4">{features.lambrequin}</td>
                    </tr>
                  )}
                  <tr className="border-b-2 border-gray-200">
                    <td className="px-6 py-4 font-bold bg-gray-100">Certifications</td>
                    <td className="px-6 py-4">
                      {Array.isArray(features.certifications)
                        ? features.certifications.join(', ')
                        : features.certifications}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Options/Equipment */}
        {Object.keys(optionsDesc).length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold border-b-4 border-orange-500 inline-block pb-2 mb-6">
              Équipements et Options Premium
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(optionsDesc).map(([key, description]) => (
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
        {Object.keys(warranty).length > 0 && (
          <section className="mb-12">
            <div className="border-2 border-green-600 rounded-lg p-8 flex justify-around flex-wrap gap-6">
              {Object.entries(warranty).map(([key, years]: [string, any]) => (
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

        {/* Certifications Footer */}
        {features.certifications && (
          <footer className="text-center py-8 border-t-2 border-gray-300">
            <p className="text-gray-600">
              Produit certifié{' '}
              <strong>
                {Array.isArray(features.certifications)
                  ? features.certifications.map((c: any) => `${c}®`).join(' et ')
                  : features.certifications}
              </strong>{' '}
              pour une résistance maximale à la corrosion.
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
