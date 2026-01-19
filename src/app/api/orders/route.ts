import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { CreateOrderPayload } from '@/types/order';
import { sendOrderConfirmationEmail } from '@/lib/email';

// Fonction de vérification reCAPTCHA
async function verifyRecaptcha(token: string): Promise<boolean> {
  // En développement local, ignorer reCAPTCHA
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.startsWith('6')) {
    console.log('🧪 Mode DEV: reCAPTCHA ignoré');
    return true;
  }

  // Avec les clés de test de Google, toujours accepter
  if (process.env.RECAPTCHA_SECRET_KEY === '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe') {
    console.log('🧪 Clés de test reCAPTCHA: accepté');
    return true;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    
    // Accepter si le score est > 0.5 (bot score < 0.5, human > 0.5)
    if (data.success && data.score > 0.5) {
      console.log('✅ reCAPTCHA validé - Score:', data.score);
      return true;
    }

    console.warn('⚠️ reCAPTCHA échoué - Score:', data.score);
    return false;
  } catch (err) {
    console.error('❌ Erreur vérification reCAPTCHA:', err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload: CreateOrderPayload & { recaptchaToken?: string } = await request.json();

    // Valider reCAPTCHA
    if (!payload.recaptchaToken) {
      return NextResponse.json(
        { error: 'Vérification reCAPTCHA manquante' },
        { status: 400 }
      );
    }

    const isValidRecaptcha = await verifyRecaptcha(payload.recaptchaToken);
    if (!isValidRecaptcha) {
      return NextResponse.json(
        { error: 'Vérification de sécurité échouée. Veuillez réessayer.' },
        { status: 403 }
      );
    }

    // Validation
    if (!payload.customerEmail || !payload.customerName || !payload.deliveryAddress) {
      return NextResponse.json(
        { error: 'Données obligatoires manquantes' },
        { status: 400 }
      );
    }

    // Créer la commande
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non initialisé' },
        { status: 500 }
      );
    }
    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: payload.userId || null,
          session_id: payload.sessionId,
          customer_name: payload.customerName,
          customer_email: payload.customerEmail,
          customer_phone: payload.customerPhone || null,
          delivery_address: payload.deliveryAddress,
          delivery_city: payload.deliveryCity,
          delivery_postal_code: payload.deliveryPostalCode,
          delivery_country: payload.deliveryCountry || 'France',
          items: payload.items, // Stocké comme JSONB
          total_items: payload.totalItems,
          total_amount: payload.totalAmount,
          status: 'pending', // En attente de paiement
          payment_method: payload.paymentMethod,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur création commande:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande' },
        { status: 500 }
      );
    }

    console.log('✅ Commande créée:', order.id);

    // Envoi email (bloquant pour diagnostic)
    const emailOk = await sendOrderConfirmationEmail({ order, payload });

    return NextResponse.json({ ...order, emailSent: emailOk }, { status: 201 });
  } catch (err) {
    console.error('❌ Erreur serveur:', err);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non initialisé' },
        { status: 500 }
      );
    }
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    let query = supabase.from('orders').select('*');

    if (orderId) {
      query = query.eq('id', orderId);
    } else if (token) {
      // Guest lookup: email + token required together
      if (!email) {
        return NextResponse.json(
          { error: 'Email requis avec le token' },
          { status: 400 }
        );
      }
      query = query.ilike('customer_email', email).eq('verification_token', token);
    } else if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else if (email) {
      query = query.ilike('customer_email', email);
    } else {
      return NextResponse.json(
        { error: 'Paramètres insuffisants' },
        { status: 400 }
      );
    }

    // Sort newest first
    // @ts-ignore - Supabase types may not include order on the builder chain
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ Erreur serveur:', err);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
