'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase';

type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed' | 'pending';
  verified_at?: string | null;
};

export default function AdminNewsletter() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'email'>('date');

  // Vérifier si admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setCheckingAuth(false);
        router.push('/auth');
        return;
      }

      try {
        const supabase = getSupabaseClient();
        if (!supabase) throw new Error('Supabase non initialisé');
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) {
          setCheckingAuth(false);
          router.push('/auth');
          return;
        }
        const res = await fetch('/api/admin/check', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          setCheckingAuth(false);
          router.push('/');
          return;
        }
        setIsAdmin(true);
        setCheckingAuth(false);
        fetchSubscribers();
      } catch (error) {
        console.error('Auth error:', error);
        setCheckingAuth(false);
        router.push('/');
      }
    };

    checkAdmin();
  }, [user, router]);

  const fetchSubscribers = async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase non initialisé');

      const { data, error } = await supabase
        .from('newsletter')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (id: string, email: string) => {
    if (!confirm(`Désabonner ${email} ?`)) return;

    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase non initialisé');

      const { error } = await supabase
        .from('newsletter')
        .update({ status: 'unsubscribed' })
        .eq('id', id);

      if (error) throw error;

      setSubscribers(subscribers.map(s => 
        s.id === id ? { ...s, status: 'unsubscribed' } : s
      ));
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Erreur lors de la désinscription');
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Supprimer définitivement ${email} ?`)) return;

    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase non initialisé');

      const { error } = await supabase
        .from('newsletter')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubscribers(subscribers.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ['Email', 'Date d\'inscription', 'Statut'],
      ...subscribers.map(s => [
        s.email,
        new Date(s.subscribed_at).toLocaleDateString('fr-FR'),
        s.status
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
    (s.status === 'active' || searchEmail.includes('unsubscribed'))
  );

  const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
    if (sortBy === 'email') {
      return a.email.localeCompare(b.email);
    }
    return new Date(b.subscribed_at).getTime() - new Date(a.subscribed_at).getTime();
  });

  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;
  const pendingCount = subscribers.filter(s => s.status === 'pending').length;

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Vérification...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Accès refusé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Retour au dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter</h1>
          <p className="text-gray-600">Gestion des abonnés</p>
        </div>

        {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total abonnés</div>
            <div className="text-3xl font-bold text-gray-900">{subscribers.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Actifs</div>
            <div className="text-3xl font-bold text-green-600">{activeCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Désabonnés</div>
            <div className="text-3xl font-bold text-red-600">{unsubscribedCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">En attente</div>
            <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Rechercher par email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'email')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="date">Trier par date</option>
              <option value="email">Trier par email</option>
            </select>
            <button
              onClick={handleExportCSV}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              📥 Exporter CSV
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {sortedSubscribers.length} abonné{sortedSubscribers.length !== 1 ? 's' : ''} trouvé{sortedSubscribers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Chargement...</div>
          ) : sortedSubscribers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun abonné trouvé
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date d'inscription</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vérifié</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{subscriber.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(subscriber.subscribed_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        subscriber.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.status === 'active' ? '✓ Actif' : '✗ Désabonné'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {subscriber.verified_at ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Oui</span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Non</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {subscriber.status === 'active' && (
                        <button
                          onClick={() => handleUnsubscribe(subscriber.id, subscriber.email)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Désabonner
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(subscriber.id, subscriber.email)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
