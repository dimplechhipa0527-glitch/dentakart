import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Camera,
  Sparkles,
  Flame,
  ShoppingBag,
  Heart,
  Bell,
  User,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  Layers,
  FileText,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotification } from '../../context/NotificationContext';
import { useLocationContext } from '../../context/LocationContext';
import { useViewMode } from '../../context/ViewModeContext';
import { PrescriptionScannerModal } from '../doctor/PrescriptionScannerModal';
import { DentaAIChatModal } from '../doctor/DentaAIChatModal';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { items, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { unreadCount, setIsOpen: setNotifOpen } = useNotification();
  const { location, isGpsLoading, setIsLocationModalOpen } = useLocationContext();
  const { viewMode, setViewMode } = useViewMode();

  const [searchQuery, setSearchQuery] = useState('');
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalCartCount = items.reduce((acc, it) => acc + it.quantity, 0);

  const quickTags = [
    { label: '✨ All', path: '/products' },
    { label: '🧴 Composites', path: '/products?category=dental-materials' },
    { label: '⚡ Endodontics', path: '/products?category=endodontics' },
    { label: '🦷 Scalers', path: '/products?category=dental-instruments' },
    { label: '📦 Disposables', path: '/products?category=consumables' },
    { label: '🩺 Ortho', path: '/products?category=orthodontics' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-850 shadow-xs">
        {/* Top Info Bar (Desktop only to save mobile screen height) */}
        <div className="hidden sm:flex bg-teal-700 text-white text-[11px] py-1 px-4 font-medium items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-teal-800 text-[10px] font-bold px-2 py-0.5 rounded">INTEGRITY ENTERPRISES</span>
            <span>Silvassa Hub • 100% Genuine Dental Materials with GST ITC Tax Invoicing</span>
          </div>

          <div className="flex items-center justify-end gap-3 text-[11px]">
            <a
              href="https://wa.me/919316839711"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-bold text-emerald-300 hover:underline"
            >
              <span>💬 WhatsApp: +91 93168 39711</span>
            </a>
            <span className="opacity-60">•</span>
            <span className="font-semibold text-teal-100 flex items-center gap-1">
              <span>⚡ 15-20 Min Express Hub</span>
            </span>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2">
          {/* Top Row: Brand, Location, Actions */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo + 15-MIN Tag */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src="/logo.png"
                  alt="DentaKart Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover shadow-md shadow-teal-500/20 group-hover:scale-105 transition"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                      Denta<span className="text-teal-600">Kart</span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-1 py-0.2 rounded border border-teal-200 dark:border-teal-800">
                      B2B
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-amber-500 tracking-wider">
                    <span>⚡ 15-MIN EXPRESS</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* GPS Location Pill (Visible on both Mobile and Desktop) */}
            <div className="flex items-center">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition group max-w-[170px] sm:max-w-[220px]"
                title="Click to detect GPS or change clinic delivery location"
              >
                <span
                  className={`text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center shrink-0 ${
                    location.deliveryType === 'EXPRESS_LOCAL' ? 'bg-teal-600' : 'bg-indigo-600'
                  }`}
                >
                  {location.deliveryTimeEstimate}
                </span>
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 group-hover:scale-110 transition" />
                <span className="truncate text-[11px] sm:text-xs font-medium">{location.shortName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* Desktop Center Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-2">
              <div className="relative flex items-center w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search composites, files, burs, gloves..."
                  className="w-full bg-slate-100/90 dark:bg-slate-800/90 text-xs text-slate-900 dark:text-slate-100 pl-10 pr-20 py-2 rounded-full border border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition"
                />
                <button
                  type="submit"
                  className="absolute right-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1 rounded-full transition"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Scan Rx Button (Desktop) */}
              <button
                onClick={() => setIsRxModalOpen(true)}
                className="hidden xl:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 transition"
              >
                <Camera className="w-4 h-4" />
                <span>Scan Rx</span>
              </button>

              {/* Ask DentaAI (Desktop) */}
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 hover:from-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 transition"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Ask AI</span>
              </button>

              {/* Desktop / Mobile View Mode Switcher Toggle */}
              <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                    viewMode === 'desktop'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                  title="Switch to Full Desktop View"
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                    viewMode === 'mobile'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                  title="Switch to Interactive Mobile Phone Simulator"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>

              {/* Wishlist (Desktop) */}
              <Link
                to="/wishlist"
                className="hidden sm:flex relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Clinic Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <button
                onClick={() => setNotifOpen(true)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Clinic Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-md shadow-emerald-600/20 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-emerald-800 text-[10px] px-1.5 py-0.2 rounded-md font-black">
                  {totalCartCount}
                </span>
              </button>

              {/* Doctor Account Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white font-black flex items-center justify-center text-xs shadow-xs">
                      {user?.name ? user.name.replace('Dr. ', '').charAt(0) : 'D'}
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl mb-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-teal-600 font-semibold truncate">
                          {user?.doctorProfile?.clinicName || 'Dental Clinic'}
                        </p>
                        <span className="inline-block text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded mt-1 border border-teal-200 dark:border-teal-800">
                          Verified Doctor Account
                        </span>
                      </div>

                      <div className="space-y-0.5 text-xs">
                        <Link
                          to="/doctor/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-teal-600" />
                          <span>Doctor Dashboard</span>
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                        >
                          <Package className="w-4 h-4 text-teal-600" />
                          <span>My Orders & Invoices</span>
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                        >
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span>Saved Wishlist</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-teal-600" />
                          <span>Clinic GST & Address</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 font-bold rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 transition mt-1"
                          >
                            <Layers className="w-4 h-4" />
                            <span>Seller Admin Portal</span>
                          </Link>
                        )}

                        <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                              navigate('/login');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 font-semibold rounded-xl hover:bg-rose-50 text-rose-600 text-left transition"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="text-xs font-bold px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search & Quick Categories Row (Visible on Mobile / Small screens) */}
          <div className="mt-2 md:hidden space-y-1.5">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dental composites, files, burs, bibs..."
                className="w-full bg-slate-100/90 dark:bg-slate-800/90 text-xs text-slate-900 dark:text-slate-100 pl-9 pr-16 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-teal-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
              >
                Search
              </button>
            </form>

            {/* Quick Filter Horizontal Scroll Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {quickTags.map((tag) => (
                <Link
                  key={tag.label}
                  to={tag.path}
                  className="shrink-0 bg-slate-100 dark:bg-slate-800/80 hover:bg-teal-50 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700 transition"
                >
                  {tag.label}
                </Link>
              ))}
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="shrink-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 text-teal-700 dark:text-teal-300 font-bold px-2.5 py-1 rounded-lg border border-teal-300/40 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <PrescriptionScannerModal isOpen={isRxModalOpen} onClose={() => setIsRxModalOpen(false)} />
      <DentaAIChatModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </>
  );
};
