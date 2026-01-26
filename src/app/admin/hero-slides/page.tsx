'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface HeroSlide {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  image_url?: string;
  image_overlay: number; // 0-100, opacité du voile noir
  bg_gradient: string;
  text_color: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminHeroSlidesPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        router.push('/auth');
        return;
      }

      setIsAuthed(true);
      fetchSlides();
    };

    checkAuth();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      const data = await response.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des slides' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSlide || !selectedSlide.id) return;

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage({ type: 'error', text: 'Session expirée' });
        setSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('slideId', selectedSlide.id.toString());

      const response = await fetch('/api/hero-slides/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        let errText = 'Erreur lors du téléchargement';
        try {
          const errJson = await response.json();
          errText = errJson?.error || errText;
        } catch {
          // ignore
        }
        setMessage({ type: 'error', text: errText });
        setSaving(false);
        return;
      }

      const result = await response.json();
      if (result.success && result.slide) {
        setSelectedSlide(result.slide);
        setMessage({ type: 'success', text: 'Image téléchargée et sauvegardée' });
        fetchSlides();
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: error?.message || 'Erreur lors du téléchargement' });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (slideToSave?: HeroSlide) => {
    const payload = slideToSave || selectedSlide;
    if (!payload) return;

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage({ type: 'error', text: 'Session expirée' });
        return;
      }

      const response = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errText = 'Erreur lors de la sauvegarde';
        try {
          const errJson = await response.json();
          errText = errJson?.error || errText;
        } catch {
          // ignore json parse error
        }
        throw new Error(errText);
      }

      const updated = await response.json();
      setMessage({ type: 'success', text: 'Slide mis à jour avec succès' });
      setSelectedSlide(updated);
      fetchSlides();
    } catch (error: any) {
      console.error('Error saving slide:', error);
      setMessage({ type: 'error', text: error?.message || 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce slide ?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/hero-slides?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (!response.ok) throw new Error('Failed to delete');

      setMessage({ type: 'success', text: 'Slide supprimé' });
      fetchSlides();
      setSelectedSlide(null);
    } catch (error) {
      console.error('Error deleting slide:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const handleNew = () => {
    setSelectedSlide({
      title: '',
      subtitle: '',
      description: '',
      button_text: '',
      button_link: '',
      image_overlay: 40,
      bg_gradient: 'from-blue-500 to-blue-600',
      text_color: 'text-white',
      display_order: slides.length + 1,
      is_active: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!isAuthed) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion du Carrousel Hero</h1>
          <button
            onClick={handleNew}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            ➕ Nouveau Slide
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des slides */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Slides ({slides.length})</h2>
              <div className="space-y-2">
                {slides.map((slide) => (
                  <button
                    key={slide.id}
                    onClick={() => setSelectedSlide(slide)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedSlide?.id === slide.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm truncate">{slide.title}</div>
                    <div className="text-xs opacity-75">Ordre: {slide.display_order} • {slide.is_active ? 'Actif' : 'Inactif'}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Éditeur */}
          <div className="lg:col-span-2">
            {selectedSlide ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-6">
                  {selectedSlide.id ? `Éditer Slide #${selectedSlide.id}` : 'Nouveau Slide'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      type="text"
                      value={selectedSlide.title}
                      onChange={(e) => setSelectedSlide({ ...selectedSlide, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Titre principal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
                    <input
                      type="text"
                      value={selectedSlide.subtitle}
                      onChange={(e) => setSelectedSlide({ ...selectedSlide, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Sous-titre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={selectedSlide.description}
                      onChange={(e) => setSelectedSlide({ ...selectedSlide, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      placeholder="Description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton</label>
                      <input
                        type="text"
                        value={selectedSlide.button_text}
                        onChange={(e) => setSelectedSlide({ ...selectedSlide, button_text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="En savoir plus"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lien du bouton</label>
                      <select
                        value={selectedSlide.button_link}
                        onChange={(e) => setSelectedSlide({ ...selectedSlide, button_link: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Sélectionner une page...</option>
                        <option value="/">🏠 Accueil</option>
                        <optgroup label="Produits">
                          <option value="/products/store-banne">Store Banne</option>
                          <option value="/products/porte-blindee">Porte Blindée</option>
                          <option value="/products/store-antichaleur">Store Anti-Chaleur</option>
                          <option value="/kissimy">Kissimy</option>
                        </optgroup>
                        <optgroup label="Pages">
                          <option value="/contact">Contact</option>
                          <option value="/cgv">Conditions Générales de Vente</option>
                          <option value="/confidentialite">Politique de Confidentialité</option>
                          <option value="/mentions-legales">Mentions Légales</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image de fond (optionnel)</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                          <div className="text-center">
                            <span className="text-sm text-gray-600">📤 Télécharger une image</span>
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                      {selectedSlide.image_url && (
                        <div className="relative">
                          <img src={selectedSlide.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg border" />
                          <button
                            type="button"
                            onClick={() => setSelectedSlide({ ...selectedSlide, image_url: '' })}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      <input
                        type="text"
                        value={selectedSlide.image_url || ''}
                        onChange={(e) => setSelectedSlide({ ...selectedSlide, image_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Ou URL d'image"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dégradé de fond</label>
                      <select
                        value={selectedSlide.bg_gradient}
                        onChange={(e) => setSelectedSlide({ ...selectedSlide, bg_gradient: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="from-blue-500 to-blue-600">Bleu</option>
                        <option value="from-orange-500 to-yellow-500">Orange-Jaune</option>
                        <option value="from-red-500 to-orange-500">Rouge-Orange</option>
                        <option value="from-gray-700 to-slate-600">Gris foncé</option>
                        <option value="from-green-500 to-teal-500">Vert-Teal</option>
                        <option value="from-purple-500 to-pink-500">Violet-Rose</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
                      <input
                        type="number"
                        value={selectedSlide.display_order}
                        onChange={(e) => setSelectedSlide({ ...selectedSlide, display_order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assombrissement de l'image ({selectedSlide.image_overlay}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedSlide.image_overlay || 40}
                      onChange={(e) => setSelectedSlide({ ...selectedSlide, image_overlay: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">0 = transparent, 100 = totalement noir</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={selectedSlide.is_active}
                      onChange={(e) => setSelectedSlide({ ...selectedSlide, is_active: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-700">Slide actif (visible sur le site)</label>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleSave()}
                      disabled={saving}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {saving ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                    {selectedSlide.id && (
                      <button
                        onClick={() => handleDelete(selectedSlide.id!)}
                        className="px-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                      >
                        🗑️ Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Sélectionnez un slide ou créez-en un nouveau
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
