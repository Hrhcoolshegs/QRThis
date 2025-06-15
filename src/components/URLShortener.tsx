
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Loader2 } from 'lucide-react';
import { shouldShortenUrl, shortenUrl, getUrlOptimizationBenefit, isValidUrl } from '@/utils/urlShortening';
import { detectContentType } from '@/utils/smartOptimization';

interface URLShortenerProps {
  inputText: string;
  onOptimizedUrl: (url: string) => void;
}

export function URLShortener({ inputText, onOptimizedUrl }: URLShortenerProps) {
  const [isShortening, setIsShortening] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [optimizationBenefit, setOptimizationBenefit] = useState<any>(null);

  const isUrl = detectContentType(inputText) === 'url' && isValidUrl(inputText);
  const shouldShorten = isUrl && shouldShortenUrl(inputText);

  useEffect(() => {
    // Reset when input changes
    setShortenedUrl(null);
    setOptimizationBenefit(null);
  }, [inputText]);

  const handleShortenUrl = async () => {
    if (!isUrl || !shouldShorten) return;

    setIsShortening(true);
    try {
      const shortened = await shortenUrl(inputText);
      if (shortened !== inputText) {
        setShortenedUrl(shortened);
        const benefit = getUrlOptimizationBenefit(inputText, shortened);
        setOptimizationBenefit(benefit);
      }
    } catch (error) {
      console.error('URL shortening failed:', error);
    } finally {
      setIsShortening(false);
    }
  };

  const handleUseShortened = () => {
    if (shortenedUrl) {
      onOptimizedUrl(shortenedUrl);
    }
  };

  if (!shouldShorten) return null;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Smart URL Optimization</h4>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              🔗 This URL is quite long ({inputText.length} characters)
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300 mb-3">
              Shorter URLs scan more reliably and create cleaner QR codes
            </p>
            
            {!shortenedUrl ? (
              <Button
                onClick={handleShortenUrl}
                disabled={isShortening}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                size="sm"
              >
                {isShortening ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  'Shorten URL'
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Optimized URL:</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                    {shortenedUrl}
                  </p>
                </div>
                
                {optimizationBenefit && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-green-600 dark:text-green-400">
                      ✅ {optimizationBenefit.charsSaved} chars saved ({optimizationBenefit.percentSaved}%)
                    </div>
                    <div className="text-blue-600 dark:text-blue-400">
                      📱 {optimizationBenefit.scanImprovement} Scanning
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={handleUseShortened}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm"
                  size="sm"
                >
                  Use Optimized URL
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
