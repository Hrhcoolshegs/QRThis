
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

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
    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${reliability.color}`}></div>
        <span>Scan Reliability: {reliability.level} (~{reliability.percentage}%)</span>
      </div>
    </div>
  );
}

function OptimizedQRImage({ qrDataURL, characterCount }: { qrDataURL: string; characterCount: number }) {
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

export function QRDisplay({ 
  qrCodeDataURL, 
  isGenerating, 
  error, 
  inputText, 
  characterCount, 
  onDownload 
}: QRDisplayProps) {
  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
        </div>
      );
    }

    if (!inputText.trim()) {
      return (
        <div className="text-center space-y-6 py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto">
            <div className="w-12 h-12 border-4 border-dashed border-blue-400/40 rounded-lg"></div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Ready to generate</h3>
            <p className="text-gray-600 dark:text-gray-400">Enter some text on the left or ask our AI assistant for help</p>
          </div>
        </div>
      );
    }

    if (isGenerating) {
      return (
        <div className="text-center space-y-6 py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">AI creating your QR code</h3>
            <p className="text-gray-600 dark:text-gray-400">Optimizing for best scan results...</p>
          </div>
        </div>
      );
    }

    if (qrCodeDataURL) {
      return (
        <div className="text-center space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
            <OptimizedQRImage qrDataURL={qrCodeDataURL} characterCount={characterCount} />
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={onDownload}
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
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Your AI-Optimized QR Code</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Ready to download and share with the world
        </p>
      </div>

      <Card className="shadow-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 min-h-[500px] flex items-center justify-center">
        <CardContent className="p-8 w-full">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
