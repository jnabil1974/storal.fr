import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

async function verifyRecaptcha(token?: string): Promise<boolean> {
  // En développement avec clés de test, on accepte pour faciliter les tests
  if (
    (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') &&
    process.env.RECAPTCHA_SECRET_KEY === '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
  ) {
    return true;
  }

  if (!token) return false;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    const json = await res.json();
    if (!json?.success) return false;
    if (typeof json.score === 'number' && json.score < 0.5) return false;
    return true;
  } catch (error) {
    console.error('Newsletter reCAPTCHA error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, recaptchaToken } = await request.json();

    // Vérification reCAPTCHA si configuré
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const recaptchaEnabled = Boolean(siteKey && process.env.RECAPTCHA_SECRET_KEY);
    if (recaptchaEnabled) {
      const ok = await verifyRecaptcha(recaptchaToken);
      if (!ok) {
        return NextResponse.json(
          { error: 'Vérification reCAPTCHA échouée' },
          { status: 400 }
        );
      }
    }

    // Validation email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service indisponible' },
        { status: 503 }
      );
    }

    // Insert email into newsletter table
    const { data, error } = await supabase
      .from('newsletter')
      .insert([{ email: email.toLowerCase(), status: 'active' }])
      .select();

    if (error) {
      // Si c'est une erreur de doublon
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Cet email est déjà inscrit à notre newsletter' },
          { status: 200 }
        );
      }
      
      console.error('Newsletter error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Merci pour votre inscription !',
        data: data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Endpoint pour vérifier si un email est inscrit (optionnel)
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service indisponible' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from('newsletter')
      .select('email, status, subscribed_at')
      .eq('email', email.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return NextResponse.json(
          { subscribed: false },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: 'Erreur serveur' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        subscribed: data.status === 'active',
        subscribedAt: data.subscribed_at
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter GET error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
