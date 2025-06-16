import React, { useState } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ComingSoonModal } from '@/components/ComingSoonModal';
import { Sparkles, Zap, Shield, Smartphone, Palette, Download, Share, Globe, Users, BarChart, Settings, ChevronDown, ChevronUp } from 'lucide-react';

function FeaturesContent() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Generation',
      description: 'Create QR codes instantly with our AI-powered optimization engine.',
      details: ['Real-time generation', 'Smart content detection', 'Auto-optimization', 'Bulk processing'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy First',
      description: 'Your data never leaves your browser. Complete privacy and security guaranteed.',
      details: ['Client-side processing', 'No data collection', 'Secure generation', 'GDPR compliant'],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile Optimized',
      description: 'Perfect scanning experience across all devices and QR readers.',
      details: ['Cross-platform compatibility', 'Optimized sizing', 'Error correction', 'High contrast'],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Smart URL Optimization',
      description: 'Automatically optimize long URLs for better QR code performance.',
      details: ['URL shortening', 'Smart compression', 'Analytics tracking', 'Custom domains'],
      gradient: 'from-teal-500 to-blue-500'
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: 'Multiple Formats',
      description: 'Download your QR codes in various formats and resolutions.',
      details: ['PNG, JPG, SVG formats', 'High resolution options', 'Print-ready quality', 'Transparent backgrounds'],
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Advanced Customization',
      description: 'Customize colors, sizes, and error correction levels.',
      details: ['Custom colors', 'Size optimization', 'Error correction levels', 'Brand integration'],
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const premiumFeatures = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI Art QR Codes',
      description: 'Transform your QR codes into stunning works of art while maintaining perfect scannability.',
      details: ['Watercolor, minimalist, cyberpunk styles', 'Custom art prompts', 'Brand color integration', 'High-resolution outputs'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Brand Integration',
      description: 'Extract and apply your brand colors while maintaining scannability.',
      details: ['Color extraction', 'Brand palette application', 'Logo integration', 'Style consistency'],
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const useCases = [
    {
      title: 'Restaurant Menus',
      description: 'Create artistic QR codes that match your restaurant\'s aesthetic while providing contactless menu access.',
      image: '🍽️',
      color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
    },
    {
      title: 'Business Cards',
      description: 'Stand out with AI-generated QR codes that reflect your personal brand and professional style.',
      image: '💼',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
    },
    {
      title: 'Event Tickets',
      description: 'Create memorable event experiences with artistic QR codes that guests want to share.',
      image: '🎫',
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700'
    },
    {
      title: 'Product Packaging',
      description: 'Enhance your product packaging with QR codes that blend seamlessly with your design.',
      image: '📦',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
    },
    {
      title: 'Marketing Campaigns',
      description: 'Create eye-catching QR codes that increase engagement and brand recognition.',
      image: '📢',
      color: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700'
    },
    {
      title: 'Art & Design',
      description: 'Integrate functional QR codes into artistic compositions and creative projects.',
      image: '🎨',
      color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700'
    }
  ];

  const faqs = [
    {
      icon: '💰',
      question: 'Is QRThis completely free to use?',
      answer: 'Yes! QRThis offers unlimited QR code generation for free. You can create as many QR codes as you need without any restrictions. We also offer premium features like AI Art QR codes for users who want advanced styling options.',
      category: 'pricing'
    },
    {
      icon: '🔐',
      question: 'How secure is my data with QRThis?',
      answer: 'Your privacy is our top priority. QRThis processes everything client-side in your browser - your data never leaves your device or gets sent to our servers. We don\'t collect, store, or track any of your QR code content.',
      category: 'privacy'
    },
    {
      icon: '📱',
      question: 'Do QR codes work on all devices and QR readers?',
      answer: 'Absolutely! Our QR codes are optimized for maximum compatibility across all devices, operating systems, and QR code readers. We use industry-standard encoding and error correction to ensure reliable scanning.',
      category: 'compatibility'
    },
    {
      icon: '⚡',
      question: 'How fast can I generate QR codes?',
      answer: 'QR codes are generated instantly as you type! Our AI-powered optimization engine processes your content in real-time, providing immediate feedback and generating high-quality QR codes within milliseconds.',
      category: 'performance'
    },
    {
      icon: '📏',
      question: 'What\'s the maximum content length for QR codes?',
      answer: 'You can encode up to 2,000 characters in a single QR code. Our AI assistant helps optimize your content for better scanning performance and suggests ways to reduce character count when needed.',
      category: 'limits'
    },
    {
      icon: '🤖',
      question: 'How does the AI assistant help with QR code creation?',
      answer: 'Our AI assistant guides you through the QR code creation process, suggests optimizations, helps with content formatting, provides use-case specific advice, and ensures your QR codes are optimized for your intended purpose.',
      category: 'ai'
    },
    {
      icon: '🎨',
      question: 'What makes AI Art QR codes special?',
      answer: 'AI Art QR codes combine functionality with aesthetics. They maintain 100% scannability while incorporating artistic elements like watercolor effects, geometric patterns, or custom brand themes. Perfect for marketing materials and creative projects.',
      category: 'features'
    },
    {
      icon: '📊',
      question: 'Can I track QR code scans and analytics?',
      answer: 'Since QRThis prioritizes privacy and processes everything locally, we don\'t provide scan tracking. However, you can use URL shortening services with analytics if you need tracking capabilities for your campaigns.',
      category: 'analytics'
    },
    {
      icon: '💼',
      question: 'Is QRThis suitable for business and commercial use?',
      answer: 'Yes! QRThis is perfect for businesses of all sizes. From restaurants and retail stores to marketing agencies and event organizers, our platform scales to meet professional needs while maintaining simplicity.',
      category: 'business'
    },
    {
      icon: '🌐',
      question: 'What types of content can I encode in QR codes?',
      answer: 'QRThis supports all standard QR code content types: URLs, WiFi credentials, contact information (vCard), plain text, email addresses, phone numbers, SMS messages, and more. Our AI assistant helps format content optimally.',
      category: 'content'
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 transition-all duration-500">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Powerful Features
                </span>
                <br />
                <span className="text-gray-900 dark:text-white/90">Built for Creators</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover the full potential of AI-powered QR code generation with advanced features designed for professionals and creators.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#generator">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold">
                  Start Creating Free
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="px-8 py-3 rounded-xl text-lg font-semibold"
                onClick={() => setShowComingSoon(true)}
              >
                View Premium Features
              </Button>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Core Features - Always Free
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create professional QR codes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Features */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Premium Features - Coming Soon
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced capabilities for creative professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="group relative cursor-pointer" onClick={() => setShowComingSoon(true)}>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700/50 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 h-full">
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      COMING SOON
                    </span>
                  </div>
                  
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Perfect for every industry
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              See how QRThis transforms businesses across different sectors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className={`p-6 rounded-2xl border ${useCase.color} hover:shadow-md transition-all duration-200`}>
                <div className="text-3xl mb-4">{useCase.image}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {useCase.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Comprehensive FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Everything you need to know about QRThis
              </p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {faq.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                    </div>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <div className="pl-16">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to create amazing QR codes?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators who trust QRThis for their QR code needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#generator">
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-xl text-lg font-semibold">
                  Start Creating Free
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl text-lg font-semibold"
                onClick={() => setShowComingSoon(true)}
              >
                View Premium Plans
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <Link to="/" className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">QRThis</span>
              <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full font-semibold">
                AI-POWERED
              </span>
            </Link>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <span>Contact: <a href="mailto:contactqrthis@gmail.com" className="text-indigo-600 dark:text-blue-400 hover:underline">contactqrthis@gmail.com</a></span>
              <span>•</span>
              <span>AI-powered, privacy-first, always</span>
              <span>•</span>
              <span>Made with ❤️ by <a href="https://www.linkedin.com/in/oluwasegunakinsholalawrence/" target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-white font-medium hover:underline">Oluwasegun Akinshola Lawrence</a></span>
            </div>
          </div>
        </div>
      </footer>

      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        feature="Premium Features"
      />
    </div>
  );
}

const Features = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="qrthis-theme">
      <FeaturesContent />
    </ThemeProvider>
  );
};

export default Features;
