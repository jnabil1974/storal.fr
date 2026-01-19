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
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

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
      setOrders(data);
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
        <p className="text-sm text-gray-600 mb-4">Accès réservé aux emails listés dans NEXT_PUBLIC_ADMIN_EMAILS</p>

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
                <div>
                  <p className="font-semibold">{o.id.slice(0,8)} • {new Date(o.created_at).toLocaleString('fr-FR')}</p>
                  <p className="text-sm text-gray-600">{o.customer_email} • {o.payment_method || '—'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-700 font-medium">{Number(o.total_amount).toFixed(2)}€</span>
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
      </div>
    </div>
  );
}
