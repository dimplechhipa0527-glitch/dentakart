import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { Product, Category } from '../../types';
import { ProductCard } from '../../components/doctor/ProductCard';
import { FilterSidebar } from '../../components/doctor/FilterSidebar';
import { Search, SlidersHorizontal, Grid, List, RotateCcw } from 'lucide-react';
import { FALLBACK_PRODUCTS } from '../../data/fallbackProducts';

export const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  // Initialize with fallback products immediately to avoid 0 products display
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([
    '3M ESPE', 'Dentsply', 'Mani', 'GC', 'Hu-Friedy', 'Woodpecker', 'Waldent', 'Karam', 'True Endo Medical'
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Fetch categories & brands
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/brands')
        ]);
        if (catRes.data?.success && catRes.data.categories?.length > 0) {
          setCategories(catRes.data.categories);
        }
        if (brandRes.data?.success && brandRes.data.brands?.length > 0) {
          setBrands(brandRes.data.brands);
        }
      } catch (err) {
        console.warn('Meta fetch error', err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categoryParam) params.set('category', categoryParam);
        if (searchParam) params.set('search', searchParam);
        if (selectedBrands.length > 0) params.set('brand', selectedBrands.join(','));
        if (priceRange[1] < 10000) params.set('maxPrice', priceRange[1].toString());
        if (inStockOnly) params.set('inStock', 'true');
        params.set('sortBy', sortBy);
        params.set('limit', '60');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data?.success && res.data.products?.length > 0) {
          setProducts(res.data.products);
        } else if (categoryParam || searchParam || selectedBrands.length > 0) {
          // If offline or cloud empty, filter fallback products locally
          let filtered = [...FALLBACK_PRODUCTS];
          if (categoryParam) {
            filtered = filtered.filter(p => 
              p.category?.slug?.includes(categoryParam) || 
              p.categoryId?.includes(categoryParam) ||
              p.name.toLowerCase().includes(categoryParam.replace(/-/g, ' '))
            );
          }
          if (searchParam) {
            const q = searchParam.toLowerCase();
            filtered = filtered.filter(p => 
              p.name.toLowerCase().includes(q) || 
              p.brand.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q)
            );
          }
          if (selectedBrands.length > 0) {
            filtered = filtered.filter(p => selectedBrands.includes(p.brand));
          }
          setProducts(filtered);
        }
      } catch (err) {
        console.warn('Live products fetch error, filtering locally', err);
        let filtered = [...FALLBACK_PRODUCTS];
        if (categoryParam) {
          filtered = filtered.filter(p => 
            p.category?.slug?.includes(categoryParam) || 
            p.categoryId?.includes(categoryParam) ||
            p.name.toLowerCase().includes(categoryParam.replace(/-/g, ' '))
          );
        }
        if (searchParam) {
          const q = searchParam.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.brand.toLowerCase().includes(q)
          );
        }
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchParam, selectedBrands, priceRange, inStockOnly, sortBy]);

  const handleSelectCategory = (slug: string) => {
    if (slug) {
      searchParams.set('category', slug);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleReset = () => {
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-display">
            {categoryParam ? `Category: ${categoryParam.replace(/-/g, ' ')}` : searchParam ? `Search: "${searchParam}"` : 'Dental Products Catalog'}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Showing {products.length} surgical & restorative dental items available for B2B ordering
          </p>
        </div>

        {/* Action Controls & Sort */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="lg:hidden flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs text-slate-700 dark:text-slate-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
            <span>{showFiltersMobile ? 'Hide Filters' : 'Filters & Brands'}</span>
            {(selectedBrands.length > 0 || inStockOnly) && (
              <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
            )}
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-teal-500"
            >
              <option value="newest">Featured & Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Sidebar Filters (Hidden on mobile unless toggled so product cards show directly at top) */}
        <div className={`${showFiltersMobile ? 'block w-full' : 'hidden'} lg:block lg:w-64 shrink-0`}>
          <FilterSidebar
            categories={categories}
            selectedCategory={categoryParam}
            onSelectCategory={handleSelectCategory}
            brands={brands}
            selectedBrands={selectedBrands}
            onToggleBrand={handleToggleBrand}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            onReset={handleReset}
          />
        </div>

        {/* Product Grid */}
        <main className="flex-1 w-full">
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching dental products found</h3>
              <p className="text-xs text-slate-400">Try adjusting your filters, price range, or category selection.</p>
              <button
                onClick={handleReset}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3.5">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
