import React, { useState } from 'react';
import { Download, FileImage, FileCode, Image, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadOptionsProps {
  qrCodeDataURL: string;
  onDownload: (format: 'png' | 'jpg' | 'svg', size: number) => void;
}

const SIZE_PRESETS = [
  { name: 'Small', size: 256, description: 'Social media, email' },
  { name: 'Medium', size: 512, description: 'Web, presentations' },
  { name: 'Large', size: 1024, description: 'Print, posters' },
  { name: 'XL', size: 2048, description: 'High-res print' },
];

const FORMAT_OPTIONS = [
  { value: 'png' as const, label: 'PNG', icon: FileImage, description: 'Best for web & transparency' },
  { value: 'jpg' as const, label: 'JPG', icon: Image, description: 'Smaller file size' },
  { value: 'svg' as const, label: 'SVG', icon: FileCode, description: 'Scalable vector' },
];

export function DownloadOptions({ qrCodeDataURL, onDownload }: DownloadOptionsProps) {
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'jpg' | 'svg'>('png');
  const [selectedSize, setSelectedSize] = useState(512);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQuickDownload = () => {
    onDownload(selectedFormat, selectedSize);
  };

  return (
    <div className="space-y-3">
      {/* Quick Download Button */}
      <Button
        onClick={handleQuickDownload}
        size="lg"
        className="w-full bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      >
        <Download className="w-5 h-5 mr-2" />
        Download {selectedFormat.toUpperCase()} ({SIZE_PRESETS.find(s => s.size === selectedSize)?.name})
      </Button>

      {/* Expand Options */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>More options</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="p-4 rounded-xl border border-border bg-card/50 space-y-5 animate-fade-in">
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FORMAT_OPTIONS.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedFormat === format.value
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${
                      selectedFormat === format.value ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className={`text-sm font-semibold ${
                      selectedFormat === format.value ? 'text-primary' : 'text-foreground'
                    }`}>
                      {format.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {format.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Size
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.size}
                  onClick={() => setSelectedSize(preset.size)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedSize === preset.size
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${
                      selectedSize === preset.size ? 'text-primary' : 'text-foreground'
                    }`}>
                      {preset.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {preset.size}×{preset.size}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Download All Formats */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Quick download in all formats
            </p>
            <div className="flex gap-2">
              {FORMAT_OPTIONS.map((format) => (
                <Button
                  key={format.value}
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(format.value, selectedSize)}
                  className="flex-1"
                >
                  {format.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
