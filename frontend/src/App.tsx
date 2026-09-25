import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { LocationProvider } from './context/LocationContext';
import { ViewModeProvider } from './context/ViewModeContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { LocationModal } from './components/common/LocationModal';
import { CartDrawer } from './components/doctor/CartDrawer';
import { InstantCheckoutModal } from './components/doctor/InstantCheckoutModal';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { MobileSimulatorFrame } from './components/common/MobileSimulatorFrame';
import { AdminSidebar } from './components/admin/AdminSidebar';

// Doctor Pages
import { DoctorHomePage } from './pages/doctor/DoctorHomePage';
import { ProductListingPage } from './pages/doctor/ProductListingPage';
import { ProductDetailPage } from './pages/doctor/ProductDetailPage';
import { CartPage } from './pages/doctor/CartPage';
import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage';
import { OrderHistoryPage } from './pages/doctor/OrderHistoryPage';
import { OrderDetailPage } from './pages/doctor/OrderDetailPage';
import { WishlistPage } from './pages/doctor/WishlistPage';
import { DoctorProfilePage } from './pages/doctor/DoctorProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterDoctorPage } from './pages/auth/RegisterDoctorPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// Admin Guard
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-teal-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-wider uppercase text-slate-400">Loading Seller Operations...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

// Doctor Layout with Navbar, Footer & Mobile Bottom Navigation Bar
const DoctorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isCheckoutOpen, setIsCheckoutOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <NotificationDrawer />
      <LocationModal />
      <InstantCheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <MobileBottomNav />
    </div>
  );
};

export const AppContent: React.FC = () => {
  return (
    <MobileSimulatorFrame>
      <Routes>
        {/* Customer & Doctor Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterDoctorPage />} />

        {/* Seller & Admin Auth */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Seller Operations Backend Suite */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
        <Route path="/admin/inventory" element={<AdminLayout><AdminInventoryPage /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
        <Route path="/admin/doctors" element={<AdminLayout><AdminDoctorsPage /></AdminLayout>} />
        <Route path="/admin/coupons" element={<AdminLayout><AdminCouponsPage /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><AdminCategoriesPage /></AdminLayout>} />
        <Route path="/admin/reviews" element={<AdminLayout><AdminReviewsPage /></AdminLayout>} />
        <Route path="/admin/analytics" element={<AdminLayout><AdminAnalyticsPage /></AdminLayout>} />

        {/* Doctor / Buyer Customer Store Routes */}
        <Route path="/" element={<DoctorLayout><DoctorHomePage /></DoctorLayout>} />
        <Route path="/products" element={<DoctorLayout><ProductListingPage /></DoctorLayout>} />
        <Route path="/product/:slug" element={<DoctorLayout><ProductDetailPage /></DoctorLayout>} />
        <Route path="/cart" element={<DoctorLayout><CartPage /></DoctorLayout>} />
        <Route path="/doctor/dashboard" element={<DoctorLayout><DoctorDashboardPage /></DoctorLayout>} />
        <Route path="/orders" element={<DoctorLayout><OrderHistoryPage /></DoctorLayout>} />
        <Route path="/orders/:orderNumber" element={<DoctorLayout><OrderDetailPage /></DoctorLayout>} />
        <Route path="/wishlist" element={<DoctorLayout><WishlistPage /></DoctorLayout>} />
        <Route path="/profile" element={<DoctorLayout><DoctorProfilePage /></DoctorLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MobileSimulatorFrame>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <WishlistProvider>
              <NotificationProvider>
                <ViewModeProvider>
                  <AppContent />
                </ViewModeProvider>
              </NotificationProvider>
            </WishlistProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
