import React, { useState } from 'react';
import { Building2, User, Save, RotateCcw, CheckCircle, ShieldCheck, MapPin, Phone, Mail, FileText, Sparkles, Truck } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useCompany } from '../../context/CompanyContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useCompany();

  const [form, setForm] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset company and owner details to initial defaults?')) {
      resetSettings();
      setForm({
        companyName: 'Integrity Enterprises',
        ownerName: 'Krishna',
        platformName: 'DentaKart',
        phone: '+91 93168 39711',
        email: 'orders@dentakart.com',
        gstin: '27AABCD1234F1Z5',
        addressLine: 'Silvassa Main Market, Naroli Road',
        city: 'Silvassa',
        state: 'Dadra & Nagar Haveli',
        pincode: '396230',
        dispatchHubName: 'Silvassa Central Express Logistics Hub',
        packedByTag: 'Warehouse Station A-4'
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 pb-20">
      <AdminHeader
        title="Company & Owner Settings"
        subtitle="Manage business entity name, owner/proprietor, GSTIN, and dispatch slip header details"
      />

      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-6 space-y-6">

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 flex items-center gap-3 animate-in fade-in duration-200 shadow-md">
            <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">Settings Updated Successfully!</p>
              <p className="text-[11px] opacity-90">All dispatch slips, GST tax invoices, store headers, and packing documents will now reflect these updated company and owner details.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Settings Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Business Entity & Owner Profile</h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                Live Dynamic
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Company & Owner Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Company / Business Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Krishna Dental Supplies"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 font-semibold text-slate-900 dark:text-white transition"
                  />
                  <span className="text-[10px] text-slate-500">Prints as the primary seller business on dispatch slips and invoices.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>Owner / Proprietor Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="ownerName"
                    value={form.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. Krishna"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 font-semibold text-slate-900 dark:text-white transition"
                  />
                  <span className="text-[10px] text-slate-500">Authorized owner signatory shown on packing documents.</span>
                </div>
              </div>

              {/* Platform Brand & GSTIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Platform / Marketplace Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="platformName"
                    value={form.platformName}
                    onChange={handleChange}
                    placeholder="DentaKart"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 font-semibold text-slate-900 dark:text-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Seller GSTIN</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="gstin"
                    value={form.gstin}
                    onChange={handleChange}
                    placeholder="e.g. 27AABCD1234F1Z5"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 font-mono font-bold text-slate-900 dark:text-white transition"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>Support WhatsApp / Phone</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 93168 39711"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 text-slate-900 dark:text-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>Official Order Desk Email</span>
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="orders@dentakart.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 text-slate-900 dark:text-white transition"
                  />
                </div>
              </div>

              {/* Hub & Packing Station */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Dispatch Hub / Facility Title</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="dispatchHubName"
                    value={form.dispatchHubName}
                    onChange={handleChange}
                    placeholder="Silvassa Central Express Logistics Hub"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 text-slate-900 dark:text-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Packed By Tagline</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="packedByTag"
                    value={form.packedByTag}
                    onChange={handleChange}
                    placeholder="Warehouse Station A-4"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 text-slate-900 dark:text-white transition"
                  />
                </div>
              </div>

              {/* Warehouse Address */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>Warehouse Address Line</span>
                </label>
                <input
                  type="text"
                  required
                  name="addressLine"
                  value={form.addressLine}
                  onChange={handleChange}
                  placeholder="Silvassa Main Market, Naroli Road"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 text-slate-900 dark:text-white transition"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">City</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">State</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Pincode</label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-teal-600/30 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Business Details</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Slip & Invoice Preview */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Live Slip Preview</span>
                <span className="text-[10px] text-slate-400">Updates Instantly</span>
              </div>

              {/* Mini Dispatch Slip Visual */}
              <div className="bg-white text-slate-800 rounded-2xl p-4 shadow-sm space-y-3 font-sans text-[11px] border border-slate-200">
                <div className="border-b-2 border-teal-600 pb-2 flex justify-between items-start">
                  <div>
                    <p className="font-black text-teal-800 text-xs tracking-tight">🦷 {form.platformName.toUpperCase()} DISPATCH SLIP</p>
                    <p className="text-[10px] text-slate-500">{form.dispatchHubName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded border border-teal-200">EXPRESS</span>
                  </div>
                </div>

                {/* Company & Owner Box */}
                <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/80 space-y-0.5">
                  <p className="text-[9px] font-bold text-teal-700 uppercase tracking-wider">Dispatched By (Seller)</p>
                  <p className="font-black text-slate-900 text-xs">{form.companyName}</p>
                  <p className="text-[10px] text-slate-700 font-semibold">Proprietor / Owner: <span className="text-teal-900 font-bold">{form.ownerName}</span></p>
                  <p className="text-[10px] text-slate-500">{form.addressLine}, {form.city}</p>
                  <p className="text-[9px] text-slate-600 font-mono">GSTIN: {form.gstin} | Ph: {form.phone}</p>
                </div>

                {/* Dispatch Note */}
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600 space-y-0.5">
                  <p><strong>Packed By:</strong> {form.packedByTag}</p>
                  <p><strong>Authorized Signatory:</strong> {form.ownerName}</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                💡 <strong>Where this appears:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[10px] text-slate-400">
                  <li>Packing / Dispatch Slips (printed for couriers)</li>
                  <li>Doctor GST Input Invoices & Downloadable PDFs</li>
                  <li>Storefront top header & footer legal ownership</li>
                  <li>Order tracking & clinic restock receipts</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
