# React + Next.js — Coding Standards

Companion to **NEXTJS_CLEAN_ARCHITECTURE.md**. That doc explains *where* code lives;
this doc explains *how* the code inside it must be written.

Stack: **Next.js (App Router) · TypeScript · TanStack Query · Zustand · Zod · React Hook Form · Axios · neverthrow**

> **Golden rule:** if you're unsure where something goes or how to name it, find the
> closest existing example in the codebase and copy its pattern. Consistency beats cleverness.

---

## 1. Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Folders | `kebab-case` | `features/order-history/` |
| Files (all) | `kebab-case` | `fetch-orders.ts`, `order-card.tsx` |
| Components | `PascalCase` function, file stays kebab | `OrderCard` in `order-card.tsx` |
| Hooks | `use` prefix, camelCase | `useOrders`, `useCreateOrder` |
| Zustand stores | `use<X>Store` in `*-ui.store.ts` | `useOrderUiStore` |
| Usecases | **file verb == function verb** | `fetch-orders.ts` → `fetchOrders()` |
| Interfaces / types | `PascalCase`, no `I` prefix | `Order`, `OrderRepository` |
| DTO files | `*-request.dto.ts` / `*-response.dto.ts` | `order-response.dto.ts` |
| Zod schemas | `<Name>Schema` | `OrderResponseSchema` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| Env vars | `NEXT_PUBLIC_` only if needed in browser | `NEXT_PUBLIC_API_BASE_URL` |
| Booleans | `is/has/can/should` prefix | `isLoading`, `hasError` |
| Event handlers | `handle<Event>` (definition), `on<Event>` (prop) | `handleSubmit`, `onSubmit` |

**Why kebab-case files?** Git on macOS/Windows is case-insensitive; `OrderCard.tsx` vs
`ordercard.tsx` causes silent merge bugs. Kebab-case removes the problem entirely.

---

## 2. Layer rules (the import law)

Dependencies point **inward only**. A file may import only from its own layer or the
layers listed below it:

```
presentation  →  application  →  domain
infrastructure  →  domain
(everything)  →  core
```

| Layer | MAY import | MUST NEVER import |
|---|---|---|
| `domain/` | core/error only | axios, React, zustand, TanStack — **nothing framework-y** |
| `infrastructure/` | domain, core | React, hooks, components |
| `application/` | domain, infrastructure (impl wiring only), core | components, views |
| `presentation/` | application (hooks/stores), domain entities, core | repositories, datasources, axios |

```ts
// ❌ BAD — component talks straight to the API
import { httpClient } from '@/core/network/http-client';

// ✅ GOOD — component only knows the hook
import { useOrders } from '../../application/hooks/use-orders';
```

**Cross-feature imports are forbidden.** If `orders` needs something from `auth`,
move that thing to `core/` or `components/` (shared), or expose it via the feature's
public API — never deep-import another feature's internals.

---

## 3. TypeScript standards

- **`strict: true`** in `tsconfig.json`. Non-negotiable.
- **No `any`.** Use `unknown` + narrowing, or a Zod parse. If `any` is truly unavoidable,
  add a `// TODO:` comment explaining why.
- **Entities are immutable** — `readonly` fields, mirroring Flutter's `final`:
  ```ts
  export interface Order {
    readonly id: string;
    readonly total: number;
  }
  ```
- **Prefer `interface` for object shapes, `type` for unions/utilities.**
- **No enums** — use union types (`type Status = 'pending' | 'paid' | 'failed'`) or
  `as const` objects. They tree-shake better and play nicer with Zod.
- **Always use the `@/*` path alias** for cross-layer imports; relative paths (`../..`)
  only *within* a feature.
- **Explicit return types** on exported functions (usecases, repository methods).
  Inference is fine for private/local helpers.

---

## 4. Error handling (Result / Failure)

The UI must **never** see a raw `AxiosError` or unhandled `throw`. The same
`Either<Failure, T>` discipline as Flutter:

- Repositories return `Promise<Result<T, Failure>>` (neverthrow). They **never throw**.
- All error mapping happens in **one place**: `core/network/network-exceptions.ts` →
  `toFailure()`. Don't map errors ad hoc inside components.
- Hooks unwrap the `Result` and convert failures into something TanStack Query
  understands (throw inside `queryFn`) — that's the *only* place a Failure becomes a throw.
- Add a new variant to the `Failure` union when a new error category appears; never
  pass raw strings around as errors.

```ts
// ✅ repository — catches everything, returns Result
try {
  const res = await orderApi.list();
  return ok(OrderResponseSchema.array().parse(res.data));
} catch (e) {
  return err(toFailure(e));
}
```

---

## 5. Data validation (Zod / DTOs)

- **Every API response is `.parse()`d** with a Zod schema before it crosses into the
  domain. This is our `fromJson` + validation in one step. No "trust the backend".
- DTO schema + inferred type live together in the same `*.dto.ts` file:
  ```ts
  export const OrderResponseSchema = z.object({ id: z.string(), total: z.number() });
  export type OrderResponse = z.infer<typeof OrderResponseSchema>;
  ```
- **DTOs ≠ entities.** If the API shape differs from what the UI needs, map DTO → entity
  inside the repository impl. Components never see DTOs.
- Validate **before caching** (same rule as Flutter: validate responses before writing
  to local storage).

