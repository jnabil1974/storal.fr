'use client';

import { useState, useEffect } from 'react';
import { StoreModel, calculateFinalPrice, CATALOG_SETTINGS } from '@/lib/catalog-data';
import { Ruler, Palette, Zap, Settings, Tag, X } from 'lucide-react';
import Link from 'next/link';

interface InlineConfiguratorProps {
  model: StoreModel;
}

export default function InlineConfigurator({ model }: InlineConfiguratorProps) {
  // Récupérer les projections disponibles (avancées)
  const availableProjections = Object.keys(model.buyPrices).map(Number).sort((a, b) => a - b);
  const defaultProjection = availableProjections[0] || 1500;

  // États du configurateur
  const [width, setWidth] = useState((model.compatibility.max_width || 6000) / 2); // Largeur par défaut au milieu
  const [projection, setProjection] = useState(defaultProjection);
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [ledArms, setLedArms] = useState(false);
  const [ledBox, setLedBox] = useState(false);
  const [ceilingMount, setCeilingMount] = useState(false);
  
  // États pour le code promo
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Calculer les limites de largeur pour la projection sélectionnée
  const minWidthForProjection = model.minWidths[projection] || 1000;
  const maxWidthForProjection = model.compatibility.max_width || 6000;

  // Ajuster la largeur si elle est hors limites après changement de projection
  useEffect(() => {
    if (width < minWidthForProjection) {
      setWidth(minWidthForProjection);
    }
    if (width > maxWidthForProjection) {
      setWidth(maxWidthForProjection);
    }
  }, [projection, minWidthForProjection, maxWidthForProjection, width]);

  // Calculer le prix en temps réel
  const priceResult = calculateFinalPrice({
    modelId: model.id,
    width,
    projection,
    options: {
      ledArms,
      ledBox,
      lambrequinFixe: false,
      lambrequinEnroulable: false,
      lambrequinMotorized: false,
      isPosePro: false,
      isCustomColor,
      isPosePlafond: ceilingMount,
    }
  });

  const finalPriceTTC = priceResult?.ttc || 0;
  
  // Calcul avec code promo
  const discount = promoApplied ? finalPriceTTC * 0.05 : 0;
  const finalPriceWithPromo = finalPriceTTC - discount;
  
  // Fonction pour appliquer le code promo
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'STORAL5') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Code promo invalide');
    }
  };
  
  // Réinitialiser le code promo si invalide
  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoCode('');
    setPromoError('');
  };

  // Détection logique Armor (supplément couleur gratuit ≥ 6m)
  const isArmorModel = model.colorStrategy === 'HYBRID_ARMOR';
  const colorSupplementFree = isArmorModel && width >= 6000;
  const colorSupplementAmount = 200; // Montant du supplément RAL

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <h3 className="text-2xl font-black mb-2">⚙️ Configurateur Express</h3>
        <p className="text-blue-100 text-sm">Ajustez les dimensions et voyez le prix en temps réel</p>
      </div>

      <div className="p-6">
        {/* Grille responsive : 2 colonnes sur desktop */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* COLONNE GAUCHE : Dimensions & Prix */}
          <div className="space-y-6">
            {/* Largeur */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                <Ruler className="w-5 h-5 text-blue-600" />
                Largeur : {(width / 1000).toFixed(2)} m
              </label>
              <input
                type="range"
                min={minWidthForProjection}
                max={maxWidthForProjection}
                step={10}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Min: {(minWidthForProjection / 1000).toFixed(1)}m</span>
                <span>Max: {(maxWidthForProjection / 1000).toFixed(1)}m</span>
              </div>
            </div>

            {/* Projection (Avancée) */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                <Ruler className="w-5 h-5 text-green-600" />
                Avancée (Projection)
              </label>
              <select
                value={projection}
                onChange={(e) => setProjection(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none"
              >
                {availableProjections.map((proj) => (
                  <option key={proj} value={proj}>
                    {(proj / 1000).toFixed(2)} m
                  </option>
                ))}
              </select>
            </div>

            {/* Prix Final - Déplacé ici */}
            <div className="border-t-2 border-blue-600 pt-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">
                  Prix Configuré
                </div>
                {priceResult ? (
                  <>
                    {promoApplied && discount > 0 && (
                      <div className="mb-3 bg-green-100 border-2 border-green-500 rounded-lg p-3">
                        <div className="text-base font-bold text-green-800">
                          🎉 Vous économisez {discount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </div>
                        <div className="text-sm text-green-700 mt-1 line-through">
                          Prix initial : {finalPriceTTC.toLocaleString('fr-FR')}€
                        </div>
                      </div>
                    )}
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl font-semibold text-blue-900">
                        {finalPriceWithPromo.toLocaleString('fr-FR')}
                      </span>
                      <span className="text-lg font-normal text-blue-700">€ TTC</span>
                    </div>
                    <div className="text-xs text-blue-600 font-medium mt-2">
                      TVA réduite 10% • Installation comprise
                    </div>
                  </>
                ) : (
                  <div className="text-red-600 font-bold text-base">
                    ⚠️ Configuration impossible
                    <div className="text-sm font-normal mt-1">Ajustez les dimensions</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Options & Couleur */}
          <div className="space-y-6">
            {/* Couleur Armature */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                <Palette className="w-5 h-5 text-purple-600" />
                Couleur Armature
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                  <input
                    type="radio"
                    name="colorChoice"
                    checked={!isCustomColor}
                    onChange={() => setIsCustomColor(false)}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Standard</div>
                    <div className="text-xs text-gray-600">Blanc (9010), Beige (1015), Anthracite (7016)</div>
                  </div>
                  <div className="font-bold text-green-600">Inclus</div>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                  <input
                    type="radio"
                    name="colorChoice"
                    checked={isCustomColor}
                    onChange={() => setIsCustomColor(true)}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">RAL Spécifique</div>
                    <div className="text-xs text-gray-600">Plus de 200 couleurs disponibles</div>
                  </div>
                  {colorSupplementFree ? (
                    <div className="text-green-600 font-bold text-sm">
                      <div className="line-through text-gray-400">+{colorSupplementAmount}€</div>
                      <div>OFFERT</div>
                    </div>
                  ) : (
                    <div className="font-bold text-blue-600">+{colorSupplementAmount}€</div>
                  )}
                </label>
              </div>
              {isArmorModel && width >= 6000 && (
                <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                  <p className="text-sm font-semibold text-green-800">
                    🎉 Bravo ! Pour un store de plus de 6m, la couleur personnalisée est offerte !
                  </p>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="border-t-2 border-gray-200 pt-4">
              <label className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                <Settings className="w-5 h-5 text-orange-600" />
                Options
              </label>
              <div className="space-y-2">
                {model.compatibility.led_arms && (
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                    <input
                      type="checkbox"
                      checked={ledArms}
                      onChange={(e) => setLedArms(e.target.checked)}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div className="flex-1 font-semibold text-gray-900">Éclairage LED Bras</div>
                  </label>
                )}
                {model.compatibility.led_box && (
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                    <input
                      type="checkbox"
                      checked={ledBox}
                      onChange={(e) => setLedBox(e.target.checked)}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div className="flex-1 font-semibold text-gray-900">Éclairage LED Coffre</div>
                  </label>
                )}
                {model.ceilingMountPrices && model.ceilingMountPrices.length > 0 && (
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                    <input
                      type="checkbox"
                      checked={ceilingMount}
                      onChange={(e) => setCeilingMount(e.target.checked)}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <div className="flex-1 font-semibold text-gray-900">Pose au Plafond</div>
                  </label>
                )}
              </div>
            </div>

            {/* Code Promo */}
            <div className="border-t-2 border-dashed border-gray-200 pt-4">
              <label className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                <Tag className="w-5 h-5 text-orange-600" />
                Code Promo
              </label>
              
              {!promoApplied ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError('');
                      }}
                      placeholder="Entrez votre code"
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none font-mono font-bold text-gray-900"
                      maxLength={20}
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim()}
                      className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors"
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
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-800 font-bold flex items-center gap-2">
                        ✅ Code <span className="font-mono">{promoCode}</span> appliqué
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
          </div>
        </div>

        {/* Boutons d'action - En pleine largeur */}
        <div className="space-y-3 mt-8 border-t-2 border-gray-200 pt-6">
          <Link
            href={`/assistant?model=${model.id}&width=${width}&projection=${projection}`}
            onClick={() => {
              // Enregistrer les données dans sessionStorage pour l'Assistant IA
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('storal_width', width.toString());
                sessionStorage.setItem('storal_projection', projection.toString());
                sessionStorage.setItem('storal_modelId', model.id);
                // Enregistrer aussi la toile si elle existe dans le cart
                // (sera géré par l'assistant)
              }
            }}
            className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            🚀 Finaliser avec l'Assistant IA
          </Link>
          <Link
            href="/contact"
            className="block w-full bg-white hover:bg-gray-50 text-gray-800 text-center font-semibold py-4 px-6 rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all"
          >
            📞 Demander un devis personnalisé
          </Link>
        </div>

        {/* Note info */}
        <div className="text-xs text-gray-500 text-center pt-2">
          💡 Besoin d'aide ? Notre assistant IA vous guide pas à pas
        </div>
      </div>
    </div>
  );
}
