
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Globe, MessageSquare, Phone, Mail, User, AlertTriangle, Undo2, X } from 'lucide-react';
import { validateURL, validateWiFiSSID, validateWiFiPassword, sanitizeTextInput } from '@/utils/securityUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QRInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  isOverLimit: boolean;
  characterCount: number;
  maxCharacters: number;
  optimizationShown: boolean;
  savedChars: number;
  onUndoOptimization: () => void;
  contentType: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
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
  contentType,
  errorCorrectionLevel
}: QRInputProps) {
  const [activeTab, setActiveTab] = useState('url');
  const [wifiData, setWifiData] = useState({
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false
  });
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [optimizationDismissed, setOptimizationDismissed] = useState(false);

  const clearValidationError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  };

  const hasValidationErrors = (): boolean => {
    return Object.keys(validationErrors).length > 0;
  };

  const handleURLChange = (value: string) => {
    clearValidationError('url');
    
    if (value) {
      const validation = validateURL(value);
      if (!validation.isValid && validation.error) {
        setValidationErrors(prev => ({ ...prev, url: validation.error! }));
      }
    }
    
    onInputChange(value);
  };

  const handleWiFiChange = (field: keyof typeof wifiData, value: any) => {
    clearValidationError(`wifi_${field}`);
    const newWifiData = { ...wifiData, [field]: value };
    setWifiData(newWifiData);

    // Validate SSID
    if (field === 'ssid') {
      const validation = validateWiFiSSID(value);
      if (!validation.isValid && validation.error) {
        setValidationErrors(prev => ({ ...prev, wifi_ssid: validation.error! }));
        return;
      }
    }

    // Validate password
    if (field === 'password') {
      const validation = validateWiFiPassword(value, newWifiData.security);
      if (!validation.isValid && validation.error) {
        setValidationErrors(prev => ({ ...prev, wifi_password: validation.error! }));
        return;
      }
    }

    // Generate WiFi QR content
    const wifiString = `WIFI:T:${newWifiData.security};S:${newWifiData.ssid};P:${newWifiData.password};H:${newWifiData.hidden ? 'true' : 'false'};;`;
    onInputChange(wifiString);
  };

  const handleContactChange = (field: keyof typeof contactData, value: string) => {
    clearValidationError(`contact_${field}`);
    const newContactData = { ...contactData, [field]: value };
    setContactData(newContactData);

    // Validate email
    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        setValidationErrors(prev => ({ ...prev, contact_email: 'Please enter a valid email address' }));
        return;
      }
    }

    // Validate phone
    if (field === 'phone' && value) {
      if (!validatePhoneNumber(value)) {
        setValidationErrors(prev => ({ ...prev, contact_phone: 'Please enter a valid phone number' }));
        return;
      }
    }

    // Validate URL
    if (field === 'url' && value) {
      const validation = validateURL(value);
      if (!validation.isValid && validation.error) {
        setValidationErrors(prev => ({ ...prev, contact_url: validation.error }));
        return;
      }
    }

    // Generate vCard content
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${newContactData.name}
ORG:${newContactData.organization}
TEL:${newContactData.phone}
EMAIL:${newContactData.email}
URL:${newContactData.url}
END:VCARD`;
    onInputChange(vcard);
  };

  const handleTextChange = (value: string) => {
    clearValidationError('text');
    onInputChange(value);
  };

  const handleEmailChange = (value: string) => {
    clearValidationError('email');
    
    if (value) {
      if (!validateEmail(value)) {
        setValidationErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    }
    
    onInputChange(`mailto:${value}`);
  };

  const handlePhoneChange = (value: string) => {
    clearValidationError('phone');
    
    if (value) {
      if (!validatePhoneNumber(value)) {
        setValidationErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number (e.g., +1234567890)' }));
      }
    }
    
    onInputChange(`tel:${value}`);
  };

  const handleDismissOptimization = () => {
    setOptimizationDismissed(true);
  };

  const canGenerate = !isGenerating && !isOverLimit && inputText.trim() && !hasValidationErrors();

  const tabs = [
    { id: 'url', label: 'URL', icon: Globe },
    { id: 'text', label: 'Text', icon: MessageSquare },
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'contact', label: 'Contact', icon: User },
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'email', label: 'Email', icon: Mail },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          QR Code Content
          {optimizationShown && !optimizationDismissed && (
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1">
                <span className="text-sm text-green-700 font-medium">
                  Optimized! Saved {savedChars} chars
                </span>
                <Button
                  onClick={onUndoOptimization}
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-700 h-6 w-6 p-0"
                  title="Undo optimization"
                >
                  <Undo2 size={14} />
                </Button>
                <Button
                  onClick={handleDismissOptimization}
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-700 h-6 w-6 p-0"
                  title="Dismiss"
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Choose what you want to encode in your QR code
          <div className="flex items-center justify-between mt-2">
            <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
              {characterCount}/{maxCharacters} characters
            </span>
            <span className="text-xs text-gray-400">
              Type: {contentType} | Error Correction: {errorCorrectionLevel}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={activeTab === 'url' ? inputText : ''}
                onChange={(e) => handleURLChange(e.target.value)}
                disabled={isGenerating}
                className={validationErrors.url ? 'border-red-500' : ''}
              />
              {validationErrors.url && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validationErrors.url}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Text Content</Label>
              <Textarea
                id="text"
                placeholder="Enter any text you want to encode..."
                value={activeTab === 'text' ? inputText : ''}
                onChange={(e) => handleTextChange(e.target.value)}
                disabled={isGenerating}
                rows={6}
                className="resize-none"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="wifi" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ssid">Network Name (SSID)</Label>
                <Input
                  id="ssid"
                  placeholder="My WiFi Network"
                  value={wifiData.ssid}
                  onChange={(e) => handleWiFiChange('ssid', e.target.value)}
                  disabled={isGenerating}
                  maxLength={32}
                  className={validationErrors.wifi_ssid ? 'border-red-500' : ''}
                />
                {validationErrors.wifi_ssid && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{validationErrors.wifi_ssid}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifi-security">Security Type</Label>
                <Select value={wifiData.security} onValueChange={(value) => handleWiFiChange('security', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">Open (No Password)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {wifiData.security !== 'nopass' && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="wifi-password">Password</Label>
                  <Input
                    id="wifi-password"
                    type="password"
                    placeholder="WiFi password"
                    value={wifiData.password}
                    onChange={(e) => handleWiFiChange('password', e.target.value)}
                    disabled={isGenerating}
                    maxLength={63}
                    className={validationErrors.wifi_password ? 'border-red-500' : ''}
                  />
                  {validationErrors.wifi_password && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{validationErrors.wifi_password}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Full Name</Label>
                <Input
                  id="contact-name"
                  placeholder="John Doe"
                  value={contactData.name}
                  onChange={(e) => handleContactChange('name', e.target.value)}
                  disabled={isGenerating}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-org">Organization</Label>
                <Input
                  id="contact-org"
                  placeholder="Company Name"
                  value={contactData.organization}
                  onChange={(e) => handleContactChange('organization', e.target.value)}
                  disabled={isGenerating}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  placeholder="+1234567890"
                  value={contactData.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  disabled={isGenerating}
                  maxLength={20}
                  className={validationErrors.contact_phone ? 'border-red-500' : ''}
                />
                {validationErrors.contact_phone && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{validationErrors.contact_phone}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="john@example.com"
                  value={contactData.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  disabled={isGenerating}
                  maxLength={100}
                  className={validationErrors.contact_email ? 'border-red-500' : ''}
                />
                {validationErrors.contact_email && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{validationErrors.contact_email}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="contact-url">Website</Label>
                <Input
                  id="contact-url"
                  type="url"
                  placeholder="https://example.com"
                  value={contactData.url}
                  onChange={(e) => handleContactChange('url', e.target.value)}
                  disabled={isGenerating}
                  maxLength={200}
                  className={validationErrors.contact_url ? 'border-red-500' : ''}
                />
                {validationErrors.contact_url && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{validationErrors.contact_url}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={activeTab === 'phone' ? inputText.replace('tel:', '') : ''}
                onChange={(e) => handlePhoneChange(e.target.value)}
                disabled={isGenerating}
                maxLength={20}
                className={validationErrors.phone ? 'border-red-500' : ''}
              />
              {validationErrors.phone && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validationErrors.phone}</AlertDescription>
                </Alert>
              )}
              <p className="text-sm text-gray-500">
                Include country code for international numbers
              </p>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="someone@example.com"
                value={activeTab === 'email' ? inputText.replace('mailto:', '') : ''}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={isGenerating}
                maxLength={100}
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validationErrors.email}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={onGenerate}
            disabled={!canGenerate}
            className="w-full md:w-auto px-8 py-2"
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </div>

        {hasValidationErrors() && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              Please fix the validation errors above before generating your QR code.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
