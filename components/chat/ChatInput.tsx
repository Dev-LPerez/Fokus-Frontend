'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  BrainCircuit, 
  Calendar, 
  Search, 
  Sparkles, 
  Square,
  Flame,
  ArrowUp
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  agentState?: 'idle' | 'thinking' | 'tool' | 'streaming';
  toolName?: string;
  userName?: string | null;
  prefilledPrompt?: string;
}

export function ChatInput({
  onSendMessage,
  onStop,
  disabled = false,
  isLoading = false,
  agentState = 'idle',
  toolName,
  userName,
  prefilledPrompt,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefilledPrompt) {
      setInput(prefilledPrompt);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(prefilledPrompt.length, prefilledPrompt.length);
      }
    }
  }, [prefilledPrompt]);

  useEffect(() => {
    if (!disabled && !isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled || isLoading) return;
    onSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  const setPromptShortcut = (text: string) => {
    setInput(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-6 pt-1">
      {/* Liquid Glass Floating Pill Container */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/95 rounded-3xl sm:rounded-[2.2rem] p-3.5 sm:p-4 shadow-[0_20px_45px_-12px_rgba(15,16,20,0.08),0_0_0_1px_rgba(255,255,255,0.8)] transition-all focus-within:shadow-[0_20px_50px_-8px_rgba(28,102,98,0.15),0_0_0_1.5px_rgba(28,102,98,0.4)]">
        
        {/* Top Textarea Row with prompt pin icon */}
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#1c6662] mt-2.5 flex-shrink-0" />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            rows={2}
            aria-label={userName ? `Instrucción para Fokus de ${userName}` : "Instrucción para Fokus"}
            placeholder={
              userName
                ? `${userName}, ¿qué coordinamos hoy en tu agenda o tareas con Fokus?`
                : "Escribe una instrucción o consulta para Fokus..."
            }
            className="w-full min-h-[46px] max-h-36 py-2 bg-transparent text-[#0f1014] placeholder-slate-400 text-base sm:text-sm focus:outline-none resize-none disabled:opacity-50 font-sans leading-relaxed"
          />
        </div>

        {/* Bottom Capabilities Toolbar & Send Button */}
        <div className="flex items-center justify-between gap-2 pt-3 mt-1 border-t border-slate-200/50 flex-wrap">
          {/* Action Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[calc(100%-90px)] sm:max-w-none sm:flex-wrap text-xs pb-0.5 sm:pb-0">
            <button
              type="button"
              onClick={() => setPromptShortcut('Audita mi Google Calendar y busca bloques de Deep Work libres')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#1c6662] border border-[#1c6662]/20 transition-all cursor-pointer shadow-2xs font-medium text-[11px] whitespace-nowrap flex-shrink-0"
            >
              <Calendar className="w-3 h-3 text-[#1c6662]" />
              <span>Deep Work</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptShortcut('Organiza mis tareas críticas en la Matriz de Eisenhower')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#0f766e] border border-slate-200/80 hover:border-[#0f766e]/30 transition-all cursor-pointer shadow-2xs font-medium text-[11px] whitespace-nowrap flex-shrink-0"
            >
              <BrainCircuit className="w-3 h-3 text-[#0f766e]" />
              <span>Eisenhower</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptShortcut('¿Cómo está el clima hoy y qué agenda tengo programada?')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#78350f] border border-[#d4a373]/30 transition-all cursor-pointer shadow-2xs font-medium text-[11px] whitespace-nowrap flex-shrink-0"
            >
              <Search className="w-3 h-3 text-[#b45309]" />
              <span>Daily Briefing</span>
            </button>
          </div>

          {/* Liquid Glass Send Button */}
          <div className="flex items-center gap-2.5 ml-auto flex-shrink-0">
            {/* Live Agent Activity Pill (when thinking or calling tools) */}
            {isLoading && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-[#1c6662] bg-[#1c6662]/10 border border-[#1c6662]/20 animate-fade-in shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1c6662] animate-ping" />
                <span className="font-medium">
                  {agentState === 'tool'
                    ? `Ejecutando ${toolName || 'herramienta'}...`
                    : agentState === 'thinking'
                    ? 'Pensando...'
                    : 'Generando...'}
                </span>
              </span>
            )}

            {!isLoading && (
              <span className="hidden md:inline-block text-[10.5px] font-mono text-slate-400 select-none">
                Enter ↵ para enviar
              </span>
            )}

            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Detener respuesta"
                className="w-10 h-10 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                title="Detener generación"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() || disabled}
                aria-label="Enviar instrucción"
                className="w-10 h-10 rounded-full bg-[#1c6662] hover:bg-[#16524f] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer shadow-md shadow-[#1c6662]/25 active:scale-95"
                title="Enviar (Enter)"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
