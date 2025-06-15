
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Loader2 } from 'lucide-react';
import { extractBrandColors, generateQRColorSuggestions, validateQRColors } from '@/utils/brandColors';
import { detectContentType } from '@/utils/smartOptimization';

interface BrandColorSelectorProps {
  inputText: string;
}

export function BrandColorSelector({ inputText }: BrandColorSelectorProps) {
  const [brandColors, setBrandColors] = useState<any>(null);
  const [colorSuggestions, setColorSuggestions] = useState<any[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const isUrl = detectContentType(inputText) === 'url';

  useEffect(() => {
    setBrandColors(null);
    setColorSuggestions([]);
  }, [inputText]);

  const handleExtractColors = async () => {
    if (!isUrl) return;

    setIsExtracting(true);
    try {
      const colors = await extractBrandColors(inputText);
      if (colors) {
        setBrandColors(colors);
        const suggestions = generateQRColorSuggestions(colors);
        setColorSuggestions(suggestions.slice(0, 6)); // Show top 6 suggestions
      }
    } catch (error) {
      console.error('Color extraction failed:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  if (!isUrl) return null;

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            <h4 className="font-medium text-purple-800 dark:text-purple-200">
              Brand Color Intelligence
            </h4>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              🎨 Extract brand colors from your website for custom QR codes
            </p>
            
            {!brandColors ? (
              <Button
                onClick={handleExtractColors}
                disabled={isExtracting}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                size="sm"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Website...
                  </>
                ) : (
                  'Extract Brand Colors'
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-xs text-purple-600 dark:text-purple-300 mb-2">
                    Colors from: {brandColors.source}
                  </p>
                  <div className="flex justify-center gap-2 mb-3">
                    {brandColors.palette.slice(0, 5).map((color: string, index: number) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 font-mono">
                          {color}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {colorSuggestions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
                      🎯 Scannable Color Combinations:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {colorSuggestions.slice(0, 4).map((suggestion, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-2 rounded border">
                          <div className="flex items-center gap-2 mb-1">
                            <div 
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: suggestion.foreground }}
                            />
                            <span className="text-xs">on</span>
                            <div 
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: suggestion.background }}
                            />
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <div>Contrast: {suggestion.validation.contrast}</div>
                            <div className={
                              suggestion.validation.accessibility === 'AAA' ? 'text-green-600' :
                              suggestion.validation.accessibility === 'AA' ? 'text-yellow-600' : 'text-red-600'
                            }>
                              {suggestion.validation.accessibility}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-300 mt-2">
                      💡 All combinations tested for optimal scanning
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
