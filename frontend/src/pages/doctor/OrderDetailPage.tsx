import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Package,
  FileText,
  Truck,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import { Order } from '../../types';
import { OrderTracker } from '../../components/doctor/OrderTracker';
import { InvoiceModal } from '../../components/doctor/InvoiceModal';
import { useCart } from '../../context/CartContext';

export const OrderDetailPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchOrderDetail = async () => {
    if (!orderNumber) return;
    setLoading(true);
    try {
      const res = await api.get(`/orders/detail/${orderNumber}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading order timeline & tracking...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Order Not Found</h2>
        <Link to="/orders" className="text-teal-600 font-bold text-xs hover:underline">
          Return to Orders List
        </Link>
      </div>
    );
  }

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await api.post(`/orders/${order.id}/cancel`, { reason: cancelReason });
      if (res.data.success) {
        alert('Order cancelled successfully.');
        setIsCancelModalOpen(false);
        fetchOrderDetail();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    for (const item of order.items) {
      await addToCart(item.productId, item.quantity);
    }
    navigate('/cart');
  };

  const ship = order.shippingAddress || {};
  const canCancel = ['PLACED', 'CONFIRMED', 'PROCESSING'].includes(order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white font-display">
                Order #{order.orderNumber}
              </h1>
              <span className="text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                ● {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Download Invoice PDF</span>
          </button>
          <button
            onClick={handleReorder}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reorder Items</span>
          </button>
        </div>
      </div>

      {/* Live Visual Tracker */}
      <OrderTracker order={order} />

      {/* Grid: Items & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Order Items ({order.items.length})</h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xl shrink-0">
                      📦
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.brand}</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.productName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">SKU: {item.sku} • GST: {item.gstPercent || 12}%</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      ₹{item.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status History Logs */}
          {order.statusLogs && order.statusLogs.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Status Timeline Audit Log</h3>
              <div className="space-y-3">
                {order.statusLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{log.status}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{log.note || 'Status updated.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Payment & Delivery Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Bill Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Price Details</h3>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Items Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Discount ({order.couponCode})</span>
                <span>- ₹{order.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>GST Tax (ITC Eligible)</span>
              <span>₹{order.gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Shipping Fee</span>
              <span className="text-emerald-600 font-bold">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-slate-900 dark:text-white">
              <span>Total Paid</span>
              <span className="text-teal-600">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Delivery Destination</h3>
            <p className="font-bold text-slate-800 dark:text-slate-200">{ship.clinicName || 'Dental Clinic'}</p>
            <p className="text-slate-600 dark:text-slate-400">{ship.name}</p>
            <p className="text-slate-500">{ship.addressLine1}</p>
            <p className="text-slate-500">{ship.city}, {ship.state} - {ship.pincode}</p>
            {ship.gstNumber && <p className="font-mono text-teal-700 font-bold mt-1">GSTIN: {ship.gstNumber}</p>}
          </div>

          {/* Cancel Order Action */}
          {canCancel && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="w-full py-2.5 rounded-2xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Cancel Order #{order.orderNumber}</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to cancel this order? Any payment will be refunded immediately and items restocked.
            </p>
            <textarea
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (e.g. Changed clinic procurement requirement)"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs outline-none resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
