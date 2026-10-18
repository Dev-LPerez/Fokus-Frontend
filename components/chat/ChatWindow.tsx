'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage, MessageBubble } from './MessageBubble';
import { Server, Sparkles } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  userName?: string | null;
  hasCalendarConnected?: boolean;
  locationSummary?: string | null;
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
  hasCalendarConnected = false,
  locationSummary,
  onSelectSuggestion,
  onSelectSlot,
  isBookingSlot = false,
  isColdStart = false,
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

  const quickChips = [
    {
      label: 'Blindar 90m Deep Work',
      text: 'Quiero bloquear 90 minutos de Deep Work en mi Google Calendar para avanzar en mi prioridad crítica de hoy.',
    },
    {
      label: 'Auditar huecos en mi agenda',
      text: 'Audita mi agenda de hoy en Google Calendar y dime qué huecos de trabajo libre tengo disponibles.',
    },
    {
      label: 'Priorizar con Matriz Eisenhower',
      text: 'Revisa mi lista de tareas y organízalas según la Matriz de Eisenhower para saber qué resolver de inmediato.',
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
            <p className="text-[#92400e] text-[11px] mt-0.5 font-mono">
              El motor backend se está iniciando tras una pausa de inactividad. Tu respuesta comenzará en unos segundos.
            </p>
          </div>
        </div>
      )}

      {/* Empty State: Option 1 (Zen Pure Canvas) */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 my-auto py-12 sm:py-16">
          {/* Subtle Context Pill */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/95 px-3.5 py-1.5 rounded-full text-[11px] font-mono text-stone-600 mb-6 shadow-2xs">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasCalendarConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>
              {locationSummary ? `${locationSummary} · ` : ''}
              {hasCalendarConnected ? 'Google Calendar Conectado' : 'Calendario Desconectado'}
            </span>
          </div>

          {/* Clean Greeting Headline */}
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight leading-tight">
            {(() => {
              const hour = new Date().getHours();
              const displayName = userName ? `, ${userName}` : '';
              if (hour >= 5 && hour < 12) return `Buenos días${displayName}`;
              if (hour >= 12 && hour < 19) return `Buenas tardes${displayName}`;
              return `Buenas noches${displayName}`;
            })()}
            <br />
            ¿En qué protegemos tu <span className="text-[#1c6662]">enfoque</span> hoy?
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 mt-3.5 max-w-md leading-relaxed font-sans">
            Organiza tu agenda, blinda bloques de trabajo profundo y avanza en tus prioridades con serenidad.
          </p>

          {/* Single Row of 3 Subtle Minimalist Chips */}
          {onSelectSuggestion && (
            <div className="mt-8 flex items-center justify-center gap-2.5 flex-wrap">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectSuggestion(chip.text)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/85 hover:bg-white border border-stone-200/80 hover:border-[#1c6662]/40 text-stone-700 hover:text-[#1c6662] text-xs font-medium transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5 group"
                >
                  <Sparkles className="w-3 h-3 text-[#1c6662] transition-transform group-hover:scale-110" />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Message Stream: Pure Centered Sanctuary (Max 780px) */
        <div className="max-w-3xl mx-auto space-y-6 pb-28 pt-2">
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
