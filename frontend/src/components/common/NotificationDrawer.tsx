import React from 'react';
import { X, Bell, CheckCheck, Package, Tag, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const NotificationDrawer: React.FC = () => {
  const { notifications, unreadCount, isOpen, setIsOpen, markAsRead, markAllAsRead } = useNotification();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'PROMO':
        return <Tag className="w-4 h-4 text-amber-600" />;
      case 'STOCK':
        return <AlertTriangle className="w-4 h-4 text-cyan-600" />;
      default:
        return <Bell className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Doctor Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-teal-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs">No notifications right now</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.link) {
                      setIsOpen(false);
                      navigate(notif.link);
                    }
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    !notif.isRead
                      ? 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1.5 block">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
