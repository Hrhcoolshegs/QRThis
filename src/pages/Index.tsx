
import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { QRGeneratorNew } from '@/components/QRGeneratorNew';
import { MobileSecurityProvider } from '@/components/MobileSecurityProvider';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { Link } from 'react-router-dom';

function QRThisApp() {
  const { isMobile, viewportHeight } = useMobileOptimizations();

  const handleGeneratorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const generatorSection = document.getElementById('generator');
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <MobileSecurityProvider>
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 transition-all duration-500">
        <Navigation />

        <main className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Enhanced Hero Section */}
          <section className={`${isMobile ? 'py-12' : 'py-20'} text-center relative overflow-hidden`}>
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 relative">
              <div className="space-y-4 sm:space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-fade-in-up">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-sm font-medium text-primary">AI-Powered QR Generator</span>
                </div>
                
                {/* Main heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <span className="block text-foreground">Create Perfect</span>
                  <span className="block bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mt-2">
                    QR Codes Instantly
                  </span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Professional QR codes in seconds. No signup required. Completely free.
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">∞</div>
                    <div className="text-sm text-muted-foreground">Unlimited QR Codes</div>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">100%</div>
                    <div className="text-sm text-muted-foreground">Free Forever</div>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">0s</div>
                    <div className="text-sm text-muted-foreground">Setup Time</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main QR Generator Section */}
          <section id="generator" className={`${isMobile ? 'py-6' : 'py-12'}`}>
            <QRGeneratorNew />
          </section>
        </main>

        {/* Mobile-Optimized Footer */}
        <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 mt-12 sm:mt-20">
          <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* Brand Section - Mobile First */}
              <div className="sm:col-span-2 space-y-4 sm:space-y-6 text-center sm:text-left">
                <Link to="/" className="flex items-center justify-center sm:justify-start space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg sm:text-xl">Q</span>
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-white">QRThis</span>
                    <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-semibold">
                      AI-POWERED
                    </span>
                  </div>
                </Link>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-md mx-auto sm:mx-0">
                  Create unlimited QR codes with perfect precision and artistic flair.
                </p>
                <div className="flex justify-center sm:justify-start">
                  <div className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <a href="mailto:contactqrthis@gmail.com" className="hover:underline text-sm sm:text-base">
                      contactqrthis@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links - Mobile Optimized */}
              <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Quick Links</h3>
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={handleGeneratorClick}
                    className="block text-gray-300 hover:text-white transition-colors text-left w-full text-sm sm:text-base"
                  >
                    QR Generator
                  </button>
                  <Link to="/features" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                    Features
                  </Link>
                  <Link to="/pricing" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                    Pricing
                  </Link>
                </div>
              </div>

              {/* Features - Mobile Optimized */}
              <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Features</h3>
                <div className="space-y-2 sm:space-y-3 text-gray-300">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span className="text-sm sm:text-base">AI Art QR Codes</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm sm:text-base">Unlimited Generation</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm sm:text-base">Privacy First</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-sm sm:text-base">Mobile Optimized</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Mobile First */}
            <div className="border-t border-gray-800 pt-6 sm:pt-8">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400">
                  <span>© 2024 QRThis. All rights reserved.</span>
                  <span className="hidden sm:inline">•</span>
                  <span>AI-powered, privacy-first, always free</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-gray-400 text-xs sm:text-sm">Made with ❤️ by</span>
                  <a 
                    href="https://www.linkedin.com/in/oluwasegunakinsholalawrence/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-white hover:text-indigo-400 transition-colors group text-sm sm:text-base"
                  >
                    <span className="font-medium">Oluwasegun Akinshola Lawrence</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MobileSecurityProvider>
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
