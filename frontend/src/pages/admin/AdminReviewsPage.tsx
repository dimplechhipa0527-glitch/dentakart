import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, MessageSquare } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import api from '../../services/api';
import { Review } from '../../types';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/admin/all');
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id: string, isApproved: boolean) => {
    try {
      await api.put(`/reviews/admin/${id}/moderate`, { isApproved });
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update review moderation');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="DOCTOR REVIEWS & CLINICAL RATINGS"
        subtitle="Moderate doctor evaluations, verify clinical feedback, and approve high-trust dental ratings"
      />

      <div className="p-6 space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-4">Doctor & Clinic</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Rating & Review</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">Loading reviews...</td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">No doctor reviews posted yet.</td>
                  </tr>
                ) : (
                  reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{rev.doctorName}</p>
                        <span className="text-[11px] text-teal-600">{rev.clinicName || 'Smile Dental Clinic'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                          {rev.product?.name || 'Dental Product'}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">SKU: {rev.product?.sku}</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-0.5 text-amber-500 mb-1">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {rev.title && <p className="font-bold text-slate-900 dark:text-white">{rev.title}</p>}
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{rev.comment}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            rev.isApproved
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {rev.isApproved ? '● Published' : '● Hidden'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleModerate(rev.id, !rev.isApproved)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                        >
                          {rev.isApproved ? 'Hide' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="p-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
