'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { STORE_MODELS, type StoreModel } from '@/lib/catalog-data';

interface ModelSelectorModalProps {
  isOpen: boolean;
  filterShape?: 'carre' | 'galbe' | 'all';
  filterType?: 'coffre' | 'monobloc';
  onClose: () => void;
  onSelect: (model: StoreModel) => void;
}

export default function ModelSelectorModal({
  isOpen,
  filterShape = 'all',
  filterType,
  onClose,
  onSelect,
}: ModelSelectorModalProps) {
  const filteredModels = useMemo(() => {
    console.log('🔍 ModelSelector - filterShape:', filterShape, 'filterType:', filterType);
    
    // Étape 1 : Filtrer par shape
    let filtered = STORE_MODELS.filter((model) => {
      if (filterShape === 'all') return true;
      return model.shape === filterShape;
    });

    console.log('📋 Après filtre shape:', filtered.map(m => `${m.id} (${m.shape})`));

    // Étape 2 : Filtrer par type si spécifié
    if (filterType) {
      filtered = filtered.filter((model) => model.type === filterType);
      console.log('📋 Après filtre type:', filtered.map(m => `${m.id} (${m.type})`));
    }

    // Étape 3 : Exclure les promos si shape === 'carre'
    if (filterShape === 'carre') {
      filtered = filtered.filter((model) => !model.is_promo);
      console.log('📋 Après exclusion promos (carré):', filtered.map(m => `${m.id}`));
    }

    // Étape 4 : Trier les promos en premier (si galbe ou all)
    if (filterShape === 'galbe' || filterShape === 'all') {
      filtered = [...filtered].sort((a, b) => Number(b.is_promo) - Number(a.is_promo));
      console.log('📋 Après tri promos:', filtered.map(m => `${m.id} (promo: ${m.is_promo})`));
    }

    console.log('✅ Final filtered models:', filtered.length, filtered.map(m => m.id));
    return filtered;
  }, [filterShape, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Choisissez votre modèle</h3>
            <p className="text-sm text-gray-500">Sélectionnez le store qui vous convient</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-76px)]">
          {filteredModels.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              Aucun modèle ne correspond à ces critères.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => onSelect(model)}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="relative h-36 w-full bg-gray-100">
                    <Image
                      src={model.image}
                      alt={model.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {model.is_promo && (
                      <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold uppercase text-white shadow">
                        Promo
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-gray-900">{model.name}</h4>
                      <span className="text-xs font-semibold uppercase text-gray-400">
                        {model.type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{model.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="rounded-full bg-gray-100 px-2 py-1">Max {model.compatibility.max_width}mm</span>
                      {model.compatibility.led_arms && (
                        <span className="rounded-full bg-gray-100 px-2 py-1">LED bras</span>
                      )}
                      {model.compatibility.led_box && (
                        <span className="rounded-full bg-gray-100 px-2 py-1">LED coffre</span>
                      )}
                      {model.compatibility.lambrequin_enroulable && (
                        <span className="rounded-full bg-gray-100 px-2 py-1">Lambrequin</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
