---
version: 1
slug: "app-protected-chat-page-tsx"
primary_target: "app/(protected)/chat/page.tsx"
related_targets:
  - "components/chat/ChatWindow.tsx"
  - "components/chat/MessageBubble.tsx"
  - "components/chat/DeepWorkCard.tsx"
  - "components/chat/ChatInput.tsx"
  - "components/chat/ToolIndicator.tsx"
  - "components/briefing/DailyBriefingCard.tsx"
---

# Surface Brief: Fokus Copilot Chat & Productive Rail

- **Scope:** Route `app/(protected)/chat/page.tsx` and child components in `components/chat/` and `components/briefing/`.
- **Visitor Mode:** Operate (productive dialog, deep work reservation, schedule auditing without artificial clutter).
- **Audience & Job:** Professionals communicating with their AI copilot to defend their focus, organize tasks, and schedule Deep Work sessions in Google Calendar.
- **Constraints:** Must adhere strictly to Luminous Liquid Glass design language (`#edece9`, Sanctuary Teal `#1c6662`, Honey Amber `#f4e0ba`, Soft Charcoal `#0f1014`, Wix Madefor Display, Space Grotesk, DM Sans, JetBrains Mono).
- **Special User Boundary:** NO fabricated or fake telemetry metrics (no fake energy gauges or arbitrary percentages without backend measurement). Every displayed status must be real (`hasCalendarConnected`, `tasksCount`, live calendar events, real tool states).

## Direction contract

THESIS: An unbroken, luminous liquid chat sanctuary with a productive quick-action rail and floating frosted controls. Refuses the generic robotic console and rejects fake dashboard metrics, focusing 100% on genuine calendar synchronization, task management, and deep work protection.

OWN-WORLD: Ground `#edece9` with feathered ambient glows in sanctuary teal (`#1c6662/0.05`) and warm amber (`#f4e0ba/0.30`). Translucent frosted glass assistant cards (`bg-white/85 backdrop-blur-xl border border-white/80 shadow-xs`), user messages in Sanctuary Teal (`#1c6662`), interactive Deep Work confirmation cards with real Google Calendar event links, and a floating curved liquid input pill at the bottom.

STORY: The user lands in the Copilot view, sees their verified Google Calendar connection status, uses the productive rail to trigger focus blocks or agenda audits in one click, watches real tools execute with transparent monospace chips, and books protected focus time seamlessly.

FIRST VIEWPORT: Clean frosted top bar showing Fokus Copilot title, verified Google Calendar connection pill, and session actions. Productive quick-actions strip for 1-click prompts. Centered conversational stream with high-contrast DM Sans typography and floating liquid input pill.

FORM: Productive Rail & Action Sanctuary (Option 5 adapted without fake telemetry). seed:b52a0270249ae173.

FINISH: Local Next.js build verification (exit 0), 0 impeccable detect anti-patterns, local Git commit with strictly NO remote git push.
