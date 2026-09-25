import React, { createContext, useContext, useState, useEffect } from 'react';

export type ViewMode = 'desktop' | 'mobile';
export type DeviceType = 'iphone' | 'android';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  deviceType: DeviceType;
  setDeviceType: (type: DeviceType) => void;
  deviceScale: number;
  setDeviceScale: (scale: number) => void;
  isRotated: boolean;
  setIsRotated: (val: boolean | ((prev: boolean) => boolean)) => void;
  isRealMobile: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const ViewModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('dentakart_view_mode');
    return (saved as ViewMode) || 'desktop';
  });

  const [deviceType, setDeviceType] = useState<DeviceType>('iphone');
  const [deviceScale, setDeviceScale] = useState<number>(100);
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [isRealMobile, setIsRealMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 768;
      setIsRealMobile(isMobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('dentakart_view_mode', mode);
  };

  const toggleViewMode = () => {
    const nextMode = viewMode === 'desktop' ? 'mobile' : 'desktop';
    setViewMode(nextMode);
  };

  return (
    <ViewModeContext.Provider
      value={{
        viewMode,
        setViewMode,
        toggleViewMode,
        deviceType,
        setDeviceType,
        deviceScale,
        setDeviceScale,
        isRotated,
        setIsRotated,
        isRealMobile
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = (): ViewModeContextType => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};
