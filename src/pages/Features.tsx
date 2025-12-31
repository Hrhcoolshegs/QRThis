import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, Rocket, Code, Shield, Brush, BarChart, 
  Zap, Palette, Download, QrCode, Layers, Lock,
  ArrowRight, CheckCircle
} from 'lucide-react';

const FEATURES = [
  {
    title: 'AI Art QR Codes',
    description: 'Transform QR codes into stunning artwork while maintaining perfect scannability.',
    icon: Sparkles,
    gradient: 'from-primary to-accent'
  },
  {
    title: 'Smart Batch Processing',
    description: 'Process multiple URLs, contacts, or text items automatically with AI separation.',
    icon: Rocket,
    gradient: 'from-success to-success/70'
  },
  {
    title: 'Auto URL Shortening',
    description: 'Long URLs automatically optimized for better scanning performance.',
    icon: Code,
    gradient: 'from-warning to-warning/70'
  },
  {
    title: 'Context-Aware Optimization',
    description: 'AI understands your use case and optimizes QR codes accordingly.',
    icon: Shield,
    gradient: 'from-accent to-primary'
  },
  {
    title: 'Brand Color Intelligence',
    description: 'Extract and apply brand colors while maintaining perfect scannability.',
    icon: Brush,
    gradient: 'from-primary/80 to-accent/80'
  },
  {
    title: 'Advanced Analytics',
    description: 'Track scans, locations, and devices for detailed insights.',
    icon: BarChart,
    gradient: 'from-success/80 to-success'
  }
];

const CUSTOMIZATION_FEATURES = [
  { title: 'Color Control', description: 'Customize foreground and background colors', icon: Palette },
  { title: 'Multiple Formats', description: 'Download as PNG, JPG, or SVG', icon: Download },
  { title: 'Size Presets', description: 'From social media to print-ready sizes', icon: Layers },
  { title: 'Error Correction', description: 'Smart error correction for reliability', icon: Lock },
];

const USE_CASES = [
  'Share WiFi passwords instantly with guests',
  'Quick URL sharing for social media campaigns',
  'Event registration and check-in links',
  'Contact information sharing at networking events',
  'Restaurant menu QR codes for contactless dining',
  'Product information and documentation links',
  'App download links for mobile applications',
  'Digital business cards and portfolios'
];

function FeaturesContent() {
  return (
    <div className="min-h-screen bg-background transition-all duration-500">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              AI-Powered Features
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Unlock the Power
              </span>
              <br />
              <span className="text-foreground">of AI QR Codes</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore the advanced features that make QRThis the ultimate QR code solution for creators and businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#generator">
                <Button size="lg" className="rounded-xl px-8 font-semibold">
                  Start Creating Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="rounded-xl px-8 font-semibold">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Key Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the features that make QRThis stand out from the crowd.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Advanced Customization */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Advanced Customization
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tailor your QR codes to perfectly match your brand and style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUSTOMIZATION_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-border">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Perfect for Every Use Case
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the endless possibilities of QRThis in various scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {USE_CASES.map((useCase, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-foreground">{useCase}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <Card className="bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-accent/90 to-primary/90"></div>
              <div className="relative z-10">
                <QrCode className="w-12 h-12 mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to unlock all features?
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Explore the advanced features and take your QR code campaigns to the next level.
                </p>
                <Link to="/pricing">
                  <Button size="lg" variant="secondary" className="rounded-xl px-8 font-semibold">
                    View Pricing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 space-y-6">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-xl">Q</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-foreground">QRThis</span>
                  <span className="ml-2 text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground px-2 py-1 rounded-full font-semibold">
                    AI-POWERED
                  </span>
                </div>
              </Link>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                The most advanced AI-powered QR code generator. Create unlimited QR codes with perfect precision.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/" className="block text-muted-foreground hover:text-foreground transition-colors">QR Generator</Link>
                <Link to="/features" className="block text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                <Link to="/pricing" className="block text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Contact</h3>
              <a href="mailto:contactqrthis@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                contactqrthis@gmail.com
              </a>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>© 2024 QRThis. All rights reserved.</p>
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
