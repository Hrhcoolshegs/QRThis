
import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { QRGenerator } from '@/components/QRGenerator';
import { StickyAlexander } from '@/components/StickyAlexander';
import { BatchProcessor } from '@/components/BatchProcessor';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, Zap, Users } from 'lucide-react';

function QRThisApp() {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 transition-all duration-500">
      <Navigation />
      <StickyAlexander />

      <main className="container max-w-7xl mx-auto px-4">
        {/* Clean Hero Section */}
        <section className="py-16 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Create QR Codes
                </span>
                <br />
                <span className="text-gray-900 dark:text-white/90">Instantly</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                AI-powered QR code generation. Free forever. No limits.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
            </div>
          </div>
        </section>

        {/* Main QR Generator - Hero Position */}
        <section id="generator" className="py-8 lg:py-16">
          <QRGenerator />
        </section>

        {/* Batch Processing Section - Secondary but Accessible */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Need to process multiple items?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Upload a list and let our AI create QR codes for all your items at once. Perfect for events, campaigns, or bulk operations.
              </p>
            </div>
            
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <BatchProcessor onBatchGenerate={() => {}} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Minimal CTA Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
              <CardContent className="p-8 lg:p-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Ready to explore more features?
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  Discover AI Art QR codes, advanced customization, and premium features.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/features">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                      Explore Features
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button variant="outline" className="px-8 py-3 rounded-xl text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700/40 mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">QRThis</span>
              </Link>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered QR codes. Free forever.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/features" className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Features
                </Link>
                <Link to="/pricing" className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Pricing
                </Link>
                <Link to="/faq" className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  FAQ
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Support</h3>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About
                </Link>
                <a 
                  href="mailto:contactqrthis@gmail.com" 
                  className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-200 dark:border-gray-700/40 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 QRThis. Made with ❤️ by Oluwasegun Akinshola Lawrence
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Privacy first • Always free • AI-powered
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Index = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="qrthis-theme">
      <QRThisApp />
    </ThemeProvider>
  );
};

export default Index;
