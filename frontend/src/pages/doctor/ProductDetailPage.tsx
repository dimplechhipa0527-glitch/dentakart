import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  Heart,
  Plus,
  Minus,
  CheckCircle2,
  FileText,
  Building,
  Award,
  Share2
} from 'lucide-react';
import api from '../../services/api';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProductCard } from '../../components/doctor/ProductCard';
import { ReviewModal } from '../../components/doctor/ReviewModal';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { addToCart, openExpressCheckout, getItemQuantity, updateQuantity, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await api.get(`/products/${slug}`);
      if (res.data.success) {
        setProduct(res.data.product);
        const imgs = Array.isArray(res.data.product.images) ? res.data.product.images : [];
        setSelectedImg(imgs[0] || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading dental product details & clinical specs...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <button onClick={() => navigate('/products')} className="text-teal-600 font-bold text-xs hover:underline">
          Return to Product Catalog
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : product.discount || 15;

  const handleBuyNow = async () => {
    await addToCart(product.id, qty);
    openExpressCheckout();
  };

  const images = Array.isArray(product.images) ? product.images : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative w-full h-80 sm:h-[420px] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex items-center justify-center shadow-xs">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-2xl flex items-center justify-center transition ${
                inWishlist ? 'bg-rose-50 text-rose-500 shadow-sm' : 'bg-slate-100 text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
            </button>
            <img
              src={selectedImg}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 p-1 bg-white dark:bg-slate-900 transition ${
                    selectedImg === img ? 'border-teal-500 shadow-sm' : 'border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <img
                    src={img}
                    alt="Thumb"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Section */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 mb-1">
              <span className="uppercase tracking-wider">{product.brand}</span>
              <span>•</span>
              <span className="text-slate-400 font-mono">SKU: {product.sku}</span>
              <span>•</span>
              <span className="text-slate-400 font-mono">HSN: {product.hsnCode || '90184900'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display leading-snug">
              {product.name}
            </h1>

            {/* Rating & Fast Delivery Pill */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-xl text-xs font-bold border border-amber-200/60">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.avgRating || 4.8}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount || product.reviews?.length || 12} Verified Doctor Reviews)</span>
              </div>

              <div className="flex items-center gap-1 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-xl text-xs font-bold border border-teal-200 dark:border-teal-800">
                <Zap className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
                <span>⚡ 15-Min Delivery Available</span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-sm line-through text-slate-400">
                  MRP: ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                Save ₹{(product.mrp - product.price).toLocaleString('en-IN')} ({discountPercent}% OFF)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Tax: +{product.gstPercent || 12}% GST eligible for 100% B2B Input Tax Credit (ITC)
            </p>
          </div>

          {/* Stock & Pack Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Pack Size / Content</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{product.packSize || 'Standard Pack'}</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Stock Availability</span>
              <p className={`font-bold mt-0.5 ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} Units Available)` : 'Out of Stock'}
              </p>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-black w-6 text-center text-slate-900 dark:text-white">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => addToCart(product.id, qty)}
                disabled={product.stock === 0}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                <Zap className="w-4 h-4" /> Buy Now
              </button>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>100% Genuine</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <Award className="w-4 h-4 text-teal-600 shrink-0" />
              <span>ITC GST Bill</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <RotateCcw className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Easy Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="lg:col-span-7 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Clinical Description & Indications</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description || 'Precision dental medical supply manufactured to international sterilization and clinical performance standards.'}
            </p>

            {product.expiryInfo && (
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl text-xs font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Expiry / Shelf Life: {product.expiryInfo}</span>
              </div>
            )}
          </div>

          {/* Technical Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Technical Specifications</h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="py-2.5 flex justify-between">
                    <span className="font-semibold text-slate-500">{key}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Reviews */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Doctor Reviews</h3>
                <p className="text-xs text-slate-500">Verified clinical evaluations</p>
              </div>
              <button
                onClick={() => setIsReviewOpen(true)}
                className="bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 text-xs font-bold px-3 py-1.5 rounded-xl transition"
              >
                + Write Review
              </button>
            </div>

            {/* Review Cards */}
            <div className="space-y-3">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{rev.doctorName}</span>
                        {rev.clinicName && <span className="text-[10px] text-teal-600 block">{rev.clinicName}</span>}
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    {rev.title && <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{rev.title}</h4>}
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs space-y-1">
                  <Star className="w-6 h-6 mx-auto opacity-30" />
                  <p>Be the first verified doctor to review this item!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
            Frequently Bought Together in {product.category?.name || 'Category'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {product.relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        productId={product.id}
        productName={product.name}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onReviewSubmitted={fetchProduct}
      />
    </div>
  );
};
