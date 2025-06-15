
import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QRGenerator } from '@/components/QRGenerator';

function QRThisApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                QRThis
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4">
        {/* Hero Section - Completely Redesigned */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-x">
                  Generate QR Codes
                </span>
                <br />
                <span className="text-foreground/90">Instantly</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The fastest, most beautiful QR code generator. 
                <br className="hidden md:block" />
                <span className="font-semibold text-foreground">Type anything. Get your QR code. Done.</span>
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>No signup required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Privacy first</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Lightning fast</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Tool Section - Enhanced */}
        <section className="py-16">
          <QRGenerator />
        </section>

        {/* Features Grid - Redesigned */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why developers & creators choose QRThis
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for speed, designed for simplicity, trusted by thousands
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Instant Generation',
                description: 'Generate QR codes in milliseconds. No waiting, no delays.',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: '📱',
                title: 'Mobile Perfected',
                description: 'Designed mobile-first. Works flawlessly on any device.',
                color: 'from-blue-400 to-purple-500'
              },
              {
                icon: '🔒',
                title: 'Privacy First',
                description: 'Zero tracking. Your data never leaves your device.',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: '✨',
                title: 'Crystal Clear',
                description: 'High-resolution codes that scan perfectly every time.',
                color: 'from-pink-400 to-rose-500'
              },
              {
                icon: '🌙',
                title: 'Dark Mode',
                description: 'Beautiful in light or dark. Your eyes will thank you.',
                color: 'from-indigo-400 to-blue-500'
              },
              {
                icon: '🚀',
                title: 'No Limits',
                description: 'Generate unlimited QR codes. Completely free forever.',
                color: 'from-cyan-400 to-teal-500'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl blur-lg"
                     style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
                <div className="relative bg-card border border-border/50 rounded-2xl p-8 hover:border-border transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases - Modern Cards */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect for every use case</h2>
            <p className="text-lg text-muted-foreground">From personal projects to enterprise solutions</p>
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
              <div key={index} className="flex items-start space-x-4 p-6 rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-200 hover:shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg leading-relaxed">{useCase}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ - Improved Layout */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
              <p className="text-lg text-muted-foreground">Everything you need to know about QRThis</p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: 'Is QRThis really completely free?',
                  answer: 'Yes, absolutely. No hidden costs, no premium tiers, no feature limitations. Generate unlimited QR codes forever.'
                },
                {
                  question: 'Do you store or collect my data?',
                  answer: 'Never. Everything happens locally in your browser. We have zero tracking, zero analytics, zero data collection.'
                },
                {
                  question: 'What types of content can I encode?',
                  answer: 'Anything! URLs, text, WiFi credentials, contact info, social media links, or any custom content up to 2000 characters.'
                },
                {
                  question: 'How do I know my QR codes will scan reliably?',
                  answer: 'We use optimal error correction and provide real-time scan reliability indicators based on your content length and complexity.'
                },
                {
                  question: 'Can I use this on mobile devices?',
                  answer: 'Absolutely. QRThis is designed mobile-first and works perfectly on phones, tablets, and any device with a modern browser.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-card border border-border/50 rounded-2xl p-8 hover:border-border transition-all duration-200 hover:shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-primary">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Minimalist */}
      <footer className="border-t border-border/40 bg-muted/20 mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-lg font-semibold">QRThis</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-muted-foreground">
              <span>Contact: <a href="mailto:contactqrthis@gmail.com" className="text-primary hover:underline">contactqrthis@gmail.com</a></span>
              <span>•</span>
              <span>Privacy-first, always</span>
              <span>•</span>
              <span>Made with ❤️ by <span className="text-foreground font-medium">Oluwasegun Akinshola Lawrence</span></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="qrthis-theme">
      <QRThisApp />
    </ThemeProvider>
  );
};

export default Index;
