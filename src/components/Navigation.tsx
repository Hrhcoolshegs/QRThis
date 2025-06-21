
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, X, Zap, Shield, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleGeneratorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If we're on the homepage, scroll to the generator
    if (window.location.pathname === '/') {
      const generatorSection = document.getElementById('generator');
      if (generatorSection) {
        generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // If we're on another page, navigate to homepage and then scroll
      navigate('/');
      setTimeout(() => {
        const generatorSection = document.getElementById('generator');
        if (generatorSection) {
          generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '#generator', label: 'Try Generator', external: false, onClick: handleGeneratorClick, icon: Zap },
    { href: '/features', label: 'Features', external: false, icon: Shield },
    { href: '/pricing', label: 'Pricing', external: false, icon: Crown }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-white/40 dark:bg-gray-900/40 backdrop-blur-md'
    }`}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">QRThis</span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm">
                AI-POWERED
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return link.onClick ? (
                <button
                  key={link.href}
                  onClick={link.onClick}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <IconComponent className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>{link.label}</span>
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105 group"
                >
                  <IconComponent className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/pricing">
              <Button className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Get Pro
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-container p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mobile-menu-container animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-b-2xl">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return link.onClick ? (
                  <button
                    key={link.href}
                    onClick={link.onClick}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-300"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{link.label}</span>
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <div className="px-4 py-3">
                <Link
                  to="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg">
                    Get Pro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
