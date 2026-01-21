'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart, isLoading } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleRemove = async (id: string) => {
    await removeItem(id);
  };

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      await updateQuantity(id, newQuantity);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      setIsClearing(true);
      await clearCart();
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Mon Panier</h1>
          <p className="text-blue-100">{cart.totalItems} article(s)</p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">Votre panier est vide</p>
            <Link href="/">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Continuer vos achats
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Articles */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-6 flex gap-6">
                  {/* Product info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.productName}</h3>
                    <p className="text-sm text-gray-600 mb-4">Type: {item.productType}</p>

                    {/* Configuration display */}
                    {item.configuration && Object.keys(item.configuration).length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-4 text-sm">
                        <p className="font-semibold text-gray-800 mb-3">Options choisies:</p>
                        <ul className="space-y-2">
                          {Object.entries(item.configuration).map(([key, value]) => {
                            // Format key to readable label
                            const label = key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/_/g, ' ')
                              .charAt(0)
                              .toUpperCase() + key.slice(1);
                            
                            return (
                              <li key={key} className="flex justify-between text-gray-700">
                                <span className="font-medium">{label}:</span>
                                <span className="text-gray-900 font-semibold">
                                  {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Prix unitaire */}
                    <p className="text-lg font-bold text-blue-600">
                      {(Number(item.totalPrice) / Number(item.quantity)).toFixed(2)}€ /unité
                    </p>
                  </div>

                  {/* Quantité et actions */}
                  <div className="flex flex-col items-end justify-between">
                    {/* Quantité */}
                    <div className="flex items-center gap-2 mb-6">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                        }
                        disabled={isLoading}
                        className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Prix total */}
                    <div className="text-right mb-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {Number(item.totalPrice).toFixed(2)}€
                      </p>
                    </div>

                    {/* Supprimer */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Sous-total:</span>
                    <span className="font-semibold">{Number(cart.totalPrice).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Articles:</span>
                    <span className="font-semibold">{cart.totalItems}</span>
                  </div>
                </div>

                <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6">
                  <span>Total:</span>
                  <span className="text-blue-600">{Number(cart.totalPrice).toFixed(2)}€</span>
                </div>

                <Link href="/checkout">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-3">
                    Procéder au paiement
                  </button>
                </Link>

                <button
                  onClick={handleClearCart}
                  disabled={isClearing || isLoading}
                  className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
                >
                  Vider le panier
                </button>

                <Link href="/">
                  <button className="w-full mt-3 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
                    Continuer les achats
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
