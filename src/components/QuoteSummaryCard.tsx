'use client';

import Image from 'next/image';
import { Ruler, Palette, Zap, Wind } from 'lucide-react';
import { STORE_MODELS, FRAME_COLORS, FABRICS, type LambrequinConfig } from '@/lib/catalog-data';

interface QuoteSummaryCardProps {
  modelId: string;
  width: number; // en mm
  projection: number; // en mm
  colorId: string;
  fabricId: string;
  lambrequinConfig: LambrequinConfig;
  ledArms?: boolean;
  ledBox?: boolean;
  priceHT?: number;
  priceTTC?: number;
  motor?: 'io' | 'csi' | 'rts';
}

export default function QuoteSummaryCard({
  modelId,
  width,
  projection,
  colorId,
  fabricId,
  lambrequinConfig,
  ledArms = false,
  ledBox = false,
  priceHT,
  priceTTC,
  motor = 'io',
}: QuoteSummaryCardProps) {
  // Récupérer les données
  const model = STORE_MODELS[modelId];
  const color = FRAME_COLORS.find(c => c.id === colorId);
  const fabric = FABRICS.find(f => f.id === fabricId);

  if (!model || !color) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        Erreur : Modèle ou couleur non trouvé
      </div>
    );
  }

  // Conversion en cm pour affichage
  const widthCm = width / 10;
  const projectionCm = projection / 10;

  // Déterminer le texte du lambrequin
  const getLambrequinLabel = () => {
    if (lambrequinConfig.type === 'none') return null;
    if (lambrequinConfig.type === 'fixe') {
      return {
        label: `Lambrequin Fixe (${lambrequinConfig.shape === 'droit' ? 'Forme Droit' : 'Forme Vagues'})`,
        info: 'Même toile que le store',
      };
    }
    if (lambrequinConfig.type === 'enroulable') {
      return {
        label: `Lambrequin Enroulable ${lambrequinConfig.motorized ? 'Motorisé' : 'Manuel'}`,
        info: 'Toile technique Soltis (micro-aérée)',
      };
    }
    return null;
  };

  const lambrequinLabel = getLambrequinLabel();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      {/* ========== EN-TÊTE ========== */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">{model.name}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Ruler className="w-4 h-4" />
          <span>
            <strong>{widthCm}cm</strong> × <strong>{projectionCm}cm</strong>
          </span>
        </div>
      </div>

      {/* ========== CONTENU PRINCIPAL ========== */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* --- COLONNE 1 : IMAGE --- */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200 min-h-64">
            {model.image && (
              <Image
                src={model.image}
                alt={model.name}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            )}
            {!model.image && (
              <div className="text-gray-400 text-center">
                <p className="text-sm">Image non disponible</p>
              </div>
            )}
          </div>

          {/* --- COLONNE 2 : DÉTAILS --- */}
          <div className="space-y-6">
            {/* Armature */}
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 mb-3">
                Couleur Armature
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full border-4 border-gray-300 shadow-md"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <div>
                  <p className="font-semibold text-gray-900">{color.name}</p>
                  <p className="text-sm text-gray-600">{color.id}</p>
                </div>
              </div>
            </div>

            {/* Toile */}
            {fabric && (
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-3">
                  Toile Principal
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-md bg-cover bg-center"
                    title={fabric.name}
                    style={{
                      backgroundImage: `url('${fabric.folder}/thumb.jpg')`,
                      backgroundColor: '#E8B4A8',
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{fabric.name}</p>
                    <p className="text-sm text-gray-600">Réf. {fabric.ref}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Motorisation */}
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 mb-3">
                Motorisation
              </p>
              <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <Wind className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-gray-900">
                  {motor === 'io' ? 'Somfy io-homecontrol' : motor === 'csi' ? 'Somfy CSI' : 'Somfy RTS'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========== OPTIONS ========== */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-4">Options</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LED */}
            {(ledArms || ledBox) && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Éclairage LED</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {ledArms && ledBox ? 'Bras + Coffre' : ledArms ? 'Bras' : 'Coffre'}
                  </p>
                </div>
              </div>
            )}

            {/* Lambrequin */}
            {lambrequinLabel && (
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Palette className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {lambrequinLabel.label}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{lambrequinLabel.info}</p>
                </div>
              </div>
            )}

            {/* Aucune option */}
            {!ledArms && !ledBox && !lambrequinLabel && (
              <p className="text-sm text-gray-500 italic col-span-full">
                Aucune option supplémentaire sélectionnée
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ========== PIED : PRIX ========== */}
      {(priceHT || priceTTC) && (
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-6">
          <div className="space-y-2">
            {priceHT && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Prix HT :</span>
                <span className="font-semibold text-gray-900">
                  {priceHT.toLocaleString('fr-FR')} €
                </span>
              </div>
            )}
            {priceTTC && (
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Prix TTC :</span>
                <span className="text-2xl font-bold text-green-600">
                  {priceTTC.toLocaleString('fr-FR')} €
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Prix valable sous réserve de disponibilité et de confirmation
          </p>
        </div>
      )}
    </div>
  );
}
