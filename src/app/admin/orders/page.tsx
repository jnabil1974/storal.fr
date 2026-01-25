'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
  const router = useRouter();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderItem | null>(null);

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
        if (!res.ok) {
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
    if (isAdmin) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, paymentFilter, isAdmin]);

  // Afficher un loader pendant la vérification d'authentification
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Vérification des autorisations...</div>
      </div>
    );
  }

  // Ne rien afficher si pas admin (la redirection est en cours)
  if (!isAdmin) {
    return null;
  }

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
              <option value="pending">En attente</option>
              <option value="processing">En préparation</option>
              <option value="paid">Payée</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
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
                    <option value="pending">En attente</option>
                    <option value="processing">En préparation</option>
                    <option value="paid">Payée</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
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
                      <p className="font-medium">
                        {selectedOrder.status === 'paid' ? 'Payée' :
                         selectedOrder.status === 'pending' ? 'En attente' :
                         selectedOrder.status === 'processing' ? 'En préparation' :
                         selectedOrder.status === 'shipped' ? 'Expédiée' :
                         selectedOrder.status === 'delivered' ? 'Livrée' :
                         selectedOrder.status === 'cancelled' ? 'Annulée' :
                         selectedOrder.status}
                      </p>
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
                      <div className="space-y-3">
                        {selectedOrder.items.map((item: any, idx: number) => {
                          const config = typeof item.configuration === 'string' 
                            ? (() => { try { return JSON.parse(item.configuration); } catch { return item.configuration; } })()
                            : item.configuration;
                          
                          // Nom du produit: préférer product_name, sinon fallback sur productName ou ID
                          const productName = item.product_name || item.productName || `Produit ${item.product_id || ''}`.trim() || 'Produit sans nom';
                          
                          return (
                            <div key={idx} className="border rounded p-4 bg-gray-50">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-bold text-lg">{productName}</p>
                                  <p className="text-sm text-gray-600">ID: {item.product_id || '—'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Qté: {item.quantity}</p>
                                  <p className="font-semibold">{Number(item.price_per_unit || 0).toFixed(2)}€ u.</p>
                                </div>
                              </div>

                              {config && typeof config === 'object' && (
                                <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
                                  <p className="text-sm font-semibold text-gray-700">Options:</p>
                                  <div className="text-sm space-y-1 pl-2">
                                    {config.largeur && <p>📏 <span className="text-gray-600">Largeur:</span> <span className="font-medium">{config.largeur} mm</span></p>}
                                    {config.hauteur && <p>📐 <span className="text-gray-600">Hauteur:</span> <span className="font-medium">{config.hauteur} mm</span></p>}
                                    {config.profondeur && <p>📐 <span className="text-gray-600">Profondeur:</span> <span className="font-medium">{config.profondeur} mm</span></p>}
                                    {config.avancee && <p>➡️ <span className="text-gray-600">Avancée:</span> <span className="font-medium">{config.avancee} mm</span></p>}
                                    {config.couleur && <p>🎨 <span className="text-gray-600">Couleur:</span> <span className="font-medium">{config.couleur}</span></p>}
                                    {config.tissu && <p>🧵 <span className="text-gray-600">Tissu:</span> <span className="font-medium">{config.tissu}</span></p>}
                                    {config.toile && <p>🧵 <span className="text-gray-600">Toile:</span> <span className="font-medium">{config.toile}</span></p>}
                                    {config.motorisation && <p>⚡ <span className="text-gray-600">Motorisation:</span> <span className="font-medium">{config.motorisation}</span></p>}
                                    {config.led && <p>💡 <span className="text-gray-600">LED:</span> <span className="font-medium">{config.led}</span></p>}
                                    {config.type && <p>🏷️ <span className="text-gray-600">Type:</span> <span className="font-medium">{config.type}</span></p>}
                                    {config.grille && <p>🔲 <span className="text-gray-600">Grille:</span> <span className="font-medium">{config.grille}</span></p>}
                                    {config.vitrage && <p>🪟 <span className="text-gray-600">Vitrage:</span> <span className="font-medium">{config.vitrage}</span></p>}
                                    {config.width && <p>📏 <span className="text-gray-600">Largeur:</span> <span className="font-medium">{config.width} cm</span></p>}
                                    {config.height && <p>📐 <span className="text-gray-600">Hauteur:</span> <span className="font-medium">{config.height} cm</span></p>}
                                    {config.doorType && <p>🚪 <span className="text-gray-600">Type porte:</span> <span className="font-medium">{config.doorType}</span></p>}
                                    {config.lockType && <p>🔒 <span className="text-gray-600">Serrure:</span> <span className="font-medium">{config.lockType}</span></p>}
                                    {config.material && <p>🔧 <span className="text-gray-600">Matériau:</span> <span className="font-medium">{config.material}</span></p>}
                                    {config.glassType && <p>🪟 <span className="text-gray-600">Vitrage:</span> <span className="font-medium">{config.glassType}</span></p>}
                                    {config.thickness && <p>📏 <span className="text-gray-600">Épaisseur:</span> <span className="font-medium">{config.thickness} mm</span></p>}
                                    {config.securityLevel && <p>🔐 <span className="text-gray-600">Sécurité:</span> <span className="font-medium">{config.securityLevel}</span></p>}
                                    {config.soundProofing !== undefined && <p>🔇 <span className="text-gray-600">Isolation phonique:</span> <span className="font-medium">{config.soundProofing ? 'Oui' : 'Non'}</span></p>}
                                    {config.thermalProofing !== undefined && <p>🌡️ <span className="text-gray-600">Isolation thermique:</span> <span className="font-medium">{config.thermalProofing ? 'Oui' : 'Non'}</span></p>}
                                    {config.glassPercentage !== undefined && <p>💯 <span className="text-gray-600">% vitrage:</span> <span className="font-medium">{config.glassPercentage}%</span></p>}
                                    {config.color && <p>🎨 <span className="text-gray-600">Couleur:</span> <span className="font-medium" style={{backgroundColor: config.color, padding: '2px 8px', borderRadius: '4px', border: '1px solid #ccc'}}>{config.color}</span></p>}
                                    {/* Afficher les options restantes */}
                                    {Object.keys(config).filter(k => !['largeur', 'hauteur', 'profondeur', 'avancee', 'couleur', 'tissu', 'toile', 'motorisation', 'led', 'type', 'grille', 'vitrage', 'width', 'height', 'doorType', 'lockType', 'material', 'glassType', 'thickness', 'securityLevel', 'soundProofing', 'thermalProofing', 'glassPercentage', 'color'].includes(k)).map(key => (
                                      <p key={key}>
                                        📌 <span className="text-gray-600">{key}:</span> <span className="font-medium">{String(config[key])}</span>
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Parsed notes: billing + comment */}
                  {selectedOrder.notes && (() => {
                    try {
                      const parsed = JSON.parse(selectedOrder.notes || '{}');
                      const billing = parsed?.billing;
                      const comment = parsed?.comment?.trim?.();
                      return (
                        <div className="space-y-4">
                          {billing && (
                            <div>
                              <h4 className="font-semibold">Adresse de facturation</h4>
                              <div className="text-sm text-gray-700">
                                {billing.name && <p><span className="text-gray-600">Nom:</span> {billing.name}</p>}
                                {billing.address && <p><span className="text-gray-600">Adresse:</span> {billing.address}</p>}
                                {(billing.postalCode || billing.city) && (
                                  <p>
                                    <span className="text-gray-600">Ville:</span> {(billing.postalCode || '') + (billing.city ? ' ' + billing.city : '')}
                                  </p>
                                )}
                                {billing.country && <p><span className="text-gray-600">Pays:</span> {billing.country}</p>}
                              </div>
                            </div>
                          )}
                          {comment && (
                            <div>
                              <h4 className="font-semibold">Informations complémentaires</h4>
                              <p className="font-medium whitespace-pre-line">{comment}</p>
                            </div>
                          )}
                        </div>
                      );
                    } catch {
                      return null;
                    }
                  })()}

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
