import React from 'react';
import { Globe, MessageSquare, Wifi, User, Phone, Mail, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypeOption {
  id: string;
  label: string;
  icon: React.ElementType;
}

const typeOptions: TypeOption[] = [
  { id: 'url', label: 'URL', icon: Globe },
  { id: 'text', label: 'Text', icon: MessageSquare },
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'contact', label: 'Contact', icon: User },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'email', label: 'Email', icon: Mail }
];

interface TypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function TypeSelector({ selectedType, onTypeChange }: TypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {typeOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedType === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => onTypeChange(option.id)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
              "border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-muted-foreground/30"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{option.label}</span>
            {isSelected && (
              <Check className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
