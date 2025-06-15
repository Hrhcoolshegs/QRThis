
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, X } from 'lucide-react';
import { detectContentType, optimizeText } from '@/utils/smartOptimization';
import QRCode from 'qrcode';

interface BatchItem {
  content: string;
  type: string;
  optimized: { optimized: string; saved: number };
  filename: string;
  qrDataURL?: string;
}

function parseBatchContent(input: string): BatchItem[] {
  const items: BatchItem[] = [];
  
  // Split by common delimiters
  const lines = input.split(/[\n,;]/).map(line => line.trim()).filter(Boolean);
  
  // Smart detection of different content types
  lines.forEach((line, index) => {
    const contentType = detectContentType(line);
    const optimized = optimizeText(line);
    items.push({
      content: line,
      type: contentType,
      optimized,
      filename: generateFilename(line, contentType, index)
    });
  });
  
  return items;
}

function generateFilename(content: string, type: string, index: number): string {
  const timestamp = Date.now();
  const cleanContent = content.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  return `qrthis-${type}-${cleanContent || index}-${timestamp}.png`;
}

interface BatchPreviewProps {
  items: BatchItem[];
  onGenerate: (items: BatchItem[]) => void;
  onRemoveItem: (index: number) => void;
  onClearAll: () => void;
}

function BatchPreview({ items, onGenerate, onRemoveItem, onClearAll }: BatchPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Preview ({items.length} items)</h4>
        <div className="flex gap-2">
          <Button 
            onClick={onClearAll}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-1" />
            Clear All
          </Button>
          <Button 
            onClick={() => onGenerate(items)}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            Generate All QR Codes
          </Button>
        </div>
      </div>
      
      <div className="max-h-60 overflow-y-auto space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                  {item.type}
                </span>
                {item.optimized.saved > 0 && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                    -{item.optimized.saved} chars
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                {item.optimized.optimized || item.content}
              </p>
            </div>
            <Button
              onClick={() => onRemoveItem(index)}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BatchProcessorProps {
  onBatchGenerate: (items: BatchItem[]) => void;
}

export function BatchProcessor({ onBatchGenerate }: BatchProcessorProps) {
  const [batchInput, setBatchInput] = useState('');
  const [parsedItems, setParsedItems] = useState<BatchItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleParse = () => {
    const items = parseBatchContent(batchInput);
    setParsedItems(items);
  };

  const handleRemoveItem = (index: number) => {
    setParsedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setParsedItems([]);
    setBatchInput('');
  };

  const handleGenerateAll = async (items: BatchItem[]) => {
    setIsGenerating(true);
    try {
      const itemsWithQR = await Promise.all(
        items.map(async (item) => {
          const qrDataURL = await QRCode.toDataURL(item.optimized.optimized || item.content, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            width: 512
          });
          return { ...item, qrDataURL };
        })
      );
      
      onBatchGenerate(itemsWithQR);
    } catch (error) {
      console.error('Batch generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const detectedCount = batchInput.split(/[\n,;]/).filter(Boolean).length;

  return (
    <Card className="mt-6 border-t-4 border-t-green-500">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <h3 className="font-semibold text-lg">Smart Batch Processing</h3>
            </div>
            {batchInput && (
              <Button
                onClick={() => setBatchInput('')}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </Button>
            )}
          </div>
          
          <textarea
            placeholder="Paste multiple URLs, emails, or text items (one per line, separated by commas, or semicolons)...&#10;&#10;Example:&#10;https://example.com&#10;contact@company.com&#10;+1-555-123-4567"
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            className="w-full h-32 p-3 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {detectedCount} items detected
            </span>
            <Button 
              onClick={handleParse} 
              disabled={!batchInput.trim() || detectedCount === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Parse Items ({detectedCount})
            </Button>
          </div>
          
          {parsedItems.length > 0 && (
            <BatchPreview 
              items={parsedItems} 
              onGenerate={handleGenerateAll}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearAll}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
