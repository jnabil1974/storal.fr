'use client';

import { useState } from 'react';
import { type StoreModel } from '@/lib/catalog-data';

export type LambrequinConfig = 
  | { type: 'none' }
  | { type: 'fixe'; shape: 'droit' | 'vagues'; height: number }
  | { type: 'enroulable'; motorized: boolean };

interface LambrequinSelectorProps {
  model: StoreModel;
  selected?: LambrequinConfig;
  onSelect: (config: LambrequinConfig) => void;
}

const SVGLambrequinDroit = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Barre supérieure */}
    <rect x="20" y="20" width="160" height="12" fill="#D4A574" rx="2" />
    {/* Tissu simple droit */}
    <rect x="20" y="32" width="160" height="78" fill="#E8B4A8" stroke="#C99B8A" strokeWidth="1.5" />
    {/* Plis légers verticaux */}
    <line x1="60" y1="32" x2="60" y2="110" stroke="#D4A574" strokeWidth="1" opacity="0.5" />
    <line x1="100" y1="32" x2="100" y2="110" stroke="#D4A574" strokeWidth="1" opacity="0.5" />
    <line x1="140" y1="32" x2="140" y2="110" stroke="#D4A574" strokeWidth="1" opacity="0.5" />
  </svg>
);

const SVGLambrequinVagues = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Barre supérieure */}
    <rect x="20" y="20" width="160" height="12" fill="#D4A574" rx="2" />
    {/* Tissu avec bord ondulé */}
    <defs>
      <path
        id="wavePath"
        d="M 20 32 Q 40 22, 60 32 T 100 32 T 140 32 T 180 32 L 180 110 L 20 110 Z"
        fill="#E8B4A8"
        stroke="#C99B8A"
        strokeWidth="1.5"
      />
    </defs>
    <path d="M 20 32 Q 40 22, 60 32 T 100 32 T 140 32 T 180 32 L 180 110 L 20 110 Z" fill="#E8B4A8" stroke="#C99B8A" strokeWidth="1.5" />
    {/* Plis */}
    <line x1="60" y1="40" x2="60" y2="110" stroke="#D4A574" strokeWidth="1" opacity="0.5" />
    <line x1="100" y1="40" x2="100" y2="110" stroke="#D4A574" strokeWidth="1" opacity="0.5" />
    <line x1="140" y1="40" x2="140" y2="110" stroke="#D4A574" strokeWidth="1" opacity="0.5" />
  </svg>
);

const SVGLambrequinEnroulable = () => (
  <svg viewBox="0 0 200 140" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Store principal (supérieur) */}
    <rect x="20" y="20" width="160" height="12" fill="#8B7355" rx="2" />
    <rect x="20" y="32" width="160" height="35" fill="#D4A574" stroke="#8B7355" strokeWidth="1.5" opacity="0.8" />
    
    {/* Rouleau intermédiaire */}
    <circle cx="100" cy="67" r="8" fill="#5A4A3A" stroke="#3A2A1A" strokeWidth="1.5" />
    
    {/* Store enroulable (partie inférieure) qui descend */}
    <g opacity="0.9">
      <rect x="20" y="75" width="160" height="50" fill="#E8B4A8" stroke="#C99B8A" strokeWidth="1.5" />
      {/* Flèche indiquant le mouvement */}
      <path d="M 190 90 L 190 110 M 185 105 L 190 110 L 195 105" stroke="#4B5563" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

const SVGNoLambrequin = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Barre supérieure */}
    <rect x="20" y="20" width="160" height="12" fill="#D4A574" rx="2" />
    {/* Ligne de tissu fine */}
    <rect x="20" y="32" width="160" height="6" fill="#E8B4A8" />
    {/* Cercle et barres en X pour "non" */}
    <circle cx="100" cy="75" r="30" fill="none" stroke="#EF4444" strokeWidth="2.5" opacity="0.7" />
    <line x1="75" y1="50" x2="125" y2="100" stroke="#EF4444" strokeWidth="2.5" opacity="0.7" />
    <line x1="125" y1="50" x2="75" y2="100" stroke="#EF4444" strokeWidth="2.5" opacity="0.7" />
  </svg>
);

interface LambrequinOption {
  id: string;
  label: string;
  description?: string;
  config: LambrequinConfig;
  icon: React.ReactNode;
  price?: number;
  available: boolean;
  incompatibleMessage?: string;
}

