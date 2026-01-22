import { Order } from '@/types/order';
import jsPDF from 'jspdf';

export function downloadInvoice(order: Order) {
  if (!order) return;

  const isProForma = order.status !== 'shipped' && order.status !== 'delivered';
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
  doc.text('Tel: 01 85 09 34 46', 20, yPos + 22);
  doc.text('Email: commandes@storal.fr', 20, yPos + 27);

  // Invoice type badge
  yPos += 35;
  const invoiceType = isProForma ? 'FACTURE PRO FORMA' : 'FACTURE';
  if (isProForma) {
    doc.setFillColor(255, 193, 7);
  } else {
    doc.setFillColor(76, 175, 80);
  }
  doc.rect(pageWidth - 80, yPos - 5, 60, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(invoiceType, pageWidth - 50, yPos, { align: 'center' });

  // Invoice details
  yPos += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Facture N°: ${order.id.slice(0, 12)}`, 20, yPos);
  yPos += 7;
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, 20, yPos);

  // Bill to
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('FACTURÉ À:', 20, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(order.customerName, 20, yPos);
  yPos += 6;
  doc.text(order.deliveryAddress, 20, yPos);
  yPos += 6;
  doc.text(`${order.deliveryPostalCode} ${order.deliveryCity}`, 20, yPos);
  yPos += 6;
  doc.text(order.deliveryCountry, 20, yPos);

  // Items table
  yPos += 15;
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(0.5);
  
  // Table header
  doc.setFillColor(230, 240, 250);
  doc.rect(20, yPos - 5, pageWidth - 40, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Description', 25, yPos);
  doc.text('Quantité', 120, yPos);
  doc.text('P.U.', 145, yPos);
  doc.text('Montant', pageWidth - 25, yPos, { align: 'right' });
  
  yPos += 10;
  doc.line(20, yPos - 2, pageWidth - 20, yPos - 2);

  // Items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  let subtotal = 0;

  order.items?.forEach((item: any) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    const itemTotal = Number(item.totalPrice);
    subtotal += itemTotal;

    doc.text(item.productName, 25, yPos);
    doc.text(String(item.quantity), 120, yPos);
    doc.text(`${(itemTotal / item.quantity).toFixed(2)}€`, 145, yPos);
    doc.text(`${itemTotal.toFixed(2)}€`, pageWidth - 25, yPos, { align: 'right' });
    
    yPos += 6;
  });

  // Summary
  yPos += 5;
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Sous-total:', 120, yPos);
  doc.text(`${subtotal.toFixed(2)}€`, pageWidth - 25, yPos, { align: 'right' });
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL TTC:', 120, yPos);
  doc.setTextColor(0, 102, 204);
  doc.text(`${order.totalAmount.toFixed(2)}€`, pageWidth - 25, yPos, { align: 'right' });

  // Client notes (comment)
  try {
    const parsed = order.notes ? JSON.parse(order.notes) : null;
    const comment = parsed?.comment?.trim?.();
    if (comment) {
      yPos += 12;
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Notes client', 20, yPos);
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(comment, pageWidth - 40);
      lines.forEach((line: string) => {
        if (yPos > 280) { doc.addPage(); yPos = 20; }
        doc.text(line, 20, yPos);
        yPos += 5;
      });
    }
  } catch {}

  // Notes
  if (isProForma) {
    yPos += 15;
    doc.setTextColor(200, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text('Facture pro forma - Cette facture est établie avant le paiement.', pageWidth / 2, yPos, { align: 'center' });
  }

  // Footer
  yPos = 270;
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Merci pour votre achat!', pageWidth / 2, yPos, { align: 'center' });

  // Save
  const fileName = isProForma 
    ? `facture_proforma_${order.id.slice(0, 8)}.pdf`
    : `facture_${order.id.slice(0, 8)}.pdf`;
  
  doc.save(fileName);
}
