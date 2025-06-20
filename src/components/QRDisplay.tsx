
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Sparkles, CheckCircle } from 'lucide-react';

interface QRDisplayProps {
  qrCodeDataURL: string;
  isGenerating: boolean;
  error: string | null;
  inputText: string;
  characterCount: number;
  onDownload: () => void;
}

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
    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm animate-fade-in">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${reliability.color} animate-pulse`}></div>
        <span className="font-medium">Scan Reliability: {reliability.level} (~{reliability.percentage}%)</span>
      </div>
    </div>
  );
}

function OptimizedQRImage({ qrDataURL, characterCount }: { qrDataURL: string; characterCount: number }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const getOptimalSize = (count: number) => {
    if (count <= 300) return 280;
    if (count <= 500) return 320;
    if (count <= 700) return 360;
    return 400;
  };
  
  const size = getOptimalSize(characterCount);
  
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
          className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg max-w-full"
          onLoad={() => setIsLoaded(true)}
        />
        {isLoaded && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <ScanReliabilityIndicator characterCount={characterCount} />
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

  useEffect(() => {
    if (qrCodeDataURL && !isGenerating) {
      setShowSuccess(true);
      // Auto-scroll to QR code section
      const qrSection = document.getElementById('qr-result');
      if (qrSection) {
        qrSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [qrCodeDataURL, isGenerating]);

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Generation Failed</h3>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      );
    }

    if (!inputText.trim()) {
      return (
        <div className="text-center space-y-6 py-12">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl flex items-center justify-center mx-auto">
            <div className="w-16 h-16 border-4 border-dashed border-blue-400/40 dark:border-blue-600/40 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-blue-400 dark:text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Ready to Create Magic</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Your QR code will appear here once generated</p>
          </div>
        </div>
      );
    }

    if (isGenerating) {
      return (
        <div className="text-center space-y-6 py-12">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Generating Your QR Code</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">AI is optimizing for perfect scan results...</p>
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
        <div className="text-center space-y-6 animate-fade-in">
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl">
              <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">QR Code Generated Successfully!</span>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-900/50 p-8 rounded-3xl shadow-2xl inline-block border border-gray-100 dark:border-gray-800">
            <OptimizedQRImage qrDataURL={qrCodeDataURL} characterCount={characterCount} />
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={onDownload}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold h-14 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl text-lg"
            >
              <Download className="w-6 h-6 mr-3" />
              Download QR Code
            </Button>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
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
    <div className="space-y-8">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Your QR Code Result</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          AI-optimized for perfect scanning every time
        </p>
      </div>

      <Card 
        id="qr-result"
        className="shadow-2xl border border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 min-h-[600px] flex items-center justify-center transition-all duration-500"
      >
        <CardContent className="p-8 w-full">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
