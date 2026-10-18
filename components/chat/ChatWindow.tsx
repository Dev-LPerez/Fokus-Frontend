'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './MessageBubble';
import { MessageBubble } from './MessageBubble';
import {
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Calendar,
  Compass,
  Zap,
} from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  userName?: string | null;
  onSelectSuggestion?: (suggestion: string) => void;
  onSelectSlot?: (slot: { start: string; end: string; duration_minutes?: number }) => void;
  isBookingSlot?: boolean;
  isColdStart?: boolean;
  isLoading?: boolean;
  agentState?: string;
  toolName?: string;
}

export function ChatWindow({
  messages,
  userName,
  onSelectSuggestion,
  onSelectSlot,
  isBookingSlot = false,
  isColdStart = false,
  isLoading = false,
  agentState,
  toolName,
}: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions = [
    {
      title: 'Bloquear 90 min de Deep Work',
      desc: 'Sincroniza bloque de concentración en Google Calendar',
      text: 'Quiero bloquear 90 minutos de Deep Work en mi Google Calendar para avanzar en mi prioridad crítica de hoy.',
      icon: Calendar,
      accent: 'text-[#1c6662]',
      bgIcon: 'bg-[#1c6662]/10 border-[#1c6662]/20',
      badge: 'Deep Work',
      badgeColor: 'bg-[#1c6662]/10 border-[#1c6662]/20 text-[#1c6662]',
    },
    {
      title: 'Auditar agenda y huecos libres',
      desc: 'Descubre disponibilidad en Google Calendar',
      text: 'Audita mi agenda de hoy en Google Calendar y dime qué huecos de trabajo libre tengo disponibles.',
      icon: Compass,
      accent: 'text-[#0f766e]',
      bgIcon: 'bg-[#0f766e]/10 border-[#0f766e]/20',
      badge: 'Disponibilidad',
      badgeColor: 'bg-[#0f766e]/10 border-[#0f766e]/20 text-[#0f766e]',
    },
    {
      title: 'Daily Briefing matutino',
      desc: 'Pronóstico de clima y resumen de compromisos',
      text: 'Dame mi Daily Briefing matutino: cómo está el clima y cuáles son mis reuniones más importantes.',
      icon: Sparkles,
      accent: 'text-[#92400e]',
      bgIcon: 'bg-[#f4e0ba]/50 border-[#d4a373]/40',
      badge: 'Briefing',
      badgeColor: 'bg-[#f4e0ba]/40 border-[#d4a373]/40 text-[#78350f]',
    },
    {
      title: 'Priorizar Matriz de Eisenhower',
      desc: 'Clasifica tareas críticas vs secundarias',
      text: 'Revisa mi lista de tareas y organízalas según la Matriz de Eisenhower para saber qué resolver de inmediato.',
      icon: Zap,
      accent: 'text-[#1c6662]',
      bgIcon: 'bg-[#1c6662]/10 border-[#1c6662]/20',
      badge: 'Eisenhower',
      badgeColor: 'bg-[#1c6662]/10 border-[#1c6662]/20 text-[#1c6662]',
    },
  ];

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4">
      {/* Cold start alert banner */}
      {isColdStart && (
        <div className="max-w-md mx-auto p-4 bg-[#f4e0ba]/60 backdrop-blur-md border border-[#d4a373]/40 rounded-2xl text-xs text-[#78350f] flex items-center gap-3.5 animate-fade-in shadow-xs">
          <Server className="w-5 h-5 flex-shrink-0 text-[#b45309] animate-pulse" />
          <div>
            <p className="font-semibold text-[#78350f]">Reactivando Fokus...</p>
            <p className="text-[#92400e] text-[11px] mt-0.5">
              El motor backend se está iniciando tras una pausa de inactividad. Tu respuesta comenzará en unos segundos.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 my-auto py-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0f1014] tracking-tight leading-tight">
            {(() => {
              const hour = new Date().getHours();
              const displayName = userName ? `, ${userName}` : '';
              if (hour >= 5 && hour < 12) return `Buenos días${displayName}`;
              if (hour >= 12 && hour < 19) return `Buenas tardes${displayName}`;
              return `Buenas noches${displayName}`;
            })()}
          </h2>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1e293b] mt-1.5 tracking-tight">
            ¿Qué meta blindamos <span className="text-[#1c6662]">hoy?</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-3.5 max-w-md leading-relaxed font-sans">
            Tu copiloto de crecimiento personal y profesional. Organiza tu agenda, blinda momentos de enfoque real y avanza en tus proyectos clave sin abrumarte.
          </p>

          {/* Quick Suggestions Cards with Liquid Glass Touch */}
          {onSelectSuggestion && (
            <div className="mt-8 w-full space-y-3 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {suggestions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectSuggestion(item.text)}
                      className="p-4 bg-white/80 hover:bg-white/95 backdrop-blur-xl border border-white/85 hover:border-[#1c6662]/40 rounded-2xl text-xs text-slate-700 hover:text-slate-950 transition-all flex flex-col justify-between gap-3 cursor-pointer group shadow-2xs hover:shadow-md hover:shadow-[#1c6662]/5 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-2 w-full">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl border ${item.bgIcon} flex-shrink-0`}>
                            <Icon className={`w-4 h-4 ${item.accent}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-slate-900 group-hover:text-[#1c6662] transition-colors">
                              {item.title}
                            </p>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor} inline-block mt-0.5`}>
                              {item.badge}
                            </span>
                          </div>
                        </div>

                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1c6662] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                      </div>

                      <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Message Stream with bottom offset for floating pill input */
        <div className="max-w-4xl mx-auto space-y-6 pb-28 pt-2">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onSelectSlot={onSelectSlot}
              isBooking={isBookingSlot}
            />
          ))}
        </div>
      )}
    </div>
  );
}
