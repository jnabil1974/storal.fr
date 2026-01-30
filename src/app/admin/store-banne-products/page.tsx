'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import AdminStoreBanneForm from '@/components/AdminStoreBanneForm';

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
  image_hero?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_tagline?: string | null;
  hero_text?: string | null;
  hero_points?: string | null;
  tags?: string | null;
  features?: any;
  warranty?: any;
  guarantees?: string | null;
  options_description?: any;
  options_cards?: string | null;
  comparison_table?: any;
  certifications?: string | null;
  min_width?: number;
  max_width?: number;
  min_projection?: number;
  max_projection?: number;
  product_type?: string;
  category?: string;
  type?: string;
  active?: boolean;
}

export default function StoreBanneProductsAdmin() {
  const [products, setProducts] = useState<StoreBanneProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
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
      image_hero: product.image_hero || '',
      hero_title: product.hero_title || '',
      hero_subtitle: product.hero_subtitle || '',
      hero_tagline: product.hero_tagline || '',
      hero_text: product.hero_text || '',
      hero_points: typeof product.hero_points === 'string' ? product.hero_points : JSON.stringify(product.hero_points || []),
      tags: typeof product.tags === 'string' ? product.tags : JSON.stringify(product.tags || []),
      guarantees: typeof product.guarantees === 'string' ? product.guarantees : JSON.stringify(product.guarantees || []),
      options_cards: typeof product.options_cards === 'string' ? product.options_cards : JSON.stringify(product.options_cards || []),
      certifications: typeof product.certifications === 'string' ? product.certifications : JSON.stringify(product.certifications || []),
      product_type: product.product_type || '',
      category: product.category || '',
      min_width: product.min_width,
      max_width: product.max_width,
      min_projection: product.min_projection,
      max_projection: product.max_projection,
      type: product.type || 'Monobloc',
      active: product.active !== false,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  }

  function startCreate() {
    setIsCreating(true);
    setEditingId(null);
    
    // Chercher le produit HELiOM comme modèle
    const heliomModel = products.find(p => p.slug === 'store-banne-heliom');
    
    if (heliomModel) {
      // Préremplir avec les données de HELiOM comme modèle
      setFormData({
        name: '',
        slug: '',
        description: '',
        sales_coefficient: heliomModel.sales_coefficient || 1.5,
        category: 'store-banne',
        img_store: [],
        img_larg_ht: '',
        img_tol_dim: '',
        img_dim_coffre: '',
        bras: '',
        img_bras_led: '',
        image_store_small: '',
        image_hero: '',
        hero_title: '',
        hero_subtitle: '',
        hero_tagline: heliomModel.hero_tagline || '',
        hero_text: '',
        hero_points: typeof heliomModel.hero_points === 'string' 
          ? heliomModel.hero_points 
          : JSON.stringify(heliomModel.hero_points || ['Point 1', 'Point 2', 'Point 3']),
        tags: typeof heliomModel.tags === 'string' 
          ? heliomModel.tags 
          : JSON.stringify(heliomModel.tags || []),
        guarantees: typeof heliomModel.guarantees === 'string' 
          ? heliomModel.guarantees 
          : JSON.stringify(heliomModel.guarantees || []),
        options_cards: typeof heliomModel.options_cards === 'string' 
          ? heliomModel.options_cards 
          : JSON.stringify(heliomModel.options_cards || []),
        certifications: typeof heliomModel.certifications === 'string' 
          ? heliomModel.certifications 
          : JSON.stringify(heliomModel.certifications || []),
        product_type: '',
        type: 'Monobloc',
        active: true,
        min_width: undefined,
        max_width: undefined,
        min_projection: undefined,
        max_projection: undefined,
      });
    } else {
      // Valeurs par défaut si HELiOM n'est pas trouvé
      setFormData({
        name: '',
        slug: '',
        description: '',
        sales_coefficient: 1.5,
        category: 'store-banne',
        img_store: [],
        tags: '[]',
        hero_points: '[]',
        guarantees: '[]',
        options_cards: '[]',
        certifications: '[]',
        type: 'Monobloc',
        active: true,
      });
    }
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
    console.log('💾 Sauvegarde du produit:', isCreating ? 'création' : editingId, formData);

    // Parser les JSON strings
    const parseJSON = (str: any) => {
      if (typeof str === 'string') {
        try {
          return JSON.parse(str);
        } catch {
          return str;
        }
      }
      return str;
    };

    const endpoint = isCreating 
      ? '/api/admin/store-banne-products/create' 
      : '/api/admin/store-banne-products/update';

    const payload: any = {
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
      image_hero: formData.image_hero,
      hero_title: formData.hero_title,
      hero_subtitle: formData.hero_subtitle,
      hero_tagline: formData.hero_tagline,
      hero_text: formData.hero_text,
      hero_points: parseJSON(formData.hero_points),
      tags: parseJSON(formData.tags),
      guarantees: parseJSON(formData.guarantees),
      options_cards: parseJSON(formData.options_cards),
      certifications: parseJSON(formData.certifications),
      product_type: formData.product_type,
      category: formData.category,
      min_width: formData.min_width ? parseInt(String(formData.min_width)) : null,
      max_width: formData.max_width ? parseInt(String(formData.max_width)) : null,
      min_projection: formData.min_projection ? parseInt(String(formData.min_projection)) : null,
      max_projection: formData.max_projection ? parseInt(String(formData.max_projection)) : null,
      type: formData.type || 'Monobloc',
      active: formData.active !== false,
    };

    // Ajouter l'ID seulement pour les mises à jour
    if (!isCreating && editingId) {
      payload.id = editingId;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result?.success) {
      console.error('❌ Erreur API:', result?.error || response.statusText);
      setMessage(`❌ Erreur: ${result?.error || 'Sauvegarde échouée'}`);
      return;
    }

    console.log('✅ Produit sauvegardé');
    setMessage(isCreating ? '✅ Produit créé' : '✅ Produit mis à jour');
    setEditingId(null);
    setIsCreating(false);
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produits Store Banne</h1>
          <p className="text-gray-600 mt-2">Gérer les informations et images des stores bannes</p>
        </div>
        {!editingId && !isCreating && (
          <button
            onClick={startCreate}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
          >
            ➕ Nouveau Produit
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {isCreating && (
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nouveau Produit</h2>
          <AdminStoreBanneForm
            formData={formData}
            setFormData={setFormData}
            onImageUpload={handleImageUpload}
            uploading={uploading}
            onSave={saveProduct}
            onCancel={cancelEdit}
          />
        </div>
      )}

      <div className="space-y-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-6">
            {editingId === product.id ? (
              <AdminStoreBanneForm
                formData={formData}
                setFormData={setFormData}
                onImageUpload={handleImageUpload}
                uploading={uploading}
                onSave={saveProduct}
                onCancel={cancelEdit}
              />
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
                  <div>
                    <span className="font-medium">Type:</span>{' '}
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {product.type || 'Monobloc'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Statut:</span>{' '}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.active !== false 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.active !== false ? '✅ Actif' : '❌ Inactif'}
                    </span>
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
