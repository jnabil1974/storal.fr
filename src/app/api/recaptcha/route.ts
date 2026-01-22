import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { recaptchaToken } = await request.json();
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return NextResponse.json({ error: 'Clé reCAPTCHA manquante' }, { status: 500 });
  }

  if (!recaptchaToken) {
    return NextResponse.json({ error: 'Token reCAPTCHA manquant' }, { status: 400 });
  }

  try {
    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: recaptchaToken }),
    });
    const verifyJson = await verifyRes.json();
    const ok = verifyJson?.success === true;
    const score = Number(verifyJson?.score ?? 0);
    if (!ok || score < 0.5) {
      return NextResponse.json({ error: 'Échec vérification reCAPTCHA', score }, { status: 400 });
    }
    return NextResponse.json({ ok: true, score });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur vérification reCAPTCHA' }, { status: 500 });
  }
}
