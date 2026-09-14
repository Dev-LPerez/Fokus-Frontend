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
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 border border-indigo-400/40 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-indigo-600">
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
            googleEventId={deepWorkResult.google_event_id}
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
            className={`relative rounded-2xl px-5 py-3.5 text-sm transition-all ${
              isUser
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-medium shadow-md shadow-indigo-500/15 max-w-[85%] rounded-tr-xs'
                : 'bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/80 shadow-xs w-full rounded-tl-xs'
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
                      <span className="inline-block w-2 h-4 bg-indigo-600 animate-pulse ml-1 align-middle rounded-xs" />
                    )}
                  </div>
                ) : message.isStreaming ? (
                  <div className="flex items-center gap-2 text-xs text-indigo-600 font-mono py-0.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    <span>Pensando...</span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Action buttons (Copy + Speak) */}
            {!isUser && hasContent && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleToggleSpeak}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                  title={isSpeaking ? 'Detener lectura' : 'Escuchar mensaje en voz alta'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-indigo-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Copiar texto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-indigo-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
