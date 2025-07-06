// Enhanced validation utilities for security
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  // Length validation
  if (trimmedEmail.length < 5 || trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email must be between 5 and 254 characters' };
  }

  // Format validation (enhanced regex)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Check for common malicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /'.*or.*1.*=.*1/i,
    /union.*select/i
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(trimmedEmail))) {
    return { isValid: false, error: 'Invalid email format detected' };
  }

  return { isValid: true, sanitized: trimmedEmail };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: true, sanitized: '' }; // Phone is optional
  }

  const trimmedPhone = phone.trim();
  
  // Remove common formatting characters for validation
  const cleanPhone = trimmedPhone.replace(/[\s\-\(\)\.]/g, '');
  
  // Length validation (7-20 digits including country code)
  if (cleanPhone.length < 7 || cleanPhone.length > 20) {
    return { isValid: false, error: 'Phone number must be between 7 and 20 digits' };
  }

  // Format validation - allow digits, +, -, (, ), spaces
  const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{6,19}$/;
  
  if (!phoneRegex.test(trimmedPhone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  // Sanitize by keeping only allowed characters
  const sanitized = trimmedPhone.replace(/[^\d\+\-\(\)\s]/g, '');
  
  return { isValid: true, sanitized };
};

export const validateName = (name: string): ValidationResult => {
  if (!name || typeof name !== 'string') {
    return { isValid: true, sanitized: '' }; // Name is optional
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return { isValid: true, sanitized: '' };
  }

  // Length validation
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return { isValid: false, error: 'Name must be between 2 and 100 characters' };
  }

  // Format validation - only letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Name contains invalid characters' };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /'.*or.*1.*=.*1/i,
    /union.*select/i,
    /\*\//,
    /--/
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(trimmedName))) {
    return { isValid: false, error: 'Invalid name format detected' };
  }

  return { isValid: true, sanitized: trimmedName };
};

export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, ''); // Remove data: protocol
};

// Rate limiting helper
export const isRateLimited = (key: string, maxRequests: number = 3, timeWindow: number = 24 * 60 * 60 * 1000): boolean => {
  const now = Date.now();
  const storageKey = `rate_limit_${key}`;
  
  try {
    const stored = localStorage.getItem(storageKey);
    const requests = stored ? JSON.parse(stored) : [];
    
    // Filter requests within time window
    const recentRequests = requests.filter((timestamp: number) => now - timestamp < timeWindow);
    
    if (recentRequests.length >= maxRequests) {
      return true; // Rate limited
    }
    
    // Add current request and store
    recentRequests.push(now);
    localStorage.setItem(storageKey, JSON.stringify(recentRequests));
    
    return false;
  } catch (error) {
    console.warn('Rate limiting check failed:', error);
    return false; // Allow request if localStorage fails
  }
};
