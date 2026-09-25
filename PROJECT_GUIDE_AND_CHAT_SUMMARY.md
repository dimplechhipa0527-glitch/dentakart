# 🦷 DentaKart — Complete Project Summary, Credentials & Guide

> **Project Name:** DentaKart (B2B Dental Marketplace Platform)  
> **Client / Business:** Integrity Enterprises, Silvassa (Dadra & Nagar Haveli)  
> **Order Desk WhatsApp:** `+91 93168 39711`  
> **Date:** September 2026  

---

## 📱 1. Production Android App & Google Play Store Package

All release files are compiled, signed with a 27-year certified keystore, and ready:

**Location:** `C:\Users\krish\OneDrive\Desktop\Dentkart\RELEASE_BUILDS\`

| File Name | File Type | Purpose |
| :--- | :--- | :--- |
| **`DentaKart-PlayStore.aab`** | Android App Bundle | **Upload this file to Google Play Console** (Production / Testing Release) |
| **`DentaKart-Installable.apk`** | Android APK | **Directly installable on any Android mobile phone** for testing |
| **`PlayStore-Icon-512.png`** | 512x512 PNG | **App Icon** for Google Play Store Listing |
| **`PlayStore-FeatureGraphic-1024x500.png`** | 1024x500 PNG | **Feature Graphic Banner** for Google Play Store Listing |

### 🔑 Android Signing Keystore Details:
- **Keystore File:** `frontend/android/app/dentkart-release.keystore`
- **Key Alias:** `dentkart`
- **Keystore & Key Password:** `dentkart2026`
- **Validity:** 10,000 days (27+ years)

---

## 🛠️ 2. Admin & Seller Portal (For Your Client to Add/Edit Products)

Your client does not need to edit any code. They can log in to the web admin portal anytime:

- **Admin URL:** `http://localhost:5173/admin/products` *(or click "🔒 Seller & Admin Login" at bottom of footer)*
- **Admin Email:** `admin@dentakart.com`
- **Admin Password:** `admin123`

### Features available in Admin Portal:
1. **Add New Products:** Set Name, Brand, Category, MRP, Selling Price, GST % (5%, 12%, 18%), HSN Code, Stock, and Image URL.
2. **Edit Existing Products:** Change prices, discounts, stock, and descriptions with 1-click.
3. **Inventory & Low-Stock Alerts:** Manage quantities and receive low-stock notifications.
4. **Orders & GST Tax Invoices:** View doctor clinic orders and download computer-stamped B2B tax invoices with HSN codes.
5. **Category Management:** Add new dental categories (Endodontics, Orthodontics, Materials, etc.).

---

## 🚀 3. Features Implemented in DentaKart

1. **52+ Authentic Dental Brochure Products:**
   - Real product photos cropped from manufacturer catalogs (3M, Dentsply, Mani, GC, Hu-Friedy, Woodpecker, etc.).
   - Accurate clinical descriptions, technical specs, MRPs, discounts, GST tax rates, and HSN codes.
2. **GPS Clinic Location Detection:**
   - Real-time GPS location detection using HTML5 Geolocation API + OpenStreetMap reverse geocoding.
   - Dynamic delivery timeframe calculation (⚡ 15–20 Mins Hyper-Local Silvassa Express vs 🚀 24–48 Hours Pan-India Courier).
3. **Doctor / Clinic Portal:**
   - B2B Clinic GST restock cart, order history, instant checkout, saved wishlist, and PDF GST tax invoices.
4. **WhatsApp Quick Order Desk:**
   - Direct one-tap WhatsApp order desk integration with `+91 93168 39711`.
5. **Modern 3D App Icon & 4K Hero Banner:**
   - Glowing 3D turquoise tooth emblem across all Android screen densities.

---

## ⚡ 4. How to Rebuild App After Future Edits

Whenever you or your client make edits to code or images and want to generate updated `.aab` / `.apk` files:

Run this single PowerShell command in your project directory:
```powershell
Set-Location frontend
npm run build
npx cap sync android
$env:JAVA_HOME = "C:\Users\krish\jdk21\jdk-21.0.6+7"
$env:ANDROID_HOME = "C:\Users\krish\AppData\Local\Android\Sdk"
Set-Location android
.\gradlew.bat bundleRelease assembleRelease
Set-Location ..\..
Copy-Item "frontend\android\app\build\outputs\bundle\release\app-release.aab" -Destination "RELEASE_BUILDS\DentaKart-PlayStore.aab" -Force
Copy-Item "frontend\android\app\build\outputs\apk\release\app-release.apk" -Destination "RELEASE_BUILDS\DentaKart-Installable.apk" -Force
```
*(Or simply open this chat and tell the AI "rebuild" and it will do it automatically!)*

---

## 🌐 5. How to Start the App Locally

To start the servers anytime:
- **Backend API:** Open terminal in `backend/` and run `npm run dev`
- **Frontend App:** Open terminal in `frontend/` and run `npm run dev`
- Open browser at: **`http://localhost:5173`**
