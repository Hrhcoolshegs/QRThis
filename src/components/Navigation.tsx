
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/40 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                QRThis
              </h1>
              <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full font-semibold">
                AI-POWERED
              </span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-blue-400 ${
                  isActive('/') ? 'text-indigo-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Generator
              </Link>
              <Link 
                to="/features" 
                className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-blue-400 ${
                  isActive('/features') ? 'text-indigo-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-blue-400 ${
                  isActive('/pricing') ? 'text-indigo-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Pricing
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
