'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  slug: string;
  name: string;
  display_name: string;
  description?: string;
  gradient_from?: string;
  gradient_to?: string;
  order_index: number;
  image_url?: string;
  image_alt?: string;
}

interface Subcategory {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description?: string;
  order_index: number;
  image_url?: string;
  image_alt?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    slug: '',
    name: '',
    displayName: '',
    description: '',
    gradientFrom: '',
    gradientTo: '',
    orderIndex: 0,
    imageUrl: '',
    imageAlt: '',
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    slug: '',
    name: '',
    description: '',
    orderIndex: 0,
    imageUrl: '',
    imageAlt: '',
  });

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}/subcategories`);
      const data = await res.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  // Handle category selection
  const handleSelectCategory = (category: Category) => {
    setSelectedCategoryId(category.id);
    fetchSubcategories(category.id);
  };

  // Category CRUD
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      });

      if (!res.ok) throw new Error('Failed to save category');

      fetchCategories();
      resetCategoryForm();
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Erreur lors de la sauvegarde de la catégorie');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      
      fetchCategories();
      setSelectedCategoryId(null);
      setSubcategories([]);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Subcategory CRUD
  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;

    try {
      const url = editingSubcategory
        ? `/api/admin/categories/subcategories/${editingSubcategory.id}`
        : `/api/admin/categories/${selectedCategoryId}/subcategories`;
      
      const method = editingSubcategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subcategoryForm),
      });

      if (!res.ok) throw new Error('Failed to save subcategory');

      fetchSubcategories(selectedCategoryId);
      resetSubcategoryForm();
      setEditingSubcategory(null);
    } catch (error) {
      console.error('Error saving subcategory:', error);
      alert('Erreur lors de la sauvegarde de la sous-catégorie');
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?')) return;

    try {
      const res = await fetch(`/api/admin/categories/subcategories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete subcategory');
      
      if (selectedCategoryId) {
        fetchSubcategories(selectedCategoryId);
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Image upload
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, isSubcategory: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', isSubcategory ? 'subcategory' : 'category');
      formData.append('itemId', isSubcategory ? editingSubcategory?.id || '' : editingCategory?.id || '');

      const res = await fetch('/api/admin/categories/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload image');

      const { url } = await res.json();

      if (isSubcategory) {
        setSubcategoryForm(prev => ({ ...prev, imageUrl: url }));
      } else {
        setCategoryForm(prev => ({ ...prev, imageUrl: url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      slug: '',
      name: '',
      displayName: '',
      description: '',
      gradientFrom: '',
      gradientTo: '',
      orderIndex: 0,
      imageUrl: '',
      imageAlt: '',
    });
  };

  const resetSubcategoryForm = () => {
    setSubcategoryForm({
      slug: '',
      name: '',
      description: '',
      orderIndex: 0,
      imageUrl: '',
      imageAlt: '',
    });
  };

  const startEditCategory = (category: Category) => {
    setCategoryForm({
      slug: category.slug,
      name: category.name,
      displayName: category.display_name,
      description: category.description || '',
      gradientFrom: category.gradient_from || '',
      gradientTo: category.gradient_to || '',
      orderIndex: category.order_index,
      imageUrl: category.image_url || '',
      imageAlt: category.image_alt || '',
    });
    setEditingCategory(category);
  };

  const startEditSubcategory = (subcategory: Subcategory) => {
    setSubcategoryForm({
      slug: subcategory.slug,
      name: subcategory.name,
      description: subcategory.description || '',
      orderIndex: subcategory.order_index,
      imageUrl: subcategory.image_url || '',
      imageAlt: subcategory.image_alt || '',
    });
    setEditingSubcategory(subcategory);
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Link href="/admin" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Retour
      </Link>

      <h1 className="text-3xl font-bold mb-8">Gestion des Catégories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Catégories */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingCategory ? 'Modifier une catégorie' : 'Ajouter une catégorie'}
            </h2>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Slug (store-banne)"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Nom interne (store_banne)"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Nom affiché (Stores Bannes)"
                value={categoryForm.displayName}
                onChange={(e) => setCategoryForm({ ...categoryForm, displayName: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <textarea
                placeholder="Description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Dégradé de (rose-100)"
                  value={categoryForm.gradientFrom}
                  onChange={(e) => setCategoryForm({ ...categoryForm, gradientFrom: e.target.value })}
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Dégradé à (yellow-100)"
                  value={categoryForm.gradientTo}
                  onChange={(e) => setCategoryForm({ ...categoryForm, gradientTo: e.target.value })}
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Ordre"
                  value={categoryForm.orderIndex}
                  onChange={(e) => setCategoryForm({ ...categoryForm, orderIndex: parseInt(e.target.value) })}
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded p-4">
                <label className="block text-sm font-medium mb-2">Image de la catégorie</label>
                {categoryForm.imageUrl && (
                  <div className="mb-4">
                    <img src={categoryForm.imageUrl} alt="Aperçu" className="max-h-48 rounded" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadImage(e, false)}
                  disabled={uploading}
                  className="block w-full"
                />
              </div>

              <input
                type="text"
                placeholder="Texte alternatif de l'image"
                value={categoryForm.imageAlt}
                onChange={(e) => setCategoryForm({ ...categoryForm, imageAlt: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
                >
                  {editingCategory ? 'Mettre à jour' : 'Créer'}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      resetCategoryForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 font-medium"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Liste des catégories */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="font-bold text-lg">Catégories</h3>
            </div>
            <div className="divide-y">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedCategoryId === cat.id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1"
                      onClick={() => handleSelectCategory(cat)}
                    >
                      {cat.image_url && (
                        <img src={cat.image_url} alt={cat.display_name} className="w-16 h-16 object-cover rounded mb-2" />
                      )}
                      <h4 className="font-bold">{cat.display_name}</h4>
                      <p className="text-sm text-gray-600">{cat.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditCategory(cat)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sous-catégories */}
        {selectedCategoryId && (
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-6">
              {editingSubcategory ? 'Modifier' : 'Ajouter'} une sous-catégorie
            </h2>

            <form onSubmit={handleSaveSubcategory} className="space-y-4">
              <input
                type="text"
                placeholder="Slug"
                value={subcategoryForm.slug}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                placeholder="Nom"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <textarea
                placeholder="Description"
                value={subcategoryForm.description}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />

              <input
                type="number"
                placeholder="Ordre"
                value={subcategoryForm.orderIndex}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, orderIndex: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="border-2 border-dashed border-gray-300 rounded p-2">
                {subcategoryForm.imageUrl && (
                  <img src={subcategoryForm.imageUrl} alt="Aperçu" className="max-h-32 rounded mb-2" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadImage(e, true)}
                  disabled={uploading}
                  className="block w-full text-sm"
                />
              </div>

              <input
                type="text"
                placeholder="Texte alt image"
                value={subcategoryForm.imageAlt}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, imageAlt: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium"
                >
                  {editingSubcategory ? 'Mettre à jour' : 'Ajouter'}
                </button>
                {editingSubcategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSubcategory(null);
                      resetSubcategoryForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 font-medium"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>

            {/* Liste des sous-catégories */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold mb-3">Sous-catégories</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {subcategories.map((subcat) => (
                  <div key={subcat.id} className="p-3 bg-gray-50 rounded hover:bg-gray-100 text-sm">
                    {subcat.image_url && (
                      <img src={subcat.image_url} alt={subcat.name} className="w-12 h-12 object-cover rounded mb-2" />
                    )}
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <p className="font-medium">{subcat.name}</p>
                        <p className="text-xs text-gray-600">{subcat.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => startEditSubcategory(subcat)}
                        className="text-blue-600 hover:text-blue-700 text-xs"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteSubcategory(subcat.id)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                {subcategories.length === 0 && (
                  <p className="text-gray-500 text-sm">Aucune sous-catégorie</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
