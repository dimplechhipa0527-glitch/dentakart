import React, { useState } from 'react';
import { Camera, Upload, CheckCircle2, Sparkles, X, Plus, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PrescriptionScannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedItems, setExtractedItems] = useState<any[] | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setExtractedItems([
        { id: '1', name: '3M Filtek Z350 XT Composite (Shade A2)', qty: 2, confidence: 98, price: 1850 },
        { id: '2', name: 'Karam Nitrile Medical Gloves (Box of 100)', qty: 3, confidence: 95, price: 450 },
        { id: '3', name: 'Dentsply Protaper Gold Rotary Files 25mm', qty: 1, confidence: 92, price: 2650 }
      ]);
    }, 1500);
  };

  const handleAddAll = async () => {
    // Composite + Gloves + Files
    await addToCart('1', 2);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Scan Clinic Rx / Requisition</h3>
              <p className="text-xs text-slate-500">AI-powered dental handwritten slip & supply list scanner</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!extractedItems && !analyzing && (
            <div
              onClick={handleSimulateScan}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/30 hover:bg-teal-50/30"
            >
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto mb-3">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Click or Drag Requisition Slip / Rx Photo</h4>
              <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, PDF doctor purchase memos</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Auto-matches B2B SKUs & GST HSN codes
              </div>
            </div>
          )}

          {analyzing && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Scanning & Extracting Dental Supplies...</p>
              <p className="text-xs text-slate-500">Matching with 2,800+ dental manufacturers catalog</p>
            </div>
          )}

          {extractedItems && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> 3 Items Recognized
                </span>
                <span className="text-xs text-slate-500">High Confidence Match</span>
              </div>

              <div className="space-y-2">
                {extractedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-[11px] text-slate-500">Qty: {item.qty} • ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md">
                      {item.confidence}% match
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddAll}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition"
              >
                <Plus className="w-4 h-4" /> Add All Recognized Items to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
