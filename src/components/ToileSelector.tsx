'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

type ToileType = {
  id: number;
  name: string;
  manufacturer: string;
  code: string;
  purchasePriceHT: number;
  salesCoefficient: number;
  salePriceHT: string;
  composition?: string;
  description?: string;
  defaultWidth?: number;
};

type ToileColor = {
  id: number;
  ref: string;
  name: string;
  collection?: string;
  category?: string;
  colorFamily?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  colorHex?: string;
  colorRgb?: { r: number; g: number; b: number };
  stockStatus?: string;
  tags?: string[];
  description?: string;
  toileType: {
    id: number;
    name: string;
    manufacturer: string;
    code: string;
  };
};

type ToileSelectorProps = {
  productSlug: string;
  surfaceM2: number;
  onToileSelect: (toileTypeId: number | null, toileColorId: number | null, priceHT: number) => void;
  selectedToileTypeId?: number | null;
  selectedToileColorId?: number | null;
};

const COLOR_FAMILIES = [
  'all',
  'Blanc',
  'Noir',
  'Gris',
  'Bleu',
  'Vert',
  'Rouge',
  'Rose',
  'Orange',
  'Jaune',
  'Violet',
  'Marron',
  'Beige',
  'Neutre',
];

export default function ToileSelector({
  productSlug,
  surfaceM2,
  onToileSelect,
  selectedToileTypeId,
  selectedToileColorId,
}: ToileSelectorProps) {
  const [toileTypes, setToileTypes] = useState<ToileType[]>([]);
  const [toileColors, setToileColors] = useState<ToileColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<number | null>(selectedToileTypeId || null);
  const [selectedColor, setSelectedColor] = useState<number | null>(selectedToileColorId || null);
  const [colorFamilyFilter, setColorFamilyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [patternFilter, setPatternFilter] = useState<'all' | 'uni' | 'decor'>('all');
  const [zoomedImage, setZoomedImage] = useState<{ url: string; name: string; ref: string } | null>(null);

  // Charger les types de toiles compatibles
  useEffect(() => {
    const fetchToileTypes = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/toiles?productSlug=${productSlug}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des toiles');
        }

        const data = await response.json();
        if (data.success && data.types) {
          setToileTypes(data.types);

          // Sélectionner automatiquement le premier type si aucun n'est sélectionné
          if (!selectedType && data.types.length > 0) {
            setSelectedType(data.types[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur chargement types:', err);
        setError('Impossible de charger les toiles. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchToileTypes();
  }, [productSlug]);

  // Charger les couleurs quand un type est sélectionné
  useEffect(() => {
    if (!selectedType) {
      setToileColors([]);
      setSelectedColor(null);
      return;
    }

    const fetchColors = async () => {
      setLoading(true);
      setError('');

      try {
        let url = `/api/toiles/colors?toileTypeId=${selectedType}`;
        if (colorFamilyFilter !== 'all') {
          url += `&colorFamily=${colorFamilyFilter}`;
        }
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (patternFilter !== 'all') {
          url += `&pattern=${patternFilter}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des couleurs');
        }

        const data = await response.json();
        if (data.success && data.colors) {
          setToileColors(data.colors);

          // Sélectionner automatiquement la première couleur si aucune n'est sélectionnée
          if (!selectedColor && data.colors.length > 0) {
            setSelectedColor(data.colors[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur chargement couleurs:', err);
        setError('Impossible de charger les couleurs. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, [selectedType, colorFamilyFilter, searchQuery, patternFilter]);

  // Notifier le parent quand la sélection change
  useEffect(() => {
    if (selectedType && selectedColor) {
      const selectedTypeData = toileTypes.find(t => t.id === selectedType);
      if (selectedTypeData) {
        const priceHT = parseFloat(selectedTypeData.salePriceHT) * surfaceM2;
        onToileSelect(selectedType, selectedColor, priceHT);
      }
    } else {
      onToileSelect(null, null, 0);
    }
  }, [selectedType, selectedColor, surfaceM2]);

  const handleTypeChange = (typeId: number) => {
    setSelectedType(typeId);
    setSelectedColor(null); // Réinitialiser la couleur
  };

  const handleColorClick = (colorId: number) => {
    setSelectedColor(colorId);
  };

  const selectedTypeData = toileTypes.find(t => t.id === selectedType);
  const selectedColorData = toileColors.find(c => c.id === selectedColor);

  return (
    <div className="space-y-6">
      {/* Badge info filtrage */}
      {toileTypes.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <span className="font-semibold">✓ Filtré pour ce modèle</span>
          <span>|</span>
          <span>{toileTypes.length} type{toileTypes.length > 1 ? 's' : ''} de toile compatible{toileTypes.length > 1 ? 's' : ''}</span>
        </div>
      )}

      {toileTypes.length === 0 && (
        <div className="p-4 text-center border border-rose-200 rounded-lg bg-rose-50">
          <p className="text-sm font-medium text-rose-900 mb-1">🚧 Aucune toile disponible</p>
          <p className="text-xs text-rose-800">
            Les toiles pour ce modèle de store ne sont pas encore configurées.
          </p>
        </div>
      )}

      {/* Sélection du type de toile */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de toile
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {toileTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleTypeChange(type.id)}
              className={`p-4 border-2 rounded-lg text-left transition ${
                selectedType === type.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{type.name}</p>
                  <p className="text-xs text-gray-500">{type.manufacturer}</p>
                  {type.composition && (
                    <p className="text-xs text-gray-600 mt-1">{type.composition}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">{type.salePriceHT}€/m²</p>
                  <p className="text-xs text-gray-500">HT</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedTypeData && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Surface calculée:</span> {surfaceM2.toFixed(2)} m²
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Prix toile:</span>{' '}
              <span className="text-blue-600 font-bold">
                {(parseFloat(selectedTypeData.salePriceHT) * surfaceM2).toFixed(2)}€ HT
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Filtres de couleur */}
      {selectedType && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Couleur de toile ({toileColors.length} disponible{toileColors.length > 1 ? 's' : ''})
          </label>

          {/* Onglets Uni / Décor */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setPatternFilter('all')}
              className={`px-6 py-3 text-sm font-medium transition border-b-2 ${
                patternFilter === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Toutes
            </button>
            <button
              type="button"
              onClick={() => setPatternFilter('uni')}
              className={`px-6 py-3 text-sm font-medium transition border-b-2 ${
                patternFilter === 'uni'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Toiles Unies
            </button>
            <button
              type="button"
              onClick={() => setPatternFilter('decor')}
              className={`px-6 py-3 text-sm font-medium transition border-b-2 ${
                patternFilter === 'decor'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Toiles Décor
            </button>
          </div>

          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="Rechercher une référence ou un nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Filtres famille de couleur */}
          <div className="flex flex-wrap gap-2">
            {COLOR_FAMILIES.map((family) => (
              <button
                key={family}
                type="button"
                onClick={() => setColorFamilyFilter(family)}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  colorFamilyFilter === family
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {family === 'all' ? 'Toutes' : family}
              </button>
            ))}
          </div>

          {/* Grille de couleurs */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Chargement des couleurs...</p>
            </div>
          )}

          {!loading && toileColors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune couleur disponible pour cette toile.</p>
            </div>
          )}

          {!loading && toileColors.length > 0 && (
            <div className="flex flex-wrap gap-3 max-h-[500px] overflow-y-auto p-2">
              {toileColors.map((color) => (
                <div key={color.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleColorClick(color.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (color.imageUrl || color.thumbnailUrl) {
                        setZoomedImage({
                          url: color.imageUrl || color.thumbnailUrl || '',
                          name: color.name,
                          ref: color.ref
                        });
                      }
                    }}
                    className={`relative w-24 h-24 border-2 rounded-md overflow-hidden transition cursor-pointer ${
                      selectedColor === color.id
                        ? 'border-blue-600 ring-2 ring-blue-300'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                    title={`Clic: sélectionner | Clic droit: agrandir | ${color.ref} - ${color.name}`}
                  >
                  {/* Image de la toile */}
                  {color.thumbnailUrl || color.imageUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={color.thumbnailUrl || color.imageUrl}
                        alt={color.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : color.colorHex ? (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: color.colorHex }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Pas d'aperçu</span>
                    </div>
                  )}

                  {/* Badge de sélection */}
                  {selectedColor === color.id && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Informations au survol */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-2 text-white">
                    <p className="text-xs font-bold text-center">{color.ref}</p>
                    <p className="text-xs text-center line-clamp-2">{color.name}</p>
                    {color.stockStatus && color.stockStatus !== 'in_stock' && (
                      <p className="text-xs text-yellow-300 mt-1">
                        {color.stockStatus === 'out_of_stock' ? 'Rupture' : 'Sur commande'}
                      </p>
                    )}
                  </div>
                  </button>
                  {/* Icône zoom */}
                  {(color.imageUrl || color.thumbnailUrl) && (
                    <button
                      type="button"
                      onClick={() => setZoomedImage({
                        url: color.imageUrl || color.thumbnailUrl || '',
                        name: color.name,
                        ref: color.ref
                      })}
                      className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10 hover:bg-blue-700"
                      title="Agrandir l'image"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Résumé de sélection */}
      {selectedTypeData && selectedColorData && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-green-900 mb-2">✓ Toile sélectionnée</p>
          <div className="flex items-center gap-3">
            {(selectedColorData.thumbnailUrl || selectedColorData.imageUrl) && (
              <img
                src={selectedColorData.thumbnailUrl || selectedColorData.imageUrl}
                alt={selectedColorData.name}
                className="w-16 h-16 rounded border border-green-300 object-cover"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {selectedTypeData.name}
              </p>
              <p className="text-sm text-gray-700">
                {selectedColorData.ref} - {selectedColorData.name}
              </p>
              {selectedColorData.collection && (
                <p className="text-xs text-gray-500">
                  Collection: {selectedColorData.collection}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Modal de zoom */}
      {zoomedImage && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setZoomedImage(null)}
        >
          <div 
            className="relative w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100 z-10 shadow-lg"
              title="Fermer (ou cliquer n'importe où)"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="max-w-[95vw] max-h-[95vh] bg-white rounded-lg shadow-2xl p-4 flex flex-col">
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <img
                  src={zoomedImage.url}
                  alt={zoomedImage.name}
                  className="max-w-full max-h-[85vh] object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              <div className="mt-4 text-center flex-shrink-0">
                <p className="text-lg font-bold text-gray-900">{zoomedImage.ref}</p>
                <p className="text-base text-gray-700">{zoomedImage.name}</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
