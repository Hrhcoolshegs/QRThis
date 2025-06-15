
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'error' | 'success';
  metadata?: {
    contentGenerated?: string;
    suggestions?: string[];
    qrCodeDataURL?: string;
  };
}

interface AIAssistantProps {
  onContentGenerated: (content: string) => void;
}

export function AIAssistant({ onContentGenerated }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Alexander, your QR code AI assistant. I can help you create the perfect QR code for any use case. What would you like to create today?",
      timestamp: new Date(),
      type: 'text' as const,
      metadata: {
        suggestions: [
          "Create a WiFi QR code",
          "Generate a business card QR",
          "Make a website QR code",
          "Create event information QR"
        ]
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<any>({});
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
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });
      return dataURL;
    } catch (error) {
      throw new Error('Failed to generate QR code image');
    }
  };

  const validateAndOptimizeContent = (content: string) => {
    const optimized = content.trim();
    
    // URL optimization
    if (optimized.startsWith('http://')) {
      return optimized.replace('http://', 'https://');
    }
    
    // Remove www if present to save characters
    if (optimized.includes('www.')) {
      return optimized.replace('www.', '');
    }
    
    // Clean up extra spaces
    return optimized.replace(/\s+/g, ' ');
  };

  const extractWiFiDetails = (input: string) => {
    const text = input.toLowerCase();
    
    // Pattern 1: "network name password"
    const simplePattern = /(?:network|wifi|ssid)?\s*(?:is|name)?\s*["']?([^\s"']+)["']?\s+(?:password|pass|pwd)?\s*(?:is)?\s*["']?([^\s"']+)["']?/i;
    const simpleMatch = input.match(simplePattern);
    
    if (simpleMatch && simpleMatch[1] && simpleMatch[2]) {
      return { ssid: simpleMatch[1], password: simpleMatch[2] };
    }
    
    // Pattern 2: "name: X password: Y" format
    const structuredPattern = /(?:name|ssid)[:\s]+["']?([^"'\n]+)["']?.*?(?:password|pass)[:\s]+["']?([^"'\n]+)["']?/i;
    const structuredMatch = input.match(structuredPattern);
    
    if (structuredMatch && structuredMatch[1] && structuredMatch[2]) {
      return { ssid: structuredMatch[1].trim(), password: structuredMatch[2].trim() };
    }
    
    // Pattern 3: Simple two-word format
    const words = input.trim().split(/\s+/);
    if (words.length === 2 && !text.includes('create') && !text.includes('generate')) {
      return { ssid: words[0], password: words[1] };
    }
    
    return null;
  };

  const extractContactDetails = (input: string) => {
    const emailPattern = /[\w\.-]+@[\w\.-]+\.\w+/;
    const phonePattern = /[\+]?[\s\-\(\)]?[\d\s\-\(\)]{10,}/;
    
    const email = input.match(emailPattern)?.[0];
    const phone = input.match(phonePattern)?.[0];
    
    // Extract name (first capitalized words before email/phone)
    let name = '';
    const words = input.split(/\s+/);
    for (const word of words) {
      if (word.match(/^[A-Z][a-z]+$/) || word.match(/^[A-Z][a-z]+[A-Z][a-z]+$/)) {
        name += (name ? ' ' : '') + word;
      } else if (email || phone) {
        break;
      }
    }
    
    if (name || email || phone) {
      return { name, email, phone };
    }
    
    return null;
  };

  const detectContentType = (input: string) => {
    const text = input.toLowerCase();
    
    if (text.includes('wifi') || text.includes('network') || text.includes('password')) return 'wifi';
    if (text.includes('http') || text.includes('www') || text.includes('website') || text.includes('.com') || text.includes('.org')) return 'url';
    if (text.includes('contact') || text.includes('business') || text.includes('phone') || text.includes('@')) return 'contact';
    if (text.includes('event') || text.includes('wedding') || text.includes('party')) return 'event';
    if (text.includes('email') || text.includes('@')) return 'email';
    if (text.includes('instagram') || text.includes('facebook') || text.includes('social')) return 'social';
    
    return 'general';
  };

  const generateContextualResponse = async (userInput: string, contentType: string) => {
    const input = userInput.toLowerCase();
    
    try {
      switch (contentType) {
        case 'wifi':
          const wifiDetails = extractWiFiDetails(userInput);
          if (wifiDetails) {
            const content = `WIFI:T:WPA;S:${wifiDetails.ssid};P:${wifiDetails.password};;`;
            const qrCodeDataURL = await generateQRCodeImage(content);
            
            return {
              content: `Perfect! I've created a WiFi QR code for "${wifiDetails.ssid}". When scanned, devices will automatically connect to your network.\n\n✅ QR code generated successfully!\n\n💡 Pro tip: Test the QR code with your phone first, then print and place it where guests can easily see it.`,
              type: 'success' as const,
              generatedContent: content,
              qrCodeDataURL
            };
          }
          
          if (conversationContext.awaitingWifiDetails) {
            const details = extractWiFiDetails(userInput);
            if (details) {
              const content = `WIFI:T:WPA;S:${details.ssid};P:${details.password};;`;
              const qrCodeDataURL = await generateQRCodeImage(content);
              setConversationContext({});
              
              return {
                content: `Great! I've created your WiFi QR code for "${details.ssid}".\n\n✅ QR code generated!\n\n💡 Tip: Place this QR code in a visible location for easy guest access.`,
                type: 'success' as const,
                generatedContent: content,
                qrCodeDataURL
              };
            }
          }
          
          setConversationContext({ awaitingWifiDetails: true });
          return {
            content: "I'll help you create a WiFi QR code! Please provide:\n\n📶 **Network name** and **password**\n\nExample: 'MyNetwork MyPassword123'\n\nOr tell me like: 'Network name is CafeWiFi and password is coffee2024'",
            type: 'text' as const,
            suggestions: ["MyNetwork password123", "HomeWiFi mypassword"]
          };

        case 'url':
          const urlMatch = userInput.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/);
          if (urlMatch) {
            let url = urlMatch[0];
            if (!url.startsWith('http')) {
              url = 'https://' + url;
            }
            const optimizedUrl = validateAndOptimizeContent(url);
            const qrCodeDataURL = await generateQRCodeImage(optimizedUrl);
            
            return {
              content: `Excellent! I've created a QR code for your website.\n\n🌐 **URL**: ${optimizedUrl}\n\n✅ QR code generated!\n\n💡 Pro tip: Test the link on mobile first to ensure it loads quickly.`,
              type: 'success' as const,
              generatedContent: optimizedUrl,
              qrCodeDataURL
            };
          }
          return {
            content: "I'll create a website QR code for you! 🌐\n\nPlease share the URL you'd like to use.\n\nExample: 'mywebsite.com' or 'https://example.com'",
            type: 'text' as const,
            suggestions: ["mywebsite.com", "https://example.com"]
          };

        case 'contact':
          const contactDetails = extractContactDetails(userInput);
          if (contactDetails && (contactDetails.name || contactDetails.email || contactDetails.phone)) {
            let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
            if (contactDetails.name) vcard += `FN:${contactDetails.name}\n`;
            if (contactDetails.phone) vcard += `TEL:${contactDetails.phone}\n`;
            if (contactDetails.email) vcard += `EMAIL:${contactDetails.email}\n`;
            vcard += 'END:VCARD';
            
            const qrCodeDataURL = await generateQRCodeImage(vcard);
            
            return {
              content: `Perfect! I've created a contact QR code.\n\n📇 **Contact Details:**\n${contactDetails.name ? `• Name: ${contactDetails.name}\n` : ''}${contactDetails.phone ? `• Phone: ${contactDetails.phone}\n` : ''}${contactDetails.email ? `• Email: ${contactDetails.email}\n` : ''}\n✅ QR code generated!\n\n💡 When scanned, this will add the contact directly to someone's phone.`,
              type: 'success' as const,
              generatedContent: vcard,
              qrCodeDataURL
            };
          }
          
          return {
            content: "I'll help create a professional contact QR code! 📇\n\nPlease provide the contact information:\n• **Name**\n• **Phone number**\n• **Email address**\n\nExample: 'John Doe 555-123-4567 john@company.com'",
            type: 'text' as const,
            suggestions: ["John Doe 555-123-4567 john@company.com", "Add my business contact"]
          };

        default:
          // For any other content, try to generate QR code directly
          if (userInput.trim().length > 0 && !input.includes('help') && !input.includes('create') && !input.includes('generate')) {
            const content = validateAndOptimizeContent(userInput);
            const qrCodeDataURL = await generateQRCodeImage(content);
            
            return {
              content: `I've created a QR code with your text!\n\n📝 **Content**: ${content}\n\n✅ QR code generated!\n\n💡 This QR code contains exactly what you provided.`,
              type: 'success' as const,
              generatedContent: content,
              qrCodeDataURL
            };
          }
          
          return {
            content: "I can help you create QR codes for:\n\n📶 **WiFi networks** - Instant connection\n🌐 **Websites & URLs** - Direct access\n📞 **Contact information** - Save to contacts\n📅 **Events & calendars** - Add to calendar\n📱 **Social media** - Follow profiles\n💬 **Custom messages** - Any text\n\nWhat would you like to create today?",
            type: 'text' as const,
            suggestions: ["Create WiFi QR", "Add my website", "Share contact info", "Custom text message"]
          };
      }
    } catch (error) {
      return {
        content: "I had trouble generating the QR code. Please try again or provide the information in a different format.",
        type: 'error' as const
      };
    }
  };

  const handleDownloadQR = (qrDataURL: string) => {
    const link = document.createElement('a');
    link.download = `alexander-qr-${Date.now()}.png`;
    link.href = qrDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been saved successfully!",
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'text' as const
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Simulate API delay
      setTimeout(async () => {
        try {
          const contentType = detectContentType(currentInput);
          const response = await generateContextualResponse(currentInput, contentType);
          
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.content,
            timestamp: new Date(),
            type: response.type || 'text' as const,
            metadata: {
              contentGenerated: response.generatedContent,
              suggestions: response.suggestions,
              qrCodeDataURL: response.qrCodeDataURL
            }
          };

          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);

          // Auto-fill content if AI generated it
          if (response.generatedContent) {
            const optimizedContent = validateAndOptimizeContent(response.generatedContent);
            onContentGenerated(optimizedContent);
            
            toast({
              title: "QR Content Generated! ✨",
              description: "Your content has been automatically added to the generator.",
            });
          }
        } catch (error) {
          setIsTyping(false);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question.",
            timestamp: new Date(),
            type: 'error' as const
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }, 800 + Math.random() * 400);
    } catch (error) {
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question.",
        timestamp: new Date(),
        type: 'error' as const
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
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
      default: return <Bot className="w-4 h-4 text-white" />;
    }
  };

  const getMessageBorderColor = (type?: string) => {
    switch (type) {
      case 'success': return 'border-green-500/30';
      case 'error': return 'border-red-500/30';
      default: return 'border-gray-700';
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-12 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <Bot className="w-5 h-5" />
        Ask Alexander
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-t-2xl md:rounded-2xl w-full max-w-2xl h-[80vh] md:h-[600px] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Alexander</h3>
                  <p className="text-xs text-gray-400">AI-powered QR optimization</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-blue-600'
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        getMessageIcon(message.type)
                      )}
                    </div>
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-3 rounded-2xl border ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white border-blue-500'
                          : `bg-gray-800 text-gray-100 ${getMessageBorderColor(message.type)}`
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {message.content}
                        </p>
                        
                        {/* QR Code Display */}
                        {message.metadata?.qrCodeDataURL && message.role === 'assistant' && (
                          <div className="mt-4 text-center">
                            <div className="bg-white p-4 rounded-lg inline-block">
                              <img 
                                src={message.metadata.qrCodeDataURL} 
                                alt="Generated QR Code"
                                className="w-48 h-48 max-w-full"
                                style={{ imageRendering: 'pixelated' }}
                              />
                            </div>
                            <div className="mt-3">
                              <Button
                                onClick={() => handleDownloadQR(message.metadata.qrCodeDataURL!)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  {message.metadata?.suggestions && message.role === 'assistant' && (
                    <div className="ml-11 mt-2 flex flex-wrap gap-2">
                      {message.metadata.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
                      <span className="text-xs text-gray-400">Alexander is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about QR codes..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Alexander can help optimize your QR codes • Press Enter to send
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
