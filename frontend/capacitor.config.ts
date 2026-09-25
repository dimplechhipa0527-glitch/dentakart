import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dentakart.app',
  appName: 'DentaKart',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f766e'
    },
    Geolocation: {
      // High accuracy GPS for dental clinic location resolution
    }
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined
    }
  }
};

export default config;
