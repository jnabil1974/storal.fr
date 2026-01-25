'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface SEOPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  canonical_url: string;
  robots: string;
  updated_at: string;
}

export default function AdminSEOPage() {
  const router = useRouter();
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<SEOPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }

      fetchPages();
    };

    checkAuth();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/seo');
      const data = await response.json();
      setPages(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0) {
        setSelectedPage(data[0]);
      }
    } catch (error) {
      console.error('Error fetching SEO pages:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des pages' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage({ type: 'error', text: 'Session expirée' });
        return;
      }

      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          slug: selectedPage.slug,
          title: selectedPage.title,
          description: selectedPage.description,
          keywords: selectedPage.keywords,
          og_title: selectedPage.og_title,
          og_description: selectedPage.og_description,
          og_image: selectedPage.og_image,
          canonical_url: selectedPage.canonical_url,
          robots: selectedPage.robots,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      const updated = await response.json();
      setSelectedPage(updated);
      setPages(pages.map(p => p.slug === updated.slug ? updated : p));
      setMessage({ type: 'success', text: 'Métadonnées SEO mises à jour avec succès' });
    } catch (error) {
      console.error('Error saving SEO metadata:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  const filteredPages = pages.filter(p =>
    p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion SEO</h1>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des pages */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Pages</h2>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPage(page)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedPage?.id === page.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm truncate">{page.slug}</div>
                    <div className="text-xs opacity-75 truncate">{page.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Éditeur de métadonnées */}
          <div className="lg:col-span-2">
            {selectedPage ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-6">
                  Éditer: <span className="text-blue-600">{selectedPage.slug}</span>
                </h2>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title (Balise &lt;title&gt;)
                    </label>
                    <input
                      type="text"
                      value={selectedPage.title || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Titre de la page"
                      maxLength={60}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedPage.title?.length || 0}/60 caractères
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={selectedPage.description || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description de la page (apparaît dans les résultats Google)"
                      rows={3}
                      maxLength={160}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedPage.description?.length || 0}/160 caractères
                    </div>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mots-clés
                    </label>
                    <input
                      type="text"
                      value={selectedPage.keywords || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, keywords: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mots-clés séparés par des virgules"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Exemple: store, banne, personnalisé
                    </div>
                  </div>

                  {/* OG Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OG Title (Partage réseau sociaux)
                    </label>
                    <input
                      type="text"
                      value={selectedPage.og_title || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, og_title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Titre pour les réseaux sociaux"
                      maxLength={60}
                    />
                  </div>

                  {/* OG Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OG Description (Partage réseau sociaux)
                    </label>
                    <textarea
                      value={selectedPage.og_description || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, og_description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description pour les réseaux sociaux"
                      rows={2}
                    />
                  </div>

                  {/* OG Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OG Image (URL complète)
                    </label>
                    <input
                      type="text"
                      value={selectedPage.og_image || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, og_image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Image affichée lors du partage sur les réseaux sociaux (1200x630px recommandé)
                    </div>
                  </div>

                  {/* Canonical URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Canonique
                    </label>
                    <input
                      type="text"
                      value={selectedPage.canonical_url || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, canonical_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://storal.fr/..."
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      URL canonique pour éviter le contenu dupliqué
                    </div>
                  </div>

                  {/* Robots */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Robots Meta Tag
                    </label>
                    <select
                      value={selectedPage.robots || 'index, follow'}
                      onChange={(e) => setSelectedPage({ ...selectedPage, robots: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="index, follow">Index, Follow (page publique)</option>
                      <option value="noindex, follow">NoIndex, Follow (caché, liens suivis)</option>
                      <option value="index, nofollow">Index, NoFollow (visible, liens ignorés)</option>
                      <option value="noindex, nofollow">NoIndex, NoFollow (complètement caché)</option>
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      Contrôle comment Google indexe cette page
                    </div>
                  </div>

                  {/* Dernière modification */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Dernière modification: {new Date(selectedPage.updated_at).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                    >
                      {saving ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Sélectionnez une page pour éditer ses métadonnées SEO
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
