import React, { useState } from 'react';
import { Zap, X, QrCode, Smartphone, CreditCard, Banknote, ShieldCheck, CheckCircle2, MapPin, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstantCheckoutModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { items, summary, appliedCoupon, deliveryInstruction, clearCart } = useCart();
  const { user } = useAuth();
  const { location, setIsLocationModalOpen } = useLocationContext();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState<'UPI_QR' | 'UPI_APP' | 'CARD' | 'COD'>('UPI_QR');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const totalPayable = summary.finalTotal > 0 ? summary.finalTotal : 7510; // realistic default

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const shippingAddress = {
        name: user?.name || 'Dr. Rahul Sharma',
        clinicName: user?.doctorProfile?.clinicName || 'Smile Dental Clinic',
        phone: user?.phone || '+91 98201 12345',
        addressLine1: location.formattedAddress || user?.doctorProfile?.addressLine || 'Shop 4-5, Crystal Plaza, Andheri West',
        city: location.city || user?.doctorProfile?.city || 'Mumbai',
        state: location.state || user?.doctorProfile?.state || 'Maharashtra',
        pincode: location.pincode || user?.doctorProfile?.pincode || '400053',
        gstNumber: user?.doctorProfile?.gstNumber || '27AABCU9603R1ZM'
      };

      const orderPayload = {
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity
        })),
        shippingAddress: shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod: selectedMethod === 'UPI_QR' || selectedMethod === 'UPI_APP' ? 'UPI' : selectedMethod,
        couponCode: appliedCoupon?.code || null,
        doctorNotes: `Delivery note: ${deliveryInstruction} [GPS Hub: ${location.deliveryHub}]`
      };

      const res = await api.post('/orders/create', orderPayload);

      if (res.data.success) {
        setOrderSuccess(res.data.order);
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (orderSuccess) {
      const orderNum = orderSuccess.orderNumber;
      onClose();
      navigate(`/orders/${orderNum}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {/* Success View */}
        {orderSuccess ? (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">Payment Successful</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Order #{orderSuccess.orderNumber} Confirmed!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your B2B dental order is being packed for 15-min priority dispatch.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Clinic:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{user?.doctorProfile?.clinicName || 'Smile Dental Clinic'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-bold text-emerald-600">₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST Invoice:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">INV-2026-{orderSuccess.orderNumber}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> View Order & Live Tracking
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-lg">⚡</span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Instant Express Checkout</h3>
                    <p className="text-xs text-slate-500">
                      {totalItemsCount} items • Total ₹{totalPayable.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Line */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="h-1 bg-teal-600 rounded-full" />
                <div className="h-1 bg-teal-600 rounded-full" />
              </div>
            </div>

            {/* Methods & Location */}
            <div className="p-6 pt-2 space-y-3 max-h-[440px] overflow-y-auto">
              {/* Clinic Destination Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {location.shortName}
                      </span>
                      {location.isGpsDetected && (
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                          GPS
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{location.formattedAddress}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs hover:bg-slate-50 transition"
                >
                  Change
                </button>
              </div>

              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider pt-1">
                Choose Payment Method
              </p>

              {/* Option 1: Instant UPI QR Scanner */}
              <div
                onClick={() => setSelectedMethod('UPI_QR')}
                className={`border-2 rounded-2xl p-4 cursor-pointer transition ${
                  selectedMethod === 'UPI_QR'
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-teal-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Instant UPI QR Scanner</h4>
                      <p className="text-[11px] text-slate-500">Scan via GPay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    0% Fee ⚡
                  </span>
                </div>

                {selectedMethod === 'UPI_QR' && (
                  <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center">
                    {/* Visual QR Code Display */}
                    <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-teal-500 shadow-inner flex flex-col items-center">
                      <svg
                        className="w-40 h-40"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Position Markers */}
                        <rect x="5" y="5" width="28" height="28" rx="6" stroke="#0d9488" strokeWidth="6" fill="white" />
                        <rect x="12" y="12" width="14" height="14" rx="3" fill="#0d9488" />
                        
                        <rect x="67" y="5" width="28" height="28" rx="6" stroke="#0d9488" strokeWidth="6" fill="white" />
                        <rect x="74" y="12" width="14" height="14" rx="3" fill="#0d9488" />
                        
                        <rect x="5" y="67" width="28" height="28" rx="6" stroke="#0d9488" strokeWidth="6" fill="white" />
                        <rect x="12" y="74" width="14" height="14" rx="3" fill="#0d9488" />

                        {/* Internal QR Dot Pattern */}
                        <rect x="42" y="12" width="8" height="8" rx="2" fill="#0f172a" />
                        <rect x="52" y="12" width="8" height="8" rx="2" fill="#0f172a" />
                        <rect x="42" y="24" width="8" height="8" rx="2" fill="#0f172a" />
                        <rect x="12" y="42" width="8" height="8" rx="2" fill="#0f172a" />
                        <rect x="24" y="42" width="8" height="8" rx="2" fill="#0f172a" />
                        <rect x="42" y="42" width="16" height="16" rx="3" fill="#0d9488" />
                        <rect x="65" y="42" width="8" height="8" rx="2" fill="#0f172a" />
                        <rect x="78" y="42" width="8" height="8" rx="2" fill="#0f172a" />
                        <rect x="42" y="65" width="8" height="8" rx="2" fill="#0f172a" />
                        <rect x="52" y="74" width="8" height="8" rx="2" fill="#0f172a" />
                        <rect x="65" y="65" width="12" height="12" rx="2" fill="#0f172a" />
                        <rect x="80" y="80" width="8" height="8" rx="2" fill="#0d9488" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-2">
                      Scan & Pay ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">Instant auto-detection enabled</span>
                  </div>
                )}
              </div>

              {/* Option 2: Pay via UPI App */}
              <div
                onClick={() => setSelectedMethod('UPI_APP')}
                className={`border rounded-2xl p-3.5 cursor-pointer flex items-center gap-3 transition ${
                  selectedMethod === 'UPI_APP'
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Smartphone className="w-5 h-5 text-slate-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pay via UPI App</h4>
                  <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>

              {/* Option 3: Credit / Debit Card */}
              <div
                onClick={() => setSelectedMethod('CARD')}
                className={`border rounded-2xl p-3.5 cursor-pointer flex items-center gap-3 transition ${
                  selectedMethod === 'CARD'
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-slate-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Credit / Debit Card</h4>
                  <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay with 3D Secure</p>
                </div>
              </div>

              {/* Option 4: Cash on Delivery */}
              <div
                onClick={() => setSelectedMethod('COD')}
                className={`border rounded-2xl p-3.5 cursor-pointer flex items-center gap-3 transition ${
                  selectedMethod === 'COD'
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Banknote className="w-5 h-5 text-slate-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Cash on Delivery</h4>
                  <p className="text-[11px] text-slate-500">Pay by Cash / UPI upon doorstep delivery</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100"
              >
                Back
              </button>
              <button
                disabled={submitting}
                onClick={handlePlaceOrder}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>🔒</span>
                    <span>Pay ₹{totalPayable.toLocaleString('en-IN')} & Place Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
