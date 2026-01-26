'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalToiles: 0,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        console.log('❌ Admin: pas d\'utilisateur connecté');
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
        const ok = res.ok;
        console.log('🔐 Admin server check:', ok);
        if (!ok) {
          setCheckingAuth(false);
          router.push('/');
          return;
        }
        setIsAdmin(true);
        setCheckingAuth(false);
      } catch (e) {
        console.error('Admin check error', e);
        setCheckingAuth(false);
        router.push('/');
      }
    };

    checkAdmin();
  }, [user, router]);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase non initialisé');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Non authentifié');

      // Charger les statistiques des commandes
      const ordersResponse = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!ordersResponse.ok) throw new Error('Erreur chargement commandes');
      const ordersData = await ordersResponse.json();
      const orders = Array.isArray(ordersData) ? ordersData : [];
      
      // Charger les toiles
      const toilesResponse = await fetch('/api/admin/toiles');
      const toilesData = await toilesResponse.json();
      const toiles = Array.isArray(toilesData) ? toilesData : [];

      setStats({
        totalOrders: orders.length || 0,
        pendingOrders: orders.filter((o: any) => o.status === 'pending').length || 0,
        totalToiles: toiles.length || 0,
        recentOrders: orders.slice(0, 5) || [],
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Afficher un loader pendant la vérification d'authentification
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  // Ne rien afficher si pas admin (la redirection est en cours)
  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenue dans l'espace d'administration</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commandes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-4">
              <span className="text-3xl">📦</span>
            </div>
          </div>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 mt-4 inline-block">
            Voir toutes les commandes →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Commandes en attente</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-4">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
          <Link href="/admin/orders" className="text-sm text-orange-600 hover:text-orange-700 mt-4 inline-block">
            Traiter les commandes →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toiles au catalogue</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalToiles}</p>
            </div>
            <div className="bg-green-100 rounded-full p-4">
              <span className="text-3xl">🎨</span>
            </div>
          </div>
          <Link href="/admin/toiles" className="text-sm text-green-600 hover:text-green-700 mt-4 inline-block">
            Gérer les toiles →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Abonnés Newsletter</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">—</p>
            </div>
            <div className="bg-purple-100 rounded-full p-4">
              <span className="text-3xl">📧</span>
            </div>
          </div>
          <Link href="/admin/newsletter" className="text-sm text-purple-600 hover:text-purple-700 mt-4 inline-block">
            Gérer newsletter →
          </Link>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/toiles"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl">➕</span>
            <div>
              <p className="font-semibold text-gray-900">Ajouter une toile</p>
              <p className="text-sm text-gray-600">Enrichir le catalogue</p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl">👀</span>
            <div>
              <p className="font-semibold text-gray-900">Voir les commandes</p>
              <p className="text-sm text-gray-600">Gérer les demandes clients</p>
            </div>
          </Link>

          <Link
            href="/admin/newsletter"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl">📧</span>
            <div>
              <p className="font-semibold text-gray-900">Abonnés Newsletter</p>
              <p className="text-sm text-gray-600">Gérer les inscriptions</p>
            </div>
          </Link>

          <Link
            href="/admin/seo"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl">🔍</span>
            <div>
              <p className="font-semibold text-gray-900">Gestion SEO</p>
              <p className="text-sm text-gray-600">Métadonnées et référencement</p>
            </div>
          </Link>

          <Link
            href="/admin/hero-slides"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl">🎨</span>
            <div>
              <p className="font-semibold text-gray-900">Carrousel Hero</p>
              <p className="text-sm text-gray-600">Gérer les slides d'accueil</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Commandes récentes */}
      {stats.recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Commandes récentes</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-600">{order.customer_email || order.customer_name || 'Client'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{Number(order.total_amount || 0).toFixed(2)}€</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    order.status === 'paid' ? 'bg-green-100 text-green-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status === 'pending' ? 'En attente' :
                     order.status === 'paid' ? 'Payée' :
                     order.status === 'processing' ? 'Préparation' :
                     order.status === 'shipped' ? 'Expédiée' :
                     order.status === 'delivered' ? 'Livrée' :
                     order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide de démarrage */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-blue-900 mb-3">🚀 Guide de démarrage</h2>
        <div className="space-y-2 text-sm text-blue-800">
          <p>✓ <strong>Gérer les toiles :</strong> Ajoutez, modifiez ou supprimez des toiles du catalogue</p>
          <p>✓ <strong>Traiter les commandes :</strong> Consultez et gérez les commandes clients</p>
          <p>✓ <strong>Suivre l'activité :</strong> Surveillez les statistiques en temps réel</p>
        </div>
      </div>
    </div>
  );
}
