'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface MatestColor {
  id: number
  ral_code: string
  name: string
  finish: string
  image_url?: string | null
}

interface FinishType {
  id: number
  name: string
  icon?: string
  color?: string
  order_index: number
  product_slugs?: string[] | null
}

interface Product {
  slug: string
  name: string
}

export default function MatestColorsAdmin() {
  const [colors, setColors] = useState<MatestColor[]>([])
  const [finishTypes, setFinishTypes] = useState<FinishType[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [filterFinish, setFilterFinish] = useState<string>('all')
  const [newColor, setNewColor] = useState({
    ral_code: '',
    name: '',
    finish: 'brillant'
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editColor, setEditColor] = useState({
    ral_code: '',
    name: '',
    finish: 'brillant',
    image_url: null as string | null
  })
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [showTypeForm, setShowTypeForm] = useState(false)
  const [newType, setNewType] = useState({
    name: '',
    icon: '',
    color: '',
    product_slugs: [] as string[]
  })
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null)
  const [editType, setEditType] = useState<FinishType | null>(null)

  useEffect(() => {
    loadColors()
    loadFinishTypes()
    loadProducts()
  }, [])

  const loadColors = async () => {
    const res = await fetch('/api/admin/matest-colors')
    const data = await res.json()
    setColors(data.colors || [])
  }

  const loadFinishTypes = async () => {
    try {
      const res = await fetch('/api/admin/matest-finish-types')
      const data = await res.json()
      setFinishTypes(data.types || [])
      if (data.types && data.types.length > 0) {
        setNewColor(prev => ({ ...prev, finish: data.types[0].name }))
        setEditColor(prev => ({ ...prev, finish: data.types[0].name }))
      }
    } catch (err) {
      console.error('Erreur chargement types:', err)
    }
  }

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      setAvailableProducts(data.products || [])
    } catch (err) {
      console.error('Erreur chargement produits:', err)
    }
  }

  const uploadImage = async (file: File, finish: string, identifier: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('finish', finish)
    formData.append('identifier', identifier)
    
    const res = await fetch('/api/admin/upload-matest-image', {
      method: 'POST',
      body: formData
    })
    
    if (res.ok) {
      const data = await res.json()
      return data.imageUrl
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    let imageUrl = null
    
    // Uploader l'image si un fichier est sélectionné
    if (newImageFile) {
      setUploadingImage(true)
      const identifier = newColor.ral_code || newColor.name
      imageUrl = await uploadImage(newImageFile, newColor.finish, identifier)
      setUploadingImage(false)
    }
    
    const res = await fetch('/api/admin/matest-colors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newColor, image_url: imageUrl })
    })
    
    if (res.ok) {
      setNewColor({ ral_code: '', name: '', finish: 'brillant' })
      setNewImageFile(null)
      loadColors()
    }
    setLoading(false)
  }

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!newType.name.trim()) {
      alert('Veuillez entrer un nom')
      setLoading(false)
      return
    }

    const res = await fetch('/api/admin/matest-finish-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newType.name.toLowerCase(),
        icon: newType.icon,
        color: newType.color,
        order_index: finishTypes.length + 1,
        product_slugs: newType.product_slugs
      })
    })

    if (res.ok) {
      setNewType({ name: '', icon: '', color: '', product_slugs: [] })
      setShowTypeForm(false)
      await loadFinishTypes()
    } else {
      const data = await res.json()
      alert('Erreur: ' + data.error)
    }
    setLoading(false)
  }

  const deleteType = async (id: number) => {
    const ok = window.confirm('Supprimer ce type ?')
    if (!ok) return
    setLoading(true)

    const res = await fetch('/api/admin/matest-finish-types', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })

    if (res.ok) {
      await loadFinishTypes()
    }
    setLoading(false)
  }

  const toggleProductForNewType = (slug: string) => {
    setNewType(prev => {
      const current = prev.product_slugs || []
      if (current.includes(slug)) {
        return { ...prev, product_slugs: current.filter(s => s !== slug) }
      } else {
        return { ...prev, product_slugs: [...current, slug] }
      }
    })
  }

  const startEditType = (type: FinishType) => {
    setEditingTypeId(type.id)
    setEditType({ ...type, product_slugs: type.product_slugs || [] })
  }

  const cancelEditType = () => {
    setEditingTypeId(null)
    setEditType(null)
  }

  const saveEditType = async () => {
    if (!editType || !editingTypeId) return
    setLoading(true)

    const res = await fetch('/api/admin/matest-finish-types', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingTypeId,
        name: editType.name,
        icon: editType.icon,
        color: editType.color,
        product_slugs: editType.product_slugs || []
      })
    })

    if (res.ok) {
      await loadFinishTypes()
      cancelEditType()
    } else {
      const data = await res.json()
      alert('Erreur: ' + data.error)
    }
    setLoading(false)
  }

  const toggleProductForEditType = (slug: string) => {
    if (!editType) return
    setEditType(prev => {
      if (!prev) return prev
      const current = prev.product_slugs || []
      if (current.includes(slug)) {
        return { ...prev, product_slugs: current.filter(s => s !== slug) }
      } else {
        return { ...prev, product_slugs: [...current, slug] }
      }
    })
  }

  const startEdit = (color: MatestColor) => {
    setEditingId(color.id)
    setEditColor({
      ral_code: color.ral_code || '',
      name: color.name || '',
      finish: color.finish,
      image_url: color.image_url || null
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditColor({ ral_code: '', name: '', finish: 'brillant', image_url: null })
    setEditImageFile(null)
  }

  const saveEdit = async (id: number) => {
    setLoading(true)
    
    let imageUrl = editColor.image_url
    
    // Uploader la nouvelle image si un fichier est sélectionné
    if (editImageFile) {
      setUploadingImage(true)
      const identifier = editColor.ral_code || editColor.name
      const uploadedUrl = await uploadImage(editImageFile, editColor.finish, identifier)
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      }
      setUploadingImage(false)
    }
    
    const res = await fetch('/api/admin/matest-colors', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editColor, image_url: imageUrl })
    })

    if (res.ok) {
      await loadColors()
      cancelEdit()
    }
    setLoading(false)
  }

  const deleteColor = async (id: number) => {
    const ok = window.confirm('Supprimer cette couleur ?')
    if (!ok) return
    setLoading(true)
    const res = await fetch('/api/admin/matest-colors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })

    if (res.ok) {
      await loadColors()
    }
    setLoading(false)
  }

  const filteredColors = filterFinish === 'all'
    ? colors
    : colors.filter((c) => c.finish === filterFinish)

  // Utiliser les types depuis la BDD, ou les types par défaut
  const displayTypes = finishTypes.length > 0 
    ? finishTypes.map(t => t.name)
    : ['brillant', 'sablé', 'mat', 'promo', 'spéciale']

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Gestion Nuancier Matest</h1>
      
      {/* Gestion des types */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border border-purple-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Types de finition ({finishTypes.length})</h3>
          <button
            onClick={() => setShowTypeForm(!showTypeForm)}
            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
          >
            {showTypeForm ? '✕ Annuler' : '+ Ajouter type'}
          </button>
        </div>

        {/* Formulaire d'ajout de type */}
        {showTypeForm && (
          <form onSubmit={handleAddType} className="flex flex-wrap gap-2 items-end mb-4 pb-4 border-b">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium mb-1">Nom du type *</label>
              <select
                value={newType.name}
                onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                className="w-full px-2 py-1.5 border rounded text-sm"
                required
              >
                <option value="">-- Sélectionner --</option>
                <option value="brillant">Brillant</option>
                <option value="sablé">Sablé</option>
                <option value="mat">Mat</option>
                <option value="promo">Promo</option>
                <option value="spéciale">Spéciale</option>
                <option value="texturé">Texturé</option>
                <option value="satiné">Satiné</option>
                <option value="métallisé">Métallisé</option>
              </select>
            </div>

            <div className="w-20">
              <label className="block text-xs font-medium mb-1">Icône</label>
              <input
                type="text"
                value={newType.icon}
                onChange={(e) => setNewType({ ...newType, icon: e.target.value })}
                placeholder="🎨"
                maxLength={3}
                className="w-full px-2 py-1.5 border rounded text-sm text-center"
              />
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium mb-1">Couleur (hex)</label>
              <input
                type="text"
                value={newType.color}
                onChange={(e) => setNewType({ ...newType, color: e.target.value })}
                placeholder="#ff6b6b"
                className="w-full px-2 py-1.5 border rounded text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm whitespace-nowrap"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </form>
        )}

        {/* Cases à cocher pour produits compatibles (nouveau type) */}
        {showTypeForm && availableProducts.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded border">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Produits compatibles (stores)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableProducts.map((product) => (
                <label key={product.slug} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded">
                  <input
                    type="checkbox"
                    checked={newType.product_slugs.includes(product.slug)}
                    onChange={() => toggleProductForNewType(product.slug)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{product.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Liste des types */}
        <div className="space-y-2 mt-4">
          {finishTypes.map(type => (
            <div key={type.id}>
              {editingTypeId === type.id && editType ? (
                /* Mode édition */
                <div className="p-4 bg-purple-50 border-2 border-purple-400 rounded">
                  <div className="flex flex-wrap gap-2 items-end mb-3">
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-xs font-medium mb-1">Nom</label>
                      <select
                        value={editType.name}
                        onChange={(e) => setEditType({ ...editType, name: e.target.value })}
                        className="w-full px-2 py-1.5 border rounded text-sm"
                      >
                        <option value="">-- Sélectionner --</option>
                        <option value="brillant">Brillant</option>
                        <option value="sablé">Sablé</option>
                        <option value="mat">Mat</option>
                        <option value="promo">Promo</option>
                        <option value="spéciale">Spéciale</option>
                        <option value="texturé">Texturé</option>
                        <option value="satiné">Satiné</option>
                        <option value="métallisé">Métallisé</option>
                      </select>
                    </div>
                    <div className="w-20">
                      <label className="block text-xs font-medium mb-1">Icône</label>
                      <input
                        type="text"
                        value={editType.icon || ''}
                        onChange={(e) => setEditType({ ...editType, icon: e.target.value })}
                        className="w-full px-2 py-1.5 border rounded text-sm text-center"
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-xs font-medium mb-1">Couleur</label>
                      <input
                        type="text"
                        value={editType.color || ''}
                        onChange={(e) => setEditType({ ...editType, color: e.target.value })}
                        className="w-full px-2 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <button
                      onClick={saveEditType}
                      disabled={loading}
                      className="px-4 py-1.5 bg-green-600 text-white rounded text-sm"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={cancelEditType}
                      className="px-4 py-1.5 bg-gray-300 text-gray-700 rounded text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                  
                  {/* Produits compatibles en mode édition */}
                  {availableProducts.length > 0 && (
                    <div className="p-3 bg-white rounded border">
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Produits compatibles
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableProducts.map((product) => (
                          <label key={product.slug} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={(editType.product_slugs || []).includes(product.slug)}
                              onChange={() => toggleProductForEditType(product.slug)}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{product.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Mode affichage */
                <div className="px-3 py-2 bg-purple-50 border border-purple-200 rounded text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {type.icon && <span className="text-lg">{type.icon}</span>}
                    <span className="font-medium capitalize">{type.name}</span>
                    {type.product_slugs && type.product_slugs.length > 0 && (
                      <span className="text-xs text-gray-500">
                        ({type.product_slugs.length} produit{type.product_slugs.length > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditType(type)}
                      className="text-blue-500 hover:text-blue-700 text-xs"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteType(type.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {finishTypes.length === 0 && (
            <p className="text-xs text-gray-500">Aucun type. Cliquez sur "+ Ajouter type" pour en créer.</p>
          )}
        </div>
      </div>


      {/* Formulaire d'ajout compact */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Ajouter une couleur</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium mb-1">Code RAL</label>
            <input
              type="text"
              value={newColor.ral_code}
              onChange={(e) => setNewColor({ ...newColor, ral_code: e.target.value })}
              placeholder="9016"
              className="w-full px-2 py-1.5 border rounded text-sm"
            />
          </div>
          
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium mb-1">Nom</label>
            <input
              type="text"
              value={newColor.name}
              onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
              placeholder="Blanc"
              className="w-full px-2 py-1.5 border rounded text-sm"
            />
          </div>
          
          <div className="w-32">
            <label className="block text-xs font-medium mb-1">Type</label>
            <select
              value={newColor.finish}
              onChange={(e) => setNewColor({ ...newColor, finish: e.target.value })}
              className="w-full px-2 py-1.5 border rounded text-sm"
            >
              {finishTypes.map(type => (
                <option key={type.id} value={type.name}>
                  {type.icon ? `${type.icon} ` : ''}{type.name}
                </option>
              ))}
              {finishTypes.length === 0 && (
                <>
                  <option value="brillant">Brillant</option>
                  <option value="sablé">Sablé</option>
                  <option value="mat">Mat</option>
                  <option value="promo">Promo</option>
                  <option value="spéciale">Spéciale</option>
                </>
              )}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
              className="w-full px-2 py-1 border rounded text-xs"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm whitespace-nowrap"
          >
            {uploadingImage ? 'Upload...' : loading ? 'Ajout...' : '+ Ajouter'}
          </button>
        </form>
      </div>
      
      {/* Statistiques */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <div><span className="font-semibold">Total:</span> {colors.length}</div>
          <div><span className="font-semibold">Brillant:</span> {colors.filter(c => c.finish === 'brillant').length}</div>
          <div><span className="font-semibold">Sablé:</span> {colors.filter(c => c.finish === 'sablé').length}</div>
          <div><span className="font-semibold">Mat:</span> {colors.filter(c => c.finish === 'mat').length}</div>
          <div><span className="font-semibold">Promo:</span> {colors.filter(c => c.finish === 'promo').length}</div>
          <div><span className="font-semibold">Spéciale:</span> {colors.filter(c => c.finish === 'spéciale').length}</div>
        </div>
      </div>
      
      {/* Liste des couleurs par type */}
      {displayTypes.map(finishType => {
        const finishColors = colors.filter(c => c.finish === finishType)
        if (finishColors.length === 0) return null
        
        const typeInfo = finishTypes.find(t => t.name === finishType)
        
        return (
          <div key={finishType} className="mb-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3 capitalize">
              {typeInfo?.icon && <span className="mr-2">{typeInfo.icon}</span>}
              {finishType} ({finishColors.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {finishColors.map((color) => (
            <div key={color.id} className="border rounded p-2 text-sm">
              {color.image_url ? (
                <div className="mb-2">
                  <img
                    src={color.image_url}
                    alt={color.ral_code ? `RAL ${color.ral_code}` : color.name || 'Couleur'}
                    className="w-full h-16 object-cover rounded"
                  />
                </div>
              ) : null}
              {editingId === color.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editColor.ral_code}
                    onChange={(e) => setEditColor({ ...editColor, ral_code: e.target.value })}
                    placeholder="Code RAL"
                    className="w-full px-2 py-1 border rounded text-xs"
                  />
                  <input
                    type="text"
                    value={editColor.name}
                    onChange={(e) => setEditColor({ ...editColor, name: e.target.value })}
                    placeholder="Nom"
                    className="w-full px-2 py-1 border rounded text-xs"
                  />
                  <select
                    value={editColor.finish}
                    onChange={(e) => setEditColor({ ...editColor, finish: e.target.value })}
                    className="w-full px-2 py-1 border rounded text-xs"
                  >
                    {finishTypes.map(type => (
                      <option key={type.id} value={type.name}>
                        {type.icon ? `${type.icon} ` : ''}{type.name}
                      </option>
                    ))}
                    {finishTypes.length === 0 && (
                      <>
                        <option value="brillant">Brillant</option>
                        <option value="sablé">Sablé</option>
                        <option value="mat">Mat</option>
                        <option value="promo">Promo</option>
                        <option value="spéciale">Spéciale</option>
                      </>
                    )}
                  </select>
                  <input
                    type="text"
                    value={editColor.image_url || ''}
                    onChange={(e) => setEditColor({ ...editColor, image_url: e.target.value })}
                    placeholder="URL de l'image"
                    className="w-full px-2 py-1 border rounded text-xs"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                      className="w-full px-2 py-1 border rounded text-xs"
                    />
                    {editImageFile && (
                      <p className="text-xs text-gray-500 mt-1">
                        {editImageFile.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(color.id)}
                      className="flex-1 bg-green-600 text-white py-1 rounded text-xs"
                      disabled={loading || uploadingImage}
                    >
                      {uploadingImage ? 'Upload...' : 'Enregistrer'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-200 text-gray-700 py-1 rounded text-xs"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="font-bold">{color.ral_code ? `RAL ${color.ral_code}` : color.name}</div>
                  <div className="text-gray-600">{color.name || '—'}</div>
                  <div className="text-xs text-gray-500">{color.finish}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(color)}
                      className="flex-1 bg-blue-600 text-white py-1 rounded"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteColor(color.id)}
                      className="flex-1 bg-red-600 text-white py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              )}
              </div>
            ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
