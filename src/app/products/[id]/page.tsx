import { getProductById } from '@/lib/database';
import { ProductType } from '@/types/products';
import StoreBanneConfigurator from '@/components/StoreBanneConfigurator';
import PorteBlindeeConfigurator from '@/components/PorteBlindeeConfigurator';
import StoreAntichaleurConfigurator from '@/components/StoreAntichaleurConfigurator';
import { redirect } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  // Redirect to dedicated KISSIMY page
  if (id === 'kissimy') {
    redirect('/products/kissimy');
  }
  
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <a href="/" className="text-blue-600 hover:underline">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête produit */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-600">À partir de {product.basePrice}€</span>
            <span className="text-sm text-gray-500">(avant personnalisation)</span>
          </div>
        </div>

        {/* Configurateur en fonction du type */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {product.type === ProductType.STORE_BANNE && (
            <StoreBanneConfigurator
              productId={product.id}
              productName={product.name}
              basePrice={product.basePrice}
            />
          )}
          {product.type === ProductType.PORTE_BLINDEE && (
            <PorteBlindeeConfigurator
              productId={product.id}
              productName={product.name}
              basePrice={product.basePrice}
            />
          )}
          {product.type === ProductType.STORE_ANTICHALEUR && (
            <StoreAntichaleurConfigurator
              productId={product.id}
              productName={product.name}
              basePrice={product.basePrice}
            />
          )}
        </div>
      </div>
    </div>
  );
}
