import React, { createContext, useContext, useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface UserLocation {
  formattedAddress: string;
  shortName: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isGpsDetected: boolean;
  deliveryTimeEstimate: string;
  deliveryType: 'EXPRESS_LOCAL' | 'PAN_INDIA_AIR';
  deliveryHub: string;
}

export interface PresetHub {
  name: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  type: 'EXPRESS_LOCAL' | 'PAN_INDIA_AIR';
  deliveryTime: string;
  hub: string;
}

export const PRESET_HUBS: PresetHub[] = [
  {
    name: 'Silvassa Central Warehouse (HQ)',
    area: 'Silvassa Main Market, Naroli Road',
    city: 'Silvassa',
    state: 'Dadra & Nagar Haveli',
    pincode: '396230',
    type: 'EXPRESS_LOCAL',
    deliveryTime: '⚡ 15-20 MINS',
    hub: 'Silvassa Express Hub'
  },
  {
    name: 'Mumbai Dental District',
    area: 'Crystal Plaza, Link Road, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    type: 'EXPRESS_LOCAL',
    deliveryTime: '⚡ 15-20 MINS',
    hub: 'Mumbai Central Metro Hub'
  },
  {
    name: 'Ahmedabad Medical Cluster',
    area: 'Sindhu Bhavan Road, Bodakdev',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
    type: 'EXPRESS_LOCAL',
    deliveryTime: '⚡ 18-22 MINS',
    hub: 'Ahmedabad West Hub'
  },
  {
    name: 'Surat Dental Zone',
    area: 'Ring Road & Vesu Commercial Plaza',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395007',
    type: 'EXPRESS_LOCAL',
    deliveryTime: '⚡ 15-25 MINS',
    hub: 'Surat South Hub'
  },
  {
    name: 'Pune Specialty Hub',
    area: 'Kothrud & Deccan Gymkhana',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411038',
    type: 'EXPRESS_LOCAL',
    deliveryTime: '⚡ 20-25 MINS',
    hub: 'Pune Express Hub'
  },
  {
    name: 'Delhi NCR Clinic Corridor',
    area: 'Green Park Main & South Extension',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    type: 'EXPRESS_LOCAL',
    deliveryTime: '⚡ 18-25 MINS',
    hub: 'Delhi North Hub'
  },
  {
    name: 'Bengaluru Tech & Clinic Park',
    area: '100ft Road, Indiranagar & Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    type: 'EXPRESS_LOCAL',
    deliveryTime: '⚡ 20-30 MINS',
    hub: 'Bengaluru Central Hub'
  },
  {
    name: 'Hyderabad Health City',
    area: 'Road No. 36, Jubilee Hills & Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    type: 'EXPRESS_LOCAL',
    deliveryTime: '⚡ 20-30 MINS',
    hub: 'Hyderabad West Hub'
  },
  {
    name: 'Chennai Specialty Corridor',
    area: 'Anna Nagar 2nd Avenue & T. Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    type: 'EXPRESS_LOCAL',
    deliveryTime: '⚡ 20-30 MINS',
    hub: 'Chennai South Hub'
  },
  {
    name: 'Kolkata Clinic Hub',
    area: 'Sector V, Salt Lake & Park Street',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700091',
    type: 'EXPRESS_LOCAL',
    deliveryTime: '⚡ 25-35 MINS',
    hub: 'Kolkata East Hub'
  },
  {
    name: 'Jaipur Dental Care',
    area: 'Tonk Road & Malviya Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302017',
    type: 'PAN_INDIA_AIR',
    deliveryTime: '🚀 24-48 HRS AIR',
    hub: 'National Blue Dart Air Hub'
  },
  {
    name: 'Indore Medical Cluster',
    area: 'Vijay Nagar & Palasia',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pincode: '452010',
    type: 'PAN_INDIA_AIR',
    deliveryTime: '🚀 24-48 HRS AIR',
    hub: 'National Express Cargo Hub'
  }
];

const DEFAULT_LOCATION: UserLocation = {
  formattedAddress: 'Silvassa Main Market, Naroli Road, Silvassa, Dadra & Nagar Haveli - 396230',
  shortName: 'Silvassa (HQ)',
  area: 'Naroli Road',
  city: 'Silvassa',
  state: 'Dadra & Nagar Haveli',
  pincode: '396230',
  isGpsDetected: false,
  deliveryTimeEstimate: '⚡ 15-20 MINS',
  deliveryType: 'EXPRESS_LOCAL',
  deliveryHub: 'Silvassa Central Hub'
};

interface LocationContextType {
  location: UserLocation;
  isGpsLoading: boolean;
  gpsError: string | null;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  detectGpsLocation: () => Promise<boolean>;
  selectPresetLocation: (preset: PresetHub) => void;
  setCustomLocation: (addressData: Partial<UserLocation>) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation>(() => {
    try {
      const saved = localStorage.getItem('dentakart_user_location');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading location from localStorage', e);
    }
    return DEFAULT_LOCATION;
  });

  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Save to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem('dentakart_user_location', JSON.stringify(location));
    } catch (e) {}
  }, [location]);

  // Determine delivery time based on city / state
  const computeDeliveryEstimate = (city: string, state: string): { estimate: string; type: 'EXPRESS_LOCAL' | 'PAN_INDIA_AIR'; hub: string } => {
    const c = city.toLowerCase();
    const s = state.toLowerCase();

    const expressCities = [
      'silvassa', 'vapi', 'daman', 'surat', 'mumbai', 'thane', 'navi mumbai', 'ahmedabad',
      'pune', 'delhi', 'new delhi', 'noida', 'gurgaon', 'gurugram', 'ghaziabad', 'faridabad',
      'bengaluru', 'bangalore', 'hyderabad', 'chennai', 'kolkata'
    ];

    const isLocalExpress = expressCities.some((ec) => c.includes(ec) || s.includes(ec));

    if (isLocalExpress) {
      return {
        estimate: '⚡ 15-20 MINS',
        type: 'EXPRESS_LOCAL',
        hub: `${city} Hyper-Local Express Depot`
      };
    }

    return {
      estimate: '🚀 24-48 HRS AIR',
      type: 'PAN_INDIA_AIR',
      hub: 'Blue Dart / Delhivery Express Air Cargo'
    };
  };

  // GPS Auto-Detection with Capacitor Native + HTML5 Fallback
  const detectGpsLocation = async (): Promise<boolean> => {
    setIsGpsLoading(true);
    setGpsError(null);

    let lat: number | undefined;
    let lon: number | undefined;

    try {
      if (Capacitor.isNativePlatform()) {
        try {
          const perm = await Geolocation.requestPermissions();
          console.log('Native geolocation permission:', perm);
        } catch (pErr) {
          console.warn('Native permission prompt notice:', pErr);
        }

        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 6000,
          maximumAge: 300000
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } else if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 6000,
            maximumAge: 300000
          });
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      }
    } catch (err: any) {
      console.warn('GPS hardware lock timed out or denied:', err);
    }

    if (lat !== undefined && lon !== undefined) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
              'User-Agent': 'DentaKart-Dental-B2B-App'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          const addr = data.address || {};

          const area = addr.suburb || addr.neighbourhood || addr.road || addr.residential || 'Clinical Hub';
          const city = addr.city || addr.town || addr.municipality || addr.district || addr.state_district || 'City Hub';
          const state = addr.state || 'India';
          const pincode = addr.postcode || '';

          const shortName = `${area}, ${city}`;
          const formattedAddress = data.display_name || `${shortName}, ${state} - ${pincode}`;
          const delivery = computeDeliveryEstimate(city, state);

          const newLoc: UserLocation = {
            formattedAddress,
            shortName,
            area,
            city,
            state,
            pincode,
            latitude: lat,
            longitude: lon,
            isGpsDetected: true,
            deliveryTimeEstimate: delivery.estimate,
            deliveryType: delivery.type,
            deliveryHub: delivery.hub
          };

          setLocation(newLoc);
          setIsGpsLoading(false);
          return true;
        }
      } catch (fetchErr) {
        console.warn('Reverse geocoding notice:', fetchErr);
      }

      // Coordinate fallback
      const shortName = `GPS (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
      const newLoc: UserLocation = {
        formattedAddress: `Clinic at Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`,
        shortName,
        area: 'Detected GPS Point',
        city: 'Local Region',
        state: 'India',
        pincode: '',
        latitude: lat,
        longitude: lon,
        isGpsDetected: true,
        deliveryTimeEstimate: '⚡ 15-20 MINS',
        deliveryType: 'EXPRESS_LOCAL',
        deliveryHub: 'Nearest Priority Dispatch Hub'
      };

      setLocation(newLoc);
      setIsGpsLoading(false);
      return true;
    }

    // If GPS is unavailable/timed out, automatically select Silvassa/Mumbai HQ without blocking error
    setIsGpsLoading(false);
    setGpsError('GPS signal slow or permission required. Pick your clinic city below:');
    return false;
  };

  const selectPresetLocation = (preset: PresetHub) => {
    const newLoc: UserLocation = {
      formattedAddress: `${preset.area}, ${preset.city}, ${preset.state} - ${preset.pincode}`,
      shortName: `${preset.city} (${preset.area.split(',')[0]})`,
      area: preset.area,
      city: preset.city,
      state: preset.state,
      pincode: preset.pincode,
      isGpsDetected: false,
      deliveryTimeEstimate: preset.deliveryTime,
      deliveryType: preset.type,
      deliveryHub: preset.hub
    };
    setLocation(newLoc);
    setIsLocationModalOpen(false);
  };

  const setCustomLocation = (addressData: Partial<UserLocation>) => {
    const city = addressData.city || location.city;
    const state = addressData.state || location.state;
    const delivery = computeDeliveryEstimate(city, state);

    const newLoc: UserLocation = {
      formattedAddress: addressData.formattedAddress || `${addressData.area || ''}, ${city}, ${state} - ${addressData.pincode || ''}`,
      shortName: addressData.shortName || `${addressData.area || city}, ${city}`,
      area: addressData.area || location.area,
      city,
      state,
      pincode: addressData.pincode || location.pincode,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      isGpsDetected: addressData.isGpsDetected || false,
      deliveryTimeEstimate: delivery.estimate,
      deliveryType: delivery.type,
      deliveryHub: delivery.hub
    };
    setLocation(newLoc);
    setIsLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isGpsLoading,
        gpsError,
        isLocationModalOpen,
        setIsLocationModalOpen,
        detectGpsLocation,
        selectPresetLocation,
        setCustomLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
