import React from 'react';
import { Bell, Search, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AdminHeader: React.FC<Props> = ({ title, subtitle, actionButton }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {actionButton}

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
            ADM
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-bold text-slate-900 dark:text-white">{user?.name || 'Operations Admin'}</p>
            <p className="text-[10px] text-teal-600 font-semibold">admin@dentakart.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};
