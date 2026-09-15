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
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-6 pt-2">
      {/* Liquid Glass Card Container matching image.png */}
      <div className="liquid-glass-card rounded-[2rem] p-4 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.06),0_0_0_1px_rgba(226,232,240,0.8)] transition-all focus-within:shadow-[0_20px_50px_-5px_rgba(99,102,241,0.12),0_0_0_1.5px_rgba(99,102,241,0.5)]">
        
        {/* Top Textarea Row with prompt pin icon */}
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-500 mt-2.5 flex-shrink-0" />
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
            className="w-full min-h-[52px] max-h-36 py-2 bg-transparent text-slate-800 placeholder-slate-400 text-base sm:text-sm focus:outline-none resize-none disabled:opacity-50 font-sans leading-relaxed"
          />
        </div>

        {/* Bottom Capabilities Toolbar & Send Button */}
        <div className="flex items-center justify-between gap-2 pt-3 mt-1 border-t border-slate-100 flex-wrap">
          {/* Action Chips matching image.png */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[calc(100%-80px)] sm:max-w-none sm:flex-wrap text-xs pb-0.5 sm:pb-0">
            <button
              type="button"
              onClick={() => setPromptShortcut('Audita mi Google Calendar y busca bloques de Deep Work libres')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 hover:bg-white text-slate-600 hover:text-indigo-600 border border-slate-200/60 transition-all cursor-pointer shadow-2xs font-medium text-[11px] whitespace-nowrap flex-shrink-0"
            >
              <Calendar className="w-3 h-3 text-indigo-500" />
              <span>Deep Work</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptShortcut('Organiza mis tareas críticas en la Matriz de Eisenhower')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 hover:bg-white text-slate-600 hover:text-indigo-600 border border-slate-200/60 transition-all cursor-pointer shadow-2xs font-medium text-[11px] whitespace-nowrap flex-shrink-0"
            >
              <BrainCircuit className="w-3 h-3 text-cyan-500" />
              <span>Eisenhower</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptShortcut('¿Cómo está el clima hoy y qué agenda tengo programada?')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 hover:bg-white text-slate-600 hover:text-indigo-600 border border-slate-200/60 transition-all cursor-pointer shadow-2xs font-medium text-[11px] whitespace-nowrap flex-shrink-0"
            >
              <Search className="w-3 h-3 text-amber-500" />
              <span>Daily Briefing</span>
            </button>
          </div>

          {/* Liquid Glass Iridescent Send Button matching image.png */}
          <div className="flex items-center gap-2.5 ml-auto flex-shrink-0">
            {/* Live Agent Activity Pill (when thinking or calling tools) */}
            {isLoading && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 animate-fade-in shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
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
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
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
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-r from-[#0F766E] via-teal-600 to-emerald-600 hover:brightness-105 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer shadow-md shadow-teal-700/20 active:scale-95"
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
