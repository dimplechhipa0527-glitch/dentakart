import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Building2, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@dentakart.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Admin authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during admin sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@dentakart.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-2 shadow-lg shadow-teal-500/10">
          <Building2 className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-teal-400 bg-teal-950/80 border border-teal-800/80 px-3 py-1 rounded-full">
            SELLER & OPERATIONS HUB
          </span>
          <h1 className="text-2xl font-black text-white mt-3 font-display tracking-tight">
            Denta<span className="text-teal-400">Kart</span> Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized management access for product catalog, stock calibrations & clinic order dispatch
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 text-rose-200 text-xs font-semibold border border-rose-800/80 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Seller Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dentakart.com"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-teal-500 text-white placeholder-slate-600 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-300">Password</label>
                <span className="text-[11px] text-teal-400 hover:underline cursor-pointer">
                  Need Help?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-teal-500 text-white placeholder-slate-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
            >
              {loading ? 'Verifying Admin Security...' : 'Enter Seller Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Helper */}
          <div className="pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-3 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 hover:text-teal-300 flex items-center justify-center gap-1.5 transition font-mono"
            >
              <KeyRound className="w-3.5 h-3.5 text-teal-400" />
              <span>Auto-Fill Default: admin@dentakart.com</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-teal-400 transition inline-flex items-center gap-1"
            >
              ← Return to Doctor Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
