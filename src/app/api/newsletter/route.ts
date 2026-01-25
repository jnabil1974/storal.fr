import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseAdminClient } from '@/lib/supabase';

async function verifyRecaptcha(token?: string): Promise<boolean> {
  // En développement avec clés de test, on accepte pour faciliter les tests
  if (
    (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') &&
    process.env.RECAPTCHA_SECRET_KEY === '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
  ) {
    return true;
  }

  // Clés de test Google acceptées quel que soit l'environnement (utile si prod encore en clé de test)
  if (
    process.env.RECAPTCHA_SECRET_KEY === '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe' ||
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
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

    // Utilise le client admin pour éviter les blocages RLS
    const supabase = getSupabaseAdminClient() || getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service indisponible' },
        { status: 503 }
      );
    }

    // Generate tokens
    const verificationToken = (globalThis.crypto?.randomUUID && globalThis.crypto.randomUUID()) || Math.random().toString(36).slice(2);
    const unsubscribeToken = (globalThis.crypto?.randomUUID && globalThis.crypto.randomUUID()) || Math.random().toString(36).slice(2);

    // Insert as pending until verified
    const { data, error } = await supabase
      .from('newsletter')
      .insert([{ 
        email: email.toLowerCase(), 
        status: 'pending',
        verification_token: verificationToken,
        unsubscribe_token: unsubscribeToken,
      }])
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

    // Send confirmation email via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@storal.fr';
    const origin = request.headers.get('origin') || process.env.APP_URL || 'https://storal.fr';
    const confirmUrl = `${origin}/api/newsletter/confirm?token=${verificationToken}`;
    const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

    if (RESEND_API_KEY) {
      const body = {
        from: EMAIL_FROM,
        to: email.toLowerCase(),
        subject: 'Confirmez votre inscription à la newsletter Storal',
        html: `
          <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
            <h2>Bienvenue chez Storal</h2>
            <p>Merci pour votre inscription à notre newsletter.</p>
            <p>Pour confirmer votre abonnement, cliquez ici :</p>
            <p><a href="${confirmUrl}" style="color:#2563eb;">Confirmer mon inscription</a></p>
            <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;"/>
            <p style="font-size:12px;color:#666;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message ou vous désinscrire :</p>
            <p style="font-size:12px;"><a href="${unsubscribeUrl}" style="color:#6b7280;">Se désinscrire</a></p>
          </div>
        `,
      };
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          console.warn('Resend email error:', res.status, await res.text());
        }
      } catch (err) {
        console.warn('Resend email exception:', err);
      }
    }

    return NextResponse.json(
      { 
        message: 'Merci ! Veuillez confirmer via l\'email envoyé.',
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
