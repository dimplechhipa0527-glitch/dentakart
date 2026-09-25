import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, ShieldCheck, User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterDoctorPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !clinicName) {
      setError('Please fill all mandatory fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await register({
        name,
        email,
        password,
        phone,
        clinicName,
        gstNumber: gstNumber ? gstNumber.toUpperCase() : undefined,
        regNumber,
        clinicAddress,
        city,
        state,
        pincode
      });

      if (res.success) {
        navigate('/doctor/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating clinic account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-teal-600/30">
            🦷
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-display">
            Denta<span className="text-teal-600">Kart</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Doctor & Clinic Registration</h2>
        <p className="text-xs text-slate-500">Join 1,200+ verified dental practices procuring supplies with GST Input Tax Credit</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Amit Patel (BDS)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Dental Clinic Name *</label>
                <input
                  type="text"
                  required
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Apex Dental Clinic & Implant Hub"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@apexclinic.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 99090 98765"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Clinic GSTIN (Optional)</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  placeholder="24AACCA1234F1ZX"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 font-mono uppercase outline-none focus:border-teal-500 font-bold"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Clinic Delivery Address</label>
                <input
                  type="text"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  placeholder="302, Titanium City Centre, Satellite"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ahmedabad"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="380015"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating Clinic Account...' : 'Complete Doctor Registration'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already have a doctor account?{' '}
            <Link to="/login" className="text-teal-600 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
