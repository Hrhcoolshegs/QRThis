import React from 'react';
import { Globe, MessageSquare, Wifi, User, Phone, Mail } from 'lucide-react';

interface TypeOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const typeOptions: TypeOption[] = [
  {
    id: 'url',
    label: 'Website',
    icon: Globe,
    description: 'Link to any website',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'text',
    label: 'Text',
    icon: MessageSquare,
    description: 'Plain text message',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'wifi',
    label: 'WiFi',
    icon: Wifi,
    description: 'Network credentials',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: User,
    description: 'vCard information',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: Phone,
    description: 'Call a number',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    description: 'Send a message',
    color: 'from-pink-500 to-pink-600'
  }
];

interface TypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function TypeSelector({ selectedType, onTypeChange }: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
      {typeOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedType === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => onTypeChange(option.id)}
            className={`group relative p-2.5 sm:p-3 md:p-4 rounded-xl border-2 transition-all duration-smooth hover:scale-[1.02] ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-glow'
                : 'border-border hover:border-primary/50 bg-card'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-smooth`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold text-xs sm:text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {option.label}
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {option.description}
                </p>
              </div>
            </div>
            {isSelected && (
              <div className="absolute -top-1.5 -right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
