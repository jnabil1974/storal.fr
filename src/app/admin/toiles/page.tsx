'use client';

import { useState, useEffect } from 'react';

interface DicksonToile {
  ref: string;
  name: string;
  collection: string;
  colorFamily: string;
  imageUrl: string;
  priceHT: number;
}

export default function AdminToilesPage() {
  const [toiles, setToiles] = useState<DicksonToile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingToile, setEditingToile] = useState<DicksonToile | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFamily, setFilterFamily] = useState('');

  // Formulaire
  const [formData, setFormData] = useState<DicksonToile>({
    ref: '',
    name: '',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '',
    priceHT: 0,
  });

  const colorFamilies = [
    'Blanc', 'Noir', 'Gris', 'Bleu', 'Vert', 'Rouge', 
    'Rose', 'Orange', 'Jaune', 'Violet', 'Marron', 'Beige'
  ];

  useEffect(() => {
    loadToiles();
  }, []);

  const loadToiles = async () => {
    try {
      const response = await fetch('/api/admin/toiles');
      const data = await response.json();
      setToiles(data);
    } catch (error) {
      console.error('Erreur chargement toiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingToile 
        ? `/api/admin/toiles?ref=${editingToile.ref}`
        : '/api/admin/toiles';
      
      const method = editingToile ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadToiles();
        resetForm();
        alert(editingToile ? 'Toile modifiée !' : 'Toile ajoutée !');
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (ref: string) => {
    if (!confirm(`Supprimer la toile ${ref} ?`)) return;

    try {
      const response = await fetch(`/api/admin/toiles?ref=${ref}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadToiles();
        alert('Toile supprimée !');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const startEdit = (toile: DicksonToile) => {
    setEditingToile(toile);
    setFormData(toile);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingToile(null);
    setFormData({
      ref: '',
      name: '',
      collection: 'Orchestra',
      colorFamily: 'Bleu',
      imageUrl: '',
      priceHT: 0,
    });
  };

  const resetForm = () => {
    setEditingToile(null);
    setIsAdding(false);
    setFormData({
      ref: '',
      name: '',
      collection: 'Orchestra',
      colorFamily: 'Bleu',
      imageUrl: '',
      priceHT: 0,
    });
  };

  const filteredToiles = toiles.filter(toile => {
    const matchesSearch = toile.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         toile.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = !filterFamily || toile.colorFamily === filterFamily;
    return matchesSearch && matchesFamily;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Toiles Dickson</h1>
          <p className="text-gray-600 mt-2">Ajouter, modifier ou supprimer des toiles de store</p>
        </div>

        {/* Bouton Ajouter */}
        {!isAdding && !editingToile && (
          <button
            onClick={startAdd}
            className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            + Ajouter une nouvelle toile
          </button>
        )}

        {/* Formulaire */}
        {(isAdding || editingToile) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingToile ? `Modifier ${editingToile.ref}` : 'Nouvelle toile'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Référence *
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingToile}
                  value={formData.ref}
                  onChange={(e) => setFormData({ ...formData, ref: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="ex: U999, D600, 8000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="ex: Orchestra Indigo Chiné"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection
                </label>
                <input
                  type="text"
                  value={formData.collection}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Famille de couleur *
                </label>
                <select
                  required
                  value={formData.colorFamily}
                  onChange={(e) => setFormData({ ...formData, colorFamily: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {colorFamilies.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de l'image
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="/images/toiles/dickson/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surcoût HT (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.priceHT}
                  onChange={(e) => setFormData({ ...formData, priceHT: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  {editingToile ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Rechercher par référence ou nom..."
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
              {colorFamilies.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des toiles */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">
              Toiles ({filteredToiles.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réf</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Famille</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredToiles.map((toile) => (
                  <tr key={toile.ref} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={toile.imageUrl}
                        alt={toile.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23ddd"/><text x="32" y="36" text-anchor="middle" fill="%23999" font-size="12">?</text></svg>';
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold">{toile.ref}</td>
                    <td className="px-4 py-3">{toile.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded bg-gray-100">{toile.colorFamily}</span>
                    </td>
                    <td className="px-4 py-3">{toile.priceHT} €</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => startEdit(toile)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(toile.ref)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
