'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Order } from '@/types/order';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function PaymentForm({ orderId, total }: { orderId: string; total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    if (!stripe || !elements) {
      setError('Stripe non initialisé');
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Créer le payment intent
      const paymentRes = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: total,
        }),
      });

      if (!paymentRes.ok) {
        throw new Error('Erreur lors de la création du paiement');
      }

      const { clientSecret, paymentIntentId } = await paymentRes.json();

      // 2. Confirmer le paiement avec la carte
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Élément carte non trouvé');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        // 3. Mettre à jour la commande
        await fetch('/api/payments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            paymentIntentId,
            status: 'paid',
          }),
        });

        setSuccess(true);
        // Vider le panier côté client
        try { await clearCart(); } catch {}
        setTimeout(() => {
          router.push(`/confirmation/${orderId}`);
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg">
          Paiement réussi! Redirection en cours...
        </div>
      )}

      <div className="bg-white p-4 rounded-lg border border-gray-300">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424242',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Traitement...' : `Payer ${total.toFixed(2)}€`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/cart');
      return;
    }

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
        router.push('/cart');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Paiement</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé commande</h2>
          <p className="text-gray-600 mb-2">
            <strong>Commande:</strong> {orderId}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Nom:</strong> {order.customerName}
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Email:</strong> {order.customerEmail}
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-6">
            Total: {Number(order.totalAmount).toFixed(2)}€
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de paiement</h2>
          <p className="text-sm text-gray-600 mb-4">
            Carte de test: 4242 4242 4242 4242 | 12/26 | 123
          </p>

          <Elements stripe={stripePromise}>
            <PaymentForm orderId={orderId!} total={Number(order.totalAmount)} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
