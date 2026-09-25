import React, { useState, useEffect } from 'react';
import { ShieldCheck, Building, User, MapPin, Award, Check, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const DoctorProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [clinicName, setClinicName] = useState(user?.doctorProfile?.clinicName || '');
  const [gstNumber, setGstNumber] = useState(user?.doctorProfile?.gstNumber || '');
  const [regNumber, setRegNumber] = useState(user?.doctorProfile?.regNumber || '');
  const [clinicAddress, setClinicAddress] = useState(user?.doctorProfile?.addressLine || '');
  const [city, setCity] = useState(user?.doctorProfile?.city || '');
  const [state, setState] = useState(user?.doctorProfile?.state || '');
  const [pincode, setPincode] = useState(user?.doctorProfile?.pincode || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setClinicName(user.doctorProfile?.clinicName || '');
      setGstNumber(user.doctorProfile?.gstNumber || '');
      setRegNumber(user.doctorProfile?.regNumber || '');
      setClinicAddress(user.doctorProfile?.addressLine || '');
      setCity(user.doctorProfile?.city || '');
      setState(user.doctorProfile?.state || '');
      setPincode(user.doctorProfile?.pincode || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        clinicName,
        gstNumber,
        regNumber,
        clinicAddress,
        city,
        state,
        pincode
      });

      if (res.data.success) {
        alert('Clinic profile and GST details updated successfully!');
        await refreshProfile();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
          Doctor Profile & Clinic GST Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Maintain your clinic details for automated B2B GST tax invoice generation and delivery routing
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Doctor Personal Details */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Doctor Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Doctor Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Rahul Sharma"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Mobile / Clinic WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98201 12345"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Registered Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Dental Council Registration #</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. DCI-MUM-84920"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Clinic & GST Details */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Clinic & GST Billing Information</h3>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              ITC Eligible
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Dental Clinic / Hospital Name *</label>
              <input
                type="text"
                required
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="e.g. Smile Dental Clinic & Implant Center"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Clinic GSTIN (15-digit GST Number)
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 27AABCU9603R1ZM"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono uppercase tracking-wider outline-none focus:border-teal-500 font-bold"
              />
              <p className="text-[11px] text-slate-400">
                Ensure GSTIN matches your registered dental clinic name to claim Input Tax Credit on your GSTR-2B.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping & Clinic Address */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <MapPin className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Default Clinic Delivery Address</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Clinic Street Address</label>
              <input
                type="text"
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                placeholder="Shop 4-5, Crystal Plaza, Link Road, Andheri West"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Maharashtra"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="400053"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-600/30 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Clinic Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
