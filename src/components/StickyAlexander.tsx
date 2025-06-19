
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, MessageCircle } from 'lucide-react';
import { AIAssistant } from '@/components/AIAssistant';

export function StickyAlexander() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Overlay for mobile when chat is open */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sticky Alexander Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isExpanded ? (
          <Button
            onClick={handleToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
              shadow-lg hover:shadow-xl transition-all duration-300 rounded-full
              ${isHovered ? 'px-6 py-3' : 'w-14 h-14 p-0'}
            `}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span 
                className={`
                  text-white font-medium whitespace-nowrap transition-all duration-300
                  ${isHovered ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
                `}
              >
                Ask Alexander
              </span>
            </div>
          </Button>
        ) : (
          <Card className="w-80 lg:w-96 shadow-2xl border-2 border-indigo-200 dark:border-indigo-700">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Alexander AI</h3>
                    <p className="text-white/80 text-sm">Your QR Code Assistant</p>
                  </div>
                </div>
                <Button
                  onClick={handleToggle}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="h-96 overflow-hidden">
                <AIAssistant 
                  onContentGenerated={() => {}} 
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
