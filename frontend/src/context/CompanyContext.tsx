import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CompanySettings {
  companyName: string;
  ownerName: string;
  platformName: string;
  phone: string;
  email: string;
  gstin: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  dispatchHubName: string;
  packedByTag: string;
}

const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'Integrity Enterprises',
  ownerName: 'Krishna',
  platformName: 'DentaKart',
  phone: '+91 93168 39711',
  email: 'orders@dentakart.com',
  gstin: '27AABCD1234F1Z5',
  addressLine: 'Silvassa Main Market, Naroli Road',
  city: 'Silvassa',
  state: 'Dadra & Nagar Haveli',
  pincode: '396230',
  dispatchHubName: 'Silvassa Central Express Logistics Hub',
  packedByTag: 'Warehouse Station A-4'
};

const STORAGE_KEY = 'dentakart_company_settings';

interface CompanyContextType {
  settings: CompanySettings;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  resetSettings: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (err) {
      console.error('Failed to parse company settings from localStorage', err);
    }
    return DEFAULT_COMPANY_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to persist company settings', err);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_COMPANY_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COMPANY_SETTINGS));
    } catch (e) {}
  };

  return (
    <CompanyContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
