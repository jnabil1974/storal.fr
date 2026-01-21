import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, getSupabaseClient } from '@/lib/supabase';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

type CheckoutItem = {
  product_id?: string;
  product_name?: string;
  price_per_unit?: number;
  pricePerUnit?: number;
  quantity: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items = [],
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryPostalCode,
      deliveryCountry = 'France',
      billingDifferent = false,
      billing,
      comment,
      paymentMethod = 'stripe',
      sessionId,
      createAccount = false,
      password,
      userId,
    } = body;

    if (!customerEmail || !customerName || !deliveryAddress || items.length === 0) {
      return NextResponse.json({ error: 'Données obligatoires manquantes' }, { status: 400 });
    }

    // Préparer l'adresse de facturation (par défaut même que livraison)
    const billingInfo = billingDifferent && billing ? billing : {
      name: customerName,
      address: deliveryAddress,
      city: deliveryCity,
      postalCode: deliveryPostalCode,
      country: deliveryCountry,
    };

    // Recalcul du total côté serveur (sécurité)
    const total_amount = items.reduce((sum: number, item: CheckoutItem) => {
      const unit = Number(item.price_per_unit ?? item.pricePerUnit ?? 0);
      const qty = Number(item.quantity || 0);
      return sum + unit * qty;
    }, 0);
    const total_items = items.reduce((sum: number, item: CheckoutItem) => sum + Number(item.quantity || 0), 0);

    const supabaseAdmin = getSupabaseAdminClient();
    const supabase = getSupabaseClient();
    if (!supabase || !supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase non initialisé' }, { status: 500 });
    }

    // Création de compte optionnelle
    let userIdToUse: string | null = userId || null;
    let accountCreated = false;
    if (createAccount && password) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: customerEmail,
        password,
        email_confirm: true,
      });
      if (error) {
        return NextResponse.json({ error: 'Création compte échouée' }, { status: 500 });
      }
      userIdToUse = data.user?.id || userIdToUse;
      accountCreated = true;
    }

    // Créer commande en attente
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          session_id: sessionId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone || null,
          delivery_address: deliveryAddress,
          delivery_city: deliveryCity,
          delivery_postal_code: deliveryPostalCode,
          delivery_country: deliveryCountry,
          items,
          total_items,
          total_amount,
          status: 'pending',
          payment_method: paymentMethod,
          user_id: userIdToUse,
          notes: JSON.stringify({
            billing: billingInfo,
            comment: (comment && String(comment).trim()) || undefined,
          }),
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 });
    }

    // Stripe Payment Intent si paiement carte
    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total_amount * 100),
        currency: 'eur',
        metadata: {
          orderId: order.id,
          userId: userIdToUse || '',
          customerEmail,
        },
      });

      return NextResponse.json(
        {
          orderId: order.id,
          clientSecret: paymentIntent.client_secret,
          accountCreated,
        },
        { status: 200 }
      );
    }

    // Paiement manuel (chèque / virement)
    return NextResponse.json({ orderId: order.id, accountCreated }, { status: 200 });
  } catch (err) {
    console.error('❌ Erreur checkout:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}