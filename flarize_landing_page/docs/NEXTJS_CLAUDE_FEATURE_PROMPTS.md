# Claude Code — Generic Feature Prompt Pack (React + Next.js)

Three copy‑paste prompts for building any feature with Claude Code on our standard
React + Next.js repo:

1. **Prompt A — Feature Layer Generation** (the main one; generates Domain +
   Infrastructure + Application for one feature and wires the existing UI).
2. **Prompt A‑AUTH — Auth Add‑on** (paste *in addition to* Prompt A only when the
   feature is authentication/session).
3. **Prompt B — Bug Fix** (strict, surgical fix from a reported UI/console error).

> Assumptions baked in (from `NEXTJS_CLEAN_ARCHITECTURE.md` + `NEXTJS_CODING_STANDARDS.md`):
> Feature‑first Clean Architecture · Next.js App Router + TypeScript (strict) ·
> TanStack Query (server state) · Zustand (client/UI state) · Zod (DTO validation) ·
> React Hook Form (+ zodResolver) · Axios (`core/network/http-client`) ·
> neverthrow `Result<T, Failure>` · Tailwind CSS · kebab‑case files ·
> QA gate = `tsc --noEmit` + ESLint + build + tests.

---

## How to use

1. Make sure the repo contains: `NEXTJS_CLEAN_ARCHITECTURE.md` and
   `NEXTJS_CODING_STANDARDS.md` (root or `docs/`), the target feature's
   **presentation layer already developed** (static UI per the coding standards), and
   the `core/` scaffolding (created by `scaffold-clean-architecture.sh`).
2. Open Claude Code at the **Next.js project root**.
3. Copy **Prompt A**, set `FEATURE_NAME`, and paste the feature's **API contract**
   into the `API CONTRACT` block.
4. If the feature is auth/session, also append **Prompt A‑AUTH**.
5. After the developer tests, if something breaks, use **Prompt B** with the exact
   UI + console/terminal errors.

---

## PROMPT A — Feature Layer Generation

