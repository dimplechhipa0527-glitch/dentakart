import React from 'react';
import { X, Download, Printer, ShieldCheck, Share2, MessageCircle } from 'lucide-react';
import { Order } from '../../types';
import { generateInvoicePDF } from '../../services/invoicePdf';

interface Props {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<Props> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const invNum = order.invoice?.invoiceNumber || `INV-2026-${order.orderNumber}`;
  const invDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const ship = order.shippingAddress || {};

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    generateInvoicePDF(order);
  };

  const handleShareWhatsApp = () => {
    const itemList = (order.items || [])
      .map((it, idx) => `${idx + 1}. ${it.productName} (Qty: ${it.quantity}) - ₹${it.total?.toLocaleString('en-IN')}`)
      .join('\n');

    const msg = `*🧾 DentaKart B2B GST Tax Invoice*\n` +
      `*Invoice #:* ${invNum}\n` +
      `*Date:* ${invDate}\n` +
      `*Clinic:* ${ship.clinicName || 'Dental Clinic'}\n` +
      `*Doctor:* ${ship.name || 'Doctor'}\n` +
      `*Buyer GSTIN:* ${ship.gstNumber || 'Unregistered'}\n` +
      `*Payment:* ${order.paymentMethod} (${order.paymentStatus})\n` +
      `*Grand Total:* ₹${order.totalAmount?.toLocaleString('en-IN')} (Incl. GST)\n\n` +
      `*Items:*\n${itemList}\n\n` +
      `_DentaKart B2B Hyperlocal Dental Marketplace_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Actions Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850 no-print flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">B2B GST Tax Invoice</span>
            <span className="text-[10px] sm:text-xs bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono font-bold px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
              {invNum}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Direct WhatsApp Share Button */}
            <button
              onClick={handleShareWhatsApp}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
              title="Send invoice breakdown via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Send WhatsApp</span>
            </button>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPdf}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Print Invoice"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable View */}
        <div id="invoice-print-section" className="p-3.5 sm:p-6 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-teal-600 pb-3 gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🦷</span>
                <span className="text-xl font-black text-slate-900 dark:text-white font-display">
                  DENTA<span className="text-teal-600">KART</span>
                </span>
                <span className="text-[9px] font-black uppercase bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-1 py-0.2 rounded border border-teal-200">
                  B2B
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                India's Premier Dental Supplies Marketplace & Express Hub
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Seller GSTIN: <strong className="text-slate-900 dark:text-white">27AABCD1234F1Z5</strong> | State: 27
              </p>
            </div>

            <div className="sm:text-right bg-slate-50 dark:bg-slate-800/50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                TAX INVOICE
              </span>
              <p className="text-xs font-mono font-bold text-teal-600 mt-0.5">{invNum}</p>
              <p className="text-[11px] text-slate-500">Date: {invDate}</p>
              <p className="text-[11px] text-slate-500">Order: #{order.orderNumber}</p>
            </div>
          </div>

          {/* Parties Info (Stacked for Mobile Clarity) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {/* Buyer Clinic Details */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Buyer Clinic Details
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-xs">{ship.clinicName || 'Dental Clinic'}</p>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{ship.name || 'Doctor'}</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">{ship.addressLine1}</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">{ship.city}, {ship.state} - {ship.pincode}</p>
              <p className="text-teal-700 dark:text-teal-300 font-mono font-bold text-[11px] pt-1">
                Buyer GSTIN: {ship.gstNumber || 'Unregistered / B2C'}
              </p>
            </div>

            {/* Payment & Dispatch Info */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Payment & Dispatch
              </span>
              <p className="text-slate-900 dark:text-white text-xs font-semibold">
                Payment: <strong className="font-bold">{order.paymentMethod}</strong>
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-xs">
                Status: <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-[10px]">{order.paymentStatus}</span>
              </p>
              {order.transactionId && (
                <p className="text-slate-500 font-mono text-[10px]">Txn ID: {order.transactionId}</p>
              )}
              <p className="text-slate-500 text-[11px]">
                Place of Supply: {ship.state || 'Dadra & Nagar Haveli'}
              </p>
              <p className="text-teal-700 dark:text-teal-300 text-[10px] font-semibold pt-1">
                ⚡ 15-20 Min Express Hub Dispatch
              </p>
            </div>
          </div>

          {/* Mobile Items Cards (Crystal Clear on Small Phone Screens) */}
          <div className="block sm:hidden space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Ordered Supplies ({order.items.length})
            </span>
            {order.items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                      {item.productName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      HSN: 90184900 • SKU: {item.sku || 'IE-DENTAL'}
                    </p>
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white font-mono shrink-0">
                    ₹{item.total?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <span>Qty: <strong className="text-slate-900 dark:text-white">{item.quantity}</strong> × ₹{item.price?.toLocaleString('en-IN')}</span>
                  <span className="text-teal-600 font-bold bg-teal-50 dark:bg-teal-950 px-1.5 py-0.2 rounded text-[10px]">
                    GST {item.gstPercent || 12}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-y border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                  <th className="py-2 px-2.5">#</th>
                  <th className="py-2 px-2.5">Item Description</th>
                  <th className="py-2 px-2.5">HSN</th>
                  <th className="py-2 px-2.5 text-center">Qty</th>
                  <th className="py-2 px-2.5 text-right">Rate (₹)</th>
                  <th className="py-2 px-2.5 text-center">GST</th>
                  <th className="py-2 px-2.5 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {order.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-2 px-2.5 text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-2.5">
                      <p className="font-bold text-slate-900 dark:text-white">{item.productName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>
                    </td>
                    <td className="py-2 px-2.5 font-mono text-slate-500">90184900</td>
                    <td className="py-2 px-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="py-2 px-2.5 text-right font-mono">₹{item.price?.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-2.5 text-center font-semibold text-teal-600">{item.gstPercent || 12}%</td>
                    <td className="py-2 px-2.5 text-right font-mono font-bold">₹{item.total?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Box */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-80 space-y-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal (Excl. Tax):</span>
                <span className="font-mono">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="font-mono">- ₹{order.discountAmount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST Tax (CGST + SGST):</span>
                <span className="font-mono">₹{order.gstAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>15-Min Express Delivery:</span>
                <span className="font-mono text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t-2 border-teal-600 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-teal-700 dark:text-teal-400 font-mono text-base">
                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Footer in Modal */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400">
              • Eligible for 100% B2B Input Tax Credit (ITC) under Section 16 of CGST Act.
            </p>
            <button
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share Invoice on WhatsApp</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
