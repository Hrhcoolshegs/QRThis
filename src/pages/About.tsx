
import React from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, Globe, Heart, Zap, Shield, Users } from 'lucide-react';

function AboutContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 transition-all duration-500">
      <Navigation />
      
      <main className="container max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              About QRThis
            </span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Born from a simple need: creating QR codes should be instant, intelligent, and always free.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              QRThis was created to solve a fundamental problem: existing QR code generators were either 
              limited, expensive, or cluttered with ads. We believed everyone deserved access to unlimited, 
              high-quality QR code generation without barriers.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              By combining artificial intelligence with intuitive design, we've created a platform that 
              not only generates QR codes but optimizes them for better performance and provides intelligent 
              guidance through Alexander, our AI assistant.
            </p>
          </div>
          <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Free Forever</h3>
                  <p className="text-gray-600 dark:text-gray-300">Unlimited QR codes, always free</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI-Powered</h3>
                  <p className="text-gray-600 dark:text-gray-300">Smart optimization and guidance</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy First</h3>
                  <p className="text-gray-600 dark:text-gray-300">Your data stays yours</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Meet the Creator</h2>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Oluwasegun Akinshola Lawrence
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Full-Stack Developer & AI Enthusiast
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Passionate about creating tools that solve real problems. QRThis represents the belief 
                that powerful technology should be accessible to everyone, not hidden behind paywalls 
                or cluttered interfaces.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://www.linkedin.com/in/oluwasegunakinsholalawrence/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="mailto:contactqrthis@gmail.com"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technology Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Built with Modern Technology</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "React & TypeScript",
                description: "Modern, type-safe frontend development for reliability and performance."
              },
              {
                title: "AI Integration",
                description: "Smart optimization algorithms and Alexander AI assistant for enhanced user experience."
              },
              {
                title: "Privacy-First Architecture",
                description: "End-to-end encryption and minimal data retention to protect your information."
              },
              {
                title: "Progressive Web App",
                description: "Works offline and installs like a native app on any device."
              },
              {
                title: "Real-time Processing",
                description: "Instant QR code generation and optimization without delays."
              },
              {
                title: "Responsive Design",
                description: "Perfect experience across desktop, tablet, and mobile devices."
              }
            ].map((tech, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  {tech.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {tech.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Get in Touch
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Questions, feedback, or just want to say hello? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <a href="mailto:contactqrthis@gmail.com" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>contactqrthis@gmail.com</span>
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href="https://www.linkedin.com/in/oluwasegunakinsholalawrence/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>Connect on LinkedIn</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

const About = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="qrthis-theme">
      <AboutContent />
    </ThemeProvider>
  );
};

export default About;
