'use client';

import Image from 'next/image';

interface FormDataType {
  [key: string]: any;
}

interface Props {
  formData: FormDataType;
  setFormData: (data: FormDataType) => void;
  onImageUpload: (file: File, fieldName: string, isArray?: boolean, arrayIndex?: number) => void;
  uploading: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function AdminStoreBanneForm({
  formData,
  setFormData,
  onImageUpload,
  uploading,
  onSave,
  onCancel,
}: Props) {
  const handleJSONChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  return (
    <div className="space-y-6">
      {/* Informations Basiques */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Informations Basiques</h3>
        <div className="grid grid-cols-2 gap-4">
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Informations de Tarification */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💰 Tarification</h3>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </div>

      {/* Dimensions */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📐 Dimensions</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Largeur min (mm)</label>
            <input
              type="number"
              value={formData.min_width || ''}
              onChange={(e) => setFormData({ ...formData, min_width: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Largeur max (mm)</label>
            <input
              type="number"
              value={formData.max_width || ''}
              onChange={(e) => setFormData({ ...formData, max_width: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avancée min (mm)</label>
            <input
              type="number"
              value={formData.min_projection || ''}
              onChange={(e) => setFormData({ ...formData, min_projection: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avancée max (mm)</label>
            <input
              type="number"
              value={formData.max_projection || ''}
              onChange={(e) => setFormData({ ...formData, max_projection: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Classification Produit */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🏷️ Classification</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de produit</label>
            <input
              type="text"
              value={formData.product_type || ''}
              placeholder="ex: HELiOM, Kissimy, Standard"
              onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <input
              type="text"
              value={formData.category || ''}
              placeholder="ex: store-banne"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de Store</label>
            <select
              value={formData.type || 'Monobloc'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Store Coffre">Store Coffre</option>
              <option value="Semi-coffre">Semi-coffre</option>
              <option value="Monobloc">Monobloc</option>
              <option value="Traditionnel">Traditionnel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordre d'affichage
              <span className="text-xs text-gray-500 ml-1">(tri croissant)</span>
            </label>
            <input
              type="number"
              value={formData.display_order || 0}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <div className="flex items-center h-10 border border-gray-300 rounded-md px-3 bg-white">
              <input
                type="checkbox"
                id="active-toggle"
                checked={formData.active !== false}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="active-toggle" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                {formData.active !== false ? '✅ Actif (visible)' : '❌ Inactif (masqué)'}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Présentation Hero */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Section Hero</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre Hero</label>
            <input
              type="text"
              value={formData.hero_title || ''}
              onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre Hero</label>
            <input
              type="text"
              value={formData.hero_subtitle || ''}
              onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={formData.hero_tagline || ''}
              onChange={(e) => setFormData({ ...formData, hero_tagline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Texte Hero</label>
            <textarea
              value={formData.hero_text || ''}
              onChange={(e) => setFormData({ ...formData, hero_text: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Points Hero (JSON array)
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Exemple: ["Point 1", "Point 2", "Point 3"]
            </div>
            <textarea
              value={formData.hero_points || ''}
              onChange={(e) => handleJSONChange('hero_points', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Tags et Certifications */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🏅 Tags & Certifications</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (JSON array)
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Exemple: ["Tag1", "Tag2", "Tag3"]
            </div>
            <textarea
              value={formData.tags || ''}
              onChange={(e) => handleJSONChange('tags', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certifications (JSON array)
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Exemple: ["QUALICOAT", "QUALIMARINE"]
            </div>
            <textarea
              value={formData.certifications || ''}
              onChange={(e) => handleJSONChange('certifications', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Garanties */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">✅ Garanties</h3>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Garanties (JSON array)
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Exemple: [{`{"years": 12, "label": "Garantie Armature"}`}]
            </div>
            <textarea
              value={formData.guarantees || ''}
              onChange={(e) => handleJSONChange('guarantees', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs"
            />
        </div>
      </div>

      {/* Options Cards */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🎨 Cartes d'Options</h3>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Options (JSON array)
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Exemple: [{`{"title": "Option1", "description": "Description"}`}]
            </div>
            <textarea
              value={formData.options_cards || ''}
              onChange={(e) => handleJSONChange('options_cards', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs"
            />
        </div>
      </div>

      {/* Images */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🖼️ Images</h3>

        <div className="space-y-4">
          {/* Image Hero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Hero</label>
            {formData.image_hero && (
              <div className="mb-2 relative h-32 w-full bg-gray-100 rounded">
                <Image
                  src={formData.image_hero}
                  alt="Hero"
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
                if (file) onImageUpload(file, 'image_hero');
              }}
              disabled={uploading === 'image_hero'}
              className="block"
            />
          </div>

          {/* Images Store */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images Store (jusqu'à 10 photos)</label>
            <div className="grid grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                <div key={index} className="border rounded-lg p-2">
                  <div className="text-xs text-gray-600 mb-1">Image {index + 1}</div>
                  {formData.img_store?.[index] && (
                    <div className="mb-2 relative h-20 bg-gray-100 rounded">
                      <Image
                        src={formData.img_store[index]}
                        alt={`Store ${index + 1}`}
                        fill
                        sizes="120px"
                        className="object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onImageUpload(file, 'img_store', true, index);
                    }}
                    disabled={uploading === 'img_store'}
                    className="text-xs w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Autres Images */}
          {[
            { fieldName: 'image_store_small', label: 'Image miniature' },
            { fieldName: 'img_larg_ht', label: 'Image Largeur/Hauteur' },
            { fieldName: 'img_tol_dim', label: 'Image Dimensions Toile' },
            { fieldName: 'img_dim_coffre', label: 'Image Dimensions Coffre' },
            { fieldName: 'img_bras_led', label: 'Image Bras LED' },
          ].map(({ fieldName, label }) => (
            <div key={fieldName}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {formData[fieldName] && (
                <div className="mb-2 relative h-32 w-full bg-gray-100 rounded">
                  <Image
                    src={formData[fieldName]}
                    alt={label}
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
                  if (file) onImageUpload(file, fieldName);
                }}
                disabled={uploading === fieldName}
                className="block"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Autres champs */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">ℹ️ Autres Informations</h3>
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
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 pt-4">
        <button
          onClick={onSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          💾 Enregistrer
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
