import jsPDF from 'jspdf';
import { Order } from '../types';

export const generateInvoicePDF = (order: Order) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = '#0d9488';
  const darkColor = '#0f172a';
  const grayColor = '#64748b';

  // Header Banner
  doc.setFillColor(13, 148, 136); // Teal
  doc.rect(0, 0, 210, 24, 'F');

  // Company Name / Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('DENTAKART', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('India\'s B2B Dental Supplies Marketplace | GSTIN: 27AABCD1234F1Z5', 60, 15);

  // Invoice Title & Info
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 14, 36);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);

  const invNum = order.invoice?.invoiceNumber || `INV-2026-${order.orderNumber}`;
  const invDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  doc.text(`Invoice Number: ${invNum}`, 14, 43);
  doc.text(`Invoice Date: ${invDate}`, 14, 48);
  doc.text(`Order Number: #${order.orderNumber}`, 14, 53);
  doc.text(`Payment Mode: ${order.paymentMethod} (${order.paymentStatus})`, 14, 58);
  if (order.transactionId) {
    doc.text(`Transaction ID: ${order.transactionId}`, 14, 63);
  }

  // Clinic Details Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(110, 30, 86, 38, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('BILLED & SHIPPED TO:', 115, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const ship = order.shippingAddress || {};
  doc.text(ship.clinicName || 'Dental Clinic', 115, 42);
  doc.text(ship.name || 'Doctor', 115, 47);
  doc.text(ship.addressLine1 || '', 115, 52);
  doc.text(`${ship.city || ''}, ${ship.state || ''} - ${ship.pincode || ''}`, 115, 57);
  if (ship.gstNumber) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Buyer GSTIN: ${ship.gstNumber}`, 115, 63);
  }

  // Table Header
  let y = 75;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  doc.text('#', 16, y + 5.5);
  doc.text('Item Description & SKU', 24, y + 5.5);
  doc.text('HSN', 105, y + 5.5);
  doc.text('Qty', 125, y + 5.5);
  doc.text('Rate (₹)', 142, y + 5.5);
  doc.text('GST %', 162, y + 5.5);
  doc.text('Total (₹)', 180, y + 5.5);

  y += 11;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  order.items.forEach((item, index) => {
    doc.text(`${index + 1}`, 16, y);
    
    // Shorten product name if too long
    const name = item.productName.length > 45 ? item.productName.substring(0, 42) + '...' : item.productName;
    doc.text(name, 24, y);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`SKU: ${item.sku || 'N/A'} | ${item.brand}`, 24, y + 3.5);
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    doc.text('90184900', 105, y);
    doc.text(`${item.quantity}`, 127, y);
    doc.text(`${item.price.toLocaleString('en-IN')}`, 142, y);
    doc.text(`${item.gstPercent || 12}%`, 164, y);
    doc.text(`${item.total.toLocaleString('en-IN')}`, 180, y);

    y += 9;
  });

  // Divider line
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y + 2, 196, y + 2);
  y += 8;

  // Summary Table on Bottom Right
  const sumX = 120;
  doc.setFontSize(8.5);
  doc.text('Subtotal:', sumX, y);
  doc.text(`₹${order.subtotal.toLocaleString('en-IN')}`, 180, y);
  y += 5;

  if (order.discountAmount > 0) {
    doc.text(`Discount (${order.couponCode || 'Promo'}):`, sumX, y);
    doc.text(`- ₹${order.discountAmount.toLocaleString('en-IN')}`, 180, y);
    y += 5;
  }

  doc.text('GST Tax (CGST + SGST / IGST):', sumX, y);
  doc.text(`₹${order.gstAmount.toLocaleString('en-IN')}`, 180, y);
  y += 5;

  doc.text('Shipping & Handling:', sumX, y);
  doc.text(order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`, 180, y);
  y += 6;

  // Final Total Box
  doc.setFillColor(13, 148, 136);
  doc.rect(sumX - 4, y - 4, 80, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL AMOUNT:', sumX, y + 2);
  doc.text(`₹${order.totalAmount.toLocaleString('en-IN')}`, 175, y + 2);

  // Footer notes
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('• This is a computer-generated tax invoice for dental supplies procurement and does not require a physical signature.', 14, 270);
  doc.text('• All dental instruments and medical materials are subject to standard manufacturer warranty and return policies.', 14, 274);
  doc.text('• For support or GST input credit reconciliation, contact support@dentakart.com or call +91 1800-DENTAKART.', 14, 278);

  // Save the PDF
  doc.save(`${invNum}.pdf`);
};
