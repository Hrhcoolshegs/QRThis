
import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { QRGenerator } from '@/components/QRGenerator';
import { Linkedin } from 'lucide-react';

function QRThisApp() {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 transition-all duration-500">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4">
        {/* Hero Section - Simplified */}
        <section className="py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="text-gray-900 dark:text-white/90">Create QR Codes</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Type Anything. Get your QR Codes with AI precision
              </p>
            </div>
          </div>
        </section>

        {/* Main QR Generator Section */}
        <section id="generator" className="py-8">
          <QRGenerator />
        </section>
      </main>

      {/* Enhanced Footer matching features/pricing pages */}
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <h3 className="text-xl font-bold text-white">QRThis</h3>
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">AI-POWERED</span>
              </div>
              <p className="text-gray-400 text-sm">
                The most advanced AI-powered QR code generator. Create unlimited QR codes with perfect precision and artistic flair.
              </p>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>📧</span>
                <a href="mailto:contactqrthis@gmail.com" className="hover:text-white transition-colors">
                  contactqrthis@gmail.com
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#generator" className="hover:text-white transition-colors">QR Generator</a></li>
                <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>AI Art QR Codes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Unlimited Generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Privacy First</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>Mobile Optimized</span>
                </li>
              </ul>
            </div>

            {/* Creator */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Made with ❤️ by</h4>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Oluwasegun Akinshola Lawrence</span>
                <a href="https://linkedin.com/in/oluwasegun-akinshola-lawrence" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2024 QRThis. All rights reserved.</p>
            <p>AI-powered, privacy-first, always free</p>
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
