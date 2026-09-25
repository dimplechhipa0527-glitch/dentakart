import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, ShieldAlert, Eye, Ban, Check, MapPin, IndianRupee } from 'lucide-react';
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
    <div className="space-y-6">
      <AdminHeader
        title="DOCTOR & CLINIC MANAGEMENT"
        subtitle="Manage verified dental surgeon buyer accounts, GST council credentials, purchase history, and clinic addresses"
      />

      <div className="p-6 space-y-4">
        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor name, clinic, email, or mobile..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-teal-500 shadow-xs"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">Registered Doctors: {doctors.length}</span>
        </div>

        {/* Doctors Table Matching Spec #12 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
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
                            <span className="w-7 h-7 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs">
                              👨⚕️
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedDoctor.name}</h3>
                <p className="text-xs text-teal-600 font-semibold">{selectedDoctor.doctorProfile?.clinicName}</p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Email</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedDoctor.email}</p>
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
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Past Orders ({selectedDoctor.orders?.length || 0})</h4>
              <div className="divide-y text-xs max-h-40 overflow-y-auto">
                {selectedDoctor.orders?.map((ord: any) => (
                  <div key={ord.id} className="py-2 flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-teal-600">#{ord.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 block">{ord.items?.length || 1} items</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 dark:text-white">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-emerald-600 block">{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
