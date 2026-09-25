import React, { useState } from 'react';
import { X, Boxes, Plus, Minus, Check } from 'lucide-react';
import api from '../../services/api';
import { Product } from '../../types';

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockAdjustmentModal: React.FC<Props> = ({ product, isOpen, onClose, onSuccess }) => {
  const [changeType, setChangeType] = useState<'RESTOCK' | 'MANUAL_DECREASE' | 'SET_EXACT'>('RESTOCK');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || parseInt(quantity, 10) <= 0) return;

    setSubmitting(true);
    try {
      await api.post('/inventory/adjust', {
        productId: product.id,
        changeType,
        quantity: parseInt(quantity, 10),
        reason: reason.trim() || undefined
      });

      alert('Inventory adjusted successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Adjust Stock Level</h3>
              <p className="text-xs text-slate-500 font-mono">Current Stock: <strong className="text-teal-600">{product.stock} Units</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">{product.name}</p>
            <span className="text-[11px] text-slate-400 font-mono">SKU: {product.sku} | Brand: {product.brand}</span>
          </div>

          {/* Action Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Adjustment Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChangeType('RESTOCK')}
                className={`py-2 rounded-xl font-bold border transition ${
                  changeType === 'RESTOCK'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                + Restock Intake
              </button>
              <button
                type="button"
                onClick={() => setChangeType('MANUAL_DECREASE')}
                className={`py-2 rounded-xl font-bold border transition ${
                  changeType === 'MANUAL_DECREASE'
                    ? 'border-rose-600 bg-rose-50 text-rose-700'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                - Damage / Scrap
              </button>
              <button
                type="button"
                onClick={() => setChangeType('SET_EXACT')}
                className={`py-2 rounded-xl font-bold border transition ${
                  changeType === 'SET_EXACT'
                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                = Set Exact
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              {changeType === 'SET_EXACT' ? 'New Total Stock Units' : 'Quantity Units to Adjust'}
            </label>
            <input
              type="number"
              required
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 25"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 font-bold"
            />
          </div>

          {/* Reason */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Reason / Audit Log Note</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Manufacturer Batch #3M-992 Intake / Physical audit match"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md shadow-teal-600/20 transition disabled:opacity-50"
          >
            {submitting ? 'Applying Calibration...' : 'Confirm Stock Adjustment'}
          </button>
        </form>
      </div>
    </div>
  );
};
