'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ProductType } from '@/types/products';

export default function TestPaymentPage() {
  const router = useRouter();
  const { addItem, cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddTestProduct = async () => {
    setLoading(true);
    
    try {
      // Créer un produit de test de 10€
      const testPayload = {
        productId: 'test-payment-10-euros',
        productType: ProductType.STORE_BANNE,
        productName: '🧪 Test Paiement - Article de test',
        basePrice: 10.00,
        configuration: {
          width: 100,
          height: 100,
          color: 'Test',
          fabric: 'Test',
          options: {}
        },
        quantity: 1,
        pricePerUnit: 10.00
      };

      await addItem(testPayload);
      setAdded(true);
      
      // Attendre un peu puis rediriger vers le panier
      setTimeout(() => {
        router.push('/cart');
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Test de Paiement Réel
          </h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              ⚠️ ATTENTION : Paiement RÉEL avec clés LIVE
            </p>
            <p className="text-blue-700 text-sm mt-2">
              Ce test va créer une commande de <strong>10,00 €</strong> que vous devrez payer avec votre vraie carte bancaire.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Article de test</span>
              <span className="font-medium">1x</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Prix unitaire</span>
              <span className="font-medium">10,00 €</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Total à payer</span>
              <span className="text-blue-600">10,00 €</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddTestProduct}
              disabled={loading || added}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '⏳ Ajout en cours...' : added ? '✅ Ajouté ! Redirection...' : '🛒 Ajouter au panier et tester le paiement'}
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              ← Retour à l'accueil
            </button>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">
              📝 Étapes du test :
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-yellow-800 text-sm">
              <li>Cliquez sur "Ajouter au panier"</li>
              <li>Vous serez redirigé vers le panier</li>
              <li>Cliquez sur "Commander"</li>
              <li>Remplissez vos informations</li>
              <li>Payez avec votre vraie carte bancaire</li>
              <li>Vérifiez que le paiement passe en LIVE (pas TEST)</li>
            </ol>
          </div>

          {cart.items.length > 0 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                ✅ Vous avez déjà <strong>{cart.items.length} article(s)</strong> dans votre panier
              </p>
              <button
                onClick={() => router.push('/cart')}
                className="mt-2 text-green-700 font-medium hover:underline"
              >
                → Voir mon panier
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
