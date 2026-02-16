'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface OrderListItem {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  payment_method?: string;
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [urlToken, setUrlToken] = useState('');

  useEffect(() => {
    // Check URL params for email + token (guest verification link from email)
    const params = new URLSearchParams(window.location.search);
    const urlEmail = params.get('email');
    const urlTok = params.get('token');
    if (urlEmail && urlTok) {
      setEmail(urlEmail);
      setToken(urlTok);
      setUrlToken(urlTok);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        let url = '';
        if (user) {
          url = `/api/orders?userId=${encodeURIComponent(user.id)}`;
        } else {
          // If guest has token + email from link, use them
          if (token && email) {
            url = `/api/orders?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
          } else {
            const sessionId = localStorage.getItem('cart_session_id');
            if (!sessionId) { setOrders([]); return; }
            url = `/api/orders?sessionId=${encodeURIComponent(sessionId)}`;
          }
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erreur de chargement');
        const data = await res.json();
        const list: OrderListItem[] = Array.isArray(data) ? data : [data];
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setOrders(list);
      } catch (e) {
        setError('Impossible de charger vos commandes');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user, token, email]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes commandes</h1>
        <p className="text-sm text-gray-600 mb-6">Ces commandes sont liées à cette session de navigateur. Vous pouvez aussi rechercher par email.</p>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email) return;
              setIsSearching(true);
              setError('');
              try {
                const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
                if (!res.ok) throw new Error('Erreur');
                const data = await res.json();
                const list: OrderListItem[] = Array.isArray(data) ? data : [data];
                setOrders(list);
              } catch (e) {
                setError("Recherche par email impossible");
              } finally {
                setIsSearching(false);
              }
            }}
          >
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Token (optionnel)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              disabled={!!urlToken}
              title="Fourni automatiquement via le lien de l'email"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isSearching}
            >
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>
        </div>

        {isLoading && (
          <div className="bg-white rounded-lg shadow p-6">Chargement...</div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 mb-4">Aucune commande {user ? 'associée à votre compte' : 'associée à cette session'}.</p>
            <Link href="/">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Découvrir les produits</button>
            </Link>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div className="bg-white rounded-lg shadow divide-y">
            {orders.map((o) => (
              <div key={o.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Commande {o.id.slice(0,8)}</p>
                  <p className="text-sm text-gray-600">{new Date(o.created_at).toLocaleString('fr-FR')}</p>
                  <p className="text-sm text-gray-700">Statut: <span className="font-medium">
                    {o.status === 'paid' ? 'Payée' :
                     o.status === 'pending' ? 'En attente' :
                     o.status === 'processing' ? 'En préparation' :
                     o.status === 'shipped' ? 'Expédiée' :
                     o.status === 'delivered' ? 'Livrée' :
                     o.status === 'cancelled' ? 'Annulée' :
                     o.status}
                  </span> • Paiement: {o.payment_method || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-bold text-lg">{Number(o.total_amount).toFixed(2)}€</p>
                  {o.status === 'pending' && o.payment_method === 'stripe' ? (
                    <Link href={`/payment?orderId=${o.id}`}>
                      <button className="mt-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">Payer</button>
                    </Link>
                  ) : (
                    <Link href={`/confirmation/${o.id}`}>
                      <button className="mt-2 bg-gray-100 text-gray-800 px-3 py-2 rounded hover:bg-gray-200">Voir</button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
