
import React, { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIAssistant } from '@/components/AIAssistant';
import { AIArtQR } from '@/components/AIArtQR';
import { PersonalizedTips } from '@/components/SmartFeatures';
import { QRInput } from '@/components/QRInput';
import { QRDisplay } from '@/components/QRDisplay';
import { BatchProcessor } from '@/components/BatchProcessor';
import { Button } from '@/components/ui/button';
import { Download, Trash2, X, Sparkles } from 'lucide-react';
import { useQRGenerator } from '@/hooks/useQRGenerator';

const MAX_CHARACTERS = 2000;

export function QRGenerator() {
  const { toast } = useToast();
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  
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

  const handleArtGenerate = useCallback(async (artStyle: string, customPrompt?: string) => {
    setIsGeneratingArt(true);
    try {
      // This would be implemented with actual AI art generation
      console.log('Generating AI art QR with style:', artStyle, 'and prompt:', customPrompt);
      toast({
        title: "AI Art QR Generated",
        description: "Your artistic QR code has been created!",
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
    <div className="w-full max-w-7xl mx-auto space-y-12">
      
      {/* Main QR Generator Section */}
      <div className="bg-white dark:bg-gray-800/30 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            🎯 Quick QR Generator
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Enter your text or URL below to create a QR code instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Input Section */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">✨ Need Help?</h4>
              </div>
              <AIAssistant onContentGenerated={handleAIGenerated} />
            </div>

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
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear Input
                </Button>
              </div>
            )}

            {/* Smart Tips */}
            {personalizedTips.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700/50">
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

      {/* AI Art QR Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Sparkles className="text-purple-600" />
            AI Art QR Generator
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
            Transform your QR codes into stunning artwork - premium feature for creative professionals
          </p>
        </div>
        
        <AIArtQR 
          inputText={inputText}
          onGenerate={handleArtGenerate}
          isGenerating={isGeneratingArt}
        />
      </div>

      {/* Smart Batch Processing Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg border border-green-200 dark:border-green-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            ⚡ Smart Batch Processing
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
            Generate multiple QR codes at once - perfect for events, inventory, or bulk operations
          </p>
        </div>

        <BatchProcessor onBatchGenerate={handleBatchGenerate} />
        
        {/* Batch Results */}
        {batchResults.length > 0 && (
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-green-800 dark:text-green-200">
                📦 Batch Results ({batchResults.length} QR codes)
              </h4>
              <div className="flex gap-3">
                <Button
                  onClick={handleBatchDownload}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download size={16} className="mr-2" />
                  Download All
                </Button>
                <Button
                  onClick={handleClearBatchResults}
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {batchResults.slice(0, 12).map((item, index) => (
                <div key={index} className="text-center relative group">
                  <div className="relative">
                    <img 
                      src={item.qrDataURL} 
                      alt={`QR ${index + 1}`}
                      className="w-20 h-20 mx-auto border rounded-lg shadow-sm"
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
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate">
                    {item.type}
                  </p>
                </div>
              ))}
              {batchResults.length > 12 && (
                <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  +{batchResults.length - 12} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
