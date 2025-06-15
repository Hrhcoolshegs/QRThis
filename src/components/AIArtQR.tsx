
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Palette, Crown, Loader2, ArrowRight, Eye, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIArtQRProps {
  inputText: string;
  onGenerate: (artStyle: string, customPrompt?: string) => void;
  isGenerating: boolean;
}

export function AIArtQR({ inputText, onGenerate, isGenerating }: AIArtQRProps) {
  const [selectedStyle, setSelectedStyle] = useState('watercolor');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isPremium] = useState(false); // This would come from auth context
  const [previewMode, setPreviewMode] = useState(false);

  const artStyles = [
    {
      id: 'watercolor',
      name: 'Watercolor',
      preview: '🎨',
      description: 'Soft, artistic watercolor effects',
      gradient: 'from-blue-400 to-purple-500',
      example: 'Perfect for wedding invitations, art galleries'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      preview: '⚪',
      description: 'Clean, modern geometric designs',
      gradient: 'from-gray-400 to-gray-600',
      example: 'Ideal for tech companies, modern brands'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      preview: '🌃',
      description: 'Futuristic neon aesthetics',
      gradient: 'from-cyan-400 to-pink-500',
      example: 'Great for gaming, tech events, startups'
    },
    {
      id: 'vintage',
      name: 'Vintage',
      preview: '📜',
      description: 'Classic retro styles',
      gradient: 'from-amber-400 to-orange-600',
      example: 'Perfect for cafes, antique shops, events'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      preview: '🏢',
      description: 'Professional business-ready',
      gradient: 'from-blue-600 to-indigo-700',
      example: 'Business cards, presentations, reports'
    },
    {
      id: 'nature',
      name: 'Nature',
      preview: '🌿',
      description: 'Organic patterns and elements',
      gradient: 'from-green-400 to-emerald-600',
      example: 'Eco brands, outdoor events, wellness'
    }
  ];

  const getContextualMessage = () => {
    if (!inputText.trim()) {
      return {
        type: 'info',
        title: 'Ready to create art?',
        message: 'First, add some content to your QR code above (like a URL or text), then come back here to transform it into artwork!',
        icon: <Sparkles className="w-5 h-5" />
      };
    }

    if (inputText.length < 10) {
      return {
        type: 'tip',
        title: 'Perfect for art generation!',
        message: 'Short content like yours works best for AI art QR codes - more space for beautiful designs.',
        icon: <Heart className="w-5 h-5 text-red-500" />
      };
    }

    return {
      type: 'success',
      title: 'Content detected!',
      message: 'Your content is ready to be transformed into stunning artwork while staying perfectly scannable.',
      icon: <Zap className="w-5 h-5 text-green-500" />
    };
  };

  const contextualMsg = getContextualMessage();

  if (!isPremium) {
    return (
      <Card className="shadow-lg border border-purple-200 dark:border-purple-700/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Contextual Smart Message */}
            <div className={`p-4 rounded-xl border ${
              contextualMsg.type === 'info' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/50' :
              contextualMsg.type === 'tip' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/50' :
              'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700/50'
            }`}>
              <div className="flex items-start space-x-3">
                {contextualMsg.icon}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{contextualMsg.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{contextualMsg.message}</p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  AI Art QR Codes
                </h3>
                <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                  Transform your QR codes into stunning works of art while maintaining perfect scannability
                </p>
              </div>

              {/* Interactive Style Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview Styles Available</h4>
                  <Button
                    onClick={() => setPreviewMode(!previewMode)}
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {previewMode ? 'Hide' : 'Preview'}
                  </Button>
                </div>

                <div className={`grid transition-all duration-300 ${
                  previewMode ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-3'
                } max-w-sm mx-auto`}>
                  {artStyles.slice(0, previewMode ? 4 : 6).map((style) => (
                    <div 
                      key={style.id} 
                      className={`text-center p-3 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-purple-300 transition-all cursor-pointer ${
                        selectedStyle === style.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : ''
                      }`}
                      onClick={() => setSelectedStyle(style.id)}
                    >
                      <div className="text-2xl mb-1">{style.preview}</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{style.name}</div>
                      {previewMode && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{style.example}</div>
                      )}
                    </div>
                  ))}
                </div>

                {previewMode && (
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Selected: {artStyles.find(s => s.id === selectedStyle)?.name}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{artStyles.find(s => s.id === selectedStyle)?.description}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{artStyles.find(s => s.id === selectedStyle)?.example}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-purple-500" />
                    <span>Premium Feature</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-purple-500" />
                    <span>6+ Art Styles</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/pricing">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-semibold group">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/features">
                    <Button variant="outline" className="border-purple-300 text-purple-700 dark:text-purple-300 px-6 py-2 rounded-xl">
                      Learn More
                    </Button>
                  </Link>
                </div>

                {/* Smart Tip */}
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg">
                  💡 <strong>Pro Tip:</strong> AI Art QR codes work best with shorter content. Your {inputText ? 'current' : 'next'} QR code {inputText ? `(${inputText.length} chars)` : ''} would be perfect for artistic transformation!
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Premium user interface (functional but with contextual guidance)
  return (
    <Card className="shadow-lg border border-purple-200 dark:border-purple-700/50 bg-white dark:bg-gray-800/50">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Contextual Message for Premium Users */}
          <div className={`p-4 rounded-xl border ${
            contextualMsg.type === 'info' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/50' :
            contextualMsg.type === 'tip' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/50' :
            'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700/50'
          }`}>
            <div className="flex items-start space-x-3">
              {contextualMsg.icon}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{contextualMsg.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{contextualMsg.message}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Art QR Generator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transform your QR into stunning artwork
              </p>
            </div>
          </div>

          <Tabs value="styles" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="styles">Art Styles</TabsTrigger>
              <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
            </TabsList>
            
            <TabsContent value="styles" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {artStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      selectedStyle === style.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{style.preview}</div>
                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                      {style.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {style.description}
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Art Prompt
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe your desired art style... e.g., 'sunset mountains with watercolor effect'"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white"
                  rows={3}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Combine with selected style for unique results
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={() => onGenerate(selectedStyle, customPrompt)}
            disabled={!inputText.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12 text-lg rounded-xl transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Creating AI Art QR...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Generate AI Art QR
              </>
            )}
          </Button>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>✨ Premium Feature</span>
            <span>High-res export included</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
