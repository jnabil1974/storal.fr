'use client';

import { useState, useEffect } from 'react';

interface ToileType {
  id: number;
  name: string;
  manufacturer: string;
  code: string;
  purchase_price_ht: number;
  sales_coefficient: number;
  compatible_categories: string[];
  is_active: boolean;
}

interface ToileColor {
  id: number;
  toile_type_id: number;
  ref: string;
  name: string;
  collection: string;
  category: string;
  color_family: string;
  image_url: string;
  is_available: boolean;
  toile_type?: ToileType;
}

export default function AdminToilesPage() {
  const [activeTab, setActiveTab] = useState<'types' | 'colors'>('types');
  
  // Types de toiles
  const [toileTypes, setToileTypes] = useState<ToileType[]>([]);
  const [editingType, setEditingType] = useState<ToileType | null>(null);
  const [isAddingType, setIsAddingType] = useState(false);
  
  // Couleurs de toiles
  const [toileColors, setToileColors] = useState<ToileColor[]>([]);
  const [editingColor, setEditingColor] = useState<ToileColor | null>(null);
  const [isAddingColor, setIsAddingColor] = useState(false);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFamily, setFilterFamily] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const [loading, setLoading] = useState(true);

  const colorFamilies = ['Blanc', 'Noir', 'Gris', 'Bleu', 'Vert', 'Rouge', 'Rose', 'Orange', 'Jaune', 'Violet', 'Marron', 'Beige', 'Neutre'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadToileTypes(), loadToileColors()]);
    } finally {
      setLoading(false);
    }
  };

  const loadToileTypes = async () => {
    try {
      const response = await fetch('/api/admin/toile-types');
      const data = await response.json();
      setToileTypes(data);
    } catch (error) {
      console.error('Erreur chargement types:', error);
    }
  };

  const loadToileColors = async () => {
    try {
      const response = await fetch('/api/admin/toile-colors');
      const data = await response.json();
      setToileColors(data);
    } catch (error) {
      console.error('Erreur chargement couleurs:', error);
    }
  };

  const handleDeleteType = async (id: number) => {
    if (!confirm('Supprimer ce type de toile ?')) return;
    
    try {
      const response = await fetch(`/api/admin/toile-types?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (response.ok) {
        await loadToileTypes();
        alert('Type supprimé !');
      } else {
        alert(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteColor = async (id: number) => {
    if (!confirm('Supprimer cette couleur ?')) return;
    
    try {
      const response = await fetch(`/api/admin/toile-colors?id=${id}`, { method: 'DELETE' });
      
      if (response.ok) {
        await loadToileColors();
        alert('Couleur supprimée !');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredColors = toileColors.filter(color => {
    const matchesSearch = color.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         color.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = !filterFamily || color.color_family === filterFamily;
    const matchesType = !filterType || color.toile_type_id === parseInt(filterType);
    return matchesSearch && matchesFamily && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Toiles</h1>
          <p className="text-gray-600 mt-2">
            {toileTypes.length} type(s) • {toileColors.length} couleur(s)
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('types')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'types'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🏷️ Types de Toiles ({toileTypes.length})
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'colors'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🎨 Couleurs ({toileColors.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'types' ? (
              <TypesTab
                types={toileTypes}
                onDelete={handleDeleteType}
                onRefresh={loadToileTypes}
              />
            ) : (
              <ColorsTab
                colors={filteredColors}
                types={toileTypes}
                onDelete={handleDeleteColor}
                onRefresh={loadToileColors}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterFamily={filterFamily}
                setFilterFamily={setFilterFamily}
                filterType={filterType}
                setFilterType={setFilterType}
                colorFamilies={colorFamilies}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Types
function TypesTab({ types, onDelete, onRefresh }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingType, setEditingType] = useState<ToileType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    code: '',
    purchase_price_ht: 0,
    sales_coefficient: 1,
    compatible_categories: [] as string[],
  });
  const [availableProducts, setAvailableProducts] = useState<{ slug: string; label: string }[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/products-list');
      const data = await response.json();
      setAvailableProducts(data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
  };

  const toggleCategory = (slug: string) => {
    setFormData(prev => ({
      ...prev,
      compatible_categories: prev.compatible_categories.includes(slug)
        ? prev.compatible_categories.filter(c => c !== slug)
        : [...prev.compatible_categories, slug]
    }));
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/toile-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          compatible_categories: formData.compatible_categories,
        }),
      });
      if (response.ok) {
        alert('Type ajouté !');
        setIsAdding(false);
        setFormData({
          name: '',
          manufacturer: '',
          code: '',
          purchase_price_ht: 0,
          sales_coefficient: 1,
          compatible_categories: [],
        });
        onRefresh();
      }
    } catch (e) {
      alert('Erreur: ' + e);
    }
  };

  const handleEdit = async (type: ToileType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      manufacturer: type.manufacturer,
      code: type.code,
      purchase_price_ht: type.purchase_price_ht,
      sales_coefficient: type.sales_coefficient,
      compatible_categories: type.compatible_categories,
    });
  };

  const handleUpdate = async () => {
    if (!editingType) return;
    try {
      const response = await fetch(`/api/admin/toile-types?id=${editingType.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          compatible_categories: formData.compatible_categories,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Type mis à jour !');
        setEditingType(null);
        setFormData({
          name: '',
          manufacturer: '',
          code: '',
          purchase_price_ht: 0,
          sales_coefficient: 1,
          compatible_categories: [],
        });
        onRefresh();
      } else {
        alert('Erreur: ' + (result.error || 'Échec de la mise à jour'));
      }
    } catch (e) {
      alert('Erreur: ' + e);
    }
  };

  if (isAdding || editingType) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-bold mb-4">{editingType ? 'Modifier le type' : 'Ajouter un type'}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-2 border rounded-md"
          />
          <input
            placeholder="Fabricant"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            className="px-4 py-2 border rounded-md"
          />
          <input
            placeholder="Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Prix HT"
            value={formData.purchase_price_ht}
            onChange={(e) => setFormData({ ...formData, purchase_price_ht: parseFloat(e.target.value) })}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Coef de vente"
            step="0.1"
            value={formData.sales_coefficient}
            onChange={(e) => setFormData({ ...formData, sales_coefficient: parseFloat(e.target.value) })}
            className="px-4 py-2 border rounded-md"
          />
        </div>

        {/* Cases à cocher pour les produits compatibles */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Produits compatibles (stores)
          </label>
          <div className="grid grid-cols-2 gap-3 p-4 bg-white border rounded-md">
            {availableProducts.map((product) => (
              <label key={product.slug} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={formData.compatible_categories.includes(product.slug)}
                  onChange={() => toggleCategory(product.slug)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">{product.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={editingType ? handleUpdate : handleAdd}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            {editingType ? 'Mettre à jour' : 'Ajouter'}
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setEditingType(null);
              setFormData({
                name: '',
                manufacturer: '',
                code: '',
                purchase_price_ht: 0,
                sales_coefficient: 1,
                compatible_categories: [],
              });
            }}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          + Ajouter un type
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fabricant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix HT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coef</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {types.map((type: ToileType) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{type.name}</td>
                <td className="px-4 py-3">{type.manufacturer}</td>
                <td className="px-4 py-3">{type.purchase_price_ht} €</td>
                <td className="px-4 py-3">×{type.sales_coefficient}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${type.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {type.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(type)} className="text-blue-600 hover:text-blue-800 font-medium">Modifier</button>
                  <button onClick={() => onDelete(type.id)} className="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Composant Couleurs
function ColorsTab({ colors, types, onDelete, onRefresh, searchTerm, setSearchTerm, filterFamily, setFilterFamily, filterType, setFilterType, colorFamilies }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingColor, setEditingColor] = useState<ToileColor | null>(null);
  const [formData, setFormData] = useState({
    toile_type_id: '',
    ref: '',
    name: '',
    collection: '',
    color_family: '',
    image_url: '',
  });

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/toile-colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          toile_type_id: parseInt(formData.toile_type_id),
        }),
      });
      if (response.ok) {
        alert('Couleur ajoutée !');
        setIsAdding(false);
        setFormData({
          toile_type_id: '',
          ref: '',
          name: '',
          collection: '',
          color_family: '',
          image_url: '',
        });
        onRefresh();
      } else {
        const error = await response.json();
        alert('Erreur: ' + error.error);
      }
    } catch (e) {
      alert('Erreur: ' + e);
    }
  };

  const handleEdit = async (color: ToileColor) => {
    setEditingColor(color);
    setFormData({
      toile_type_id: color.toile_type_id.toString(),
      ref: color.ref,
      name: color.name,
      collection: color.collection,
      color_family: color.color_family,
      image_url: color.image_url,
    });
  };

  const handleUpdate = async () => {
    if (!editingColor) return;
    try {
      const response = await fetch(`/api/admin/toile-colors?id=${editingColor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          toile_type_id: parseInt(formData.toile_type_id),
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Couleur mise à jour !');
        setEditingColor(null);
        setFormData({
          toile_type_id: '',
          ref: '',
          name: '',
          collection: '',
          color_family: '',
          image_url: '',
        });
        onRefresh();
      } else {
        alert('Erreur: ' + (result.error || 'Échec de la mise à jour'));
      }
    } catch (e) {
      alert('Erreur: ' + e);
    }
  };

  if (isAdding || editingColor) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-bold mb-4">{editingColor ? 'Modifier la couleur' : 'Ajouter une couleur'}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            value={formData.toile_type_id}
            onChange={(e) => setFormData({ ...formData, toile_type_id: e.target.value })}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Sélectionner un type</option>
            {types.map((type: ToileType) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          <input
            placeholder="Référence"
            value={formData.ref}
            onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
            className="px-4 py-2 border rounded-md"
          />
          <input
            placeholder="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-2 border rounded-md"
          />
          <input
            placeholder="Collection"
            value={formData.collection}
            onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
            className="px-4 py-2 border rounded-md"
          />
          <select
            value={formData.color_family}
            onChange={(e) => setFormData({ ...formData, color_family: e.target.value })}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Famille de couleur</option>
            {colorFamilies.map((family: string) => (
              <option key={family} value={family}>{family}</option>
            ))}
          </select>
          <input
            placeholder="URL de l'image"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="px-4 py-2 border rounded-md col-span-2"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={editingColor ? handleUpdate : handleAdd}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            {editingColor ? 'Mettre à jour' : 'Ajouter'}
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setEditingColor(null);
              setFormData({
                toile_type_id: '',
                ref: '',
                name: '',
                collection: '',
                color_family: '',
                image_url: '',
              });
            }}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher par réf ou nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <select
          value={filterFamily}
          onChange={(e) => setFilterFamily(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">Toutes les familles</option>
          {colorFamilies.map((family: string) => (
            <option key={family} value={family}>{family}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">Tous les types</option>
          {types.map((type: ToileType) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          + Ajouter une couleur
        </button>
      </div>

      {/* Grille de couleurs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {colors.map((color: ToileColor) => (
          <div key={color.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={color.image_url}
              alt={color.name}
              className="w-full h-32 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="128"><rect width="200" height="128" fill="%23ddd"/><text x="100" y="70" text-anchor="middle" fill="%23999">?</text></svg>';
              }}
            />
            <div className="p-3">
              <p className="font-mono font-bold text-sm">{color.ref}</p>
              <p className="text-xs text-gray-600 truncate">{color.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">{color.color_family}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(color)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(color.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {colors.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucune couleur trouvée
        </div>
      )}
    </div>
  );
}
