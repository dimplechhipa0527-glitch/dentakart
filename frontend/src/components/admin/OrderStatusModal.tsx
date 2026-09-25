import React, { useState } from 'react';
import { X, Truck, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Order } from '../../types';
import api from '../../services/api';

interface Props {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OrderStatusModal: React.FC<Props> = ({ order, isOpen, onClose, onSuccess }) => {
  const [status, setStatus] = useState<string>(order?.status || 'PROCESSING');
  const [courierName, setCourierName] = useState<string>(order?.courierName || 'Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = useState<string>(order?.trackingNumber || '');
  const [note, setNote] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>(order?.paymentStatus || 'SUCCESS');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const statuses = [
    { value: 'PLACED', label: 'Placed (Pending Verification)' },
    { value: 'CONFIRMED', label: 'Confirmed (Payment Verified)' },
    { value: 'PROCESSING', label: 'Processing (Packed at Hub)' },
    { value: 'SHIPPED', label: 'Shipped (In Transit)' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery (Rider Dispatched)' },
    { value: 'DELIVERED', label: 'Delivered (Handed Over to Clinic)' },
    { value: 'CANCELLED', label: 'Cancelled (Restock & Refund)' },
    { value: 'RETURNED', label: 'Returned (Refund Completed)' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
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

      alert(`Order #${order.orderNumber} status updated to ${status}!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Fulfill & Update Order</h3>
            <p className="text-xs text-slate-500 font-mono">Order #{order.orderNumber} • ₹{order.totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Order Status */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Fulfillment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 font-bold"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Courier & Tracking */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Courier Partner</label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
              >
                <option value="Blue Dart Express">Blue Dart Express</option>
                <option value="Delhivery Surface">Delhivery Surface</option>
                <option value="DTDC Medical Cargo">DTDC Medical Cargo</option>
                <option value="DentaKart 15-Min Rider">DentaKart 15-Min Rider</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">AWB / Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. BLUEDART-882947192"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          {/* Payment Status */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 outline-none focus:border-teal-500"
            >
              <option value="SUCCESS">SUCCESS (Paid)</option>
              <option value="PENDING">PENDING (Awaiting clearance)</option>
              <option value="REFUNDED">REFUNDED (Returned/Cancelled)</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          {/* Internal Note */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Status Change Note / Message to Doctor</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Dispatched from Mumbai central cold-chain warehouse."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-teal-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md shadow-teal-600/20 transition disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Save & Notify Doctor'}
          </button>
        </form>
      </div>
    </div>
  );
};