---

## 6. State management rules

**The one question to ask: "Does this data live on the server?"**

| If yes → TanStack Query | If no → Zustand | If it's a form → React Hook Form |
|---|---|---|
| lists, profiles, anything fetched | open/closed flags, selected tab, wizard step | inputs, validation, submit |

- **Never copy server data into Zustand.** No `useEffect(() => store.set(data))`.
  TanStack Query *is* the cache; duplicating it creates stale-state bugs.
- **Never fetch in `useEffect`.** Always through a hook in `application/hooks/` that
  wraps `useQuery`/`useMutation`.
- Query keys are **arrays, feature-prefixed, defined once**:
  ```ts
  export const orderKeys = {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', id] as const,
  };
  ```
- Mutations **invalidate** the relevant query keys in `onSuccess` — don't hand-patch caches
  unless you have a measured performance reason (then use optimistic updates).
- Zustand stores stay **small and per-feature** (`*-ui.store.ts`). One mega-store is a
  Redux smell — split it.
- Forms: React Hook Form + `zodResolver`. Reuse the DTO schema for validation when possible
  so the form and the API can never disagree.

---

## 7. Components & Server/Client rules

- **Server Component by default.** Add `'use client'` only when the file actually needs
  hooks, browser APIs, or event handlers. Push `'use client'` as far *down* the tree as
  possible — mark the leaf, not the layout.
- `app/**/page.tsx` is **thin**: import a view from `presentation/views/` and render it.
  No logic, no fetching, no markup beyond the view.
- **Components are dumb.** They receive data via props or call an application hook.
  They never contain business logic, mapping, or API calls.
- One component per file. If a file needs a second component, it's either a private
  sub-piece (fine, keep it unexported) or it deserves its own file.
- Always pass a stable `key` when rendering lists (entity `id`, never the array index
  unless the list can never reorder).
- Handle **all four UI states** explicitly — loading / error / empty / success — same as
  the Flutter state classes:
  ```tsx
  if (isLoading) return <OrdersSkeleton />;
  if (isError)   return <ErrorPanel />;
  if (!data?.length) return <EmptyOrders />;
  return <OrderList orders={data} />;
  ```

---

## 8. Styling

- **Tailwind CSS** is the standard (installed by the scaffold). Class names live in JSX;
  no separate `.css` files per component.
- Repeated class combinations → extract a **component**, not a CSS class.
- Design tokens (colors, spacing, fonts) go in the Tailwind config — never hardcode hex
  values in components ("no magic strings" applies to colors too).
- Conditional classes via a tiny helper (`clsx` / `cn`) — no string concatenation.

---

## 9. Project hygiene

- **ESLint + Prettier are law.** Code that fails `npm run lint` doesn't merge. Don't
  disable rules inline without a comment explaining why.
- **No magic strings/numbers.** Route paths, query keys, storage keys, limits → named
  constants in `core/config/` or the feature's own constants file (same rule as
  `HiveBoxes` in Flutter).
- **No `console.log` in committed code.** Use a logger in `core/` if you need structured
  logging.
- **Secrets never in code.** Server-only env vars stay un-prefixed; only expose
  `NEXT_PUBLIC_*` when the browser genuinely needs the value.
- Keep files **small**: a file over ~200 lines is a hint to split. A usecase should fit
  on one screen.
- Delete dead code — don't comment it out "for later". Git remembers.

---

## 10. Testing (minimum bar)

| Layer | What to test | Tool |
|---|---|---|
| domain | pure logic, entity invariants | Vitest/Jest |
| infrastructure | repository impl: mapping, Failure mapping (mock axios) | Vitest + msw |
| application | usecases + hooks (mock repository) | Vitest + Testing Library |
| presentation | the four UI states render correctly | Testing Library |

- Test **behavior, not implementation** — assert what the user sees, not internal calls.
- Every bug fix gets a regression test that fails without the fix.

---

## 11. Quick checklist (before you open a PR)

- [ ] Files/folders kebab-case, names follow §1
- [ ] No layer-rule violations (§2) — components don't import axios/repositories
- [ ] No `any`; entities `readonly`
- [ ] Repository returns `Result<T, Failure>`, never throws
- [ ] Every API response Zod-parsed; DTOs mapped to entities in the repo impl
- [ ] Server data in TanStack Query, UI data in Zustand — no duplication
- [ ] `'use client'` only where needed; `page.tsx` is thin
- [ ] Loading / error / empty / success all handled
- [ ] No magic strings, no `console.log`, lint passes
- [ ] Tests for the change

---

## 12. The standards in one paragraph (plain English)

Name everything in kebab-case files and predictable patterns so anyone can guess a file's
location. Let imports flow inward only — screens talk to hooks, hooks talk to usecases,
usecases talk to repositories, and only repositories touch the network. Validate every
byte from the API with Zod before trusting it, and turn every error into a clean `Failure`
inside the repository so the UI just shows friendly states. Keep server data in TanStack
Query and never copy it anywhere; keep tiny bits of UI state in Zustand; keep forms in
React Hook Form. Components stay dumb and small, pages stay thin, magic strings don't
exist, and every screen explicitly shows loading, error, empty, and success. If you follow
the folder structure and these habits, the codebase stays predictable no matter how many
features or developers are added.
