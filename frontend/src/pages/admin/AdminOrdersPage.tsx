import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Truck, FileText, CheckCircle2, AlertCircle, Eye, Phone, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminOrderDetailModal } from '../../components/admin/AdminOrderDetailModal';
import { InvoiceModal } from '../../components/doctor/InvoiceModal';
import api from '../../services/api';
import { Order } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await api.get(`/orders/admin/all?${params.toString()}`);
      if (res.data.success) {
        setOrders(res.data.orders);
        if (selectedOrder) {
          const updated = res.data.orders.find((o: Order) => o.id === selectedOrder.id);
          if (updated) setSelectedOrder(updated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminHeader
        title="Order Fulfillment"
        subtitle="Process clinic orders, dispatch shipments with Blue Dart/Delhivery, and manage GST invoices"
      />

      <div className="p-3.5 sm:p-6 space-y-4">
        {/* Filter Bar & Search */}
        <div className="space-y-2.5">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, doctor, clinic, phone, AWB..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-teal-500 shadow-xs"
            />
          </div>

          {/* Horizontally scrollable status filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
            {['ALL', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                  statusFilter === st
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Mobile Card View (< md) */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold">Loading orders pipeline...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-4">
              <p className="text-xs font-semibold">No orders found matching this filter.</p>
            </div>
          ) : (
            orders.map((order) => {
              const isDelivered = order.status === 'DELIVERED';
              const isShipped = order.status === 'SHIPPED';
              const shipping = order.shippingAddress || {};
              const doctorName = shipping.name || order.user?.name || 'Dr. Doctor';
              const clinicName = shipping.clinicName || order.user?.doctorProfile?.clinicName || 'Dental Clinic';
              const rawPhone = shipping.phone || order.user?.phone || '9876543210';
              const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
              const city = shipping.city || 'Mumbai';
              const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello Dr. ${doctorName}, regarding your DentaKart order #${order.orderNumber} for ${clinicName}:`)}`;

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-3 shadow-xs"
                >
                  {/* Top Bar: Order #, Date, Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-teal-600 text-sm">
                          #{order.orderNumber}
                        </span>
                        {shipping.expressDelivery && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> 15-MIN
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0 ${
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

                  {/* Doctor & Clinic */}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {doctorName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {clinicName} • {city}
                    </p>
                  </div>

                  {/* 1-Tap Quick Connect (Call & WhatsApp) */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>Call</span>
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs shadow-emerald-600/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Order Financials & Courier */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        {order.items?.length || 1} {(order.items?.length || 1) === 1 ? 'item' : 'items'}
                      </span>
                      <span className="font-black text-slate-900 dark:text-white text-base">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        {order.paymentMethod}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Tracking info if dispatched */}
                  {order.trackingNumber && (
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Truck className="w-3.5 h-3.5 text-teal-600" />
                        <span>{order.courierName}</span>
                      </div>
                      <span className="font-mono font-bold text-teal-600">
                        {order.trackingNumber}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedInvoiceOrder(order);
                        setIsInvoiceOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span>Invoice</span>
                    </button>
                    <button
                      onClick={() => handleOpenDetail(order)}
                      className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-md shadow-teal-600/20 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. Desktop Full Table View (>= md) */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Doctor & Clinic</th>
                  <th className="py-3 px-4">Phone & City</th>
                  <th className="py-3 px-4">Items & Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Logistics / AWB</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Loading orders pipeline...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No orders found matching this filter.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const isDelivered = order.status === 'DELIVERED';
                    const isShipped = order.status === 'SHIPPED';
                    const shipping = order.shippingAddress || {};
                    const doctorName = shipping.name || order.user?.name || 'Dr. Doctor';
                    const clinicName = shipping.clinicName || order.user?.doctorProfile?.clinicName || 'Dental Clinic';
                    const phone = shipping.phone || order.user?.phone || '+91 9876543210';
                    const city = shipping.city || 'Mumbai';

                    return (
                      <tr
                        key={order.id}
                        onClick={() => handleOpenDetail(order)}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-teal-600">
                          #{order.orderNumber}
                          <span className="text-[10px] text-slate-400 block font-normal font-sans">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 dark:text-white">{doctorName}</p>
                          <span className="text-[11px] text-slate-500 font-medium block">{clinicName}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{phone}</span>
                          <span className="text-[10px] text-slate-400">{city} {shipping.pincode ? `(${shipping.pincode})` : ''}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-black text-slate-900 dark:text-white block text-sm">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-teal-600 font-bold">
                            {order.items?.length || 1} {(order.items?.length || 1) === 1 ? 'item' : 'items'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{order.paymentMethod}</span>
                          <span className="text-[10px] text-emerald-600 font-semibold">{order.paymentStatus}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {order.trackingNumber ? (
                            <div>
                              <span className="text-slate-500 text-[10px] block">{order.courierName}</span>
                              <span className="font-mono font-bold text-teal-600 text-[11px]">{order.trackingNumber}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Not Dispatched</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1 ${
                              isDelivered
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : isShipped
                                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            ● {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedInvoiceOrder(order);
                              setIsInvoiceOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition inline-flex items-center gap-1"
                            title="Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-teal-600" />
                            <span>Invoice</span>
                          </button>
                          <button
                            onClick={() => handleOpenDetail(order)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition inline-flex items-center gap-1 shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Comprehensive Order Detail & Dispatch Modal */}
      <AdminOrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSuccess={fetchOrders}
        onOpenInvoice={(order) => {
          setSelectedInvoiceOrder(order);
          setIsInvoiceOpen(true);
        }}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};
