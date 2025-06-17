
import { useState, useCallback } from 'react';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { validateQRContent, RateLimiter } from '@/utils/securityUtils';

// Enhanced rate limiter with better client identification
const qrRateLimiter = new RateLimiter(15, 60000); // Reduced to 15 requests per minute
const generateRateLimiter = new RateLimiter(5, 10000); // 5 generations per 10 seconds

export function useSecureQRGenerator(props?: any) {
  const qrGenerator = useQRGenerator(props);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [lastGenerationTime, setLastGenerationTime] = useState<number>(0);

  const getClientId = () => {
    // Create a more robust client identifier
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset()
    ].join('|');
    
    // Use a simple hash for client identification
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `client_${hash}`;
  };

  const secureGenerateQRCode = useCallback(async (text: string, type: string = 'text') => {
    setSecurityError(null);

    const now = Date.now();
    const clientId = getClientId();

    // Enhanced rate limiting
    if (!qrRateLimiter.isAllowed(clientId)) {
      setSecurityError('Rate limit exceeded. Please wait before generating another QR code.');
      return;
    }

    // Quick generation rate limiting
    if (!generateRateLimiter.isAllowed(clientId)) {
      setSecurityError('Please wait a moment between generations.');
      return;
    }

    // Prevent too rapid consecutive generations
    if (now - lastGenerationTime < 1000) {
      setSecurityError('Please wait at least 1 second between generations.');
      return;
    }

    // Enhanced content validation
    const validation = validateQRContent(text, type);
    if (!validation.isValid) {
      setSecurityError(validation.error || 'Invalid content detected');
      return;
    }

    // Additional security checks
    if (text.length > 2000) {
      setSecurityError('Content exceeds maximum length limit');
      return;
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi
    ];

    const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(text));
    if (hasSuspiciousContent) {
      setSecurityError('Content contains potentially unsafe elements');
      return;
    }

    // Use sanitized content and record generation time
    const contentToUse = validation.sanitized || text;
    setLastGenerationTime(now);

    try {
      await qrGenerator.generateQRCode(contentToUse);
    } catch (error) {
      console.error('Secure QR generation failed:', error);
      setSecurityError('Failed to generate QR code securely. Please try again.');
    }
  }, [qrGenerator, lastGenerationTime]);

  const resetSecurity = useCallback(() => {
    const clientId = getClientId();
    qrRateLimiter.reset(clientId);
    generateRateLimiter.reset(clientId);
    setSecurityError(null);
    setLastGenerationTime(0);
  }, []);

  return {
    ...qrGenerator,
    generateQRCode: secureGenerateQRCode,
    securityError,
    clearSecurityError: () => setSecurityError(null),
    resetSecurity
  };
}
