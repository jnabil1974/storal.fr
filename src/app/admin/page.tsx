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
  const [setupMessage, setSetupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
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
      
      // Charger les toiles depuis Supabase
      const toilesResponse = await fetch('/api/admin/toile-colors');
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

  const initializeStorage = async () => {
    setSetupLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase non initialisé');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Non authentifié');

      const response = await fetch('/api/admin/setup-storage', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur initialisation');
      }

      const result = await response.json();
      setSetupMessage({ type: 'success', text: result.message });
    } catch (error: any) {
      console.error('Setup error:', error);
      setSetupMessage({ type: 'error', text: error?.message || 'Erreur' });
    } finally {
      setSetupLoading(false);
    }
  };
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-xl font-bold text-[#2c3e50] uppercase tracking-wider">Vérification...</p>
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-xl font-bold text-[#2c3e50] uppercase tracking-wider">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#2c3e50] uppercase tracking-tight">Dashboard</h1>
          <p className="text-gray-600 mt-2 font-semibold">Bienvenue dans l'espace d'administration</p>
        </div>
        <button
          onClick={initializeStorage}
          disabled={setupLoading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold uppercase tracking-wider hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all celestial-glow text-sm"
        >
          {setupLoading ? '⚙️ Initialisation...' : '⚙️ Config Storage'}
        </button>
      </div>

      {setupMessage && (
        <div className={`p-5 rounded-xl font-semibold backdrop-blur-sm ${
          setupMessage.type === 'success' 
            ? 'bg-green-50/80 text-green-800 border border-green-200' 
            : 'bg-red-50/80 text-red-800 border border-red-200'
        }`}>
          {setupMessage.text}
        </div>
      )}

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 group hover:scale-[1.02] celestial-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Commandes</p>
              <p className="text-4xl font-black text-[#2c3e50] mt-3">{stats.totalOrders}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-4xl">📦</span>
            </div>
          </div>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-bold mt-5 inline-flex items-center gap-2 uppercase tracking-wider">
            Voir tout
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 group hover:scale-[1.02] celestial-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">En attente</p>
              <p className="text-4xl font-black text-rose-600 mt-3">{stats.pendingOrders}</p>
            </div>
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-4xl">⏳</span>
            </div>
          </div>
          <Link href="/admin/orders" className="text-sm text-rose-600 hover:text-rose-700 font-bold mt-5 inline-flex items-center gap-2 uppercase tracking-wider">
            Traiter
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 group hover:scale-[1.02] celestial-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Toiles</p>
              <p className="text-4xl font-black text-green-600 mt-3">{stats.totalToiles}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-4xl">🎨</span>
            </div>
          </div>
          <Link href="/admin/toiles" className="text-sm text-green-600 hover:text-green-700 font-bold mt-5 inline-flex items-center gap-2 uppercase tracking-wider">
            Gérer
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 group hover:scale-[1.02] celestial-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Newsletter</p>
              <p className="text-4xl font-black text-purple-600 mt-3">—</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-4xl">📧</span>
            </div>
          </div>
          <Link href="/admin/newsletter" className="text-sm text-purple-600 hover:text-purple-700 font-bold mt-5 inline-flex items-center gap-2 uppercase tracking-wider">
            Gérer
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 group hover:scale-[1.02] celestial-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Ordre affichage</p>
              <p className="text-4xl font-black text-indigo-600 mt-3">🔢</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-4xl">⬍⬍</span>
            </div>
          </div>
          <Link href="/admin/product-order" className="text-sm text-indigo-600 hover:text-indigo-700 font-bold mt-5 inline-flex items-center gap-2 uppercase tracking-wider">
            Réorganiser
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 group hover:scale-[1.02] celestial-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Gestion SEO</p>
              <p className="text-4xl font-black text-cyan-600 mt-3">🔍</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-4xl">📊</span>
            </div>
          </div>
          <Link href="/admin/seo" className="text-sm text-cyan-600 hover:text-cyan-700 font-bold mt-5 inline-flex items-center gap-2 uppercase tracking-wider">
            Optimiser
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 group hover:scale-[1.02] celestial-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Flux Chatbot</p>
              <p className="text-4xl font-black text-amber-600 mt-3">🤖</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-4xl">💬</span>
            </div>
          </div>
          <Link 
            href="/admin/flux-chatbot"
            className="text-sm text-amber-600 hover:text-amber-700 font-bold mt-5 inline-flex items-center gap-2 uppercase tracking-wider"
          >
            Voir le flux
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 group hover:scale-[1.02] celestial-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Coefficients</p>
              <p className="text-4xl font-black text-emerald-600 mt-3">💰</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-4xl">📈</span>
            </div>
          </div>
          <Link 
            href="/admin/coefficients"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-bold mt-5 inline-flex items-center gap-2 uppercase tracking-wider"
          >
            Gérer marges
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Commandes récentes */}
      {stats.recentOrders.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-[#2c3e50] uppercase tracking-tight">Commandes récentes</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider inline-flex items-center gap-2">
              Voir tout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:bg-gray-50/80 hover:shadow-md transition-all group">
                <div>
                  <p className="font-black text-[#2c3e50] uppercase text-sm tracking-wider">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-600 font-semibold mt-1">{order.customer_email || order.customer_name || 'Client'}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#2c3e50] text-lg">{Number(order.total_amount || 0).toFixed(2)}€</p>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${
                    order.status === 'pending' ? 'bg-rose-100 text-rose-700' :
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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200/50 shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-4xl">🚀</span>
          <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Guide de démarrage</h2>
        </div>
        <div className="space-y-3 text-sm text-blue-800 font-semibold">
          <p className="flex items-start gap-3">
            <span className="text-green-600 text-lg">✓</span>
            <span><strong className="font-black">Gérer les toiles :</strong> Ajoutez, modifiez ou supprimez des toiles du catalogue</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-green-600 text-lg">✓</span>
            <span><strong className="font-black">Traiter les commandes :</strong> Consultez et gérez les commandes clients</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-green-600 text-lg">✓</span>
            <span><strong className="font-black">Suivre l'activité :</strong> Surveillez les statistiques en temps réel</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-amber-600 text-lg">🤖</span>
            <span><strong className="font-black">Flux Chatbot :</strong> Consultez le diagramme complet de conversation du chatbot (règles de validation 4m, redirection contact, etc.)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
