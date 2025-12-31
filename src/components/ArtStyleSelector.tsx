import React from 'react';
import { cn } from '@/lib/utils';
import { Palette, Minimize2, Zap, Clock, Building2, Leaf } from 'lucide-react';

export interface ArtStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const artStyles: ArtStyle[] = [
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft, flowing artistic strokes',
    icon: <Palette className="w-5 h-5" />,
    gradient: 'from-pink-400 via-purple-400 to-blue-400',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean geometric patterns',
    icon: <Minimize2 className="w-5 h-5" />,
    gradient: 'from-gray-300 via-gray-400 to-gray-500',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon lights and circuits',
    icon: <Zap className="w-5 h-5" />,
    gradient: 'from-cyan-400 via-purple-500 to-pink-500',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic retro aesthetics',
    icon: <Clock className="w-5 h-5" />,
    gradient: 'from-amber-300 via-orange-400 to-red-400',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional and sleek',
    icon: <Building2 className="w-5 h-5" />,
    gradient: 'from-blue-400 via-indigo-500 to-purple-500',
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Organic botanical vibes',
    icon: <Leaf className="w-5 h-5" />,
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
  },
];

interface ArtStyleSelectorProps {
  selectedStyle: string | null;
  onSelectStyle: (styleId: string) => void;
  disabled?: boolean;
}

export function ArtStyleSelector({ selectedStyle, onSelectStyle, disabled }: ArtStyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {artStyles.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelectStyle(style.id)}
          disabled={disabled}
          className={cn(
            "group relative p-4 rounded-xl border-2 transition-all duration-300",
            "hover:scale-[1.02] hover:shadow-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            selectedStyle === style.id
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border bg-card hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed hover:scale-100"
          )}
        >
          {/* Gradient background on hover/select */}
          <div
            className={cn(
              "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
              `bg-gradient-to-br ${style.gradient}`,
              selectedStyle === style.id ? "opacity-10" : "group-hover:opacity-5"
            )}
          />
          
          <div className="relative z-10 flex flex-col items-center text-center gap-2">
            {/* Icon with gradient */}
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                "bg-gradient-to-br text-white shadow-sm",
                style.gradient
              )}
            >
              {style.icon}
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground text-sm">{style.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{style.description}</p>
            </div>
          </div>

          {/* Selected indicator */}
          {selectedStyle === style.id && (
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}

export { artStyles };
