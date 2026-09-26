import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Zap, Tag, Check, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useViewMode } from '../../context/ViewModeContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    summary,
    isCartOpen,
    setIsCartOpen,
    deliveryInstruction,
    setDeliveryInstruction,
    appliedCoupon,
    couponError,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    openExpressCheckout,
    addToCart
  } = useCart();

  const { viewMode, setViewMode } = useViewMode();
  const [couponCodeInput, setCouponCodeInput] = useState('');

  if (!isCartOpen) return null;

  const quickCoupons = ['DENTA100', 'WELCOME20', 'FREESHIP', 'SMILE25', 'WELCOME10', 'DENTAL500'];
  const instructionsList = ['Leave at Door', "Don't Ring Bell", 'Call on Arrival', 'Leave with Guard'];

  const handleApplyCoupon = async (codeToApply: string) => {
    const res = await applyCoupon(codeToApply);
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div className="pt-8 sm:pt-4.5 pb-3.5 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">My Dental Cart</h2>
              <span className="text-xs bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Desktop / Mobile view toggle */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-semibold">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-2 py-1 rounded-md transition ${viewMode === 'desktop' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-500'}`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-2 py-1 rounded-md transition ${viewMode === 'mobile' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-500'}`}
                >
                  Mobile
                </button>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-4">
            {/* Lightning Delivery Banner */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600 animate-bounce" /> Delivery in 15-20 minutes
                </span>
                <span className="text-[11px] font-medium text-slate-500">From Central Dental Hub</span>
              </div>
              <div className="flex items-center justify-between text-[11px] bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 px-3 py-1.5 rounded-xl font-semibold">
                <span>✨ You unlocked FREE Lightning Delivery!</span>
                <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded-md text-[10px]">FREE</span>
              </div>
            </div>

            {/* Cart Items List */}
            {items.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your clinic cart is empty</p>
                <p className="text-xs text-slate-400">Explore restorative composites, rotary files, and instruments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex items-start gap-3 shadow-xs"
                  >
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=300&q=80'}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.product.packSize || item.product.brand}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] line-through text-slate-400">
                            ₹{(item.product.mrp * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Qty Stepper */}
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Frequently Forgotten Essentials */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Frequently Forgotten Essentials
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 font-bold text-xs">
                      🧤
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">Karam Nitrile Gloves (100 pcs)</p>
                      <p className="text-[11px] text-teal-600 font-bold">₹450</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart('karam-nitrile-gloves-100-pcs')}
                    className="text-[11px] font-bold bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white px-2.5 py-1 rounded-lg border border-teal-200 transition"
                  >
                    + ADD
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 font-bold text-xs">
                      🧻
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">Waldent Dental Patient Bibs (500)</p>
                      <p className="text-[11px] text-teal-600 font-bold">₹890</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart('waldent-dental-patient-bibs-500')}
                    className="text-[11px] font-bold bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white px-2.5 py-1 rounded-lg border border-teal-200 transition"
                  >
                    + ADD
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Delivery Instructions</label>
              <div className="grid grid-cols-2 gap-2">
                {instructionsList.map((inst) => (
                  <button
                    key={inst}
                    onClick={() => setDeliveryInstruction(inst)}
                    className={`text-[11px] p-2 rounded-xl border text-left font-medium transition ${
                      deliveryInstruction === inst
                        ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Coupon */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-teal-600" /> Apply Promo Coupon
              </label>

              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      🏷️ {appliedCoupon.code}
                    </span>
                    <p className="text-[10px] text-emerald-600">Saved ₹{appliedCoupon.discountAmount} on this order</p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="ENTER COUPON (E.G. DENTA100)"
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono uppercase tracking-wider outline-none focus:border-teal-600"
                    />
                    <button
                      onClick={() => handleApplyCoupon(couponCodeInput)}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 rounded-xl transition"
                    >
                      APPLY
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-500 font-semibold">{couponError}</p>}

                  {/* Coupon Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {quickCoupons.map((code) => (
                      <button
                        key={code}
                        onClick={() => {
                          setCouponCodeInput(code);
                          handleApplyCoupon(code);
                        }}
                        className="text-[10px] font-bold font-mono px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 transition active:scale-95 cursor-pointer"
                      >
                        🏷️ {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bill Details */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Bill Details</h4>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Item Subtotal</span>
                <span>₹{summary.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST Tax (CGST + SGST 12%/18%)</span>
                <span>₹{summary.gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Delivery Partner Fee</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>- ₹{appliedCoupon.discountAmount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                <span>To Pay</span>
                <span className="text-emerald-600">₹{summary.finalTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="mt-2 text-center bg-emerald-100/60 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold py-1.5 rounded-xl">
                🎉 You are saving ₹{appliedCoupon ? (appliedCoupon.discountAmount + 1000).toLocaleString('en-IN') : '2,000'} on this order!
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xl">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">TOTAL TO PAY</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">
                ₹{summary.finalTotal.toLocaleString('en-IN')}
              </p>
            </div>
            <button
              onClick={openExpressCheckout}
              disabled={items.length === 0}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
            >
              <span>Proceed to Checkout</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
