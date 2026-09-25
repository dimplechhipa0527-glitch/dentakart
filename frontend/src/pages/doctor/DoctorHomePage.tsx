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

  // Countdown timer for Flash Sale (02 : 59 : 30)
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
          api.get('/products?limit=30')
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
    { id: 'all', name: 'All Items', icon: '✨', sub: 'Explore All', slug: 'all' },
    { id: 'mat', name: 'Dental Materials', icon: '🧴', sub: '5+ items', slug: 'dental-materials' },
    { id: 'inst', name: 'Instruments & Scalers', icon: '⚡', sub: '4+ items', slug: 'dental-instruments' },
    { id: 'endo', name: 'Endodontics', icon: '🦷', sub: '6+ items', slug: 'endodontics' },
    { id: 'ortho', name: 'Orthodontics', icon: '✨', sub: '3+ items', slug: 'orthodontics' },
    { id: 'inf', name: 'Infection Control', icon: '🩺', sub: '4+ items', slug: 'infection-control' },
    { id: 'cons', name: 'Consumables & Bibs', icon: '📦', sub: '4+ items', slug: 'consumables' }
  ];

  const curatedKits = [
    {
      id: 'kit-1',
      title: 'Integrity Endodontic & Restorative Starter Kit',
      tag: 'Endodontist Best Choice',
      badgeColor: 'bg-emerald-500',
      items: [
        'Dentsply ProTaper Gold Rotary Files 25mm (6/pk)',
        '3M Filtek Z350 XT Composite (4g A2)',
        'Septodont Canal+ 17% EDTA Lubricant',
        'TopDent Disposable Suction Tips (100 Pcs)'
      ],
      price: 5290,
      mrp: 6800,
      savings: '22% B2B Bundle Savings',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'kit-2',
      title: 'Ready-to-Office Composite Resin & Restorative Bleaching Kit',
      tag: 'Aesthetic Restoration',
      badgeColor: 'bg-teal-600',
      items: [
        '3M Single Bond Universal Adhesive 5ml',
        'Ivoclar Tetric N-Ceram Bulk Fill 3.5g',
        'Meta Dental 37% Etching Gel (3 Syringes)',
        'Waldent Dental Bibs Waterproof (500 Pcs)'
      ],
      price: 6490,
      mrp: 8100,
      savings: '20% Clinic Savings',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'kit-3',
      title: 'Daily Clinic Hygiene & Disposables Megapack',
      tag: 'Infection Asepsis Protocol',
      badgeColor: 'bg-sky-600',
      items: [
        'Karam Nitrile Medical Gloves (3 Boxes x 100)',
        'Waldent Self-Sealing Autoclave Pouches (200 pcs)',
        'Bactoclean Rapid Chair Disinfectant Spray 5L',
        'Waldent 3-Ply Dental Bibs (500 pcs)'
      ],
      price: 3690,
      mrp: 4650,
      savings: '21% Bulk Clinic Savings',
      image: 'https://images.unsplash.com/photo-1583912267670-6575ad362e49?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'kit-4',
      title: 'Complete Orthodontics & Whitening Setup',
      tag: 'Super Saver Clinic',
      badgeColor: 'bg-indigo-600',
      items: [
        '3M Unitek MBT 022 Miniature Metal Brackets (20 Kit)',
        'G&H Super Elastic NiTi Archwires (10/pk Upper)',
        'Hu-Friedy Front Surface Rhodium Mirrors (12 pk)',
        'Dental Explorer Probe & Tweed Pliers'
      ],
      price: 5890,
      mrp: 7500,
      savings: '21% Ortho Savings',
      image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const brandTabs = ['ALL', '3M ESPE', 'Dentsply Sirona', 'Mani Inc.', 'GC Corporation', 'Hu-Friedy', 'Woodpecker', 'Waldent', 'Karam Healthcare'];

  const filteredCatalog = catalogProducts.filter((prod) => {
    const matchesBrand = selectedBrandTab === 'ALL' || prod.brand.toLowerCase().includes(selectedBrandTab.toLowerCase());
    return matchesBrand;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* 1. Hero Banner with 4K Dental Background */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white p-8 sm:p-12 shadow-2xl border border-teal-700/50">
          {/* Background Hero Image with Dark Gradient Mask */}
          <div 
            className="absolute inset-0 opacity-25 mix-blend-luminosity bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url('/images/hero-banner.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold px-3 py-1.5 rounded-full">
              <span>⚡ INTEGRITY ENTERPRISES • SILVASSA DENTAL HUB</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
              Direct B2B Dental Supplies <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-300">
                Express Clinic Restock
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Authentic composites, endodontic rotary files, impression materials, and clinical consumables supplied directly with B2B GST tax input credit invoices.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/products"
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg shadow-amber-400/20 transition flex items-center gap-2"
              >
                <span>Shop Dental Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919316839711"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-500/40 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl backdrop-blur-sm transition flex items-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <span>💬 Quick WhatsApp Order</span>
              </a>
            </div>
          </div>

          {/* Right Floating Badge Info */}
          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-md border border-teal-500/30 p-5 rounded-2xl w-72 space-y-3 text-xs shadow-2xl">
            <div className="flex items-center gap-2 text-teal-300 font-bold">
              <CheckCircle2 className="w-4 h-4" /> B2B GST Invoicing Enabled
            </div>
            <p className="text-slate-200 text-[11px] leading-relaxed">
              Every order generates computer-stamped tax invoices with HSN codes for hassle-free ITC reconciliation.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
              <span>Silvassa Hub: <strong>15-20 Mins</strong></span>
              <span className="text-emerald-400 font-bold">● Pan-India 24-48h</span>
            </div>
          </div>

          {/* Ambient light graphic */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 2. Shop by Dental Category (Horizontal Scroller Pills Matching Screenshot #4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🪥</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Shop by Dental Category</h2>
            </div>
            <p className="text-xs text-slate-500">Everything you need for clean teeth, healthy gums, and surgical precision</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills Row */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
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
                className={`flex-shrink-0 flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-500 text-teal-800 dark:text-teal-200 shadow-sm ring-1 ring-teal-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-400 hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">
                  {pill.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{pill.name}</h4>
                  <span className="text-[10px] text-slate-400">{pill.sub}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FLASH SALE — Up to 40% OFF with Timer (Matching Screenshot #4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-3xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm">
                🔥
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  FLASH SALE — <span className="text-rose-600">Up to 40% OFF</span>
                </h3>
                <p className="text-xs text-slate-500">Lightning deals on top dental products. Limited stock reserved for 15-min delivery.</p>
              </div>
            </div>

            {/* Countdown Badge matching screenshot */}
            <div className="flex items-center gap-1.5 bg-rose-900 text-white text-xs font-bold font-mono px-4 py-2 rounded-2xl shadow-md">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>ENDS IN</span>
              <span className="text-amber-400 font-black">
                {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Flash Sale Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashSaleProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Curated Dental Kits & Combos (Matching Screenshot #3 & #5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">📦</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
                Curated Dental Kits & Combos
              </h2>
            </div>
            <p className="text-xs text-slate-500">Bundled high-volume clinic replenishment sets with extra B2B discount</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">
            View All Combos ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {curatedKits.map((kit) => (
            <div
              key={kit.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 flex flex-col justify-between hover:shadow-xl hover:border-teal-500/40 transition-all duration-300"
            >
              <div>
                <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${kit.badgeColor}`}>
                  {kit.tag}
                </span>
                <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 mt-2 mb-3">
                  <img src={kit.image} alt={kit.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                  {kit.title}
                </h3>

                {/* Items checklist */}
                <ul className="mt-3 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  {kit.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 truncate">
                      <span className="text-teal-500 font-bold">•</span>
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      ₹{kit.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] line-through text-slate-400">
                      ₹{kit.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold block">{kit.savings}</span>
                </div>
                <button
                  onClick={() => addToCart('1', 1)}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition"
                >
                  Add Kit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Dental & Clinical Essentials Multi-Grid Catalog (Matching Screenshot #3 & #5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
                Dental & Clinical Essentials ({filteredCatalog.length} Items)
              </h2>
            </div>
            <p className="text-xs text-slate-500">All supplies verified with manufacturer warranty and HSN tax invoice</p>
          </div>

          {/* Brand Filter Tabs matching Screenshot */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {brandTabs.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrandTab(brand)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedBrandTab === brand
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {filteredCatalog.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Floating WhatsApp Live Pill matching screenshot */}
      <WhatsAppPill />
    </div>
  );
};
