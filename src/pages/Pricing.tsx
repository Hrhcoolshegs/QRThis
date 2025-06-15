
import React, { useState } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Star, Sparkles, Zap, Crown } from 'lucide-react';

function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, annual: 0 },
      features: [
        'Basic QR code generation',
        'Up to 10 QR codes per month',
        'Standard formats (URL, Text, WiFi)',
        'Basic customization',
        'Download as PNG',
        'Community support'
      ],
      limitations: [
        'Watermarked AI previews',
        'Limited customization',
        'No commercial usage'
      ],
      cta: 'Get Started Free',
      popular: false,
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: 'Pro',
      description: 'For creators and professionals',
      price: { monthly: 7, annual: 70 },
      savings: '17% off',
      features: [
        'Everything in Free',
        'Unlimited QR codes',
        'AI Art QR generation',
        'Advanced customization',
        'Brand color integration',
        'High-resolution exports',
        'Bulk generation',
        'Priority support',
        'Commercial usage rights',
        'Custom art prompts',
        'Advanced error correction'
      ],
      cta: 'Start Pro Trial',
      popular: true,
      icon: <Sparkles className="w-6 h-6" />
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
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Custom art styles',
        'Bulk operations'
      ],
      cta: 'Contact Sales',
      popular: false,
      icon: <Crown className="w-6 h-6" />
    }
  ];

  const faqs = [
    {
      question: 'What makes AI Art QR codes special?',
      answer: 'Our AI Art QR codes maintain perfect scannability while transforming your codes into beautiful artwork. They\'re perfect for branding, marketing, and creating memorable experiences.'
    },
    {
      question: 'Can I use Pro features for commercial purposes?',
      answer: 'Yes! Pro and Enterprise plans include full commercial usage rights. You can use generated QR codes for any business purpose without restrictions.'
    },
    {
      question: 'How does the free trial work?',
      answer: 'Start with our free plan and upgrade anytime. Pro includes a 7-day money-back guarantee. No credit card required for the free plan.'
    },
    {
      question: 'What art styles are available?',
      answer: 'Choose from watercolor, minimalist, cyberpunk, vintage, corporate styles, or create custom prompts. Pro users get access to all styles and custom prompting.'
    },
    {
      question: 'Is there an API available?',
      answer: 'Yes! Enterprise plans include full API access for bulk generation, custom integrations, and automated workflows.'
    },
    {
      question: 'What support do you provide?',
      answer: 'Free users get community support, Pro users get priority email support, and Enterprise users get dedicated support with SLA guarantees.'
    }
  ];

  const artStyles = [
    { name: 'Watercolor', preview: '🎨', description: 'Soft, artistic watercolor effects' },
    { name: 'Minimalist', preview: '⚪', description: 'Clean, modern geometric designs' },
    { name: 'Cyberpunk', preview: '🌃', description: 'Futuristic neon and digital aesthetics' },
    { name: 'Vintage', preview: '📜', description: 'Classic retro and vintage styles' },
    { name: 'Corporate', preview: '🏢', description: 'Professional business-ready designs' },
    { name: 'Nature', preview: '🌿', description: 'Organic patterns and natural elements' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 transition-all duration-500">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Transform QR Codes
                </span>
                <br />
                <span className="text-gray-900 dark:text-white/90">into Art</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                AI-powered artistic QR codes that maintain perfect scannability while reflecting your brand and style.
              </p>
            </div>

            {/* Art Style Showcase */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto mt-12">
              {artStyles.map((style, index) => (
                <div key={index} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 text-center hover:shadow-md transition-all duration-200">
                  <div className="text-2xl mb-2">{style.preview}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{style.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{style.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Toggle */}
        <section className="py-10">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  !isAnnual 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  isAnnual 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Annual <span className="text-green-600 dark:text-green-400 text-xs ml-1">Save 17%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white dark:bg-gray-800/50 border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 ${
                plan.popular 
                  ? 'border-purple-500 dark:border-purple-400 shadow-lg scale-105' 
                  : 'border-gray-200 dark:border-gray-700/50'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {plan.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      {plan.price.monthly === 0 ? '' : isAnnual ? '/year' : '/month'}
                    </span>
                  </div>
                  
                  {isAnnual && plan.savings && (
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                      {plan.savings}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                }`}>
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Compare all features
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left p-6 text-gray-900 dark:text-white font-semibold">Features</th>
                    <th className="text-center p-6 text-gray-900 dark:text-white font-semibold">Free</th>
                    <th className="text-center p-6 text-gray-900 dark:text-white font-semibold">Pro</th>
                    <th className="text-center p-6 text-gray-900 dark:text-white font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="p-6 text-gray-900 dark:text-white">QR Codes per month</td>
                    <td className="text-center p-6 text-gray-600 dark:text-gray-400">10</td>
                    <td className="text-center p-6 text-gray-600 dark:text-gray-400">Unlimited</td>
                    <td className="text-center p-6 text-gray-600 dark:text-gray-400">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-gray-900 dark:text-white">AI Art QR Codes</td>
                    <td className="text-center p-6">❌</td>
                    <td className="text-center p-6">✅</td>
                    <td className="text-center p-6">✅</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-gray-900 dark:text-white">Custom Art Prompts</td>
                    <td className="text-center p-6">❌</td>
                    <td className="text-center p-6">✅</td>
                    <td className="text-center p-6">✅</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-gray-900 dark:text-white">Brand Color Integration</td>
                    <td className="text-center p-6">❌</td>
                    <td className="text-center p-6">✅</td>
                    <td className="text-center p-6">✅</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-gray-900 dark:text-white">Commercial Usage</td>
                    <td className="text-center p-6">❌</td>
                    <td className="text-center p-6">✅</td>
                    <td className="text-center p-6">✅</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-gray-900 dark:text-white">API Access</td>
                    <td className="text-center p-6">❌</td>
                    <td className="text-center p-6">❌</td>
                    <td className="text-center p-6">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Frequently asked questions
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Everything you need to know about QRThis pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to create stunning QR codes?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators using QRThis to transform their QR codes into art
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-xl text-lg font-semibold">
                Start Free Trial
              </Button>
              <Link to="/">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl text-lg font-semibold">
                  Try Generator
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700/40 bg-white dark:bg-black/60 mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">QRThis</span>
              <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full font-semibold">
                AI-POWERED
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <span>Contact: <a href="mailto:contactqrthis@gmail.com" className="text-indigo-600 dark:text-blue-400 hover:underline">contactqrthis@gmail.com</a></span>
              <span>•</span>
              <span>AI-powered, privacy-first, always</span>
              <span>•</span>
              <span>Made with ❤️ by <span className="text-gray-800 dark:text-white font-medium">Oluwasegun Akinshola Lawrence</span></span>
            </div>
          </div>
        </div>
      </footer>
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
