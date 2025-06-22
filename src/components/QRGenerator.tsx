import React, { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIAssistant } from '@/components/AIAssistant';
import { AIArtQR } from '@/components/AIArtQR';
import { PersonalizedTips } from '@/components/SmartFeatures';
import { QRInput } from '@/components/QRInput';
import { QRDisplay } from '@/components/QRDisplay';
import { BatchProcessor } from '@/components/BatchProcessor';
import { Button } from '@/components/ui/button';
import { Download, Trash2, X, ChevronDown, ChevronUp, Sparkles, Zap, BarChart3 } from 'lucide-react';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';

const MAX_CHARACTERS = 2000;

export function QRGenerator() {
  const { toast } = useToast();
  const { isMobile } = useMobileOptimizations();
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [showAIArtSection, setShowAIArtSection] = useState(false);
  
  const {
    inputText,
    setInputText,
    qrCodeDataURL,
    isGenerating,
    error,
    optimizationShown,
    savedChars,
    contentType,
    errorCorrectionLevel,
    personalizedTips,
    generateQRCode,
    handleUndoOptimization,
    characterCount,
    isOverLimit
  } = useQRGenerator({ maxCharacters: MAX_CHARACTERS });

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
      description: "Your QR code has been saved successfully!",
    });
  }, [qrCodeDataURL, toast]);

  const handleAIGenerated = useCallback((content: string) => {
    setInputText(content);
  }, [setInputText]);

  const handleBatchGenerate = useCallback((items: any[]) => {
    setBatchResults(items);
    toast({
      title: "Batch Processing Complete",
      description: `Generated ${items.length} QR codes successfully!`,
    });
  }, [toast]);

  const handleBatchDownload = useCallback(() => {
    batchResults.forEach((item, index) => {
      if (item.qrDataURL) {
        const link = document.createElement('a');
        link.download = item.filename;
        link.href = item.qrDataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    
    toast({
      title: "Batch Download Complete",
      description: `Downloaded ${batchResults.length} QR codes!`,
    });
  }, [batchResults, toast]);

  const handleClearBatchResults = useCallback(() => {
    setBatchResults([]);
  }, []);

  const handleRemoveBatchItem = useCallback((index: number) => {
    setBatchResults(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearInput = useCallback(() => {
    setInputText('');
  }, [setInputText]);

  const handleArtGenerate = useCallback(async (artStyle: string, customPrompt?: string) => {
    setIsGeneratingArt(true);
    try {
      console.log('Generating AI art QR with style:', artStyle, 'and prompt:', customPrompt);
      toast({
        title: "Coming Soon",
        description: "AI Art QR generation is coming soon!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI art QR code.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingArt(false);
    }
  }, [toast]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 md:space-y-12 relative">
      
      {/* Main QR Generator Section - Mobile First */}
      <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 md:p-10">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Quick QR Generator
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Enter your text or URL below to create a QR code instantly with AI precision
          </p>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-6 sm:gap-10 md:gap-16 items-start`}>
          {/* Input Section */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* QR Input */}
            <QRInput
              inputText={inputText}
              onInputChange={setInputText}
              onGenerate={() => generateQRCode(inputText)}
              isGenerating={isGenerating}
              isOverLimit={isOverLimit}
              characterCount={characterCount}
              maxCharacters={MAX_CHARACTERS}
              optimizationShown={optimizationShown}
              savedChars={savedChars}
              onUndoOptimization={handleUndoOptimization}
              contentType={contentType}
              errorCorrectionLevel={errorCorrectionLevel}
            />

            {/* Clear Button */}
            {inputText && (
              <div className="flex justify-center">
                <Button
                  onClick={handleClearInput}
                  variant="outline"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 border-gray-300/50 hover:border-gray-400/50 backdrop-blur-sm text-sm sm:text-base"
                >
                  <Trash2 size={14} className="mr-2" />
                  Clear Input
                </Button>
              </div>
            )}

            {/* Smart Tips */}
            {personalizedTips.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200/50 dark:border-amber-700/30 shadow-lg">
                <PersonalizedTips suggestions={personalizedTips} />
              </div>
            )}
          </div>

          {/* Output Section */}
          <QRDisplay
            qrCodeDataURL={qrCodeDataURL}
            isGenerating={isGenerating}
            error={error}
            inputText={inputText}
            characterCount={characterCount}
            onDownload={handleDownload}
          />
        </div>
      </div>

      {/* Smart Batch Processing Section - Mobile Optimized */}
      <div className="bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-green-200/50 dark:border-green-700/30 p-4 sm:p-6 md:p-10">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Smart Batch Processing
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            Generate multiple QR codes at once - perfect for events, inventory, or bulk operations
          </p>
        </div>

        <BatchProcessor onBatchGenerate={handleBatchGenerate} />
        
        {/* Batch Results - Mobile Optimized */}
        {batchResults.length > 0 && (
          <div className="mt-6 sm:mt-10 p-4 sm:p-6 md:p-8 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-green-200/50 dark:border-green-700/30 shadow-lg">
            <div className="flex flex-col gap-4 mb-4 sm:mb-6">
              <h4 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent text-center sm:text-left">
                📦 Batch Results ({batchResults.length} QR codes)
              </h4>
              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
                <Button
                  onClick={handleBatchDownload}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                  size="sm"
                >
                  <Download size={16} className="mr-2" />
                  Download All
                </Button>
                <Button
                  onClick={handleClearBatchResults}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 border-red-300/50 hover:border-red-400/50 text-sm sm:text-base"
                  size="sm"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'} gap-4 sm:gap-6`}>
              {batchResults.slice(0, 12).map((item, index) => (
                <div key={index} className="text-center relative group">
                  <div className="relative">
                    <img 
                      src={item.qrDataURL} 
                      alt={`QR ${index + 1}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto border-2 border-gray-200/50 dark:border-gray-700/50 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105"
                    />
                    <Button
                      onClick={() => handleRemoveBatchItem(index)}
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-3 font-medium truncate">
                    {item.type}
                  </p>
                </div>
              ))}
              {batchResults.length > 12 && (
                <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500 bg-gray-100/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                  +{batchResults.length - 12} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI Art QR Section - Mobile Optimized */}
      <div className="bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-rose-50/80 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-700/30 p-4 sm:p-6 md:p-10">
        <div className="text-center mb-6 sm:mb-8">
          <Button
            onClick={() => setShowAIArtSection(!showAIArtSection)}
            variant="ghost"
            className="w-full flex items-center justify-center space-x-3 sm:space-x-4 p-6 sm:p-8 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-all duration-300 rounded-xl sm:rounded-2xl group"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  AI Art QR Generator
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mt-1">
                  Transform your QR codes into stunning artwork (Coming Soon)
                </p>
              </div>
            </div>
            {showAIArtSection ? (
              <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 group-hover:scale-110 transition-all duration-300" />
            ) : (
              <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 group-hover:scale-110 transition-all duration-300" />
            )}
          </Button>
        </div>
        
        {showAIArtSection && (
          <div className="mt-6 sm:mt-8 animate-fade-in">
            <AIArtQR 
              inputText={inputText}
              onGenerate={handleArtGenerate}
              isGenerating={isGeneratingArt}
            />
          </div>
        )}
      </div>

      {/* Floating AI Assistant - Mobile Optimized */}
      <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-40`}>
        <AIAssistant onContentGenerated={handleAIGenerated} />
      </div>
    </div>
  );
}
