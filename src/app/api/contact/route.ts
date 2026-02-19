import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const EMAIL_BCC = process.env.EMAIL_BCC;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, title, message, recaptchaToken } = body;

    // Rate limiting par IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(`contact_${ip}`, 3, 600000); // 3 requêtes / 10 minutes
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Trop de tentatives, réessayez plus tard' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetTime),
          }
        }
      );
    }

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    // Vérification reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret || !recaptchaToken) {
      console.log('❌ reCAPTCHA config manquante:', { hasSecret: !!recaptchaSecret, hasToken: !!recaptchaToken });
      return NextResponse.json({ error: 'Token reCAPTCHA requis' }, { status: 400 });
    }

    try {
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: recaptchaSecret, response: recaptchaToken }),
      });
      const verifyJson = await verifyRes.json();
      console.log('🔐 reCAPTCHA verification:', { success: verifyJson.success, score: verifyJson.score, action: verifyJson.action });
      
      if (!verifyJson?.success || Number(verifyJson?.score ?? 0) < 0.5) {
        console.log('❌ reCAPTCHA échoué:', verifyJson);
        return NextResponse.json({ error: 'Vérification reCAPTCHA échouée', score: verifyJson.score }, { status: 403 });
      }
      console.log('✅ reCAPTCHA validé avec score:', verifyJson.score);
    } catch (err) {
      console.error('❌ Erreur reCAPTCHA:', err);
      return NextResponse.json({ error: 'Erreur vérification reCAPTCHA' }, { status: 500 });
    }

    console.log('📧 Vérification RESEND_API_KEY:', { hasKey: !!RESEND_API_KEY, from: EMAIL_FROM, bcc: EMAIL_BCC });
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY manquant');
      return NextResponse.json({ error: 'Service email non configuré' }, { status: 500 });
    }

    // Envoi email
    console.log('📧 Préparation envoi email:', { name, email, subject, title });
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#0066cc;">Nouveau message de contact</h2>
        <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0;">
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
          ${subject ? `<p><strong>Sujet:</strong> ${subject}</p>` : ''}
          ${title ? `<p><strong>Titre:</strong> ${title}</p>` : ''}
        </div>
        <div style="background:#fff;padding:15px;border-left:4px solid #0066cc;margin:20px 0;">
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;">${message}</p>
        </div>
        <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;">
        <p style="color:#666;font-size:12px;">Message reçu depuis storal.fr</p>
      </div>
    `;

    const emailBody = {
      from: EMAIL_FROM,
      to: EMAIL_FROM,
      bcc: EMAIL_BCC,
      reply_to: email,
      subject: `Contact: ${title || subject || 'Demande de renseignements'} - ${name}`,
      html,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    });

    console.log('📧 Réponse Resend API:', { status: res.status, ok: res.ok });
    const data = await res.json();
    console.log('📧 Data Resend:', data);
    
    if (!res.ok) {
      console.error('❌ Erreur envoi email:', { status: res.status, data });
      return NextResponse.json(
        { error: 'Erreur envoi email', details: data },
        { status: res.status }
      );
    }

    console.log('✅ Email envoyé avec succès:', data.id);
    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
