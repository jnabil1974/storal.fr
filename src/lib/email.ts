import { CreateOrderPayload } from '@/types/order';

interface SendOrderEmailInput {
  order: any;
  payload: CreateOrderPayload;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'commande@example.com';
const EMAIL_BCC = process.env.EMAIL_BCC;

function buildItemsTable(items: any[]): string {
  if (!items?.length) return '<p>Aucun article</p>';
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.product_name || item.productName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${Number(item.price_per_unit || item.totalPrice || 0).toFixed(2)} €</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${Number(item.total_price || item.totalPrice || 0).toFixed(2)} €</td>
        </tr>
      `
    )
    .join('');

  return `
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;margin-top:8px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;">Article</th>
          <th style="padding:8px 12px;text-align:center;border-bottom:1px solid #eee;">Qté</th>
          <th style="padding:8px 12px;text-align:right;border-bottom:1px solid #eee;">PU</th>
          <th style="padding:8px 12px;text-align:right;border-bottom:1px solid #eee;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildEmailHtml(input: SendOrderEmailInput): string {
  const { order, payload } = input;
  const total = Number(order.total_amount ?? payload.totalAmount ?? 0).toFixed(2);
  const created = order.created_at
    ? new Date(order.created_at).toLocaleString('fr-FR')
    : new Date().toLocaleString('fr-FR');
  
  // Lien de vérification pour les guests (avec token)
  const appUrl = process.env.APP_URL || 'https://storal.fr';
  const verificationUrl = order.verification_token 
    ? `${appUrl}/my-orders?email=${encodeURIComponent(order.customer_email || payload.customerEmail)}&token=${order.verification_token}`
    : null;

  return `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
      <h2 style="color:#111;margin:0 0 8px;">Merci pour votre commande</h2>
      <p style="margin:4px 0;">Référence: <strong>${order.id}</strong></p>
      <p style="margin:4px 0;">Date: ${created}</p>
      <p style="margin:12px 0 8px;">Récapitulatif:</p>
      ${buildItemsTable(order.items || payload.items)}
      <p style="margin:12px 0 0;font-size:16px;"><strong>Total: ${total} €</strong></p>

      <div style="margin-top:16px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
        <p style="margin:4px 0;"><strong>Client:</strong> ${order.customer_name || payload.customerName}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${order.customer_email || payload.customerEmail}</p>
        ${order.customer_phone || payload.customerPhone ? `<p style="margin:4px 0;"><strong>Téléphone:</strong> ${order.customer_phone || payload.customerPhone}</p>` : ''}
        <p style="margin:4px 0;"><strong>Adresse:</strong> ${order.delivery_address || payload.deliveryAddress}</p>
        <p style="margin:4px 0;">${order.delivery_postal_code || payload.deliveryPostalCode} ${order.delivery_city || payload.deliveryCity}, ${order.delivery_country || payload.deliveryCountry}</p>
        <p style="margin:4px 0;"><strong>Paiement:</strong> ${order.payment_method || payload.paymentMethod || 'non renseigné'}</p>
      </div>

      ${verificationUrl ? `
        <div style="margin-top:16px;padding:12px;border-left:4px solid #3b82f6;background:#eff6ff;">
          <p style="margin:0 0 8px;"><strong>Consulter votre commande:</strong></p>
          <p style="margin:0;"><a href="${verificationUrl}" style="color:#3b82f6;text-decoration:underline;">Cliquez ici pour voir les détails</a></p>
          <p style="margin:8px 0 0;font-size:12px;color:#666;">Ce lien est personnel et sécurisé.</p>
        </div>
      ` : ''}

      <p style="margin-top:16px;color:#555;">Notre équipe vous contactera pour la suite (planification, livraison, installation).</p>
    </div>
  `;
}

export async function sendOrderConfirmationEmail(input: SendOrderEmailInput): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY manquant - email non envoyé');
    return false;
  }

  const html = buildEmailHtml(input);
  const to = input.order.customer_email || input.payload.customerEmail;

  console.log(`📧 Tentative d'envoi email à: ${to} via Resend`);

  const body = {
    from: EMAIL_FROM,
    to,
    bcc: EMAIL_BCC ? [EMAIL_BCC] : undefined,
    subject: `Confirmation commande ${input.order.id}`,
    html,
  };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error('❌ Envoi email échoué:', res.status, text);
      return false;
    }

    console.log('📧 Email de confirmation envoyé', { to, status: res.status, body: text });
    return true;
  } catch (err) {
    console.error('❌ Erreur envoi email:', err);
    return false;
  }
}
