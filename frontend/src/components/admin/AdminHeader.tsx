import React from 'react';
import { Menu, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminUI } from '../../context/AdminUIContext';

interface Props {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AdminHeader: React.FC<Props> = ({ title, subtitle, actionButton }) => {
  const { user } = useAuth();
  const { toggleMobileSidebar } = useAdminUI();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3.5 py-2.5 sm:px-6 sm:py-3.5 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Toggle + Titles */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="lg:hidden p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition shrink-0"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu size={18} className="w-4.5 h-4.5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-black text-slate-900 dark:text-white tracking-tight uppercase truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="hidden md:block text-[11px] text-slate-500 truncate max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {actionButton}

          <div className="flex items-center gap-2 pl-2 sm:pl-2.5 border-l border-slate-200 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
              AD
            </div>
            <div className="hidden xl:block text-left text-xs">
              <p className="font-bold text-slate-900 dark:text-white leading-tight text-[11px]">
                {user?.name || 'Operations Admin'}
              </p>
              <p className="text-[10px] text-teal-600 font-semibold">
                admin@dentakart.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
