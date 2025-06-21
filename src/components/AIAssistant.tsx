
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, CheckCircle, AlertCircle, Download, Sparkles, ArrowRight, Wifi, Globe, User as UserIcon, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'info' | 'success' | 'error' | 'collection';
  metadata?: {
    step?: string;
    collectedData?: Record<string, any>;
    nextAction?: string;
    qrData?: string;
    qrCodeDataURL?: string;
  };
}

interface AIAssistantProps {
  onContentGenerated: (content: string) => void;
}

const QR_TYPES = {
  wifi: { icon: Wifi, label: 'WiFi Network', fields: ['ssid', 'password', 'security'] },
  url: { icon: Globe, label: 'Website/URL', fields: ['url'] },
  contact: { icon: UserIcon, label: 'Contact Card', fields: ['name', 'phone', 'email', 'organization'] },
  phone: { icon: Phone, label: 'Phone Number', fields: ['phone'] },
  email: { icon: Mail, label: 'Email', fields: ['email', 'subject', 'body'] },
  text: { icon: MessageSquare, label: 'Custom Text', fields: ['text'] }
};

export function AIAssistant({ onContentGenerated }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm Alexander, your QR code assistant.\n\nI'll help you create the perfect QR code by gathering all the details I need first. What type of QR code would you like to create?",
      timestamp: new Date(),
      type: 'text',
      metadata: {
        step: 'select_type'
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<{
    type: string;
    data: Record<string, any>;
    currentField: number;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateQRCodeImage = async (content: string): Promise<string> => {
    try {
      const dataURL = await QRCode.toDataURL(content, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        },
        width: 300
      });
      return dataURL;
    } catch (error) {
      throw new Error('Failed to generate QR code image');
    }
  };

  const formatQRContent = (type: string, data: Record<string, any>): string => {
    switch (type) {
      case 'wifi':
        return `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password};;`;
      case 'contact':
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
        if (data.name) vcard += `FN:${data.name}\n`;
        if (data.phone) vcard += `TEL:${data.phone}\n`;
        if (data.email) vcard += `EMAIL:${data.email}\n`;
        if (data.organization) vcard += `ORG:${data.organization}\n`;
        vcard += 'END:VCARD';
        return vcard;
      case 'email':
        let emailStr = `mailto:${data.email}`;
        const params = [];
        if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
        if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
        if (params.length > 0) emailStr += `?${params.join('&')}`;
        return emailStr;
      case 'phone':
        return `tel:${data.phone}`;
      case 'url':
        let url = data.url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        return url;
      case 'text':
        return data.text;
      default:
        return '';
    }
  };

  const getFieldPrompt = (type: string, field: string): string => {
    const prompts: Record<string, Record<string, string>> = {
      wifi: {
        ssid: "What's your WiFi network name (SSID)?",
        password: "What's the WiFi password?",
        security: "What's the security type? (WPA/WPA2/WEP/Open - or just press Enter for WPA)"
      },
      contact: {
        name: "What's the full name for this contact?",
        phone: "What's the phone number? (with country code if international)",
        email: "What's the email address?",
        organization: "What's the company/organization? (optional - press Enter to skip)"
      },
      email: {
        email: "What's the recipient's email address?",
        subject: "What's the email subject? (optional - press Enter to skip)",
        body: "What's the email message? (optional - press Enter to skip)"
      },
      phone: {
        phone: "What's the phone number? (include country code for international numbers)"
      },
      url: {
        url: "What's the website URL? (e.g., mywebsite.com or https://example.com)"
      },
      text: {
        text: "What text would you like in the QR code?"
      }
    };
    return prompts[type]?.[field] || `Please provide ${field}:`;
  };

  const startCollection = (type: string) => {
    const typeConfig = QR_TYPES[type as keyof typeof QR_TYPES];
    if (!typeConfig) return;

    setCurrentCollection({
      type,
      data: {},
      currentField: 0
    });

    const firstField = typeConfig.fields[0];
    const prompt = getFieldPrompt(type, firstField);
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Great! Let's create a ${typeConfig.label} QR code.\n\n${prompt}`,
      timestamp: new Date(),
      type: 'collection',
      metadata: {
        step: 'collecting',
        collectedData: {},
        nextAction: `collecting_${firstField}`
      }
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const processCollectionInput = async (input: string) => {
    if (!currentCollection) return;

    const typeConfig = QR_TYPES[currentCollection.type as keyof typeof QR_TYPES];
    const currentFieldName = typeConfig.fields[currentCollection.currentField];
    
    // Handle optional fields
    const isOptional = ['organization', 'subject', 'body'].includes(currentFieldName);
    const value = input.trim();
    
    if (!isOptional && !value) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `This field is required. ${getFieldPrompt(currentCollection.type, currentFieldName)}`,
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Update collected data
    const updatedData = { ...currentCollection.data };
    if (value || !isOptional) {
      updatedData[currentFieldName] = value || (currentFieldName === 'security' ? 'WPA' : '');
    }

    const nextFieldIndex = currentCollection.currentField + 1;
    
    if (nextFieldIndex < typeConfig.fields.length) {
      // More fields to collect
      const nextField = typeConfig.fields[nextFieldIndex];
      const prompt = getFieldPrompt(currentCollection.type, nextField);
      
      setCurrentCollection({
        ...currentCollection,
        data: updatedData,
        currentField: nextFieldIndex
      });

      const continueMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ Got it!\n\n${prompt}`,
        timestamp: new Date(),
        type: 'collection'
      };
      
      setMessages(prev => [...prev, continueMessage]);
    } else {
      // All data collected, generate QR code
      setCurrentCollection(null);
      await generateFinalQR(currentCollection.type, updatedData);
    }
  };

  const generateFinalQR = async (type: string, data: Record<string, any>) => {
    try {
      const qrContent = formatQRContent(type, data);
      const qrCodeDataURL = await generateQRCodeImage(qrContent);
      
      const typeConfig = QR_TYPES[type as keyof typeof QR_TYPES];
      
      // Create summary of collected data
      let summary = `**${typeConfig.label} QR Code Created!**\n\n`;
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          summary += `• **${label}:** ${key === 'password' ? '••••••••' : value}\n`;
        }
      });
      
      summary += '\n✨ Your QR code is ready to download and use!';

      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: summary,
        timestamp: new Date(),
        type: 'success',
        metadata: {
          qrData: qrContent,
          qrCodeDataURL
        }
      };

      setMessages(prev => [...prev, successMessage]);
      
      // Auto-fill the main generator
      onContentGenerated(qrContent);
      
      toast({
        title: "QR Code Generated! ✨",
        description: "Alexander has created your QR code and added it to the main generator!",
      });
      
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I encountered an error generating your QR code. Let's try again or choose a different type.",
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(async () => {
      try {
        if (currentCollection) {
          // We're collecting data for a QR type
          await processCollectionInput(currentInput);
        } else {
          // Check if user selected a QR type or wants to start over
          const input = currentInput.toLowerCase();
          let selectedType = '';
          
          for (const [key, config] of Object.entries(QR_TYPES)) {
            if (input.includes(key) || input.includes(config.label.toLowerCase())) {
              selectedType = key;
              break;
            }
          }
          
          if (selectedType) {
            startCollection(selectedType);
          } else {
            // Show type selection
            const helpMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: "I can help you create these types of QR codes:\n\n🌐 **Website/URL** - Link to any website\n📶 **WiFi Network** - Automatic WiFi connection\n📇 **Contact Card** - Save contact information\n📞 **Phone Number** - Direct phone calls\n📧 **Email** - Pre-filled email composition\n💬 **Custom Text** - Any text message\n\nWhich type would you like to create?",
              timestamp: new Date(),
              type: 'info'
            };
            setMessages(prev => [...prev, helpMessage]);
          }
        }
      } catch (error) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I encountered an issue. Let's start fresh - what type of QR code would you like to create?",
          timestamp: new Date(),
          type: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
        setCurrentCollection(null);
      } finally {
        setIsTyping(false);
      }
    }, 800);
  };

  const handleTypeSelect = (type: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: QR_TYPES[type as keyof typeof QR_TYPES].label,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
      startCollection(type);
      setIsTyping(false);
    }, 500);
  };

  const handleDownloadQR = (qrDataURL: string) => {
    const link = document.createElement('a');
    link.download = `alexander-qr-${Date.now()}.png`;
    link.href = qrDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code Downloaded! 🎉",
      description: "Your QR code has been saved successfully!",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'info': return <Sparkles className="w-4 h-4 text-blue-400" />;
      case 'collection': return <ArrowRight className="w-4 h-4 text-orange-400" />;
      default: return <Sparkles className="w-4 h-4 text-white" />;
    }
  };

  const getMessageBorderColor = (type?: string) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/5';
      case 'error': return 'border-red-500/30 bg-red-500/5';
      case 'info': return 'border-blue-500/30 bg-blue-500/5';
      case 'collection': return 'border-orange-500/30 bg-orange-500/5';
      default: return 'border-gray-700/50';
    }
  };

  return (
    <>
      {/* Compact Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-medium h-12 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <span>Ask Alexander</span>
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-t-3xl md:rounded-3xl w-full max-w-3xl h-[85vh] md:h-[700px] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Alexander</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Smart QR Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl h-10 w-10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                        : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
                    } shadow-lg`}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        getMessageIcon(message.type)
                      )}
                    </div>
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-4 rounded-2xl border backdrop-blur-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400/50 shadow-lg'
                          : `bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 ${getMessageBorderColor(message.type)} shadow-lg`
                      }`}>
                        <div className="text-sm leading-relaxed whitespace-pre-line">
                          {message.content}
                        </div>
                        
                        {/* QR Code Display */}
                        {message.metadata?.qrCodeDataURL && message.role === 'assistant' && (
                          <div className="mt-6 text-center">
                            <div className="bg-white p-6 rounded-2xl inline-block shadow-xl border border-gray-200/50">
                              <img 
                                src={message.metadata.qrCodeDataURL} 
                                alt="Generated QR Code"
                                className="w-56 h-56 max-w-full rounded-xl"
                                style={{ imageRendering: 'pixelated' }}
                              />
                            </div>
                            <div className="mt-4">
                              <Button
                                onClick={() => handleDownloadQR(message.metadata.qrCodeDataURL!)}
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download QR Code
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 px-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick Type Selection */}
                  {message.role === 'assistant' && message.metadata?.step === 'select_type' && (
                    <div className="ml-14 mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(QR_TYPES).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => handleTypeSelect(key)}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-600/80 hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50"
                        >
                          <config.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-sm font-medium">{config.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Alexander is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-b-3xl">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentCollection ? "Type your answer..." : "Choose a QR type or describe what you need..."}
                  className="flex-1 px-5 py-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent shadow-lg transition-all duration-300"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Alexander collects all details before generating your QR code • Press Enter to send
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
