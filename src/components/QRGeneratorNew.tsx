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
    <div className="w-full max-w-7xl mx-auto relative">
      {/* Main Content */}
      <div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-border p-6 sm:p-8 md:p-12 animate-fade-in">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary via-primary-hover to-accent rounded-2xl shadow-lg mb-4 animate-pulse-glow">
            <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
              <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            QR Code Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful, scannable QR codes in seconds
          </p>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12 p-1 bg-muted/50 border border-border">
            <TabsTrigger 
              value="standard" 
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span className="font-medium">Standard QR</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-art" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-pink-500/10 data-[state=active]:shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">AI Art QR</span>
            </TabsTrigger>
          </TabsList>

          {/* Standard QR Tab */}
          <TabsContent value="standard" className="mt-0">
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'lg:grid-cols-2 gap-16'} items-start`}>
              {/* Input Section */}
              <div className="space-y-6">
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
                  <div className="p-4 bg-success/10 border border-success/20 rounded-xl animate-fade-in">
                    <div className="flex items-center gap-2 text-success">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Optimized: Saved {savedChars} characters</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Output Section */}
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
          </TabsContent>

          {/* AI Art QR Tab */}
          <TabsContent value="ai-art" className="mt-0">
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'lg:grid-cols-2 gap-16'} items-start`}>
              {/* Input Section for AI Art */}
              <div className="space-y-6">
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

              {/* AI Art Generator */}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
