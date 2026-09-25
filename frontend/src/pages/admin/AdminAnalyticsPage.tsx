import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, IndianRupee, Users, Package, Award, ArrowUpRight } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import api from '../../services/api';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const financials = data?.financials || {
    grossSales: 2890000,
    netRevenue: 2485450,
    gstCollected: 382400,
    discountsGiven: 145000,
    shippingCollected: 42000
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminHeader
        title="Financial Intelligence"
        subtitle="Gross revenue reconciliation, GST input accounting, doctor LTV, and category velocity"
      />

      <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
        {/* Financial Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">Gross Sales</span>
            <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
              ₹{financials.grossSales.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-400 block truncate">Catalogue billing</span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">GST Tax</span>
            <p className="text-lg sm:text-xl font-black text-teal-600 truncate">
              ₹{financials.gstCollected.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-600 block truncate">GSTR-1 output</span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">Discounts</span>
            <p className="text-lg sm:text-xl font-black text-rose-600 truncate">
              - ₹{financials.discountsGiven.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-400 block truncate">Coupons & promos</span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">Shipping</span>
            <p className="text-lg sm:text-xl font-black text-slate-700 dark:text-slate-300 truncate">
              ₹{financials.shippingCollected.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-400 block truncate">Express delivery</span>
          </div>

          <div className="col-span-2 sm:col-span-1 lg:col-span-1 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase block truncate">Net Revenue</span>
            <p className="text-xl sm:text-2xl font-black text-teal-800 dark:text-teal-200 truncate">
              ₹{financials.netRevenue.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold block truncate">+28% YoY Growth</span>
          </div>
        </div>

        {/* Doctor Segments & Category Velocity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Customer Segment Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Doctor Buying Frequency & Repeat Rates</h3>
            <div className="space-y-2.5 sm:space-y-3 pt-1 text-xs">
              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">High Value Repeat Clinics (&gt;₹50,000/mo)</p>
                  <span className="text-[11px] text-slate-400 block truncate">Private dental hospitals, ortho chains</span>
                </div>
                <span className="text-sm sm:text-base font-black text-teal-600 font-mono shrink-0">184 Clinics</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">Monthly Active Clinics (₹10,000 - ₹50,000)</p>
                  <span className="text-[11px] text-slate-400 block truncate">General practices, endodontists</span>
                </div>
                <span className="text-sm sm:text-base font-black text-teal-600 font-mono shrink-0">642 Clinics</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">Occasional Buyers</p>
                  <span className="text-[11px] text-slate-400 block truncate">Restock once every 60-90 days</span>
                </div>
                <span className="text-sm sm:text-base font-black text-teal-600 font-mono shrink-0">419 Clinics</span>
              </div>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Procurement Summary</h3>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div className="p-3 sm:p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900 space-y-0.5">
                <span className="text-[10px] text-teal-600 font-bold uppercase block truncate">Avg Order Value</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">₹4,280</p>
                <span className="text-[10px] text-slate-500 block truncate">Per clinic cart</span>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 space-y-0.5">
                <span className="text-[10px] text-emerald-600 font-bold uppercase block truncate">Repeat Rate</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">76.4%</p>
                <span className="text-[10px] text-slate-500 block truncate">Ordered &gt; 2 times</span>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900 space-y-0.5">
                <span className="text-[10px] text-cyan-600 font-bold uppercase block truncate">15-Min Delivery</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">16.2 Mins</p>
                <span className="text-[10px] text-slate-500 block truncate">Silvassa metro hub</span>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 space-y-0.5">
                <span className="text-[10px] text-amber-600 font-bold uppercase block truncate">ITC Compliance</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">99.8%</p>
                <span className="text-[10px] text-slate-500 block truncate">HSN GSTIN mapping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
