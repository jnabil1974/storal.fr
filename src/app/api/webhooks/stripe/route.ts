import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      );
    }

    // Vérifier la signature du webhook
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error('❌ Erreur signature webhook:', err.message);
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 400 }
      );
    }

    // Traiter l'événement payment_intent.succeeded
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (!orderId) {
        console.warn('⚠️  OrderId manquant dans les métadonnées');
        return NextResponse.json({ received: true });
      }

      const supabase = getSupabaseAdminClient();
      if (!supabase) {
        console.error('❌ Supabase admin non initialisé');
        return NextResponse.json(
          { error: 'Erreur serveur' },
          { status: 500 }
        );
      }

      // Mettre à jour la commande à "paid"
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          stripe_payment_id: paymentIntent.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur mise à jour commande:', error);
        return NextResponse.json(
          { error: 'Erreur mise à jour' },
          { status: 500 }
        );
      }

      console.log('✅ Webhook Stripe: Commande marquée comme payée', orderId);
      return NextResponse.json({ received: true });
    }

    // Traiter les autres événements
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        const supabase = getSupabaseAdminClient();
        if (supabase) {
          await supabase
            .from('orders')
            .update({
              status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

          console.log('✅ Webhook Stripe: Commande marquée comme échouée', orderId);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('❌ Erreur webhook Stripe:', err);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
