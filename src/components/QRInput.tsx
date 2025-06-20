
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { QrCode, AlertCircle, CheckCircle, Undo2, Loader2, Globe, Mail, MessageSquare, Smartphone } from 'lucide-react';
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

const contentTypeIcons = {
  'url': Globe,
  'email': Mail,
  'phone': Smartphone,
  'text': MessageSquare,
  'sms': MessageSquare,
  'wifi': Globe
};

const quickActions = [
  { label: 'Website URL', placeholder: 'https://example.com', icon: Globe },
  { label: 'Email', placeholder: 'hello@example.com', icon: Mail },
  { label: 'Phone', placeholder: '+1 (555) 123-4567', icon: Smartphone },
  { label: 'Text', placeholder: 'Your message here...', icon: MessageSquare }
];

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
  contentType
}: QRInputProps) {
  const { toast } = useToast();
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  // Validate input in real-time
  useEffect(() => {
    if (!inputText.trim()) {
      setIsValid(true); // Don't show error for empty input
      setValidationError('');
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
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text or URL to generate a QR code",
        variant: "destructive"
      });
      return;
    }

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    // Add visual feedback and animation
    const button = document.querySelector('[data-generate-button]') as HTMLElement;
    if (button) {
      button.style.transform = 'scale(0.98)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }

    onGenerate();
  };

  const handleQuickAction = (placeholder: string) => {
    onInputChange(placeholder);
    setIsFocused(true);
  };

  const ContentTypeIcon = contentTypeIcons[contentType as keyof typeof contentTypeIcons] || MessageSquare;

  return (
    <div className="space-y-6">
      {/* Smart Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="qr-input" className="block text-lg font-semibold text-gray-900 dark:text-white">
            What would you like to share?
          </label>
          {inputText.trim() && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <ContentTypeIcon size={16} />
              <span className="capitalize">{contentType}</span>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        {!inputText.trim() && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.placeholder)}
                className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 text-left group"
              >
                <action.icon size={18} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Enhanced Input Field */}
        <div className="relative">
          <div className={`relative rounded-2xl transition-all duration-300 ${
            isFocused || inputText.trim() 
              ? 'ring-2 ring-blue-500/20 shadow-lg scale-[1.02]' 
              : 'shadow-md hover:shadow-lg'
          }`}>
            <textarea
              id="qr-input"
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type or paste your content here... (URL, text, email, phone number)"
              className={`w-full h-32 p-6 border-2 rounded-2xl resize-none focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900/50 text-lg ${
                !isValid && inputText.trim()
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
              }`}
            />
            
            {/* Character Counter */}
            <div className="absolute bottom-4 right-4 flex items-center space-x-3">
              {inputText.trim() && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  characterCount > maxCharacters 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {characterCount}/{maxCharacters}
                </div>
              )}
            </div>
          </div>

          {/* Validation Error */}
          {!isValid && inputText.trim() && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm mt-2 animate-fade-in">
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Optimization Banner */}
      {optimizationShown && savedChars > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl animate-fade-in">
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
        data-generate-button
        onClick={handleGenerate}
        disabled={isGenerating || !inputText.trim()}
        className={`w-full font-bold h-14 text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
          isGenerating 
            ? 'bg-gradient-to-r from-blue-400 to-indigo-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95'
        } ${
          !inputText.trim() 
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
            : ''
        }`}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Creating Your QR Code...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <QrCode className="w-6 h-6" />
            <span>Generate QR Code</span>
          </div>
        )}
      </Button>
    </div>
  );
}
