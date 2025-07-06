
import React, { useEffect, useState } from 'react';
import { SecurityProvider } from '@/components/SecurityProvider';
import { MobileSecurityProvider } from '@/components/MobileSecurityProvider';

interface SecurityEnhancedProviderProps {
  children: React.ReactNode;
}

export const SecurityEnhancedProvider: React.FC<SecurityEnhancedProviderProps> = ({ children }) => {
  const [securityLevel, setSecurityLevel] = useState<'basic' | 'enhanced'>('basic');

  useEffect(() => {
    // Enhanced security monitoring
    const checkSecurityThreats = () => {
      // Monitor for common attack patterns
      const threats = [
        // XSS attempts
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /data:text\/html/gi,
        // SQL injection attempts
        /'.*or.*1.*=.*1/gi,
        /union.*select/gi,
        // Path traversal
        /\.\.\/|\.\.\\/gi,
        // Command injection
        /`.*`|exec\(|eval\(/gi
      ];

      // Check URL for suspicious patterns
      const currentUrl = window.location.href;
      const hasThreats = threats.some(pattern => pattern.test(currentUrl));

      if (hasThreats) {
        console.warn('Security threat detected in URL');
        setSecurityLevel('enhanced');
        
        // Redirect to safe page if necessary
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    };

    // Enhanced CSP violation handling
    const handleCSPViolation = (e: SecurityPolicyViolationEvent) => {
      console.warn('CSP Violation detected:', {
        violatedDirective: e.violatedDirective,
        blockedURI: e.blockedURI,
        documentURI: e.documentURI,
        effectiveDirective: e.effectiveDirective
      });
      
      setSecurityLevel('enhanced');
      
      // Report to monitoring service in production
      if (process.env.NODE_ENV === 'production') {
        // In a real app, you would send this to your monitoring service
        fetch('/api/security-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'csp_violation',
            violation: {
              violatedDirective: e.violatedDirective,
              blockedURI: e.blockedURI,
              documentURI: e.documentURI
            },
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          })
        }).catch(err => console.warn('Failed to report security violation:', err));
      }
    };

    // Monitor for suspicious DOM modifications
    const observeDOM = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                
                // Check for suspicious script injections
                if (element.tagName === 'SCRIPT' || 
                    element.innerHTML.includes('<script') ||
                    element.innerHTML.includes('javascript:')) {
                  console.warn('Suspicious DOM modification detected');
                  setSecurityLevel('enhanced');
                  element.remove(); // Remove suspicious content
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'onclick', 'onload']
      });

      return () => observer.disconnect();
    };

    // Initialize security monitoring
    checkSecurityThreats();
    const stopDOMObserver = observeDOM();

    // Add event listeners
    document.addEventListener('securitypolicyviolation', handleCSPViolation);
    window.addEventListener('error', (e) => {
      if (e.message.includes('Script error') || e.message.includes('SecurityError')) {
        console.warn('Security-related error detected:', e.message);
        setSecurityLevel('enhanced');
      }
    });

    // Periodic security checks
    const securityInterval = setInterval(checkSecurityThreats, 30000); // Every 30 seconds

    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
      stopDOMObserver();
      clearInterval(securityInterval);
    };
  }, []);

  return (
    <SecurityProvider>
      <MobileSecurityProvider>
        {securityLevel === 'enhanced' && (
          <div className="fixed top-0 left-0 w-full bg-orange-500 text-white text-center py-1 text-sm z-50">
            Enhanced security mode active
          </div>
        )}
        {children}
      </MobileSecurityProvider>
    </SecurityProvider>
  );
};
