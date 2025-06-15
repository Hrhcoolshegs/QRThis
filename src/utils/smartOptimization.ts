
// Smart text optimization function
export function optimizeText(input: string): { optimized: string; saved: number } {
  const original = input;
  const optimized = input
    .replace(/\s+/g, ' ')                    // Multiple spaces → single space
    .replace(/\n\s*\n/g, '\n')              // Multiple line breaks → single
    .replace(/https?:\/\/www\./g, 'https://') // Remove www. from URLs
    .replace(/https?:\/\/([^\/]+)\/?$/, 'https://$1') // Remove trailing slash
    .trim();                                 // Remove leading/trailing spaces
  
  return {
    optimized,
    saved: original.length - optimized.length
  };
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

// Smart error correction logic
export function getOptimalErrorCorrection(content: string): 'L' | 'M' | 'Q' | 'H' {
  const length = content.length;
  const contentType = detectContentType(content);
  
  // High error correction for important/permanent content
  if (contentType === 'wifi' || contentType === 'vcard') return 'H';
  
  // Medium for URLs and emails
  if (contentType === 'url' || contentType === 'email') return 'M';
  
  // Adjust based on length
  if (length < 100) return 'H';        // Short content can afford high correction
  if (length < 400) return 'M';        // Medium content needs balance
  return 'L';                          // Long content needs space efficiency
}

// Content labels and icons
export function getContentLabel(type: string): string {
  const labels: Record<string, string> = {
    url: 'Website Link',
    email: 'Email Address',
    phone: 'Phone Number',
    wifi: 'WiFi Network',
    vcard: 'Contact Card',
    coordinates: 'Location',
    text: 'Text Content'
  };
  return labels[type] || 'Text Content';
}

export function getContentTips(type: string): string | null {
  const tips: Record<string, string> = {
    url: "Make sure this link is publicly accessible",
    email: "This will open the user's email app",
    phone: "This will dial the number automatically",
    wifi: "Perfect for easy WiFi sharing",
    vcard: "Great for contact information sharing"
  };
  return tips[type] || null;
}

export function getErrorCorrectionExplanation(level: string): string {
  const explanations: Record<string, string> = {
    L: 'Low (~7%) - Optimized for size, good for clean conditions',
    M: 'Medium (~15%) - Balanced protection and size',
    Q: 'Quartile (~25%) - Good protection for most uses',
    H: 'High (~30%) - Maximum protection, larger code'
  };
  return explanations[level] || 'Standard error correction';
}
