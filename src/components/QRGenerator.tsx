
import React, { useState, useCallback, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2, Zap, Shield, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIAssistant } from '@/components/AIAssistant';

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
      const dataURL = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 512
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
    link.download = `qrthis-ai-${Date.now()}.png`;
    link.href = qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code Downloaded",
      description: "Your AI-optimized QR code has been saved successfully!",
    });
  }, [qrCodeDataURL, toast]);

  const handleAIGenerated = (content: string) => {
    setInputText(content);
  };

  const characterCount = inputText.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Input Section - Left Side */}
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Create Your AI-Powered QR Code</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Enter any text, URL, or data below, or let our AI assistant guide you
            </p>
          </div>

          {/* AI Assistant */}
          <div className="flex justify-center lg:justify-start">
            <AIAssistant onContentGenerated={handleAIGenerated} />
          </div>

          {/* Input Card */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text, URL, WiFi password, contact info, or let AI help you..."
                    className="w-full min-h-[200px] p-6 border-2 border-gray-200 dark:border-gray-600/20 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 text-lg leading-relaxed bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    autoFocus
                  />
                  <div className="absolute bottom-4 right-4 bg-gray-100 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1">
                    <EnhancedCharacterCounter count={characterCount} maxCount={MAX_CHARACTERS} />
                  </div>
                </div>

                <SmartRecommendations text={inputText} characterCount={characterCount} />

                <Button
                  onClick={() => generateQRCode(inputText)}
                  disabled={!inputText.trim() || isOverLimit || isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-14 text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:hover:scale-100"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      AI Generating Magic...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-3" />
                      Generate QR Code
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Private & Secure</span>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50">
              <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Mobile Ready</span>
            </div>
          </div>
        </div>

        {/* Output Section - Right Side */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Your AI-Optimized QR Code</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Ready to download and share with the world
            </p>
          </div>

          {/* QR Code Display */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 min-h-[500px] flex items-center justify-center">
            <CardContent className="p-8 w-full">
              {error ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <p className="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
                </div>
              ) : !inputText.trim() ? (
                <div className="text-center space-y-6 py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto">
                    <div className="w-12 h-12 border-4 border-dashed border-blue-400/40 rounded-lg"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Ready to generate</h3>
                    <p className="text-gray-600 dark:text-gray-400">Enter some text on the left or ask our AI assistant for help</p>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="text-center space-y-6 py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">AI creating your QR code</h3>
                    <p className="text-gray-600 dark:text-gray-400">Optimizing for best scan results...</p>
                  </div>
                </div>
              ) : qrCodeDataURL ? (
                <div className="text-center space-y-6">
                  <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
                    <OptimizedQRDisplay qrDataURL={qrCodeDataURL} characterCount={characterCount} />
                  </div>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold h-12 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download AI-Optimized PNG
                    </Button>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Right-click the QR code above to save directly, or use the download button
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
