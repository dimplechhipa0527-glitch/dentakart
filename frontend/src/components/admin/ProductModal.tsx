import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Check } from 'lucide-react';
import { Product, Category } from '../../types';
import api from '../../services/api';

interface Props {
  product: Product | null; // null if creating new
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductModal: React.FC<Props> = ({ product, categories, isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [hsnCode, setHsnCode] = useState('90184900');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [discount, setDiscount] = useState('0');
  const [gstPercent, setGstPercent] = useState('12');
  const [stock, setStock] = useState('50');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [packSize, setPackSize] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [expiryInfo, setExpiryInfo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setBrand(product.brand);
      setSku(product.sku);
      setHsnCode(product.hsnCode || '90184900');
      setCategoryId(product.categoryId);
      setPrice(product.price.toString());
      setMrp(product.mrp.toString());
      setDiscount((product.discount || 0).toString());
      setGstPercent((product.gstPercent || 12).toString());
      setStock(product.stock.toString());
      setLowStockThreshold((product.lowStockThreshold || 10).toString());
      setPackSize(product.packSize || '');
      setManufacturer(product.manufacturer || '');
      setExpiryInfo(product.expiryInfo || '');
      setImagesList(Array.isArray(product.images) ? product.images : []);
      setDescription(product.description || '');
      setIsFeatured(Boolean(product.isFeatured));
      setIsBestseller(Boolean(product.isBestseller));
    } else {
      // Default new product values
      setName('');
      setBrand('');
      setSku(`DNT-${Date.now().toString().slice(-6)}`);
      setHsnCode('90184900');
      setCategoryId(categories[0]?.id || '');
      setPrice('');
      setMrp('');
      setDiscount('15');
      setGstPercent('12');
      setStock('50');
      setLowStockThreshold('10');
      setPackSize('');
      setManufacturer('');
      setExpiryInfo('24 months from Mfg');
      setImagesList(['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80']);
      setDescription('');
      setIsFeatured(false);
      setIsBestseller(false);
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const img = new Image();
          img.src = result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_DIM = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_DIM) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              }
            } else {
              if (height > MAX_DIM) {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);

            setImagesList((prev) => [...prev, compressed]);
          };
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImagesList([...imagesList, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImagesList(imagesList.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand || !sku || !categoryId || !price) {
      alert('Please fill all mandatory product fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        brand,
        sku,
        hsnCode,
        categoryId,
        price: parseFloat(price),
        mrp: parseFloat(mrp || price),
        discount: parseFloat(discount || '0'),
        gstPercent: parseFloat(gstPercent || '12'),
        stock: parseInt(stock, 10),
        lowStockThreshold: parseInt(lowStockThreshold, 10),
        packSize: packSize || 'Standard Box',
        manufacturer: manufacturer || brand,
        expiryInfo,
        images: imagesList.length > 0 ? imagesList : ['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'],
        description,
        isFeatured,
        isBestseller
      };

      if (product) {
        await api.put(`/products/admin/${product.id}`, payload);
      } else {
        await api.post('/products/admin', payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
              {product ? 'Edit Dental Product' : 'Add New Dental Product'}
            </h3>
            <p className="text-xs text-slate-500 truncate">B2B dental materials, instruments & equipment</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 3M Filtek Z350 XT Universal Restorative Composite"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>

            {/* Brand */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Brand / Manufacturer *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. 3M ESPE, Dentsply, Mani, GC"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>

            {/* SKU */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">SKU Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. DNT-3M-Z350-A2"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono outline-none focus:border-teal-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Dental Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.parent ? `(${cat.parent.name})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* HSN Code */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">GST HSN Code</label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                placeholder="e.g. 90184900"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono outline-none focus:border-teal-500"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Selling Price (₹) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1850"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-bold outline-none focus:border-teal-500"
              />
            </div>

            {/* MRP */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">MRP (₹) *</label>
              <input
                type="number"
                required
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="2100"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>

            {/* GST % */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">GST Slab (%)</label>
              <select
                value={gstPercent}
                onChange={(e) => setGstPercent(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              >
                <option value="5">5% (Latex/Nitrile Gloves, Disposables)</option>
                <option value="12">12% (Composite, Cements, Endodontic Files)</option>
                <option value="18">18% (Instruments, Scalers, Disinfectants)</option>
              </select>
            </div>

            {/* Stock Quantity */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Opening Stock Units *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 font-bold"
              />
            </div>

            {/* Pack Size */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Pack / Kit Size *</label>
              <input
                type="text"
                required
                value={packSize}
                onChange={(e) => setPackSize(e.target.value)}
                placeholder="e.g. 1 x 4g Syringe (Shade A2)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>

            {/* Expiry Info */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Expiry Information</label>
              <input
                type="text"
                value={expiryInfo}
                onChange={(e) => setExpiryInfo(e.target.value)}
                placeholder="e.g. 24 months from Mfg (Min 18 mo shelf life)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Product Photos / Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300">Product Photos</label>
              <span className="text-[11px] text-slate-400">First image will be the primary catalog thumbnail</span>
            </div>

            {/* Direct Device Upload Dropzone */}
            <div className="relative border-2 border-dashed border-teal-500/40 hover:border-teal-500 dark:border-teal-500/30 rounded-2xl p-4 text-center bg-teal-50/40 dark:bg-teal-950/20 transition group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="product-image-upload"
              />
              <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  📁 Click or Drag to Upload Photos from your Device / Phone
                </p>
                <p className="text-[10px] text-slate-400">
                  Supports JPG, PNG, WEBP (Auto-optimized & compressed)
                </p>
              </div>
            </div>

            {/* Optional URL Paste Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste direct image URL (https://...)"
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-teal-500 text-xs"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded-xl font-bold text-xs transition"
              >
                + Add Link
              </button>
            </div>

            {/* Image Thumbnails Gallery */}
            {imagesList.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {imagesList.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden group shadow-sm bg-slate-100 dark:bg-slate-800">
                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 right-1 bg-teal-600/90 text-white text-[9px] font-black text-center py-0.5 rounded shadow-xs pointer-events-none">
                        MAIN
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Clinical Product Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Indicate key features, indications, polish retention, curing time, tensile strength..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-teal-500 resize-none"
            />
          </div>

          {/* Badges Toggle */}
          <div className="flex items-center gap-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span>⭐ Mark Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span>🔥 Mark Bestseller</span>
            </label>
          </div>

          {/* Submit */}
          <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-3 pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 shadow-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 transition disabled:opacity-50 text-xs"
            >
              {submitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
