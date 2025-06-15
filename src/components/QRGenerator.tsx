
import React, { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIAssistant } from '@/components/AIAssistant';
import { PersonalizedTips } from '@/components/SmartFeatures';
import { QRInput } from '@/components/QRInput';
import { QRDisplay } from '@/components/QRDisplay';
import { BatchProcessor } from '@/components/BatchProcessor';
import { URLShortener } from '@/components/URLShortener';
import { ContextOptimizer } from '@/components/ContextOptimizer';
import { BrandColorSelector } from '@/components/BrandColorSelector';
import { Button } from '@/components/ui/button';
import { Download, Trash2, X } from 'lucide-react';
import { useQRGenerator } from '@/hooks/useQRGenerator';

const MAX_CHARACTERS = 2000;

export function QRGenerator() {
  const { toast } = useToast();
  const [batchResults, setBatchResults] = useState<any[]>([]);
  
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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Input Section - Left Side */}
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Create Your AI-Powered QR Code</h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Enter any text, URL, or data below, or let our AI assistant guide you
                </p>
              </div>
              {inputText && (
                <Button
                  onClick={handleClearInput}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                  title="Clear input"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
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

          {/* Smart Features */}
          <URLShortener 
            inputText={inputText}
            onOptimizedUrl={setInputText}
          />
          
          <ContextOptimizer 
            inputText={inputText}
            contentType={contentType}
          />
          
          <BrandColorSelector 
            inputText={inputText}
          />

          {/* Personalized Tips */}
          <PersonalizedTips suggestions={personalizedTips} />

          {/* Batch Processing */}
          <BatchProcessor onBatchGenerate={handleBatchGenerate} />
          
          {/* Batch Results */}
          {batchResults.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  Batch Results ({batchResults.length} QR codes)
                </h4>
                <div className="flex gap-2">
                  <Button
                    onClick={handleBatchDownload}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    <Download size={16} className="mr-1" />
                    Download All
                  </Button>
                  <Button
                    onClick={handleClearBatchResults}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {batchResults.slice(0, 6).map((item, index) => (
                  <div key={index} className="text-center relative group">
                    <div className="relative">
                      <img 
                        src={item.qrDataURL} 
                        alt={`QR ${index + 1}`}
                        className="w-16 h-16 mx-auto border rounded"
                      />
                      <Button
                        onClick={() => handleRemoveBatchItem(index)}
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </Button>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1 truncate">
                      {item.type}
                    </p>
                  </div>
                ))}
                {batchResults.length > 6 && (
                  <div className="flex items-center justify-center text-sm text-green-600 dark:text-green-400">
                    +{batchResults.length - 6} more
                  </div>
                )}
              </div>
            </div>
          )}
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
