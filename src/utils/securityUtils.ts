/**
 * Enhanced security utility functions for input validation and sanitization
 */

// Enhanced URL validation with proper protocol and domain checks
export const validateURL = (url: string): { isValid: boolean; error?: string } => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  const trimmedUrl = url.trim();
  
  if (trimmedUrl.length === 0) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  if (trimmedUrl.length > 2048) {
    return { isValid: false, error: 'URL is too long (max 2048 characters)' };
  }

  // Check if it's just a number or purely numeric
  if (/^\d+$/.test(trimmedUrl)) {
    return { isValid: false, error: 'URL cannot be just a number' };
  }

  try {
    // Add protocol if missing, but only if it looks like a domain
    let urlToTest = trimmedUrl;
    if (!urlToTest.match(/^https?:\/\//i)) {
      // Check if it at least contains a dot and valid domain structure
      if (!trimmedUrl.includes('.') || trimmedUrl.split('.').length < 2) {
        return { isValid: false, error: 'Invalid URL format - missing domain' };
      }
      urlToTest = 'https://' + urlToTest;
    }
    
    const urlObject = new URL(urlToTest);
    
    // Check for allowed protocols only
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(urlObject.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
    }

    // Validate hostname more strictly
    const hostname = urlObject.hostname;
    
    // Must contain at least one dot
    if (!hostname.includes('.')) {
      return { isValid: false, error: 'Invalid domain - must contain a dot' };
    }

    // Check for valid domain structure (not just numbers)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      // Allow IP addresses but validate them properly
      const parts = hostname.split('.');
      for (const part of parts) {
        const num = parseInt(part, 10);
        if (num < 0 || num > 255) {
          return { isValid: false, error: 'Invalid IP address' };
        }
      }
    } else {
      // For domain names, validate structure
      const domainParts = hostname.split('.');
      
      // Must have at least 2 parts (domain.tld)
      if (domainParts.length < 2) {
        return { isValid: false, error: 'Invalid domain structure' };
      }

      // Each part must be valid
      for (const part of domainParts) {
        if (part.length === 0) {
          return { isValid: false, error: 'Invalid domain - empty part' };
        }
        
        // Domain parts cannot be purely numeric (except for IP addresses handled above)
        if (/^\d+$/.test(part)) {
          return { isValid: false, error: 'Domain parts cannot be purely numeric' };
        }
        
        // Must contain valid characters only
        if (!/^[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?$/.test(part)) {
          return { isValid: false, error: 'Invalid characters in domain' };
        }
      }

      // TLD (last part) must be at least 2 characters and alphabetic
      const tld = domainParts[domainParts.length - 1];
      if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
        return { isValid: false, error: 'Invalid top-level domain' };
      }
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/gi,
      /data:/gi,
      /vbscript:/gi,
      /file:/gi,
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

// Strict email validation
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  if (trimmedEmail.length === 0) {
    return { isValid: false, error: 'Email cannot be empty' };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email is too long (max 254 characters)' };
  }

  // Check if it's just numbers
  if (/^\d+$/.test(trimmedEmail)) {
    return { isValid: false, error: 'Email cannot be just numbers' };
  }

  // Must contain exactly one @ symbol
  const atCount = (trimmedEmail.match(/@/g) || []).length;
  if (atCount !== 1) {
    return { isValid: false, error: 'Email must contain exactly one @ symbol' };
  }

  // Split into local and domain parts
  const [localPart, domainPart] = trimmedEmail.split('@');
  
  if (!localPart || !domainPart) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // Local part validation
  if (localPart.length > 64) {
    return { isValid: false, error: 'Email local part too long (max 64 characters)' };
  }

  // Local part cannot start or end with a dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, error: 'Email cannot start or end with a dot' };
  }

  // Local part cannot have consecutive dots
  if (localPart.includes('..')) {
    return { isValid: false, error: 'Email cannot have consecutive dots' };
  }

  // Local part character validation
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
    return { isValid: false, error: 'Email contains invalid characters' };
  }

  // Domain part validation - reuse URL domain validation logic
  if (!domainPart.includes('.')) {
    return { isValid: false, error: 'Email domain must contain a dot' };
  }

  const domainParts = domainPart.split('.');
  if (domainParts.length < 2) {
    return { isValid: false, error: 'Invalid email domain structure' };
  }

  // Each domain part validation
  for (const part of domainParts) {
    if (part.length === 0) {
      return { isValid: false, error: 'Invalid email domain - empty part' };
    }
    
    if (/^\d+$/.test(part)) {
      return { isValid: false, error: 'Email domain parts cannot be purely numeric' };
    }
    
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?$/.test(part)) {
      return { isValid: false, error: 'Invalid characters in email domain' };
    }
  }

  // TLD validation
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return { isValid: false, error: 'Invalid email domain extension' };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /javascript:/gi,
    /<script/gi,
    /on\w+=/gi
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmedEmail)) {
      return { isValid: false, error: 'Email contains invalid characters' };
    }
  }

  return { isValid: true };
};

