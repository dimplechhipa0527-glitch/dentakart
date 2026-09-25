import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Tag,
  FolderTree,
  Star,
  BarChart3,
  ArrowLeft,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAdminUI } from '../../context/AdminUIContext';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { isMobileSidebarOpen, closeMobileSidebar } = useAdminUI();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products Catalog', path: '/admin/products', icon: Package },
    { name: 'Inventory & Stock', path: '/admin/inventory', icon: Boxes },
    { name: 'Order Fulfillment', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Doctor Directory', path: '/admin/doctors', icon: Users },
    { name: 'Coupons & Promos', path: '/admin/coupons', icon: Tag },
    { name: 'Categories Tree', path: '/admin/categories', icon: FolderTree },
    { name: 'Reviews Moderation', path: '/admin/reviews', icon: Star },
    { name: 'Financial Analytics', path: '/admin/analytics', icon: BarChart3 }
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-4 sm:p-4.5 border-b border-slate-800 flex items-center justify-between">
          <Link
            to="/admin/dashboard"
            onClick={closeMobileSidebar}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-teal-500/20">
              DK
            </div>
            <div>
              <span className="font-bold text-white text-xs tracking-tight">DentaKart Admin</span>
              <span className="block text-[9px] text-teal-400 font-semibold uppercase">Operations Suite</span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close menu"
          >
            <X size={16} className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="p-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={15} className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to Doctor Store & Sign Out */}
      <div className="p-3.5 border-t border-slate-800 space-y-1.5 mt-auto">
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
          <div className="flex items-center gap-1.5 text-teal-400">
            <ShieldCheck size={13} className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase">Seller Admin Active</span>
          </div>
          <p className="text-[10px] text-slate-300 mt-0.5">DentaKart Operations Hub</p>
        </div>
        <Link
          to="/"
          onClick={closeMobileSidebar}
          className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <ArrowLeft size={13} className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span className="truncate">View Customer Storefront</span>
        </Link>
        <Link
          to="/admin/login"
          onClick={() => {
            closeMobileSidebar();
            localStorage.removeItem('dentakart_token');
          }}
          className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
        >
          <span className="text-xs">🚪 Sign Out of Admin</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-60 bg-slate-900 text-slate-300 min-h-screen border-r border-slate-800 flex-col shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer & Backdrop */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />

          {/* Slide-over Drawer */}
          <div className="fixed inset-y-0 left-0 w-68 max-w-[80vw] bg-slate-900 text-slate-300 shadow-2xl z-50 flex flex-col border-r border-slate-800 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
