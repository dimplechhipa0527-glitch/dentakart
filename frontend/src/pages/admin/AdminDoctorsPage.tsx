import React, { useState, useEffect } from 'react';
import { Users, User, Search, ShieldCheck, ShieldAlert, Eye, Ban, Check, MapPin, IndianRupee, Phone, Mail } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import api from '../../services/api';

export const AdminDoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/doctors${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [search]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await api.put(`/doctors/${id}/status`, { status: newStatus });
      fetchDoctors();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update doctor status');
    }
  };

  const handleViewDoctor = async (id: string) => {
    try {
      const res = await api.get(`/doctors/${id}`);
      if (res.data.success) {
        setSelectedDoctor(res.data.doctor);
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminHeader
        title="Doctor Directory"
        subtitle="Manage verified dental surgeon buyer accounts, GST council credentials, purchase history, and clinic addresses"
      />

      <div className="p-3.5 sm:p-6 space-y-4">
        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor, clinic, email, phone..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-teal-500 shadow-xs"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold px-1">
            Registered: <strong className="text-slate-800 dark:text-slate-200">{doctors.length}</strong> Doctors
          </span>
        </div>

        {/* 1. Mobile Card View (< md) */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold">Loading doctor accounts...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-4">
              <p className="text-xs font-semibold">No doctors found.</p>
            </div>
          ) : (
            doctors.map((doc) => {
              const isActive = doc.status === 'ACTIVE';

              return (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 font-bold flex items-center justify-center border border-teal-200/50 dark:border-teal-800/50 shrink-0">
                        <User size={14} className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {doc.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {doc.clinicName}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      ● {doc.status}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Contact</span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 truncate">{doc.email}</p>
                      {doc.phone && (
                        <a href={`tel:${doc.phone}`} className="text-[11px] text-teal-600 font-bold block">
                          📞 {doc.phone}
                        </a>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Purchases</span>
                      <p className="font-black text-slate-900 dark:text-white text-sm font-mono">
                        ₹{doc.totalSpent.toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {doc.orderCount} {doc.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => handleViewDoctor(doc.id)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(doc.id, doc.status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                        isActive
                          ? 'bg-red-50 dark:bg-red-950/60 hover:bg-red-100 text-red-600'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isActive ? 'Block' : 'Unblock'}
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
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">Clinic Details</th>
                  <th className="py-3 px-4">Contact & GSTIN</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4">Lifetime Purchase</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">Loading doctor accounts...</td>
                  </tr>
                ) : doctors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">No doctors found.</td>
                  </tr>
                ) : (
                  doctors.map((doc) => {
                    const isActive = doc.status === 'ACTIVE';

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 flex items-center justify-center">
                              <User size={13} className="w-3.5 h-3.5 text-teal-600" />
                            </span>
                            <span>{doc.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{doc.clinicName}</p>
                          <span className="text-[10px] text-slate-400">{doc.regNumber ? `Reg: ${doc.regNumber}` : 'Council Reg Verified'}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-slate-700 dark:text-slate-300 block">{doc.email}</span>
                          <span className="text-[10px] font-mono text-teal-700 font-bold">
                            {doc.gstNumber ? `GST: ${doc.gstNumber}` : 'No GST Registered'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white">
                          {doc.orderCount}
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white font-mono">
                          ₹{doc.totalSpent.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1 ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                            }`}
                          >
                            ● {doc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleViewDoctor(doc.id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition"
                            title="View Clinic Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(doc.id, doc.status)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                              isActive
                                ? 'bg-red-50 hover:bg-red-100 text-red-600'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {isActive ? 'Block Doctor' : 'Unblock Doctor'}
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

      {/* Doctor Detail Modal */}
      {isDetailModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl p-4 sm:p-6 space-y-4 border border-slate-200 dark:border-slate-800 max-h-[88vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{selectedDoctor.name}</h3>
                <p className="text-xs text-teal-600 font-semibold">{selectedDoctor.doctorProfile?.clinicName}</p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Email</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{selectedDoctor.email}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Phone</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedDoctor.phone || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Clinic GSTIN</span>
                <p className="font-mono font-bold text-teal-600">{selectedDoctor.doctorProfile?.gstNumber || 'Unregistered'}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Total Purchases</span>
                <p className="font-black text-slate-900 dark:text-white font-mono">₹{selectedDoctor.doctorProfile?.totalSpent?.toLocaleString('en-IN') || 0}</p>
              </div>
            </div>

            {/* Past Orders History */}
            <div className="space-y-2 pt-1">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Past Orders ({selectedDoctor.orders?.length || 0})</h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs max-h-48 overflow-y-auto">
                {selectedDoctor.orders?.length === 0 ? (
                  <p className="py-4 text-center text-slate-400 text-xs">No orders placed yet.</p>
                ) : (
                  selectedDoctor.orders?.map((ord: any) => (
                    <div key={ord.id} className="py-2.5 flex justify-between items-center gap-2">
                      <div>
                        <span className="font-mono font-bold text-teal-600">#{ord.orderNumber}</span>
                        <span className="text-[10px] text-slate-400 block">{ord.items?.length || 1} items</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-emerald-600 block">{ord.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
