'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

interface AdminOrderItem {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  customer_email: string;
  payment_method?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  items?: any[];
  notes?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderItem | null>(null);

  // Calcul des statistiques - protection contre les non-tableaux
  const ordersArray = Array.isArray(orders) ? orders : [];
  const stats = {
    total: ordersArray.length,
    totalRevenue: ordersArray.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
    pending: ordersArray.filter(o => o.status === 'pending').length,
    paid: ordersArray.filter(o => o.status === 'paid').length,
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase non initialisé');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Non authentifié');

      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (paymentFilter) params.set('paymentMethod', paymentFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      // S'assurer que data est un tableau
      setOrders(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, paymentFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase non initialisé');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Non authentifié');

      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Erreur mise à jour');
      await fetchOrders();
    } catch (e: any) {
      setError(e.message || 'Erreur');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin • Commandes</h1>
        
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Total Commandes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Chiffre d'affaires</p>
            <p className="text-2xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)}€</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">En attente</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Payées</p>
            <p className="text-2xl font-bold text-blue-600">{stats.paid}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div>
            <label className="text-sm text-gray-700 mr-2">Statut</label>
            <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Tous</option>
              <option value="pending">pending</option>
              <option value="processing">processing</option>
              <option value="paid">paid</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700 mr-2">Paiement</label>
            <select value={paymentFilter} onChange={(e)=>setPaymentFilter(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Tous</option>
              <option value="stripe">stripe</option>
              <option value="cheque">cheque</option>
              <option value="virement">virement</option>
            </select>
          </div>
          <button onClick={fetchOrders} className="ml-auto bg-gray-100 px-3 py-2 rounded hover:bg-gray-200">Rafraîchir</button>
        </div>

        {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>}

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6">Chargement...</div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y">
            {orders.map(o => (
              <div key={o.id} className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold">{o.id.slice(0,8)} • {new Date(o.created_at).toLocaleString('fr-FR')}</p>
                  <p className="text-sm text-gray-600">{o.customer_email} • {o.payment_method || '—'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-700 font-medium">{Number(o.total_amount).toFixed(2)}€</span>
                  <button 
                    onClick={() => setSelectedOrder(o)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Détails
                  </button>
                  <select value={o.status} onChange={(e)=>updateStatus(o.id, e.target.value)} className="border rounded px-2 py-1">
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="paid">paid</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal détails commande */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Commande {selectedOrder.id.slice(0, 8)}</h2>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Statut</p>
                      <p className="font-medium">{selectedOrder.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedOrder.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Méthode de paiement</p>
                      <p className="font-medium">{selectedOrder.payment_method || '—'}</p>
                    </div>
                    {selectedOrder.customer_name && (
                      <div>
                        <p className="text-sm text-gray-600">Nom</p>
                        <p className="font-medium">{selectedOrder.customer_name}</p>
                      </div>
                    )}
                    {selectedOrder.customer_phone && (
                      <div>
                        <p className="text-sm text-gray-600">Téléphone</p>
                        <p className="font-medium">{selectedOrder.customer_phone}</p>
                      </div>
                    )}
                  </div>

                  {selectedOrder.customer_address && (
                    <div>
                      <p className="text-sm text-gray-600">Adresse</p>
                      <p className="font-medium whitespace-pre-line">{selectedOrder.customer_address}</p>
                    </div>
                  )}

                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Articles</h3>
                      <div className="space-y-2">
                        {selectedOrder.items.map((item: any, idx: number) => (
                          <div key={idx} className="border rounded p-3 bg-gray-50">
                            <p className="font-medium">{item.product_name || 'Produit'}</p>
                            <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                            <p className="text-sm text-gray-600">Prix unitaire: {Number(item.price_per_unit || 0).toFixed(2)}€</p>
                            {item.configuration && (
                              <details className="mt-2">
                                <summary className="text-sm text-blue-600 cursor-pointer">Configuration</summary>
                                <pre className="text-xs bg-white p-2 mt-1 rounded overflow-x-auto">{JSON.stringify(item.configuration, null, 2)}</pre>
                              </details>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedOrder.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="font-medium whitespace-pre-line">{selectedOrder.notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-xl font-bold text-right">Total: {Number(selectedOrder.total_amount).toFixed(2)}€</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
