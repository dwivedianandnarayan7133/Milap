import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppLogo } from './AppLogo';
import { Palette, FolderKanban, Plus, Menu, X, Sparkles, Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/templates', label: 'Template Gallery', icon: Palette },
    { to: '/dashboard', label: 'My Projects', icon: FolderKanban },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with App Logo */}
        <Link to="/" className="group flex items-center">
          <AppLogo size="sm" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-700">
          <a
            href="http://localhost:5173"
            className="text-stone-600 hover:text-royal-maroon flex items-center gap-1 py-1 px-2 rounded-md hover:bg-amber-50 transition-colors font-semibold"
          >
            ← Milap Home
          </a>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors flex items-center gap-1.5 py-1 px-2 rounded-md ${
                  isActive
                    ? 'text-royal-maroon font-bold bg-amber-50/80'
                    : 'hover:text-royal-maroon hover:bg-stone-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-royal-gold" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/editor"
            className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark hover:opacity-95 text-white rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-royal-gold" />
            <span className="hidden xs:inline sm:inline">Create Invitation</span>
            <span className="xs:hidden sm:hidden">Create</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-lg text-stone-600 hover:text-royal-maroon hover:bg-stone-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-amber-200/80 shadow-lg px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <a
              href="http://localhost:5173"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-royal-maroon bg-amber-50/60 border border-amber-200"
            >
              <span>← Back to Milap Weddings</span>
            </a>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-amber-50 text-royal-maroon font-bold border border-amber-200'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-royal-gold" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              to="/editor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-royal-maroon hover:bg-amber-50"
            >
              <Sparkles className="w-4 h-4 text-royal-gold" />
              <span>Launch Studio Editor</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-royal-gold" />
              30+ Regional Indic Languages
            </span>
            <span className="font-mono text-royal-maroon font-bold text-[10px]">300 DPI Ready</span>
          </div>
        </div>
      )}
    </header>
  );
};
