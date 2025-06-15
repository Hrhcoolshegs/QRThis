
import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Smartphone, Palette, Download, Share, Globe, Users, BarChart, Settings } from 'lucide-react';

function FeaturesContent() {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI Art QR Codes',
      description: 'Transform your QR codes into stunning works of art while maintaining perfect scannability.',
      details: ['Watercolor, minimalist, cyberpunk styles', 'Custom art prompts', 'Brand color integration', 'High-resolution outputs'],
      isPremium: true,
      gradient: 'from-purple-500 to-pink-500'
    },
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
      icon: <Palette className="w-8 h-8" />,
      title: 'Brand Integration',
      description: 'Extract and apply your brand colors while maintaining scannability.',
      details: ['Color extraction', 'Brand palette application', 'Logo integration', 'Style consistency'],
      isPremium: true,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Smart URL Optimization',
      description: 'Automatically optimize long URLs for better QR code performance.',
      details: ['URL shortening', 'Smart compression', 'Analytics tracking', 'Custom domains'],
      gradient: 'from-teal-500 to-blue-500'
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
              <Link to="/pricing">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="px-8 py-3 rounded-xl text-lg font-semibold">
                  Try Generator
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything you need to create amazing QR codes
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              From basic QR generation to AI-powered artistic creations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 h-full">
                  {feature.isPremium && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        PRO
                      </span>
                    </div>
                  )}
                  
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
              <Link to="/pricing">
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-xl text-lg font-semibold">
                  View Pricing
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl text-lg font-semibold">
                  Start Creating
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700/40 bg-white dark:bg-black/60 mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">QRThis</span>
              <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full font-semibold">
                AI-POWERED
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <span>Contact: <a href="mailto:contactqrthis@gmail.com" className="text-indigo-600 dark:text-blue-400 hover:underline">contactqrthis@gmail.com</a></span>
              <span>•</span>
              <span>AI-powered, privacy-first, always</span>
              <span>•</span>
              <span>Made with ❤️ by <span className="text-gray-800 dark:text-white font-medium">Oluwasegun Akinshola Lawrence</span></span>
            </div>
          </div>
        </div>
      </footer>
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
