'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StoreAntichaleurConfig, ProductType } from '@/types/products';
import { calculateStoreAntichaleurPrice } from '@/lib/pricing';
import { useCart } from '@/contexts/CartContext';

interface Props {
  productId: string;
  productName: string;
  basePrice: number;
}

export default function StoreAntichaleurConfigurator({ productId, productName, basePrice }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const basePriceNum = Number(basePrice);

  const [config, setConfig] = useState<StoreAntichaleurConfig>({
    width: 120,
    height: 150,
    fabricType: 'screen',
    fabricColor: 'blanc',
    orientation: 'interieur',
    motorized: false,
    fixationType: 'standard',
    uvProtection: true,
    thermalControl: true,
  });

  const totalPrice = calculateStoreAntichaleurPrice(basePriceNum, config);

  const updateConfig = (updates: Partial<StoreAntichaleurConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem({
        productId,
        productName,
        productType: ProductType.STORE_ANTICHALEUR,
        basePrice: basePriceNum,
        configuration: config,
        quantity: 1,
        pricePerUnit: totalPrice,
      });
      setSuccessMessage('Produit ajouté au panier !');
      setTimeout(() => {
        router.push('/cart');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Configurez votre Store Antichaleur</h3>

      {/* Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Largeur (cm) : {config.width} cm
          </label>
          <input
            type="range"
            min="60"
            max="300"
            step="5"
            value={config.width}
            onChange={(e) => updateConfig({ width: Number(e.target.value) })}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hauteur (cm) : {config.height} cm
          </label>
          <input
            type="range"
            min="80"
            max="300"
            step="5"
            value={config.height}
            onChange={(e) => updateConfig({ height: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      {/* Type de tissu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type de Tissu</label>
        <select
          value={config.fabricType}
          onChange={(e) => updateConfig({ fabricType: e.target.value as any })}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="screen">Screen (Filtrant)</option>
          <option value="semi-occultant">Semi-Occultant</option>
          <option value="occultant">Occultant Total</option>
        </select>
      </div>

      {/* Couleur */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur du Tissu</label>
        <select
          value={config.fabricColor}
          onChange={(e) => updateConfig({ fabricColor: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="blanc">Blanc</option>
          <option value="beige">Beige</option>
          <option value="gris">Gris</option>
          <option value="anthracite">Anthracite</option>
          <option value="noir">Noir</option>
        </select>
      </div>

      {/* Orientation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={config.orientation === 'interieur'}
              onChange={() => updateConfig({ orientation: 'interieur' })}
              className="mr-2"
            />
            Intérieur
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={config.orientation === 'exterieur'}
              onChange={() => updateConfig({ orientation: 'exterieur' })}
              className="mr-2"
            />
            Extérieur (+100€)
          </label>
        </div>
      </div>

      {/* Type de fixation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type de Fixation</label>
        <select
          value={config.fixationType}
          onChange={(e) => updateConfig({ fixationType: e.target.value as any })}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="standard">Fixation Standard</option>
          <option value="sans-percage">Sans Perçage (+40€)</option>
          <option value="encastre">Encastré (+150€)</option>
        </select>
      </div>

      {/* Motorisation */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.motorized}
            onChange={(e) => updateConfig({ motorized: e.target.checked, motorType: e.target.checked ? 'electrique' : undefined })}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Motorisé (+150€)</span>
        </label>

        {config.motorized && (
          <div className="mt-2 ml-6">
            <select
              value={config.motorType || 'electrique'}
              onChange={(e) => updateConfig({ motorType: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="manuel">Manuel</option>
              <option value="electrique">Électrique</option>
              <option value="solaire">Solaire (+200€)</option>
            </select>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.uvProtection}
            onChange={(e) => updateConfig({ uvProtection: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Protection UV renforcée (+30€)</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.thermalControl}
            onChange={(e) => updateConfig({ thermalControl: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Contrôle thermique (+40€)</span>
        </label>
      </div>

      {/* Résumé */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Résumé de votre configuration</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>📏 Dimensions : {config.width} × {config.height} cm</li>
          <li>🎨 Tissu : {config.fabricType} - {config.fabricColor}</li>
          <li>📍 Orientation : {config.orientation}</li>
          <li>🔧 Fixation : {config.fixationType}</li>
          {config.motorized && <li>⚡ Motorisation : {config.motorType}</li>}
          {config.uvProtection && <li>☀️ Protection UV renforcée</li>}
          {config.thermalControl && <li>🌡️ Contrôle thermique</li>}
        </ul>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-900">Prix total :</span>
                  <span className="text-2xl font-bold text-blue-600">{totalPrice.toFixed(2)} €</span>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAdding ? 'Ajout en cours...' : 'Ajouter au panier'}
                </button>
                {successMessage && (
                  <p className="mt-2 text-green-600 text-center font-medium">{successMessage}</p>
                )}
              </div>
      </div>
    </div>
  );
}
