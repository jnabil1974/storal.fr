'use client';

import { useMemo, useState } from 'react';
import { STANDARD_COLORS, CUSTOM_COLORS, type ColorOption } from '@/lib/catalog-data';

interface ColorSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (color: ColorOption) => void;
}

export default function ColorSelectorModal({
  isOpen,
  onClose,
  onSelect,
}: ColorSelectorModalProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleColors = useMemo(() => {
    return showAll ? CUSTOM_COLORS : STANDARD_COLORS;
  }, [showAll]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Choisissez la couleur du coffre</h3>
            <p className="text-sm text-gray-500">Sélectionnez une teinte pour l'armature</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {visibleColors.map((color) => (
              <button
                key={color.id}
                onClick={() => onSelect(color)}
                className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 text-left hover:border-gray-300 hover:shadow-sm transition"
              >
                <span
                  className="h-8 w-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-semibold text-gray-800">{color.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              {showAll ? 'Masquer les autres couleurs' : 'Voir les autres couleurs'}
            </button>
            <p className="mt-2 text-xs text-gray-500">
              {showAll
                ? 'Aperçu partiel du nuancier complet Matest (exemples).' 
                : 'Les couleurs standard sont disponibles sans attente supplémentaire.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
