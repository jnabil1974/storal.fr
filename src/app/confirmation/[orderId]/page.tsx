'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/types/order';
import Link from 'next/link';

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?orderId=${orderId}`);
        if (!res.ok) throw new Error('Commande non trouvée');
        
        const data = await res.json();
        const row = data[0] || data;
        const mapped: Order = {
          id: row.id,
          sessionId: row.session_id,
          customerName: row.customer_name,
          customerEmail: row.customer_email,
          customerPhone: row.customer_phone ?? undefined,
          deliveryAddress: row.delivery_address,
          deliveryCity: row.delivery_city,
          deliveryPostalCode: row.delivery_postal_code,
          deliveryCountry: row.delivery_country,
          items: row.items || [],
          totalItems: row.total_items,
          totalAmount: row.total_amount,
          status: row.status,
          stripePaymentId: row.stripe_payment_id ?? undefined,
          paymentMethod: row.payment_method ?? undefined,
          notes: row.notes ?? undefined,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        };
        setOrder(mapped);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Chargement...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600 text-lg">Commande non trouvée</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success banner */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-4xl font-bold text-green-600 mb-2">
            Commande confirmée!
          </h1>
          <p className="text-gray-600 text-lg">
            Merci pour votre achat
          </p>
        </div>

        {/* Order details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Détails de la commande
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Numéro</p>
              <p className="text-gray-900 font-mono break-all">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Date</p>
              <p className="text-gray-900">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Statut</p>
              <p className={`font-semibold ${order.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                {order.status === 'paid' ? 'Payée' : 'En attente de paiement'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {Number(order.totalAmount).toFixed(2)}€
              </p>
            </div>
          </div>

          {/* Customer info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Informations client
            </h3>
            <p className="text-gray-700 mb-1">
              <strong>Nom:</strong> {order.customerName}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Email:</strong> {order.customerEmail}
            </p>
            {order.customerPhone && (
              <p className="text-gray-700 mb-1">
                <strong>Téléphone:</strong> {order.customerPhone}
              </p>
            )}
          </div>

          {/* Delivery info */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Adresse de livraison
            </h3>
            <p className="text-gray-700 mb-1">{order.deliveryAddress}</p>
            <p className="text-gray-700 mb-1">
              {order.deliveryPostalCode} {order.deliveryCity}
            </p>
            <p className="text-gray-700">{order.deliveryCountry}</p>
          </div>

          {/* Order items */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Articles commandés
            </h3>
            <div className="space-y-2">
              {order.items && order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-gray-700 p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      Quantité: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {Number(item.totalPrice).toFixed(2)}€
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment instructions */}
          {order.paymentMethod !== 'stripe' && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Instructions de paiement
              </h3>
              
              {order.paymentMethod === 'cheque' && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-gray-900 mb-2">Paiement par chèque</p>
                  <p className="text-gray-700 mb-3">
                    Veuillez envoyer votre chèque à l'ordre de:
                  </p>
                  <div className="bg-white p-3 rounded border border-yellow-300 mb-3">
                    <p className="font-mono text-sm">
                      <strong>Menuiserie Pro</strong><br />
                      123 Rue de l'Artisanat<br />
                      75000 Paris, France
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Montant: <strong>{Number(order.totalAmount).toFixed(2)}€</strong><br />
                    Référence commande: <strong className="font-mono">{order.id.slice(0, 8)}</strong>
                  </p>
                </div>
              )}

              {order.paymentMethod === 'virement' && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-semibold text-gray-900 mb-2">Paiement par virement bancaire</p>
                  <p className="text-gray-700 mb-3">
                    Veuillez effectuer le virement sur le compte suivant:
                  </p>
                  <div className="bg-white p-3 rounded border border-green-300 mb-3 font-mono text-sm">
                    <p><strong>Titulaire:</strong> Menuiserie Pro SARL</p>
                    <p><strong>IBAN:</strong> FR76 1234 5678 9012 3456 7890 123</p>
                    <p><strong>BIC:</strong> BNPAFRPPXXX</p>
                    <p><strong>Banque:</strong> BNP Paribas</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Montant: <strong>{Number(order.totalAmount).toFixed(2)}€</strong><br />
                    <strong>Référence à indiquer:</strong> <span className="font-mono bg-yellow-100 px-2 py-1">{order.id.slice(0, 8)}</span>
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    ⚠️ N'oubliez pas d'indiquer la référence dans le libellé du virement
                  </p>
                </div>
              )}
            </div>
          )}

          {/* What's next */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">Les prochaines étapes</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
              <li>Confirmation par email dans quelques minutes</li>
              {order.paymentMethod !== 'stripe' && (
                <li>Réception et validation de votre paiement (sous 2-3 jours ouvrés)</li>
              )}
              <li>Préparation de votre commande</li>
              <li>Livraison programmée (vous recevrez un SMS)</li>
              <li>Installation par nos experts</li>
            </ol>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex gap-4">
          <Link href="/" className="flex-1">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Retour à l'accueil
            </button>
          </Link>
          <a 
            href={`mailto:${order.customerEmail}`}
            className="flex-1"
          >
            <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition">
              Contacter le support
            </button>
          </a>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Une confirmation a été envoyée à <strong>{order.customerEmail}</strong>
        </p>
      </div>
    </div>
  );
}
