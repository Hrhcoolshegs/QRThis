import React, { useState } from 'react';
import { validateQRColors } from '@/utils/brandColors';
import { Palette, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColorCustomizerProps {
  foregroundColor: string;
  backgroundColor: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
}

const COLOR_PRESETS = [
  { name: 'Classic', foreground: '#000000', background: '#FFFFFF' },
  { name: 'Ocean', foreground: '#1E3A5F', background: '#E8F4FC' },
  { name: 'Forest', foreground: '#1D4332', background: '#E8F5E9' },
  { name: 'Sunset', foreground: '#B33F00', background: '#FFF3E0' },
  { name: 'Royal', foreground: '#4A1C7D', background: '#F3E5F5' },
  { name: 'Midnight', foreground: '#FFFFFF', background: '#1A1A2E' },
];

export function ColorCustomizer({
  foregroundColor,
  backgroundColor,
  onForegroundChange,
  onBackgroundChange,
}: ColorCustomizerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const validation = validateQRColors(foregroundColor, backgroundColor);

  const handlePresetSelect = (preset: typeof COLOR_PRESETS[0]) => {
    onForegroundChange(preset.foreground);
    onBackgroundChange(preset.background);
  };

  const handleReset = () => {
    onForegroundChange('#000000');
    onBackgroundChange('#FFFFFF');
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Palette className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-foreground">Customize Colors</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
            style={{ backgroundColor: foregroundColor }}
          />
          <div 
            className="w-5 h-5 rounded-full border-2 border-border shadow-sm"
            style={{ backgroundColor: backgroundColor }}
          />
          <svg 
            className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 rounded-xl border border-border bg-card space-y-5 animate-fade-in">
          {/* Contrast Validation */}
          <div className={`p-3 rounded-lg flex items-center gap-3 ${
            validation.isValid 
              ? 'bg-success/10 border border-success/20' 
              : 'bg-warning/10 border border-warning/20'
          }`}>
            {validation.isValid ? (
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
            )}
            <div className="text-sm">
              <span className={validation.isValid ? 'text-success' : 'text-warning'}>
                Contrast: {validation.contrast.toFixed(1)}:1
              </span>
              {!validation.isValid && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {validation.recommendation}
                </p>
              )}
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Color Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    foregroundColor === preset.foreground && backgroundColor === preset.background
                      ? 'border-primary shadow-md'
                      : 'border-transparent hover:border-border'
                  }`}
                  style={{ backgroundColor: preset.background }}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: preset.foreground }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-border shadow-sm"
                      style={{ backgroundColor: preset.background }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: preset.foreground }}>
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Foreground
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => onForegroundChange(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={foregroundColor.toUpperCase()}
                  onChange={(e) => onForegroundChange(e.target.value)}
                  className="flex-1 h-10 px-3 text-sm font-mono border border-input rounded-lg bg-background"
                  maxLength={7}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => onBackgroundChange(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor.toUpperCase()}
                  onChange={(e) => onBackgroundChange(e.target.value)}
                  className="flex-1 h-10 px-3 text-sm font-mono border border-input rounded-lg bg-background"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      )}
    </div>
  );
}
