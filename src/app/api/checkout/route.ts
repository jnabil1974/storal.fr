import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, getSupabaseClient } from '@/lib/supabase';
import { sendOrderConfirmationEmail } from '@/lib/email';

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || '';
// Debug minimal: log whether test or live key is loaded (no full key)
console.log(`[Stripe] Loaded key type: ${STRIPE_SECRET.startsWith('sk_test') ? 'TEST' : STRIPE_SECRET.startsWith('sk_live') ? 'LIVE' : 'UNKNOWN'}`);
const stripe = require('stripe')(STRIPE_SECRET);

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
      recaptchaToken,
      paymentMethod = 'stripe',
      sessionId: providedSessionId,
      createAccount = false,
      password,
      userId,
      promoCode,
    } = body;

    // Générer un session_id si absent (requis par la table)
    const sessionId = providedSessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('[Checkout] Incoming request', {
      hasItems: Array.isArray(items) && items.length > 0,
      customerEmail: !!customerEmail,
      customerName: !!customerName,
      sessionId: sessionId,
      sessionIdProvided: !!providedSessionId,
      paymentMethod,
      hasRecaptchaToken: !!recaptchaToken,
      createAccount,
      hasPassword: !!password,
    });

    if (!customerEmail || !customerName || !deliveryAddress || items.length === 0) {
      console.error('[Checkout] Validation failed:', { 
        hasEmail: !!customerEmail, 
        hasName: !!customerName, 
        hasAddress: !!deliveryAddress, 
        itemsCount: items.length 
      });
      return NextResponse.json({ error: 'Données obligatoires manquantes' }, { status: 400 });
    }

    // Vérification reCAPTCHA v3 côté serveur (si configuré)
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret) {
      if (!recaptchaToken) {
        return NextResponse.json({ error: 'Vérification reCAPTCHA requise' }, { status: 400 });
      }
      try {
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ secret: recaptchaSecret, response: recaptchaToken }),
        });
        const verifyJson = await verifyRes.json();
        const ok = verifyJson?.success === true;
        const score = Number(verifyJson?.score ?? 0);
        console.log('[Checkout] reCAPTCHA verify', { ok, score });
        
        // En développement avec clés de test, accepter score 0
        const isTestKey = recaptchaSecret === '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
        const isDev = process.env.NODE_ENV === 'development';
        
        if (!ok || (score < 0.5 && !isTestKey && !isDev)) {
          console.warn('[Checkout] reCAPTCHA rejection', { ok, score, isTestKey, isDev });
          return NextResponse.json({ error: 'Échec vérification reCAPTCHA' }, { status: 400 });
        }
      } catch (e) {
        console.error('[Checkout] reCAPTCHA error', e);
        return NextResponse.json({ error: 'Erreur vérification reCAPTCHA' }, { status: 500 });
      }
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
    
    // Appliquer le code promo si valide
    let discount = 0;
    if (promoCode && promoCode.toUpperCase() === 'STORAL5') {
      discount = total_amount * 0.05;
    }
    const final_amount = total_amount - discount;
    
    const total_items = items.reduce((sum: number, item: CheckoutItem) => sum + Number(item.quantity || 0), 0);
    console.log('[Checkout] Totals', { total_amount, discount, final_amount, total_items, promoCode });

    const supabaseAdmin = getSupabaseAdminClient();
    const supabase = getSupabaseClient();
    if (!supabase || !supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase non initialisé' }, { status: 500 });
    }

    // Création de compte optionnelle
    let userIdToUse: string | null = userId || null;
    let accountCreated = false;
    if (createAccount && password) {
      console.log('[Checkout] Création de compte demandée pour:', customerEmail);
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: customerEmail,
        password,
        email_confirm: true,
      });
      if (error) {
        console.error('[Checkout] Erreur création compte:', error);
        return NextResponse.json({ 
          error: `Création compte échouée: ${error.message || 'Erreur inconnue'}` 
        }, { status: 500 });
      }
      userIdToUse = data.user?.id || userIdToUse;
      accountCreated = true;
      console.log('[Checkout] Compte créé avec succès:', userIdToUse);
    }

    // Créer commande en attente
    console.log('[Checkout] Création de la commande...');
    
    // Préparer les données à insérer
    const orderData = {
      session_id: sessionId || null,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      delivery_address: deliveryAddress,
      delivery_city: deliveryCity,
      delivery_postal_code: deliveryPostalCode,
      delivery_country: deliveryCountry,
      items,
      total_items,
      total_amount: final_amount,
      status: 'pending',
      payment_method: paymentMethod,
      user_id: userIdToUse,
      notes: JSON.stringify({
        billing: billingInfo,
        comment: (comment && String(comment).trim()) || undefined,
        promoCode: promoCode || undefined,
        discount: discount > 0 ? discount : undefined,
        originalAmount: discount > 0 ? total_amount : undefined,
      }),
    };
    
    console.log('[Checkout] Données à insérer:', {
      session_id: orderData.session_id,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      items_type: typeof orderData.items,
      items_isArray: Array.isArray(orderData.items),
      items_length: Array.isArray(orderData.items) ? orderData.items.length : 'N/A',
      items_sample: Array.isArray(orderData.items) ? orderData.items[0] : orderData.items,
      total_items: orderData.total_items,
      total_amount: orderData.total_amount,
      notes_length: orderData.notes?.length,
    });
    
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError || !order) {
      console.error('[Checkout] Supabase insert error', {
        error: orderError,
        message: orderError?.message,
        details: orderError?.details,
        hint: orderError?.hint,
        code: orderError?.code,
      });
      return NextResponse.json({ 
        error: `Erreur lors de la création de la commande: ${orderError?.message || 'Erreur inconnue'}`,
        details: orderError?.details,
        hint: orderError?.hint,
      }, { status: 500 });
    }

    console.log('[Checkout] Commande créée avec succès:', order.id);

    // Envoi de l'email de confirmation (non bloquant sur la réponse, mais logué)
    (async () => {
      try {
        const emailPayload = {
          userId: userIdToUse || undefined,
          sessionId: sessionId || order.session_id,
          customerName,
          customerEmail,
          customerPhone,
          deliveryAddress,
          deliveryCity,
          deliveryPostalCode,
          deliveryCountry,
          items,
          totalItems: total_items,
          totalAmount: total_amount,
          paymentMethod,
        };
        const ok = await sendOrderConfirmationEmail({ order, payload: emailPayload as any });
        console.log('[Checkout] Email confirmation sent?', ok);
      } catch (e) {
        console.error('[Checkout] Email send failed', e);
      }
    })();

    // Stripe Payment Intent si paiement carte
    if (paymentMethod === 'stripe') {
      try {
        console.log('[Checkout] Creating Stripe PaymentIntent', {
          amount: Math.round(total_amount * 100),
          currency: 'eur',
        });
        const key = process.env.STRIPE_SECRET_KEY || '';
        console.log('[Checkout] Stripe key type', key.startsWith('sk_test') ? 'TEST' : key.startsWith('sk_live') ? 'LIVE' : 'UNKNOWN');
      } catch {}
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(final_amount * 100),
        currency: 'eur',
        metadata: {
          orderId: order.id,
          userId: userIdToUse || '',
          customerEmail,
          promoCode: promoCode || '',
          discount: discount > 0 ? discount.toFixed(2) : '',
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