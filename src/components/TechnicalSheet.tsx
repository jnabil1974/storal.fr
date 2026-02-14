'use client';

import { STORE_MODELS, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';

interface Cart {
  modelId: string | null;
  modelName?: string;
  colorId: string | null;
  fabricId: string | null;
  width?: number | null;
  projection?: number | null;
  exposure?: string | null;
  withMotor?: boolean;
  priceEco?: number;
  priceStandard?: number;
  pricePremium?: number;
  selectedPrice?: number;
  priceType?: string;
}

interface TerraceState {
  m1: number;
  m2: number;
  m3: number;
  m4: number;
}

interface TechnicalSheetProps {
  cart: Cart | null;
  terrace: TerraceState | null;
}

export default function TechnicalSheet({ cart, terrace }: TechnicalSheetProps) {
  const selectedModelData = cart?.modelId 
    ? Object.values(STORE_MODELS).find(m => m.id === cart.modelId) 
    : null;

  return (
    <div className="p-4 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
        📋 Récapitulatif de Votre Projet
      </h3>

      {/* Configuration Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Model */}
        {selectedModelData && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-gray-600 uppercase">Modèle</p>
            <p className="text-sm font-bold text-gray-900 mt-1">{selectedModelData.name}</p>
          </div>
        )}

        {/* Dimensions */}
        {cart?.width && cart?.projection && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-xs font-semibold text-gray-600 uppercase">Dimensions</p>
            <p className="text-sm font-bold text-gray-900 mt-1">
              {(cart.width / 100).toFixed(1)}m × {(cart.projection / 100).toFixed(1)}m
            </p>
          </div>
        )}

        {/* Frame Color */}
        {cart?.colorId && (
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <p className="text-xs font-semibold text-gray-600 uppercase">Armature</p>
            <p className="text-sm font-bold text-gray-900 mt-1">
              {FRAME_COLORS.find(c => c.id === cart.colorId)?.name || cart.colorId}
            </p>
          </div>
        )}

        {/* Fabric */}
        {cart?.fabricId && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs font-semibold text-gray-600 uppercase">Toile</p>
            <p className="text-sm font-bold text-gray-900 mt-1">
              {FABRICS.find(f => f.id === cart.fabricId)?.name || cart.fabricId}
            </p>
          </div>
        )}

        {/* Exposure */}
        {cart?.exposure && (
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <p className="text-xs font-semibold text-gray-600 uppercase">Exposition</p>
            <p className="text-sm font-bold text-gray-900 mt-1 capitalize">{cart.exposure}</p>
          </div>
        )}

        {/* Motor */}
        {cart?.withMotor !== undefined && (
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <p className="text-xs font-semibold text-gray-600 uppercase">Motorisation</p>
            <p className="text-sm font-bold text-gray-900 mt-1">
              {cart.withMotor ? '⚡ Radio Somfy' : '🔧 Manuel'}
            </p>
          </div>
        )}
      </div>

      {/* Price Options */}
      {(cart?.priceEco || cart?.priceStandard || cart?.pricePremium) && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-900 mb-3">💰 Options de Prix (HT)</h4>
          <div className="grid grid-cols-1 gap-2">
            {cart?.priceEco && (
              <button className={`p-3 rounded-lg border-2 transition-all ${
                cart.priceType === 'eco'
                  ? 'bg-green-100 border-green-600'
                  : 'bg-green-50 border-green-200 hover:border-green-400'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-gray-900">Éco</span>
                  <span className="text-lg font-bold text-green-700">{cart.priceEco}€</span>
                </div>
              </button>
            )}
            {cart?.priceStandard && (
              <button className={`p-3 rounded-lg border-2 transition-all ${
                cart.priceType === 'standard'
                  ? 'bg-blue-100 border-blue-600'
                  : 'bg-blue-50 border-blue-200 hover:border-blue-400'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-gray-900">Standard</span>
                  <span className="text-lg font-bold text-blue-700">{cart.priceStandard}€</span>
                </div>
              </button>
            )}
            {cart?.pricePremium && (
              <button className={`p-3 rounded-lg border-2 transition-all ${
                cart.priceType === 'premium'
                  ? 'bg-purple-100 border-purple-600'
                  : 'bg-purple-50 border-purple-200 hover:border-purple-400'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-gray-900">Premium</span>
                  <span className="text-lg font-bold text-purple-700">{cart.pricePremium}€</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Terrain Info */}
      {terrace && (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <h4 className="text-sm font-bold text-gray-900 mb-2">📐 Terrasse</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
            <div><span className="font-semibold">M1 (Haut):</span> {terrace.m1.toFixed(2)}m</div>
            <div><span className="font-semibold">M2 (Gauche):</span> {terrace.m2.toFixed(2)}m</div>
            <div><span className="font-semibold">M3 (Bas):</span> {terrace.m3.toFixed(2)}m</div>
            <div><span className="font-semibold">M4 (Droite):</span> {terrace.m4.toFixed(2)}m</div>
          </div>
        </div>
      )}

      {/* Commitments */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Fabrication 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Livraison 7 jours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Pose professionnelle</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Garantie 10 ans</span>
          </div>
        </div>
      </div>
    </div>
  );
}
