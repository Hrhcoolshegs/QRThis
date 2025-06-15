
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { detectQRContext, getContextLabel, getContextIcon } from '@/utils/contextAware';

interface ContextOptimizerProps {
  inputText: string;
  contentType: string;
}

export function ContextOptimizer({ inputText, contentType }: ContextOptimizerProps) {
  const [detectedContext, setDetectedContext] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (inputText.trim()) {
      const context = detectQRContext(inputText);
      setDetectedContext(context);
      setIsVisible(true);
    } else {
      setDetectedContext(null);
    }
  }, [inputText]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!detectedContext || !isVisible) return null;

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getContextIcon(detectedContext.type)}</span>
              <h4 className="font-medium text-indigo-800 dark:text-indigo-200">
                Context-Aware Optimization
              </h4>
            </div>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-indigo-800 dark:text-indigo-200">
                  Optimized for: {getContextLabel(detectedContext.type)}
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-300">
                  Confidence: {Math.round(detectedContext.confidence * 100)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-indigo-600 dark:text-indigo-300">Error Correction</p>
                <p className="font-semibold text-indigo-800 dark:text-indigo-200">
                  {detectedContext.optimizations.errorCorrection}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                💡 Optimization Tips:
              </p>
              <ul className="space-y-1">
                {detectedContext.optimizations.tips.map((tip: string, index: number) => (
                  <li key={index} className="text-sm text-indigo-700 dark:text-indigo-300 flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
