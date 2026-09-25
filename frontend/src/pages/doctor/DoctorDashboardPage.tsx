import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Heart,
  IndianRupee,
  Package,
  FileText,
  Truck,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ChevronRight,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../services/api';
import { Order, Product } from '../../types';
import { InvoiceModal } from '../../components/doctor/InvoiceModal';

export const DoctorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, switchDemoUser, logout } = useAuth();
  const { addToCart } = useCart();
  const { wishlist } = useWishlist();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/my-orders?limit=10');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.warn('Orders fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, user?.id]);

  // Real calculations (0 for new users!)
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) =>
    ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.status)
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 pb-20 overflow-x-hidden">
      
      {/* Welcome Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-4 sm:p-7 shadow-lg border border-teal-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
              {isAuthenticated ? 'VERIFIED CLINIC ACCOUNT' : 'NEW CLINIC ONBOARDING'}
            </span>
            {user?.doctorProfile?.gstNumber && (
              <span className="text-[10px] text-teal-200 font-mono">GSTIN: {user.doctorProfile.gstNumber}</span>
            )}
          </div>
          <h1 className="text-lg sm:text-2xl font-black font-display tracking-tight">
            {isAuthenticated ? `Welcome, ${user?.name}` : 'Welcome to DentaKart B2B'}
          </h1>
          <p className="text-xs text-slate-300">
            {isAuthenticated
              ? `${user?.doctorProfile?.clinicName || 'Dental Clinic'} • Silvassa Express Hub`
              : 'Direct B2B Procurement with 15-20 Min Express Clinic Restock'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/products"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <span>Restock Supplies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3 py-2 rounded-xl border border-white/20 transition"
            >
              GST Details
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
            >
              Doctor Login
            </Link>
          )}
        </div>
      </div>

      {/* 5 KPI Metric Cards (Real 0 for New Users) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
        {/* Orders */}
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{totalOrders}</p>
          <span className="text-[9px] sm:text-[10px] text-slate-400">Lifetime Placed</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 shadow-xs">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">{pendingOrders}</p>
          <span className="text-[9px] sm:text-[10px] text-slate-400">In Transit</span>
        </div>

        {/* Delivered */}
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Delivered</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{deliveredOrders}</p>
          <span className="text-[9px] sm:text-[10px] text-slate-400">Fulfilled</span>
        </div>

        {/* Wishlist */}
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 shadow-xs">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Wishlist</span>
            <Heart className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">{wishlist.length}</p>
          <span className="text-[9px] sm:text-[10px] text-slate-400">Saved Items</span>
        </div>

        {/* Total Spent */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-teal-200 dark:border-teal-800 space-y-0.5 shadow-xs">
          <div className="flex items-center justify-between text-teal-700 dark:text-teal-300">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Total Spent</span>
            <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-teal-800 dark:text-teal-200 font-mono">
            ₹{totalSpent.toLocaleString('en-IN')}
          </p>
          <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold">100% Tax Deductible</span>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Recent Clinic Orders</h3>
          </div>
          {orders.length > 0 && (
            <Link to="/orders" className="text-xs font-bold text-teal-600 hover:underline">
              View All Orders →
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="py-10 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center mx-auto text-xl">
              📦
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Orders Placed Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-0.5">
                Your clinic order history is currently empty. Start browsing our 52+ dental composites, rotary files, and supplies to place your first order.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
            >
              <span>Explore Dental Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-3 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.items?.length || 1} items • ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedInvoiceOrder(order);
                      setIsInvoiceOpen(true);
                    }}
                    className="px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Tax Invoice</span>
                  </button>
                  <Link
                    to={`/orders/${order.id}`}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-200 transition"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demo Account Switcher / Reset Controls */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            Account & Demo Testing Controls
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Switch between a clean new user state or preview Dr. Rahul Sharma with 24 pre-seeded orders.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Empty / Sign Out (Clean New User)</span>
            </button>
          ) : (
            <button
              onClick={async () => {
                await switchDemoUser('DOCTOR_RAHUL');
              }}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Load Demo Account (Dr. Rahul)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tax Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={isInvoiceOpen}
        onClose={() => {
          setIsInvoiceOpen(false);
          setSelectedInvoiceOrder(null);
        }}
      />
    </div>
  );
};
