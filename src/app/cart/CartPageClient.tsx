'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { STORE_MODELS, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';
import { Tag, X, Lock } from 'lucide-react';

export default function CartPageClient() {
  const { cart, removeItem, updateQuantity, clearCart, applyPromoCode, removePromoCode, isLoading } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleRemove = async (id: string) => {
    console.log('🗑️ Removing item:', id);
    await removeItem(id);
  };

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      console.log('🔢 Updating quantity:', id, newQuantity);
      await updateQuantity(id, newQuantity);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      setIsClearing(true);
      console.log('🧹 Clearing cart...');
      await clearCart();
      setIsClearing(false);
    }
  };

  const handleApplyPromo = () => {
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoError('');
    } else {
      setPromoError('Code promo invalide');
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoInput('');
    setPromoError('');
  };

  // Format configuration for display
  const formatConfigValue = (key: string, value: any): string => {
    // Les dimensions du store (width, depth, projection) sont stockées en cm
    if (key === 'width' && typeof value === 'number') {
      return `${(value / 100).toFixed(2)} m`;
    }
    if (key === 'projection' || key === 'depth') {
      return `${(value / 100).toFixed(2)} m`;
    }
    // Les dimensions de terrasse sont aussi en cm
    if (key === 'terraceLength' || key === 'terraceWidth') {
      return `${(value / 100).toFixed(2)} m`;
    }
    // La hauteur de pose est déjà en mètres
    if (key === 'installHeight' && typeof value === 'number') {
      return `${value.toFixed(2)} m`;
    }
    if (typeof value === 'boolean') {
      return value ? '✓ Oui' : '✗ Non';
    }
    return String(value);
  };

  const formatConfigKey = (key: string): string => {
    const labels: { [key: string]: string } = {
      width: 'Largeur store',
      depth: 'Profondeur store',
      projection: 'Avancée',
      motorized: 'Motorisé',
      fabric: 'Tissu',
      fabricColor: 'Couleur toile',
      frameColor: 'Couleur armature',
      armType: 'Type d\'armature',
      windSensor: 'Capteur vent',
      rainSensor: 'Capteur pluie',
      model: 'Modèle',
      color: 'Couleur',
      motorSide: 'Côté moteur',
      sensor: 'Capteurs',
      ledArms: 'LED bras',
      ledBox: 'LED coffre',
      lambrequin: 'Lambrequin',
      lambrequinMotorized: 'Lambrequin motorisé',
      terraceLength: 'Longueur terrasse',
      terraceWidth: 'Largeur terrasse',
      environment: 'Environnement',
      orientation: 'Orientation',
      installHeight: 'Hauteur de pose',
      cableExit: 'Sortie de câble',
      obstacles: 'Obstacles',
    };
    return labels[key] || key;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            🛒 Mon Panier
          </h1>
          <p className="text-blue-100 text-lg">
            {cart.totalItems > 0 
              ? `${cart.totalItems} article${cart.totalItems > 1 ? 's' : ''} dans votre panier`
              : 'Votre panier est vide'
            }
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {(isLoading && cart.items.length === 0) ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Chargement du panier...</p>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-gray-600 text-2xl font-semibold mb-4">
              Votre panier est vide
            </p>
            <p className="text-gray-500 mb-8">
              Commencez votre configuration avec notre assistant intelligent
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/assistant">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-xl">
                  🤖 Assistant de configuration
                </button>
              </Link>
              <Link href="/">
                <button className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold">
                  🏠 Retour à l'accueil
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Articles */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item, index) => {
                // 🔧 Récupérer modelId depuis configuration.modelId (ID original) ou fallback sur productId
                const modelId = item.configuration?.modelId || item.productId as string;
                
                const modelData = modelId && STORE_MODELS[modelId as keyof typeof STORE_MODELS] 
                  ? STORE_MODELS[modelId as keyof typeof STORE_MODELS]
                  : null;
                const productImage = modelData?.image;

                return (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      {productImage ? (
                        <div className="flex-shrink-0">
                          <div className="w-40 h-40 relative rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <Image
                              src={productImage}
                              alt={item.productName || 'Produit'}
                              fill
                              className="object-cover"
                              sizes="160px"
                              onError={(e) => {
                                console.error('❌ Erreur chargement image modèle:', productImage);
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0">
                          <div className="w-40 h-40 relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-4xl">📦</span>
                          </div>
                        </div>
                      )}

                      {/* Product info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {item.productName || 'Store Banne'}
                            </h3>
                            <p className="text-sm text-gray-700 bg-blue-50 inline-block px-3 py-1 rounded-full font-semibold">
                              {item.productType || 'Store'}
                            </p>
                          </div>
                        </div>

                        {/* Configuration */}
                        {item.configuration && Object.keys(item.configuration).length > 0 && (
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg mb-4">
                            <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                              ⚙️ Configuration
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              {Object.entries(item.configuration).map(([key, value]) => {
                                if (!value || key === 'id') return null;
                                return (
                                  <div key={key} className="flex justify-between items-center">
                                    <span className="text-gray-700">{formatConfigKey(key)}:</span>
                                    <span className="font-semibold text-gray-900">
                                      {formatConfigValue(key, value)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Aperçu visuel */}
                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 p-4 rounded-lg mb-4">
                          <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            🎨 Aperçu visuel
                          </p>
                          <div className="flex gap-4 flex-wrap">
                            {/* Couleur coffre */}
                            {item.configuration?.frameColor && (() => {
                              const frameColor = FRAME_COLORS.find(c => c.id === item.configuration.frameColor);
                              return frameColor ? (
                                <div key="frame" className="flex flex-col items-center gap-2">
                                  <div className="w-20 h-20 rounded-lg border-2 border-gray-300 shadow-md relative overflow-hidden bg-gray-100">
                                    {frameColor.image_url ? (
                                      <Image 
                                        src={frameColor.image_url} 
                                        alt={frameColor.name} 
                                        fill 
                                        className="object-cover"
                                        sizes="80px"
                                        onError={(e) => {
                                          // Fallback: afficher la couleur hex en cas d'erreur
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          if (target.parentElement) {
                                            target.parentElement.style.backgroundColor = frameColor.hex;
                                          }
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full" style={{ backgroundColor: frameColor.hex }}></div>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-700 text-center font-medium max-w-[80px]">
                                    Coffre<br/>{frameColor.name.split('(')[0].trim()}
                                  </span>
                                </div>
                              ) : null;
                            })()}
                            
                            {/* Couleur toile */}
                            {item.configuration?.fabricColor && (() => {
                              const fabric = FABRICS.find(f => f.id === item.configuration.fabricColor);
                              return fabric && fabric.image_url ? (
                                <div key="fabric" className="flex flex-col items-center gap-2">
                                  <div className="w-20 h-20 rounded-lg border-2 border-gray-300 shadow-md bg-gray-100 relative overflow-hidden">
                                    <Image 
                                      src={fabric.image_url} 
                                      alt={fabric.name} 
                                      fill 
                                      className="object-cover"
                                      sizes="80px"
                                      onError={(e) => {
                                        console.error('❌ Erreur chargement image toile:', fabric.image_url);
                                        // Fallback en cas d'erreur de chargement
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-700 text-center font-medium max-w-[80px]">
                                    Toile<br/>{fabric.name}
                                  </span>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        </div>

                        {/* Informations de pose */}
                        {(item.configuration?.terraceLength || item.configuration?.terraceWidth || 
                          item.configuration?.environment || item.configuration?.orientation || 
                          item.configuration?.installHeight || item.configuration?.cableExit || 
                          item.configuration?.obstacles) && (
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4 rounded-lg mb-4">
                            <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                              📋 Informations de pose
                            </p>
                            <div className="space-y-2 text-sm">
                              {item.configuration.terraceLength && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700">Longueur terrasse:</span>
                                  <span className="font-semibold text-gray-900">
                                    {(item.configuration.terraceLength / 100).toFixed(2)} m
                                  </span>
                                </div>
                              )}
                              {item.configuration.terraceWidth && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700">Largeur terrasse:</span>
                                  <span className="font-semibold text-gray-900">
                                    {(item.configuration.terraceWidth / 100).toFixed(2)} m
                                  </span>
                                </div>
                              )}
                              {item.configuration.environment && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700">Environnement:</span>
                                  <span className="font-semibold text-gray-900">{item.configuration.environment}</span>
                                </div>
                              )}
                              {item.configuration.orientation && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700">Orientation:</span>
                                  <span className="font-semibold text-gray-900">{item.configuration.orientation}</span>
                                </div>
                              )}
                              {item.configuration.installHeight && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700">Hauteur de pose:</span>
                                  <span className="font-semibold text-gray-900">
                                    {Number(item.configuration.installHeight).toFixed(2)} m
                                  </span>
                                </div>
                              )}
                              {item.configuration.cableExit && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700">Sortie de câble:</span>
                                  <span className="font-semibold text-gray-900">{item.configuration.cableExit}</span>
                                </div>
                              )}
                              {item.configuration.obstacles && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700">Obstacles:</span>
                                  <span className="font-semibold text-gray-900">{item.configuration.obstacles}</span>
                                </div>
                              )}
                              {(item.configuration.ledArms || item.configuration.ledBox) && (
                                <div className="pt-2 border-t border-blue-200">
                                  <span className="text-gray-700 font-semibold">Options éclairage:</span>
                                  <ul className="mt-1 space-y-1 ml-4">
                                    {item.configuration.ledArms && (
                                      <li className="text-gray-900">✓ LED intégré dans les bras</li>
                                    )}
                                    {item.configuration.ledBox && (
                                      <li className="text-gray-900">✓ LED coffre</li>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Garanties */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg mb-4">
                          <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            🛡️ Garanties incluses
                          </p>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-center gap-2">
                              <span className="text-green-600 font-bold">✓</span>
                              <span><strong>Structure:</strong> 12 ans</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-600 font-bold">✓</span>
                              <span><strong>Motorisation:</strong> 5 ans</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-600 font-bold">✓</span>
                              <span><strong>Toile:</strong> 5 ans</span>
                            </li>
                          </ul>
                        </div>

                        {/* Prix et quantité */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          {/* Prix */}
                          <div>
                            <p className="text-sm text-gray-700 font-medium">Prix unitaire</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {Number(item.pricePerUnit).toFixed(2)}€
                            </p>
                          </div>

                          {/* Quantité */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={isLoading || item.quantity <= 1}
                              className="w-10 h-10 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl transition"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                if (val > 0) handleQuantityChange(item.id, val);
                              }}
                              disabled={isLoading}
                              className="w-20 h-10 text-center text-gray-900 border-2 border-gray-300 rounded-lg font-bold text-lg focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isLoading}
                              className="w-10 h-10 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl transition"
                            >
                              +
                            </button>
                          </div>

                          {/* Total */}
                          <div className="text-right">
                            <p className="text-sm text-gray-700 font-medium">Total</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {Number(item.totalPrice).toFixed(2)}€
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-800 hover:underline disabled:opacity-50 font-semibold flex items-center gap-2 transition"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  📋 Résumé
                </h2>

                {/* Code Promo */}
                <div className="mb-6 pb-6 border-b-2 border-gray-200">
                  <label className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                    <Tag className="w-5 h-5 text-orange-600" />
                    Code Promo
                  </label>
                  
                  {!cart.promoCode ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value.toUpperCase());
                            setPromoError('');
                          }}
                          placeholder="Entrez votre code"
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none font-mono font-bold text-gray-900"
                          maxLength={20}
                        />
                        <button
                          onClick={handleApplyPromo}
                          disabled={!promoInput.trim()}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors"
                        >
                          Appliquer
                        </button>
                      </div>
                      {promoError && (
                        <div className="text-red-600 text-sm font-semibold">❌ {promoError}</div>
                      )}
                      <div className="text-xs text-gray-500">
                        💡 Utilisez le code <span className="font-mono font-bold text-orange-600">STORAL5</span> pour -5%
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-green-800 font-bold flex items-center gap-2">
                            ✅ Code <span className="font-mono">{cart.promoCode}</span> appliqué
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            -5% sur votre commande
                          </div>
                        </div>
                        <button
                          onClick={handleRemovePromo}
                          className="p-2 hover:bg-green-100 rounded-full transition-colors"
                          aria-label="Retirer le code promo"
                        >
                          <X className="w-5 h-5 text-green-700" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="text-lg">Sous-total:</span>
                    <span className="font-bold text-xl">{Number(cart.totalPrice).toFixed(2)}€</span>
                  </div>
                  
                  {cart.promoCode && cart.discount && (
                    <div className="flex justify-between items-center text-green-700">
                      <span className="text-lg font-semibold">Code {cart.promoCode}:</span>
                      <span className="font-bold text-xl">-{cart.discount.toFixed(2)}€</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="text-lg">Articles:</span>
                    <span className="font-bold text-xl">{cart.totalItems}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="text-lg">🚚 Livraison spécialisée:</span>
                    <span className="font-bold text-green-600">INCLUSE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-3xl font-bold text-gray-900 mb-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {(cart.totalPrice - (cart.discount || 0)).toFixed(2)}€
                  </span>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-lg font-bold hover:shadow-xl transition text-lg">
                      ✓ Procéder au paiement
                    </button>
                  </Link>

                  <button
                    onClick={handleClearCart}
                    disabled={isClearing || isLoading}
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
                  >
                    🗑️ Vider le panier
                  </button>

                  <Link href="/assistant" className="block">
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                      🤖 Continuer la configuration
                    </button>
                  </Link>

                  <Link href="/" className="block">
                    <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                      🏠 Retour à l'accueil
                    </button>
                  </Link>
                </div>

                {/* Mention légale TVA */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 text-justify leading-relaxed">
                    <span className="font-semibold text-gray-700">* Information TVA :</span> Le taux réduit de 10% s'applique exclusivement dans le cadre d'une prestation de fourniture et de pose réalisée par nos installateurs agréés, dans un logement achevé depuis plus de 2 ans. En cas de livraison seule (installation par vos soins) ou pour une construction neuve, le taux normal de 20% sera appliqué conformément à la législation fiscale en vigueur.
                  </p>
                </div>

                {/* Zone de réassurance paiement */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3 justify-center text-gray-800 font-semibold">
                    <Lock className="w-5 h-5 text-green-600" />
                    Paiement 100% sécurisé
                  </div>
                  <div className="flex justify-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-xs font-bold rounded border">CB</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs font-bold rounded border">VISA</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs font-bold rounded border">MASTERCARD</span>
                  </div>
                  <div className="text-center text-sm font-medium text-blue-600 bg-blue-50 py-2 rounded">
                    Possibilité de paiement en 3x ou 4x sans frais
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
