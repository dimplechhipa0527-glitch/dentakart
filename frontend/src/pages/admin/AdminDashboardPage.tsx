import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  ShoppingCart,
  Clock,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Boxes,
  Plus,
  Tag,
  Star,
  Layers
} from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import api from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/dashboard');
        if (res.data.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const kpis = analytics?.kpis || {
    doctors: 1245,
    products: 2850,
    orders: 8542,
    pendingOrders: 84,
    revenue: 2485450,
    lowStock: 32
  };

  const financials = analytics?.financials || {
    grossSales: 2890000,
    netRevenue: 2485450,
    gstCollected: 382400,
    discountsGiven: 145000,
    shippingCollected: 42000
  };

  const salesTrends = analytics?.salesTrends || [
    { period: 'Mon', sales: 185000, orders: 42 },
    { period: 'Tue', sales: 324000, orders: 78 },
    { period: 'Wed', sales: 248000, orders: 55 },
    { period: 'Thu', sales: 412000, orders: 94 },
    { period: 'Fri', sales: 589000, orders: 120 },
    { period: 'Sat', sales: 367000, orders: 81 },
    { period: 'Sun', sales: 192000, orders: 40 }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminHeader
        title="Admin Operations"
        subtitle="Real-time B2B marketplace metrics, inventory controls, order pipeline, and doctor analytics"
        actionButton={
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/admin/products"
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-2.5 py-2 sm:px-3.5 sm:py-2 rounded-xl shadow-md shadow-teal-600/20 transition flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Link>
            <Link
              to="/admin/orders"
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold px-2.5 py-2 sm:px-3.5 sm:py-2 rounded-xl transition shrink-0"
            >
              <span className="hidden sm:inline">Fulfill ({kpis.pendingOrders})</span>
              <span className="sm:hidden">Orders ({kpis.pendingOrders})</span>
            </Link>
          </div>
        }
      />

      <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
        {/* Top 6 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {/* Doctors */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Doctors</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {kpis.doctors.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 truncate">
              <TrendingUp className="w-3 h-3 shrink-0" /> +18 this week
            </span>
          </div>

          {/* Products */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Products</span>
              <Package className="w-4 h-4 text-cyan-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {kpis.products.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-400 block truncate">Active SKUs</span>
          </div>

          {/* Orders */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Orders</span>
              <ShoppingCart className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {kpis.orders.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-400 block truncate">Processed</span>
          </div>

          {/* Pending Orders */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20 space-y-0.5 sm:space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-amber-600">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
              {kpis.pendingOrders}
            </p>
            <span className="text-[10px] text-amber-600 font-bold block truncate">Needs Dispatch</span>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 p-3 sm:p-4 rounded-2xl border border-teal-200 dark:border-teal-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-teal-700 dark:text-teal-300">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Revenue</span>
              <IndianRupee className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-lg sm:text-xl font-black text-teal-800 dark:text-teal-200 truncate">
              ₹{kpis.revenue.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold block truncate">Net Realized</span>
          </div>

          {/* Low Stock */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/20 space-y-0.5 sm:space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-rose-600">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
              {kpis.lowStock}
            </p>
            <Link to="/admin/inventory?status=LOW_STOCK" className="text-[10px] text-rose-600 font-bold hover:underline block truncate">
              Restock Now ➔
            </Link>
          </div>
        </div>

        {/* Sales Chart & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Weekly B2B Clinic Sales Trends</h3>
                <p className="text-xs text-slate-500">Gross revenue generated across dental categories</p>
              </div>
              <span className="text-xs font-black text-teal-600 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-xl self-start sm:self-auto">
                +24.8% vs Last Week
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-44 sm:h-48 flex items-end justify-between gap-1.5 sm:gap-3 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
              {salesTrends.map((t: any) => {
                const heightPercent = Math.max(20, Math.round((t.sales / 600000) * 100));
                return (
                  <div key={t.period} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 group min-w-[32px]">
                    <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 group-hover:text-teal-600 transition">
                      ₹{Math.round(t.sales / 1000)}k
                    </div>
                    <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden h-28 sm:h-36 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-xl transition-all duration-500 group-hover:from-emerald-500 group-hover:to-teal-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400">{t.period}</span>
                  </div>
                );
              })}
            </div>

            {/* Financial Breakdown Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-slate-400 text-[10px] block font-bold">GROSS SALES</span>
                <p className="font-bold text-slate-900 dark:text-white truncate">₹{financials.grossSales.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-slate-400 text-[10px] block font-bold">GST COLLECTED</span>
                <p className="font-bold text-slate-900 dark:text-white truncate">₹{financials.gstCollected.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-slate-400 text-[10px] block font-bold">DISCOUNTS GIVEN</span>
                <p className="font-bold text-emerald-600 truncate">- ₹{financials.discountsGiven.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2.5 sm:p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl">
                <span className="text-teal-700 dark:text-teal-300 text-[10px] block font-bold">NET REVENUE</span>
                <p className="font-bold text-teal-700 dark:text-teal-300 truncate">₹{financials.netRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Category Share Distribution */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Category Sales Volume</h3>
            <p className="text-xs text-slate-500">Specialty product distribution</p>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Dental Materials</span>
                  <span className="text-teal-600">38%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: '38%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Endodontics (Files/GP)</span>
                  <span className="text-cyan-600">24%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-600 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Infection Control</span>
                  <span className="text-emerald-600">18%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Instruments & Scalers</span>
                  <span className="text-amber-600">12%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Orthodontics</span>
                  <span className="text-indigo-600">8%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Doctors & Top Selling Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Top Doctors by Spending */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Top Spending Doctors</h3>
              <Link to="/admin/doctors" className="text-xs font-bold text-teal-600 hover:underline">
                View All ➔
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {(analytics?.topDoctors || [
                { id: '1', name: 'Dr. Rahul Sharma', clinicName: 'Smile Dental Clinic', orderCount: 24, totalSpent: 85450 },
                { id: '2', name: 'Dr. Neha Verma', clinicName: 'OrthoCare Specialty Clinic', orderCount: 11, totalSpent: 42300 },
                { id: '3', name: 'Dr. Amit Patel', clinicName: 'Apex Dental Hub', orderCount: 5, totalSpent: 19800 }
              ]).map((doc: any, idx: number) => (
                <div key={doc.id} className="py-2.5 sm:py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-xs shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{doc.name}</p>
                      <span className="text-[11px] text-slate-500 block truncate">{doc.clinicName} • {doc.orderCount} orders</span>
                    </div>
                  </div>
                  <span className="font-black text-teal-600 font-mono shrink-0">
                    ₹{doc.totalSpent.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Dental Products */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Top Selling Dental Supplies</h3>
              <Link to="/admin/products" className="text-xs font-bold text-teal-600 hover:underline">
                Catalog ➔
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {[
                { name: '3M Filtek Z350 XT Composite', brand: '3M ESPE', qty: 142, revenue: 262700 },
                { name: 'Karam Nitrile Medical Gloves Box of 100', brand: 'Karam', qty: 310, revenue: 139500 },
                { name: 'Dentsply ProTaper Gold Rotary Files 25mm', brand: 'Dentsply', qty: 88, revenue: 233200 },
                { name: 'Woodpecker UDS-J Ultrasonic Scaler', brand: 'Woodpecker', qty: 22, revenue: 150700 }
              ].map((prod, idx) => (
                <div key={idx} className="py-2.5 sm:py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{prod.name}</p>
                      <span className="text-[11px] text-slate-500 block truncate">{prod.brand} • {prod.qty} Sold</span>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white font-mono shrink-0">
                    ₹{prod.revenue.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
