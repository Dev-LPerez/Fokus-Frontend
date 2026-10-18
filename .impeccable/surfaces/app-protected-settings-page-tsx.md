---
version: 1
slug: "app-protected-settings-page-tsx"
primary_target: "app/(protected)/settings/page.tsx"
related_targets:
  - "app/(protected)/conversations/page.tsx"
---

# Surface Brief: Fokus Settings & Zen Tabbed Suite

- **Scope:** Routes `app/(protected)/settings/page.tsx` and `app/(protected)/conversations/page.tsx`.
- **Visitor Mode:** Operate (seamless account management, verified Google Calendar connection, fast session resumption).
- **Audience & Job:** Focused creators and professionals managing their identity, verifying Google Calendar integration, setting location preferences, and inspecting past focus sessions without cognitive clutter.
- **Constraints:** Must adhere strictly to Luminous Liquid Glass design language (`#edece9`, Sanctuary Teal `#1c6662`, Honey Amber `#f4e0ba`, Soft Charcoal `#0f1014`, Wix Madefor Display, Space Grotesk, DM Sans, JetBrains Mono).
- **Special User Boundary:** NO fake telemetry. Real Google Calendar OAuth 2.0 state and real conversation counts only.

## Direction contract

THESIS: A unified Zen Tabbed Suite in luminous liquid glass, bringing together Account & Integrations, Focus Session History, and Environment Preferences under a floating central tab switcher with a right-hand status inspector.

OWN-WORLD: Serene ground `#edece9` with feathered ambient glows in sanctuary teal (`#1c6662/0.05`) and warm amber (`#f4e0ba/0.30`). Elevated frosted glass cards (`bg-white/85 backdrop-blur-xl border border-white/85 shadow-xs`), tactile tab pill switcher with active Sanctuary Teal button, and Space Grotesk typography for timestamps.

STORY: The user enters Settings, switches between Cuenta, Historial, and Preferencias with zero page reloads, verifies their Google Calendar connection with one glance, and resumes previous focus conversations seamlessly.

FIRST VIEWPORT: Floating header with central pill switcher tabs ('Cuenta & Integraciones' active, 'Historial de Sesiones', 'Preferencias'). Left 68% shows the active frosted panel (Account + Google Calendar OAuth card); right 32% features the persistent status inspector with real session counts and security verification.

FORM: Zen Tabbed Suite, option 2. seed:b52a0270249ae173.

FINISH: Local Next.js build verification (exit 0), 0 impeccable detect anti-patterns, local Git commit with strictly NO remote git push.
