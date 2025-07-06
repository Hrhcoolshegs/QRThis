
import { useState, useCallback } from 'react';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { validateQRContent, RateLimiter } from '@/utils/securityUtils';
import { sanitizeInput } from '@/utils/validationUtils';

// Enhanced rate limiter with better client identification
const qrRateLimiter = new RateLimiter(10, 60000); // Reduced to 10 requests per minute
const generateRateLimiter = new RateLimiter(3, 10000); // 3 generations per 10 seconds

export function useSecureQRGenerator(props?: any) {
  const qrGenerator = useQRGenerator(props);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [lastGenerationTime, setLastGenerationTime] = useState<number>(0);
  const [securityLevel, setSecurityLevel] = useState<'normal' | 'strict'>('normal');

  const getClientId = () => {
    // Create a more robust client identifier
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      navigator.platform
    ].join('|');
    
    // Use a simple hash for client identification
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `client_${Math.abs(hash)}`;
  };

  const detectSuspiciousContent = (text: string): boolean => {
    const suspiciousPatterns = [
      // Script injections
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      // SQL injections
      /'.*or.*1.*=.*1/gi,
      /union.*select/gi,
      // Path traversals
      /\.\.\/|\.\.\\/gi,
      // Command injections
      /`.*`|exec\(|eval\(/gi,
      // Suspicious URLs
      /bit\.ly|tinyurl\.com|t\.co|goo\.gl/gi,
      // Malicious file extensions in URLs
      /\.(exe|bat|cmd|scr|pif|com|dll)(\?|$)/gi
    ];

    return suspiciousPatterns.some(pattern => pattern.test(text));
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
    if (now - lastGenerationTime < 2000) {
      setSecurityError('Please wait at least 2 seconds between generations.');
      return;
    }

    // Enhanced content validation
    const validation = validateQRContent(text, type);
    if (!validation.isValid) {
      setSecurityError(validation.error || 'Invalid content detected');
      return;
    }

    // Additional security checks
    if (text.length > 1500) { // Reduced from 2000
      setSecurityError('Content exceeds maximum length limit (1500 characters)');
      return;
    }

    // Enhanced suspicious content detection
    if (detectSuspiciousContent(text)) {
      setSecurityError('Content contains potentially unsafe elements');
      setSecurityLevel('strict');
      return;
    }

    // Sanitize input
    const sanitizedText = sanitizeInput(text, 1500);
    if (sanitizedText !== text) {
      console.warn('Input was sanitized for security');
    }

    // Additional validation for URLs
    if (type === 'url') {
      try {
        const url = new URL(sanitizedText);
        
        // Block dangerous protocols
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'ftp:'];
        if (dangerousProtocols.some(protocol => url.protocol.toLowerCase().includes(protocol.toLowerCase()))) {
          setSecurityError('Unsafe URL protocol detected');
          return;
        }

        // Block suspicious domains
        const suspiciousDomains = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
        if (suspiciousDomains.includes(url.hostname.toLowerCase())) {
          setSecurityError('Local URLs are not allowed for security reasons');
          return;
        }
      } catch (error) {
        setSecurityError('Invalid URL format');
        return;
      }
    }

    // Use sanitized content and record generation time
    setLastGenerationTime(now);

    try {
      await qrGenerator.generateQRCode(sanitizedText);
      
      // Log successful generation for monitoring
      console.log('QR code generated successfully', {
        type,
        length: sanitizedText.length,
        timestamp: now,
        clientId: clientId.slice(-8) // Only log last 8 chars for privacy
      });
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
    setSecurityLevel('normal');
  }, []);

  return {
    ...qrGenerator,
    generateQRCode: secureGenerateQRCode,
    securityError,
    securityLevel,
    clearSecurityError: () => setSecurityError(null),
    resetSecurity
  };
}
