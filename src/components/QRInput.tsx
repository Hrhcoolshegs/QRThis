
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Globe, MessageSquare, Phone, Mail, MapPin, Calendar, User, CreditCard, AlertTriangle, Undo2 } from 'lucide-react';
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

  const clearValidationError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleURLChange = (value: string) => {
    clearValidationError('url');
    const sanitized = sanitizeTextInput(value, 2048);
    
    if (sanitized) {
      const validation = validateURL(sanitized);
      if (!validation.isValid && validation.error) {
        setValidationErrors(prev => ({ ...prev, url: validation.error! }));
      }
    }
    
    onInputChange(sanitized);
  };

  const handleWiFiChange = (field: keyof typeof wifiData, value: any) => {
    clearValidationError(`wifi_${field}`);
    const newWifiData = { ...wifiData, [field]: value };
    setWifiData(newWifiData);

    // Validate SSID
    if (field === 'ssid') {
      const sanitized = sanitizeTextInput(value, 32);
      newWifiData.ssid = sanitized;
      setWifiData(newWifiData);
      
      const validation = validateWiFiSSID(sanitized);
      if (!validation.isValid && validation.error) {
        setValidationErrors(prev => ({ ...prev, wifi_ssid: validation.error! }));
        return;
      }
    }

    // Validate password
    if (field === 'password') {
      const sanitized = sanitizeTextInput(value, 63);
      newWifiData.password = sanitized;
      setWifiData(newWifiData);
      
      const validation = validateWiFiPassword(sanitized, newWifiData.security);
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
    const sanitized = sanitizeTextInput(value, 100);
    const newContactData = { ...contactData, [field]: sanitized };
    setContactData(newContactData);

    // Special validation for email and URL fields
    if (field === 'email' && sanitized) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitized)) {
        setValidationErrors(prev => ({ ...prev, contact_email: 'Invalid email format' }));
        return;
      }
    }

    if (field === 'url' && sanitized) {
      const validation = validateURL(sanitized);
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
    const sanitized = sanitizeTextInput(value, 2000);
    onInputChange(sanitized);
  };

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
          {optimizationShown && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Saved {savedChars} chars
              </span>
              <Button
                onClick={onUndoOptimization}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                title="Undo optimization"
              >
                <Undo2 size={16} />
              </Button>
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
                rows={4}
                maxLength={2000}
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
                />
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
                onChange={(e) => {
                  const sanitized = sanitizeTextInput(e.target.value, 20);
                  onInputChange(`tel:${sanitized}`);
                }}
                disabled={isGenerating}
                maxLength={20}
              />
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
                onChange={(e) => {
                  const sanitized = sanitizeTextInput(e.target.value, 100);
                  onInputChange(`mailto:${sanitized}`);
                }}
                disabled={isGenerating}
                maxLength={100}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={onGenerate}
            disabled={isGenerating || isOverLimit || !inputText.trim()}
            className="w-full md:w-auto px-8 py-2"
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
