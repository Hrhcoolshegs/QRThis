
// AI-powered context understanding for QR optimization

export interface QRContext {
  type: string;
  confidence: number;
  optimizations: {
    errorCorrection: 'L' | 'M' | 'Q' | 'H';
    size: 'small' | 'medium' | 'large';
    tips: string[];
  };
}

// Context detection patterns
const contextPatterns = {
  restaurant: {
    pattern: /menu|food|restaurant|cafe|dining|eat|order|table/i,
    optimizations: {
      errorCorrection: 'M' as const,
      size: 'large' as const,
      tips: [
        'Print on table tents for easy access',
        'Use high contrast for dim lighting conditions',
        'Consider adding your restaurant logo',
        'Test scanning from typical dining distance'
      ]
    }
  },
  event: {
    pattern: /event|wedding|party|conference|meeting|rsvp|invitation/i,
    optimizations: {
      errorCorrection: 'H' as const,
      size: 'medium' as const,
      tips: [
        'Perfect for printed invitations',
        'Include event date and time in content',
        'Test scanning from different distances',
        'Consider printing larger for older attendees'
      ]
    }
  },
  business: {
    pattern: /business|company|contact|professional|linkedin|corporate/i,
    optimizations: {
      errorCorrection: 'M' as const,
      size: 'small' as const,
      tips: [
        'Ideal for business cards',
        'Use professional color schemes',
        'Include complete contact information',
        'Test readability at business card size'
      ]
    }
  },
  social: {
    pattern: /instagram|twitter|facebook|linkedin|social|profile|follow/i,
    optimizations: {
      errorCorrection: 'L' as const,
      size: 'medium' as const,
      tips: [
        'Great for social media campaigns',
        'Works well on digital displays',
        'Consider brand colors for recognition',
        'Perfect for marketing materials'
      ]
    }
  },
  wifi: {
    pattern: /wifi|password|network|internet|ssid|wpa|wep/i,
    optimizations: {
      errorCorrection: 'H' as const,
      size: 'medium' as const,
      tips: [
        'High error correction for reliable connection',
        'Print clearly for guest access',
        'Include network name in visible text',
        'Consider laminating for durability'
      ]
    }
  },
  retail: {
    pattern: /store|shop|product|buy|purchase|price|sale|discount/i,
    optimizations: {
      errorCorrection: 'M' as const,
      size: 'medium' as const,
      tips: [
        'Perfect for product information',
        'Great for price comparisons',
        'Include clear call-to-action',
        'Test with typical shopping lighting'
      ]
    }
  }
};

export function detectQRContext(content: string, metadata: any = {}): QRContext | null {
  const trimmed = content.trim().toLowerCase();
  
  // Analyze content for context clues
  for (const [contextType, config] of Object.entries(contextPatterns)) {
    if (config.pattern.test(trimmed)) {
      return {
        type: contextType,
        confidence: 0.8, // High confidence for pattern matches
        optimizations: config.optimizations
      };
    }
  }
  
  // Additional context detection from URL domains
  if (content.includes('instagram.com') || content.includes('twitter.com') || content.includes('facebook.com')) {
    return {
      type: 'social',
      confidence: 0.9,
      optimizations: contextPatterns.social.optimizations
    };
  }
  
  if (content.includes('linkedin.com')) {
    return {
      type: 'business',
      confidence: 0.9,
      optimizations: contextPatterns.business.optimizations
    };
  }
  
  // WiFi QR code detection
  if (content.startsWith('WIFI:')) {
    return {
      type: 'wifi',
      confidence: 1.0,
      optimizations: contextPatterns.wifi.optimizations
    };
  }
  
  // vCard detection
  if (content.startsWith('BEGIN:VCARD')) {
    return {
      type: 'business',
      confidence: 1.0,
      optimizations: contextPatterns.business.optimizations
    };
  }
  
  return null;
}

export function getContextLabel(type: string): string {
  const labels: Record<string, string> = {
    restaurant: 'Restaurant & Dining',
    event: 'Event & Invitation',
    business: 'Business & Professional',
    social: 'Social Media',
    wifi: 'WiFi Network',
    retail: 'Retail & Shopping'
  };
  return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

export function getContextIcon(type: string): string {
  const icons: Record<string, string> = {
    restaurant: '🍽️',
    event: '🎉',
    business: '💼',
    social: '📱',
    wifi: '📶',
    retail: '🛍️'
  };
  return icons[type] || '🎯';
}
