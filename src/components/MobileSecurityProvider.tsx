
import React, { useEffect, useState } from 'react';

interface MobileSecurityProviderProps {
  children: React.ReactNode;
}

export const MobileSecurityProvider: React.FC<MobileSecurityProviderProps> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(true);

  useEffect(() => {
    // Enhanced mobile security
    const preventScreenshots = () => {
      // Add CSS to prevent screenshots on sensitive content
      document.body.style.setProperty('-webkit-touch-callout', 'none');
      document.body.style.setProperty('-webkit-user-select', 'none');
      document.body.style.setProperty('-khtml-user-select', 'none');
      document.body.style.setProperty('-moz-user-select', 'none');
      document.body.style.setProperty('-ms-user-select', 'none');
      document.body.style.setProperty('user-select', 'none');
    };

    // Prevent text selection and context menu on mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent pinch zoom
      }
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // Add mobile-specific security measures
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('contextmenu', handleContextMenu);
    
    preventScreenshots();

    // Enhanced CSP for mobile
    const addMobileCSP = () => {
      const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (existingMeta) {
        existingMeta.setAttribute('content', 
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "font-src 'self' https://fonts.gstatic.com data:; " +
          "img-src 'self' data: blob: https:; " +
          "connect-src 'self' https:; " +
          "media-src 'self' data: blob:; " +
          "object-src 'none'; " +
          "base-uri 'self'; " +
          "form-action 'self'; " +
          "frame-ancestors 'none'; " +
          "upgrade-insecure-requests; " +
          "block-all-mixed-content"
        );
      }
    };

    addMobileCSP();

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return <>{children}</>;
};
