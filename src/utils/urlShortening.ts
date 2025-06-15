
// Smart URL shortening utilities

export function shouldShortenUrl(url: string): boolean {
  return url.length > 60 || // Long URLs
         url.includes('?') || // URLs with parameters
         url.includes('#');   // URLs with anchors
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Simple URL shortening using TinyURL API (public, no key required)
export async function shortenUrl(url: string): Promise<string> {
  try {
    if (!isValidUrl(url)) {
      throw new Error('Invalid URL');
    }

    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Shortening service unavailable');
    }
    
    const shortUrl = await response.text();
    
    // Validate the response is a URL
    if (shortUrl.includes('tinyurl.com')) {
      return shortUrl;
    } else {
      throw new Error('Invalid response from shortening service');
    }
  } catch (error) {
    console.error('URL shortening failed:', error);
    // Fallback: return original URL
    return url;
  }
}

export function getUrlOptimizationBenefit(originalUrl: string, shortenedUrl: string): {
  charsSaved: number;
  percentSaved: number;
  scanImprovement: string;
} {
  const charsSaved = originalUrl.length - shortenedUrl.length;
  const percentSaved = Math.round((charsSaved / originalUrl.length) * 100);
  
  let scanImprovement = 'Better';
  if (percentSaved > 50) scanImprovement = 'Much Better';
  if (percentSaved > 70) scanImprovement = 'Excellent';
  
  return {
    charsSaved,
    percentSaved,
    scanImprovement
  };
}
