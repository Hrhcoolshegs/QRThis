
import React, { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIAssistant } from '@/components/AIAssistant';
import { PersonalizedTips } from '@/components/SmartFeatures';
import { QRInput } from '@/components/QRInput';
import { QRDisplay } from '@/components/QRDisplay';
import { useQRGenerator } from '@/hooks/useQRGenerator';

const MAX_CHARACTERS = 2000;

export function QRGenerator() {
  const { toast } = useToast();
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
      description: "Your AI-optimized QR code has been saved successfully!",
    });
  }, [qrCodeDataURL, toast]);

  const handleAIGenerated = useCallback((content: string) => {
    setInputText(content);
  }, [setInputText]);

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

          {/* Personalized Tips */}
          <PersonalizedTips suggestions={personalizedTips} />
        </div>

        {/* Output Section - Right Side */}
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
  );
}
