import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { QRInputNew } from '@/components/QRInputNew';
import { QRDisplay } from '@/components/QRDisplay';
import { ColorCustomizer } from '@/components/ColorCustomizer';
import { AIArtGenerator } from '@/components/AIArtGenerator';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { useAIArtQR } from '@/hooks/useAIArtQR';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Sparkles } from 'lucide-react';
import type { DownloadFormat, DownloadSize } from '@/hooks/useQRGenerator';

const MAX_CHARACTERS = 2000;

export function QRGeneratorNew() {
  const { toast } = useToast();
  const { isMobile } = useMobileOptimizations();
  const [activeTab, setActiveTab] = useState('standard');
  
  const {
    inputText,
    setInputText,
    qrCodeDataURL,
    previewDataURL,
    isGenerating,
    isPreviewGenerating,
    error,
    optimizationShown,
    savedChars,
    contentType,
    errorCorrectionLevel,
    generateQRCode,
    handleUndoOptimization,
    characterCount,
    isOverLimit,
    foregroundColor,
    backgroundColor,
    setForegroundColor,
    setBackgroundColor,
    resetColors,
    downloadQRCode
  } = useQRGenerator({ maxCharacters: MAX_CHARACTERS });

  const {
    selectedStyle,
    setSelectedStyle,
    isGenerating: isAIGenerating,
    generatedImageUrl,
    error: aiError,
    generateArtQR,
    downloadArtQR,
    reset: resetAIArt,
  } = useAIArtQR();

  const handleDownload = (format: DownloadFormat, size: DownloadSize) => {
    downloadQRCode(format, size);
    toast({
      title: "Success!",
      description: `Your QR code has been downloaded as ${format.toUpperCase()}`,
    });
  };

  const handleAIGenerate = async () => {
    await generateArtQR(inputText);
    if (!aiError) {
      toast({
        title: "AI Art Generated!",
        description: "Your artistic QR code is ready to download.",
      });
    }
  };

  const handleAIDownload = () => {
    downloadArtQR();
    toast({
      title: "Downloaded!",
      description: "Your AI Art QR code has been saved.",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Main Container */}
      <div className="bg-card/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="text-center px-4 sm:px-8 pt-8 sm:pt-10 pb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary via-primary-hover to-accent rounded-xl sm:rounded-2xl shadow-lg mb-4">
            <QrCode className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            QR Code Generator
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Create beautiful, scannable QR codes in seconds
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 h-11 sm:h-12 p-1 bg-muted/50 border border-border rounded-xl mb-6 sm:mb-8">
              <TabsTrigger 
                value="standard" 
                className="flex items-center justify-center gap-1.5 sm:gap-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span className="font-medium">Standard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai-art" 
                className="flex items-center justify-center gap-1.5 sm:gap-2 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-pink-500/10 data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">AI Art</span>
              </TabsTrigger>
            </TabsList>

            {/* Standard QR Tab */}
            <TabsContent value="standard" className="mt-0 pb-8 sm:pb-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Left Column - Input Section */}
                <div className="space-y-5 sm:space-y-6 order-1">
                  <QRInputNew
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

                  {/* Color Customizer */}
                  <ColorCustomizer
                    foregroundColor={foregroundColor}
                    backgroundColor={backgroundColor}
                    onForegroundChange={setForegroundColor}
                    onBackgroundChange={setBackgroundColor}
                    onReset={resetColors}
                  />

                  {/* Optimization badge */}
                  {optimizationShown && savedChars > 0 && (
                    <div className="p-3 sm:p-4 bg-success/10 border border-success/20 rounded-xl animate-fade-in">
                      <div className="flex items-center gap-2 text-success text-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Optimized: Saved {savedChars} characters</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Output Section */}
                <div className="order-2">
                  <QRDisplay
                    qrCodeDataURL={qrCodeDataURL}
                    previewDataURL={previewDataURL}
                    isGenerating={isGenerating}
                    isPreviewGenerating={isPreviewGenerating}
                    error={error}
                    inputText={inputText}
                    characterCount={characterCount}
                    errorCorrectionLevel={errorCorrectionLevel}
                    onDownload={handleDownload}
                  />
                </div>
              </div>
            </TabsContent>

            {/* AI Art QR Tab */}
            <TabsContent value="ai-art" className="mt-0 pb-8 sm:pb-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Left Column - Input Section */}
                <div className="space-y-5 sm:space-y-6 order-1">
                  <QRInputNew
                    inputText={inputText}
                    onInputChange={setInputText}
                    onGenerate={() => {}}
                    isGenerating={isAIGenerating}
                    isOverLimit={isOverLimit}
                    characterCount={characterCount}
                    maxCharacters={MAX_CHARACTERS}
                    optimizationShown={false}
                    savedChars={0}
                    onUndoOptimization={() => {}}
                    contentType={contentType}
                    errorCorrectionLevel={errorCorrectionLevel}
                    hideGenerateButton={true}
                  />
                </div>

                {/* Right Column - AI Art Generator */}
                <div className="order-2">
                  <AIArtGenerator
                    inputText={inputText}
                    selectedStyle={selectedStyle}
                    onSelectStyle={setSelectedStyle}
                    onGenerate={handleAIGenerate}
                    isGenerating={isAIGenerating}
                    generatedImageUrl={generatedImageUrl}
                    error={aiError}
                    onDownload={handleAIDownload}
                    onReset={resetAIArt}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
