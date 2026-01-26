import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getProductCategoryBySlug, getSubcategoriesByCategorySlug } from '@/lib/categories';
import { getProducts } from '@/lib/database';

// Regenerate page every 60 seconds for fresh subcategory images
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ category: string; subcategory: string }> }): Promise<Metadata> {
  const { category, subcategory } = await params;
  const cat = await getProductCategoryBySlug(category);
  return {
    title: `${cat?.displayName || category} - ${subcategory}`,
    description: `Produits pour ${subcategory} dans ${cat?.displayName || category}`,
  };
}

export default async function SubcategoryPage({ params }: { params: Promise<{ category: string; subcategory: string }> }) {
  const { category, subcategory } = await params;
  const cat = await getProductCategoryBySlug(category);

  // Placeholder: fetch all products; in future, filter by subcategory mapping
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link href={`/products/${category}`} className="text-blue-600 hover:underline mb-4 inline-block">
            ← Retour à {cat?.displayName || category}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{cat?.displayName || category} — {subcategory}</h1>
          <p className="text-gray-600">Découvrez nos produits pour la sous-catégorie {subcategory}.</p>
        </div>

        {/* Products listing (placeholder, refine filtering later) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition h-full flex flex-col overflow-hidden">
                <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-600">Aucun produit pour cette sous-catégorie pour le moment.</div>
        )}
      </div>
    </div>
  );
}
