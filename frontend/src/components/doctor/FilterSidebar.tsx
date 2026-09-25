import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Check, RotateCcw, Filter } from 'lucide-react';
import { Category } from '../../types';

interface Props {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  brands: string[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<Props> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  brands,
  selectedBrands,
  onToggleBrand,
  priceRange,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  onReset
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'dental-materials': true,
    'endodontics': true,
    'dental-instruments': true
  });

  const toggleExpand = (slug: string) => {
    setExpandedCategories((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-teal-600 flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* In-Stock Only Switch */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
        <label htmlFor="in-stock-toggle" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          ⚡ In-Stock Only
        </label>
        <input
          id="in-stock-toggle"
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onToggleInStock(e.target.checked)}
          className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
        />
      </div>

      {/* Categories Tree */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Dental Taxonomy
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === ''
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Dental Categories
          </button>

          {categories.map((cat) => {
            const isExpanded = !!expandedCategories[cat.slug];
            const isSelected = selectedCategory === cat.slug;

            return (
              <div key={cat.id} className="space-y-0.5">
                <div className="flex items-center justify-between group">
                  <button
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`flex-1 text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <button
                      onClick={() => toggleExpand(cat.slug)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {isExpanded && cat.subcategories && (
                  <div className="pl-4 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-2">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => onSelectCategory(sub.slug)}
                        className={`w-full text-left px-2 py-1 rounded text-[11px] font-medium transition ${
                          selectedCategory === sub.slug
                            ? 'text-teal-600 font-bold bg-teal-50/60 dark:bg-teal-950/40'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        • {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Trusted Brands
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {brands.map((b) => {
            const checked = selectedBrands.includes(b);
            return (
              <label
                key={b}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs text-slate-700 dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleBrand(b)}
                  className="w-3.5 h-3.5 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className={checked ? 'font-bold text-teal-700 dark:text-teal-300' : ''}>{b}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-400 uppercase tracking-wider">Price (₹)</label>
          <span className="font-bold text-teal-600">Up to ₹{priceRange[1].toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="100"
          max="10000"
          step="100"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value, 10)])}
          className="w-full accent-teal-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>₹100</span>
          <span>₹5,000</span>
          <span>₹10,000+</span>
        </div>
      </div>
    </aside>
  );
};
