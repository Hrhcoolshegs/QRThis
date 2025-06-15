
import React from 'react';
import { Sparkles, Shield, Info } from 'lucide-react';
import { getContentLabel, getContentTips, getErrorCorrectionExplanation } from '@/utils/smartOptimization';

interface OptimizationBadgeProps {
  savedChars: number;
  onUndo: () => void;
}

export function OptimizationBadge({ savedChars, onUndo }: OptimizationBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 mb-2 animate-fade-in">
      <Sparkles size={16} />
      <span>✨ Optimized • Saved {savedChars} characters</span>
      <button 
        className="text-blue-600 dark:text-blue-400 underline hover:no-underline text-xs"
        onClick={onUndo}
      >
        Undo
      </button>
    </div>
  );
}

interface ContentTypeIndicatorProps {
  contentType: string;
}

export function ContentTypeIndicator({ contentType }: ContentTypeIndicatorProps) {
  if (contentType === 'text') return null;
  
  const tips = getContentTips(contentType);
  
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
        <span>🎯</span>
        <span>{getContentLabel(contentType)}</span>
      </div>
      {tips && (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          💡 {tips}
        </span>
      )}
    </div>
  );
}

interface ErrorCorrectionIndicatorProps {
  errorLevel: string;
}

export function ErrorCorrectionIndicator({ errorLevel }: ErrorCorrectionIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
      <Shield size={14} />
      <span>Error Correction: {errorLevel}</span>
      <div className="relative group">
        <Info size={12} className="cursor-help" />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
          {getErrorCorrectionExplanation(errorLevel)}
        </div>
      </div>
    </div>
  );
}

interface PersonalizedTipsProps {
  suggestions: string[];
}

export function PersonalizedTips({ suggestions }: PersonalizedTipsProps) {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-1">
        <Sparkles size={16} />
        Personalized Tips
      </h4>
      <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
        {suggestions.map((tip, index) => (
          <li key={index}>• {tip}</li>
        ))}
      </ul>
    </div>
  );
}
