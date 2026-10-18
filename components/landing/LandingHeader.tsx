'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FokusIcon } from '@/components/brand/FokusLogo';

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger peel-off when scrolled past 30px
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case page loaded scrolled
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-50 pointer-events-none transition-all duration-500 ease-out ${
        scrolled ? 'top-4 sm:top-5 px-4 sm:px-8' : 'top-0 px-0'
      }`}
    >
      {/* 
        Full-width top bar initially (scrolled === false) that fluidly peels off and morphs 
        into a floating liquid glass pill (scrolled === true) when scrolling down.
      */}
      <header
        className={`pointer-events-auto mx-auto transition-all duration-500 ease-out flex items-center justify-between ${
          scrolled
            ? 'max-w-[1101px] h-[72px] sm:h-[76px] px-5 sm:px-8 rounded-full bg-white/55 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/75 shadow-[0_12px_40px_-10px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]'
            : 'w-full h-[72px] sm:h-[82px] px-4 sm:px-10 rounded-none bg-white/40 backdrop-blur-xl backdrop-saturate-[180%] border-b border-white/60 shadow-xs'
        }`}
      >
        {/* Brand Logo without subtext */}
        <Link
          href="/"
          className="hover:opacity-95 transition-all duration-200 hover:scale-[1.02] flex items-center gap-2.5"
        >
          <FokusIcon size={28} />
          <span className="font-display font-black text-[22px] tracking-tight leading-none text-slate-950">
            Fokus
          </span>
        </Link>

        {/* Desktop Nav Links (Matching real page sections: Pilares, Ecosistema, Método) */}
        <nav className="hidden md:flex items-center gap-10 text-[15px] font-semibold text-slate-800">
          <a
            href="#pilares"
            className="hover:text-black hover:scale-[1.04] transition-all duration-200"
          >
            Pilares
          </a>
          <a
            href="#ecosistema"
            className="hover:text-black hover:scale-[1.04] transition-all duration-200"
          >
            Ecosistema
          </a>
          <a
            href="#metodo"
            className="hover:text-black hover:scale-[1.04] transition-all duration-200"
          >
            Método
          </a>
        </nav>

        {/* Right CTA ('Sign in' pill button with translucent glass styling & hover micro-interaction) */}
        <div className="flex items-center">
          <Link
            href="/login"
            className="px-6 py-2 rounded-2xl bg-white/60 hover:bg-white/90 hover:scale-[1.04] active:scale-[0.98] border border-white/80 text-[15px] font-bold text-slate-900 transition-all duration-200 shadow-2xs backdrop-blur-md cursor-pointer"
          >
            Sign in
          </Link>
        </div>
      </header>
    </div>
  );
}
