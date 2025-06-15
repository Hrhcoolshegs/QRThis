
import React, { useState } from 'react';
import { Heart, CheckCircle } from 'lucide-react';

const upcomingFeatures = [
  {
    icon: "🤖",
    title: "Smart Batch Processing",
    description: "Paste a list of URLs or contacts and we'll automatically separate and generate multiple QR codes at once.",
    eta: "Next Month",
    interest: 89
  },
  {
    icon: "🔗", 
    title: "Auto URL Shortening",
    description: "Long URLs automatically shortened for better scanning while preserving your original links.",
    eta: "2 Weeks",
    interest: 94
  },
  {
    icon: "🎯",
    title: "Context-Aware Optimization", 
    description: "AI understands if you're creating QR codes for restaurants, events, or business cards and optimizes accordingly.",
    eta: "6 Weeks",
    interest: 76
  },
  {
    icon: "🎨",
    title: "Brand Color Intelligence",
    description: "Automatically extract and suggest brand colors from your website that maintain perfect scannability.",
    eta: "8 Weeks", 
    interest: 82
  }
];

function FeatureCard({ feature }: { feature: typeof upcomingFeatures[0] }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {feature.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
          {feature.eta}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Heart size={12} />
          <span>{feature.interest}% want this</span>
        </div>
      </div>
    </div>
  );
}

function FeatureUpdatesSignup() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = () => {
    if (email.includes('@')) {
      setSubscribed(true);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm max-w-md mx-auto">
      {!subscribed ? (
        <>
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Get notified when these features launch!</h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={handleSubscribe}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Notify Me
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">No spam, just feature updates.</p>
        </>
      ) : (
        <div className="text-center text-green-600 dark:text-green-400">
          <CheckCircle size={32} className="mx-auto mb-2" />
          <p>Thanks! We'll notify you when these features are ready.</p>
        </div>
      )}
    </div>
  );
}

export function ComingSoon() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 What's Coming Next
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We're building the future of QR code generation. Here's what's coming soon!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {upcomingFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
        
        <FeatureUpdatesSignup />
      </div>
    </section>
  );
}
