import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { Product } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  wishlistIds: Set<string>;
  loading: boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      if (res.data.success) {
        const prods = res.data.wishlist.map((item: any) => item.product);
        setWishlist(prods);
        setWishlistIds(new Set(prods.map((p: Product) => p.id)));
      }
    } catch (err) {
      console.error('Fetch wishlist error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated, user?.id]);

  const toggleWishlist = async (product: Product) => {
    try {
      const res = await api.post('/wishlist/toggle', { productId: product.id });
      if (res.data.success) {
        if (res.data.inWishlist) {
          setWishlist((prev) => [product, ...prev]);
          setWishlistIds((prev) => new Set([...prev, product.id]));
        } else {
          setWishlist((prev) => prev.filter((p) => p.id !== product.id));
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        loading,
        toggleWishlist,
        isInWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
