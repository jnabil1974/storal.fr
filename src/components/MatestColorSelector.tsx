'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface MatestColor {
  id: number
  ral_code: string
  name: string
  finish: string
  image_url?: string | null
}

interface MatestColorSelectorProps {
  productSlug: string
  onColorSelect: (colorId: number, ralCode: string, name: string, finish: string) => void
}

export default function MatestColorSelector({ productSlug, onColorSelect }: MatestColorSelectorProps) {
  const [colors, setColors] = useState<MatestColor[]>([])
  const [finishTypes, setFinishTypes] = useState<string[]>([])
  const [selectedFinish, setSelectedFinish] = useState<string>('brillant')
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [zoomedImage, setZoomedImage] = useState<{ url: string; name: string; ral: string } | null>(null)

  useEffect(() => {
    loadColors()
  }, [productSlug])

  const loadColors = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/matest-colors?productSlug=${productSlug}`)
      const data = await res.json()
      
      if (data.colors && Array.isArray(data.colors)) {
        setColors(data.colors)
        
        // Extraire les types de finition uniques
        const types = [...new Set(data.colors.map((c: MatestColor) => c.finish))] as string[]
        setFinishTypes(types)
        
        // Sélectionner le premier type disponible
        if (types.length > 0 && typeof types[0] === 'string') {
          setSelectedFinish(types[0])
        }
      }
    } catch (err) {
      console.error('Erreur chargement couleurs Matest:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleColorClick = (color: MatestColor) => {
    setSelectedColorId(color.id)
    onColorSelect(color.id, color.ral_code, color.name, color.finish)
  }

  const filteredColors = colors.filter(c => c.finish === selectedFinish)

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm">Chargement des couleurs...</p>
      </div>
    )
  }

  if (colors.length === 0) {
    return (
      <div className="p-4 text-center border border-rose-200 rounded-lg bg-rose-50">
        <p className="text-sm font-medium text-rose-900 mb-1">🚧 Aucune couleur disponible</p>
        <p className="text-xs text-rose-800">
          Les couleurs Matest pour ce modèle de store ne sont pas encore configurées.
          <br />
          Veuillez contacter l'administrateur pour associer des types de finition à ce produit.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Badge info filtrage */}
      <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
        <span className="font-semibold">✓ Filtré pour ce modèle</span>
        <span>|</span>
        <span>{colors.length} couleur{colors.length > 1 ? 's' : ''} disponible{colors.length > 1 ? 's' : ''}</span>
      </div>

      {/* Sélecteur de type de finition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de finition
        </label>
        <div className="flex flex-wrap gap-2">
          {finishTypes.map((finish) => (
            <button
              key={finish}
              onClick={() => setSelectedFinish(finish)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFinish === finish
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {finish.charAt(0).toUpperCase() + finish.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grille de couleurs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choisir une couleur {selectedFinish}
        </label>
        <div className="flex flex-wrap gap-3 max-h-96 overflow-y-auto p-2 border rounded-lg">
          {filteredColors.map((color) => (
            <div key={color.id} className="relative group">
              <button
                onClick={() => handleColorClick(color)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (color.image_url) {
                    setZoomedImage({
                      url: color.image_url,
                      name: color.name || '',
                      ral: color.ral_code ? `RAL ${color.ral_code}` : ''
                    });
                  }
                }}
                className={`relative w-24 h-24 border-2 rounded-md overflow-hidden transition cursor-pointer ${
                  selectedColorId === color.id
                    ? 'border-rose-700 ring-2 ring-rose-200'
                    : 'border-slate-200 hover:border-rose-300'
                }`}
                title={`Clic: sélectionner | Clic droit: agrandir | ${color.ral_code ? `RAL ${color.ral_code}` : ''} ${color.name || ''}`}
              >
              {/* Image de la couleur */}
              {color.image_url ? (
                <div className="relative w-full h-full">
                  <img
                    src={color.image_url}
                    alt={color.ral_code ? `RAL ${color.ral_code}` : color.name || 'Couleur'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <span className="text-xs text-slate-500">Pas d'aperçu</span>
                </div>
              )}

              {/* Badge de sélection */}
              {selectedColorId === color.id && (
                <div className="absolute top-1 right-1 bg-rose-700 text-white rounded-full w-6 h-6 flex items-center justify-center">
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
                {color.ral_code && <p className="text-xs font-bold text-center">RAL {color.ral_code}</p>}
                {color.name && <p className="text-xs text-center line-clamp-2">{color.name}</p>}
              </div>
              </button>
              {/* Icône zoom */}
              {color.image_url && (
                <button
                  type="button"
                  onClick={() => setZoomedImage({
                    url: color.image_url || '',
                    name: color.name || '',
                    ral: color.ral_code ? `RAL ${color.ral_code}` : ''
                  })}
                  className="absolute -top-1 -right-1 bg-rose-700 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10 hover:bg-rose-800"
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
        
        {filteredColors.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Aucune couleur disponible pour ce type de finition
          </p>
        )}
      </div>

      {/* Info sur la couleur sélectionnée */}
      {selectedColorId && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            Couleur sélectionnée :
          </p>
          {colors.find(c => c.id === selectedColorId) && (
            <div className="flex items-center gap-3">
              {colors.find(c => c.id === selectedColorId)?.image_url && (
                <img
                  src={colors.find(c => c.id === selectedColorId)?.image_url || ''}
                  alt={colors.find(c => c.id === selectedColorId)?.name || 'Couleur'}
                  className="w-16 h-16 rounded border-2 border-rose-300 object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {colors.find(c => c.id === selectedColorId)?.ral_code && 
                    `RAL ${colors.find(c => c.id === selectedColorId)?.ral_code}`}
                </p>
                <p className="text-sm text-gray-700">
                  {colors.find(c => c.id === selectedColorId)?.name}
                  {' '}({colors.find(c => c.id === selectedColorId)?.finish})
                </p>
              </div>
            </div>
          )}
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
                {zoomedImage.ral && <p className="text-lg font-bold text-gray-900">{zoomedImage.ral}</p>}
                <p className="text-base text-gray-700">{zoomedImage.name}</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
