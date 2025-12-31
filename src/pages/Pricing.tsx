import React, { useState } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Check, Star, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';
import { ComingSoonModal } from '@/components/ComingSoonModal';

const PLANS = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: { monthly: 0, annual: 0 },
    features: [
      'Basic QR code generation',
      'Unlimited QR codes',
      'Standard formats (URL, Text, WiFi)',
      'Basic color customization',
      'Download as PNG, JPG, SVG',
      'Community support'
    ],
    cta: 'Try Generator',
    ctaLink: '/#generator',
    popular: false,
    icon: Zap
  },
  {
    name: 'Pro',
    description: 'For creators and professionals',
    price: { monthly: 7, annual: 70 },
    savings: '17% off',
    features: [
      'Everything in Free',
      'AI Art QR generation',
      'Advanced customization',
      'Brand color integration',
      'High-resolution exports',
      'Bulk generation',
      'Priority support',
      'Commercial usage rights'
    ],
    cta: 'Start Pro Trial',
    isPremium: true,
    popular: true,
    icon: Sparkles
  },
  {
    name: 'Enterprise',
    description: 'For teams and organizations',
    price: { monthly: 25, annual: 250 },
    savings: '17% off',
    features: [
      'Everything in Pro',
      'Custom branding',
      'API access',
      'Team management',
      'White-label solution',
      'Advanced analytics',
      'Dedicated support',
      'SLA guarantee'
    ],
    cta: 'Contact Sales',
    isPremium: true,
    popular: false,
    icon: Crown
  }
];

const FAQS = [
  {
    question: 'What makes AI Art QR codes special?',
    answer: 'Our AI Art QR codes maintain perfect scannability while transforming your codes into beautiful artwork.'
  },
  {
    question: 'Can I use Pro features for commercial purposes?',
    answer: 'Yes! Pro and Enterprise plans include full commercial usage rights.'
  },
  {
    question: 'How does the free trial work?',
    answer: 'Start with our free plan and upgrade anytime. Pro includes a 7-day money-back guarantee.'
  },
  {
    question: 'Is there an API available?',
    answer: 'Yes! Enterprise plans include full API access for bulk generation and integrations.'
  }
];

function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [modalFeature, setModalFeature] = useState('');

  const handlePremiumCTA = (feature: string) => {
    setModalFeature(feature);
    setShowComingSoonModal(true);
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-500">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Star className="w-4 h-4" />
              Simple, Transparent Pricing
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Transform QR Codes
              </span>
              <br />
              <span className="text-foreground">into Art</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI-powered artistic QR codes that maintain perfect scannability while reflecting your brand.
            </p>
          </div>
        </section>

        {/* Pricing Toggle */}
        <section className="py-6">
          <div className="flex justify-center mb-8">
            <div className="bg-muted p-1.5 rounded-xl inline-flex">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  !isAnnual 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isAnnual 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Annual <span className="text-success text-xs ml-1">Save 17%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PLANS.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <Card 
                  key={index} 
                  className={`relative transition-all duration-300 hover:shadow-xl ${
                    plan.popular 
                      ? 'border-primary shadow-lg scale-105 z-10' 
                      : 'border-border hover:-translate-y-1'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                        <Star className="w-3.5 h-3.5" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                    
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        {plan.price.monthly === 0 ? '' : isAnnual ? '/year' : '/month'}
                      </span>
                    </div>
                    
                    {isAnnual && plan.savings && (
                      <div className="text-success text-sm font-medium mt-1">{plan.savings}</div>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.isPremium ? (
                      <Button 
                        onClick={() => handlePremiumCTA(plan.cta)}
                        className={`w-full rounded-xl font-semibold ${
                          plan.popular ? '' : 'variant-secondary'
                        }`}
                        variant={plan.popular ? 'default' : 'secondary'}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Link to={plan.ctaLink || '/'}>
                        <Button variant="outline" className="w-full rounded-xl font-semibold">
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {FAQS.map((faq, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <Card className="bg-gradient-to-r from-accent via-primary to-accent text-primary-foreground overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/90 via-primary/90 to-accent/90"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to create stunning QR codes?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of creators using QRThis
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => handlePremiumCTA('Pro Trial')}
                    size="lg"
                    variant="secondary"
                    className="rounded-xl font-semibold"
                  >
                    Start Pro Trial
                  </Button>
                  <Link to="/#generator">
                    <Button 
                      size="lg"
                      variant="outline" 
                      className="rounded-xl font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      Try Generator
                    </Button>
                  </Link>
                </div>
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

      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        feature={modalFeature}
      />
    </div>
  );
}

const Pricing = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="qrthis-theme">
      <PricingContent />
    </ThemeProvider>
  );
};

export default Pricing;
