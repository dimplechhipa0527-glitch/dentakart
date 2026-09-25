import React from 'react';
import { CheckCircle2, Clock, Truck, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import { Order } from '../../types';

interface Props {
  order: Order;
}

export const OrderTracker: React.FC<Props> = ({ order }) => {
  const steps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Received & verified' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Payment cleared' },
    { key: 'PROCESSING', label: 'Processing', desc: 'Packed at Hub' },
    { key: 'SHIPPED', label: 'Shipped', desc: 'In transit' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'With clinic rider' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Handed to clinic' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'OUT_FOR_DELIVERY': return 4;
      case 'DELIVERED': return 5;
      case 'CANCELLED': return -1;
      case 'RETURN_REQUESTED': return 4;
      case 'RETURNED': return 5;
      default: return 1;
    }
  };

  const currentIndex = getStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-bold text-xs">Order Cancelled</h4>
          <p className="text-[11px] opacity-80">This order was cancelled and any refund has been initiated to original payment mode.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Live Delivery Pipeline</span>
          <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
            Current Status: <span className="text-teal-600 font-bold">{order.status.replace(/_/g, ' ')}</span>
          </h4>
        </div>
        {order.trackingNumber && (
          <div className="text-right text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] block">Courier: {order.courierName || 'Blue Dart'}</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{order.trackingNumber}</span>
          </div>
        )}
      </div>

      {/* Visual Timeline Stepper */}
      <div className="relative pt-2">
        <div className="grid grid-cols-6 gap-1 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  } ${isCurrent ? 'ring-4 ring-emerald-100 dark:ring-emerald-950' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-[10px] font-bold mt-2 leading-tight ${isCurrent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                  {step.label}
                </span>
                <span className="hidden sm:block text-[9px] text-slate-400 mt-0.5">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>

        {/* Connector Line */}
        <div className="absolute top-5 left-[8%] right-[8%] h-0.5 bg-slate-200 dark:bg-slate-800 z-0">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${(Math.min(currentIndex, 5) / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
