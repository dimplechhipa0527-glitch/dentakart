import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { Product, Category } from '../../types';
import { ProductCard } from '../../components/doctor/ProductCard';
import { FilterSidebar } from '../../components/doctor/FilterSidebar';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';

export const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Fetch categories & brands
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/brands')
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (brandRes.data.success) setBrands(brandRes.data.brands);
      } catch (err) {
        console.error(err);
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
        params.set('limit', '50');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error(err);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
            {categoryParam ? `Category: ${categoryParam.replace(/-/g, ' ')}` : searchParam ? `Search: "${searchParam}"` : 'Dental Products Catalog'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {products.length} surgical & restorative dental items available for B2B ordering
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-teal-500"
          >
            <option value="newest">Featured & Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
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

        {/* Product Grid */}
        <main className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching dental products found</h3>
              <p className="text-xs text-slate-400">Try adjusting your filters, price range, or category selection.</p>
              <button
                onClick={handleReset}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
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
