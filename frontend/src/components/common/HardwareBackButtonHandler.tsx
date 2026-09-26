import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { useCart } from '../../context/CartContext';
import { useLocationContext } from '../../context/LocationContext';
import { useNotification } from '../../context/NotificationContext';
import { useAdminUI } from '../../context/AdminUIContext';

export const HardwareBackButtonHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCartOpen, setIsCartOpen, isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const { isLocationModalOpen, setIsLocationModalOpen } = useLocationContext();
  const { isOpen: isNotifOpen, setIsOpen: setIsNotifOpen } = useNotification();
  const { isMobileSidebarOpen, closeMobileSidebar } = useAdminUI();

  useEffect(() => {
    // Only register Capacitor backButton listener when running as a native Android/iOS app
    if (!Capacitor.isNativePlatform()) return;

    let backListener: any = null;

    const registerListener = async () => {
      try {
        backListener = await CapApp.addListener('backButton', () => {
          // 1. Close drawers / modals in priority order
          if (isMobileSidebarOpen) {
            closeMobileSidebar();
            return;
          }
          if (isCartOpen) {
            setIsCartOpen(false);
            return;
          }
          if (isCheckoutOpen) {
            setIsCheckoutOpen(false);
            return;
          }
          if (isLocationModalOpen) {
            setIsLocationModalOpen(false);
            return;
          }
          if (isNotifOpen) {
            setIsNotifOpen(false);
            return;
          }

          // 2. If on sub-page, navigate back
          if (location.pathname !== '/' && location.pathname !== '') {
            navigate(-1);
            return;
          }

          // 3. If on root page, exit the app
          CapApp.exitApp();
        });
      } catch (e) {
        console.warn('Could not register hardware back button listener', e);
      }
    };

    registerListener();

    return () => {
      if (backListener && typeof backListener.remove === 'function') {
        backListener.remove();
      }
    };
  }, [
    isMobileSidebarOpen,
    closeMobileSidebar,
    isCartOpen,
    isCheckoutOpen,
    isLocationModalOpen,
    isNotifOpen,
    location.pathname,
    navigate,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsLocationModalOpen,
    setIsNotifOpen
  ]);

  return null;
};
