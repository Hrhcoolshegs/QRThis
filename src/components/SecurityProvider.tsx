
import React, { useEffect } from 'react';

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  useEffect(() => {
    // Disable right-click context menu in production
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    };

    // Disable certain keyboard shortcuts in production
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'production') {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && (e.key === 'u' || e.key === 's'))
        ) {
          e.preventDefault();
        }
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Enhanced security headers via meta tags
    const setSecurityMeta = () => {
      // Remove any existing security meta tags to avoid duplicates
      const existingMetas = document.querySelectorAll('meta[http-equiv*="Content-Security-Policy"], meta[http-equiv*="X-Frame-Options"], meta[http-equiv*="X-Content-Type-Options"], meta[name="referrer"], meta[http-equiv*="Permissions-Policy"], meta[http-equiv*="Strict-Transport-Security"]');
      existingMetas.forEach(meta => meta.remove());

      // Enhanced Content Security Policy
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for QR code generation
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https:",
        "media-src 'self' data: blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests"
      ].join('; ');
      document.head.appendChild(cspMeta);

      // X-Frame-Options
      const frameMeta = document.createElement('meta');
      frameMeta.httpEquiv = 'X-Frame-Options';
      frameMeta.content = 'DENY';
      document.head.appendChild(frameMeta);

      // X-Content-Type-Options
      const contentTypeMeta = document.createElement('meta');
      contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
      contentTypeMeta.content = 'nosniff';
      document.head.appendChild(contentTypeMeta);

      // Enhanced Referrer Policy
      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerMeta);

      // Permissions Policy
      const permissionsMeta = document.createElement('meta');
      permissionsMeta.httpEquiv = 'Permissions-Policy';
      permissionsMeta.content = 'camera=(), microphone=(), geolocation=(), payment=(), usb=()';
      document.head.appendChild(permissionsMeta);

      // Strict Transport Security (for HTTPS environments)
      if (location.protocol === 'https:') {
        const stsMeta = document.createElement('meta');
        stsMeta.httpEquiv = 'Strict-Transport-Security';
        stsMeta.content = 'max-age=31536000; includeSubDomains; preload';
        document.head.appendChild(stsMeta);
      }
    };

    setSecurityMeta();

    // Security monitoring
    const logSecurityEvent = (eventType: string, details: any) => {
      if (process.env.NODE_ENV === 'production') {
        console.warn(`Security Event: ${eventType}`, details);
      }
    };

    // Monitor for potential XSS attempts
    const handleSecurityViolation = (e: SecurityPolicyViolationEvent) => {
      logSecurityEvent('CSP Violation', {
        violatedDirective: e.violatedDirective,
        blockedURI: e.blockedURI,
        documentURI: e.documentURI
      });
    };

    // Add CSP violation listener
    document.addEventListener('securitypolicyviolation', handleSecurityViolation);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('securitypolicyviolation', handleSecurityViolation);
    };
  }, []);

  return <>{children}</>;
};
