
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';

interface QRDisplayProps {
  qrCodeDataURL: string;
  isGenerating: boolean;
  error: string | null;
  inputText: string;
  characterCount: number;
  onDownload: () => void;
}

function ScanReliabilityIndicator({ characterCount, isMobile }: { characterCount: number; isMobile: boolean }) {
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
    <div className={`mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} animate-fade-in`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${reliability.color} animate-pulse`}></div>
        <span className="font-medium">Scan Reliability: {reliability.level} (~{reliability.percentage}%)</span>
      </div>
    </div>
  );
}

function OptimizedQRImage({ qrDataURL, characterCount, isMobile }: { qrDataURL: string; characterCount: number; isMobile: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const getOptimalSize = (count: number, mobile: boolean) => {
    const baseSizes = mobile ? 
      { small: 200, medium: 240, large: 280, xlarge: 320 } :
      { small: 280, medium: 320, large: 360, xlarge: 400 };
    
    if (count <= 300) return baseSizes.small;
    if (count <= 500) return baseSizes.medium;
    if (count <= 700) return baseSizes.large;
    return baseSizes.xlarge;
  };
  
  const size = getOptimalSize(characterCount, isMobile);
  
  return (
    <div className="qr-container">
      <div className={`relative transition-all duration-500 ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <img 
          src={qrDataURL} 
          alt="Generated QR Code"
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            imageRendering: 'pixelated'
          }}
          className="border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-lg max-w-full mx-auto"
          onLoad={() => setIsLoaded(true)}
        />
        {isLoaded && (
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        )}
      </div>
      <ScanReliabilityIndicator characterCount={characterCount} isMobile={isMobile} />
    </div>
  );
}

export function QRDisplay({ 
  qrCodeDataURL, 
  isGenerating, 
  error, 
  inputText, 
  characterCount, 
  onDownload 
}: QRDisplayProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const { isMobile } = useMobileOptimizations();

  useEffect(() => {
    if (qrCodeDataURL && !isGenerating) {
      setShowSuccess(true);
      // Auto-scroll to QR code section on mobile
      if (isMobile) {
        setTimeout(() => {
          const qrSection = document.getElementById('qr-result');
          if (qrSection) {
            qrSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [qrCodeDataURL, isGenerating, isMobile]);

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center space-y-3 sm:space-y-4 animate-fade-in px-4 sm:px-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl sm:text-3xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Generation Failed</h3>
            <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      );
    }

    if (!inputText.trim()) {
      return (
        <div className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12 px-4 sm:px-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-dashed border-blue-400/40 dark:border-blue-600/40 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 dark:text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">Ready to Create Magic</h3>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">Your QR code will appear here once generated</p>
          </div>
        </div>
      );
    }

    if (isGenerating) {
      return (
        <div className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12 px-4 sm:px-0">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-spin" />
            </div>
            <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl sm:rounded-3xl animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Generating Your QR Code</h3>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">AI is optimizing for perfect scan results...</p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (qrCodeDataURL) {
      return (
        <div className="text-center space-y-4 sm:space-y-6 animate-fade-in px-4 sm:px-0">
          {showSuccess && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg sm:rounded-xl">
              <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">QR Code Generated Successfully!</span>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-900/50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl inline-block border border-gray-100 dark:border-gray-800">
            <OptimizedQRImage qrDataURL={qrCodeDataURL} characterCount={characterCount} isMobile={isMobile} />
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <Button
              onClick={onDownload}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl text-base sm:text-lg w-full sm:w-auto"
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Download QR Code
            </Button>
            
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>🎯 High-resolution PNG format</p>
              <p>📱 Optimized for all devices and print</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">Your QR Code Result</h2>
        <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg">
          AI-optimized for perfect scanning every time
        </p>
      </div>

      <Card 
        id="qr-result"
        className="shadow-2xl border border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 min-h-[400px] sm:min-h-[600px] flex items-center justify-center transition-all duration-500"
      >
        <CardContent className="p-4 sm:p-6 md:p-8 w-full">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
