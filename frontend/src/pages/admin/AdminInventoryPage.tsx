import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, CheckCircle2, XCircle, Search, SlidersHorizontal, History, RefreshCw, Plus, Minus } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StockAdjustmentModal } from '../../components/admin/StockAdjustmentModal';
import api from '../../services/api';
import { Product } from '../../types';

export const AdminInventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalProducts: 0, outOfStockCount: 0, lowStockCount: 0, totalUnits: 0 });
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await api.get(`/inventory?${params.toString()}`);
      if (res.data.success) {
        setInventory(res.data.inventory);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get('/inventory/logs');
      if (res.data.success) {
        setLogs(res.data.logs);
        setIsLogsOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter, search]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminHeader
        title="Inventory & Stock"
        subtitle="Manage real-time stock levels, low-stock threshold triggers, and track restock audit history"
        actionButton={
          <button
            onClick={fetchLogs}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0"
          >
            <History className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Audit Logs</span>
            <span className="sm:hidden">Logs</span>
          </button>
        }
      />

      <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
        {/* Inventory Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Products</span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{stats.totalProducts}</p>
            <span className="text-[10px] text-slate-400 block truncate">Active Catalog Items</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-0.5 sm:space-y-1 shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Warehouse Units</span>
            <p className="text-xl sm:text-2xl font-black text-teal-600">{stats.totalUnits.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-emerald-600 font-bold block truncate">Physical Stock</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/20 space-y-0.5 sm:space-y-1 shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-600">Low Stock SKUs</span>
            <p className="text-xl sm:text-2xl font-black text-amber-600">{stats.lowStockCount}</p>
            <span className="text-[10px] text-amber-600 font-bold block truncate">Stock ≤ 15 Units</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/20 space-y-0.5 sm:space-y-1 shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-rose-600">Out of Stock</span>
            <p className="text-xl sm:text-2xl font-black text-rose-600">{stats.outOfStockCount}</p>
            <span className="text-[10px] text-rose-600 font-bold block truncate">Zero Inventory</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-2.5">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product inventory by name or SKU..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-teal-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {['ALL', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                  statusFilter === st
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Mobile Card View (< md) */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold">Loading inventory levels...</p>
            </div>
          ) : inventory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-4">
              <p className="text-xs font-semibold">No matching inventory items found.</p>
            </div>
          ) : (
            inventory.map((item) => {
              const isOut = item.stock === 0;
              const isLow = item.stock > 0 && item.stock <= (item.lowStockThreshold || 10);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-200/50 dark:border-teal-800/50 inline-block mb-1">
                        {item.brand}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        SKU: {item.sku}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Available</span>
                      <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                        {item.stock}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                        isOut
                          ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : isLow
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      ● {item.stockStatus}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedProduct(item);
                        setIsAdjustModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-teal-600/20 active:scale-95"
                    >
                      <span>Adjust Stock</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. Desktop Full Table View (>= md) */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-4">Dental Product</th>
                  <th className="py-3 px-4">Brand & Category</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4 text-center">Available Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Stock Calibration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Loading inventory levels...
                    </td>
                  </tr>
                ) : inventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No matching inventory items found.
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => {
                    const isOut = item.stock === 0;
                    const isLow = item.stock > 0 && item.stock <= (item.lowStockThreshold || 10);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                          <span className="text-[11px] text-slate-500">{item.packSize}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{item.brand}</span>
                          <span className="text-[10px] text-slate-400">{item.category?.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-teal-600">
                          {item.sku}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                            {item.stock}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1 ${
                              isOut
                                ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                                : isLow
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            ● {item.stockStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedProduct(item);
                              setIsAdjustModalOpen(true);
                            }}
                            className="bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold px-3 py-1.5 rounded-xl transition"
                          >
                            + / - Adjust Stock
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

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        product={selectedProduct}
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onSuccess={fetchInventory}
      />

      {/* Logs Modal */}
      {isLogsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-4 sm:p-6 space-y-4 border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Inventory Stock Audit Trail</h3>
              <button onClick={() => setIsLogsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {logs.length === 0 ? (
                <p className="py-8 text-center text-slate-400">No stock adjustment logs recorded yet.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="py-3 flex justify-between items-center gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{log.product?.name}</p>
                      <span className="text-[11px] text-slate-400 block">Reason: {log.reason || log.changeType}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-teal-600 block">
                        {log.previousStock} ➔ {log.newStock}
                      </span>
                      <span className="text-[10px] text-slate-400 block">By: {log.adminName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
