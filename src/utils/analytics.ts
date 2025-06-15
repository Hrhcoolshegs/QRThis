
interface Analytics {
  contentTypes: Record<string, number>;
  commonDomains: Record<string, number>;
  avgLength: number;
  timePatterns: Record<string, number>;
  totalGenerated: number;
  lengths: number[];
}

const STORAGE_KEY = 'qrthis_analytics';

export function getAnalytics(): Analytics {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.log('Error loading analytics:', error);
  }
  
  return {
    contentTypes: {},
    commonDomains: {},
    avgLength: 0,
    timePatterns: {},
    totalGenerated: 0,
    lengths: []
  };
}

export function trackUsage(content: string, contentType: string): void {
  try {
    const analytics = getAnalytics();
    
    // Update content types
    analytics.contentTypes[contentType] = (analytics.contentTypes[contentType] || 0) + 1;
    
    // Track domains for URLs
    if (contentType === 'url') {
      try {
        const domain = new URL(content.trim()).hostname;
        analytics.commonDomains[domain] = (analytics.commonDomains[domain] || 0) + 1;
      } catch {}
    }
    
    // Update length tracking
    analytics.lengths.push(content.length);
    if (analytics.lengths.length > 100) {
      analytics.lengths = analytics.lengths.slice(-100); // Keep last 100
    }
    analytics.avgLength = analytics.lengths.reduce((a, b) => a + b, 0) / analytics.lengths.length;
    
    // Track time patterns
    const hour = new Date().getHours().toString();
    analytics.timePatterns[hour] = (analytics.timePatterns[hour] || 0) + 1;
    
    // Update total
    analytics.totalGenerated++;
    
    // Store back
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.log('Error tracking usage:', error);
  }
}

export function getPersonalizedTips(): string[] {
  try {
    const analytics = getAnalytics();
    const tips: string[] = [];
    
    if (analytics.totalGenerated > 10) {
      const mostUsedType = Object.entries(analytics.contentTypes)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (mostUsedType) {
        const [type, count] = mostUsedType;
        if (type === 'url' && count > 5) {
          tips.push("You create a lot of URL QR codes. Consider bookmarking QRThis for quick access!");
        }
        if (type === 'wifi' && count > 2) {
          tips.push("You're a WiFi QR pro! Did you know you can create guest network codes too?");
        }
      }
    }
    
    if (analytics.avgLength > 500) {
      tips.push("Your QR codes tend to be long. Try our optimization features for better scanning.");
    }
    
    if (analytics.totalGenerated > 20) {
      tips.push("You're a power user! Remember you can save QR codes directly to your photos.");
    }
    
    return tips.slice(0, 2); // Limit to 2 tips
  } catch (error) {
    return [];
  }
}
