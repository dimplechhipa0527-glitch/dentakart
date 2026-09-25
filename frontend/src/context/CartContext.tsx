import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { CartItem, CartSummary, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  deliveryInstruction: string;
  appliedCoupon: any | null;
  couponError: string | null;
  loading: boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setDeliveryInstruction: (inst: string) => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>;
  removeCoupon: () => void;
  getItemQuantity: (productId: string) => number;
  openExpressCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryInstruction, setDeliveryInstruction] = useState<string>('Leave at Door');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [summary, setSummary] = useState<CartSummary>({
    subtotal: 0,
    gst: 0,
    shipping: 0,
    finalTotal: 0,
    freeShippingThreshold: 5000,
    amountToFreeShipping: 5000
  });

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setItems(res.data.items);
        recalcSummary(res.data.items, appliedCoupon);
      }
    } catch (err) {
      console.error('Fetch cart error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    recalcSummary(items, appliedCoupon);
  }, [appliedCoupon, items]);

  const recalcSummary = (cartItems: CartItem[], coupon: any | null) => {
    let subtotal = 0;
    let totalGst = 0;

    cartItems.forEach((item) => {
      const lineTotal = item.product.price * item.quantity;
      const lineGst = (lineTotal * (item.product.gstPercent || 12)) / 100;
      subtotal += lineTotal;
      totalGst += lineGst;
    });

    const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 100;
    let discount = 0;

    if (coupon) {
      if (coupon.discountType === 'PERCENTAGE') {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
    }

    const finalTotal = Math.max(0, subtotal + totalGst + shipping - discount);

    setSummary({
      subtotal: Number(subtotal.toFixed(2)),
      gst: Number(totalGst.toFixed(2)),
      shipping,
      finalTotal: Number(finalTotal.toFixed(2)),
      freeShippingThreshold: 5000,
      amountToFreeShipping: Math.max(0, 5000 - subtotal)
    });
  };

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const res = await api.post('/cart/add', { productId, quantity });
      if (res.data.success) {
        await fetchCart();
        setIsCartOpen(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await api.put(`/cart/item/${itemId}`, { quantity });
      if (res.data.success) {
        await fetchCart();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await api.delete(`/cart/item/${itemId}`);
      await fetchCart();
    } catch (err: any) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setItems([]);
      setAppliedCoupon(null);
      recalcSummary([], null);
    } catch (err: any) {
      console.error(err);
    }
  };

  const applyCoupon = async (code: string) => {
    setCouponError(null);
    if (!code || !code.trim()) {
      setCouponError('Please enter a valid coupon code');
      return { success: false, message: 'Please enter a coupon code' };
    }
    if (summary.subtotal <= 0) {
      const msg = 'Please add products to your cart before applying a promo coupon';
      setCouponError(msg);
      return { success: false, message: msg };
    }
    try {
      const res = await api.post('/coupons/validate', {
        code: code.trim().toUpperCase(),
        orderAmount: summary.subtotal
      });
      if (res.data.success && res.data.valid) {
        setAppliedCoupon(res.data.coupon);
        return { success: true, message: `Coupon "${code}" applied successfully! Saved ₹${res.data.coupon.discountAmount}` };
      }
      setCouponError(res.data.message || 'Invalid coupon');
      return { success: false, message: res.data.message };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired coupon code';
      setCouponError(msg);
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const openExpressCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        isCartOpen,
        isCheckoutOpen,
        deliveryInstruction,
        appliedCoupon,
        couponError,
        loading,
        setIsCartOpen,
        setIsCheckoutOpen,
        setDeliveryInstruction,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        getItemQuantity,
        openExpressCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
