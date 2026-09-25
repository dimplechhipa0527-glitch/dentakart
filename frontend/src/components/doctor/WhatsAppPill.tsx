import React, { useState } from 'react';
import { MessageSquare, X, Check } from 'lucide-react';

export const WhatsAppPill: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce duration-1000 flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg shadow-emerald-500/30 transition-all cursor-pointer">
      <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
      <MessageSquare className="w-4 h-4 fill-white" />
      <span>WhatsApp Updates Active • OTP: 6244</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
        className="ml-1 p-0.5 hover:bg-emerald-700/50 rounded-full transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
