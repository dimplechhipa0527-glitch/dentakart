import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  MapPin,
  Building2,
  User,
  Mail,
  Truck,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  QrCode,
  DollarSign
} from 'lucide-react';
import { Order } from '../../types';
import api from '../../services/api';

interface Props {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenInvoice?: (order: Order) => void;
}

export const AdminOrderDetailModal: React.FC<Props> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
  onOpenInvoice
}) => {
  const [status, setStatus] = useState<string>(order?.status || 'PROCESSING');
  const [courierName, setCourierName] = useState<string>(order?.courierName || 'Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = useState<string>(order?.trackingNumber || '');
  const [note, setNote] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>(order?.paymentStatus || 'SUCCESS');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Sync state when order changes
  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
      setCourierName(order.courierName || 'Blue Dart Express');
      setTrackingNumber(order.trackingNumber || '');
      setPaymentStatus(order.paymentStatus || 'SUCCESS');
      setSuccessMsg('');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const shipping = order.shippingAddress || {};
  const billing = order.billingAddress || shipping;
  const doctorName = shipping.name || order.user?.name || 'Dr. Doctor';
  const clinicName = shipping.clinicName || order.user?.doctorProfile?.clinicName || 'Dental Care Clinic';
  const phone = shipping.phone || order.user?.phone || '+91 9876543210';
  const email = order.user?.email || 'doctor@clinic.com';
  const gstNumber = shipping.gstNumber || billing.gstNumber || order.user?.doctorProfile?.gstNumber;
  const regNumber = order.user?.doctorProfile?.regNumber || 'DCI-REG-VALID';

  // Construct WhatsApp Link
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const internationalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.slice(-10)}`;
  const whatsappMessage = encodeURIComponent(
    `Hello ${doctorName},\n\nThis is regarding your DentaKart order #${order.orderNumber} for ${clinicName}.\nStatus: ${status}\nTotal Amount: ₹${order.totalAmount.toLocaleString('en-IN')}\n${
      trackingNumber ? `Tracking (${courierName}): ${trackingNumber}\n` : ''
    }\nThank you for partnering with DentaKart!`
  );
  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${whatsappMessage}`;

  const statuses = [
    { value: 'PLACED', label: 'Placed', color: 'bg-amber-100 text-amber-800' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'PROCESSING', label: 'Processing / Packed', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'SHIPPED', label: 'Shipped / In Transit', color: 'bg-purple-100 text-purple-800' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'DELIVERED', label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-rose-100 text-rose-800' },
    { value: 'RETURNED', label: 'Returned', color: 'bg-slate-100 text-slate-800' }
  ];

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/orders/admin/${order.id}/status`, {
        status,
        courierName: courierName.trim() || undefined,
        trackingNumber: trackingNumber.trim() || undefined,
        note: note.trim() || undefined,
        paymentStatus
      });

      setSuccessMsg(`Order #${order.orderNumber} updated to ${status}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order');
    } finally {
      setSubmitting(false);
    }
  };

  const printPackingSlip = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DentaKart - Packing Slip #${order.orderNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1e293b; font-size: 13px; line-height: 1.4; }
          .header { border-bottom: 2px solid #0d9488; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; }
          .logo { font-size: 22px; font-weight: 900; color: #0f766e; }
          .badge { background: #f0fdfa; color: #0d9488; border: 1px solid #99f6e4; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
          .section { margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th { background: #f8fafc; text-align: left; padding: 8px; border-bottom: 2px solid #e2e8f0; font-size: 11px; }
          td { padding: 8px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
          .total { text-align: right; font-weight: 800; font-size: 14px; margin-top: 12px; }
          .footer { margin-top: 24px; text-align: center; color: #64748b; font-size: 11px; border-top: 1px dashed #cbd5e1; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">🦷 DENTAKART DISPATCH SLIP</div>
            <div style="font-size: 11px; color: #64748b;">B2B Dental Supply Logistics Hub</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 900; font-size: 16px;">Order #${order.orderNumber}</div>
            <div style="color: #64748b;">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            <span class="badge">${order.shippingAddress?.expressDelivery ? '⚡ 15-MIN LIGHTNING DISPATCH' : 'STANDARD COURIER'}</span>
          </div>
        </div>

        <div class="grid" style="margin-top: 16px;">
          <div class="section">
            <strong style="color: #0f766e;">🏥 SHIP TO (DOCTOR / CLINIC)</strong>
            <div style="font-size: 14px; font-weight: bold; margin-top: 4px;">${doctorName}</div>
            <div style="font-weight: 600; color: #334155;">${clinicName}</div>
            <div style="margin-top: 4px;">${shipping.addressLine1 || 'Clinic Address'}${shipping.addressLine2 ? `, ${shipping.addressLine2}` : ''}</div>
            <div>${shipping.city || 'City'}, ${shipping.state || 'State'} - <strong>${shipping.pincode || 'Pincode'}</strong></div>
            <div style="margin-top: 6px;"><strong>Phone:</strong> ${phone} | <strong>Reg:</strong> ${regNumber}</div>
            ${gstNumber ? `<div><strong>GSTIN:</strong> ${gstNumber}</div>` : ''}
            ${shipping.deliveryInstructions ? `<div style="margin-top: 6px; background: #fffbeb; padding: 4px 8px; border-radius: 4px; font-size: 11px; color: #b45309;"><strong>Delivery Note:</strong> ${shipping.deliveryInstructions}</div>` : ''}
          </div>

          <div class="section">
            <strong style="color: #0f766e;">🚚 DISPATCH & COURIER DETAILS</strong>
            <div style="margin-top: 6px;"><strong>Courier:</strong> ${courierName || 'Blue Dart Express'}</div>
            <div><strong>AWB / Tracking:</strong> ${trackingNumber || 'PENDING DISPATCH'}</div>
            <div><strong>Payment Method:</strong> ${order.paymentMethod} (${order.paymentStatus})</div>
            <div><strong>Order Value:</strong> ₹${order.totalAmount.toLocaleString('en-IN')}</div>
            <div style="margin-top: 8px; border-top: 1px dashed #cbd5e1; padding-top: 6px; font-size: 11px; color: #64748b;">
              Packed by: Warehouse Station A-4<br/>
              Cold-chain check: Verified (Gel packs applied if required)
            </div>
          </div>
        </div>

        <div class="section" style="margin-top: 16px;">
          <strong style="color: #0f766e;">📦 ORDERED DENTAL SUPPLIES & ITEMS</strong>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product Description</th>
                <th>Brand / SKU</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Rate (₹)</th>
                <th style="text-align: right;">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${(order.items || [])
                .map(
                  (item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${item.productName}</strong></td>
                  <td>${item.brand || 'DentaKart'} • <span style="font-family: monospace;">${item.sku || 'SKU'}</span></td>
                  <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
                  <td style="text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
                  <td style="text-align: right; font-weight: bold;">₹${item.total.toLocaleString('en-IN')}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="total">
            Total Payable / Paid: ₹${order.totalAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div class="footer">
          Thank you for ordering with DentaKart India • Helpline: +91 8000-DENTIST • Support: support@dentakart.com
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-teal-600/10 text-teal-600 flex items-center justify-center font-bold shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
                  ORDER #{order.orderNumber}
                </h2>
                <span
                  className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    statuses.find((s) => s.value === order.status)?.color || 'bg-slate-100 text-slate-800'
                  }`}
                >
                  ● {order.status.replace(/_/g, ' ')}
                </span>
                {shipping.expressDelivery && (
                  <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" /> 15-MIN
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={printPackingSlip}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1 shadow-2xs"
              title="Print Packing Slip"
            >
              <Printer className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Slip</span>
            </button>

            {onOpenInvoice && (
              <button
                onClick={() => onOpenInvoice(order)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/80 hover:bg-teal-100 text-teal-700 dark:text-teal-300 text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                title="View GST Tax Invoice"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Invoice</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Top 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Doctor & Clinic Contact */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <span className="text-[11px] font-black uppercase text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Doctor & Clinic Buyer
                </span>
                <span className="text-[10px] font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300">
                  {regNumber}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  {doctorName}
                </h4>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-teal-600" /> {clinicName}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3 text-slate-400" /> {email}
                </p>
                {gstNumber && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">
                    GSTIN: {gstNumber}
                  </p>
                )}
              </div>

              {/* Direct Actions: Call & WhatsApp */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                <a
                  href={`tel:${phone}`}
                  className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-center flex items-center justify-center gap-1 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>Call {phone}</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1 transition shadow-xs shadow-emerald-600/20"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 2. Delivery & Clinic Address */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <span className="text-[11px] font-black uppercase text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Shipping Address
                </span>
                <span className="text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 px-2 py-0.5 rounded-full">
                  PIN: {shipping.pincode || '400053'}
                </span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  {shipping.addressLine1 || 'Clinic Door / Floor'}
                </p>
                {shipping.addressLine2 && <p>{shipping.addressLine2}</p>}
                <p>
                  {shipping.city || 'City'}, {shipping.state || 'State'} - {shipping.pincode || ''}
                </p>
                {shipping.landmark && (
                  <p className="text-[11px] text-slate-500">
                    <strong className="text-slate-700 dark:text-slate-400">Landmark:</strong> {shipping.landmark}
                  </p>
                )}
              </div>

              {shipping.deliveryInstructions && (
                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
                  <strong>Instructions:</strong> {shipping.deliveryInstructions}
                </div>
              )}
            </div>

            {/* 3. Payment & Grand Total Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <span className="text-[11px] font-black uppercase text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> Payment Details
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  {order.paymentStatus}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST (CGST+SGST):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{order.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({order.couponCode || 'PROMO'}):</span>
                    <span className="font-semibold">-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping & Delivery:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
                  </span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">Net Amount:</span>
                  <span className="font-black text-teal-600 text-base">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Method: <strong className="text-slate-700 dark:text-slate-300">{order.paymentMethod}</strong>
                  {order.transactionId && <span className="font-mono text-[10px] block text-slate-400">Ref: {order.transactionId}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-600" />
                Ordered Dental Supplies ({order.items?.length || 0} items)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                All prices inclusive of B2B Volume Pricing
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-slate-800 text-slate-500 font-bold text-[11px]">
                    <th className="py-2.5 px-4">Item Details</th>
                    <th className="py-2.5 px-4">Brand & SKU</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Doctor Price</th>
                    <th className="py-2.5 px-4 text-right">GST %</th>
                    <th className="py-2.5 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(order.items || []).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                            {item.productImages && item.productImages[0] ? (
                              <img
                                src={item.productImages[0]}
                                alt={item.productName}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {item.productName}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              HSN: 90184900
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {item.brand || 'DentaKart'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{item.sku}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-black bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.mrp > item.price && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            ₹{item.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-600 dark:text-slate-400">
                        {item.gstPercent}%
                      </td>
                      <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                        ₹{item.total.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fulfillment & Dispatch Form for Seller */}
          <div className="bg-teal-50/50 dark:bg-slate-800/70 border border-teal-200/80 dark:border-teal-900/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-teal-200/50 dark:border-teal-800/50 pb-2.5">
              <span className="text-xs font-black uppercase text-teal-800 dark:text-teal-300 flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-600" /> Dispatch & Logistics Fulfillment Controls
              </span>
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                Updates trigger automated SMS / WhatsApp / App notification to doctor
              </span>
            </div>

            <form onSubmit={handleUpdateStatus} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Order Status */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Fulfillment Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-teal-500 font-bold"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Courier Partner */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Courier Partner</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                >
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="DTDC Medical Cargo">DTDC Medical Cargo</option>
                  <option value="Shadowfax Courier">Shadowfax Courier</option>
                  <option value="DentaKart 15-Min Rider">DentaKart 15-Min Rider</option>
                </select>
              </div>

              {/* AWB Tracking */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">AWB Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUEDART-8839201"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-teal-500 font-mono font-bold"
                />
              </div>

              {/* Payment Status */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-teal-500 font-semibold"
                >
                  <option value="SUCCESS">SUCCESS (Verified Paid)</option>
                  <option value="PENDING">PENDING (Awaiting clearance)</option>
                  <option value="REFUNDED">REFUNDED (Returned)</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>

              {/* Dispatch Note */}
              <div className="md:col-span-3 space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Dispatch Note / Message for Doctor
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Package dispatched from Central Hub. Stored in temperature-controlled casing."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                />
              </div>

              {/* Save Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-2.5 px-4 rounded-xl shadow-md shadow-teal-600/20 transition disabled:opacity-50 text-xs"
                >
                  {submitting ? 'Saving...' : 'Save & Update Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>DentaKart B2B Verified Medical Dispatch</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
