import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Zap,
  Truck,
  CheckCircle2,
  X,
  AlertCircle,
  Building2,
  Sparkles,
  Compass
} from 'lucide-react';
import { useLocationContext, PRESET_HUBS, PresetHub } from '../../context/LocationContext';

export const LocationModal: React.FC = () => {
  const {
    location,
    isGpsLoading,
    gpsError,
    isLocationModalOpen,
    setIsLocationModalOpen,
    detectGpsLocation,
    selectPresetLocation,
    setCustomLocation
  } = useLocationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [customPincode, setCustomPincode] = useState('');
  const [customCity, setCustomCity] = useState('');

  if (!isLocationModalOpen) return null;

  const filteredHubs = PRESET_HUBS.filter((h) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.area.toLowerCase().includes(q) ||
      h.state.toLowerCase().includes(q) ||
      h.pincode.includes(q)
    );
  });

  const handleGpsClick = async () => {
    const success = await detectGpsLocation();
    if (success) {
      setTimeout(() => {
        setIsLocationModalOpen(false);
      }, 900);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim() || searchQuery.trim()) {
      const city = customCity.trim() || searchQuery.trim();
      setCustomLocation({
        city,
        area: searchQuery.trim() || 'Clinical Zone',
        pincode: customPincode.trim() || '400001',
        shortName: `${city} Hub`,
        formattedAddress: `${searchQuery.trim() || 'Dental Clinic'}, ${city} - ${customPincode.trim()}`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-850 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-teal-500/10 via-transparent to-slate-50 dark:to-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display">
                Select Clinic Delivery Location
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                GPS auto-detection & Pan-India dental supply network
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* GPS Auto-Detect Button */}
          <div className="space-y-2">
            <button
              onClick={handleGpsClick}
              disabled={isGpsLoading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white p-4 rounded-2xl shadow-lg shadow-teal-600/25 transition-all duration-300 flex items-center justify-between group disabled:opacity-75"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition">
                  {isGpsLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Navigation className="w-5 h-5 fill-white" />
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm">
                      {isGpsLoading ? 'Detecting GPS Coordinates...' : 'Use Current GPS Location'}
                    </span>
                    <span className="bg-emerald-400/20 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/30">
                      ⚡ HIGH ACCURACY
                    </span>
                  </div>
                  <p className="text-xs text-teal-100 mt-0.5">
                    Automatically locates your clinic & enables 15-minute emergency dispatch
                  </p>
                </div>
              </div>
              <Compass className="w-6 h-6 text-teal-200 shrink-0 hidden sm:block group-hover:rotate-45 transition duration-300" />
            </button>

            {gpsError && (
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
                <div>
                  <p className="font-bold">Clinic Delivery Hub</p>
                  <p className="text-[11px] opacity-90 mt-0.5">{gpsError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Select Express City Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              ⚡ Quick 1-Tap Express Delivery Hubs
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_HUBS.map((hub) => (
                <button
                  key={hub.city}
                  onClick={() => {
                    selectPresetLocation(hub);
                    setIsLocationModalOpen(false);
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer ${
                    location.city.toLowerCase() === hub.city.toLowerCase()
                      ? 'bg-teal-600 text-white shadow-xs scale-105 ring-2 ring-teal-400 ring-offset-1'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>⚡ {hub.city}</span>
                  <span className="text-[9px] opacity-75 font-mono">15-20m</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Active Location Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Current Selected Location
                </span>
                {location.isGpsDetected && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> GPS Active
                  </span>
                )}
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {location.shortName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {location.formattedAddress}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-xl shadow-xs ${
                location.deliveryType === 'EXPRESS_LOCAL'
                  ? 'bg-teal-500 text-white'
                  : 'bg-indigo-600 text-white'
              }`}>
                {location.deliveryType === 'EXPRESS_LOCAL' ? (
                  <Zap className="w-3.5 h-3.5 fill-white" />
                ) : (
                  <Truck className="w-3.5 h-3.5" />
                )}
                {location.deliveryTimeEstimate}
              </span>
              <p className="text-[10px] text-slate-400 font-mono mt-1">{location.deliveryHub}</p>
            </div>
          </div>

          {/* Search Hub / City */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Search Dental Clinic City, Area or Pincode
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type city (e.g. Silvassa, Mumbai, Ahmedabad, Surat, Delhi, Pune, 396230)..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
          </div>

          {/* Major Dental Supply Hubs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600" /> Major Dental Supply Corridors ({filteredHubs.length})
              </span>
              <span className="text-[10px] text-slate-400">Click to set delivery destination</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {filteredHubs.map((hub) => {
                const isSelected = location.city.toLowerCase() === hub.city.toLowerCase();
                return (
                  <button
                    key={hub.name}
                    onClick={() => selectPresetLocation(hub)}
                    className={`p-3 rounded-2xl border text-left transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 shadow-xs'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs text-slate-900 dark:text-white">
                          {hub.city}
                        </span>
                        {hub.city === 'Silvassa' && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                            HQ
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {hub.area}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">PIN: {hub.pincode}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                      hub.type === 'EXPRESS_LOCAL'
                        ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}>
                      {hub.deliveryTime}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Serving over 10,000+ Dental Clinics & Hospitals pan-India</span>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl transition"
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
