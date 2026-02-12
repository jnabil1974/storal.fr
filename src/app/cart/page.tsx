import { Suspense } from 'react';
import CartPageClient from './CartPageClient';

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100">
        <div className="bg-blue-600 text-white py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Mon Panier</h1>
          </div>
        </div>
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">Chargement du panier...</p>
          </div>
        </main>
      </div>
    }>
      <CartPageClient />
    </Suspense>
  );
}
