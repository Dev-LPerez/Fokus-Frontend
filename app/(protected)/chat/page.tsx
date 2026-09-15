'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage, ToolCallItem } from '@/components/chat/MessageBubble';
import { DailyBriefingCard } from '@/components/briefing/DailyBriefingCard';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { useUserLocation } from '@/lib/hooks/useUserLocation';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const conversationIdParam = searchParams.get('id');

  const [conversationId, setConversationId] = useState<string | null>(conversationIdParam);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isColdStart, setIsColdStart] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCalendarConnected, setHasCalendarConnected] = useState(false);
  const [tasksCount, setTasksCount] = useState(0);

  // Agent State tracking
  const [agentState, setAgentState] = useState<'idle' | 'thinking' | 'tool' | 'streaming'>('idle');
  const [activeToolName, setActiveToolName] = useState<string | undefined>(undefined);
  const [prefilledPrompt, setPrefilledPrompt] = useState<string>('');

  // Geolocation & Location Notice Hook
  const {
    location,
    showLocationBanner,
    dismissBanner,
    requestLocation,
  } = useUserLocation();

  const abortControllerRef = useRef<AbortController | null>(null);
  const activeConversationIdRef = useRef<string | null>(conversationIdParam);
  const supabase = createClient();

  // Check onboarding status from backend
  // Both fresh users and existing/old users who haven't completed this new flow will receive the onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/onboarding/status`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setHasCalendarConnected(Boolean(data.has_calendar_connected));
          setTasksCount(data.tasks_count || 0);

          // If user (new or old) has not yet completed the onboarding, display it
          if (!data.has_seen_onboarding) {
            setShowOnboarding(true);
          }
        }
      } catch (e) {
        // Non-blocking fallback
      }
    };

    checkOnboarding();
  }, [supabase]);

  // Fetch current user name for personalized greeting
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const rawName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          (user.email ? user.email.split('@')[0] : null);
        if (rawName) {
          // Capitalize first letter cleanly
          const formatted = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          setUserName(formatted);
        }
      }
    });
  }, [supabase]);

  // Load existing conversation if id is changed externally (e.g. from sidebar navigation)
  useEffect(() => {
    // If the conversation ID in URL already matches what we have in memory, do NOT reload!
    if (conversationIdParam === activeConversationIdRef.current) {
      return;
    }

    activeConversationIdRef.current = conversationIdParam;
    setConversationId(conversationIdParam);

    if (!conversationIdParam) {
      setMessages([]);
      setErrorMessage(null);
      setLoadingHistory(false);
      return;
    }

    const loadConversation = async () => {
      setLoadingHistory(true);
      setErrorMessage(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/conversations/${conversationIdParam}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (res.status === 401) {
          await supabase.auth.signOut();
          router.push('/login');
          return;
        }

        if (!res.ok) {
          throw new Error(`No se pudo cargar la conversación (${res.status})`);
        }

        const data = await res.json();
        setConversationId(data.id || conversationIdParam);
        activeConversationIdRef.current = data.id || conversationIdParam;

        if (Array.isArray(data.messages)) {
          const loadedMsgs: ChatMessage[] = [];
          let currentToolCalls: ToolCallItem[] = [];

          for (const m of data.messages) {
            if (m.role === 'tool') {
              let parsedInput: Record<string, unknown> | undefined = undefined;
              try {
                parsedInput = JSON.parse(m.content);
              } catch {
                // Ignore parse error
              }
              currentToolCalls.push({
                tool: m.tool_name || 'herramienta',
                status: 'done',
                input: parsedInput,
                result: parsedInput,
              });
            } else if (m.role === 'assistant') {
              loadedMsgs.push({
                id: m.id || crypto.randomUUID(),
                role: 'assistant',
                content: m.content || '',
                toolCalls: currentToolCalls.length > 0 ? [...currentToolCalls] : undefined,
                created_at: m.created_at,
              });
              currentToolCalls = [];
            } else if (m.role === 'user') {
              if (currentToolCalls.length > 0) {
                loadedMsgs.push({
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content: '',
                  toolCalls: [...currentToolCalls],
                });
                currentToolCalls = [];
              }
              loadedMsgs.push({
                id: m.id || crypto.randomUUID(),
                role: 'user',
                content: m.content || '',
                created_at: m.created_at,
              });
            }
          }

          if (currentToolCalls.length > 0) {
            loadedMsgs.push({
              id: crypto.randomUUID(),
              role: 'assistant',
              content: '',
              toolCalls: currentToolCalls,
            });
          }

          setMessages(loadedMsgs);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al cargar conversación';
        setErrorMessage(msg);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadConversation();
  }, [conversationIdParam, router, supabase.auth]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setAgentState('idle');
    setActiveToolName(undefined);
  };

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isLoading) return;

      setIsLoading(true);
      setErrorMessage(null);
      setAgentState('thinking');
      setActiveToolName(undefined);

      // Create abort controller
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Append user message immediately
      const userMessageId = crypto.randomUUID();
      const userMsg: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content: messageText,
        created_at: new Date().toISOString(),
      };

      // Placeholder for assistant stream
      const assistantMessageId = crypto.randomUUID();
      const initialAssistantMsg: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        toolCalls: [],
        created_at: new Date().toISOString(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);

      // Cold start timer — only triggers if server takes > 6s before any response
      const coldStartTimer = setTimeout(() => {
        setIsColdStart(true);
      }, 6000);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }

        const currentConvId = activeConversationIdRef.current;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const requestPayload: Record<string, unknown> = {
          message: messageText,
          conversation_id: currentConvId,
        };
        if (location.latitude !== null && location.longitude !== null) {
          requestPayload.latitude = location.latitude;
          requestPayload.longitude = location.longitude;
        }

        const response = await fetch(`${apiUrl}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });

        clearTimeout(coldStartTimer);
        setIsColdStart(false);

        if (response.status === 401) {
          await supabase.auth.signOut();
          router.push('/login');
          return;
        }

        if (!response.ok) {
          let errorDetail = `Error ${response.status}: ${response.statusText}`;
          try {
            const errJson = await response.json();
            if (errJson?.detail) {
              errorDetail =
                typeof errJson.detail === 'string'
                  ? errJson.detail
                  : JSON.stringify(errJson.detail);
            }
          } catch {
            // Ignore parse failure
          }
          throw new Error(errorDetail);
        }

        if (!response.body) {
          throw new Error('El servidor no devolvió un canal de streaming legible.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            let eventType = 'message';
            let eventDataStr = '';

            const subLines = line.split('\n');
            for (const subLine of subLines) {
              if (subLine.startsWith('event:')) {
                eventType = subLine.replace('event:', '').trim();
              } else if (subLine.startsWith('data:')) {
                eventDataStr = subLine.replace('data:', '').trim();
              }
            }

            if (!eventDataStr) continue;

            try {
              const eventData = JSON.parse(eventDataStr);

              if (eventType === 'conversation_info') {
                if (eventData.conversation_id) {
                  const newId = eventData.conversation_id;
                  activeConversationIdRef.current = newId;
                  setConversationId(newId);

                  // Update the browser URL without triggering Next.js router full page reload
                  window.history.replaceState(null, '', `/chat?id=${newId}`);
                  window.dispatchEvent(
                    new CustomEvent('conversation_updated', { detail: { id: newId } })
                  );
                }
              } else if (eventType === 'tool_start') {
                setAgentState('tool');
                setActiveToolName(eventData.tool_name);
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id !== assistantMessageId) return msg;
                    const prevTools = msg.toolCalls || [];
                    return {
                      ...msg,
                      toolCalls: [
                        ...prevTools,
                        {
                          tool: eventData.tool_name,
                          status: 'running',
                          input: eventData.args,
                        },
                      ],
                    };
                  })
                );
              } else if (eventType === 'tool_end') {
                setAgentState('streaming');
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id !== assistantMessageId) return msg;
                    const prevTools = msg.toolCalls || [];
                    return {
                      ...msg,
                      toolCalls: prevTools.map((t) =>
                        t.tool === eventData.tool_name && t.status === 'running'
                          ? { ...t, status: 'done', result: eventData.result }
                          : t
                      ),
                    };
                  })
                );
              } else if (eventType === 'token') {
                setAgentState('streaming');
                const tokenText = eventData.text || '';
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id !== assistantMessageId) return msg;
                    return {
                      ...msg,
                      content: msg.content + tokenText,
                    };
                  })
                );
              } else if (eventType === 'error') {
                setErrorMessage(eventData.error || 'Error reportado por el servidor');
              } else if (eventType === 'done') {
                setAgentState('idle');
                window.dispatchEvent(new CustomEvent('conversation_updated'));
              }
            } catch {
              // Ignore single malformed event
            }
          }
        }

        // Final cleanup for assistant message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  isStreaming: false,
                  toolCalls: (msg.toolCalls || []).map((t) => ({ ...t, status: 'done' })),
                }
              : msg
          )
        );
      } catch (err: unknown) {
        clearTimeout(coldStartTimer);
        setIsColdStart(false);
        if ((err as Error)?.name !== 'AbortError') {
          const errStr =
            err instanceof Error
              ? err.message
              : 'No se pudo conectar con el servidor. Verifica tu conexión o el estado del backend.';
          setErrorMessage(errStr);
        }

        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessageId || msg.content.length > 0)
        );
      } finally {
        setIsLoading(false);
        setAgentState('idle');
        setActiveToolName(undefined);
        abortControllerRef.current = null;
      }
    },
    [isLoading, location.latitude, location.longitude, router, supabase.auth]
  );

  // Auto-send starter prompt if passed via query param (e.g. from onboarding or external link)
  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam && !conversationIdParam && messages.length === 0 && !isLoading) {
      window.history.replaceState(null, '', '/chat');
      handleSendMessage(promptParam);
    }
  }, [searchParams, conversationIdParam, messages.length, isLoading, handleSendMessage]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-transparent">
      {/* Daily Executive Briefing Collapsible Bar */}
      <DailyBriefingCard
        location={location}
        onRequestLocation={requestLocation}
        showLocationBanner={showLocationBanner}
        onDismissLocationBanner={dismissBanner}
        onQuickAction={(prompt) => {
          if (prompt === 'Vivo en ' || prompt.startsWith('Vivo en')) {
            setPrefilledPrompt(prompt);
          } else {
            handleSendMessage(prompt);
          }
        }}
      />

      {/* Error alert */}
      {errorMessage && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3 animate-fade-in flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span className="truncate">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[11px] font-medium text-red-600 hover:text-red-800 px-2 py-0.5 rounded hover:bg-red-100 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Main chat messages area */}
      {loadingHistory ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500 font-mono text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span>Cargando mensajes...</span>
        </div>
      ) : (
        <ChatWindow
          messages={messages}
          userName={userName}
          isLoading={isLoading}
          isColdStart={isColdStart}
          agentState={agentState}
          toolName={activeToolName}
          onSelectSuggestion={(text) => handleSendMessage(text)}
          onSelectSlot={(slot) => {
            const startStr = slot.start.includes('T') ? slot.start.split('T')[1].slice(0, 5) : slot.start;
            const endStr = slot.end.includes('T') ? slot.end.split('T')[1].slice(0, 5) : slot.end;
            handleSendMessage(`Bloquea en Google Calendar el bloque de Deep Work de ${startStr} a ${endStr}.`);
          }}
          isBookingSlot={isLoading}
        />
      )}

      {/* Chat input area */}
      <div className="flex-shrink-0 bg-white/40 backdrop-blur-md border-t border-slate-200/60">
        <ChatInput
          onSendMessage={(msg) => {
            setPrefilledPrompt('');
            handleSendMessage(msg);
          }}
          onStop={handleStop}
          disabled={isLoading || loadingHistory}
          isLoading={isLoading}
          agentState={agentState}
          toolName={activeToolName}
          userName={userName}
          prefilledPrompt={prefilledPrompt}
        />
      </div>

      {/* Interactive Onboarding Modal for First-time & Existing Users */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        userName={userName}
        hasCalendarConnected={hasCalendarConnected}
        tasksCount={tasksCount}
        onStartAction={(prompt) => {
          setShowOnboarding(false);
          handleSendMessage(prompt);
        }}
      />
    </div>
  );
}
