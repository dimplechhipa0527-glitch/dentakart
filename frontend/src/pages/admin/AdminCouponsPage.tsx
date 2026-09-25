import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { CouponModal } from '../../components/admin/CouponModal';
import api from '../../services/api';
import { Coupon } from '../../types';

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons/admin/all');
      if (res.data.success) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Delete coupon code "${code}"?`)) return;
    try {
      await api.delete(`/coupons/admin/${id}`);
      fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminHeader
        title="Coupons & Promos"
        subtitle="Configure B2B discount vouchers, minimum order thresholds, and expiry limits"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Coupon</span>
            <span className="sm:hidden">Create</span>
          </button>
        }
      />

      <div className="p-3.5 sm:p-6 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading promo coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 px-4">
            <p className="text-xs font-semibold">No coupons configured yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs sm:text-sm bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-xl border border-teal-200 dark:border-teal-800">
                    🏷️ {coupon.code}
                  </span>
                  <button
                    onClick={() => handleDelete(coupon.id, coupon.code)}
                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {coupon.description || 'Special clinic discount coupon'}
                </p>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Discount:</span>
                    <span className="font-bold text-emerald-600">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min Order:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹{coupon.minOrderValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Times Used:</span>
                    <span className="font-mono font-bold text-teal-600">{coupon.usageCount} times</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCoupons}
      />
    </div>
  );
};
