---
version: 1
slug: "app-protected-projects-page-tsx"
primary_target: "app/(protected)/projects/page.tsx"
related_targets:
  - "components/projects/ProjectsHeader.tsx"
  - "components/projects/EisenhowerMatrixView.tsx"
  - "components/projects/ProjectKanbanView.tsx"
  - "components/projects/PriorityListView.tsx"
  - "components/projects/TaskCard.tsx"
  - "components/projects/CreateTaskModal.tsx"
  - "components/projects/ShortcutsModal.tsx"
  - "components/projects/UndoToast.tsx"
---

# Surface Brief: Fokus Projects & Eisenhower Matrix Sanctuary

- **Scope:** Route `app/(protected)/projects/page.tsx` and child components in `components/projects/`.
- **Visitor Mode:** Operate (strategic clarity, low cognitive friction, prioritization without overwhelm, seamless Deep Work reservation).
- **Audience & Job:** Focused professionals and creators organizing key commitments, separating urgent fire drills from high-leverage strategic work, and booking dedicated Deep Work sessions directly into Google Calendar.
- **Constraints:** Strict adherence to Luminous Liquid Glass design language (`#edece9`, Sanctuary Teal `#1c6662`, Honey Amber `#f4e0ba`, Soft Charcoal `#0f1014`, typography in Wix Madefor Display, Space Grotesk, DM Sans, and JetBrains Mono).

## Direction contract

THESIS: A serene, luminous 2x2 Eisenhower matrix and multi-view project workspace crafted in translucent liquid glass, making strategic priorities radiate while eliminating generic gray SaaS dashboard clutter.

OWN-WORLD: Serene sand ground `#edece9` with feathered ambient glows in sanctuary teal (`#1c6662/0.05`) and warm amber (`#f4e0ba/0.30`). Four elevated frosted glass quadrant containers (`bg-white/75 backdrop-blur-xl border border-white/80 shadow-xs`), with Quadrant II (Estratégico & Deep Work) bathed in a protective teal and honey halo with a 1-click 'Blindar 90m Deep Work' trigger.

STORY: The user lands on `/projects`, absorbs executive pulse metrics in Space Grotesk at a glance (`pendientes`, `críticas`, `en Google Cal`, `completadas`), inspects their 4 Eisenhower quadrants, quickly converts an important task into a protected focus block via the Copilot, filters by project with smooth transitions, and captures new tasks in seconds using the floating bottom dock or keyboard shortcut (`N`).

FIRST VIEWPORT: Floating liquid header toolbar with executive pulse strip, search input with `/` shortcut chip, mode switcher (`Eisenhower 2x2`, `Por Proyecto`, `Por Prioridad`), and project filter. The main canvas displays the 4 luminous quadrants with tactile interactive task cards. A floating rounded-full dock rests at the bottom with '+ Nueva Tarea (N)'.

FORM: Strategic Sanctuary (Eisenhower 2x2 Glass Matrix), option 1. seed:883075f80bbcabf0.

FINISH: Local Next.js build verification (exit 0), 0 impeccable detect anti-patterns, local Git commit with strictly NO remote git push.
