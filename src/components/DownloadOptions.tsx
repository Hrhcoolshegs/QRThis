import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Image, FileCode, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type DownloadFormat = 'png' | 'svg' | 'jpg';
export type DownloadSize = 256 | 512 | 1024 | 2048;

interface SizePreset {
  size: DownloadSize;
  label: string;
  useCase: string;
}

const sizePresets: SizePreset[] = [
  { size: 256, label: 'Small (256px)', useCase: 'Social media, web' },
  { size: 512, label: 'Medium (512px)', useCase: 'General purpose' },
  { size: 1024, label: 'Large (1024px)', useCase: 'Print, posters' },
  { size: 2048, label: 'XL (2048px)', useCase: 'High-res print' },
];

interface DownloadOptionsProps {
  qrCodeDataURL: string;
  inputText: string;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  onDownload: (format: DownloadFormat, size: DownloadSize) => void;
}

export function DownloadOptions({
  qrCodeDataURL,
  inputText,
  foregroundColor,
  backgroundColor,
  errorCorrectionLevel,
  onDownload,
}: DownloadOptionsProps) {
  const [selectedSize, setSelectedSize] = useState<DownloadSize>(512);

  const formatIcons: Record<DownloadFormat, React.ReactNode> = {
    png: <Image className="w-4 h-4" />,
    jpg: <Image className="w-4 h-4" />,
    svg: <FileCode className="w-4 h-4" />,
  };

  const formatLabels: Record<DownloadFormat, { name: string; desc: string }> = {
    png: { name: 'PNG', desc: 'Best for web & social' },
    svg: { name: 'SVG', desc: 'Scalable vector format' },
    jpg: { name: 'JPG', desc: 'Compressed image' },
  };

  const selectedPreset = sizePresets.find(p => p.size === selectedSize);

  return (
    <div className="space-y-4">
      {/* Size Selector */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Download Size</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between h-10">
              <span className="flex items-center gap-2">
                <span className="font-medium">{selectedPreset?.label}</span>
                <span className="text-xs text-muted-foreground">• {selectedPreset?.useCase}</span>
              </span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>Choose Size</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sizePresets.map((preset) => (
              <DropdownMenuItem
                key={preset.size}
                onClick={() => setSelectedSize(preset.size)}
                className="flex flex-col items-start py-2"
              >
                <span className="font-medium">{preset.label}</span>
                <span className="text-xs text-muted-foreground">{preset.useCase}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {(['png', 'svg', 'jpg'] as DownloadFormat[]).map((format) => (
          <Button
            key={format}
            variant={format === 'png' ? 'default' : 'outline'}
            onClick={() => onDownload(format, selectedSize)}
            className="flex flex-col items-center gap-1 h-auto py-3"
            disabled={!qrCodeDataURL}
          >
            {formatIcons[format]}
            <span className="text-xs font-semibold uppercase">{format}</span>
          </Button>
        ))}
      </div>

      {/* Quick Download */}
      <Button
        onClick={() => onDownload('png', selectedSize)}
        size="lg"
        className="w-full bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={!qrCodeDataURL}
      >
        <Download className="w-5 h-5 mr-2" />
        Download {selectedPreset?.label}
      </Button>
    </div>
  );
}
