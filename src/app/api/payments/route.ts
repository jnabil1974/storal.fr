import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Données insuffisantes' },
        { status: 400 }
      );
    }

    // Créer intent de paiement Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir en centimes
      currency: 'eur',
      metadata: {
        orderId,
      },
    });

    console.log('✅ Payment Intent créé:', paymentIntent.id);

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('❌ Erreur Stripe:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non initialisé' },
        { status: 500 }
      );
    }
    const { orderId, paymentIntentId, status } = await request.json();

    // Mettre à jour le statut de la commande
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: status,
        stripe_payment_id: paymentIntentId,
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    console.log('✅ Commande mise à jour:', data.id);

    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ Erreur serveur:', err);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
