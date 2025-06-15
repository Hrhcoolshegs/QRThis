
import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QRGenerator } from '@/components/QRGenerator';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: '⚡',
    title: 'Instant Generation',
    description: 'No waiting, no processing delays'
  },
  {
    icon: '📱',
    title: 'Mobile Optimized',
    description: 'Perfect on phones and tablets'
  },
  {
    icon: '🚫',
    title: 'No Signup Required',
    description: 'Start using immediately'
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'No tracking, no data storage'
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    description: 'Easy on the eyes, day or night'
  },
  {
    icon: '✨',
    title: 'High Quality',
    description: 'Crystal clear codes that always scan'
  }
];

const useCases = [
  'Share WiFi passwords with guests',
  'Quick URL sharing for social media',
  'Event registration links',
  'Contact information sharing',
  'Menu links for restaurants',
  'Product information codes',
  'App download links'
];

const faqs = [
  {
    question: 'Is this really free?',
    answer: 'Yes, completely free. No hidden costs, no premium features, no limits.'
  },
  {
    question: 'Do you store my data?',
    answer: 'No. Everything happens in your browser. We never see or store your information.'
  },
  {
    question: "What's the character limit?",
    answer: '2000 characters, which covers 99% of use cases.'
  },
  {
    question: 'Can I customize the QR code?',
    answer: 'Currently generates standard black-and-white codes optimized for reliability.'
  },
  {
    question: 'Does it work on mobile?',
    answer: 'Absolutely. Designed mobile-first for easy use on any device.'
  }
];

const comingSoon = [
  {
    icon: '🎨',
    title: 'Custom Colors',
    description: 'Brand your QR codes with custom colors'
  },
  {
    icon: '📊',
    title: 'Bulk Generation',
    description: 'Create multiple codes at once'
  },
  {
    icon: '🔧',
    title: 'Advanced Options',
    description: 'Error correction levels and formats'
  }
];

function QRThisApp() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">QRThis</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Generate QR Codes Instantly
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto">
              Type anything. Get your QR code. No signup, no tracking, no nonsense.
            </p>
            <p className="text-lg text-muted-foreground text-balance max-w-4xl mx-auto">
              The fastest way to create QR codes for URLs, text, WiFi passwords, contact info, or anything else. Download instantly, completely free.
            </p>
          </div>
        </section>

        {/* Main Tool Section */}
        <section className="py-8">
          <QRGenerator />
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold">Why QRThis?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-soft hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16">
          <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold">Perfect For...</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                  <span className="text-lg">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="space-y-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center">FAQ</h2>
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="shadow-soft">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16">
          <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comingSoon.map((item, index) => (
                <Card key={index} className="shadow-soft border-dashed border-2 opacity-75">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-4xl">{item.icon}</div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Contact: <span className="text-foreground">contactqrthis@gmail.com</span>
            </p>
            <p className="text-sm text-muted-foreground">
              We don't collect any data
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ by <span className="text-foreground font-medium">Oluwasegun Akinshola Lawrence</span>
            </p>
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
