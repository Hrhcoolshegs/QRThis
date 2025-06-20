
/**
 * Enhanced security utility functions for input validation and sanitization
 */

// Enhanced URL validation with more comprehensive security checks
export const validateURL = (url: string): { isValid: boolean; error?: string } => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  // Remove whitespace and normalize
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

    // Enhanced suspicious pattern detection
    const suspiciousPatterns = [
      /javascript:/gi,
      /data:/gi,
      /vbscript:/gi,
      /file:/gi,
      /ftp:/gi,
      /<script[^>]*>/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(trimmedUrl)) {
        return { isValid: false, error: 'Potentially unsafe URL detected' };
      }
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

// Enhanced input sanitization with better handling
export const sanitizeTextInput = (input: string, maxLength: number = 2000): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Enhanced sanitization
  let sanitized = input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:text\/html/gi, '') // Remove data URLs
    .replace(/vbscript:/gi, '') // Remove vbscript
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .trim();
  
  // Preserve line breaks but limit excessive whitespace
  sanitized = sanitized.replace(/\s{3,}/g, '  ');
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

// Enhanced content validation for QR codes
export const validateQRContent = (content: string, type: string): { isValid: boolean; sanitized?: string; error?: string } => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Content is required' };
  }

  // Check for excessive length
  if (content.length > 2000) {
    return { isValid: false, error: 'Content exceeds maximum length' };
  }

  let sanitized = content;
  let validation = { isValid: true };

  switch (type) {
    case 'url':
      validation = validateURL(content);
      break;
    case 'text':
      sanitized = sanitizeTextInput(content);
      // Additional checks for text content
      if (sanitized.length === 0 && content.length > 0) {
        return { isValid: false, error: 'Content contains only unsafe characters' };
      }
      break;
    case 'email':
      const emailContent = content.replace('mailto:', '');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailContent)) {
        return { isValid: false, error: 'Invalid email format' };
      }
      sanitized = `mailto:${sanitizeTextInput(emailContent, 100)}`;
      break;
    case 'phone':
      const phoneContent = content.replace('tel:', '');
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneContent.replace(/[\s-()]/g, ''))) {
        return { isValid: false, error: 'Invalid phone number format' };
      }
      sanitized = `tel:${sanitizeTextInput(phoneContent, 20)}`;
      break;
    default:
      sanitized = sanitizeTextInput(content);
  }

  if (!validation.isValid) {
    return validation;
  }

  return { isValid: true, sanitized };
};

// Enhanced rate limiting with better tracking
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private blockedUntil: Map<string, number> = new Map();
  
  constructor(private maxAttempts: number = 10, private windowMs: number = 60000) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    
    // Check if currently blocked
    const blockedUntil = this.blockedUntil.get(identifier);
    if (blockedUntil && now < blockedUntil) {
      return false;
    }
    
    // Clean up old block
    if (blockedUntil && now >= blockedUntil) {
      this.blockedUntil.delete(identifier);
    }
    
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      // Block for additional time if exceeded
      this.blockedUntil.set(identifier, now + this.windowMs);
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
    this.blockedUntil.delete(identifier);
  }
  
  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [id, attempts] of this.attempts.entries()) {
      const recent = attempts.filter(time => now - time < this.windowMs);
      if (recent.length === 0) {
        this.attempts.delete(id);
      } else {
        this.attempts.set(id, recent);
      }
    }
    
    for (const [id, blockedUntil] of this.blockedUntil.entries()) {
      if (now >= blockedUntil) {
        this.blockedUntil.delete(id);
      }
    }
  }
}

// Content type detection patterns
const contentTypes = {
  url: /^https?:\/\/.+/i,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[\d\s\-\(\)]{10,}$/,
  wifi: /^WIFI:T:.+;S:.+;P:.+;;$/,
  vcard: /^BEGIN:VCARD/i,
  coordinates: /^geo:-?\d+\.\d+,-?\d+\.\d+/
};

export function detectContentType(text: string): string {
  const trimmed = text.trim();
  for (const [type, pattern] of Object.entries(contentTypes)) {
    if (pattern.test(trimmed)) {
      return type;
    }
  }
  return 'text';
}

// Enhanced XSS prevention
export const preventXSS = (input: string): string => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /on\w+\s*=/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /expression\s*\(/gi
  ];

  let cleaned = input;
  xssPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  return cleaned;
};
