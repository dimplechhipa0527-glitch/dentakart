import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, ChevronRight, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { Order } from '../../types';
import { InvoiceModal } from '../../components/doctor/InvoiceModal';
import { useCart } from '../../context/CartContext';

export const OrderHistoryPage: React.FC = () => {
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const url = statusFilter === 'ALL' ? '/orders/my-orders' : `/orders/my-orders?status=${statusFilter}`;
        const res = await api.get(url);
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
            My Dental Clinic Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track live dispatch, download GST input invoices, and manage repeat supplies
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
          {['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading clinic orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Package className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No orders found in this status</h3>
          <p className="text-xs text-slate-400">Start restocking dental composites, gloves, and rotary files.</p>
          <Link
            to="/products"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Browse Dental Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isDelivered = order.status === 'DELIVERED';
            const isShipped = order.status === 'SHIPPED';
            const isProcessing = order.status === 'PROCESSING';

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 hover:shadow-lg transition"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-teal-600">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      Placde on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isDelivered
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : isShipped
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      ● {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedInvoiceOrder(order);
                        setIsInvoiceOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold inline-flex items-center gap-1.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span>Download Tax Invoice</span>
                    </button>
                    <Link
                      to={`/orders/${order.orderNumber}`}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold inline-flex items-center gap-1 transition"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3 text-xs"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-teal-600 shrink-0">
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{item.productName}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity} • ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Total & Address */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-teal-600" />
                    <span>Deliver to: <strong>{order.shippingAddress?.clinicName || 'Clinic'}</strong> ({order.shippingAddress?.city || 'City'})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>Payment: <strong className="text-slate-800 dark:text-slate-200 font-bold">{order.paymentMethod}</strong></span>
                    <span className="text-slate-900 dark:text-white font-black text-sm">
                      Total: ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};
