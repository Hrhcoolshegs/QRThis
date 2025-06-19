
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/40 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                QRThis
              </h1>
              <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full font-semibold">
                AI
              </span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
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
              <Link 
                to="/faq" 
                className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-blue-400 ${
                  isActive('/faq') ? 'text-indigo-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                FAQ
              </Link>
            </nav>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700/40">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className={`text-base font-medium transition-colors hover:text-indigo-600 dark:hover:text-blue-400 ${
                  isActive('/') ? 'text-indigo-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Generator
              </Link>
              <Link 
                to="/features" 
                onClick={closeMobileMenu}
                className={`text-base font-medium transition-colors hover:text-indigo-600 dark:hover:text-blue-400 ${
                  isActive('/features') ? 'text-indigo-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                onClick={closeMobileMenu}
                className={`text-base font-medium transition-colors hover:text-indigo-600 dark:hover:text-blue-400 ${
                  isActive('/pricing') ? 'text-indigo-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Pricing
              </Link>
              <Link 
                to="/faq" 
                onClick={closeMobileMenu}
                className={`text-base font-medium transition-colors hover:text-indigo-600 dark:hover:text-blue-400 ${
                  isActive('/faq') ? 'text-indigo-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                FAQ
              </Link>
              <Link 
                to="/about" 
                onClick={closeMobileMenu}
                className={`text-base font-medium transition-colors hover:text-indigo-600 dark:hover:text-blue-400 ${
                  isActive('/about') ? 'text-indigo-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
