'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square } from 'lucide-react';

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

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-1">
      {/* Liquid Glass Minimal Floating Capsule */}
      <div className="bg-white/85 backdrop-blur-2xl border border-white/95 rounded-3xl p-3 sm:p-3.5 shadow-[0_16px_36px_-10px_rgba(15,16,20,0.07),0_0_0_1px_rgba(255,255,255,0.8)] transition-all focus-within:shadow-[0_18px_40px_-8px_rgba(28,102,98,0.12),0_0_0_1.5px_rgba(28,102,98,0.35)] flex items-end gap-3">
        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          rows={1}
          aria-label={userName ? `Instrucción para Fokus de ${userName}` : 'Instrucción para Fokus'}
          placeholder={
            userName
              ? `${userName}, escribe a Fokus o pide organizar tu jornada...`
              : 'Escribe a Fokus o pide organizar tu jornada...'
          }
          className="flex-1 min-h-[42px] max-h-36 py-2.5 px-3 bg-transparent text-[#0f1014] placeholder-stone-400 text-sm focus:outline-none resize-none disabled:opacity-50 font-sans leading-relaxed"
        />

        {/* Action Controls & Send Button */}
        <div className="flex items-center gap-2 pb-1 flex-shrink-0">
          {/* Agent Activity Status Badge */}
          {isLoading && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-[#1c6662] bg-[#1c6662]/10 border border-[#1c6662]/20 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c6662] animate-ping" />
              <span className="hidden sm:inline font-medium">
                {agentState === 'tool'
                  ? `Ejecutando ${toolName || 'herramienta'}...`
                  : agentState === 'thinking'
                  ? 'Pensando...'
                  : 'Escribiendo...'}
              </span>
            </span>
          )}

          {!isLoading && (
            <span className="hidden md:inline-block text-[11px] font-mono text-stone-400 select-none px-1">
              ↵
            </span>
          )}

          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Detener respuesta"
              className="w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
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
              className="w-9 h-9 rounded-full bg-[#1c6662] hover:bg-[#154f4c] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer shadow-sm shadow-[#1c6662]/20 active:scale-95"
              title="Enviar (Enter)"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
