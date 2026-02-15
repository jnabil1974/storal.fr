'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/types/order';
import Link from 'next/link';
import Image from 'next/image';
import { downloadInvoice } from '../_invoice';
import jsPDF from 'jspdf';
import { STORE_MODELS, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';

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

  // Format configuration values for display
  const formatConfigValue = (key: string, value: any): string => {
    if (key === 'width' && typeof value === 'number') {
      return `${(value / 10).toFixed(1)} cm`;
    }
    if (key === 'projection' || key === 'depth') {
      return `${(value / 10).toFixed(1)} cm`;
    }
    if (key === 'terraceLength' || key === 'terraceWidth') {
      return `${(value / 100).toFixed(2)} m`;
    }
    if (key === 'installHeight' && typeof value === 'number') {
      return `${value.toFixed(2)} m`;
    }
    if (typeof value === 'boolean') {
      return value ? '✓ Oui' : '✗ Non';
    }
    return String(value);
  };

  const formatConfigKey = (key: string): string => {
    const labels: { [key: string]: string } = {
      width: 'Largeur store',
      depth: 'Profondeur store',
      projection: 'Avancée',
      motorized: 'Motorisé',
      fabric: 'Tissu',
      fabricColor: 'Couleur toile',
      frameColor: 'Couleur armature',
      armType: 'Type d\'armature',
      windSensor: 'Capteur vent',
      rainSensor: 'Capteur pluie',
      model: 'Modèle',
      color: 'Couleur',
      motorSide: 'Côté moteur',
      sensor: 'Capteurs',
      ledArms: 'LED bras',
      ledBox: 'LED coffre',
      lambrequin: 'Lambrequin',
      lambrequinMotorized: 'Lambrequin motorisé',
      terraceLength: 'Longueur terrasse',
      terraceWidth: 'Largeur terrasse',
      environment: 'Environnement',
      orientation: 'Orientation',
      installHeight: 'Hauteur de pose',
      cableExit: 'Sortie de câble',
      obstacles: 'Obstacles',
    };
    return labels[key] || key;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* En-tête professionnel */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-lg shadow-lg">
                <div className="text-3xl font-bold text-blue-600">S</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">STORAL</h1>
                <p className="text-blue-100 text-sm">Store et Menuiserie</p>
              </div>
            </div>
            <div className="text-right text-sm hidden md:block">
              <p className="font-semibold">📍 58 rue de Monceau CS 48756</p>
              <p className="text-blue-100">75380 Paris Cedex 08</p>
              <p className="font-semibold mt-1">📞 01 85 09 34 46 | 📧 commandes@storal.fr</p>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Success banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl shadow-lg p-5 mb-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-center gap-4">
              <div className="text-3xl">✅</div>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">
                  Commande confirmée!
                </h1>
                <p className="text-green-50 text-base">
                  Merci pour votre confiance
                </p>
              </div>
            </div>
          </div>

          {/* Order details */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 hover:shadow-2xl transition-shadow border-t-4 border-blue-600">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📋 Détails de la commande
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="text-blue-700 text-sm font-semibold mb-2 uppercase">Numéro de commande</p>
                <p className="text-gray-900 font-mono text-lg font-bold break-all">{order.id.slice(0, 16)}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
                <p className="text-green-700 text-sm font-semibold mb-2 uppercase">Date</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-gray-600 text-sm">
                  {new Date(order.createdAt).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                <p className="text-purple-700 text-sm font-semibold mb-2 uppercase">Statut</p>
                <p className={`font-bold text-lg ${order.status === 'paid' ? 'text-green-600' : order.status === 'pending' ? 'text-orange-600' : 'text-blue-600'}`}>
                  {order.status === 'paid' ? '✓ Payée' :
                   order.status === 'pending' ? '⏳ En attente' :
                   order.status === 'processing' ? '🔄 En préparation' :
                   order.status === 'shipped' ? '📦 Expédiée' :
                   order.status === 'delivered' ? '✅ Livrée' :
                   order.status === 'cancelled' ? '❌ Annulée' :
                   order.status}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg mb-6">
              <p className="text-blue-100 text-sm font-semibold mb-1 uppercase">Montant total</p>
              <p className="text-5xl font-bold">
                {Number(order.totalAmount).toFixed(2)}€
              </p>
              <p className="text-blue-100 text-sm mt-1">TTC</p>
            </div>

          {/* Customer and Delivery info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Customer info */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200 h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  👤 Informations client
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <div>
                    <p className="text-gray-600 text-xs font-semibold uppercase mb-1">Nom complet</p>
                    <p className="text-gray-900 font-bold text-lg">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-semibold uppercase mb-1">Email</p>
                    <p className="text-blue-600 font-medium break-all">{order.customerEmail}</p>
                  </div>
                  {order.customerPhone && (
                    <div>
                      <p className="text-gray-600 text-xs font-semibold uppercase mb-1">Téléphone</p>
                      <p className="text-gray-900 font-semibold">{order.customerPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200 h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🚚 Adresse de livraison
                </h3>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 space-y-2">
                  <p className="text-gray-900 font-bold text-lg">{order.deliveryAddress}</p>
                  <p className="text-gray-900 font-semibold">
                    {order.deliveryPostalCode} {order.deliveryCity}
                  </p>
                  <p className="text-gray-700 font-medium">{order.deliveryCountry}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Complementary info (comment) */}
          {order.notes && (() => {
            try {
              const parsed = JSON.parse(order.notes || '{}');
              const comment = parsed?.comment?.trim?.();
              if (!comment) return null;
              return (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    📝 Informations complémentaires
                  </h3>
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-gray-700 whitespace-pre-line font-medium">{comment}</p>
                  </div>
                </div>
              );
            } catch (e) {
              return null;
            }
          })() || null}

          {/* Order items */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-lg">
              📦 Articles commandés
            </h3>
            <div className="space-y-6">
              {order.items && order.items.map((item: any, idx: number) => {
                // Extraire le modèle depuis l'item
                const modelId = item.productId || item.configuration?.modelId;
                const modelData = modelId && STORE_MODELS[modelId as keyof typeof STORE_MODELS] 
                  ? STORE_MODELS[modelId as keyof typeof STORE_MODELS]
                  : null;
                const productImage = modelData?.image || '/images/stores/default.jpg';

                return (
                  <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="flex gap-6 mb-5">
                      {/* Product Image */}
                      {productImage && (
                        <div className="flex-shrink-0">
                          <div className="w-40 h-40 relative rounded-xl overflow-hidden bg-gray-100 border-3 border-gray-300 shadow-lg">
                            <Image
                              src={productImage}
                              alt={item.productName || 'Produit'}
                              fill
                              className="object-cover"
                              sizes="160px"
                            />
                          </div>
                        </div>
                      )}

                      {/* Product name and type */}
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200 mb-4">
                          <h4 className="text-2xl font-bold text-gray-900 mb-2">{item.productName}</h4>
                          {item.productType && (
                            <p className="text-sm text-white bg-blue-600 inline-block px-4 py-2 rounded-full font-bold shadow-md">
                              {item.productType}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                            <p className="text-gray-600 text-xs font-semibold uppercase mb-1">Quantité</p>
                            <p className="text-2xl font-bold text-gray-900">{item.quantity}</p>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border-2 border-blue-300">
                            <p className="text-blue-700 text-xs font-semibold uppercase mb-1">Prix total</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {Number(item.totalPrice).toFixed(2)}€
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Aperçu visuel */}
                    {(item.configuration?.frameColor || item.configuration?.fabricColor) && (
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-300 p-4 rounded-lg mb-4">
                        <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          🎨 Aperçu visuel
                        </p>
                        <div className="flex gap-4 flex-wrap">
                          {/* Couleur coffre */}
                          {item.configuration?.frameColor && (() => {
                            const frameColor = FRAME_COLORS.find(c => c.id === item.configuration.frameColor);
                            return frameColor ? (
                              <div key="frame" className="flex flex-col items-center gap-2">
                                <div className="w-20 h-20 rounded-lg border-2 border-gray-400 shadow-md" style={{ backgroundColor: frameColor.hex }}></div>
                                <span className="text-xs text-gray-700 text-center font-medium max-w-[80px]">
                                  Coffre<br/>{frameColor.name.split('(')[0].trim()}
                                </span>
                              </div>
                            ) : null;
                          })()}
                          
                          {/* Couleur toile */}
                          {item.configuration?.fabricColor && (() => {
                            const fabric = FABRICS.find(f => f.id === item.configuration.fabricColor);
                            return fabric ? (
                              <div key="fabric" className="flex flex-col items-center gap-2">
                                <div className="w-20 h-20 rounded-lg border-2 border-gray-400 shadow-md bg-gray-100 relative overflow-hidden">
                                  <Image 
                                    src={`${fabric.folder}/${fabric.ref}.jpg`} 
                                    alt={fabric.name} 
                                    fill 
                                    className="object-cover"
                                    sizes="80px"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-gray-700 text-center font-medium max-w-[80px]">
                                  Toile<br/>{fabric.name}
                                </span>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    )}

                  {/* Configuration options */}
                  {item.configuration && Object.keys(item.configuration).length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-4 rounded-lg mb-4">
                      <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        ⚙️ Configuration
                      </p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {Object.entries(item.configuration).map(([key, value]) => {
                          if (!value || key === 'id') return null;
                          return (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-gray-700 font-medium">{formatConfigKey(key)}:</span>
                              <span className="font-semibold text-gray-900">
                                {formatConfigValue(key, value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Informations de pose */}
                  {item.configuration && (item.configuration.terraceLength || item.configuration.terraceWidth || 
                    item.configuration.environment || item.configuration.orientation || 
                    item.configuration.installHeight || item.configuration.cableExit || 
                    item.configuration.obstacles) && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 p-4 rounded-lg mb-4">
                      <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        📋 Informations de pose
                      </p>
                      <div className="space-y-2 text-sm">
                        {item.configuration.terraceLength && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Longueur terrasse:</span>
                            <span className="font-semibold text-gray-900">
                              {(item.configuration.terraceLength / 100).toFixed(2)} m
                            </span>
                          </div>
                        )}
                        {item.configuration.terraceWidth && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Largeur terrasse:</span>
                            <span className="font-semibold text-gray-900">
                              {(item.configuration.terraceWidth / 100).toFixed(2)} m
                            </span>
                          </div>
                        )}
                        {item.configuration.environment && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Environnement:</span>
                            <span className="font-semibold text-gray-900">{item.configuration.environment}</span>
                          </div>
                        )}
                        {item.configuration.orientation && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Orientation:</span>
                            <span className="font-semibold text-gray-900">{item.configuration.orientation}</span>
                          </div>
                        )}
                        {item.configuration.installHeight && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Hauteur de pose:</span>
                            <span className="font-semibold text-gray-900">
                              {item.configuration.installHeight.toFixed(2)} m
                            </span>
                          </div>
                        )}
                        {item.configuration.cableExit && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Sortie de câble:</span>
                            <span className="font-semibold text-gray-900">{item.configuration.cableExit}</span>
                          </div>
                        )}
                        {item.configuration.obstacles && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Obstacles:</span>
                            <span className="font-semibold text-gray-900">{item.configuration.obstacles}</span>
                          </div>
                        )}
                        {(item.configuration.ledArms || item.configuration.ledBox) && (
                          <div className="mt-3 pt-3 border-t border-cyan-200">
                            <p className="font-semibold text-gray-800 mb-2 text-xs">Options LED:</p>
                            {item.configuration.ledArms && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <span className="text-blue-500">💡</span>
                                <span className="font-medium">LED Bras</span>
                              </div>
                            )}
                            {item.configuration.ledBox && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <span className="text-blue-500">💡</span>
                                <span className="font-medium">LED Coffre</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
                </div>
              );
            })}
            </div>
          </div>

          {/* Account guidance */}
          <div className="mb-6 pb-6 border-b border-gray-200 bg-blue-50 border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Suivi de commande</h3>
            <p className="text-blue-800 text-sm mb-1">
              Vous avez créé un compte ? Connectez-vous depuis « Mes commandes » pour suivre la livraison et récupérer vos factures.
            </p>
          </div>

          {/* Garanties */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-5 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                ✓ Garanties
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-300">
                  <div className="text-3xl mb-2">🏗️</div>
                  <p className="font-bold text-gray-900 mb-1">Structure</p>
                  <p className="text-2xl font-bold text-green-600">12 ans</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-300">
                  <div className="text-3xl mb-2">⚡</div>
                  <p className="font-bold text-gray-900 mb-1">Motorisation</p>
                  <p className="text-2xl font-bold text-green-600">5 ans</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-300">
                  <div className="text-3xl mb-2">🎨</div>
                  <p className="font-bold text-gray-900 mb-1">Toile</p>
                  <p className="text-2xl font-bold text-green-600">5 ans</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment instructions */}
          {order.paymentMethod !== 'stripe' && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                💳 Instructions de paiement
              </h3>
              
              {order.paymentMethod === 'cheque' && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl border-2 border-yellow-300 shadow-md">
                  <p className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                    📝 Paiement par chèque
                  </p>
                  <p className="text-gray-700 mb-4 font-medium">
                    Veuillez envoyer votre chèque à l'ordre de:
                  </p>
                  <div className="bg-white p-4 rounded-lg border-2 border-yellow-400 mb-4 shadow-sm">
                    <p className="font-mono text-sm leading-relaxed text-gray-900">
                      <strong className="text-blue-700 text-base">Storal</strong><br />
                      58 rue de Monceau CS 48756<br />
                      75380 Paris Cedex 08
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-400">
                    <p className="text-sm text-gray-800">
                      <strong>Montant:</strong> <span className="text-lg font-bold text-blue-700">{Number(order.totalAmount).toFixed(2)}€</span><br />
                      <strong>Référence commande:</strong> <span className="font-mono font-bold bg-white px-2 py-1 rounded">{order.id.slice(0, 8)}</span>
                    </p>
                  </div>
                </div>
              )}

              {order.paymentMethod === 'virement' && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-300 shadow-md">
                  <p className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                    🏦 Paiement par virement bancaire
                  </p>
                  <p className="text-gray-700 mb-4 font-medium">
                    Veuillez effectuer le virement sur le compte suivant:
                  </p>
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-400 mb-4 font-mono text-sm shadow-sm">
                    <p className="mb-1"><strong className="text-gray-700">Titulaire:</strong> <span className="text-blue-700">Storal SARL</span></p>
                    <p className="mb-1"><strong className="text-gray-700">IBAN:</strong> <span className="text-blue-700">FR76 1234 5678 9012 3456 7890 123</span></p>
                    <p className="mb-1"><strong className="text-gray-700">BIC:</strong> <span className="text-blue-700">BNPAFRPPXXX</span></p>
                    <p><strong className="text-gray-700">Banque:</strong> <span className="text-blue-700">BNP Paribas</span></p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg border border-blue-400 mb-3">
                    <p className="text-sm text-gray-800 mb-2">
                      <strong>Montant:</strong> <span className="text-lg font-bold text-blue-700">{Number(order.totalAmount).toFixed(2)}€</span><br />
                      <strong>Référence à indiquer:</strong> <span className="font-mono bg-yellow-200 px-2 py-1 rounded font-bold">{order.id.slice(0, 8)}</span>
                    </p>
                  </div>
                  <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
                    <p className="text-sm text-gray-800 font-semibold flex items-start gap-2">
                      <span className="text-lg">⚠️</span>
                      <span>N'oubliez pas d'indiquer la référence dans le libellé du virement</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* What's next */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              🛣️ Les prochaines étapes
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">📧 Confirmation par email</p>
                  <p className="text-sm text-gray-700">Vous recevrez un email de confirmation dans quelques minutes</p>
                </div>
              </div>

              {order.paymentMethod !== 'stripe' && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">💳 Validation du paiement</p>
                    <p className="text-sm text-gray-700">Réception et validation de votre paiement sous 2-3 jours ouvrés</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border-2 border-cyan-200">
                <div className="flex-shrink-0 w-10 h-10 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{order.paymentMethod !== 'stripe' ? '3' : '2'}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">🎥 Validation technique</p>
                  <p className="text-sm text-gray-700">Un technicien vous contactera par téléphone ou visio pour valider les aspects techniques de votre projet</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{order.paymentMethod !== 'stripe' ? '4' : '3'}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">📦 Préparation de commande</p>
                  <p className="text-sm text-gray-700">Nos équipes préparent votre commande avec soin</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{order.paymentMethod !== 'stripe' ? '5' : '4'}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">🚚 Livraison programmée</p>
                  <p className="text-sm text-gray-700">Vous recevrez un SMS pour planifier la livraison</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <button 
            onClick={() => {
              const doc = new (require('jspdf')).default();
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();
              let yPos = 20;
              
              // Function to add header
              const addHeader = () => {
                // Company header - Left side
                doc.setFillColor(240, 248, 255);
                doc.rect(0, 0, pageWidth, 50, 'F');
                
                doc.setFillColor(0, 102, 204);
                doc.rect(15, 12, 10, 10, 'F');
                doc.setFontSize(20);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(0, 102, 204);
                doc.text('STORAL', 28, 20);
                
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(80, 80, 80);
                doc.text('Store et Menuiserie', 28, 26);
                doc.text('58 rue de Monceau CS 48756', 15, 35);
                doc.text('75380 Paris Cedex 08', 15, 40);
                doc.text('Tel: 01 85 09 34 46', 15, 45);
                
                // Document type - Right side
                doc.setFillColor(0, 102, 204);
                doc.rect(pageWidth - 70, 15, 55, 12, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.setTextColor(255, 255, 255);
                doc.text('BON DE COMMANDE', pageWidth - 42.5, 23, { align: 'center' });
                
                doc.setFontSize(8);
                doc.setTextColor(80, 80, 80);
                doc.text('Email: commandes@storal.fr', pageWidth - 70, 35);
                doc.text('Web: www.storal.fr', pageWidth - 70, 40);
                
                // Horizontal line
                doc.setDrawColor(0, 102, 204);
                doc.setLineWidth(0.8);
                doc.line(15, 52, pageWidth - 15, 52);
              };
              
              // Function to add footer
              const addFooter = (pageNum: number) => {
                const footerY = pageHeight - 20;
                
                // Footer line
                doc.setDrawColor(0, 102, 204);
                doc.setLineWidth(0.5);
                doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
                
                // Footer content
                doc.setFontSize(7);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 100, 100);
                doc.text('STORAL - SARL au capital de 50 000 EUR - RCS Paris 123 456 789', pageWidth / 2, footerY, { align: 'center' });
                doc.text('TVA: FR12345678901 - SIRET: 123 456 789 00012', pageWidth / 2, footerY + 4, { align: 'center' });
                doc.text('Garantie: Structure 12 ans - Motorisation 5 ans - Toile 5 ans', pageWidth / 2, footerY + 8, { align: 'center' });
                
                // Page number
                doc.setFontSize(8);
                doc.text(`Page ${pageNum}`, pageWidth - 20, footerY + 8, { align: 'right' });
              };
              
              // Add first page header
              addHeader();
              yPos = 60;
              
              doc.setTextColor(0, 0, 0);

              // Separator
              yPos += 5;
              // Order info box
              doc.setFillColor(240, 248, 255);
              doc.rect(15, yPos, pageWidth - 30, 30, 'F');
              doc.setDrawColor(0, 102, 204);
              doc.setLineWidth(0.5);
              doc.rect(15, yPos, pageWidth - 30, 30, 'S');
              
              yPos += 8;
              doc.setFontSize(10);
              doc.setFont('helvetica', 'bold');
              doc.text('No Commande:', 20, yPos);
              doc.setFont('helvetica', 'normal');
              doc.text(order.id.slice(0, 16), 65, yPos);
              
              doc.setFont('helvetica', 'bold');
              doc.text('Date:', pageWidth / 2, yPos);
              doc.setFont('helvetica', 'normal');
              doc.text(new Date(order.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }), pageWidth / 2 + 25, yPos);
              
              yPos += 7;
              doc.setFont('helvetica', 'bold');
              doc.text('Statut:', 20, yPos);
              doc.setFont('helvetica', 'normal');
              const statusText = order.status === 'paid' ? 'Payee' :
                                order.status === 'pending' ? 'En attente' :
                                order.status === 'processing' ? 'En preparation' :
                                order.status === 'shipped' ? 'Expediee' :
                                order.status === 'delivered' ? 'Livree' :
                                order.status === 'cancelled' ? 'Annulee' : order.status;
              doc.text(statusText, 65, yPos);
              
              doc.setFont('helvetica', 'bold');
              doc.text('Paiement:', pageWidth / 2, yPos);
              doc.setFont('helvetica', 'normal');
              const paymentText = order.paymentMethod === 'stripe' ? 'Carte bancaire' :
                                 order.paymentMethod === 'cheque' ? 'Cheque' :
                                 order.paymentMethod === 'virement' ? 'Virement' : order.paymentMethod;
              doc.text(paymentText, pageWidth / 2 + 25, yPos);
              
              yPos += 7;
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(12);
              doc.text('TOTAL:', 20, yPos);
              doc.setTextColor(0, 102, 204);
              doc.text(`${Number(order.totalAmount).toFixed(2)} EUR`, 65, yPos);
              doc.setTextColor(0, 0, 0);
              
              yPos += 15;
              // Client and delivery info in two columns
              doc.setFillColor(255, 255, 255);
              doc.setDrawColor(200, 200, 200);
              doc.setLineWidth(0.3);
              
              // Client box
              doc.rect(15, yPos, (pageWidth - 35) / 2, 35, 'S');
              doc.setFillColor(245, 245, 245);
              doc.rect(15, yPos, (pageWidth - 35) / 2, 8, 'F');
              doc.setFontSize(10);
              doc.setFont('helvetica', 'bold');
              doc.text('CLIENT', 20, yPos + 5.5);
              
              yPos += 12;
              doc.setFontSize(9);
              doc.setFont('helvetica', 'normal');
              doc.text(`${order.customerName}`, 20, yPos);
              yPos += 5;
              doc.text(`Email: ${order.customerEmail}`, 20, yPos);
              if (order.customerPhone) {
                yPos += 5;
                doc.text(`Tel: ${order.customerPhone}`, 20, yPos);
              }
              
              // Delivery box
              const deliveryX = 15 + (pageWidth - 35) / 2 + 5;
              yPos -= 17;
              if (order.customerPhone) yPos -= 5;
              
              doc.setLineWidth(0.3);
              doc.rect(deliveryX, yPos, (pageWidth - 35) / 2, 35, 'S');
              doc.setFillColor(245, 245, 245);
              doc.rect(deliveryX, yPos, (pageWidth - 35) / 2, 8, 'F');
              doc.setFontSize(10);
              doc.setFont('helvetica', 'bold');
              doc.text('LIVRAISON', deliveryX + 5, yPos + 5.5);
              
              yPos += 12;
              doc.setFontSize(9);
              doc.setFont('helvetica', 'normal');
              doc.text(order.deliveryAddress, deliveryX + 5, yPos);
              yPos += 5;
              doc.text(`${order.deliveryPostalCode} ${order.deliveryCity}`, deliveryX + 5, yPos);
              yPos += 5;
              doc.text(order.deliveryCountry, deliveryX + 5, yPos);
              
              yPos += 15;

              // Complementary info (comment)
              try {
                const parsed = order.notes ? JSON.parse(order.notes) : null;
                const comment = parsed?.comment?.trim?.();
                if (comment) {
                  yPos += 5;
                  if (yPos > pageHeight - 50) { 
                    addFooter(1);
                    doc.addPage(); 
                    addHeader();
                    yPos = 60; 
                  }
                  doc.setFillColor(255, 250, 240);
                  const commentHeight = Math.min(30, doc.splitTextToSize(comment, pageWidth - 50).length * 5 + 15);
                  doc.rect(15, yPos, pageWidth - 30, commentHeight, 'F');
                  doc.setDrawColor(255, 200, 100);
                  doc.setLineWidth(0.3);
                  doc.rect(15, yPos, pageWidth - 30, commentHeight, 'S');
                  
                  doc.setFontSize(9);
                  doc.setFont('helvetica', 'bold');
                  doc.text('INFORMATIONS COMPLEMENTAIRES', 20, yPos + 6);
                  yPos += 11;
                  doc.setFontSize(8);
                  doc.setFont('helvetica', 'normal');
                  const lines = doc.splitTextToSize(comment, pageWidth - 50);
                  lines.forEach((line: string) => {
                    if (yPos > pageHeight - 50) { 
                      addFooter(1);
                      doc.addPage(); 
                      addHeader();
                      yPos = 60; 
                    }
                    doc.text(line, 20, yPos);
                    yPos += 4;
                  });
                  yPos += 5;
                }
              } catch {}
              yPos += 5;
              
              // Articles section header
              doc.setFillColor(0, 102, 204);
              doc.rect(15, yPos, pageWidth - 30, 8, 'F');
              doc.setFontSize(11);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(255, 255, 255);
              doc.text('ARTICLES COMMANDES', 20, yPos + 5.5);
              doc.setTextColor(0, 0, 0);
              yPos += 12;
              
              let pageNum = 1;
              doc.setFontSize(10);
              order.items?.forEach((item: any, index: number) => {
                if (yPos > pageHeight - 60) {
                  addFooter(pageNum);
                  doc.addPage();
                  addHeader();
                  yPos = 60;
                  pageNum++;
                }
                
                // Item box
                doc.setFillColor(250, 250, 250);
                const itemStartY = yPos;
                doc.setDrawColor(220, 220, 220);
                doc.setLineWidth(0.3);
                
                yPos += 2;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.text(`${index + 1}. ${item.productName}`, 20, yPos);
                yPos += 5;
                
                // Product type if available
                if (item.productType) {
                  doc.setFont('helvetica', 'italic');
                  doc.setFontSize(8);
                  doc.setTextColor(100, 100, 100);
                  doc.text(`Type: ${item.productType}`, 25, yPos);
                  doc.setTextColor(0, 0, 0);
                  yPos += 5;
                  doc.setFontSize(10);
                }
                
                // Configuration details
                if (item.configuration && Object.keys(item.configuration).length > 0) {
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(8);
                  doc.setTextColor(80, 80, 80);
                  
                  Object.entries(item.configuration).forEach(([key, value]) => {
                    if (yPos > pageHeight - 60) {
                      addFooter(pageNum);
                      doc.addPage();
                      addHeader();
                      yPos = 60;
                      pageNum++;
                    }
                    
                    const label = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/_/g, ' ')
                      .charAt(0)
                      .toUpperCase() + key.slice(1);
                    
                    const valueStr = String(value).charAt(0).toUpperCase() + String(value).slice(1);
                    doc.text(`- ${label}: ${valueStr}`, 25, yPos);
                    yPos += 4;
                  });
                  
                  doc.setTextColor(0, 0, 0);
                  doc.setFontSize(10);
                  yPos += 2;
                }
                
                // Price info
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                const unitPrice = (Number(item.totalPrice) / Number(item.quantity)).toFixed(2);
                doc.text(`Quantite: ${item.quantity} x ${unitPrice} EUR`, 25, yPos);
                yPos += 5;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.text(`Total article: ${Number(item.totalPrice).toFixed(2)} EUR`, pageWidth - 70, yPos);
                yPos += 3;
                
                // Draw item box
                const itemHeight = yPos - itemStartY;
                doc.rect(15, itemStartY, pageWidth - 30, itemHeight, 'S');
                yPos += 5;
              });
              // Total section
              yPos += 5;
              doc.setFillColor(0, 102, 204);
              doc.rect(pageWidth - 90, yPos, 75, 15, 'F');
              doc.setFontSize(13);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(255, 255, 255);
              doc.text('TOTAL TTC', pageWidth - 85, yPos + 6);
              doc.setFontSize(16);
              doc.text(`${Number(order.totalAmount).toFixed(2)} EUR`, pageWidth - 85, yPos + 12);
              doc.setTextColor(0, 0, 0);
              
              yPos += 25;
              
              // Payment terms
              if (yPos > pageHeight - 80) {
                addFooter(pageNum);
                doc.addPage();
                addHeader();
                yPos = 60;
                pageNum++;
              }
              
              doc.setFillColor(255, 255, 240);
              doc.rect(15, yPos, pageWidth - 30, 25, 'F');
              doc.setDrawColor(200, 200, 100);
              doc.setLineWidth(0.3);
              doc.rect(15, yPos, pageWidth - 30, 25, 'S');
              
              doc.setFontSize(9);
              doc.setFont('helvetica', 'bold');
              doc.text('Conditions de paiement', 20, yPos + 6);
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8);
              const paymentInfo = order.paymentMethod === 'stripe' ? 'Paiement par carte bancaire effectue' :
                                 order.paymentMethod === 'cheque' ? 'Paiement par cheque a reception du bon de commande' :
                                 'Paiement par virement a reception du bon de commande';
              doc.text(paymentInfo, 20, yPos + 12);
              doc.text('Delai de fabrication: 3 a 4 semaines apres validation du paiement', 20, yPos + 17);
              doc.text('Installation sous 5 jours ouvres apres fabrication', 20, yPos + 21);
              
              // Add footer to last page
              addFooter(pageNum);
              
              doc.save(`bon_commande_${order.id.slice(0, 8)}.pdf`);
            }}
            className="flex-1 min-w-[180px] bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Confirmation
          </button>
          {order.status !== 'cancelled' && (
            <button 
              onClick={() => downloadInvoice(order)}
              className="flex-1 min-w-[180px] bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
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
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold hover:shadow-xl transition-all">
              🏠 Retour à l'accueil
            </button>
          </Link>
          <Link 
            href={`/contact?email=${encodeURIComponent(order.customerEmail)}&orderId=${encodeURIComponent(order.id)}`} 
            className="flex-1"
          >
            <button className="w-full bg-white border-2 border-blue-600 text-blue-600 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all">
              💬 Contacter le support
            </button>
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Une confirmation a été envoyée à <strong>{order.customerEmail}</strong>
        </p>
        </div>
      </div>
    </div>
  );
}
