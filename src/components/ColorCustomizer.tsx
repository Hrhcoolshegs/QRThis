import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette, RotateCcw } from 'lucide-react';

interface ColorCustomizerProps {
  foregroundColor: string;
  backgroundColor: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
  onReset: () => void;
}

const presetColors = [
  { name: 'Classic', fg: '#000000', bg: '#FFFFFF' },
  { name: 'Ocean', fg: '#1e3a5f', bg: '#e8f4fc' },
  { name: 'Forest', fg: '#1a3c34', bg: '#e8f5e9' },
  { name: 'Berry', fg: '#4a1942', bg: '#fce4ec' },
  { name: 'Night', fg: '#ffffff', bg: '#1a1a2e' },
];

export function ColorCustomizer({
  foregroundColor,
  backgroundColor,
  onForegroundChange,
  onBackgroundChange,
  onReset,
}: ColorCustomizerProps) {
  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm text-foreground">Color Customization</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Color Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Foreground</Label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => onForegroundChange(e.target.value)}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                style={{ padding: 0 }}
              />
            </div>
            <Input
              value={foregroundColor}
              onChange={(e) => onForegroundChange(e.target.value)}
              className="h-10 text-xs font-mono uppercase"
              maxLength={7}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Background</Label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundChange(e.target.value)}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                style={{ padding: 0 }}
              />
            </div>
            <Input
              value={backgroundColor}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="h-10 text-xs font-mono uppercase"
              maxLength={7}
            />
          </div>
        </div>
      </div>

      {/* Preset Colors */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Quick Presets</Label>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                onForegroundChange(preset.fg);
                onBackgroundChange(preset.bg);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:border-primary/50 transition-colors text-xs"
              title={preset.name}
            >
              <div 
                className="w-4 h-4 rounded border border-border/50"
                style={{ 
                  background: `linear-gradient(135deg, ${preset.fg} 50%, ${preset.bg} 50%)`
                }}
              />
              <span className="text-muted-foreground">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center p-3 rounded-lg border border-border">
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center"
          style={{ backgroundColor }}
        >
          <div 
            className="w-10 h-10 rounded"
            style={{ 
              backgroundColor: foregroundColor,
              boxShadow: `0 0 0 2px ${backgroundColor}`
            }}
          />
        </div>
      </div>
    </div>
  );
}
