import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Flame,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Clock,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import { Product, Category } from '../../types';
import { ProductCard } from '../../components/doctor/ProductCard';
import { WhatsAppPill } from '../../components/doctor/WhatsAppPill';
import { useCart } from '../../context/CartContext';

export const DoctorHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatSlug, setSelectedCatSlug] = useState<string>('all');
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [selectedBrandTab, setSelectedBrandTab] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 59, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 59, seconds: 30 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=50')
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
        if (prodRes.data.success) {
          const prods: Product[] = prodRes.data.products;
          setCatalogProducts(prods);
          setFlashSaleProducts(prods.slice(0, 4));
        }
      } catch (err) {
        console.error('Home page fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryPills = [
    { id: 'all', name: 'All Items', icon: '✨', slug: 'all' },
    { id: 'mat', name: 'Materials', icon: '🧴', slug: 'dental-materials' },
    { id: 'endo', name: 'Endodontics', icon: '🦷', slug: 'endodontics' },
    { id: 'inst', name: 'Instruments', icon: '⚡', slug: 'dental-instruments' },
    { id: 'scal', name: 'Scalers', icon: '🔬', slug: 'scalers-tips' },
    { id: 'glov', name: 'Gloves', icon: '🧤', slug: 'gloves' },
    { id: 'anes', name: 'Anaesthesia', icon: '💉', slug: 'local-anaesthesia' },
    { id: 'cons', name: 'Disposables', icon: '📦', slug: 'consumables' }
  ];

  const curatedKits = [
    {
      id: 'kit-1',
      title: 'Integrity Endodontic & Restorative Starter Kit',
      tag: 'Endo Choice',
      badgeColor: 'bg-emerald-500',
      items: [
        'Dentsply ProTaper Gold Rotary Files 25mm',
        '3M Filtek Z350 XT Composite (4g A2)',
        'Septodont Canal+ 17% EDTA Lubricant',
        'Disposable Suction Tips (100 Pcs)'
      ],
      price: 5290,
      mrp: 6800,
      savings: '22% B2B Savings',
      image: '/images/products/endo-plug-niti.jpg'
    },
    {
      id: 'kit-2',
      title: 'Ready-to-Office Composite Resin & Bleaching Kit',
      tag: 'Restoration',
      badgeColor: 'bg-teal-600',
      items: [
        '3M Single Bond Universal Adhesive 5ml',
        'Ivoclar Tetric N-Ceram Bulk Fill 3.5g',
        'Meta Dental 37% Etching Gel (3 Syringes)',
        'Waterproof Dental Bibs (500 Pcs)'
      ],
      price: 6490,
      mrp: 8100,
      savings: '20% Clinic Savings',
      image: '/images/products/healix-x3-light-cure.jpg'
    },
    {
      id: 'kit-3',
      title: 'Daily Clinic Hygiene & Disposables Megapack',
      tag: 'Hygiene & Safety',
      badgeColor: 'bg-sky-600',
      items: [
        'Karam Nitrile Medical Gloves (300 Pcs)',
        'Self-Sealing Autoclave Pouches (200 pcs)',
        'Rapid Chair Disinfectant Spray 5L',
        '3-Ply Dental Patient Bibs (500 pcs)'
      ],
      price: 3690,
      mrp: 4650,
      savings: '21% Bulk Savings',
      image: '/images/products/true-endo-nitrile-gloves.jpg'
    },
    {
      id: 'kit-4',
      title: 'Complete Orthodontics & Whitening Setup',
      tag: 'Ortho Special',
      badgeColor: 'bg-indigo-600',
      items: [
        '3M Unitek MBT 022 Metal Brackets (20 Kit)',
        'Super Elastic NiTi Archwires (10/pk Upper)',
        'Rhodium Front Surface Mirrors (12 pk)',
        'Dental Explorer & Tweed Pliers'
      ],
      price: 5890,
      mrp: 7500,
      savings: '21% Ortho Savings',
      image: '/images/products/fender-wedges.jpg'
    }
  ];

  const brandTabs = ['ALL', '3M ESPE', 'Dentsply', 'Mani', 'GC', 'Hu-Friedy', 'Woodpecker', 'Waldent', 'Karam'];

  const filteredCatalog = catalogProducts.filter((prod) => {
    const matchesBrand = selectedBrandTab === 'ALL' || prod.brand.toLowerCase().includes(selectedBrandTab.toLowerCase());
    return matchesBrand;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-3.5 pt-2.5">
        
        {/* 1. Compact Slim Promo Banner ("Little advertisement & small box") */}
        <section>
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white p-3.5 sm:p-5 shadow-sm border border-teal-800/40">
            <div 
              className="absolute inset-0 opacity-15 mix-blend-luminosity bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url('/images/hero-banner.jpg')` }}
            />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                  <span>⚡ 15-20 MIN HYPERLOCAL EXPRESS • SILVASSA HUB</span>
                </div>
                <h1 className="text-sm sm:text-xl font-black font-display tracking-tight text-white leading-tight">
                  Direct B2B Dental Supplies & Clinic Restock
                </h1>
                <p className="text-slate-300 text-[11px] max-w-xl hidden sm:block mt-0.5">
                  100% genuine composites, rotary files & consumables with B2B GST tax credit invoices.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/products"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[11px] sm:text-xs px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1"
                >
                  <span>All Products</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <a
                  href="https://wa.me/919316839711"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] sm:text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-xs"
                >
                  <span>💬 WhatsApp Order</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Compact Category Navigation (Blinkit/Amazon style round pills) */}
        <section>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryPills.map((pill) => {
              const isSelected = selectedCatSlug === pill.slug;
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    setSelectedCatSlug(pill.slug);
                    if (pill.slug !== 'all') {
                      navigate(`/products?category=${pill.slug}`);
                    }
                  }}
                  className="flex flex-col items-center gap-1 shrink-0 w-16 text-center group cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-xs transition-all duration-150 ${
                    isSelected
                      ? 'bg-teal-600 text-white ring-2 ring-teal-400 ring-offset-1 scale-105'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700'
                  }`}>
                    {pill.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full">
                    {pill.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. ⭐ PRIMARY DENTAL PRODUCTS CATALOG (Moved Directly Up for High Visibility) */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🦷</span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-display">
                Dental Products & Supplies ({filteredCatalog.length})
              </h2>
            </div>
            <Link to="/products" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">
              View All →
            </Link>
          </div>

          {/* Quick Brand Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none text-[11px]">
            {brandTabs.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrandTab(brand)}
                className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  selectedBrandTab === brand
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* High-Density 2-Column Mobile Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3.5">
            {filteredCatalog.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* 4. Compact FLASH SALE Deals */}
        <section>
          <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl p-3 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🔥</span>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  FLASH SALE — <span className="text-rose-600">Up to 40% OFF</span>
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-rose-900 text-white text-[10px] font-bold font-mono px-2 py-1 rounded-lg shadow-xs">
                <Clock className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400 font-black">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {flashSaleProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. Curated Dental Kits (Horizontal Swipeable Carousel - Won't take full screen height) */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📦</span>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-display">
                Curated Dental Kits & Combos
              </h2>
            </div>
            <Link to="/products" className="text-[11px] font-bold text-teal-600 hover:underline">
              All Kits →
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none snap-x">
            {curatedKits.map((kit) => (
              <div
                key={kit.id}
                className="w-64 sm:w-72 shrink-0 snap-start bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-3 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${kit.badgeColor}`}>
                      {kit.tag}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-bold">{kit.savings}</span>
                  </div>
                  <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 mb-2 p-1">
                    <img
                      src={kit.image}
                      alt={kit.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/products/endo-plug-niti.jpg';
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-[11px] text-slate-900 dark:text-white line-clamp-2">
                    {kit.title}
                  </h3>

                  <ul className="mt-2 space-y-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                    {kit.items.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1 truncate">
                        <span className="text-teal-500 font-bold">•</span>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        ₹{kit.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] line-through text-slate-400">
                        ₹{kit.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart('1', 1)}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                  >
                    Add Kit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Floating WhatsApp Live Button */}
      <WhatsAppPill />
    </div>
  );
};
