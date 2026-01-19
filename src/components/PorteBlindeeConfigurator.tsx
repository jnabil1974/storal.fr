'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PorteBlindeeConfig, ProductType } from '@/types/products';
import { calculatePorteBlindeePrice, getPriceBreakdown } from '@/lib/pricing';
import { useCart } from '@/contexts/CartContext';

interface PorteBlindeeConfiguratorProps {
  productId: string;
  productName: string;
  basePrice: number;
}

export default function PorteBlindeeConfigurator({ productId, productName, basePrice }: PorteBlindeeConfiguratorProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Convertir basePrice en nombre
  const basePriceNum = Number(basePrice);
  
  const [config, setConfig] = useState<PorteBlindeeConfig>({
    width: 85,
    height: 215,
    thickness: 60,
    material: 'acier',
    doorType: 'battante',
    securityLevel: 'A2P_2',
    color: '#ffffff',
    glassType: 'aucun',
    glassPercentage: 0,
    lockType: 'double',
    soundProofing: false,
    thermalProofing: true,
  });

  const totalPrice = calculatePorteBlindeePrice(basePriceNum, config);
  const breakdown = getPriceBreakdown(basePriceNum, config);

  const handleUpdate = (updates: Partial<PorteBlindeeConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem({
        productId,
        productName,
        productType: ProductType.PORTE_BLINDEE,
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
      <h2 className="text-2xl font-bold mb-6">Configurateur Porte Blindée</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dimensions */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Largeur: {config.width} cm
            </label>
            <input
              type="range"
              min="70"
              max="100"
              step="5"
              value={config.width}
              onChange={(e) => handleUpdate({ width: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">70 - 100 cm</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hauteur: {config.height} cm
            </label>
            <input
              type="range"
              min="200"
              max="240"
              step="5"
              value={config.height}
              onChange={(e) => handleUpdate({ height: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">200 - 240 cm</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Épaisseur: {config.thickness} mm
            </label>
            <select
              value={config.thickness}
              onChange={(e) => handleUpdate({ thickness: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={50}>50 mm</option>
              <option value={60}>60 mm (standard)</option>
              <option value={80}>80 mm (renforcé)</option>
              <option value={100}>100 mm (ultra sécurisé)</option>
            </select>
          </div>
        </div>

        {/* Matériau et Type */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matériau
            </label>
            <select
              value={config.material}
              onChange={(e) => handleUpdate({ material: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="acier">Acier</option>
              <option value="aluminium">Aluminium</option>
              <option value="composite">Composite</option>
              <option value="bois">Bois blindé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'ouverture
            </label>
            <select
              value={config.doorType}
              onChange={(e) => handleUpdate({ doorType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="battante">Battante (standard)</option>
              <option value="coulissante">Coulissante</option>
              <option value="pliante">Pliante</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur
            </label>
            <input
              type="color"
              value={config.color}
              onChange={(e) => handleUpdate({ color: e.target.value })}
              className="w-full h-10 rounded"
            />
          </div>
        </div>

        {/* Sécurité */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certification A2P
            </label>
            <select
              value={config.securityLevel}
              onChange={(e) => handleUpdate({ securityLevel: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="A2P_1">A2P 1 étoile (résistance 5 min)</option>
              <option value="A2P_2">A2P 2 étoiles (résistance 10 min) - RECOMMANDÉ</option>
              <option value="A2P_3">A2P 3 étoiles (résistance 15 min) - HAUT DE GAMME</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serrure
            </label>
            <select
              value={config.lockType}
              onChange={(e) => handleUpdate({ lockType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="simple">Serrure simple</option>
              <option value="double">Serrure double</option>
              <option value="triple">Serrure triple</option>
            </select>
          </div>
        </div>

        {/* Vitrage et Confort */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vitrage
            </label>
            <select
              value={config.glassType || 'aucun'}
              onChange={(e) => handleUpdate({ glassType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="aucun">Aucun</option>
              <option value="simple">Vitrage simple</option>
              <option value="securisé">Vitrage sécurisé</option>
              <option value="blindé">Vitrage blindé</option>
            </select>
          </div>

          {config.glassType && config.glassType !== 'aucun' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pourcentage: {config.glassPercentage}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={config.glassPercentage || 0}
                onChange={(e) => handleUpdate({ glassPercentage: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          )}

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config.soundProofing}
              onChange={(e) => handleUpdate({ soundProofing: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Insonorisation (+200€)</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config.thermalProofing}
              onChange={(e) => handleUpdate({ thermalProofing: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Isolation thermique (+180€)</span>
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
