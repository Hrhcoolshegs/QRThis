import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { QrCode, AlertCircle, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { TypeSelector } from '@/components/TypeSelector';
import { validateQRContent, validateURL, validateEmail, validatePhone, validateWiFiNetwork } from '@/utils/securityUtils';

interface QRInputNewProps {
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
  hideGenerateButton?: boolean;
}

interface FormData {
  [key: string]: string;
}

export function QRInputNew({
  inputText,
  onInputChange,
  onGenerate,
  isGenerating,
  isOverLimit,
  characterCount,
  maxCharacters,
  hideGenerateButton = false,
}: QRInputNewProps) {
  const { toast } = useToast();
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [activeType, setActiveType] = useState('url');
  const [formData, setFormData] = useState<FormData>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validation logic
  useEffect(() => {
    if (!inputText.trim()) {
      setIsValid(false);
      setValidationError('');
      return;
    }

    if (isOverLimit) {
      setIsValid(false);
      setValidationError(`Content is too long (${characterCount}/${maxCharacters})`);
      return;
    }

    let isContentValid = false;
    let error = '';
    
    switch (activeType) {
      case 'url':
        const urlResult = validateURL(inputText);
        isContentValid = urlResult.isValid;
        error = urlResult.error || '';
        break;
      case 'email':
        const emailContent = inputText.replace('mailto:', '');
        const emailResult = validateEmail(emailContent);
        isContentValid = emailResult.isValid;
        error = emailResult.error || '';
        break;
      case 'phone':
        const phoneContent = inputText.replace('tel:', '');
        const phoneResult = validatePhone(phoneContent);
        isContentValid = phoneResult.isValid;
        error = phoneResult.error || '';
        break;
      case 'wifi':
        if (formData.ssid && formData.password) {
          const wifiResult = validateWiFiNetwork(formData.ssid, formData.password, formData.security || 'WPA');
          isContentValid = wifiResult.isValid;
          error = wifiResult.error || '';
        } else {
          isContentValid = false;
          error = 'WiFi credentials required';
        }
        break;
      case 'contact':
        if (formData.name && formData.name.trim().length >= 2) {
          isContentValid = true;
          error = '';
        } else {
          isContentValid = false;
          error = 'Contact name required';
        }
        break;
      case 'text':
        const textResult = validateQRContent(inputText, 'text');
        isContentValid = textResult.isValid;
        error = textResult.error || '';
        break;
    }

    setIsValid(isContentValid);
    setValidationError(error);
  }, [inputText, isOverLimit, characterCount, maxCharacters, activeType, formData]);

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    setFormData({});
    setFieldErrors({});
    onInputChange('');
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);
    
    if (['url', 'email', 'phone', 'text'].includes(activeType)) {
      onInputChange(value);
    } else {
      formatComplexData(activeType, newFormData);
    }
  };

  const formatComplexData = (type: string, data: FormData) => {
    let formatted = '';
    
    switch (type) {
      case 'wifi':
        if (data.ssid && data.password) {
          formatted = `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password};;`;
        }
        break;
      case 'contact':
        if (data.name) {
          let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
          vcard += `FN:${data.name}\n`;
          if (data.phone) vcard += `TEL:${data.phone}\n`;
          if (data.email) vcard += `EMAIL:${data.email}\n`;
          if (data.organization) vcard += `ORG:${data.organization}\n`;
          vcard += 'END:VCARD';
          formatted = vcard;
        }
        break;
    }
    
    if (formatted) {
      onInputChange(formatted);
    }
  };

  const handleGenerate = () => {
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: validationError || "Please check your input",
        variant: "destructive"
      });
      return;
    }
    onGenerate();
  };

  const renderInput = () => {
    if (activeType === 'wifi') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Network Name (SSID)</label>
            <Input
              value={formData.ssid || ''}
              onChange={(e) => handleFieldChange('ssid', e.target.value)}
              placeholder="My WiFi Network"
              className="h-12"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
            <Input
              type="password"
              value={formData.password || ''}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              placeholder="Enter password"
              className="h-12"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Security Type</label>
            <select
              value={formData.security || 'WPA'}
              onChange={(e) => handleFieldChange('security', e.target.value)}
              className="w-full h-12 px-4 border border-input rounded-lg bg-background"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Open Network</option>
            </select>
          </div>
        </div>
      );
    }

    if (activeType === 'contact') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Full Name *</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="John Doe"
              className="h-12"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+1 555 123 4567"
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
              <Input
                value={formData.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="john@example.com"
                className="h-12"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Organization</label>
            <Input
              value={formData.organization || ''}
              onChange={(e) => handleFieldChange('organization', e.target.value)}
              placeholder="Company Name (optional)"
              className="h-12"
            />
          </div>
        </div>
      );
    }

    const placeholders: Record<string, string> = {
      url: 'https://example.com',
      email: 'hello@example.com',
      phone: '+1 555 123 4567',
      text: 'Your message here...'
    };

    if (activeType === 'text') {
      return (
        <textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholders[activeType]}
          className="w-full h-32 p-4 border-2 border-input rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all bg-background text-foreground"
          maxLength={maxCharacters}
        />
      );
    }

    return (
      <Input
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={placeholders[activeType]}
        className="h-14 text-lg"
      />
    );
  };

  const getButtonState = () => {
    if (isGenerating) {
      return { text: 'Generating...', icon: Loader2, disabled: true, variant: 'default' as const };
    }
    if (!inputText.trim()) {
      return { text: 'Enter Content', icon: QrCode, disabled: true, variant: 'secondary' as const };
    }
    if (!isValid) {
      return { text: 'Invalid Input', icon: AlertCircle, disabled: true, variant: 'destructive' as const };
    }
    return { text: 'Generate QR Code', icon: Sparkles, disabled: false, variant: 'default' as const };
  };

  const buttonState = getButtonState();
  const ButtonIcon = buttonState.icon;

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Choose QR Type</h3>
        <TypeSelector selectedType={activeType} onTypeChange={handleTypeChange} />
      </div>

      {/* Input Field */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Enter Content</h3>
          {inputText && (
            <span className={`text-xs font-medium ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
              {characterCount} / {maxCharacters}
            </span>
          )}
        </div>
        {renderInput()}
        
        {/* Validation feedback */}
        {validationError && inputText && (
          <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span>{validationError}</span>
          </div>
        )}
        {isValid && inputText && (
          <div className="mt-2 flex items-center gap-2 text-sm text-success">
            <CheckCircle className="w-4 h-4" />
            <span>Ready to generate</span>
          </div>
        )}
      </div>

      {/* Generate Button */}
      {!hideGenerateButton && (
        <Button
          onClick={handleGenerate}
          disabled={buttonState.disabled}
          variant={buttonState.variant}
          className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-smooth hover:scale-[1.02] disabled:hover:scale-100"
        >
          <ButtonIcon className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {buttonState.text}
        </Button>
      )}
    </div>
  );
}
