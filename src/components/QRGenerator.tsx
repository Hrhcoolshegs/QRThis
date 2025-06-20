
import React, { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Input Section - Left Side */}
        <div className="space-y-6">
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
