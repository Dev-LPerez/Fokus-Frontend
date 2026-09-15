'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ArrowRight,
  BrainCircuit,
  Calendar,
  Target,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FokusLogo } from '@/components/brand/FokusLogo';

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { href: '#pilares', label: 'Pilares', icon: Layers },
    { href: '#deep-work', label: 'Deep Work', icon: BrainCircuit },
    { href: '#calendar', label: 'Google Calendar', icon: Calendar },
    { href: '#eisenhower', label: 'Eisenhower', icon: Target },
    { href: '#seguridad', label: 'Seguridad', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="hover:opacity-95 transition-opacity flex-shrink-0">
          <FokusLogo size={32} showTagline={false} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-slate-900 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl hover:bg-slate-100/80 transition-all cursor-pointer min-h-[40px] flex items-center"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#0F766E] via-teal-600 to-emerald-600 hover:brightness-105 active:scale-[0.98] px-4 sm:px-5 py-2.5 rounded-2xl shadow-md shadow-teal-900/15 hover:shadow-lg hover:shadow-teal-900/25 transition-all cursor-pointer min-h-[40px]"
          >
            <span>Comenzar gratis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Header Controls: Quick CTA + Hamburger (44px touch targets) */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/register"
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0F766E] to-teal-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1 active:scale-95 transition-transform"
          >
            <span>Empezar</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
            aria-expanded={isOpen}
            className="w-11 h-11 rounded-xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 active:scale-95 transition-all cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-slate-900/20 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-2xl md:hidden z-50 p-5 space-y-5 animate-in slide-in-from-top-3 duration-200">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-3">
              Explorar Fokus
            </span>
            <div className="grid grid-cols-1 gap-1 pt-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors text-sm font-medium"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100/80 text-[#0F766E] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0F766E] via-teal-600 to-emerald-600 text-white font-semibold text-sm shadow-md shadow-teal-900/15 flex items-center justify-center gap-2 active:scale-98 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Crear cuenta gratis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/60 text-slate-800 font-semibold text-sm flex items-center justify-center active:scale-98 transition-transform"
            >
              <span>Iniciar sesión</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