```text
You are a senior React/Next.js engineer working in an existing, standardized repository.
Architecture is feature-first Clean Architecture (Next.js App Router) with TanStack Query
+ Zustand. You will build the non-UI layers for ONE feature only.

================================================================
FEATURE_NAME: <<e.g. authentication / dashboard / profile>>
================================================================

STEP 0 — READ BEFORE WRITING (do not skip, do not assume)
1. Read the project standards docs. These are BINDING:
   - NEXTJS_CLEAN_ARCHITECTURE.md   (layer definitions, folder structure, dependency rule)
   - NEXTJS_CODING_STANDARDS.md     (naming, import law, TS rules, state rules, QA checklist)
   - package.json                   (installed package versions — use these exact ones;
                                     do NOT add new dependencies without flagging it)
2. Read the feature's ALREADY-DEVELOPED presentation layer:
   `src/features/<FEATURE_NAME>/presentation/`  (views + components) and its route
   `src/app/<FEATURE_NAME>/page.tsx`.
   Infer from the UI exactly what data fields, states (loading/error/empty/success),
   and actions each screen needs. The presentation layer is the contract for what
   your layers must supply.
3. Read existing shared scaffolding before creating anything:
   `src/core/` (network/http-client, network-exceptions, error/failure, error/result,
   config/query-client) and the app providers (QueryClientProvider wiring in
   `src/app/layout.tsx` or `src/app/providers.tsx`).

STEP 1 — SOURCE OF TRUTH FOR THE BACKEND
Use ONLY the API contract below. Do not invent endpoints, fields, or response shapes.
If the UI needs a field the contract does not provide, STOP and list the gap instead
of guessing.

----------------- API CONTRACT (filled in by the developer) -----------------
Base URL / env var:
Auth scheme (session-cookie / bearer / none):

For each endpoint:
  - Name / purpose:
  - Method + path:
  - Headers (auth, csrf, content-type):
  - Path / query params:
  - Request body (JSON example):
  - Success response (HTTP code + JSON example):
  - Error responses (codes + JSON example):
  - Pagination (if any):
<<PASTE ALL ENDPOINTS FOR THIS FEATURE HERE>>
-----------------------------------------------------------------------------

STEP 2 — WHAT TO BUILD (this feature only)
Generate these layers under `src/features/<FEATURE_NAME>/`:

A) domain/  (DECLARE)
   - entities/        Plain immutable domain entities the UI needs (TS interfaces,
                      ALL fields `readonly`). No framework imports.
   - repositories/    ABSTRACT repository interface(s) only — method signatures,
                      no implementation. Return `Promise<Result<T, Failure>>`
                      (re-exported from core/error/result — match what core already uses).

B) infrastructure/  (DEFINE)
   - datasources/remote/   `<feature>-api.ts` — functions built on core's axios
                           http-client. DTOs (`*-request.dto.ts` / `*-response.dto.ts`)
                           each exporting a Zod schema + `z.infer` type. EVERY response
                           is `.parse()`d before leaving this layer.
   - datasources/local/    `<feature>-local-ds.ts` — localStorage/IndexedDB read/write,
                           ONLY if the feature genuinely needs client-side persistence
                           beyond TanStack Query's cache (rare — justify it). Keys via
                           named constants; never magic strings. NEVER store tokens here.
   - repositories/         `<feature>-repository.impl.ts` — class implementing the
                           domain interface; joins remote + local, maps DTOs -> entities,
                           maps all errors to Failure via core/network-exceptions
                           (`toFailure`), validates responses before caching. NEVER throws.

C) application/  (CALL)
   - usecases/    One file per action (`fetch-x.ts` -> `fetchX()`), thin, calls the
                  repository. File verb == function verb.
   - stores/      Zustand store (`<feature>-ui.store.ts`, `use<Feature>UiStore`) ONLY
                  for genuine client-side UI state (selection, wizard step, panel
                  open/closed). NEVER copy server data into it.
   - hooks/       The "provider" layer: `use-<x>.ts` hooks wrapping TanStack Query.
                  Queries via `useQuery`, writes via `useMutation` + key invalidation
                  in onSuccess. Query keys: arrays, feature-prefixed, defined ONCE in
                  a `<feature>-keys.ts` (or exported const) — never inline strings.
                  Unwrap Result here: success returns data; Failure becomes the single
                  controlled `throw` so TanStack Query exposes isError.

STEP 3 — WIRE THE PRESENTATION (bounded — read carefully)
Connect the existing views/components to the new hooks with the MINIMUM edits:
  - Replace static/dummy data with hook reads (`useX()` data).
  - Add loading / error / empty handling using the existing shared UI pieces; all four
    states (loading/error/empty/success) must be explicitly rendered.
  - Hook buttons/forms to mutation hooks; forms use React Hook Form + zodResolver,
    reusing the request DTO schema where possible.
  - Add `'use client'` ONLY to the leaf files that now need hooks — never to layouts
    or `page.tsx`; `page.tsx` stays thin (imports the view, nothing else).
You MUST NOT change layout, styling, JSX tree shape, copy, colors, spacing, or
Tailwind classes. Do not touch any OTHER feature's presentation. List every
presentation file you edited and what changed (one line each).
(If you prefer to wire manually, delete STEP 3 before running this prompt.)

STEP 4 — HARD RULES (these are also lint/QA failures)
- Import law (NEXTJS_CODING_STANDARDS.md §2): presentation -> application -> domain;
  infrastructure -> domain; everything may use core. UI never imports axios,
  repositories, or datasources. domain/ imports NOTHING framework-y. No cross-feature
  imports — shared things go to core/ or src/components/.
- State: server data lives ONLY in TanStack Query (never mirrored into Zustand, never
  fetched in useEffect). Client UI state ONLY in Zustand. No new global state libraries.
- TypeScript: strict; no `any` (use `unknown` + narrowing or Zod parse); exported
  functions have explicit return types; no enums (union types / `as const`); entities
  `readonly`; avoid non-null `!` — prefer `??`, `?.`, narrowing.
- Errors: repositories return Result and never throw; ALL error mapping through
  core `toFailure`; UI shows user-safe messages only (no raw server/internal details).
- DTOs vs entities: components never see DTOs; mapping happens in the repository impl.
- Naming: kebab-case files/folders; hooks `use*`; stores `use<X>Store`; schemas
  `<Name>Schema`; constants SCREAMING_SNAKE_CASE; no magic strings/numbers (paths,
  keys, limits -> named constants).
- Server/Client: components are Server Components by default; `'use client'` pushed to
  the lowest leaf that needs it. No browser APIs in server components. Secrets only in
  un-prefixed env vars; `NEXT_PUBLIC_*` only when the browser truly needs the value.
- No `console.log` in committed code. No commented-out code.
- Use ONLY the package versions already in package.json. Reuse core/ scaffolding.
  Create a shared piece ONLY if it is missing; if you create one, follow the folder
  structure doc and report it explicitly.

STEP 5 — SELF-VERIFY BEFORE YOU FINISH (the QA gate)
Run / reason through and report results:
  - `npx tsc --noEmit`        -> ZERO errors
  - `npm run lint`            -> ZERO errors & warnings
  - `npm run build`           -> compiles successfully
  - `npm test`                -> passing (if tests exist)
Then self-audit your generated code against the checklist in
NEXTJS_CODING_STANDARDS.md §11 and fix any violation before reporting done.

STEP 6 — OUTPUT
1. A file tree of everything you created/edited (grouped by layer).
2. The code, file by file.
3. The verification results from STEP 5.
4. Any gaps where the API contract was insufficient (do NOT guess).
5. Any shared core/ or components/ file you had to create, and why.

Build the <FEATURE_NAME> feature now.
```

