import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Rocket, Code, Shield, Brush, BarChart } from 'lucide-react';

function FeatureItem({
  title,
  description,
  icon,
  index
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) {
  const bgColors = [
    'bg-gradient-to-br from-blue-500 to-purple-500',
    'bg-gradient-to-br from-green-500 to-teal-500',
    'bg-gradient-to-br from-orange-500 to-red-500',
    'bg-gradient-to-br from-indigo-500 to-blue-500',
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-emerald-500 to-lime-500',
  ];

  const iconColors = [
    'text-blue-100',
    'text-green-100',
    'text-orange-100',
    'text-indigo-100',
    'text-purple-100',
    'text-emerald-100',
  ];

  const bgColor = bgColors[index % bgColors.length];
  const iconColor = iconColors[index % iconColors.length];

  return (
    <div className="flex space-x-6 p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${bgColor} ${iconColor}`}>
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeaturesContent() {
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
                  Unlock the Power
                </span>
                <br />
                <span className="text-gray-900 dark:text-white/90">of AI QR Codes</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore the advanced features that make QRThis the ultimate QR code solution.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#generator">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  Start Creating Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" className="px-8 py-4 rounded-xl text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Key Features
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the features that make QRThis stand out from the crowd.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Art QR Codes',
                description: 'Transform QR codes into stunning artwork while maintaining perfect scannability.',
                icon: <Sparkles className="w-7 h-7" />
              },
              {
                title: 'Smart Batch Processing',
                description: 'Process multiple URLs, contacts, or text items automatically with AI separation.',
                icon: <Rocket className="w-7 h-7" />
              },
              {
                title: 'Auto URL Shortening',
                description: 'Long URLs automatically optimized for better scanning performance.',
                icon: <Code className="w-7 h-7" />
              },
              {
                title: 'Context-Aware Optimization',
                description: 'AI understands your use case and optimizes QR codes accordingly.',
                icon: <Shield className="w-7 h-7" />
              },
              {
                title: 'Brand Color Intelligence',
                description: 'Extract and apply brand colors while maintaining perfect scannability.',
                icon: <Brush className="w-7 h-7" />
              },
              {
                title: 'Advanced Analytics',
                description: 'Track scans, locations, and devices for detailed insights into your QR code campaigns.',
                icon: <BarChart className="w-7 h-7" />
              }
            ].map((feature, index) => (
              <FeatureItem key={index} {...feature} index={index} />
            ))}
          </div>
        </section>

        {/* Advanced Customization */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Advanced Customization
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Tailor your QR codes to perfectly match your brand and style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Color Control',
                description: 'Customize the colors of your QR codes to match your brand palette.',
              },
              {
                title: 'Logo Integration',
                description: 'Seamlessly integrate your logo into the center of your QR codes.',
              },
              {
                title: 'Shape Modification',
                description: 'Modify the shape of the QR code modules for a unique look.',
              },
              {
                title: 'Eye Frame Design',
                description: 'Customize the design of the eye frames to make your QR codes stand out.',
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-6 p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-sm">
                  {index % 2 === 0 ? '🎨' : '🏢'}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Perfect for Every Use Case
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Explore the endless possibilities of QRThis in various scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Share WiFi passwords instantly with guests',
              'Quick URL sharing for social media campaigns',
              'Event registration and check-in links',
              'Contact information sharing at networking events',
              'Restaurant menu QR codes for contactless dining',
              'Product information and documentation links',
              'App download links for mobile applications',
              'Digital business cards and portfolios'
            ].map((useCase, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:shadow-md dark:hover:shadow-lg transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{useCase}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to unlock all features?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Explore the advanced features and take your QR code campaigns to the next level.
              </p>
              <Link to="/pricing">
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2 space-y-6">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">Q</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">QRThis</span>
                  <span className="ml-2 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full font-semibold">
                    AI-POWERED
                  </span>
                </div>
              </Link>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                The most advanced AI-powered QR code generator. Create unlimited QR codes with perfect precision and artistic flair.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:contactqrthis@gmail.com" className="hover:underline">
                    contactqrthis@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/" className="block text-gray-300 hover:text-white transition-colors">
                  QR Generator
                </Link>
                <Link to="/features" className="block text-gray-300 hover:text-white transition-colors">
                  Features
                </Link>
                <Link to="/pricing" className="block text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>AI Art QR Codes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Unlimited Generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Mobile Optimized</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>© 2024 QRThis. All rights reserved.</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">AI-powered, privacy-first, always free</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Made with ❤️ by</span>
                <a 
                  href="https://www.linkedin.com/in/oluwasegunakinsholalawrence/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white hover:text-indigo-400 transition-colors group"
                >
                  <span className="font-medium">Oluwasegun Akinshola Lawrence</span>
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
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
