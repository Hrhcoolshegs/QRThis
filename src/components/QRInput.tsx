import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { QrCode, AlertCircle, CheckCircle, Undo2, Loader2, Globe, Mail, MessageSquare, Smartphone, Wifi, User } from 'lucide-react';
import { optimizeText, detectContentType } from '@/utils/smartOptimization';
import { validateQRContent, validateURL, validateEmail, validatePhone, validateWiFiNetwork } from '@/utils/securityUtils';

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

interface FormData {
  [key: string]: string;
}

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
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('url');
  const [formData, setFormData] = useState<FormData>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Comprehensive validation that runs on every input change
  useEffect(() => {
    if (!inputText.trim()) {
      setIsValid(false);
      setValidationError('Content is required');
      return;
    }

    if (isOverLimit) {
      setIsValid(false);
      setValidationError(`Content is too long (${characterCount}/${maxCharacters} characters)`);
      return;
    }

    // Validate based on active tab type
    let validation = { isValid: false, error: 'Invalid content' };
    
    switch (activeTab) {
      case 'url':
        validation = validateURL(inputText);
        break;
      case 'email':
        const emailContent = inputText.replace('mailto:', '');
        validation = validateEmail(emailContent);
        break;
      case 'phone':
        const phoneContent = inputText.replace('tel:', '');
        validation = validatePhone(phoneContent);
        break;
      case 'wifi':
        // For WiFi, we need both SSID and password from formData
        if (formData.ssid && formData.password) {
          validation = validateWiFiNetwork(formData.ssid, formData.password, formData.security || 'WPA');
        } else {
          validation = { isValid: false, error: 'WiFi network name and password are required' };
        }
        break;
      case 'contact':
        // For contact, we need at least a name
        if (formData.name && formData.name.trim().length >= 2) {
          validation = { isValid: true };
          // Validate optional fields if they exist
          if (formData.email) {
            const emailValidation = validateEmail(formData.email);
            if (!emailValidation.isValid) {
              validation = { isValid: false, error: `Email: ${emailValidation.error}` };
            }
          }
          if (formData.phone && validation.isValid) {
            const phoneValidation = validatePhone(formData.phone);
            if (!phoneValidation.isValid) {
              validation = { isValid: false, error: `Phone: ${phoneValidation.error}` };
            }
          }
        } else {
          validation = { isValid: false, error: 'Contact name is required (min 2 characters)' };
        }
        break;
      case 'text':
        // Text validation - check for basic safety
        const textValidation = validateQRContent(inputText, 'text');
        validation = textValidation;
        break;
      default:
        validation = validateQRContent(inputText, detectContentType(inputText));
    }

    if (!validation.isValid) {
      setIsValid(false);
      setValidationError(validation.error || 'Invalid content');
      return;
    }

    // All validations passed
    setIsValid(true);
    setValidationError('');
  }, [inputText, isOverLimit, characterCount, maxCharacters, activeTab, formData]);

  const validateField = (fieldName: string, value: string, type: string): string | null => {
    if (!value.trim()) {
      const requiredFields = {
        url: ['url'],
        email: ['email'],
        phone: ['phone'],
        wifi: ['ssid', 'password'],
        contact: ['name']
      };
      
      if (requiredFields[type as keyof typeof requiredFields]?.includes(fieldName)) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      return null;
    }

    switch (fieldName) {
      case 'url':
        const urlValidation = validateURL(value);
        return urlValidation.isValid ? null : urlValidation.error || 'Invalid URL';
        
      case 'email':
        const emailValidation = validateEmail(value);
        return emailValidation.isValid ? null : emailValidation.error || 'Invalid email';
        
      case 'phone':
        const phoneValidation = validatePhone(value);
        return phoneValidation.isValid ? null : phoneValidation.error || 'Invalid phone number';
        
      case 'ssid':
        if (value.length < 1 || value.length > 32) {
          return 'Network name must be 1-32 characters';
        }
        return null;
        
      case 'password':
        if (type === 'wifi' && value.length < 8) {
          return 'WiFi password must be at least 8 characters';
        }
        return null;
        
      case 'name':
        if (value.length < 2) {
          return 'Name must be at least 2 characters';
        }
        return null;
        
      case 'organization':
        if (value && value.length > 100) {
          return 'Organization name too long (max 100 characters)';
        }
        return null;
        
      case 'subject':
        if (value && value.length > 200) {
          return 'Subject too long (max 200 characters)';
        }
        return null;
        
      case 'body':
        if (value && value.length > 1000) {
          return 'Message too long (max 1000 characters)';
        }
        return null;
        
      default:
        return null;
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);
    
    // Validate field immediately
    const error = validateField(fieldName, value, activeTab);
    const newFieldErrors = { ...fieldErrors };
    if (error) {
      newFieldErrors[fieldName] = error;
    } else {
      delete newFieldErrors[fieldName];
    }
    setFieldErrors(newFieldErrors);
    
    // Update main input for simple types
    if (['url', 'email', 'phone', 'text'].includes(activeTab)) {
      onInputChange(value);
    } else {
      // For complex types, format the data
      formatComplexData(activeTab, newFormData);
    }
  };

  const formatComplexData = (type: string, data: FormData) => {
    let formatted = '';
    
    switch (type) {
      case 'wifi':
        if (data.ssid && data.password) {
          const security = data.security || 'WPA';
          formatted = `WIFI:T:${security};S:${data.ssid};P:${data.password};;`;
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
    // Pre-generation validation checks
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some content to generate a QR code",
        variant: "destructive"
      });
      return;
    }

    // Check for field-specific errors
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;
    if (hasFieldErrors) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before generating QR code",
        variant: "destructive"
      });
      return;
    }

    // Check overall validation
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: validationError || "Please check your input and try again",
        variant: "destructive"
      });
      return;
    }

    // All validations passed - proceed with generation
    onGenerate();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormData({});
    setFieldErrors({});
    const selectedType = contentTypes.find(type => type.id === value);
    if (selectedType && ['url', 'email', 'phone', 'text'].includes(value)) {
      onInputChange(selectedType.placeholder);
      setIsFocused(true);
    } else {
      onInputChange('');
    }
  };

  const renderInputField = (type: any) => {
    if (type.id === 'wifi') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Network Name (SSID) *
            </label>
            <Input
              value={formData.ssid || ''}
              onChange={(e) => handleFieldChange('ssid', e.target.value)}
              placeholder="My WiFi Network"
              className={`w-full ${fieldErrors.ssid ? 'border-red-500' : ''}`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {fieldErrors.ssid && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {fieldErrors.ssid}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password *
            </label>
            <Input
              type="password"
              value={formData.password || ''}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              placeholder="Enter WiFi password (min 8 characters)"
              className={`w-full ${fieldErrors.password ? 'border-red-500' : ''}`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {fieldErrors.password}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Security Type
            </label>
            <select
              value={formData.security || 'WPA'}
              onChange={(e) => handleFieldChange('security', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Open Network</option>
            </select>
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
                Full Name *
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="John Doe"
                className={`w-full ${fieldErrors.name ? 'border-red-500' : ''}`}
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={`w-full ${fieldErrors.phone ? 'border-red-500' : ''}`}
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {fieldErrors.phone}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <Input
              value={formData.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="john@example.com"
              className={`w-full ${fieldErrors.email ? 'border-red-500' : ''}`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {fieldErrors.email}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization
            </label>
            <Input
              value={formData.organization || ''}
              onChange={(e) => handleFieldChange('organization', e.target.value)}
              placeholder="Company Name"
              className={`w-full ${fieldErrors.organization ? 'border-red-500' : ''}`}
            />
            {fieldErrors.organization && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {fieldErrors.organization}
              </p>
            )}
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
            <div>
              <textarea
                value={inputText}
                onChange={(e) => onInputChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={type.placeholder}
                className={`w-full h-32 p-6 border-2 rounded-2xl resize-none focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900/50 text-lg ${
                  !isValid && inputText.trim()
                    ? 'border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                }`}
                maxLength={maxCharacters}
              />
            </div>
          ) : (
            <div>
              <Input
                value={inputText}
                onChange={(e) => onInputChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={type.placeholder}
                className={`w-full h-16 p-6 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900/50 text-lg ${
                  !isValid && inputText.trim()
                    ? 'border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                }`}
              />
            </div>
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

        {/* Validation Success */}
        {isValid && inputText.trim() && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm mt-2 animate-fade-in">
            <CheckCircle size={16} />
            <span>Content validated and ready to generate</span>
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
        disabled={isGenerating || !inputText.trim() || !isValid || Object.keys(fieldErrors).length > 0}
        className={`w-full font-bold h-14 text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
          isGenerating 
            ? 'bg-gradient-to-r from-blue-400 to-indigo-400 cursor-not-allowed' 
            : isValid && inputText.trim() && Object.keys(fieldErrors).length === 0
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95'
            : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
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
            <span>
              {!inputText.trim() 
                ? 'Enter Content First' 
                : !isValid 
                ? 'Fix Errors to Generate' 
                : 'Generate QR Code'
              }
            </span>
          </div>
        )}
      </Button>
    </div>
  );
}
