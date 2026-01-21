'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

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

      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'admin@storal.fr').split(',').map(e => e.trim());
      const isAuthorized = adminEmails.includes(user.email || '');
      
      console.log('🔐 Admin check:', { email: user.email, isAuthorized });
      
      if (!isAuthorized) {
        console.log('❌ Admin: utilisateur non autorisé');
        setCheckingAuth(false);
        router.push('/');
        return;
      }

      setIsAdmin(true);
      setCheckingAuth(false);
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
      // Charger les statistiques des commandes
      const ordersResponse = await fetch('/api/admin/orders');
      const orders = await ordersResponse.json();
      
      // Charger les toiles
      const toilesResponse = await fetch('/api/admin/toiles');
      const toiles = await toilesResponse.json();

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
                  <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.totalAmountTTC}€</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status === 'pending' ? 'En attente' :
                     order.status === 'confirmed' ? 'Confirmée' :
                     order.status === 'completed' ? 'Terminée' :
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
