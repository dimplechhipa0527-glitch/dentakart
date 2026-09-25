import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Zap, UserCheck, Stethoscope } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Login failed. Please verify your doctor email and password.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDoctorDemo = async (role: 'DOCTOR_RAHUL' | 'DOCTOR_NEHA') => {
    await switchDemoUser(role);
    navigate('/doctor/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-teal-600/30">
            🦷
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-display">
            Denta<span className="text-teal-600">Kart</span>
          </span>
        </Link>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Doctor & Clinic Sign In</h2>
        <p className="text-xs text-slate-500">Access your clinic orders, 15-min express delivery, and B2B GST tax invoices</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Registered Doctor / Clinic Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. dr.rahul@smileclinic.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
                <span className="text-[11px] text-teal-600 font-semibold cursor-pointer hover:underline">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In as Doctor'}
            </button>
          </form>

          {/* Quick 1-Click Doctor Demo Logins */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              ⚡ 1-Click Demo Doctor Sign In
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDoctorDemo('DOCTOR_RAHUL')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-left border border-slate-200 dark:border-slate-700 text-xs font-semibold transition"
              >
                <span className="block font-bold text-slate-900 dark:text-white">👨⚕️ Dr. Rahul</span>
                <span className="text-[10px] text-teal-600">Smile Dental Clinic</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDoctorDemo('DOCTOR_NEHA')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-left border border-slate-200 dark:border-slate-700 text-xs font-semibold transition"
              >
                <span className="block font-bold text-slate-900 dark:text-white">👩⚕️ Dr. Neha</span>
                <span className="text-[10px] text-teal-600">OrthoCare Clinic</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2 space-y-2">
            <div>
              New clinic or dental hospital?{' '}
              <Link to="/register" className="text-teal-600 font-bold hover:underline">
                Register Clinic Account
              </Link>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link to="/admin/login" className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                🏢 Are you a Seller / Operations Admin? <span className="text-teal-600 font-semibold underline">Seller Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
