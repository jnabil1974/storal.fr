'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import Image from 'next/image';

interface StoreBanneProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  sales_coefficient: number;
  img_store: string[] | null;
  img_larg_ht: string | null;
  img_tol_dim: string | null;
  img_dim_coffre: string | null;
  bras: string | null;
  img_bras_led: string | null;
  image_store_small: string | null;
}

export default function StoreBanneProductsAdmin() {
  const [products, setProducts] = useState<StoreBanneProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<StoreBanneProduct>>({});
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);

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

    setLoading(true);
    const { data, error } = await supabase
      .from('sb_products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur de chargement');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  function startEdit(product: StoreBanneProduct) {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      sales_coefficient: product.sales_coefficient,
      img_store: product.img_store || [],
      img_larg_ht: product.img_larg_ht || '',
      img_tol_dim: product.img_tol_dim || '',
      img_dim_coffre: product.img_dim_coffre || '',
      bras: product.bras || '',
      img_bras_led: product.img_bras_led || '',
      image_store_small: product.image_store_small || '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({});
  }

  async function handleImageUpload(file: File, fieldName: string, isArray = false, arrayIndex?: number) {
    setUploading(fieldName);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'store-banne');

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        if (isArray && arrayIndex !== undefined) {
          // Pour img_store (tableau)
          const currentArray = (formData.img_store as string[]) || [];
          const newArray = [...currentArray];
          newArray[arrayIndex] = data.url;
          setFormData({ ...formData, img_store: newArray });
        } else {
          // Pour les autres images (string)
          setFormData({ ...formData, [fieldName]: data.url });
        }
        setMessage('✅ Image téléchargée');
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage('❌ ' + data.error);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      setMessage('❌ Erreur lors du téléchargement');
    }
    setUploading(null);
  }

  async function saveProduct() {
    if (!editingId) {
      setMessage('❌ Erreur: données manquantes');
      return;
    }

    console.log('💾 Sauvegarde du produit:', editingId, formData);

    const response = await fetch('/api/admin/store-banne-products/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingId,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        sales_coefficient: formData.sales_coefficient,
        img_store: formData.img_store,
        img_larg_ht: formData.img_larg_ht,
        img_tol_dim: formData.img_tol_dim,
        img_dim_coffre: formData.img_dim_coffre,
        bras: formData.bras,
        img_bras_led: formData.img_bras_led,
        image_store_small: formData.image_store_small,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result?.success) {
      console.error('❌ Erreur API:', result?.error || response.statusText);
      setMessage(`❌ Erreur: ${result?.error || 'Sauvegarde échouée'}`);
      return;
    }

    console.log('✅ Produit sauvegardé');
    setMessage('✅ Produit mis à jour');
    setEditingId(null);
    setFormData({});
    loadProducts();
    setTimeout(() => setMessage(''), 3000);
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Produits Store Banne</h1>
        <p className="text-gray-600 mt-2">Gérer les informations et images des stores bannes</p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-6">
            {editingId === product.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coefficient de vente</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sales_coefficient || ''}
                    onChange={(e) => setFormData({ ...formData, sales_coefficient: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Images</h3>
                  
                  <div className="space-y-4">
                    {/* Images Store (3 images) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images Store (3 photos)
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[0, 1, 2].map((index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-2">Image {index + 1}</div>
                            {formData.img_store?.[index] && (
                              <div className="mb-2 relative h-24 bg-gray-100 rounded">
                                <Image
                                  src={formData.img_store[index]}
                                  alt={`Store ${index + 1}`}
                                  fill
                                  sizes="150px"
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, 'img_store', true, index);
                              }}
                              disabled={uploading === 'img_store'}
                              className="text-xs w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Image miniature */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image miniature</label>
                      {formData.image_store_small && (
                        <div className="mb-2 relative h-32 w-32 bg-gray-100 rounded">
                          <Image
                            src={formData.image_store_small}
                            alt="Miniature"
                            fill
                            sizes="128px"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'image_store_small');
                        }}
                        disabled={uploading === 'image_store_small'}
                        className="block"
                      />
                    </div>

                    {/* Image Largeur/Hauteur */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image Largeur/Hauteur</label>
                      {formData.img_larg_ht && (
                        <div className="mb-2 relative h-32 w-full bg-gray-100 rounded">
                          <Image
                            src={formData.img_larg_ht}
                            alt="Largeur/Hauteur"
                            fill
                            sizes="100vw"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'img_larg_ht');
                        }}
                        disabled={uploading === 'img_larg_ht'}
                        className="block"
                      />
                    </div>

                    {/* Image Dimensions Toile */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image Dimensions Toile</label>
                      {formData.img_tol_dim && (
                        <div className="mb-2 relative h-32 w-full bg-gray-100 rounded">
                          <Image
                            src={formData.img_tol_dim}
                            alt="Dimensions Toile"
                            fill
                            sizes="100vw"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'img_tol_dim');
                        }}
                        disabled={uploading === 'img_tol_dim'}
                        className="block"
                      />
                    </div>

                    {/* Image Dimensions Coffre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image Dimensions Coffre</label>
                      {formData.img_dim_coffre && (
                        <div className="mb-2 relative h-32 w-full bg-gray-100 rounded">
                          <Image
                            src={formData.img_dim_coffre}
                            alt="Dimensions Coffre"
                            fill
                            sizes="100vw"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'img_dim_coffre');
                        }}
                        disabled={uploading === 'img_dim_coffre'}
                        className="block"
                      />
                    </div>

                    {/* Image Bras LED */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image Bras LED</label>
                      {formData.img_bras_led && (
                        <div className="mb-2 relative h-32 w-full bg-gray-100 rounded">
                          <Image
                            src={formData.img_bras_led}
                            alt="Bras LED"
                            fill
                            sizes="100vw"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'img_bras_led');
                        }}
                        disabled={uploading === 'img_bras_led'}
                        className="block"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de Bras</label>
                  <input
                    type="text"
                    value={formData.bras || ''}
                    onChange={(e) => setFormData({ ...formData, bras: e.target.value })}
                    placeholder="Bras articulés double câble"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={saveProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    💾 Enregistrer
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                    <p className="text-sm text-gray-600">Slug: {product.slug}</p>
                    <p className="text-sm text-gray-600">Coefficient: {product.sales_coefficient}</p>
                  </div>
                  <button
                    onClick={() => startEdit(product)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    ✏️ Modifier
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Images store:</span>{' '}
                    {product.img_store?.length || 0} image(s)
                  </div>
                  <div>
                    <span className="font-medium">Miniature:</span>{' '}
                    {product.image_store_small ? '✅' : '❌'}
                  </div>
                  <div>
                    <span className="font-medium">Larg/Ht:</span>{' '}
                    {product.img_larg_ht ? '✅' : '❌'}
                  </div>
                  <div>
                    <span className="font-medium">Toile dim:</span>{' '}
                    {product.img_tol_dim ? '✅' : '❌'}
                  </div>
                  <div>
                    <span className="font-medium">Coffre dim:</span>{' '}
                    {product.img_dim_coffre ? '✅' : '❌'}
                  </div>
                  <div>
                    <span className="font-medium">Bras LED:</span>{' '}
                    {product.img_bras_led ? '✅' : '❌'}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Bras:</span>{' '}
                    {product.bras || 'Non défini'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
