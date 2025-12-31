import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, CheckCircle, Eye } from 'lucide-react';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { DownloadOptions } from '@/components/DownloadOptions';
import type { DownloadFormat, DownloadSize } from '@/hooks/useQRGenerator';

interface QRDisplayProps {
  qrCodeDataURL: string;
  previewDataURL?: string;
  isGenerating: boolean;
  isPreviewGenerating?: boolean;
  error: string | null;
  inputText: string;
  characterCount: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  onDownload: (format: DownloadFormat, size: DownloadSize) => void;
}

function ScanReliabilityIndicator({ characterCount }: { characterCount: number }) {
  const getReliability = (count: number) => {
    if (count <= 300) return { level: 'Excellent', color: 'bg-success', percentage: 98 };
    if (count <= 500) return { level: 'Very Good', color: 'bg-success/80', percentage: 92 };
    if (count <= 700) return { level: 'Good', color: 'bg-warning', percentage: 80 };
    if (count <= 800) return { level: 'Fair', color: 'bg-warning/80', percentage: 65 };
    return { level: 'Poor', color: 'bg-destructive', percentage: 40 };
  };
  
  const reliability = getReliability(characterCount);
  
  if (characterCount < 300) return null;
  
  return (
    <div className="mt-3 p-3 bg-muted/50 rounded-xl text-sm animate-fade-in">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${reliability.color}`}></div>
        <span className="font-medium text-foreground">
          Scan Reliability: {reliability.level} (~{reliability.percentage}%)
        </span>
      </div>
    </div>
  );
}

function QRCodeImage({ 
  src, 
  isPreview = false,
  characterCount,
  isMobile 
}: { 
  src: string; 
  isPreview?: boolean;
  characterCount: number;
  isMobile: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const getOptimalSize = (count: number, mobile: boolean) => {
    const baseSizes = mobile ? 
      { small: 200, medium: 220, large: 240, xlarge: 260 } :
      { small: 240, medium: 280, large: 320, xlarge: 360 };
    
    if (count <= 300) return baseSizes.small;
    if (count <= 500) return baseSizes.medium;
    if (count <= 700) return baseSizes.large;
    return baseSizes.xlarge;
  };
  
  const size = getOptimalSize(characterCount, isMobile);
  
  return (
    <div className="relative inline-block">
      <div 
        className={`
          relative transition-all duration-500 
          ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          ${isPreview ? 'opacity-80' : ''}
        `}
      >
        <img 
          src={src} 
          alt={isPreview ? "QR Code Preview" : "Generated QR Code"}
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            imageRendering: 'pixelated'
          }}
          className={`
            rounded-2xl shadow-lg mx-auto
            ${isPreview 
              ? 'border-2 border-dashed border-primary/40' 
              : 'border-2 border-border'
            }
          `}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Badge */}
        {isLoaded && (
          <div 
            className={`
              absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-semibold
              flex items-center gap-1 shadow-md
              ${isPreview 
                ? 'bg-primary/90 text-primary-foreground' 
                : 'bg-success text-white'
              }
            `}
          >
            {isPreview ? (
              <>
                <Eye className="w-3 h-3" />
                Preview
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3" />
                Ready
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function QRDisplay({ 
  qrCodeDataURL, 
  previewDataURL,
  isGenerating,
  isPreviewGenerating,
  error, 
  inputText, 
  characterCount,
  errorCorrectionLevel,
  onDownload 
}: QRDisplayProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const { isMobile } = useMobileOptimizations();

  useEffect(() => {
    if (qrCodeDataURL && !isGenerating) {
      setShowSuccess(true);
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
    // Error state
    if (error) {
      return (
        <div className="text-center space-y-4 animate-fade-in p-6">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-destructive">Generation Failed</h3>
            <p className="text-destructive/80 text-sm">{error}</p>
          </div>
        </div>
      );
    }

    // Empty state - no input yet
    if (!inputText.trim()) {
      return (
        <div className="text-center space-y-6 py-12 px-6">
          <div className="relative w-32 h-32 mx-auto">
            {/* Animated QR pattern placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl animate-pulse"></div>
            <div className="absolute inset-4 grid grid-cols-3 gap-1.5 p-2">
              {[...Array(9)].map((_, i) => (
                <div 
                  key={i} 
                  className={`
                    rounded-sm bg-primary/10 
                    ${[0, 2, 6, 8].includes(i) ? 'bg-primary/20' : ''}
                  `}
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                ></div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary/40" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Your QR Code Preview</h3>
            <p className="text-muted-foreground">Start typing to see a live preview</p>
          </div>
        </div>
      );
    }

    // Generating final QR code
    if (isGenerating) {
      return (
        <div className="text-center space-y-6 py-12 px-6">
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
            </div>
            <div className="absolute inset-0 w-28 h-28 mx-auto bg-primary/20 rounded-3xl animate-ping"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Creating Your QR Code</h3>
            <p className="text-muted-foreground mt-2">Optimizing for perfect scans...</p>
          </div>
        </div>
      );
    }

    // Final generated QR code
    if (qrCodeDataURL) {
      return (
        <div className="text-center space-y-6 animate-fade-in px-4">
          {showSuccess && (
            <div className="p-3 bg-success/10 border border-success/20 rounded-xl inline-flex items-center gap-2 text-success">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium text-sm">QR Code Ready!</span>
            </div>
          )}
          
          <div className="bg-background p-6 rounded-3xl shadow-xl inline-block border border-border">
            <QRCodeImage 
              src={qrCodeDataURL} 
              characterCount={characterCount}
              isMobile={isMobile}
            />
            <ScanReliabilityIndicator characterCount={characterCount} />
          </div>
          
          <DownloadOptions
            qrCodeDataURL={qrCodeDataURL}
            inputText={inputText}
            foregroundColor="#000000"
            backgroundColor="#FFFFFF"
            errorCorrectionLevel={errorCorrectionLevel}
            onDownload={onDownload}
          />
          
        </div>
      );
    }

    // Preview state - user is typing
    if (previewDataURL || isPreviewGenerating) {
      return (
        <div className="text-center space-y-6 py-8 px-4">
          <div className="relative">
            {isPreviewGenerating && !previewDataURL ? (
              <div className="w-48 h-48 mx-auto bg-muted/30 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/30">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : previewDataURL ? (
              <div className="bg-background/50 p-4 rounded-3xl inline-block border border-dashed border-primary/30">
                <QRCodeImage 
                  src={previewDataURL} 
                  isPreview={true}
                  characterCount={characterCount}
                  isMobile={isMobile}
                />
              </div>
            ) : null}
            
            {isPreviewGenerating && previewDataURL && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Click <span className="font-semibold text-primary">Generate</span> to create your final QR code
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-bold mb-2 text-foreground">Your QR Code</h2>
        <p className="text-muted-foreground">
          {qrCodeDataURL 
            ? 'Ready to download and share' 
            : previewDataURL 
              ? 'Live preview as you type'
              : 'AI-optimized for perfect scans'
          }
        </p>
      </div>

      <Card 
        id="qr-result"
        className="shadow-xl border-2 border-border bg-card min-h-[400px] flex items-center justify-center transition-all duration-500 overflow-hidden"
      >
        <CardContent className="p-6 w-full">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