export default function LambrequinSelector({
  model,
  selected,
  onSelect,
}: LambrequinSelectorProps) {
  const { lambrequin_fixe, lambrequin_enroulable } = model.compatibility;
  const [motorizedEnroulable, setMotorizedEnroulable] = useState<boolean>(
    selected?.type === 'enroulable' ? selected.motorized : false
  );
  const [fixeHeight, setFixeHeight] = useState<number>(
    selected?.type === 'fixe' ? selected.height : 220
  );

  const options: LambrequinOption[] = [
    {
      id: 'none',
      label: '🚫 Pas de Lambrequin',
      description: 'Store sans protection inférieure',
      config: { type: 'none' },
      icon: <SVGNoLambrequin />,
      available: true,
    },
    {
      id: 'fixe-droit',
      label: '📏 Lambrequin Fixe',
      description: 'Forme Droit',
      config: { type: 'fixe', shape: 'droit', height: fixeHeight },
      icon: <SVGLambrequinDroit />,
      price: 59,
      available: lambrequin_fixe,
      incompatibleMessage: 'Non compatible avec ce modèle',
    },
    {
      id: 'fixe-vagues',
      label: '〰️ Lambrequin Fixe',
      description: 'Grandes Vagues',
      config: { type: 'fixe', shape: 'vagues', height: fixeHeight },
      icon: <SVGLambrequinVagues />,
      price: 59,
      available: lambrequin_fixe,
      incompatibleMessage: 'Non compatible avec ce modèle',
    },
    {
      id: 'enroulable',
      label: '↕️ Lambrequin Enroulable',
      description: 'Store dans le Store',
      config: { type: 'enroulable' },
      icon: <SVGLambrequinEnroulable />,
      available: lambrequin_enroulable,
      incompatibleMessage: 'Non compatible avec ce modèle',
    },
  ];

  const isSelected = (option: LambrequinOption) => {
    if (!selected) return false;
    if (option.id === 'none') return selected.type === 'none';
    if (option.id === 'fixe-droit')
      return selected.type === 'fixe' && selected.shape === 'droit';
    if (option.id === 'fixe-vagues')
      return selected.type === 'fixe' && selected.shape === 'vagues';
    if (option.id === 'enroulable') return selected.type === 'enroulable';
    return false;
  };

  const handleEnroulableSelect = () => {
    onSelect({ type: 'enroulable', motorized: motorizedEnroulable });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Lambrequin
        </h2>
        <p className="text-gray-600">
          Choisissez l'option de finition inférieure pour votre store
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              if (option.available) {
                if (option.id === 'enroulable') {
                  handleEnroulableSelect();
                } else {
                  onSelect(option.config);
                }
              }
            }}
            disabled={!option.available}
            title={!option.available ? option.incompatibleMessage : ''}
            className={`
              relative h-64 rounded-lg border-2 transition-all duration-200
              flex flex-col items-center justify-between p-3 text-center
              ${
                isSelected(option)
                  ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }
              ${!option.available ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:shadow-md'}
            `}
          >
            {/* SVG Icon Container */}
            <div className="w-20 h-20 flex-shrink-0">
              {option.icon}
            </div>

            {/* Label et Description */}
            <div className="space-y-1 flex-1 flex flex-col justify-center">
              <h3 className="font-semibold text-sm text-gray-900 leading-snug">
                {option.label}
              </h3>
              {option.description && (
                <p className="text-xs text-gray-600 leading-tight">
                  {option.description}
                </p>
              )}
            </div>

            {/* Prix */}
            {option.price && option.available && (
              <div className="text-blue-600 font-bold text-sm">
                +{option.price} €
              </div>
            )}

            {/* Prix Enroulable dynamique */}
            {option.id === 'enroulable' && option.available && (
              <div className="text-blue-600 font-bold text-sm">
                {motorizedEnroulable ? (
                  <span className="italic text-amber-600">Sur devis</span>
                ) : (
                  '+59 €'
                )}
              </div>
            )}

            {/* Badge Non compatible */}
            {!option.available && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                ✗
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Section Hauteur pour Lambrequin Fixe */}
      {selected?.type === 'fixe' && lambrequin_fixe && (
        <div className="mt-8 p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hauteur du lambrequin
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">
                Hauteur : <span className="text-purple-600 font-bold">{fixeHeight} mm</span>
              </label>
              <input
                type="range"
                min="150"
                max="300"
                step="10"
                value={fixeHeight}
                onChange={(e) => {
                  const newHeight = parseInt(e.target.value, 10);
                  setFixeHeight(newHeight);
                  // Mettre à jour la sélection avec la nouvelle hauteur
                  if (selected?.type === 'fixe') {
                    onSelect({ ...selected, height: newHeight });
                  }
                }}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>150 mm</span>
                <span>220 mm (défaut)</span>
                <span>300 mm</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-purple-100">
              <p><strong>📐 Hauteur Standard :</strong> 220 mm (par défaut)</p>
              <p className="text-xs mt-2">Vous pouvez ajuster la hauteur entre 150 et 300 mm sans surcoût.</p>
            </div>
          </div>
        </div>
      )}

      {/* Section Motorisation pour Enroulable */}
      {selected?.type === 'enroulable' && lambrequin_enroulable && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mode d'enroulement
          </h3>
          <div className="space-y-3">
            {/* Option Manuel */}
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="motorization"
                checked={!motorizedEnroulable}
                onChange={() => {
                  setMotorizedEnroulable(false);
                  onSelect({ type: 'enroulable', motorized: false });
                }}
                className="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <span className="ml-3 flex-1 group-hover:bg-blue-100 p-2 rounded transition">
                <span className="font-medium text-gray-900">🔧 Manuel (Treuil)</span>
                <p className="text-sm text-gray-600 mt-1">
                  Enroulement par treuil manuel avec manivelle
                </p>
              </span>
              <span className="text-green-600 font-semibold ml-2">+59 €</span>
            </label>

            {/* Option Motorisé */}
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="motorization"
                checked={motorizedEnroulable}
                onChange={() => {
                  setMotorizedEnroulable(true);
                  onSelect({ type: 'enroulable', motorized: true });
                }}
                className="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <span className="ml-3 flex-1 group-hover:bg-blue-100 p-2 rounded transition">
                <span className="font-medium text-gray-900">⚡ Motorisé</span>
                <p className="text-sm text-gray-600 mt-1">
                  Moteur électrique intégré pour télécommande
                </p>
              </span>
              <span className="text-blue-600 font-semibold ml-2">+219 €</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
