import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, RefreshCw, Award, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 no-print mt-16">
      {/* Top Value Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">100% Genuine Supplies</h4>
              <p className="text-[11px] text-slate-400">Direct from 3M, Dentsply, Mani & GC</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">⚡ 15-Min Delivery</h4>
              <p className="text-[11px] text-slate-400">Hyperlocal micro-hubs in metro clinics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">B2B GST Input Credit</h4>
              <p className="text-[11px] text-slate-400">Compliant HSN tax invoices for clinics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">7-Day Easy Replacement</h4>
              <p className="text-[11px] text-slate-400">Defect replacement on surgical tools</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
        {/* Brand column */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦷</span>
            <span className="text-xl font-black text-white font-display">
              DENTA<span className="text-teal-400">KART</span>
            </span>
            <span className="text-[10px] font-bold bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded border border-teal-700/60">
              DOCTOR B2B
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            DentaKart is India's dedicated B2B marketplace engineered exclusively for dental surgeons, orthodontists, and dental institutions. Streamlining inventory restock with verified GST invoices and cold-chain compliance.
          </p>
          <div className="pt-2 text-slate-400 text-[11px] space-y-0.5">
            <p><strong>Operated by:</strong> Integrity Enterprises</p>
            <p><strong>Central Warehouse:</strong> Silvassa, Dadra and Nagar Haveli 396230</p>
            <p><strong>WhatsApp / Order Desk:</strong> <a href="https://wa.me/919316839711" target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">+91 93168 39711</a></p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Categories</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li><Link to="/products?category=dental-materials" className="hover:text-teal-400 transition">Dental Materials</Link></li>
            <li><Link to="/products?category=endodontics" className="hover:text-teal-400 transition">Endodontics (Files & GP)</Link></li>
            <li><Link to="/products?category=dental-instruments" className="hover:text-teal-400 transition">Instruments & Scalers</Link></li>
            <li><Link to="/products?category=orthodontics" className="hover:text-teal-400 transition">Orthodontic Brackets</Link></li>
            <li><Link to="/products?category=infection-control" className="hover:text-teal-400 transition">Infection Control & PPE</Link></li>
          </ul>
        </div>

        {/* Doctor Portal */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Clinic & Doctor Hub</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li><Link to="/doctor/dashboard" className="hover:text-teal-400 transition">Doctor Dashboard</Link></li>
            <li><Link to="/orders" className="hover:text-teal-400 transition">My Orders & Invoices</Link></li>
            <li><Link to="/wishlist" className="hover:text-teal-400 transition">Saved Clinic Wishlist</Link></li>
            <li><Link to="/profile" className="hover:text-teal-400 transition">Clinic Details & GST</Link></li>
            <li><Link to="/register" className="hover:text-teal-400 transition">Register New Clinic</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Doctor Support</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <a href="https://wa.me/919316839711" target="_blank" rel="noreferrer" className="text-emerald-400 font-bold block hover:underline">
                💬 WhatsApp: +91 93168 39711
              </a>
            </li>
            <li><span className="text-slate-400 block">📞 Direct: +91 93168 39711</span></li>
            <li><span className="text-slate-400 block">Mon - Sat: 8 AM - 10 PM</span></li>
            <li><span className="text-emerald-400 text-[11px] font-semibold block">⚡ 15-20 Min Silvassa Express</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Discreet Seller Login */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
        <p>© 2026 DentaKart Marketplace India Pvt Ltd. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Dental Surgeons
          </p>
          <span className="opacity-40">|</span>
          <Link
            to="/admin/login"
            className="text-slate-500 hover:text-teal-400 font-semibold transition flex items-center gap-1"
          >
            <span>🔒 Seller & Admin Login</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
