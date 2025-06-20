import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { QrCode, AlertCircle, CheckCircle, Undo2, Loader2 } from 'lucide-react';
import { optimizeText, detectContentType } from '@/utils/smartOptimization';
import { validateQRContent } from '@/utils/securityUtils';

interface QRInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isOverLimit: boolean;
  characterCount: number;
  maxCharacters: number;
  optimizationShown: boolean;
  savedChars: number;
  onUndoOptimization: () => void;
  contentType: string;
  errorCorrectionLevel: string;
}

export function QRInput({
  inputText,
  onInputChange,
  onGenerate,
  isGenerating,
  isOverLimit,
  characterCount,
  maxCharacters,
  optimizationShown,
  savedChars,
  onUndoOptimization,
}: QRInputProps) {
  const { toast } = useToast();
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string>('');

  // Validate input in real-time
  useEffect(() => {
    if (!inputText.trim()) {
      setIsValid(false);
      setValidationError('Please enter some text or URL to generate a QR code');
      return;
    }

    if (isOverLimit) {
      setIsValid(false);
      setValidationError(`Content is too long (${characterCount}/${maxCharacters} characters)`);
      return;
    }

    // Validate content based on type
    const validation = validateQRContent(inputText, detectContentType(inputText));
    if (!validation.isValid) {
      setIsValid(false);
      setValidationError(validation.error || 'Invalid content');
      return;
    }

    setIsValid(true);
    setValidationError('');
  }, [inputText, isOverLimit, characterCount, maxCharacters]);

  const handleGenerate = () => {
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text or URL to generate a QR code",
        variant: "destructive"
      });
      return;
    }

    onGenerate();
  };

  // Optimization logic
  const [optimizedText, setOptimizedText] = useState(inputText);
  const [showOptimization, setShowOptimization] = useState(false);

  const handleOptimize = () => {
    const { optimized, saved } = optimizeText(inputText);
    setOptimizedText(optimized);
    onInputChange(optimized);
    setShowOptimization(true);
    toast({
      title: "Content Optimized",
      description: `Saved ${saved} characters!`,
    });
  };

  const handleUndo = () => {
    onInputChange(inputText);
    setShowOptimization(false);
    toast({
      title: "Optimization Undone",
      description: "Reverted to original content.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Input Field */}
      <div className="space-y-2">
        <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter your text or URL
        </label>
        <div className="relative">
          <textarea
            id="qr-input"
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Enter your text, URL, email, or any content..."
            className={`w-full h-32 p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900/50 ${
              !isValid && inputText.trim()
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500/20 focus:border-blue-500'
            }`}
          />
          
          {/* Character Counter */}
          <div className="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400">
            <span className={characterCount > maxCharacters ? 'text-red-500' : ''}>
              {characterCount}/{maxCharacters}
            </span>
          </div>
        </div>

        {/* Show validation error only when there's actual invalid content */}
        {!isValid && inputText.trim() && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Optimization Banner */}
      {optimizationShown && savedChars > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">
                  Content Optimized!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Saved {savedChars} characters by removing extra spaces and optimizing formatting.
                </p>
              </div>
            </div>
            <Button
              onClick={onUndoOptimization}
              variant="ghost"
              size="sm"
              className="text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200"
            >
              <Undo2 size={14} className="mr-1" />
              Undo
            </Button>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || (!inputText.trim())}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold h-12 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            Generating QR Code...
          </>
        ) : (
          <>
            <QrCode className="w-5 h-5 mr-3" />
            Generate QR Code
          </>
        )}
      </Button>
    </div>
  );
}
