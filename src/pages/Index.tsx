
import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QRGenerator } from '@/components/QRGenerator';

function QRThisApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-800 transition-colors duration-300">
      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-200/40 dark:border-gray-700/40 transition-colors duration-300">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  QRThis
                </h1>
                <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full font-semibold shadow-sm">
                  AI-POWERED
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                  AI-Powered QR Codes
                </span>
                <br />
                <span className="text-gray-800 dark:text-white/90 transition-colors">Instantly</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors">
                The world's first AI-powered QR code generator. Smart conversations, perfect codes.
              </p>
            </div>
          </div>
        </section>

        {/* Main Tool Section */}
        <section className="py-16">
          <QRGenerator />
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              Why developers & creators choose QRThis
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
              AI-powered intelligence meets instant generation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI Assistant',
                description: 'Chat with our AI to create the perfect QR code for any use case.',
                color: 'from-blue-400 to-cyan-500'
              },
              {
                icon: '⚡',
                title: 'Instant Generation',
                description: 'Generate QR codes in milliseconds with AI optimization.',
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: '📱',
                title: 'Smart Formatting',
                description: 'AI automatically formats WiFi, contacts, and URLs perfectly.',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: '🔒',
                title: 'Privacy First',
                description: 'Zero tracking. Your data never leaves your device.',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: '✨',
                title: 'Crystal Clear',
                description: 'AI-optimized codes that scan perfectly every time.',
                color: 'from-pink-400 to-rose-500'
              },
              {
                icon: '🚀',
                title: 'No Limits',
                description: 'Generate unlimited QR codes with AI guidance. Free forever.',
                color: 'from-indigo-400 to-blue-500'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl blur-lg"
                     style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
                <div className="relative bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">Perfect for every use case</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors">Ask our AI assistant how to optimize for your specific needs</p>
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
              <div key={index} className="flex items-start space-x-4 p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg leading-relaxed text-gray-700 dark:text-gray-200 transition-colors">{useCase}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">Common questions</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors">Get answers instantly</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: '💰',
                  question: 'Is it free?',
                  answer: 'Yes, completely free with AI assistance included.',
                  category: 'pricing'
                },
                {
                  icon: '🔐',
                  question: 'Is my data safe?',
                  answer: 'Everything stays in your browser. We never see your data.',
                  category: 'privacy'
                },
                {
                  icon: '📱',
                  question: 'Works on mobile?',
                  answer: 'Perfectly optimized for all devices with AI chat.',
                  category: 'compatibility'
                },
                {
                  icon: '⚡',
                  question: 'How fast is it?',
                  answer: 'QR codes generate instantly with AI optimization.',
                  category: 'performance'
                },
                {
                  icon: '📏',
                  question: 'Character limit?',
                  answer: '2000 characters - AI helps optimize content.',
                  category: 'limits'
                },
                {
                  icon: '🤖',
                  question: 'How does AI help?',
                  answer: 'Chat assistant guides you to create perfect QR codes.',
                  category: 'ai'
                }
              ].map((faq, index) => (
                <div key={index} className="group bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-600/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:from-blue-500/20 group-hover:to-purple-600/20 dark:group-hover:from-blue-500/30 dark:group-hover:to-purple-600/30 transition-all duration-300">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/40 dark:border-gray-700/40 bg-white/60 dark:bg-black/60 mt-20 backdrop-blur-sm transition-colors duration-300">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">QRThis</span>
              <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full font-semibold shadow-sm">
                AI-POWERED
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-gray-500 dark:text-gray-400 transition-colors">
              <span>Contact: <a href="mailto:contactqrthis@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">contactqrthis@gmail.com</a></span>
              <span>•</span>
              <span>AI-powered, privacy-first, always</span>
              <span>•</span>
              <span>Made with ❤️ by <span className="text-gray-700 dark:text-white font-medium transition-colors">Oluwasegun Akinshola Lawrence</span></span>
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
