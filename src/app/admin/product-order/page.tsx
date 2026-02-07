'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  active: boolean;
}

export default function ProductOrderManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const supabase = getSupabaseClient();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    if (!supabase) {
      setMessage('❌ Supabase non disponible');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('sb_products')
        .select('id, name, slug, display_order, active')
        .order('display_order', { ascending: true });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
      setMessage('❌ Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newProducts = [...products];
    const draggedItem = newProducts[draggedIndex];
    
    // Retirer l'élément de sa position
    newProducts.splice(draggedIndex, 1);
    // L'insérer à la nouvelle position
    newProducts.splice(index, 0, draggedItem);
    
    setProducts(newProducts);
    setDraggedIndex(index);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const newProducts = [...products];
    [newProducts[index - 1], newProducts[index]] = [newProducts[index], newProducts[index - 1]];
    setProducts(newProducts);
  }

  function moveDown(index: number) {
    if (index === products.length - 1) return;
    const newProducts = [...products];
    [newProducts[index], newProducts[index + 1]] = [newProducts[index + 1], newProducts[index]];
    setProducts(newProducts);
  }

  async function saveOrder() {
    setSaving(true);
    setMessage('💾 Sauvegarde en cours...');

    try {
      // Préparer les mises à jour
      const updates = products.map((product, index) => ({
        id: product.id,
        display_order: (index + 1) * 10, // Multiplier par 10 pour laisser de l'espace
      }));

      console.log('📤 Envoi de', updates.length, 'mises à jour...');

      // Appeler l'API pour mettre à jour
      const response = await fetch('/api/admin/update-product-order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde');
      }

      console.log('✅ Résultat:', result);
      setMessage(`✅ ${result.message || 'Ordre sauvegardé avec succès !'}`);
      
      // Recharger les produits pour confirmer les changements
      await loadProducts();
      
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      setMessage(`❌ Erreur : ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSaving(false);
    }
  }

  async function resetToAlphabetical() {
    if (!confirm('Réinitialiser l\'ordre par ordre alphabétique ?')) return;

    const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));
    setProducts(sorted);
    setMessage('ℹ️ Ordre réinitialisé (non sauvegardé). Cliquez sur "Sauvegarder" pour confirmer.');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🔢 Ordre d'affichage des stores</h1>
            <p className="text-sm text-gray-600 mt-1">
              Glissez-déposez les produits pour réorganiser leur ordre d'affichage
            </p>
          </div>
          <button
            onClick={resetToAlphabetical}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            🔤 Ordre alphabétique
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-md border ${
            message.includes('❌') ? 'bg-red-50 border-red-200 text-red-800' :
            message.includes('✅') ? 'bg-green-50 border-green-200 text-green-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-start">
              <div className="flex-1">
                {message}
              </div>
              <button
                onClick={() => setMessage('')}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2 mb-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                flex items-center justify-between p-4 bg-white border-2 rounded-lg 
                transition-all cursor-move
                ${draggedIndex === index ? 'opacity-50 border-blue-500' : 'border-gray-200'}
                hover:border-blue-300 hover:shadow-md
              `}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Monter"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === products.length - 1}
                    className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Descendre"
                  >
                    ▼
                  </button>
                </div>

                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 font-bold rounded-md">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      {!product.active && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Inactif
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{product.slug}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  Order: {product.display_order}
                </div>
              </div>

              <div className="text-2xl text-gray-300 ml-4 cursor-move">
                ⋮⋮
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {products.length} produit(s) • L'ordre sera appliqué partout (configurateur, admin, APIs)
          </div>
          <button
            onClick={saveOrder}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? '💾 Sauvegarde...' : '💾 Sauvegarder l\'ordre'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Comment utiliser :</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Glisser-déposer</strong> : Cliquez et maintenez pour réorganiser</li>
          <li>• <strong>Boutons ▲▼</strong> : Déplacer d'une position à la fois</li>
          <li>• <strong>Ordre alphabétique</strong> : Réinitialiser selon le nom</li>
          <li>• <strong>Sauvegarder</strong> : Les changements ne sont appliqués qu'après sauvegarde</li>
        </ul>
      </div>
    </div>
  );
}