// Strict phone number validation
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const trimmedPhone = phone.trim();
  
  if (trimmedPhone.length === 0) {
    return { isValid: false, error: 'Phone number cannot be empty' };
  }

  // Remove common formatting characters for validation
  const cleanPhone = trimmedPhone.replace(/[\s\-\(\)\.]/g, '');
  
  // Must contain only digits and optional leading +
  if (!/^\+?\d+$/.test(cleanPhone)) {
    return { isValid: false, error: 'Phone number can only contain digits, spaces, dashes, parentheses, and optional + prefix' };
  }

  // Remove + for length checking
  const digitsOnly = cleanPhone.replace(/^\+/, '');
  
  // Check length constraints
  if (digitsOnly.length < 7) {
    return { isValid: false, error: 'Phone number too short (minimum 7 digits)' };
  }
  
  if (digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number too long (maximum 15 digits)' };
  }

  // Additional validation for common patterns
  // Cannot be all the same digit
  if (/^(.)\1+$/.test(digitsOnly)) {
    return { isValid: false, error: 'Phone number cannot be all the same digit' };
  }

  // Cannot be sequential numbers
  const isSequential = (str: string) => {
    for (let i = 1; i < str.length; i++) {
      if (parseInt(str[i]) !== parseInt(str[i-1]) + 1) {
        return false;
      }
    }
    return true;
  };

  if (isSequential(digitsOnly) && digitsOnly.length > 5) {
    return { isValid: false, error: 'Phone number cannot be sequential digits' };
  }

  return { isValid: true };
};

// WiFi network validation
export const validateWiFiNetwork = (ssid: string, password: string, security: string = 'WPA'): { isValid: boolean; error?: string } => {
  // SSID validation
  if (!ssid || typeof ssid !== 'string') {
    return { isValid: false, error: 'Network name (SSID) is required' };
  }

  const trimmedSSID = ssid.trim();
  if (trimmedSSID.length === 0) {
    return { isValid: false, error: 'Network name cannot be empty' };
  }

  if (trimmedSSID.length > 32) {
    return { isValid: false, error: 'Network name too long (max 32 characters)' };
  }

  // Password validation (only for secured networks)
  if (security !== 'nopass') {
    if (!password || typeof password !== 'string') {
      return { isValid: false, error: 'Password is required for secured networks' };
    }

    const trimmedPassword = password.trim();
    if (trimmedPassword.length === 0) {
      return { isValid: false, error: 'Password cannot be empty' };
    }

    if (security === 'WPA' && trimmedPassword.length < 8) {
      return { isValid: false, error: 'WPA password must be at least 8 characters' };
    }

    if (security === 'WEP' && ![5, 13, 10, 26].includes(trimmedPassword.length)) {
      return { isValid: false, error: 'WEP password must be 5, 10, 13, or 26 characters' };
    }

    if (trimmedPassword.length > 63) {
      return { isValid: false, error: 'Password too long (max 63 characters)' };
    }
  }

  return { isValid: true };
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
      validation = validateEmail(emailContent);
      if (validation.isValid) {
        sanitized = `mailto:${emailContent}`;
      }
      break;
    case 'phone':
      const phoneContent = content.replace('tel:', '');
      validation = validatePhone(phoneContent);
      if (validation.isValid) {
        sanitized = `tel:${phoneContent}`;
      }
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
