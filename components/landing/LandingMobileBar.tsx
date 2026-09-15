'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function LandingMobileBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down more than 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <aside aria-label="Acceso rápido para registrarse" className="fixed bottom-4 inset-x-4 z-40 md:hidden animate-in slide-in-from-bottom-5 duration-300">
      <div className="max-w-md mx-auto p-2 bg-slate-900/90 text-white backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 pl-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-semibold tracking-tight truncate">
            Tu agenda con intención
          </span>
        </div>

        <Link
          href="/register"
          className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-teal-500 hover:brightness-110 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform cursor-pointer"
        >
          <span>Empezar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
