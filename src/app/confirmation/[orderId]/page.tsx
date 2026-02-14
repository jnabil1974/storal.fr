'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/types/order';
import Link from 'next/link';
import { downloadInvoice } from '../_invoice';
import jsPDF from 'jspdf';

// Interface pour les détails du panier avec options
interface CartDetails {
  modelId: string | null;
  modelName?: string;
  colorId: string | null;
  fabricId: string | null;
  width?: number | null;
  projection?: number | null;
  exposure?: string | null;
  withMotor?: boolean;
  priceEco?: number;
  priceStandard?: number;
  pricePremium?: number;
  selectedPrice?: number;
  priceType?: string;
  // Détails des options et prix
  storeHT?: number;
  ledArmsPrice?: number;
  ledBoxPrice?: number;
  lambrequinPrice?: number;
  awningPrice?: number;
  sousCoffrePrice?: number;
  poseHT?: number;
  tvaAmount?: number;
}

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartDetails, setCartDetails] = useState<CartDetails | null>(null);

  useEffect(() => {
    // Charger les détails du panier depuis localStorage
    try {
      const savedCart = localStorage.getItem('storal-cart');
      if (savedCart) {
        setCartDetails(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Erreur chargement détails panier:', error);
    }
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?orderId=${orderId}`);
        if (!res.ok) throw new Error('Commande non trouvée');
        
        const data = await res.json();
        const row = data[0] || data;
        const mapped: Order = {
          id: row.id,
          sessionId: row.session_id,
          customerName: row.customer_name,
          customerEmail: row.customer_email,
          customerPhone: row.customer_phone ?? undefined,
          deliveryAddress: row.delivery_address,
          deliveryCity: row.delivery_city,
          deliveryPostalCode: row.delivery_postal_code,
          deliveryCountry: row.delivery_country,
          items: row.items || [],
          totalItems: row.total_items,
          totalAmount: row.total_amount,
          status: row.status,
          stripePaymentId: row.stripe_payment_id ?? undefined,
          paymentMethod: row.payment_method ?? undefined,
          notes: row.notes ?? undefined,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        };
        setOrder(mapped);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const downloadPDF = () => {
    if (!order) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Company header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('STORAL', 20, yPos);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Store et Menuiserie', 20, yPos + 7);
    doc.text('58 rue de Monceau CS 48756', 20, yPos + 12);
    doc.text('75380 Paris Cedex 08', 20, yPos + 17);
    doc.text('Tel: +33 1 23 45 67 89', 20, yPos + 22);
    doc.text('Email: contact@storal.fr', 20, yPos + 27);

    // Confirmation badge
    yPos += 35;
    doc.setFillColor(0, 102, 204);
    doc.rect(pageWidth - 80, yPos - 5, 60, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('CONFIRMATION', pageWidth - 50, yPos, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Order details separator
    yPos += 15;
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);

    // Order info
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Commande:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(order.id.slice(0, 16), 60, yPos);
    
    yPos += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(order.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), 60, yPos);
    
    yPos += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Statut:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const statusText = order.status === 'paid' ? 'Payée' :
                      order.status === 'pending' ? 'En attente' :
                      order.status === 'processing' ? 'En préparation' :
                      order.status === 'shipped' ? 'Expédiée' :
                      order.status === 'delivered' ? 'Livrée' :
                      order.status === 'cancelled' ? 'Annulée' : order.status;
    doc.text(statusText, 60, yPos);
    
    // Customer info
    yPos += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS CLIENT', 20, yPos);
    
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom: ${order.customerName}`, 20, yPos);
    
    yPos += 7;
    doc.text(`Email: ${order.customerEmail}`, 20, yPos);
    
    if (order.customerPhone) {
      yPos += 7;
      doc.text(`Téléphone: ${order.customerPhone}`, 20, yPos);
    }
    
    // Delivery address
    yPos += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ADRESSE DE LIVRAISON', 20, yPos);
    
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(order.deliveryAddress, 20, yPos);
    
    yPos += 7;
    doc.text(`${order.deliveryPostalCode} ${order.deliveryCity}`, 20, yPos);
    
    yPos += 7;
    doc.text(order.deliveryCountry, 20, yPos);

    // Complementary info (comment)
    try {
      const parsed = order.notes ? JSON.parse(order.notes) : null;
      const comment = parsed?.comment?.trim?.();
      if (comment) {
        yPos += 12;
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMATIONS COMPLÉMENTAIRES', 20, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(comment, pageWidth - 40);
        lines.forEach((line: string) => {
          if (yPos > 280) { doc.addPage(); yPos = 20; }
          doc.text(line, 20, yPos);
          yPos += 5;
        });
      }
    } catch {}
    
    // Items
    yPos += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ARTICLES COMMANDÉS', 20, yPos);
    
    yPos += 7;
    doc.setFontSize(10);
    
    order.items?.forEach((item: any, idx: number) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}. ${item.productName || 'Produit'}`, 20, yPos);
      yPos += 6;
      
      // Product type if available
      if (item.productType) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`   Type: ${item.productType}`, 20, yPos);
        yPos += 5;
        doc.setFontSize(10);
      }
      
      // Configuration details
      if (item.configuration && Object.keys(item.configuration).length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('   Configuration:', 20, yPos);
        yPos += 5;
        
        doc.setFont('helvetica', 'normal');
        Object.entries(item.configuration).forEach(([key, value]) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .charAt(0)
            .toUpperCase() + key.slice(1);
          
          const valueStr = String(value).charAt(0).toUpperCase() + String(value).slice(1);
          doc.text(`      - ${label}: ${valueStr}`, 20, yPos);
          yPos += 5;
        });
        
        doc.setFontSize(10);
        yPos += 1;
      }
      
      doc.setFont('helvetica', 'normal');
      doc.text(`   Quantité: ${item.quantity}`, 20, yPos);
      yPos += 6;
      
      const unitPrice = (Number(item.totalPrice) / Number(item.quantity)).toFixed(2);
      doc.text(`   Prix unitaire: ${unitPrice}€`, 20, yPos);
      yPos += 6;
      
      doc.setFont('helvetica', 'bold');
      doc.text(`   Total article: ${Number(item.totalPrice).toFixed(2)}€`, 20, yPos);
      yPos += 10;
    });
    
    // Total
    yPos += 5;
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: ${Number(order.totalAmount).toFixed(2)}€`, pageWidth - 20, yPos, { align: 'right' });
    
    // Footer
    yPos += 15;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Merci pour votre confiance!', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 5;
    doc.text('Pour toute question, contactez-nous à commandes@storal.fr', pageWidth / 2, yPos, { align: 'center' });
    
    // Save PDF
    doc.save(`commande_${order.id.slice(0, 8)}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Chargement...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600 text-lg">Commande non trouvée</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success banner */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-4xl font-bold text-green-600 mb-2">
            Commande confirmée!
          </h1>
          <p className="text-gray-600 text-lg">
            Merci pour votre achat
          </p>
        </div>

        {/* Order details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Détails de la commande
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Numéro</p>
              <p className="text-gray-900 font-mono break-all">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Date</p>
              <p className="text-gray-900">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Statut</p>
              <p className={`font-semibold ${order.status === 'paid' ? 'text-green-600' : order.status === 'pending' ? 'text-rose-800' : 'text-blue-600'}`}>
                {order.status === 'paid' ? 'Payée' :
                 order.status === 'pending' ? 'En attente' :
                 order.status === 'processing' ? 'En préparation' :
                 order.status === 'shipped' ? 'Expédiée' :
                 order.status === 'delivered' ? 'Livrée' :
                 order.status === 'cancelled' ? 'Annulée' :
                 order.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {Number(order.totalAmount).toFixed(2)}€
              </p>
            </div>
          </div>

          {/* Customer info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Informations client
            </h3>
            <p className="text-gray-700 mb-1">
              <strong>Nom:</strong> {order.customerName}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Email:</strong> {order.customerEmail}
            </p>
            {order.customerPhone && (
              <p className="text-gray-700 mb-1">
                <strong>Téléphone:</strong> {order.customerPhone}
              </p>
            )}
          </div>

          {/* Delivery info */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Adresse de livraison
            </h3>
            <p className="text-gray-700 mb-1">{order.deliveryAddress}</p>
            <p className="text-gray-700 mb-1">
              {order.deliveryPostalCode} {order.deliveryCity}
            </p>
            <p className="text-gray-700">{order.deliveryCountry}</p>
          </div>

          {/* Complementary info (comment) */}
          {order.notes && (() => {
            try {
              const parsed = JSON.parse(order.notes || '{}');
              const comment = parsed?.comment?.trim?.();
              if (!comment) return null;
              return (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Informations complémentaires</h3>
                  <p className="text-gray-700 whitespace-pre-line">{comment}</p>
                </div>
              );
            } catch (e) {
              return null;
            }
          })() || null}

          {/* Order items */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Articles commandés
            </h3>
            <div className="space-y-4">
              {order.items && order.items.map((item: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {/* Product name and type */}
                  <div className="mb-3">
                    <h4 className="text-lg font-bold text-gray-900">{item.productName}</h4>
                    {item.productType && (
                      <p className="text-sm text-gray-600">Type: {item.productType}</p>
                    )}
                  </div>

                  {/* Configuration options */}
                  {item.configuration && Object.keys(item.configuration).length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-3 text-sm">
                      <p className="font-semibold text-gray-800 mb-2">Options choisies:</p>
                      <ul className="space-y-1">
                        {Object.entries(item.configuration).map(([key, value]) => {
                          const label = key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/_/g, ' ')
                            .charAt(0)
                            .toUpperCase() + key.slice(1);
                          
                          return (
                            <li key={key} className="flex justify-between text-gray-700">
                              <span className="font-medium">{label}:</span>
                              <span className="text-gray-900 font-semibold">
                                {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Prix détaillés des options (si disponible depuis cartDetails) */}
                  {cartDetails && (cartDetails.storeHT || cartDetails.ledArmsPrice || cartDetails.ledBoxPrice || cartDetails.lambrequinPrice || cartDetails.awningPrice || cartDetails.sousCoffrePrice || cartDetails.poseHT) && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 p-3 rounded mb-3 text-sm">
                      <p className="font-semibold text-gray-800 mb-2">Détail de la tarification:</p>
                      <div className="space-y-1">
                        {cartDetails.storeHT && cartDetails.storeHT > 0 && (
                          <div className="flex justify-between text-gray-700">
                            <span>Store de base (HT)</span>
                            <span className="font-semibold">{cartDetails.storeHT.toFixed(2)} €</span>
                          </div>
                        )}
                        
                        {cartDetails.priceType && (
                          <div className="mt-2 mb-2 pt-2 border-t border-slate-300">
                            <p className="text-xs font-bold text-blue-600 uppercase">Formule {cartDetails.priceType}</p>
                          </div>
                        )}
                        
                        {cartDetails.ledArmsPrice && cartDetails.ledArmsPrice > 0 && (
                          <div className="flex justify-between text-gray-700 pl-3">
                            <span className="flex items-center"><span className="text-blue-500 mr-1">💡</span> LED Bras (HT)</span>
                            <span className="font-semibold">{cartDetails.ledArmsPrice.toFixed(2)} €</span>
                          </div>
                        )}
                        
                        {cartDetails.ledBoxPrice && cartDetails.ledBoxPrice > 0 && (
                          <div className="flex justify-between text-gray-700 pl-3">
                            <span className="flex items-center"><span className="text-blue-500 mr-1">💡</span> LED Coffre (HT)</span>
                            <span className="font-semibold">{cartDetails.ledBoxPrice.toFixed(2)} €</span>
                          </div>
                        )}
                        
                        {cartDetails.lambrequinPrice && cartDetails.lambrequinPrice > 0 && (
                          <div className="flex justify-between text-gray-700 pl-3">
                            <span className="flex items-center"><span className="text-orange-500 mr-1">📏</span> Lambrequin enroulable (HT)</span>
                            <span className="font-semibold">{cartDetails.lambrequinPrice.toFixed(2)} €</span>
                          </div>
                        )}
                        
                        {cartDetails.awningPrice && cartDetails.awningPrice > 0 && (
                          <div className="flex justify-between text-gray-700 pl-3">
                            <span className="flex items-center"><span className="text-purple-500 mr-1">🏠</span> Auvent (HT)</span>
                            <span className="font-semibold">{cartDetails.awningPrice.toFixed(2)} €</span>
                          </div>
                        )}
                        
                        {cartDetails.sousCoffrePrice && cartDetails.sousCoffrePrice > 0 && (
                          <div className="flex justify-between text-gray-700 pl-3">
                            <span className="flex items-center"><span className="text-purple-500 mr-1">📦</span> Sous-coffre (HT)</span>
                            <span className="font-semibold">{cartDetails.sousCoffrePrice.toFixed(2)} €</span>
                          </div>
                        )}
                        
                        {cartDetails.poseHT && cartDetails.poseHT > 0 && (
                          <div className="flex justify-between text-gray-700 mt-2 pt-2 border-t border-slate-300">
                            <span className="flex items-center"><span className="text-green-500 mr-1">🔧</span> Installation professionnelle (HT)</span>
                            <span className="font-semibold">{cartDetails.poseHT.toFixed(2)} €</span>
                          </div>
                        )}
                        
                        {cartDetails.tvaAmount && cartDetails.tvaAmount > 0 && (
                          <div className="flex justify-between text-gray-700">
                            <span>TVA</span>
                            <span className="font-semibold">{cartDetails.tvaAmount.toFixed(2)} €</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quantity and price */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Quantité: <strong>{item.quantity}</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        Prix unitaire: <strong>{(Number(item.totalPrice) / Number(item.quantity)).toFixed(2)}€</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {Number(item.totalPrice).toFixed(2)}€
                      </p>
                      <p className="text-xs text-gray-500">Total TTC</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account guidance */}
          <div className="mb-6 pb-6 border-b border-gray-200 bg-blue-50 border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Suivi de commande</h3>
            <p className="text-blue-800 text-sm mb-1">
              Vous avez créé un compte ? Connectez-vous depuis « Mes commandes » pour suivre la livraison et récupérer vos factures.
            </p>
          </div>

          {/* Payment instructions */}
          {order.paymentMethod !== 'stripe' && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Instructions de paiement
              </h3>
              
              {order.paymentMethod === 'cheque' && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-gray-900 mb-2">Paiement par chèque</p>
                  <p className="text-gray-700 mb-3">
                    Veuillez envoyer votre chèque à l'ordre de:
                  </p>
                  <div className="bg-white p-3 rounded border border-yellow-300 mb-3">
                    <p className="font-mono text-sm">
                      <strong>Storal</strong><br />
                      58 rue de Monceau CS 48756<br />
                      75380 Paris Cedex 08
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Montant: <strong>{Number(order.totalAmount).toFixed(2)}€</strong><br />
                    Référence commande: <strong className="font-mono">{order.id.slice(0, 8)}</strong>
                  </p>
                </div>
              )}

              {order.paymentMethod === 'virement' && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-semibold text-gray-900 mb-2">Paiement par virement bancaire</p>
                  <p className="text-gray-700 mb-3">
                    Veuillez effectuer le virement sur le compte suivant:
                  </p>
                  <div className="bg-white p-3 rounded border border-green-300 mb-3 font-mono text-sm">
                    <p><strong>Titulaire:</strong> Storal SARL</p>
                    <p><strong>IBAN:</strong> FR76 1234 5678 9012 3456 7890 123</p>
                    <p><strong>BIC:</strong> BNPAFRPPXXX</p>
                    <p><strong>Banque:</strong> BNP Paribas</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Montant: <strong>{Number(order.totalAmount).toFixed(2)}€</strong><br />
                    <strong>Référence à indiquer:</strong> <span className="font-mono bg-yellow-100 px-2 py-1">{order.id.slice(0, 8)}</span>
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    ⚠️ N'oubliez pas d'indiquer la référence dans le libellé du virement
                  </p>
                </div>
              )}
            </div>
          )}

          {/* What's next */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">Les prochaines étapes</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
              <li>Confirmation par email dans quelques minutes</li>
              {order.paymentMethod !== 'stripe' && (
                <li>Réception et validation de votre paiement (sous 2-3 jours ouvrés)</li>
              )}
              <li>Préparation de votre commande</li>
              <li>Livraison programmée (vous recevrez un SMS)</li>
            </ol>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <button 
            onClick={() => {
              const doc = new (require('jspdf')).default();
              const pageWidth = doc.internal.pageSize.getWidth();
              let yPos = 20;
              
              // Company header
              doc.setFontSize(18);
              doc.setFont('helvetica', 'bold');
              doc.text('STORAL', 20, yPos);
              
              doc.setFontSize(9);
              doc.setFont('helvetica', 'normal');
              doc.text('Store et Menuiserie', 20, yPos + 7);
              doc.text('58 rue de Monceau CS 48756', 20, yPos + 12);
              doc.text('75380 Paris Cedex 08', 20, yPos + 17);
              doc.text('Tel: 01 85 09 34 46', 20, yPos + 22);
              doc.text('Email: commandes@storal.fr', 20, yPos + 27);

              // Confirmation badge
              yPos += 35;
              doc.setFillColor(0, 102, 204);
              doc.rect(pageWidth - 80, yPos - 5, 60, 10, 'F');
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(12);
              doc.setTextColor(255, 255, 255);
              doc.text('CONFIRMATION', pageWidth - 50, yPos, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              // Separator
              yPos += 15;
              doc.setDrawColor(0, 102, 204);
              doc.setLineWidth(0.5);
              doc.line(20, yPos, pageWidth - 20, yPos);
              yPos += 10;
              doc.setFontSize(10);
              doc.setFont('helvetica', 'bold');
              doc.text('Commande:', 20, yPos);
              doc.setFont('helvetica', 'normal');
              doc.text(order.id.slice(0, 16), 60, yPos);
              yPos += 7;
              doc.setFont('helvetica', 'bold');
              doc.text('Date:', 20, yPos);
              doc.setFont('helvetica', 'normal');
              doc.text(new Date(order.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }), 60, yPos);
              yPos += 7;
              doc.setFont('helvetica', 'bold');
              doc.text('Statut:', 20, yPos);
              doc.setFont('helvetica', 'normal');
              const statusText = order.status === 'paid' ? 'Payée' :
                                order.status === 'pending' ? 'En attente' :
                                order.status === 'processing' ? 'En préparation' :
                                order.status === 'shipped' ? 'Expédiée' :
                                order.status === 'delivered' ? 'Livrée' :
                                order.status === 'cancelled' ? 'Annulée' : order.status;
              doc.text(statusText, 60, yPos);
              yPos += 12;
              doc.setFontSize(12);
              doc.setFont('helvetica', 'bold');
              doc.text('INFORMATIONS CLIENT', 20, yPos);
              yPos += 7;
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              doc.text(`Nom: ${order.customerName}`, 20, yPos);
              yPos += 7;
              doc.text(`Email: ${order.customerEmail}`, 20, yPos);
              if (order.customerPhone) {
                yPos += 7;
                doc.text(`Téléphone: ${order.customerPhone}`, 20, yPos);
              }
              yPos += 12;
              doc.setFontSize(12);
              doc.setFont('helvetica', 'bold');
              doc.text('ADRESSE DE LIVRAISON', 20, yPos);
              yPos += 7;
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              doc.text(order.deliveryAddress, 20, yPos);
              yPos += 7;
              doc.text(`${order.deliveryPostalCode} ${order.deliveryCity}`, 20, yPos);
              yPos += 7;
              doc.text(order.deliveryCountry, 20, yPos);

              // Complementary info (comment)
              try {
                const parsed = order.notes ? JSON.parse(order.notes) : null;
                const comment = parsed?.comment?.trim?.();
                if (comment) {
                  yPos += 12;
                  if (yPos > 270) { doc.addPage(); yPos = 20; }
                  doc.setFontSize(12);
                  doc.setFont('helvetica', 'bold');
                  doc.text('INFORMATIONS COMPLÉMENTAIRES', 20, yPos);
                  yPos += 7;
                  doc.setFontSize(10);
                  doc.setFont('helvetica', 'normal');
                  const lines = doc.splitTextToSize(comment, pageWidth - 40);
                  lines.forEach((line: string) => {
                    if (yPos > 280) { doc.addPage(); yPos = 20; }
                    doc.text(line, 20, yPos);
                    yPos += 5;
                  });
                }
              } catch {}
              yPos += 12;
              doc.setFontSize(12);
              doc.setFont('helvetica', 'bold');
              doc.text('ARTICLES COMMANDÉS', 20, yPos);
              yPos += 7;
              doc.setFontSize(10);
              order.items?.forEach((item: any) => {
                if (yPos > 250) {
                  doc.addPage();
                  yPos = 20;
                }
                doc.setFont('helvetica', 'bold');
                doc.text(item.productName, 20, yPos);
                yPos += 6;
                
                // Product type if available
                if (item.productType) {
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(9);
                  doc.text(`   Type: ${item.productType}`, 20, yPos);
                  yPos += 5;
                  doc.setFontSize(10);
                }
                
                // Configuration details
                if (item.configuration && Object.keys(item.configuration).length > 0) {
                  doc.setFont('helvetica', 'bold');
                  doc.setFontSize(9);
                  doc.text('   Configuration:', 20, yPos);
                  yPos += 5;
                  
                  doc.setFont('helvetica', 'normal');
                  Object.entries(item.configuration).forEach(([key, value]) => {
                    if (yPos > 270) {
                      doc.addPage();
                      yPos = 20;
                    }
                    
                    const label = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/_/g, ' ')
                      .charAt(0)
                      .toUpperCase() + key.slice(1);
                    
                    const valueStr = String(value).charAt(0).toUpperCase() + String(value).slice(1);
                    doc.text(`      - ${label}: ${valueStr}`, 20, yPos);
                    yPos += 5;
                  });
                  
                  doc.setFontSize(10);
                  yPos += 1;
                }
                
                doc.setFont('helvetica', 'normal');
                doc.text(`   Quantité: ${item.quantity}`, 20, yPos);
                yPos += 6;
                const unitPrice = (Number(item.totalPrice) / Number(item.quantity)).toFixed(2);
                doc.text(`   Prix unitaire: ${unitPrice}€`, 20, yPos);
                yPos += 6;
                doc.setFont('helvetica', 'bold');
                doc.text(`   Total: ${Number(item.totalPrice).toFixed(2)}€`, 20, yPos);
                yPos += 8;
              });
              yPos += 5;
              doc.setDrawColor(0, 102, 204);
              doc.setLineWidth(0.5);
              doc.line(20, yPos, pageWidth - 20, yPos);
              yPos += 10;
              doc.setFontSize(14);
              doc.setFont('helvetica', 'bold');
              doc.text(`TOTAL: ${Number(order.totalAmount).toFixed(2)}€`, pageWidth - 20, yPos, { align: 'right' });
              yPos += 15;
              doc.setFontSize(9);
              doc.setFont('helvetica', 'italic');
              doc.setTextColor(100, 100, 100);
              doc.text('Merci pour votre confiance!', pageWidth / 2, yPos, { align: 'center' });
              yPos += 5;
              doc.text('Pour toute question, contactez-nous à commandes@storal.fr', pageWidth / 2, yPos, { align: 'center' });
              doc.save(`commande_${order.id.slice(0, 8)}.pdf`);
            }}
            className="flex-1 min-w-[180px] bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Confirmation
          </button>
          {order.status !== 'cancelled' && (
            <button 
              onClick={() => downloadInvoice(order)}
              className="flex-1 min-w-[180px] bg-rose-800 text-white py-3 rounded-lg font-bold hover:bg-rose-900 transition flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {(order.status === 'shipped' || order.status === 'delivered') ? 'Facture' : 'Facture pro forma'}
            </button>
          )}
        </div>

        <div className="flex gap-4">
          <Link href="/" className="flex-1">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Retour à l'accueil
            </button>
          </Link>
          <Link 
            href={`/contact?email=${encodeURIComponent(order.customerEmail)}&orderId=${encodeURIComponent(order.id)}`} 
            className="flex-1"
          >
            <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition">
              Contacter le support
            </button>
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Une confirmation a été envoyée à <strong>{order.customerEmail}</strong>
        </p>
      </div>
    </div>
  );
}
