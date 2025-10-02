import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LivePreviewProps {
  qrCodeDataURL: string | null;
  isGenerating: boolean;
  inputText: string;
}

export function LivePreview({ qrCodeDataURL, isGenerating, inputText }: LivePreviewProps) {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setShowPreview(!!inputText.trim());
  }, [inputText]);

  if (!showPreview) return null;

  return (
    <div className="fixed right-8 top-24 z-30 hidden xl:block">
      <div className="w-64 bg-card border-2 border-border rounded-2xl shadow-xl p-4 animate-slide-in-right">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Live Preview</h3>
        </div>
        
        <div className="bg-background rounded-xl p-4 flex items-center justify-center min-h-[200px] border border-border">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-xs text-muted-foreground">Generating...</p>
            </div>
          ) : qrCodeDataURL ? (
            <img
              src={qrCodeDataURL}
              alt="QR Preview"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Click Generate to see your QR code
              </p>
            </div>
          )}
        </div>
        
        {inputText && (
          <div className="mt-3 p-2 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground truncate">
              {inputText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
