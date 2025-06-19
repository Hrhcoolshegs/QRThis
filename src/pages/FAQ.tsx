
import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageSquare, CreditCard, Settings, Zap } from 'lucide-react';

const faqData = [
  {
    category: "QR Code Generation",
    icon: MessageSquare,
    questions: [
      {
        q: "What types of QR codes can I create?",
        a: "You can create QR codes for URLs, text, WiFi credentials, contact information (vCard), phone numbers, and email addresses. Our AI automatically optimizes each type for the best scanning experience."
      },
      {
        q: "Is there a limit to how many QR codes I can generate?",
        a: "No! QRThis offers unlimited QR code generation for free. Create as many QR codes as you need without any restrictions."
      },
      {
        q: "What's the maximum text length for QR codes?",
        a: "QR codes can handle up to 2,000 characters, though shorter content scans more reliably. Our AI optimization helps you stay within optimal limits while preserving your message."
      },
      {
        q: "Can I customize the appearance of my QR codes?",
        a: "Yes! You can customize colors, add logos, and even create AI-generated artistic QR codes with our premium features."
      }
    ]
  },
  {
    category: "Batch Processing",
    icon: Zap,
    questions: [
      {
        q: "How does batch processing work?",
        a: "Upload a list of URLs, text, or contact information, and our AI will automatically separate and generate individual QR codes for each item. Perfect for events, marketing campaigns, or bulk operations."
      },
      {
        q: "What file formats are supported for batch processing?",
        a: "We support CSV, TXT, and JSON files. You can also paste multiple items directly into our batch processor."
      },
      {
        q: "Is there a limit to batch processing?",
        a: "Free users can process up to 50 items at once. Premium users enjoy unlimited batch processing capabilities."
      }
    ]
  },
  {
    category: "Alexander AI Assistant",
    icon: HelpCircle,
    questions: [
      {
        q: "What can Alexander help me with?",
        a: "Alexander is our AI assistant who can help optimize your QR codes, suggest content improvements, answer questions about QR code best practices, and guide you through our features."
      },
      {
        q: "Is Alexander available on all pages?",
        a: "Yes! Alexander is your sticky companion throughout QRThis, always ready to help with contextual assistance and smart suggestions."
      },
      {
        q: "Does Alexander learn from my usage?",
        a: "Alexander provides personalized tips based on your QR code patterns while respecting your privacy. All learning happens locally and securely."
      }
    ]
  },
  {
    category: "Subscriptions & Billing",
    icon: CreditCard,
    questions: [
      {
        q: "What's included in the free version?",
        a: "Unlimited basic QR code generation, batch processing up to 50 items, AI optimization, and access to Alexander AI assistant."
      },
      {
        q: "What premium features are available?",
        a: "Premium includes AI Art QR codes, unlimited batch processing, custom branding, advanced analytics, priority support, and API access."
      },
      {
        q: "Can I cancel my subscription anytime?",
        a: "Yes, you can cancel your subscription at any time. You'll retain access to premium features until the end of your billing period."
      }
    ]
  },
  {
    category: "Technical Support",
    icon: Settings,
    questions: [
      {
        q: "My QR code won't scan properly. What should I do?",
        a: "Ensure good contrast between colors, adequate size (at least 2cm x 2cm when printed), and avoid damage to the code. Our AI optimization helps prevent scanning issues."
      },
      {
        q: "Can I use QRThis offline?",
        a: "QRThis works offline for basic QR generation once loaded. AI features and batch processing require an internet connection."
      },
      {
        q: "Is my data secure?",
        a: "Yes! We use end-to-end encryption, don't store your QR code content permanently, and follow strict privacy practices. Your data is yours."
      }
    ]
  }
];

function FAQContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 transition-all duration-500">
      <Navigation />
      
      <main className="container max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about QRThis, from basic usage to advanced features. 
            Can't find what you're looking for? Ask Alexander!
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <Card key={categoryIndex} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, index) => (
                      <AccordionItem key={index} value={`${categoryIndex}-${index}`}>
                        <AccordionTrigger className="text-left text-lg font-medium">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Still need help section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Still need help?
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Alexander, our AI assistant, is always ready to help with personalized support and guidance.
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Look for the Alexander icon in the bottom-right corner of any page!
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

const FAQ = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="qrthis-theme">
      <FAQContent />
    </ThemeProvider>
  );
};

export default FAQ;
