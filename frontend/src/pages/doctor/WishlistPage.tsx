import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/doctor/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = async () => {
    for (const prod of wishlist) {
      await addToCart(prod.id, 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
            Saved Clinic Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dental supplies bookmarked for upcoming clinical procedures and restock
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Move All to Clinic Cart</span>
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Heart className="w-12 h-12 mx-auto text-rose-400" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">Your wishlist is currently empty</h3>
          <p className="text-xs text-slate-400">Save products to quickly reorder or monitor stock levels.</p>
          <Link
            to="/products"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Explore Dental Supplies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
