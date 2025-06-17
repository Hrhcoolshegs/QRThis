
import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, Bell, Gift } from 'lucide-react';

interface SuccessConfettiProps {
  feature: string;
}

export function SuccessConfetti({ feature }: SuccessConfettiProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center space-y-6 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-pulse ${
                i % 4 === 0 ? 'bg-purple-500' :
                i % 4 === 1 ? 'bg-pink-500' :
                i % 4 === 2 ? 'bg-blue-500' : 'bg-yellow-500'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Success Content */}
      <div className="relative z-10">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          🎉 You're All Set!
        </h3>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          We'll notify you the moment <span className="font-semibold text-purple-600 dark:text-purple-400">{feature}</span> becomes available!
        </p>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          
          <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
            What happens next?
          </h4>
          
          <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
            <li>• You'll be the first to know when it's ready</li>
            <li>• Get exclusive early access</li>
            <li>• Special launch pricing just for you</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Keep creating amazing QR codes while you wait! 🚀
        </p>
      </div>
    </div>
  );
}
