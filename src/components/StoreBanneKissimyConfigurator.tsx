'use client';

import { useState, useCallback, useMemo } from 'react';
import { StoreBanneKissimyConfig, ProductType } from '@/types/products';
import {
  calculateStoreBannePriceTTC,
  getKissimyAvailableOptions,
  validateKissimyConfig,
} from '@/lib/storeBannePricing';
import { useCart } from '@/contexts/CartContext';

interface StoreBanneKissimyConfiguratorProps {
  productId: string;
  productName?: string;
  coefficient?: number;
  onAddToCart?: (config: StoreBanneKissimyConfig, price: number) => void;
}

const AVANCEE_OPTIONS = [1500, 2000, 2500, 3000];

export function StoreBanneKissimyConfigurator({
  productId,
  productName = 'Store Banne Coffre KISSIMY',
  coefficient = 2.0,
  onAddToCart,
}: StoreBanneKissimyConfiguratorProps) {
  const { addItem } = useCart();

  // État du formulaire
  const [config, setConfig] = useState<Partial<StoreBanneKissimyConfig>>({
    avancee: 1500,
    largeur: 2000,
    couleurCadre: 'RAL_9010',
    toile: 'U796',
    poseSousPlafond: false,
    capteurVent: false,
    tahoma: false,
    cablage10m: false,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [customRalCode, setCustomRalCode] = useState<string>('');
  const [showToileModal, setShowToileModal] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Calcul du prix
  const priceInfo = useMemo(() => {
    try {
      const validated = {
        avancee: config.avancee || 1500,
        largeur: config.largeur || 2000,
        couleurCadre: config.couleurCadre || 'RAL_9010',
        toile: config.toile || 'ORCH_290',
        poseSousPlafond: config.poseSousPlafond || false,
        capteurVent: config.capteurVent || false,
        tahoma: config.tahoma || false,
        cablage10m: config.cablage10m || false,
      } as StoreBanneKissimyConfig;

      return calculateStoreBannePriceTTC(validated, coefficient);
    } catch {
      return null;
    }
  }, [config, coefficient]);

  const handleConfigChange = useCallback(
    (updates: Partial<StoreBanneKissimyConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }));
      setErrors([]);
    },
    []
  );

  const handleAddToCart = async () => {
    // Valider la configuration
    const validation = validateKissimyConfig(config);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (!priceInfo) {
      setErrors(['Erreur lors du calcul du prix']);
      return;
    }

    const finalConfig = config as StoreBanneKissimyConfig;

    try {
      // Ajouter au panier via contexte
      await addItem({
        productId,
        productName,
        productType: ProductType.STORE_BANNE,
        basePrice: priceInfo.basePriceHT ?? 0,
        configuration: finalConfig as any,
        quantity,
        pricePerUnit: priceInfo.totalPriceTTC,
      });

      // Afficher un message de succès
      setSuccessMessage(
        `✓ ${productName} ajouté au panier (${quantity} article${quantity > 1 ? 's' : ''})`
      );
      setErrors([]);

      // Masquer le message après 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000);

      // Réinitialiser le formulaire
      setQuantity(1);
      setConfig({
        avancee: 1500,
        largeur: 2000,
        couleurCadre: 'RAL_9010',
        toile: 'ORCH_290',
        poseSousPlafond: false,
        capteurVent: false,
        tahoma: false,
        cablage10m: false,
      });

      // Callback optionnel
      if (onAddToCart) {
        onAddToCart(finalConfig, priceInfo.totalPriceTTC);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('❌ Erreur lors de l\'ajout au panier:', error);
      setErrors(['Erreur lors de l\'ajout au panier: ' + errorMessage]);
    }
  };

  const options = getKissimyAvailableOptions();

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Photos showcase KISSIMY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mx-4 -mt-6 mb-6">
        <div className="relative h-48 md:h-56 overflow-hidden rounded-t-lg cursor-pointer group">
          <img
            src="https://images.unsplash.com/photo-1579638282228-0f72c0a07c25?w=600&h=400&fit=crop"
            alt="Store banne KISSIMY design moderne"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => setEnlargedImage('https://images.unsplash.com/photo-1579638282228-0f72c0a07c25?w=1200&h=800&fit=crop')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-white/90 px-4 py-2 rounded-lg font-semibold text-gray-800">Agrandir</span>
          </div>
        </div>
        <div className="relative h-48 md:h-56 overflow-hidden rounded-t-lg cursor-pointer group">
          <img
            src="https://images.unsplash.com/photo-1600585152915-d92dbb6b0db0?w=600&h=400&fit=crop"
            alt="Store banne terrasse confortable"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => setEnlargedImage('https://images.unsplash.com/photo-1600585152915-d92dbb6b0db0?w=1200&h=800&fit=crop')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-white/90 px-4 py-2 rounded-lg font-semibold text-gray-800">Agrandir</span>
          </div>
        </div>
        <div className="relative h-48 md:h-56 overflow-hidden rounded-t-lg cursor-pointer group">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop"
            alt="Protection solaire stylée"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => setEnlargedImage('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=800&fit=crop')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-white/90 px-4 py-2 rounded-lg font-semibold text-gray-800">Agrandir</span>
          </div>
        </div>
      </div>

      {/* MODAL: Image agrandie */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={enlargedImage}
              alt="Image agrandie"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 bg-white hover:bg-gray-200 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Titre et description */}
      <div>
        <h3 className="text-xl font-semibold mb-2">{productName}</h3>
        <p className="text-gray-600 text-sm">Configurez votre store banne coffre KISSIMY</p>
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 animate-pulse">
          <p className="text-green-800 text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Messages d'erreur */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm font-medium">Veuillez corriger les erreurs:</p>
          <ul className="list-disc list-inside text-red-700 text-sm mt-1">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 1: Dimensions */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="font-semibold text-gray-700">1. Dimensions</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Avancée (mm)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {AVANCEE_OPTIONS.map((val) => (
              <button
                key={val}
                onClick={() => handleConfigChange({ avancee: val })}
                className={`py-2 px-3 rounded-md font-medium transition-colors ${
                  config.avancee === val
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Largeur (mm): {config.largeur}
          </label>
          <input
            type="range"
            min="1800"
            max="4830"
            step="10"
            value={config.largeur || 2000}
            onChange={(e) => handleConfigChange({ largeur: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1800mm</span>
            <span>4830mm</span>
          </div>
        </div>
      </div>

      {/* Section 2: Couleur du cadre */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="font-semibold text-gray-700">2. Couleur du cadre</h4>
        <div className="space-y-2">
          {options.couleurCadre.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                handleConfigChange({ couleurCadre: opt.value as any });
                if (opt.value !== 'AUTRE_RAL') {
                  setCustomRalCode('');
                }
              }}
              className={`w-full text-left py-2 px-3 rounded-md border transition-colors ${
                config.couleurCadre === opt.value
                  ? 'bg-blue-100 border-blue-400 text-blue-900'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              {opt.priceHT > 0 && <span className="ml-2 text-sm text-gray-600">+{opt.priceHT}€</span>}
            </button>
          ))}
        </div>
        
        {config.couleurCadre === 'AUTRE_RAL' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code RAL personnalisé
            </label>
            <input
              type="text"
              placeholder="ex: RAL 5012, RAL 1018..."
              value={customRalCode}
              onChange={(e) => setCustomRalCode(e.target.value.toUpperCase())}
              maxLength={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">Saisissez le code RAL désiré (ex: RAL 5012)</p>
          </div>
        )}
      </div>

      {/* Section 3: Choix de la toile */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="font-semibold text-gray-700">3. Choix de la toile</h4>
        <p className="text-sm text-gray-600">Sélectionnez une toile Dickson parmi nos références</p>
        
        {/* Bouton pour ouvrir le modal */}
        <button
          onClick={() => setShowToileModal(true)}
          className="w-full p-4 border-2 border-blue-400 rounded-md bg-white hover:bg-blue-50 transition-colors flex items-center justify-center gap-3"
        >
          <div className="text-left">
            {config.toile && options.toiles.find(t => t.ref === config.toile) ? (
              <div>
                <p className="font-semibold text-gray-800">
                  {options.toiles.find(t => t.ref === config.toile)?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Réf: {config.toile}
                </p>
              </div>
            ) : (
              <p className="font-semibold text-gray-700">Choisir une toile...</p>
            )}
          </div>
          <span className="ml-auto text-xl">▼</span>
        </button>

        {/* Aperçu de la toile sélectionnée */}
        {config.toile && options.toiles.find(t => t.ref === config.toile) && (
          <div className="mt-6 p-4 bg-white rounded-md border-2 border-blue-300">
            <h5 className="font-semibold text-gray-700 mb-3">Toile sélectionnée:</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Image */}
              <div className="h-40 rounded-md overflow-hidden bg-gray-100">
                <img
                  src={options.toiles.find(t => t.ref === config.toile)?.imageUrl}
                  alt="Toile sélectionnée"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const toile = options.toiles.find(t => t.ref === config.toile)!;
                      parent.className = `h-40 flex items-center justify-center rounded-md ${
                        toile.colorFamily === 'Blanc' ? 'bg-gradient-to-br from-gray-100 to-gray-200' :
                        toile.colorFamily === 'Noir' ? 'bg-gradient-to-br from-gray-800 to-gray-900' :
                        toile.colorFamily === 'Gris' ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                        toile.colorFamily === 'Bleu' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                        toile.colorFamily === 'Vert' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                        toile.colorFamily === 'Rouge' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                        toile.colorFamily === 'Rose' ? 'bg-gradient-to-br from-pink-400 to-pink-600' :
                        toile.colorFamily === 'Orange' ? 'bg-gradient-to-br from-rose-400 to-rose-700' :
                        toile.colorFamily === 'Jaune' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                        toile.colorFamily === 'Violet' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                        toile.colorFamily === 'Marron' ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                        toile.colorFamily === 'Beige' ? 'bg-gradient-to-br from-amber-200 to-amber-400' :
                        'bg-gradient-to-br from-gray-300 to-gray-400'
                      }`;
                    }
                  }}
                />
              </div>
              {/* Détails */}
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">NOM COMPLET</p>
                    <p className="text-lg font-semibold text-gray-900">{options.toiles.find(t => t.ref === config.toile)?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">RÉFÉRENCE</p>
                    <p className="text-base font-mono text-gray-800">{config.toile}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">FAMILLE DE COULEUR</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`w-6 h-6 rounded border-2 border-gray-300 ${
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Blanc' ? 'bg-gray-100' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Noir' ? 'bg-gray-900' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Gris' ? 'bg-gray-500' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Bleu' ? 'bg-blue-500' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Vert' ? 'bg-green-500' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Rouge' ? 'bg-red-500' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Rose' ? 'bg-pink-500' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Orange' ? 'bg-rose-700' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Jaune' ? 'bg-yellow-400' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Violet' ? 'bg-purple-500' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Marron' ? 'bg-amber-700' :
                          options.toiles.find(t => t.ref === config.toile)?.colorFamily === 'Beige' ? 'bg-amber-300' :
                          'bg-gray-400'
                        }`}
                      ></div>
                      <p className="text-base font-medium text-gray-800">{options.toiles.find(t => t.ref === config.toile)?.colorFamily}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setShowToileModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Changer de toile →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Sélecteur de toiles */}
      {showToileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Sélectionnez une toile</h3>
                <p className="text-gray-600 mt-1">Cliquez sur une toile pour l'ajouter à votre devis</p>
              </div>
              <button
                onClick={() => setShowToileModal(false)}
                className="text-3xl text-gray-500 hover:text-gray-700 font-light"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {options.toiles.map((toile) => (
                <button
                  key={toile.ref}
                  onClick={() => {
                    handleConfigChange({ toile: toile.ref });
                    setShowToileModal(false);
                  }}
                  className={`rounded-md border-2 transition-all overflow-hidden flex flex-col ${
                    config.toile === toile.ref
                      ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300 bg-white'
                  }`}
                >
                  {/* Image de la toile Dickson */}
                  <div className="h-24 relative overflow-hidden bg-gray-100">
                    <img
                      src={toile.imageUrl}
                      alt={toile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.className = `h-24 flex items-center justify-center relative overflow-hidden ${
                            toile.colorFamily === 'Blanc' ? 'bg-gradient-to-br from-gray-100 to-gray-200' :
                            toile.colorFamily === 'Noir' ? 'bg-gradient-to-br from-gray-800 to-gray-900' :
                            toile.colorFamily === 'Gris' ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                            toile.colorFamily === 'Bleu' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                            toile.colorFamily === 'Vert' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                            toile.colorFamily === 'Rouge' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                            toile.colorFamily === 'Rose' ? 'bg-gradient-to-br from-pink-400 to-pink-600' :
                            toile.colorFamily === 'Orange' ? 'bg-gradient-to-br from-rose-400 to-rose-700' :
                            toile.colorFamily === 'Jaune' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                            toile.colorFamily === 'Violet' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                            toile.colorFamily === 'Marron' ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                            toile.colorFamily === 'Beige' ? 'bg-gradient-to-br from-amber-200 to-amber-400' :
                            'bg-gradient-to-br from-gray-300 to-gray-400'
                          }`;
                          parent.innerHTML = `<div class="text-center"><p class="text-lg font-bold ${
                            ['Noir', 'Bleu', 'Vert', 'Rouge', 'Violet', 'Marron'].includes(toile.colorFamily) 
                              ? 'text-white' 
                              : 'text-gray-800'
                          }">${toile.ref}</p></div>`;
                        }
                      }}
                    />
                  </div>
                  {/* Info toile */}
                  <div className="p-2 flex-1 flex flex-col justify-between">
                    <h5 className="font-semibold text-gray-900 text-xs line-clamp-2">{toile.name}</h5>
                    <p className="text-xs text-gray-500 mt-1">Réf: {toile.ref}</p>
                    {config.toile === toile.ref && (
                      <p className="text-xs text-blue-600 font-bold mt-1">✓ Sélectionnée</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Motorisation (info) */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-md border border-blue-200">
        <h4 className="font-semibold text-blue-900">4. Motorisation (incluse)</h4>
        <p className="text-sm text-blue-800">
          <strong>SUNEA IO</strong> + <strong>Situo IO 1</strong> inclus dans le prix
        </p>
      </div>

      {/* Section 5: Accessoires */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="font-semibold text-gray-700">5. Accessoires (optionnels)</h4>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.poseSousPlafond || false}
            onChange={(e) => handleConfigChange({ poseSousPlafond: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            Pose sous plafond <span className="text-gray-500">+39€</span>
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.capteurVent || false}
            onChange={(e) => handleConfigChange({ capteurVent: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            Capteur vent <span className="text-gray-500">+90€</span>
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.tahoma || false}
            onChange={(e) => handleConfigChange({ tahoma: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            TAHOMA <span className="text-gray-500">+117€</span>
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.cablage10m || false}
            onChange={(e) => handleConfigChange({ cablage10m: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            Câblage 10m <span className="text-gray-500">+48€</span>
          </span>
        </label>
      </div>

      {/* Section Quantité et Prix */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
        <div>
          <label className="text-sm font-medium text-gray-700">Quantité</label>
          <input
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {priceInfo && (
          <div className="border-t border-gray-300 pt-3">
            <div className="space-y-1 text-sm mb-3">
              <div className="flex justify-between text-gray-600">
                <span>Prix unitaire TTC:</span>
                <span className="font-semibold text-lg text-blue-600">
                  {priceInfo.totalPriceTTC.toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Quantité:</span>
                <span className="font-semibold">×{quantity}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t border-gray-300">
                <span>Total TTC:</span>
                <span>{(priceInfo.totalPriceTTC * quantity).toFixed(2)}€</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton Ajouter au panier */}
      <button
        onClick={handleAddToCart}
        disabled={!priceInfo}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        Ajouter au panier
      </button>
    </div>
  );
}
