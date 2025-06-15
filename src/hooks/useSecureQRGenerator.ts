
import { useState, useCallback } from 'react';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { validateQRContent, RateLimiter } from '@/utils/securityUtils';

// Rate limiter instance
const qrRateLimiter = new RateLimiter(20, 60000); // 20 requests per minute

export function useSecureQRGenerator(props?: any) {
  const qrGenerator = useQRGenerator(props);
  const [securityError, setSecurityError] = useState<string | null>(null);

  const secureGenerateQRCode = useCallback(async (text: string, type: string = 'text') => {
    setSecurityError(null);

    // Rate limiting check
    const clientId = 'qr-generator'; // In a real app, this might be user-specific
    if (!qrRateLimiter.isAllowed(clientId)) {
      setSecurityError('Too many requests. Please wait a moment before generating another QR code.');
      return;
    }

    // Validate and sanitize content
    const validation = validateQRContent(text, type);
    if (!validation.isValid) {
      setSecurityError(validation.error || 'Invalid content');
      return;
    }

    // Use sanitized content
    const contentToUse = validation.sanitized || text;

    try {
      await qrGenerator.generateQRCode(contentToUse);
    } catch (error) {
      console.error('Secure QR generation failed:', error);
      setSecurityError('Failed to generate QR code securely. Please try again.');
    }
  }, [qrGenerator]);

  return {
    ...qrGenerator,
    generateQRCode: secureGenerateQRCode,
    securityError,
    clearSecurityError: () => setSecurityError(null)
  };
}
