import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  Copy,
  Check,
  Wifi,
  BatteryCharging,
  QrCode,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useViewMode } from '../../context/ViewModeContext';

interface Props {
  children: React.ReactNode;
}

export const MobileSimulatorFrame: React.FC<Props> = ({ children }) => {
  const {
    viewMode,
    setViewMode,
    deviceType,
    setDeviceType,
    deviceScale,
    setDeviceScale,
    isRotated,
    setIsRotated,
    isRealMobile
  } = useViewMode();

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // If already on an actual mobile device, or desktop view is selected, render children normally
  if (isRealMobile || viewMode === 'desktop') {
    return <>{children}</>;
  }

  const networkUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:5173`
    : 'http://10.50.3.132:5173';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(networkUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const frameWidth = isRotated ? '780px' : '412px';
  const frameHeight = isRotated ? '412px' : '840px';

  return (
    <div className="min-h-screen bg-slate-950/95 text-slate-100 flex flex-col items-center justify-start py-4 px-2 relative overflow-x-hidden selection:bg-teal-500 selection:text-white">
      {/* 1. Top Simulator Control Bar */}
      <header className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xl z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-teal-400 font-display flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> DentaKart Mobile Simulator
            </span>
          </div>

          <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-xl text-[11px] font-semibold border border-slate-700">
            <button
              onClick={() => setDeviceType('iphone')}
              className={`px-3 py-1 rounded-lg transition ${
                deviceType === 'iphone' ? 'bg-teal-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              iPhone 16 Pro
            </button>
            <button
              onClick={() => setDeviceType('android')}
              className={`px-3 py-1 rounded-lg transition ${
                deviceType === 'android' ? 'bg-teal-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Galaxy S25 Ultra
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Rotate */}
          <button
            onClick={() => setIsRotated(!isRotated)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 transition"
            title="Rotate Device Orientation"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isRotated ? 'Landscape' : 'Portrait'}</span>
          </button>

          {/* Zoom scale */}
          <div className="hidden lg:flex items-center bg-slate-800 rounded-xl border border-slate-700 p-0.5 text-[10px] font-bold">
            {[100, 90, 80].map((s) => (
              <button
                key={s}
                onClick={() => setDeviceScale(s)}
                className={`px-2 py-1 rounded-lg transition ${
                  deviceScale === s ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}%
              </button>
            ))}
          </div>

          {/* Wi-Fi IP / Mobile URL */}
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1.5 bg-teal-950/80 hover:bg-teal-900/80 text-teal-300 border border-teal-700/60 px-3 py-1.5 rounded-xl font-bold transition text-xs"
            title="Copy network URL to open on your actual mobile phone"
          >
            <Wifi className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Phone URL:</span>
            <span className="underline decoration-teal-500/50">{networkUrl.replace('http://', '')}</span>
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
          </button>

          {/* Switch back to Full Desktop */}
          <button
            onClick={() => setViewMode('desktop')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black px-3.5 py-1.5 rounded-xl shadow-md shadow-teal-600/20 transition"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Switch to Desktop View</span>
          </button>
        </div>
      </header>

      {/* 2. Realistic Phone Frame */}
      <main
        className="relative transition-all duration-300 origin-top flex items-center justify-center my-auto"
        style={{
          transform: `scale(${deviceScale / 100})`
        }}
      >
        {/* Device Outer Metallic Chassis */}
        <div
          className="relative bg-slate-900 border-[10px] sm:border-[12px] border-slate-800 rounded-[50px] sm:rounded-[56px] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_2px_rgba(255,255,255,0.08)] overflow-hidden transition-all duration-300"
          style={{
            width: frameWidth,
            height: frameHeight,
            maxWidth: '96vw',
            maxHeight: 'calc(100vh - 110px)'
          }}
        >
          {/* Volume and Power Button Silhouettes on Frame */}
          <div className="absolute -left-[14px] top-28 w-[4px] h-12 bg-slate-700 rounded-l-md pointer-events-none" />
          <div className="absolute -left-[14px] top-44 w-[4px] h-12 bg-slate-700 rounded-l-md pointer-events-none" />
          <div className="absolute -right-[14px] top-36 w-[4px] h-16 bg-slate-700 rounded-r-md pointer-events-none" />

          {/* Top Notch / Dynamic Island */}
          {!isRotated && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none">
              <div className="bg-black text-white px-3.5 py-1 rounded-full flex items-center gap-2 shadow-lg border border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                <span className="text-[10px] font-bold text-teal-400 tracking-wider">⚡ 15-MIN</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          )}

          {/* Mobile Status Bar (Time, Battery, 5G, Wifi) */}
          <div className="bg-slate-900 text-white text-[11px] font-bold px-6 pt-2 pb-1 flex items-center justify-between z-40 select-none border-b border-slate-800/60">
            <span>{currentTime}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-teal-500/20 text-teal-400 px-1 rounded">5G</span>
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex items-center gap-1">
                <span className="text-[10px]">98%</span>
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Scrollable Phone Screen Contents */}
          <div className="w-full h-[calc(100%-32px)] overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-950 scroll-smooth">
            {children}
          </div>

          {/* Bottom Home Indicator Bar (iOS / Android Gestures) */}
          {!isRotated && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600/70 hover:bg-slate-400 rounded-full z-50 pointer-events-none" />
          )}
        </div>
      </main>
    </div>
  );
};
