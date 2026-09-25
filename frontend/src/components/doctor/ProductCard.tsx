import React from 'react';
import { Heart, Plus, Minus, Star, Zap, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<Props> = ({ product, compact = false }) => {
  const navigate = useNavigate();
  const { addToCart, updateQuantity, getItemQuantity, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const cartQty = getItemQuantity(product.id);
  const cartItem = items.find((i) => i.productId === product.id);

  const images = Array.isArray(product.images) ? product.images : [];
  const displayImage = images[0] || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80';

  const discountPercent = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : product.discount || 15;

  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 10);
  const isOutOfStock = product.stock === 0;

  return (
    <div
      onClick={() => navigate(`/product/${product.slug || product.id}`)}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 flex flex-col justify-between hover:shadow-xl hover:border-teal-500/50 transition-all duration-300 relative cursor-pointer"
    >
      {/* Top Ribbons & Wishlist */}
      <div className="relative">
        <div className="absolute top-0 left-0 z-10 flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
              BESTSELLER
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-0 right-0 z-10 w-8 h-8 rounded-full flex items-center justify-center transition ${
            inWishlist
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <div className="w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 mb-2.5">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80';
            }}
          />
        </div>

        {/* 15-MIN Delivery Badge */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5">
          <span className="text-teal-700 dark:text-teal-400 flex items-center gap-1 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3 text-teal-600 fill-teal-600" /> ⚡ 15-18 MINS
          </span>
          <span className="flex items-center gap-0.5 text-amber-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.avgRating || 4.8}</span>
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">
            {product.brand}
          </span>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5 leading-snug group-hover:text-teal-600 transition">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            {product.packSize || 'Standard Dental Clinic Pack'}
          </p>
        </div>

        {/* Price & Add Action */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-slate-900 dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-[10px] line-through text-slate-400 font-medium">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[9px] text-slate-400 font-semibold block">
              +{product.gstPercent || 12}% GST Input
            </span>
          </div>

          {/* Add to Cart or Stepper */}
          {isOutOfStock ? (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950 px-2.5 py-1.5 rounded-xl">
              Out of Stock
            </span>
          ) : cartQty > 0 && cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-teal-600 text-white rounded-xl p-1 shadow-md shadow-teal-600/20"
            >
              <button
                onClick={() => updateQuantity(cartItem.id, cartQty - 1)}
                className="w-5 h-5 rounded flex items-center justify-center hover:bg-teal-700 transition"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold w-4 text-center">{cartQty}</span>
              <button
                onClick={() => updateQuantity(cartItem.id, cartQty + 1)}
                className="w-5 h-5 rounded flex items-center justify-center hover:bg-teal-700 transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id, 1);
              }}
              className="bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-200 dark:border-teal-800 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
