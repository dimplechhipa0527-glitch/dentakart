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
  ShieldAlert
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

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

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div>
        {/* Admin Header Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-black text-sm">
              DK
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight">DentaKart Admin</span>
              <span className="block text-[10px] text-teal-400 font-semibold uppercase">Operations Suite</span>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to Doctor Store & Sign Out */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
          <span className="text-[10px] font-bold text-teal-400 block uppercase">Seller Admin Active</span>
          <p className="text-[11px] text-slate-300 mt-0.5">DentaKart Operations Hub</p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4 text-teal-500" />
          <span>View Customer Storefront</span>
        </Link>
        <Link
          to="/admin/login"
          onClick={() => localStorage.removeItem('dentakart_token')}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
        >
          <span>🚪 Sign Out of Admin</span>
        </Link>
      </div>
    </aside>
  );
};
