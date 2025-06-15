
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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
      content: "Hi! I'm your QR code AI assistant. I can help you create the perfect QR code for any use case. What would you like to create today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Auto-fill content if AI generated it
      if (aiResponse.generatedContent) {
        onContentGenerated(aiResponse.generatedContent);
      }
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    // WiFi QR Code
    if (input.includes('wifi') || input.includes('network') || input.includes('password')) {
      if (input.includes('name') && input.includes('password')) {
        const wifiMatch = input.match(/name[:\s]*['"]?([^'"]+)['"]?.*password[:\s]*['"]?([^'"]+)['"]?/);
        if (wifiMatch) {
          const ssid = wifiMatch[1].trim();
          const password = wifiMatch[2].trim();
          return {
            content: `Perfect! I'll create a WiFi QR code for "${ssid}". When scanned, devices will automatically connect to your network.\n\n💡 Tip: Print this and place it where guests can easily see it!`,
            generatedContent: `WIFI:T:WPA;S:${ssid};P:${password};;`
          };
        }
      }
      return {
        content: "I'll help you create a WiFi QR code! I need:\n• Network name (SSID)\n• Password\n• Security type (usually WPA/WPA2)\n\nPlease tell me your network name and password, like: 'Network name is Cafe_Main and password is coffee123'",
        generatedContent: null
      };
    }

    // URL/Website
    if (input.includes('http') || input.includes('www') || input.includes('website') || input.includes('link')) {
      const urlMatch = input.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
      if (urlMatch) {
        let url = urlMatch[0];
        if (!url.startsWith('http')) {
          url = 'https://' + url;
        }
        return {
          content: `Great! I'll create a QR code for ${url}. This will open the website directly when scanned.\n\n💡 Tip: Test the link first to make sure it works correctly!`,
          generatedContent: url
        };
      }
      return {
        content: "I'll help you create a website QR code! Please share the URL you'd like to use. I can also help optimize long URLs for better scanning.",
        generatedContent: null
      };
    }

    // Contact/Business
    if (input.includes('contact') || input.includes('business') || input.includes('phone') || input.includes('email')) {
      return {
        content: "I'll help create a contact QR code! What information should be included?\n• Name\n• Phone number\n• Email address\n• Company/Title\n• Website\n\nI can format this as a vCard for easy contact saving.",
        generatedContent: null
      };
    }

    // Event
    if (input.includes('event') || input.includes('wedding') || input.includes('party') || input.includes('meeting')) {
      return {
        content: "Exciting! For events, I can help create QR codes for:\n• Event website with details\n• RSVP form\n• Calendar invite\n• Location/directions\n• Photo sharing\n\nWhat's most important for your event?",
        generatedContent: null
      };
    }

    // Social Media
    if (input.includes('instagram') || input.includes('facebook') || input.includes('twitter') || input.includes('social')) {
      return {
        content: "Perfect for social media! I can create QR codes for:\n• Instagram profile\n• Facebook page\n• Twitter/X profile\n• LinkedIn\n• TikTok\n• Or all profiles in one link\n\nWhich platform would you like to start with?",
        generatedContent: null
      };
    }

    // General help
    return {
      content: "I can help you create QR codes for:\n• 📶 WiFi networks\n• 🌐 Websites & URLs\n• 📞 Contact information\n• 📅 Events & calendars\n• 📱 Social media profiles\n• 📧 Email addresses\n• 💬 Text messages\n\nWhat would you like to create?",
      generatedContent: null
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
        Ask AI Assistant
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
                  <h3 className="font-semibold text-white">QR Assistant</h3>
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
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-100 border border-gray-700'
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
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
