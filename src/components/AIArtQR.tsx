
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIArtQRProps {
  inputText: string;
  onGenerate: (artStyle: string, customPrompt?: string) => void;
  isGenerating: boolean;
}

export function AIArtQR({ inputText, onGenerate, isGenerating }: AIArtQRProps) {
  const [selectedStyle, setSelectedStyle] = useState('watercolor');
  const [isPremium] = useState(false);

  const artStyles = [
    { id: 'watercolor', name: 'Watercolor', preview: '🎨' },
    { id: 'minimalist', name: 'Minimalist', preview: '⚪' },
    { id: 'cyberpunk', name: 'Cyberpunk', preview: '🌃' },
    { id: 'vintage', name: 'Vintage', preview: '📜' }
  ];

  if (!isPremium) {
    return (
      <Card className="shadow-lg border border-purple-200 dark:border-purple-700/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardContent className="p-4 md:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  AI Art QR Codes
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base max-w-md mx-auto">
                  Transform your QR codes into stunning works of art
                </p>
              </div>

              {/* Simple Style Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-sm mx-auto">
                {artStyles.map((style) => (
                  <div 
                    key={style.id} 
                    className="text-center p-3 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50"
                  >
                    <div className="text-2xl mb-1">{style.preview}</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{style.name}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-purple-500" />
                    <span>Premium Feature</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/pricing">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-semibold group w-full sm:w-auto">
                      <Crown className="w-4 h-4 mr-2" />
                      Coming Soon
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border border-purple-200 dark:border-purple-700/50 bg-white dark:bg-gray-800/50">
      <CardContent className="p-4 md:p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {artStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-4 rounded-xl border transition-all text-center ${
                  selectedStyle === style.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-2">{style.preview}</div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {style.name}
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={() => onGenerate(selectedStyle)}
            disabled={!inputText.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12 text-lg rounded-xl transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Generate AI Art QR
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
