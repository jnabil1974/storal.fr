'use client';

import React, { useMemo, useState } from 'react';
import { STATIC_FABRICS, type ToileColor } from '@/lib/static-catalog-data';

interface LambrequinFabricSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (fabric: { lambrequin_fabric_id: string; name: string }) => void;
}

export default function LambrequinFabricSelector({
  isOpen,
  onClose,
  onSelect,
}: LambrequinFabricSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrer uniquement les toiles pour lambrequin enroulable
  const lambrequinFabrics = useMemo(() => {
    let filtered = STATIC_FABRICS.filter(f => f.category === 'lambrequin_enroulable');

    // Filtre par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        f =>
          f.ref.toLowerCase().includes(search) ||
          f.name.toLowerCase().includes(search) ||
          f.collection?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [searchTerm]);

  const handleFabricClick = (fabric: ToileColor) => {
    console.log('✅ Lambrequin fabric selected:', fabric.ref, fabric.name);
    onSelect({
      lambrequin_fabric_id: fabric.ref,
      name: fabric.name,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden animate-scale-in">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Toile Technique Lambrequin Enroulable</h2>
            <p className="text-purple-100 text-sm mt-1">
              Toiles micro-perforées Soltis pour votre lambrequin motorisé
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une référence ou collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Choisir entre Soltis 86 et 92 :</p>
              <ul className="space-y-1 text-blue-800">
                <li>• <strong>Soltis 86</strong> : Toile micro-perforée idéale pour <strong>garder la vue sur le jardin</strong> tout en protégeant du soleil</li>
                <li>• <strong>Soltis 92</strong> : Toile plus opaque, <strong>plus performante contre la chaleur</strong>, vue réduite</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FABRICS LIST */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {lambrequinFabrics.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg">Aucune toile technique trouvée</p>
              <p className="text-sm mt-1">Essayez de modifier votre recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lambrequinFabrics.map((fabric) => (
                <div
                  key={fabric.ref}
                  onClick={() => handleFabricClick(fabric)}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex gap-4 items-center">
                    {/* Color Swatch */}
                    <div
                      className="w-20 h-20 rounded-lg flex-shrink-0 border-2 border-gray-200 group-hover:border-purple-400 transition-colors"
                      style={{
                        backgroundColor: fabric.color_hex || '#cccccc',
                      }}
                    />
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-lg truncate">
                        {fabric.collection}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        Réf: {fabric.ref}
                      </div>
                      {fabric.description && (
                        <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {fabric.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {lambrequinFabrics.length} toile{lambrequinFabrics.length > 1 ? 's' : ''} disponible{lambrequinFabrics.length > 1 ? 's' : ''}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
