
import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { QRGenerator } from '@/components/QRGenerator';

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
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Type Anything. Get your QR Codes with AI precision
              </p>
            </div>
          </div>
        </section>

        {/* Main QR Generator Section */}
        <section id="generator" className="py-8 pb-20">
          <QRGenerator />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400">© 2024 QRThis. Create unlimited QR codes with AI precision.</p>
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
