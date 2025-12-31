import React from 'react';
import { Button } from '@/components/ui/button';
import { ArtStyleSelector } from '@/components/ArtStyleSelector';
import { Loader2, Sparkles, Wand2, Download, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIArtGeneratorProps {
  inputText: string;
  selectedStyle: string | null;
  onSelectStyle: (styleId: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generatedImageUrl: string | null;
  error: string | null;
  onDownload: () => void;
  onReset: () => void;
}

export function AIArtGenerator({
  inputText,
  selectedStyle,
  onSelectStyle,
  onGenerate,
  isGenerating,
  generatedImageUrl,
  error,
  onDownload,
  onReset,
}: AIArtGeneratorProps) {
  const canGenerate = inputText.trim().length > 0 && selectedStyle && !isGenerating;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Art</span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Transform Your QR into Art
        </h3>
        <p className="text-sm text-muted-foreground">
          Select a style and let AI create a unique artistic QR code
        </p>
      </div>

      {/* Style Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Choose Art Style</label>
        <ArtStyleSelector
          selectedStyle={selectedStyle}
          onSelectStyle={onSelectStyle}
          disabled={isGenerating}
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        disabled={!canGenerate}
        className={cn(
          "w-full h-12 text-base font-semibold transition-all duration-300",
          "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500",
          "hover:from-purple-700 hover:via-pink-700 hover:to-orange-600",
          "shadow-lg hover:shadow-xl hover:shadow-primary/25",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating Your Masterpiece...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5 mr-2" />
            Generate AI Art QR
          </>
        )}
      </Button>

      {/* Input warning */}
      {!inputText.trim() && (
        <p className="text-sm text-muted-foreground text-center">
          Enter content in the input field above to generate your AI art QR code
        </p>
      )}

      {/* Error display */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Result Display */}
      {generatedImageUrl && !isGenerating && (
        <div className="space-y-4 animate-fade-in">
          <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl bg-card">
            <img
              src={generatedImageUrl}
              alt="AI Generated Art QR Code"
              className="w-full h-full object-contain"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onDownload}
              className="flex-1 bg-primary hover:bg-primary-hover"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Another Style
            </Button>
          </div>
        </div>
      )}

      {/* Loading state with progress */}
      {isGenerating && (
        <div className="space-y-4 animate-fade-in">
          <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted/50">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">AI is painting...</p>
                <p className="text-sm text-muted-foreground">This may take 10-20 seconds</p>
              </div>
            </div>
            
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
