
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, CheckCircle, AlertCircle, Download, Sparkles, Zap } from 'lucide-react';
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
      content: "👋 Hi! I'm Alexander, your intelligent QR code assistant.\n\nI can help you create:\n🔗 **Website & URL QR codes**\n📶 **WiFi connection codes** \n📇 **Digital business cards**\n📧 **Email & contact info**\n📱 **Social media profiles**\n💬 **Custom text messages**\n\nJust tell me what you'd like to create, and I'll handle the rest!",
      timestamp: new Date(),
      type: 'text' as const,
      metadata: {
        suggestions: [
          "Create WiFi QR for my network",
          "Make a business card QR code", 
          "Generate website QR code",
          "Create contact info QR"
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

  const validateAndOptimizeContent = (content: string) => {
    const optimized = content.trim();
    
    // URL optimization
    if (optimized.startsWith('http://')) {
      return optimized.replace('http://', 'https://');
    }
    
    // Clean up extra spaces
    return optimized.replace(/\s+/g, ' ');
  };

  const extractWiFiDetails = (input: string) => {
    const text = input.toLowerCase();
    
    // Enhanced pattern matching for WiFi details
    const patterns = [
      // "network name password"
      /(?:network|wifi|ssid)?\s*(?:is|name)?\s*["']?([^\s"']+)["']?\s+(?:password|pass|pwd)?\s*(?:is)?\s*["']?([^\s"']+)["']?/i,
      // "name: X password: Y" format
      /(?:name|ssid)[:\s]+["']?([^"'\n,]+)["']?[,\s]*(?:password|pass)[:\s]+["']?([^"'\n]+)["']?/i,
      // Simple format
      /^([a-zA-Z0-9_-]+)\s+([a-zA-Z0-9@#$%^&*!_-]+)$/
    ];
    
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match && match[1] && match[2]) {
        return { 
          ssid: match[1].trim(), 
          password: match[2].trim() 
        };
      }
    }
    
    return null;
  };

  const extractContactDetails = (input: string) => {
    const emailPattern = /[\w\.-]+@[\w\.-]+\.\w+/;
    const phonePattern = /[\+]?[\s\-\(\)]?[\d\s\-\(\)]{10,}/;
    
    const email = input.match(emailPattern)?.[0];
    const phone = input.match(phonePattern)?.[0]?.replace(/[\s\-\(\)]/g, '');
    
    // Extract name (capitalized words)
    let name = '';
    const words = input.split(/\s+/);
    for (const word of words) {
      if (word.match(/^[A-Z][a-z]+$/) && !word.match(emailPattern) && !word.match(/\d/)) {
        name += (name ? ' ' : '') + word;
      }
    }
    
    if (name || email || phone) {
      return { name, email, phone };
    }
    
    return null;
  };

  const detectContentType = (input: string) => {
    const text = input.toLowerCase();
    
    // Enhanced content type detection
    if (text.includes('wifi') || text.includes('network') || text.includes('password') || text.includes('ssid')) return 'wifi';
    if (text.match(/https?:\/\//) || text.includes('www.') || text.match(/\w+\.(com|org|net|edu|gov)/)) return 'url';
    if (text.includes('contact') || text.includes('business') || text.includes('phone') || text.includes('@') || text.includes('vcard')) return 'contact';
    if (text.includes('event') || text.includes('wedding') || text.includes('party') || text.includes('meeting')) return 'event';
    if (text.includes('email') && text.includes('@')) return 'email';
    if (text.includes('instagram') || text.includes('facebook') || text.includes('linkedin') || text.includes('twitter')) return 'social';
    
    return 'general';
  };

  const generateContextualResponse = async (userInput: string, contentType: string) => {
    try {
      switch (contentType) {
        case 'wifi':
          const wifiDetails = extractWiFiDetails(userInput);
          if (wifiDetails) {
            const content = `WIFI:T:WPA;S:${wifiDetails.ssid};P:${wifiDetails.password};;`;
            const qrCodeDataURL = await generateQRCodeImage(content);
            
            return {
              content: `🎉 Perfect! I've created a WiFi QR code for **"${wifiDetails.ssid}"**\n\nWhen someone scans this code:\n✅ Automatic connection to your network\n✅ No manual password entry needed\n✅ Works on iOS and Android\n\n💡 **Pro tip:** Print this and place it where guests can easily see it!`,
              type: 'success' as const,
              generatedContent: content,
              qrCodeDataURL
            };
          }
          
          return {
            content: "I'll help you create a WiFi QR code! 📶\n\nPlease provide your network details in one of these formats:\n\n**Option 1:** `NetworkName MyPassword123`\n**Option 2:** `Network: CafeWiFi Password: coffee2024`\n**Option 3:** Just tell me naturally like *\"My network is HomeWiFi with password abc123\"*",
            type: 'text' as const,
            suggestions: ["HomeWiFi mypassword123", "Network: CafeWiFi Password: welcome123"]
          };

        case 'url':
          const urlMatch = userInput.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/);
          if (urlMatch) {
            let url = urlMatch[0];
            if (!url.startsWith('http')) {
              url = 'https://' + url.replace(/^www\./, '');
            }
            const optimizedUrl = validateAndOptimizeContent(url);
            const qrCodeDataURL = await generateQRCodeImage(optimizedUrl);
            
            return {
              content: `🌐 Excellent! Your website QR code is ready!\n\n**URL:** ${optimizedUrl}\n\n✅ **Quick access** - One scan takes users directly to your site\n✅ **Mobile optimized** - Perfect for print and digital use\n✅ **Professional** - Great for business cards and marketing\n\n💡 **Tip:** Test the link on mobile first to ensure fast loading!`,
              type: 'success' as const,
              generatedContent: optimizedUrl,
              qrCodeDataURL
            };
          }
          return {
            content: "I'll create a website QR code for you! 🌐\n\nJust share the URL:\n• `mywebsite.com`\n• `https://example.com`\n• `www.mysite.org`\n\nI'll automatically optimize it for the best QR code format!",
            type: 'text' as const,
            suggestions: ["https://mywebsite.com", "mycompany.com"]
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
              content: `📇 Your professional contact QR code is ready!\n\n**Contact Information:**\n${contactDetails.name ? `👤 **Name:** ${contactDetails.name}\n` : ''}${contactDetails.phone ? `📞 **Phone:** ${contactDetails.phone}\n` : ''}${contactDetails.email ? `📧 **Email:** ${contactDetails.email}\n` : ''}\n✅ **Auto-save** - Scanning adds contact directly to phone\n✅ **Professional** - Perfect for networking and business cards\n✅ **Universal** - Works on all smartphones\n\n💡 **Perfect for:** Business cards, email signatures, networking events!`,
              type: 'success' as const,
              generatedContent: vcard,
              qrCodeDataURL
            };
          }
          
          return {
            content: "I'll create a professional contact QR code! 📇\n\nShare your contact information:\n• **Name, phone, email together:** `John Doe 555-123-4567 john@company.com`\n• **Or naturally:** `My name is Sarah Smith, phone 555-999-8888, email sarah@email.com`\n\nI'll format it perfectly for easy contact saving!",
            type: 'text' as const,
            suggestions: ["John Smith 555-123-4567 john@company.com", "Add my business contact info"]
          };

        default:
          // Direct content QR code
          if (userInput.trim().length > 0) {
            const content = validateAndOptimizeContent(userInput);
            const qrCodeDataURL = await generateQRCodeImage(content);
            
            return {
              content: `✨ Your custom QR code is ready!\n\n**Content:** ${content}\n\n✅ **Instant access** - Scanning shows your exact message\n✅ **Versatile** - Perfect for any text, messages, or data\n✅ **Reliable** - High-quality QR code generation\n\n💡 **Great for:** Custom messages, instructions, codes, or any text content!`,
              type: 'success' as const,
              generatedContent: content,
              qrCodeDataURL
            };
          }
          
          return {
            content: "I'm here to help you create the perfect QR code! ✨\n\n**Popular options:**\n📶 **WiFi codes** - `\"Create WiFi QR for MyNetwork password123\"`\n🌐 **Website links** - `\"Make QR for mywebsite.com\"`\n📇 **Contact cards** - `\"Business card for John Doe 555-123-4567 john@email.com\"`\n📱 **Social profiles** - `\"QR code for my Instagram @username\"`\n💬 **Custom text** - Any message or text you want\n\n**What would you like to create?**",
            type: 'text' as const,
            suggestions: ["Create WiFi QR code", "Make website QR", "Generate contact card", "Custom message QR"]
          };
      }
    } catch (error) {
      return {
        content: "I encountered an issue generating your QR code. Let me try a different approach - could you rephrase your request or provide the information in a simpler format?",
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
      title: "QR Code Downloaded! 🎉",
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
              description: "Alexander has added your content to the generator above!",
            });
          }
        } catch (error) {
          setIsTyping(false);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I apologize, but I'm having trouble processing your request right now. Could you try rephrasing it or break it down into simpler steps?",
            timestamp: new Date(),
            type: 'error' as const
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }, 1000 + Math.random() * 500);
    } catch (error) {
      setIsTyping(false);
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
      default: return <Sparkles className="w-4 h-4 text-white" />;
    }
  };

  const getMessageBorderColor = (type?: string) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/5';
      case 'error': return 'border-red-500/30 bg-red-500/5';
      default: return 'border-gray-700/50';
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold h-14 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
      >
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="font-bold">Ask Alexander</div>
          <div className="text-xs opacity-90">AI QR Assistant</div>
        </div>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your intelligent QR assistant</p>
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
                  
                  {/* Suggestions */}
                  {message.metadata?.suggestions && message.role === 'assistant' && (
                    <div className="ml-14 mt-3 flex flex-wrap gap-2">
                      {message.metadata.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-sm px-4 py-2 bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-gray-700/80 dark:to-gray-600/80 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50"
                        >
                          {suggestion}
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
                  placeholder="Describe what QR code you need..."
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
                Alexander can create WiFi, website, contact, and custom QR codes • Press Enter to send
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
