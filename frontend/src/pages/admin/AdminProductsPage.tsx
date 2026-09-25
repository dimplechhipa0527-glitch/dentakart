import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, Star, AlertCircle } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { ProductModal } from '../../components/admin/ProductModal';
import api from '../../services/api';
import { Product, Category } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get(`/products/admin/all${search ? `?search=${encodeURIComponent(search)}` : ''}`),
        api.get('/categories')
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await api.delete(`/products/admin/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="DENTAL PRODUCT CATALOG MANAGEMENT"
        subtitle="Add, edit, set GST slabs, manage inventory SKUs, and configure featured promotions"
        actionButton={
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Dental Product
          </button>
        }
      />

      <div className="p-6 space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, SKU, or manufacturer..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-teal-500 shadow-xs"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">Total: {products.length} Products</span>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-4">Product Info</th>
                  <th className="py-3 px-4">SKU / HSN</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Price / MRP</th>
                  <th className="py-3 px-4">GST %</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Loading dental catalog...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No products found. Click "Add Dental Product" above to create one.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => {
                    const isLow = prod.stock > 0 && prod.stock <= (prod.lowStockThreshold || 10);
                    const isOut = prod.stock === 0;

                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0] || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=100&q=80'}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div className="max-w-xs">
                              <p className="font-bold text-slate-900 dark:text-white truncate">{prod.name}</p>
                              <span className="text-[11px] text-slate-500">{prod.packSize}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-teal-600 block">{prod.sku}</span>
                          <span className="text-[10px] text-slate-400">HSN: {prod.hsnCode || '90184900'}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {prod.brand}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 dark:text-white block">₹{prod.price.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] line-through text-slate-400">₹{prod.mrp.toLocaleString('en-IN')}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-teal-700 dark:text-teal-400">
                          {prod.gstPercent || 12}%
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              isOut
                                ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                                : isLow
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {prod.stock} Units
                          </span>
                        </td>
                        <td className="py-3.5 px-4 space-x-1">
                          {prod.isFeatured && (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                              ⭐ Featured
                            </span>
                          )}
                          {prod.isBestseller && (
                            <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                              🔥 Bestseller
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(prod);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950 hover:bg-red-100 text-red-600 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        categories={categories}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
      />
    </div>
  );
};
