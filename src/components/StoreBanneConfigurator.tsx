'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StoreBanneConfig, ProductType } from '@/types/products';
import { calculateStoreBannePrice, getPriceBreakdown } from '@/lib/pricing';
import { useCart } from '@/contexts/CartContext';

interface StoreBanneConfiguratorProps {
  productId: string;
  productName: string;
  basePrice: number;
}

export default function StoreBanneConfigurator({ productId, productName, basePrice }: StoreBanneConfiguratorProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Convertir basePrice en nombre
  const basePriceNum = Number(basePrice);
  
  const [config, setConfig] = useState<StoreBanneConfig>({
    width: 300,
    depth: 150,
    motorized: false,
    motorType: 'electrique',
    fabric: 'acrylique',
    fabricColor: '#ffffff',
    frameColor: 'blanc',
    armType: 'semi-coffre',
    windSensor: false,
    rainSensor: false,
  });

  const totalPrice = calculateStoreBannePrice(basePriceNum, config);
  const breakdown = getPriceBreakdown(basePriceNum, config);

  const handleUpdate = (updates: Partial<StoreBanneConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem({
        productId,
        productName,
        productType: ProductType.STORE_BANNE,
        basePrice: basePriceNum,
        configuration: config,
        quantity: 1,
        pricePerUnit: totalPrice,
      });
      
      setSuccessMessage('Article ajouté au panier! ✓');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Configurateur Store Banne</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dimensions */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Largeur: {config.width} cm
            </label>
            <input
              type="range"
              min="100"
              max="600"
              step="10"
              value={config.width}
              onChange={(e) => handleUpdate({ width: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">100 - 600 cm</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profondeur: {config.depth} cm
            </label>
            <input
              type="range"
              min="50"
              max="250"
              step="10"
              value={config.depth}
              onChange={(e) => handleUpdate({ depth: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">50 - 250 cm</div>
          </div>
        </div>

        {/* Motorisation */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.motorized}
                onChange={(e) => handleUpdate({ motorized: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Motorisation</span>
            </label>
          </div>

          {config.motorized && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de moteur
              </label>
              <select
                value={config.motorType || 'electrique'}
                onChange={(e) => handleUpdate({ motorType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="manuel">Manuel</option>
                <option value="electrique">Électrique</option>
                <option value="smarty">Smarty (IoT)</option>
              </select>
            </div>
          )}
        </div>

        {/* Tissu */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de tissu
            </label>
            <select
              value={config.fabric}
              onChange={(e) => handleUpdate({ fabric: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="acrylique">Acrylique (standard)</option>
              <option value="polyester">Polyester</option>
              <option value="micro-perforé">Micro-perforé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur du tissu
            </label>
            <input
              type="color"
              value={config.fabricColor}
              onChange={(e) => handleUpdate({ fabricColor: e.target.value })}
              className="w-full h-10 rounded"
            />
          </div>
        </div>

        {/* Cadre et Bras */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur du cadre
            </label>
            <select
              value={config.frameColor}
              onChange={(e) => handleUpdate({ frameColor: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="blanc">Blanc</option>
              <option value="gris">Gris</option>
              <option value="noir">Noir</option>
              <option value="bronze">Bronze</option>
              <option value="inox">Inox</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de bras
            </label>
            <select
              value={config.armType}
              onChange={(e) => handleUpdate({ armType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="ouvert">Ouvert</option>
              <option value="semi-coffre">Semi-coffre</option>
              <option value="coffre">Coffre</option>
            </select>
          </div>
        </div>

        {/* Capteurs */}
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config.windSensor}
              onChange={(e) => handleUpdate({ windSensor: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Capteur vent (-120€)</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config.rainSensor}
              onChange={(e) => handleUpdate({ rainSensor: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Capteur pluie (+120€)</span>
          </label>
        </div>
      </div>

      {/* Détail du prix */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-3">Détail du prix</h3>
        <div className="space-y-2 text-sm">
          {Object.entries(breakdown).map(([label, price]) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-700">{label}</span>
              <span className="font-medium">{price}€</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-300 mt-3 pt-3 flex justify-between">
          <span className="font-bold">Total</span>
          <span className="text-xl font-bold text-blue-600">{totalPrice}€</span>
        </div>
      </div>

      <button 
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? 'Ajout en cours...' : 'Ajouter au panier'}
      </button>
      
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium">
          {successMessage}
        </div>
      )}
    </div>
  );
}