---

## PROMPT A‑AUTH — Authentication / Session Add‑on

> Append this to **Prompt A** only when `FEATURE_NAME` is authentication/login/session.
> It overrides anything weaker for token handling.

```text
ADDITIONAL REQUIREMENTS — AUTH / SESSION (override weaker rules):

Session & token handling (authoritative):
- Follow the auth scheme in the API contract. Prefer httpOnly secure cookies set by the
  backend. Tokens/session identifiers must NEVER be stored in localStorage,
  sessionStorage, IndexedDB, Zustand persisted state, or non-httpOnly cookies — and
  never logged (no console.log of credentials, tokens, or OTPs).
- Configure the shared axios http-client with `withCredentials: true` so session
  cookies persist across requests. Do not create a second axios instance.
- CSRF: read the CSRF token from the documented endpoint/cookie/header, and attach it
  on every state-changing request (POST/PUT/PATCH/DELETE) via an axios interceptor in
  core/network. On a CSRF mismatch/error, refresh the CSRF token once and retry the
  request once.

401 / expiry flow (axios response interceptor):
  1. On 401 -> attempt session/token refresh (if the contract exposes a refresh
     endpoint) -> retry the original request ONCE. Queue concurrent 401s behind a
     single refresh (no refresh stampede).
  2. If refresh fails or no refresh endpoint -> perform full logout.

Logout MUST:
  - call the documented logout endpoint (so the server clears the httpOnly cookie),
  - clear the entire TanStack Query cache (`queryClient.clear()`),
  - reset all Zustand stores to their initial state,
  - remove any feature data persisted in localStorage/IndexedDB,
  - navigate with `router.replace('/login')` (no back-stack to authed screens).

Route protection:
  - Protect authenticated routes in `src/middleware.ts` (redirect unauthenticated
    users to /login; redirect authenticated users away from /login). Keep the matcher
    explicit — no protecting public/static assets.

Auto-login / boot:
  - Validate the session with the documented session/me endpoint before treating the
    user as logged in. Never trust client-side flags alone.
  - On a NEW login, clear the previous user's cached data first — queryClient.clear()
    + store resets (no User A -> User B leakage).

Security:
  - Errors surfaced to UI must be user-safe (generic "invalid credentials" — no raw
    server/internal details, no user-enumeration hints).
  - Auth secrets (API keys, signing secrets) only in server-side env vars — never
    NEXT_PUBLIC_*.
```

---

## PROMPT B — Bug Fix (surgical, change‑nothing‑else)

> Use after the developer tests and finds a problem. Fill in BOTH error sections.

```text
You are fixing ONE specific defect in this React/Next.js feature. Make the SMALLEST
possible change. Do not refactor, rename, reformat, restyle, "improve", or touch
anything that is not strictly required to fix this exact issue.

FEATURE: <<feature name>>

WHAT THE USER SEES IN THE UI:
<<describe the wrong behavior: page/route, steps to reproduce, expected vs actual,
 screenshot notes if any>>

CONSOLE / TERMINAL OUTPUT (paste exactly):
<<full browser-console error / Next.js terminal output / tsc / ESLint / runtime
 stack trace — include hydration warnings verbatim if present>>

RULES:
- First, read NEXTJS_CLEAN_ARCHITECTURE.md + NEXTJS_CODING_STANDARDS.md and the
  relevant files, then state the ROOT CAUSE in 1–3 lines BEFORE changing code.
- Change ONLY the file(s) required for this fix. List each file and the exact lines
  changed. If a fix seems to require touching presentation layout/styling/Tailwind
  classes, STOP and explain instead — do not change UI structure.
- Do NOT alter the API contract, other features, naming, formatting of unrelated code,
  or any working behavior. Do NOT add dependencies.
- Respect the layer rules while fixing: e.g. if the bug is bad data, the fix belongs in
  the repository/DTO layer — not a patch inside the component.
- Keep it compliant: the fix must still pass `npx tsc --noEmit`, `npm run lint`, and
  `npm run build`. Do not introduce new violations of the coding standards.
- If you are not confident of the root cause from the info given, ask for the specific
  additional log/file you need rather than guessing.

OUTPUT:
1. Root cause (concise).
2. The minimal diff (file + lines).
3. Why this is the smallest correct fix and what you deliberately left untouched.
4. Confirmation that tsc + lint + build still pass.
```
