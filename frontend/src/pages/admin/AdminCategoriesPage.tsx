import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Trash2, Edit2, ChevronRight, Package } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import api from '../../services/api';
import { Category } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/categories/admin', {
        name: name.trim(),
        description: description.trim() || undefined,
        parentId: parentId || undefined
      });
      setName('');
      setDescription('');
      setParentId('');
      setIsAddOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    try {
      await api.delete(`/categories/admin/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="DENTAL TAXONOMY & CATEGORIES"
        subtitle="Manage primary product branches (Dental Materials, Endodontics, Instruments) and subcategories"
        actionButton={
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Category / Subcategory
          </button>
        }
      />

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                    🦷
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">slug: {cat.slug}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {cat.description && (
                <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
              )}

              {/* Subcategories */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Subcategories ({cat.subcategories?.length || 0})
                </span>
                <div className="space-y-1">
                  {cat.subcategories?.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{sub.name}</span>
                      <button
                        onClick={() => handleDelete(sub.id, sub.name)}
                        className="text-slate-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add Dental Category</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ultrasonic Scalers or Prosthodontics"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Parent Category (Optional for Subcategory)</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
                >
                  <option value="">None (Top-Level Primary Branch)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short explanation of items in this category"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
