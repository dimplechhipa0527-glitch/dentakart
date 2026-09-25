import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Zap, ShieldCheck, MapPin, Navigation } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLocationContext } from '../../context/LocationContext';
import { InstantCheckoutModal } from '../../components/doctor/InstantCheckoutModal';

export const CartPage: React.FC = () => {
  const {
    items,
    summary,
    deliveryInstruction,
    setDeliveryInstruction,
    appliedCoupon,
    couponError,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    isCheckoutOpen,
    setIsCheckoutOpen
  } = useCart();

  const { location, setIsLocationModalOpen, detectGpsLocation, isGpsLoading } = useLocationContext();

  const [couponInput, setCouponInput] = useState('');
  const instructionsList = ['Leave at Door', "Don't Ring Bell", 'Call on Arrival', 'Leave with Guard'];

  const handleApply = async () => {
    if (couponInput.trim()) {
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
          Clinic Shopping Cart ({items.length} Items)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review quantities, apply promo vouchers, and calculate GST input tax credit
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">Your cart is empty</h3>
          <p className="text-xs text-slate-400">Discover dental composite resins, rotary files, and instruments.</p>
          <Link
            to="/products"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=200&q=80'}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-slate-50 border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.product.brand}</span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{item.product.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{item.product.packSize}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{(item.product.mrp * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Instructions */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">Delivery Instructions for Clinic Rider</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {instructionsList.map((inst) => (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => setDeliveryInstruction(inst)}
                    className={`text-xs p-2.5 rounded-xl border text-center font-semibold transition ${
                      deliveryInstruction === inst
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Bill Summary */}
          <div className="lg:col-span-4 space-y-4">
            {/* Delivery Destination Hub */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Delivering To Clinic
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  location.deliveryType === 'EXPRESS_LOCAL'
                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {location.deliveryTimeEstimate}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {location.shortName}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                    {location.formattedAddress}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 text-slate-700 dark:text-slate-200 text-xs font-bold py-2 px-3 rounded-xl transition text-center"
                >
                  Change Location
                </button>
                <button
                  onClick={detectGpsLocation}
                  disabled={isGpsLoading}
                  className="bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 text-xs font-bold py-2 px-3 rounded-xl border border-teal-200 dark:border-teal-800 transition flex items-center gap-1 shrink-0"
                  title="Detect my current GPS location"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isGpsLoading ? 'Locating...' : 'GPS'}</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Order Summary</h3>

              {/* Coupon input */}
              <div className="space-y-1.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-teal-600" /> Apply Promo Voucher
                </label>
                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex justify-between items-center font-bold">
                    <span>🏷️ {appliedCoupon.code} (-₹{appliedCoupon.discountAmount})</span>
                    <button onClick={removeCoupon} className="text-red-600 hover:underline">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10"
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 uppercase font-mono text-xs outline-none focus:border-teal-500"
                    />
                    <button
                      onClick={handleApply}
                      className="bg-teal-600 text-white font-bold px-3.5 py-2 rounded-xl"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[11px] text-red-500 font-semibold">{couponError}</p>}
              </div>

              {/* Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal (Excl. Tax)</span>
                  <span>₹{summary.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST Tax (ITC Credit)</span>
                  <span>₹{summary.gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-600 font-bold">{summary.shipping === 0 ? 'FREE' : `₹${summary.shipping}`}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>- ₹{appliedCoupon.discountAmount}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-teal-600">₹{summary.finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
              >
                <span>Instant Express Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Express Checkout Modal */}
      <InstantCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};
