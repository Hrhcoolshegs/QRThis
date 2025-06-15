
// Brand color intelligence for QR codes

export interface BrandColors {
  primary: string;
  secondary: string;
  palette: string[];
  source: string;
}

export interface ColorValidation {
  isValid: boolean;
  contrast: number;
  recommendation: string;
  accessibility: 'AAA' | 'AA' | 'FAIL';
}

// Calculate color contrast ratio
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrast(foreground: string, background: string): number {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  if (!fg || !bg) return 0;
  
  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

export function validateQRColors(foreground: string, background: string): ColorValidation {
  const contrast = calculateContrast(foreground, background);
  
  let accessibility: 'AAA' | 'AA' | 'FAIL' = 'FAIL';
  let recommendation = '';
  
  if (contrast >= 7) {
    accessibility = 'AAA';
    recommendation = 'Excellent contrast for scanning';
  } else if (contrast >= 4.5) {
    accessibility = 'AA';
    recommendation = 'Good contrast for scanning';
  } else if (contrast >= 3.0) {
    accessibility = 'FAIL';
    recommendation = 'Acceptable for QR codes but not ideal';
  } else {
    accessibility = 'FAIL';
    recommendation = 'Poor contrast - may not scan reliably';
  }
  
  return {
    isValid: contrast >= 3.0, // Minimum for QR scanning
    contrast: Math.round(contrast * 100) / 100,
    recommendation,
    accessibility
  };
}

// Extract domain from URL for color analysis
function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

// Predefined brand colors for popular domains
const knownBrandColors: Record<string, BrandColors> = {
  'twitter.com': {
    primary: '#1DA1F2',
    secondary: '#14171A',
    palette: ['#1DA1F2', '#14171A', '#657786', '#AAB8C2', '#E1E8ED'],
    source: 'Known brand colors'
  },
  'facebook.com': {
    primary: '#1877F2',
    secondary: '#42145F',
    palette: ['#1877F2', '#42145F', '#E4E6EA', '#F0F2F5', '#FFFFFF'],
    source: 'Known brand colors'
  },
  'instagram.com': {
    primary: '#E4405F',
    secondary: '#F77737',
    palette: ['#E4405F', '#F77737', '#FCAF45', '#833AB4', '#C13584'],
    source: 'Known brand colors'
  },
  'linkedin.com': {
    primary: '#0A66C2',
    secondary: '#004182',
    palette: ['#0A66C2', '#004182', '#378FE9', '#71C5E8', '#F3F6F8'],
    source: 'Known brand colors'
  },
  'youtube.com': {
    primary: '#FF0000',
    secondary: '#282828',
    palette: ['#FF0000', '#282828', '#606060', '#909090', '#F9F9F9'],
    source: 'Known brand colors'
  },
  'github.com': {
    primary: '#24292F',
    secondary: '#0969DA',
    palette: ['#24292F', '#0969DA', '#656D76', '#8B949E', '#F6F8FA'],
    source: 'Known brand colors'
  }
};

export async function extractBrandColors(url: string): Promise<BrandColors | null> {
  try {
    const domain = extractDomain(url);
    
    if (!domain) {
      return null;
    }
    
    // Check if we have known brand colors
    if (knownBrandColors[domain]) {
      return knownBrandColors[domain];
    }
    
    // For unknown domains, provide a generic corporate palette
    return {
      primary: '#2563EB', // Professional blue
      secondary: '#1E40AF',
      palette: ['#2563EB', '#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'],
      source: 'Generic professional palette'
    };
    
  } catch (error) {
    console.error('Brand color extraction failed:', error);
    return null;
  }
}

export function generateQRColorSuggestions(brandColors: BrandColors): Array<{
  foreground: string;
  background: string;
  name: string;
  validation: ColorValidation;
}> {
  const suggestions = [];
  
  // Test brand colors against white background
  for (const color of brandColors.palette) {
    const validation = validateQRColors(color, '#FFFFFF');
    suggestions.push({
      foreground: color,
      background: '#FFFFFF',
      name: `Brand Color on White`,
      validation
    });
  }
  
  // Test white/light colors against dark brand colors
  for (const color of brandColors.palette) {
    const validation = validateQRColors('#FFFFFF', color);
    if (validation.isValid) {
      suggestions.push({
        foreground: '#FFFFFF',
        background: color,
        name: `White on Brand Color`,
        validation
      });
    }
  }
  
  // Sort by contrast ratio (best first)
  return suggestions
    .filter(s => s.validation.isValid)
    .sort((a, b) => b.validation.contrast - a.validation.contrast);
}
