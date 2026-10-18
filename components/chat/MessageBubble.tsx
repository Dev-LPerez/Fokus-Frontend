'use client';

import React, { useState } from 'react';
import { Bot, User, Copy, Check, Volume2, VolumeX } from 'lucide-react';
import { ToolIndicator } from './ToolIndicator';
import { MarkdownContent } from './MarkdownContent';
import { DeepWorkCard } from './DeepWorkCard';

export interface ToolCallItem {
  tool: string;
  status: 'running' | 'done' | 'error';
  input?: Record<string, unknown>;
  result?: Record<string, unknown> | string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
  tool_name?: string | null;
  toolCalls?: ToolCallItem[];
  created_at?: string;
  isStreaming?: boolean;
}

interface MessageBubbleProps {
  message: ChatMessage;
  onSelectSlot?: (slot: { start: string; end: string; duration_minutes?: number }) => void;
  isBooking?: boolean;
}

export function MessageBubble({ message, onSelectSlot, isBooking }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!message.content) return;

    // Strip markdown formatting for cleaner speech
    const cleanText = message.content
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\(http[^)]+\)/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const hasContent = Boolean(message.content && message.content.trim().length > 0);
  const hasToolCalls = Boolean(message.toolCalls && message.toolCalls.length > 0);

  if (!hasContent && !hasToolCalls && !message.isStreaming) {
    return null;
  }

  // Detect confirmed schedule_deep_work tool call
  const deepWorkCall = message.toolCalls?.find(
    (tc) => tc.tool === 'schedule_deep_work' && (tc.status === 'done' || tc.result)
  );

  let deepWorkResult: Record<string, any> | null = null;
  if (deepWorkCall?.result) {
    if (typeof deepWorkCall.result === 'string') {
      try {
        deepWorkResult = JSON.parse(deepWorkCall.result);
      } catch {
        deepWorkResult = null;
      }
    } else {
      deepWorkResult = deepWorkCall.result as Record<string, any>;
    }
  }

  const isDeepWorkConfirmed = deepWorkResult && deepWorkResult.success === true;

  // Detect find_free_work_slots tool call with options
  const freeSlotsCall = message.toolCalls?.find(
    (tc) => tc.tool === 'find_free_work_slots' && (tc.status === 'done' || tc.result)
  );

  let freeSlotsResult: Record<string, any> | null = null;
  if (freeSlotsCall?.result) {
    if (typeof freeSlotsCall.result === 'string') {
      try {
        freeSlotsResult = JSON.parse(freeSlotsCall.result);
      } catch {
        freeSlotsResult = null;
      }
    } else {
      freeSlotsResult = freeSlotsCall.result as Record<string, any>;
    }
  }

  const hasFreeSlotsToPick =
    !isDeepWorkConfirmed &&
    freeSlotsResult &&
    Array.isArray(freeSlotsResult.free_slots) &&
    freeSlotsResult.free_slots.length > 0;

  return (
    <div
      className={`group w-full max-w-3xl mx-auto py-1 flex gap-3.5 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } animate-fade-in`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-[#1c6662] border border-white/70 flex items-center justify-center text-white shadow-xs">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md border border-white/90 shadow-2xs flex items-center justify-center text-[#1c6662]">
            <Bot className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`flex-1 min-w-0 flex flex-col ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Tool Cards */}
        {hasToolCalls && (
          <div className="w-full space-y-2 mb-2">
            {message.toolCalls!.map((tc, idx) => (
              <ToolIndicator
                key={`${tc.tool}-${idx}`}
                toolName={tc.tool}
                status={tc.status}
                input={tc.input}
                result={tc.result}
              />
            ))}
          </div>
        )}

        {/* Visual Deep Work Confirmation Card */}
        {isDeepWorkConfirmed && deepWorkResult && (
          <DeepWorkCard
            taskDescription={
              (deepWorkCall?.input?.task_description as string) ||
              deepWorkResult.task_description ||
              deepWorkResult.description
            }
            project={
              deepWorkResult.project ||
              (deepWorkCall?.input?.project as string) ||
              null
            }
            scheduledStart={deepWorkResult.scheduled_start}
            scheduledEnd={deepWorkResult.scheduled_end}
            durationMinutes={
              deepWorkResult.duration_minutes ||
              (deepWorkCall?.input?.duration_minutes as number) ||
              90
            }
            googleEventId={deepWorkResult.googleEventId || deepWorkResult.google_event_id}
            message={deepWorkResult.message}
          />
        )}

        {/* Interactive Deep Work Slot Picker (When free slots are audited) */}
        {hasFreeSlotsToPick && freeSlotsResult && (
          <DeepWorkCard
            taskDescription="Sesión de trabajo concentrado"
            availableSlots={freeSlotsResult.free_slots}
            durationMinutes={freeSlotsCall?.input?.duration_minutes ? Number(freeSlotsCall.input.duration_minutes) : 90}
            onSelectSlot={onSelectSlot}
            isBooking={isBooking}
          />
        )}

        {/* Text Message Bubble */}
        {(hasContent || message.isStreaming) && (
          <div
            className={`relative rounded-3xl px-5 py-4 text-sm transition-all ${
              isUser
                ? 'bg-[#1c6662] text-white font-medium shadow-md shadow-[#1c6662]/20 max-w-[85%] rounded-tr-xs'
                : 'bg-white/85 backdrop-blur-xl text-slate-800 border border-white/90 shadow-xs shadow-slate-900/5 w-full rounded-tl-xs'
            }`}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap break-words leading-relaxed select-text font-sans">
                {message.content}
              </div>
            ) : (
              <div>
                {hasContent ? (
                  <div className="leading-relaxed">
                    <MarkdownContent content={message.content} />
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-[#1c6662] animate-pulse ml-1 align-middle rounded-xs" />
                    )}
                  </div>
                ) : message.isStreaming ? (
                  <div className="flex items-center gap-2 text-xs text-[#1c6662] font-mono py-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#1c6662] animate-ping" />
                    <span>Pensando...</span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Action buttons (Copy + Speak) */}
            {!isUser && hasContent && (
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleToggleSpeak}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-[#1c6662]/10 text-[#1c6662] border border-[#1c6662]/20'
                      : 'bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200/60'
                  }`}
                  title={isSpeaking ? 'Detener lectura' : 'Escuchar mensaje en voz alta'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-[#1c6662]" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200/60 transition-colors cursor-pointer"
                  title="Copiar texto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#1c6662]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
