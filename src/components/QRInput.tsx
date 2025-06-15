
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Loader2, Shield, Smartphone } from 'lucide-react';
import { OptimizationBadge, ContentTypeIndicator, ErrorCorrectionIndicator } from '@/components/SmartFeatures';

interface QRInputProps {
  inputText: string;
  onInputChange: (value: string) => void;
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

function getCharacterLimitStatus(count: number) {
  if (count <= 500) return { color: 'text-green-600', warning: false, message: '' };
  if (count <= 700) return { 
    color: 'text-yellow-600', 
    warning: true, 
    message: 'Large QR codes may be harder to scan' 
  };
  if (count <= 800) return { 
    color: 'text-orange-600', 
    warning: true, 
    message: 'Very large - may not scan reliably' 
  };
  return { 
    color: 'text-red-600', 
    warning: true, 
    message: 'Too large - scanning not guaranteed' 
  };
}

function EnhancedCharacterCounter({ count, maxCount }: { count: number; maxCount: number }) {
  const status = getCharacterLimitStatus(count);
  
  return (
    <div className="flex items-center justify-between text-sm">
      <div className={`transition-colors ${status.color}`}>
        {count}/{maxCount} characters
      </div>
      {status.warning && (
        <div className={`text-xs ${status.color} flex items-center gap-1`}>
          <span>⚠️</span>
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
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
  contentType,
  errorCorrectionLevel
}: QRInputProps) {
  return (
    <Card className="shadow-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
      <CardContent className="p-8">
        <div className="space-y-6">
          {optimizationShown && savedChars > 0 && (
            <OptimizationBadge 
              savedChars={savedChars} 
              onUndo={onUndoOptimization}
            />
          )}

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Enter text, URL, WiFi password, contact info, or let AI help you..."
              className="w-full min-h-[200px] p-6 border-2 border-gray-200 dark:border-gray-600/20 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 text-lg leading-relaxed bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
            <div className="absolute bottom-4 right-4 bg-gray-100 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1">
              <EnhancedCharacterCounter count={characterCount} maxCount={maxCharacters} />
            </div>
          </div>

          <ContentTypeIndicator contentType={contentType} />
          <ErrorCorrectionIndicator errorLevel={errorCorrectionLevel} />

          <Button
            onClick={onGenerate}
            disabled={!inputText.trim() || isOverLimit || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-14 text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:hover:scale-100"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                AI Generating Magic...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-3" />
                Generate QR Code
              </>
            )}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Private & Secure</span>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50">
              <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Mobile Ready</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
