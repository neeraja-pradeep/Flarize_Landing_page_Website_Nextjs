docs/ — index
Reference docs for this Next.js codebase. Kept short on purpose — read the linked file for details before acting on anything below.

NEXTJS_ENGINEERING_HANDBOOK_V2.md — Official current standard. Next.js 16 / React 19 App Router conventions: five guiding principles, folder-per-need (not per-layer), Server Components/Actions, no app/api/. Read this first; when it conflicts with the docs below, this one wins.
NEXTJS_CLEAN_ARCHITECTURE.md — Older (v1) feature-first Clean Architecture standard: four-layer folder structure, TanStack Query vs Zustand split. Superseded by the handbook's folder-per-need model; still useful for the state-management split rationale.
NEXTJS_CODING_STANDARDS.md — Companion to the v1 doc above: naming conventions, no-enums rule, Tailwind usage, PR checklist. Same v1/v2 caveat applies.
NEXTJS_CLAUDE_FEATURE_PROMPTS.md — Copy-paste prompts for scaffolding a feature or fixing a bug with Claude Code. Built on the v1 architecture doc's assumptions — adjust folder references to match the v2 handbook if the two disagree.
When implementing a feature: follow the handbook's rules; use the other three only for structure/naming detail it doesn't cover.
