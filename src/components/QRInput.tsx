
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { QrCode, AlertCircle, CheckCircle, Undo2, Loader2, Globe, Mail, MessageSquare, Smartphone, Wifi, User } from 'lucide-react';
import { optimizeText, detectContentType } from '@/utils/smartOptimization';
import { validateQRContent } from '@/utils/securityUtils';

interface QRInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isOverLimit: boolean;
  characterCount: number;
  maxCharacters: number;
  optimizationShown: boolean;
  savedChars: number;
  onUndoOptimization: () => void;
  contentType: string;
  errorCorrectionLevel: string;
}

const contentTypes = [
  { id: 'url', label: 'URL', icon: Globe, placeholder: 'https://example.com' },
  { id: 'text', label: 'Text', icon: MessageSquare, placeholder: 'Your message here...' },
  { id: 'wifi', label: 'WiFi', icon: Wifi, placeholder: 'Network name and password' },
  { id: 'contact', label: 'Contact', icon: User, placeholder: 'Contact information' },
  { id: 'phone', label: 'Phone', icon: Smartphone, placeholder: '+1 (555) 123-4567' },
  { id: 'email', label: 'Email', icon: Mail, placeholder: 'hello@example.com' }
];

export function QRInput({
  inputText,
  onInputChange,
  onGenerate,
  isGenerating,
  isOverLimit,
  characterCount,
  maxCharacters,
  optimizationShown,
  savedChars,
  onUndoOptimization,
  contentType
}: QRInputProps) {
  const { toast } = useToast();
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('url');

  // Validate input in real-time
  useEffect(() => {
    if (!inputText.trim()) {
      setIsValid(true);
      setValidationError('');
      return;
    }

    if (isOverLimit) {
      setIsValid(false);
      setValidationError(`Content is too long (${characterCount}/${maxCharacters} characters)`);
      return;
    }

    // Validate content based on type
    const validation = validateQRContent(inputText, detectContentType(inputText));
    if (!validation.isValid) {
      setIsValid(false);
      setValidationError(validation.error || 'Invalid content');
      return;
    }

    setIsValid(true);
    setValidationError('');
  }, [inputText, isOverLimit, characterCount, maxCharacters]);

  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some content to generate a QR code",
        variant: "destructive"
      });
      return;
    }

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    // Add visual feedback and animation
    const button = document.querySelector('[data-generate-button]') as HTMLElement;
    if (button) {
      button.style.transform = 'scale(0.98)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }

    onGenerate();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const selectedType = contentTypes.find(type => type.id === value);
    if (selectedType) {
      onInputChange(selectedType.placeholder);
      setIsFocused(true);
    }
  };

  const renderInputField = (type: any) => {
    if (type.id === 'wifi') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Network Name (SSID)
            </label>
            <Input
              placeholder="My WiFi Network"
              className="w-full"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter WiFi password"
              className="w-full"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </div>
      );
    }

    if (type.id === 'contact') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <Input placeholder="John" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <Input placeholder="Doe" className="w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone
            </label>
            <Input placeholder="+1 (555) 123-4567" className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <Input placeholder="john@example.com" className="w-full" />
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className={`relative rounded-2xl transition-all duration-300 ${
          isFocused || inputText.trim() 
            ? 'ring-2 ring-blue-500/20 shadow-lg scale-[1.02]' 
            : 'shadow-md hover:shadow-lg'
        }`}>
          {type.id === 'text' ? (
            <textarea
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={type.placeholder}
              className={`w-full h-32 p-6 border-2 rounded-2xl resize-none focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900/50 text-lg ${
                !isValid && inputText.trim()
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
              }`}
            />
          ) : (
            <Input
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={type.placeholder}
              className={`w-full h-16 p-6 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900/50 text-lg ${
                !isValid && inputText.trim()
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
              }`}
            />
          )}
          
          {/* Character Counter */}
          {inputText.trim() && (
            <div className="absolute bottom-4 right-4 flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                characterCount > maxCharacters 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {characterCount}/{maxCharacters}
              </div>
            </div>
          )}
        </div>

        {/* Validation Error */}
        {!isValid && inputText.trim() && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm mt-2 animate-fade-in">
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab-based Interface */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
          {contentTypes.map((type) => (
            <TabsTrigger
              key={type.id}
              value={type.id}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
            >
              <type.icon size={16} />
              <span className="hidden sm:inline">{type.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {contentTypes.map((type) => (
          <TabsContent key={type.id} value={type.id} className="mt-6">
            {renderInputField(type)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Optimization Banner */}
      {optimizationShown && savedChars > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">
                  Content Optimized!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Saved {savedChars} characters by removing extra spaces and optimizing formatting.
                </p>
              </div>
            </div>
            <Button
              onClick={onUndoOptimization}
              variant="ghost"
              size="sm"
              className="text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200"
            >
              <Undo2 size={14} className="mr-1" />
              Undo
            </Button>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        data-generate-button
        onClick={handleGenerate}
        disabled={isGenerating || !inputText.trim()}
        className={`w-full font-bold h-14 text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
          isGenerating 
            ? 'bg-gradient-to-r from-blue-400 to-indigo-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95'
        } ${
          !inputText.trim() 
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
            : ''
        }`}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Creating Your QR Code...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <QrCode className="w-6 h-6" />
            <span>Generate QR Code</span>
          </div>
        )}
      </Button>
    </div>
  );
}
