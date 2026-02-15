'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string;
  delivery_country: string;
  items: any[];
  total_items: number;
  total_amount: number;
  status: string;
  payment_method: string;
  notes: string | null;
}

export default function MonComptePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      const { getSupabaseClient } = await import('@/lib/supabase');
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Session non valide');
        return;
      }

      const response = await fetch('/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger vos commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Payée', color: 'bg-green-100 text-green-800' },
      processing: { label: 'En préparation', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Livrée', color: 'bg-teal-100 text-teal-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      stripe: 'Carte bancaire',
      cheque: 'Chèque',
      virement: 'Virement bancaire'
    };
    return methods[method] || method;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mon compte
              </h1>
              <p className="text-gray-600">
                Bienvenue, <span className="font-semibold text-blue-600">{user.email}</span>
              </p>
            </div>
            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📦 Mes commandes
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucune commande
              </h3>
              <p className="text-gray-500 mb-6">
                Vous n'avez pas encore passé de commande
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Découvrir nos produits
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">
                          Commande #{order.id.slice(0, 8)}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          📅 {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p>💳 {getPaymentMethodLabel(order.payment_method)}</p>
                        <p>📍 {order.delivery_city}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {Number(order.total_amount).toFixed(2)} €
                        </p>
                      </div>
                      <Link
                        href={`/confirmation/${order.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2"
                      >
                        Voir les détails
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-sm text-gray-600 mb-2">Articles ({order.total_items}):</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items?.slice(0, 3).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-gray-50 px-3 py-1 rounded-lg text-sm text-gray-700"
                        >
                          {item.productName} × {item.quantity}
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="bg-gray-50 px-3 py-1 rounded-lg text-sm text-gray-500">
                          +{order.items.length - 3} autres
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
