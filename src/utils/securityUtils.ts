
/**
 * Security utility functions for input validation and sanitization
 */

// URL validation with enhanced security checks
export const validateURL = (url: string): { isValid: boolean; error?: string } => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  // Remove whitespace
  const trimmedUrl = url.trim();
  
  if (trimmedUrl.length === 0) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  // Check for maximum length to prevent DoS
  if (trimmedUrl.length > 2048) {
    return { isValid: false, error: 'URL is too long (max 2048 characters)' };
  }

  try {
    const urlObject = new URL(trimmedUrl);
    
    // Check for allowed protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'sms:'];
    if (!allowedProtocols.includes(urlObject.protocol)) {
      return { isValid: false, error: 'Protocol not allowed' };
    }

    // Block suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
      /ftp:/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(trimmedUrl)) {
        return { isValid: false, error: 'Potentially unsafe URL detected' };
      }
    }

    // Check for local/private network addresses (basic check)
    if (urlObject.protocol === 'http:' || urlObject.protocol === 'https:') {
      const hostname = urlObject.hostname.toLowerCase();
      const privatePatterns = [
        /^localhost$/,
        /^127\./,
        /^192\.168\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./
      ];

      const isPrivate = privatePatterns.some(pattern => pattern.test(hostname));
      if (isPrivate && process.env.NODE_ENV === 'production') {
        return { isValid: false, error: 'Private network URLs not allowed' };
      }
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

// Input sanitization for text content
export const sanitizeTextInput = (input: string, maxLength: number = 2000): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove or replace potentially dangerous characters
  let sanitized = input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

// WiFi network name validation
export const validateWiFiSSID = (ssid: string): { isValid: boolean; error?: string } => {
  if (!ssid || typeof ssid !== 'string') {
    return { isValid: false, error: 'Network name is required' };
  }

  const trimmed = ssid.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Network name cannot be empty' };
  }

  if (trimmed.length > 32) {
    return { isValid: false, error: 'Network name cannot exceed 32 characters' };
  }

  // Check for invalid characters in SSID
  const invalidChars = /[<>"&']/;
  if (invalidChars.test(trimmed)) {
    return { isValid: false, error: 'Network name contains invalid characters' };
  }

  return { isValid: true };
};

// Password strength validation
export const validateWiFiPassword = (password: string, securityType: string): { isValid: boolean; error?: string } => {
  if (securityType === 'nopass') {
    return { isValid: true };
  }

  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required for secured networks' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 63) {
    return { isValid: false, error: 'Password cannot exceed 63 characters' };
  }

  return { isValid: true };
};

// Rate limiting helper (client-side basic implementation)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(private maxAttempts: number = 10, private windowMs: number = 60000) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Content validation for QR codes
export const validateQRContent = (content: string, type: string): { isValid: boolean; sanitized?: string; error?: string } => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Content is required' };
  }

  let sanitized = content;
  let validation = { isValid: true };

  switch (type) {
    case 'url':
      validation = validateURL(content);
      break;
    case 'text':
      sanitized = sanitizeTextInput(content);
      break;
    case 'wifi':
      // WiFi validation would be handled separately for SSID and password
      break;
    default:
      sanitized = sanitizeTextInput(content);
  }

  if (!validation.isValid) {
    return validation;
  }

  return { isValid: true, sanitized };
};
