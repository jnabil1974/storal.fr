'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { calculateFinalPrice, STORE_MODELS, FABRIC_OPTIONS } from '@/lib/catalog-data';
import { ProductType } from '@/types/products';

export default function CartPageClient() {
  const { cart, removeItem, updateQuantity, clearCart, isLoading, addItem } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const [paramError, setParamError] = useState<string | null>(null);
  const processedParamsRef = useRef<Set<string>>(new Set());
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const modelId = searchParams.get('model') as 'kissimy' | 'heliom';
    const widthStr = searchParams.get('width');
    const projectionStr = searchParams.get('projection');
    const colorId = searchParams.get('color');
    const motor = searchParams.get('motor');
    const motorSide = searchParams.get('motorSide');
    const sensor = searchParams.get('sensor');
    const ledArmsParam = searchParams.get('ledArms');
    const ledBoxParam = searchParams.get('ledBox');
    const lambrequinParam = searchParams.get('lambrequin');
    const lambrequinMotorizedParam = searchParams.get('lambrequinMotorized');
    const lambrequinFabricId = searchParams.get('lambrequin_fabric_id');

    // Créer une clé unique pour cette configuration
    const paramsKey = `${modelId}-${widthStr}-${projectionStr}-${colorId}-${motor}-${motorSide}-${sensor}-${ledArmsParam}-${ledBoxParam}-${lambrequinParam}-${lambrequinMotorizedParam}-${lambrequinFabricId}`;
    
    // Si déjà traité, ne rien faire
    if (processedParamsRef.current.has(paramsKey)) return;

    if (modelId && (STORE_MODELS[modelId]) && widthStr && projectionStr) {
      console.log("Processing item from URL params:", { modelId, widthStr, projectionStr, colorId, motorSide, sensor, ledArmsParam, ledBoxParam, lambrequinParam, lambrequinMotorizedParam, lambrequinFabricId });
      
      // Marquer comme traité immédiatement pour éviter les doublons
      processedParamsRef.current.add(paramsKey);

      const widthMm = parseInt(widthStr, 10);
      const projectionMm = parseInt(projectionStr, 10);
      const modelData = STORE_MODELS[modelId];
      const availableProjections = Object.keys(modelData.buyPrices).map(Number);

      if (!availableProjections.includes(projectionMm)) {
        setParamError(
          `Avancée invalide. Choisissez parmi: ${availableProjections.join(', ')} mm.`
        );
        router.replace('/cart', { scroll: false });
        return;
      }

      const grid = modelData.buyPrices[projectionMm];
      const maxWidth = grid?.length ? Math.max(...grid.map(t => t.maxW)) : null;
      if (maxWidth !== null && widthMm > maxWidth) {
        setParamError(
          `Largeur invalide pour une avancée de ${projectionMm} mm. Max: ${maxWidth} mm.`
        );
        router.replace('/cart', { scroll: false });
        return;
      }

      // Conversion du format chatbot (lambrequin + lambrequinMotorized) vers le format calculateFinalPrice
      const hasLambrequin = lambrequinParam === 'true';
      const isLambrequinMotorized = lambrequinMotorizedParam === 'true';
      
      const options = {
          ledArms: ledArmsParam === 'true',
          ledBox: ledBoxParam === 'true',
          lambrequinFixe: hasLambrequin && !isLambrequinMotorized,  // Fixe si non motorisé
          lambrequinEnroulable: hasLambrequin && isLambrequinMotorized,  // Enroulable si motorisé
          lambrequinMotorized: isLambrequinMotorized,
          isPosePro: true, // Default to pro installation for VAT
          isCustomColor: false
      };

      const priceInfo = calculateFinalPrice({ modelId, width: widthMm, projection: projectionMm, options });
      console.log("Price calculation result:", priceInfo);

      if (priceInfo) {

        const configuration: { [key: string]: string | number } = {};
        searchParams.forEach((value, key) => {
          configuration[key] = value;
        });
        configuration.width = widthMm;
        configuration.projection = projectionMm;

        const itemToAdd = {
          productId: `store-${modelId}`,
          productType: ProductType.STORE_BANNE,
          productName: modelData.name,
          basePrice: priceInfo.ht,
          configuration: configuration as any,
          quantity: 1,
          pricePerUnit: priceInfo.ttc,
        };
        
        console.log("Item to add:", itemToAdd);

        const itemInCart = cart.items.find(item => 
          item.productId === itemToAdd.productId &&
          JSON.stringify(item.configuration) === JSON.stringify(itemToAdd.configuration)
        );

        if (!itemInCart) {
          console.log("Item not in cart, adding...");
          addItem(itemToAdd).then(() => {
            console.log("Item added successfully.");
            router.replace('/cart', { scroll: false });
          }).catch(err => {
            console.error("Failed to add item to cart:", err);
          });
        } else {
            console.log("Item already in cart, cleaning URL params.");
            router.replace('/cart', { scroll: false });
        }
      } else {
        setParamError('Configuration invalide. Vérifiez les dimensions et options.');
        console.error("Price calculation error: Unable to calculate price");
        router.replace('/cart', { scroll: false });
      }
    }
  }, [searchParams]);


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
        {paramError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {paramError}
          </div>
        )}
        {(isLoading && cart.items.length === 0) ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
             <p className="text-gray-600 text-lg mb-6">Chargement du panier...</p>
          </div>
        ) : cart.items.length === 0 ? (
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
              {cart.items.map((item) => {
                // Extraire le modèle depuis la configuration pour afficher l'image
                const modelId = item.configuration?.model as string;
                const modelData = modelId ? STORE_MODELS[modelId] : null;
                const productImage = modelData?.image || '/images/stores/default.jpg';

                // Extraire la toile si disponible
                const fabricId = item.configuration?.fabric_id as string;
                let fabricImage = null;
                if (fabricId) {
                  // Chercher dans les deux catégories de toiles
                  const mainFabric = FABRIC_OPTIONS.MAIN_STORE?.find(f => f.id === fabricId);
                  const lambrequinFabric = FABRIC_OPTIONS.LAMBREQUIN?.find(f => f.id === fabricId);
                  const fabric = mainFabric || lambrequinFabric;
                  fabricImage = fabric?.image;
                }

                return (
                  <div key={item.id} className="bg-white rounded-lg shadow p-6 flex gap-6">
                    {/* Product Images */}
                    <div className="flex flex-col gap-3 flex-shrink-0">
                      {/* Image du modèle */}
                      {productImage && (
                        <div className="w-32 h-32 relative rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </div>
                      )}
                      
                      {/* Image de la toile si disponible */}
                      {fabricImage && (
                        <div className="w-32 h-20 relative rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                          <Image
                            src={fabricImage}
                            alt="Toile sélectionnée"
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 py-0.5 text-center">
                            Toile
                          </div>
                        </div>
                      )}
                    </div>

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
                            let label = key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/_/g, ' ')
                              .charAt(0)
                              .toUpperCase() + key.slice(1);
                            
                            // Convert dimensions from mm to cm for display
                            let displayValue = String(value);
                            if (key === 'width' && typeof value === 'number') {
                              displayValue = `${(value / 10).toFixed(1)}cm`;
                              label = 'Largeur';
                            } else if (key === 'projection' && typeof value === 'number') {
                              displayValue = `${(value / 10).toFixed(1)}cm`;
                              label = 'Avancée';
                            } else if (key === 'motorSide') {
                              label = 'Côté sortie moteur';
                              displayValue = value === 'gauche' ? 'Gauche (vue extérieure)' : value === 'droite' ? 'Droite (vue extérieure)' : String(value);
                            } else if (key === 'lambrequin_fabric_id' && value) {
                              label = 'Toile lambrequin';
                              displayValue = String(value).includes('SOL-86') ? 'Soltis 86' : String(value).includes('SOL-92') ? 'Soltis 92' : String(value);
                            } else {
                              displayValue = String(value).charAt(0).toUpperCase() + String(value).slice(1);
                            }
                            
                            return (
                              <li key={key} className="flex justify-between text-gray-700">
                                <span className="font-medium">{label}:</span>
                                <span className="text-gray-900 font-semibold">
                                  {displayValue}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Prix unitaire */}
                    <p className="text-lg font-bold text-blue-600">
                      {(Number(item.pricePerUnit)).toFixed(2)}€ /unité
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
                );
              })}
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
