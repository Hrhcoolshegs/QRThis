
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'error' | 'success';
  metadata?: {
    contentGenerated?: string;
    suggestions?: string[];
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
      type: 'text',
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

  const detectContentType = (input: string) => {
    const text = input.toLowerCase();
    
    if (text.includes('wifi') || text.includes('network') || text.includes('password')) return 'wifi';
    if (text.includes('http') || text.includes('www') || text.includes('website')) return 'url';
    if (text.includes('contact') || text.includes('business') || text.includes('phone')) return 'contact';
    if (text.includes('event') || text.includes('wedding') || text.includes('party')) return 'event';
    if (text.includes('email') || text.includes('@')) return 'email';
    if (text.includes('instagram') || text.includes('facebook') || text.includes('social')) return 'social';
    
    return 'general';
  };

  const generateContextualResponse = (userInput: string, contentType: string) => {
    const input = userInput.toLowerCase();
    
    switch (contentType) {
      case 'wifi':
        if (input.includes('name') && input.includes('password')) {
          const wifiMatch = input.match(/(?:name|ssid)[:\s]*['"]?([^'"]+)['"]?.*(?:password|pass)[:\s]*['"]?([^'"]+)['"]?/i);
          if (wifiMatch) {
            const ssid = wifiMatch[1].trim();
            const password = wifiMatch[2].trim();
            const content = `WIFI:T:WPA;S:${ssid};P:${password};;`;
            return {
              content: `Perfect! I've created a WiFi QR code for "${ssid}". When scanned, devices will automatically connect to your network.\n\n✅ QR code generated successfully!\n\n💡 Pro tip: Test the QR code with your phone first, then print and place it where guests can easily see it.`,
              type: 'success',
              generatedContent: content
            };
          }
        }
        
        if (conversationContext.awaitingWifiDetails) {
          const parts = input.split(/\s+/);
          if (parts.length >= 2) {
            const ssid = parts[0];
            const password = parts.slice(1).join(' ');
            const content = `WIFI:T:WPA;S:${ssid};P:${password};;`;
            setConversationContext({});
            return {
              content: `Great! I've created your WiFi QR code for "${ssid}".\n\n✅ QR code generated!\n\n💡 Tip: Place this QR code in a visible location for easy guest access.`,
              type: 'success',
              generatedContent: content
            };
          }
        }
        
        setConversationContext({ awaitingWifiDetails: true });
        return {
          content: "I'll help you create a WiFi QR code! Please provide:\n\n📶 **Network name** and **password**\n\nExample: 'MyNetwork MyPassword123'\n\nOr tell me like: 'Network name is CafeWiFi and password is coffee2024'",
          type: 'text',
          suggestions: ["My network is HomeWiFi password123", "Create guest network QR"]
        };

      case 'url':
        const urlMatch = input.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/);
        if (urlMatch) {
          let url = urlMatch[0];
          if (!url.startsWith('http')) {
            url = 'https://' + url;
          }
          const optimizedUrl = validateAndOptimizeContent(url);
          return {
            content: `Excellent! I've created a QR code for your website.\n\n🌐 **URL**: ${optimizedUrl}\n\n✅ QR code generated!\n\n💡 Pro tip: Test the link on mobile first to ensure it loads quickly.`,
            type: 'success',
            generatedContent: optimizedUrl
          };
        }
        return {
          content: "I'll create a website QR code for you! 🌐\n\nPlease share the URL you'd like to use.\n\nExample: 'mywebsite.com' or 'https://example.com'",
          type: 'text',
          suggestions: ["mywebsite.com", "Create URL shortener"]
        };

      case 'contact':
        if (conversationContext.awaitingContactDetails) {
          // Simple contact format
          return {
            content: `I can create a contact QR code with that information!\n\n📞 For the best experience, I'll need:\n• Full name\n• Phone number\n• Email address\n• Company (optional)\n\nPlease provide these details and I'll format them properly.`,
            type: 'text'
          };
        }
        
        setConversationContext({ awaitingContactDetails: true });
        return {
          content: "I'll help create a professional contact QR code! 📇\n\nWhat information should be included?\n• **Name**\n• **Phone number**\n• **Email address**\n• **Company/Title** (optional)\n• **Website** (optional)\n\nI'll format this as a vCard for easy contact saving.",
          type: 'text',
          suggestions: ["John Doe, 555-123-4567, john@company.com", "Create digital business card"]
        };

      case 'event':
        return {
          content: "Perfect for events! 🎉 I can help create QR codes for:\n\n• **Event website** with details\n• **RSVP form** link\n• **Calendar invite** (ICS format)\n• **Location/directions**\n• **Photo sharing** album\n\nWhat's most important for your event? Share the details or URL you'd like to include.",
          type: 'text',
          suggestions: ["Wedding details page", "Conference registration", "Party location"]
        };

      case 'social':
        const platforms = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'];
        const detectedPlatform = platforms.find(platform => input.includes(platform));
        
        if (detectedPlatform) {
          return {
            content: `Great choice for ${detectedPlatform}! 📱\n\nPlease share your ${detectedPlatform} profile URL or username.\n\nExample: '@yourusername' or 'https://${detectedPlatform}.com/yourusername'`,
            type: 'text',
            suggestions: [`@myusername`, `Link all social profiles`]
          };
        }
        
        return {
          content: "Perfect for social media! 📱 I can create QR codes for:\n\n• **Instagram** profile\n• **Facebook** page\n• **Twitter/X** profile\n• **LinkedIn** profile\n• **TikTok** account\n• **All profiles** in one link\n\nWhich platform would you like to start with?",
          type: 'text',
          suggestions: ["Instagram profile", "All social links", "LinkedIn business"]
        };

      default:
        return {
          content: "I can help you create QR codes for:\n\n📶 **WiFi networks** - Instant connection\n🌐 **Websites & URLs** - Direct access\n📞 **Contact information** - Save to contacts\n📅 **Events & calendars** - Add to calendar\n📱 **Social media** - Follow profiles\n💬 **Custom messages** - Any text\n\nWhat would you like to create today?",
          type: 'text',
          suggestions: ["Create WiFi QR", "Add my website", "Share contact info", "Event details"]
        };
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Simulate API delay with progressive loading
      setTimeout(() => {
        const contentType = detectContentType(currentInput);
        const response = generateContextualResponse(currentInput, contentType);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
          type: response.type || 'text',
          metadata: {
            contentGenerated: response.generatedContent,
            suggestions: response.suggestions
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
      }, 800 + Math.random() * 400);
    } catch (error) {
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question.",
        timestamp: new Date(),
        type: 'error'
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
