import React from 'react';
import { X, Download, Printer, ShieldCheck } from 'lucide-react';
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    generateInvoicePDF(order);
  };

  const ship = order.shippingAddress || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Top Actions */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">B2B GST Tax Invoice</span>
            <span className="text-xs bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono font-bold px-2 py-0.5 rounded">
              {invNum}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable View */}
        <div id="invoice-print-section" className="p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 bg-white">
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-teal-600 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦷</span>
                <span className="text-2xl font-black text-slate-900 font-display">
                  DENTA<span className="text-teal-600">KART</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                India's B2B Dental Supplies Marketplace & Distribution Hub
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Seller GSTIN: <strong className="text-slate-800">27AABCD1234F1Z5</strong> | PAN: AABCD1234F
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900">TAX INVOICE</span>
              <p className="text-xs font-mono font-bold text-teal-600 mt-0.5">{invNum}</p>
              <p className="text-xs text-slate-500">Date: {invDate}</p>
              <p className="text-xs text-slate-500">Order: #{order.orderNumber}</p>
            </div>
          </div>

          {/* Parties Info */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Buyer Clinic Details</span>
              <p className="font-bold text-slate-900 text-sm">{ship.clinicName || 'Smile Dental Clinic'}</p>
              <p className="text-slate-700 font-semibold">{ship.name || 'Dr. Rahul Sharma'}</p>
              <p className="text-slate-600">{ship.addressLine1}</p>
              <p className="text-slate-600">{ship.city}, {ship.state} - {ship.pincode}</p>
              <p className="text-slate-600 font-mono font-bold mt-1 text-teal-800">
                Buyer GSTIN: {ship.gstNumber || 'Unregistered Doctor'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment & Dispatch Info</span>
              <p className="font-bold text-slate-900 text-sm">Payment Mode: {order.paymentMethod}</p>
              <p className="text-slate-700">Status: <strong className="text-emerald-600 font-bold">{order.paymentStatus}</strong></p>
              {order.transactionId && <p className="text-slate-600 font-mono">Txn ID: {order.transactionId}</p>}
              <p className="text-slate-600 font-mono">Place of Supply: {ship.state || 'Maharashtra'} (State Code 27)</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-300 font-bold text-slate-800">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-2.5 px-3 text-center">GST %</th>
                  <th className="py-2.5 px-3 text-right">Taxable Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      <span className="text-[10px] text-slate-500 font-mono">SKU: {item.sku} | Brand: {item.brand}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">90184900</td>
                    <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-center font-semibold text-teal-700">{item.gstPercent || 12}%</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">₹{item.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end pt-3">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. Tax):</span>
                <span className="font-mono">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({order.couponCode}):</span>
                  <span className="font-mono">- ₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST Tax (CGST + SGST):</span>
                <span className="font-mono">₹{order.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping & Handling:</span>
                <span className="font-mono">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="pt-2 border-t-2 border-teal-600 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="text-teal-700 font-mono text-base">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-400 space-y-1">
            <p>• Goods once sold can be returned within 7 days in original sterile packaging according to DentaKart B2B terms.</p>
            <p>• This invoice is electronically generated and eligible for Full Input Tax Credit (ITC) under Section 16 of CGST Act.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
