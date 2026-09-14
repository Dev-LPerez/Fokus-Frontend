'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/navigation/Sidebar';
import { 
  PanelLeftOpen, 
  PanelLeftClose, 
  Wrench, 
  Settings, 
  Plus, 
  Minus, 
  Square, 
  X,
  Sparkles,
  ExternalLink,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { FokusIcon } from '@/components/brand/FokusLogo';
import { ToolsModal } from '@/components/tools/ToolsModal';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface AppLayoutProps {
  userEmail?: string | null;
  children: React.ReactNode;
}

export function AppLayout({ userEmail, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toolsModalOpen, setToolsModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const conversationId = searchParams.get('id');

  const formattedUserName = userEmail ? userEmail.split('@')[0] : null;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#fafbfc] antialiased">
      {/* Sidebar */}
      <Sidebar
        userEmail={userEmail}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main App Area Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-white/70 backdrop-blur-xl">
        {/* Top App Header Bar */}
        <header className="h-14 px-4 sm:px-6 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="min-w-[36px] min-h-[36px] p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer flex items-center justify-center"
              title={sidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
              aria-label={sidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </button>

            {/* Model badge selector pill */}
            <div className="flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs cursor-pointer hover:border-teal-400 transition-all text-xs font-semibold text-slate-800">
              <FokusIcon size={18} />
              <span className="truncate max-w-[110px] sm:max-w-none font-display font-bold text-slate-900">Fokus</span>
              <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
            </div>

            {/* Live status badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>en línea</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <Link
              href="/chat"
              className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer min-h-[36px]"
              title="Nueva conversación"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo Chat</span>
            </Link>

            {/* Onboarding Tour / Guía rápida */}
            <button
              onClick={() => setOnboardingOpen(true)}
              className="min-w-[36px] min-h-[36px] p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-indigo-600 shadow-2xs transition-colors cursor-pointer flex items-center justify-center"
              title="Guía de inicio y bienvenida"
              aria-label="Guía de inicio"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setToolsModalOpen(true)}
              className="hidden sm:flex min-w-[36px] min-h-[36px] p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-indigo-600 shadow-2xs transition-colors cursor-pointer items-center justify-center"
              title="Ver herramientas del copiloto"
              aria-label="Ver herramientas"
            >
              <Wrench className="w-3.5 h-3.5" />
            </button>

            <Link
              href="/settings"
              className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-2xs cursor-pointer block hover:scale-105 transition-transform"
              title="Ajustes y cuenta"
              aria-label="Ajustes de cuenta"
            >
              <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-bold text-xs flex items-center justify-center">
                {userEmail ? userEmail.slice(0, 2).toUpperCase() : 'CO'}
              </div>
            </Link>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {children}
        </main>
      </div>

      <ToolsModal isOpen={toolsModalOpen} onClose={() => setToolsModalOpen(false)} />
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        userName={formattedUserName}
        onStartAction={(prompt) => {
          setOnboardingOpen(false);
          router.push(`/chat?prompt=${encodeURIComponent(prompt)}`);
        }}
      />
    </div>
  );
}
