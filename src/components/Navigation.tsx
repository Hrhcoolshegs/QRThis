
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-smooth ${
      isScrolled 
        ? 'bg-card/95 backdrop-blur-xl shadow-xl border-b border-border' 
        : 'bg-card/60 backdrop-blur-md'
    }`}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary-hover to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-smooth shadow-lg">
              <span className="text-primary-foreground font-bold text-lg">Q</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">QRThis</span>
              <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm">
                AI
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
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary font-medium transition-all duration-smooth hover:scale-105 cursor-pointer group"
                >
                  <IconComponent className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>{link.label}</span>
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary font-medium transition-all duration-smooth hover:scale-105 group"
                >
                  <IconComponent className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/pricing">
              <Button className="bg-gradient-to-r from-primary via-primary-hover to-accent hover:shadow-glow text-primary-foreground shadow-lg transition-all duration-smooth hover:scale-105">
                Get Pro
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-container p-2 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all duration-smooth backdrop-blur-sm"
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

        {isMobileMenuOpen && (
          <div className="md:hidden mobile-menu-container animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl rounded-b-2xl">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return link.onClick ? (
                  <button
                    key={link.href}
                    onClick={link.onClick}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-smooth"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{link.label}</span>
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-smooth"
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
                  <Button className="w-full bg-gradient-to-r from-primary via-primary-hover to-accent text-primary-foreground shadow-lg">
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
