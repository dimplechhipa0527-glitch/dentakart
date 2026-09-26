import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Menu
} from 'lucide-react';
import { useAdminUI } from '../../context/AdminUIContext';

export const AdminMobileBottomNav: React.FC = () => {
  const { toggleMobileSidebar } = useAdminUI();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
  ];

  return (
    <nav
      aria-label="Admin Mobile Navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 text-slate-400 select-none pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
    >
      <div className="grid grid-cols-5 items-center px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-1 rounded-xl transition ${
                  isActive
                    ? 'text-teal-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-0.5 rounded-lg transition ${isActive ? 'bg-teal-500/15' : ''}`}>
                    <Icon size={17} className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] mt-0.5 tracking-tight font-medium">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* More / Menu Drawer Trigger */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 active:scale-95 transition"
        >
          <div className="p-0.5 rounded-lg">
            <Menu size={17} className="w-4 h-4 text-teal-400" />
          </div>
          <span className="text-[9px] mt-0.5 tracking-tight font-medium">
            More
          </span>
        </button>
      </div>
    </nav>
  );
};
