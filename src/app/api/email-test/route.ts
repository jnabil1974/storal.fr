import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get('to') || 'njlaiel@gmail.com';
    const recaptchaToken = searchParams.get('token');

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY manquant' }, { status: 500 });
    }

    // Vérification reCAPTCHA
    if (!RECAPTCHA_SECRET || !recaptchaToken) {
      return NextResponse.json({ error: 'Token reCAPTCHA requis' }, { status: 400 });
    }

    try {
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: recaptchaToken }),
      });
      const verifyJson = await verifyRes.json();
      if (!verifyJson?.success || Number(verifyJson?.score ?? 0) < 0.5) {
        return NextResponse.json({ error: 'Vérification reCAPTCHA échouée' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Erreur vérification reCAPTCHA' }, { status: 500 });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;color:#111;">
        <h3>Test Email</h3>
        <p>Ceci est un test d'envoi via Resend.</p>
      </div>
    `;

    const body = {
      from: EMAIL_FROM,
      to,
      subject: 'Test Resend',
      html,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || 'Erreur envoi email', details: data }, { status: res.status });
    }

    return NextResponse.json({ ok: true, id: data.id, to });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
