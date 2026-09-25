import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Grid,
  ShoppingBag,
  Heart,
  User,
  Camera,
  Sparkles,
  Zap,
  Layers,
  FileText
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { PrescriptionScannerModal } from '../doctor/PrescriptionScannerModal';
import { DentaAIChatModal } from '../doctor/DentaAIChatModal';

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, setIsCartOpen, summary } = useCart();
  const { wishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [isRxOpen, setIsRxOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showAiSheet, setShowAiSheet] = useState(false);

  const totalCartCount = items.reduce((acc, it) => acc + it.quantity, 0);

  // If on admin pages, hide the buyer bottom nav
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] select-none pb-safe"
      >
        <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
          {/* 1. Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Home className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-600 dark:bg-teal-400 rounded-full" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 font-medium">Home</span>
              </>
            )}
          </NavLink>

          {/* 2. Catalog / Explore */}
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Grid className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-600 dark:bg-teal-400 rounded-full" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 font-medium">Catalog</span>
              </>
            )}
          </NavLink>

          {/* 3. Center Action: Scan Rx / DentaAI */}
          <div className="relative -top-3">
            <button
              onClick={() => setShowAiSheet(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 text-white flex flex-col items-center justify-center shadow-lg shadow-teal-600/30 active:scale-95 transition-transform border-2 border-white dark:border-slate-900"
              title="Scan Rx or Ask DentaAI"
            >
              <Camera className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Scan</span>
            </button>
          </div>

          {/* 4. Wishlist */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Heart className={`w-5 h-5 ${isActive ? 'stroke-[2.5] fill-rose-500 text-rose-500' : 'stroke-2'}`} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 font-medium">Wishlist</span>
              </>
            )}
          </NavLink>

          {/* 5. Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 transition-all duration-200 relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-2" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-2.5 bg-emerald-600 text-white text-[9px] font-black px-1.5 h-4 min-w-[16px] rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
              {totalCartCount > 0 ? `₹${summary.finalTotal.toLocaleString('en-IN')}` : 'Cart'}
            </span>
          </button>

          {/* 6. Account / Profile */}
          <NavLink
            to={isAuthenticated ? '/doctor/dashboard' : '/login'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <User className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {isAuthenticated && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 font-medium">
                  {isAuthenticated ? 'Clinic' : 'Sign In'}
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Action Sheet for Scan Rx vs Ask DentaAI */}
      {showAiSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto sm:hidden" />
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick AI & Clinic Tools</h3>
              <p className="text-xs text-slate-500 mt-0.5">Choose an option for instant clinic restock</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setShowAiSheet(false);
                  setIsRxOpen(true);
                }}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-black block">Scan Rx / Requisition</span>
                  <span className="text-[10px] text-emerald-600 opacity-90">Auto-crop slip items</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowAiSheet(false);
                  setIsAiOpen(true);
                }}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-black block">Ask DentaAI</span>
                  <span className="text-[10px] text-teal-600 opacity-90">Clinical specs & advice</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowAiSheet(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <PrescriptionScannerModal isOpen={isRxOpen} onClose={() => setIsRxOpen(false)} />
      <DentaAIChatModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </>
  );
};
