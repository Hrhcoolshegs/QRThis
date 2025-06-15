
import React, { useState, useCallback, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAX_CHARACTERS = 2000;
const DEBOUNCE_DELAY = 300;

// Character limit status helper
function getCharacterLimitStatus(count: number) {
  if (count <= 500) return { color: 'text-green-600', warning: false, message: '' };
  if (count <= 700) return { 
    color: 'text-yellow-600', 
    warning: true, 
    message: 'Large QR codes may be harder to scan' 
  };
  if (count <= 800) return { 
    color: 'text-orange-600', 
    warning: true, 
    message: 'Very large - may not scan reliably' 
  };
  return { 
    color: 'text-red-600', 
    warning: true, 
    message: 'Too large - scanning not guaranteed' 
  };
}

// Scan reliability indicator component
function ScanReliabilityIndicator({ characterCount }: { characterCount: number }) {
  const getReliability = (count: number) => {
    if (count <= 300) return { level: 'Excellent', color: 'bg-green-500', percentage: 98 };
    if (count <= 500) return { level: 'Very Good', color: 'bg-green-400', percentage: 92 };
    if (count <= 700) return { level: 'Good', color: 'bg-yellow-400', percentage: 80 };
    if (count <= 800) return { level: 'Fair', color: 'bg-orange-400', percentage: 65 };
    return { level: 'Poor', color: 'bg-red-400', percentage: 40 };
  };
  
  const reliability = getReliability(characterCount);
  
  if (characterCount < 300) return null;
  
  return (
    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${reliability.color}`}></div>
        <span>Scan Reliability: {reliability.level} (~{reliability.percentage}%)</span>
      </div>
    </div>
  );
}

// Smart recommendations component
function SmartRecommendations({ text, characterCount }: { text: string; characterCount: number }) {
  const recommendations = [];
  
  if (characterCount > 700) {
    if (text.includes('http://')) {
      recommendations.push('💡 Use HTTPS instead of HTTP to save characters');
    }
    if (text.includes('www.')) {
      recommendations.push('💡 Remove "www." to save characters');
    }
    if (text.includes('  ')) {
      recommendations.push('💡 Remove extra spaces to save characters');
    }
  }
  
  if (recommendations.length === 0) return null;
  
  return (
    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <div className="text-sm text-blue-800 dark:text-blue-200">
        <div className="font-medium mb-1">Optimization Tips:</div>
        {recommendations.map((tip, i) => (
          <div key={i} className="text-xs">{tip}</div>
        ))}
      </div>
    </div>
  );
}

// Enhanced character counter component
function EnhancedCharacterCounter({ count, maxCount = 2000 }: { count: number; maxCount?: number }) {
  const status = getCharacterLimitStatus(count);
  
  return (
    <div className="flex items-center justify-between text-sm">
      <div className={`transition-colors ${status.color}`}>
        {count}/{maxCount} characters
      </div>
      {status.warning && (
        <div className={`text-xs ${status.color} flex items-center gap-1`}>
          <span>⚠️</span>
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}

// Optimized QR display component
function OptimizedQRDisplay({ qrDataURL, characterCount }: { qrDataURL: string; characterCount: number }) {
  const getOptimalSize = (count: number) => {
    if (count <= 300) return 256;
    if (count <= 500) return 288;
    if (count <= 700) return 320;
    return 352;
  };
  
  const size = getOptimalSize(characterCount);
  
  return (
    <div className="qr-container">
      <img 
        src={qrDataURL} 
        alt="Generated QR Code"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          imageRendering: 'pixelated'
        }}
        className="border border-gray-200 dark:border-gray-700 rounded max-w-full"
      />
      <ScanReliabilityIndicator characterCount={characterCount} />
    </div>
  );
}

export function QRGenerator() {
  const [inputText, setInputText] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateQRCode = useCallback(async (text: string) => {
    if (!text.trim()) {
      setQrCodeDataURL('');
      setError(null);
      return;
    }

    if (text.length > MAX_CHARACTERS) {
      setError(`Text too long (max ${MAX_CHARACTERS} characters)`);
      setQrCodeDataURL('');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Enhanced QR generation with better settings
      const dataURL = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 512 // Generate at high res, display optimally
      });
      setQrCodeDataURL(dataURL);
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      setQrCodeDataURL('');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQRCode(inputText);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [inputText, generateQRCode]);

  const handleDownload = useCallback(() => {
    if (!qrCodeDataURL) return;

    const link = document.createElement('a');
    link.download = `qrthis-${Date.now()}.png`;
    link.href = qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been saved successfully!",
    });
  }, [qrCodeDataURL, toast]);

  const characterCount = inputText.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Input Section */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text, URL, WiFi password, or anything..."
                className="w-full min-h-[120px] p-4 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                autoFocus
                aria-label="Text input for QR code generation"
              />
              <div className="absolute bottom-3 right-3">
                <EnhancedCharacterCounter count={characterCount} maxCount={MAX_CHARACTERS} />
              </div>
            </div>
            
            <SmartRecommendations text={inputText} characterCount={characterCount} />
            
            <Button
              onClick={() => generateQRCode(inputText)}
              disabled={!inputText.trim() || isOverLimit || isGenerating}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium h-12 transition-all duration-200 hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate QR Code'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {error && (
        <Card className="shadow-soft border-destructive/20">
          <CardContent className="p-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {!error && inputText.trim() && !qrCodeDataURL && !isGenerating && (
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center">Enter some text to generate QR code</p>
          </CardContent>
        </Card>
      )}

      {qrCodeDataURL && (
        <Card className="shadow-soft animate-fade-in">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block shadow-soft">
                <OptimizedQRDisplay qrDataURL={qrCodeDataURL} characterCount={characterCount} />
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleDownload}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
                <p className="text-sm text-muted-foreground">
                  Right-click the QR code to save directly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
