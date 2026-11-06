# Next.js + React — Enterprise Clean Architecture Standard

A feature-first Clean Architecture for **React + Next.js (App Router)**, mirroring our
Flutter Clean Architecture standard. Same four layers, same inward-only dependency rule,
same naming discipline — adapted to the React ecosystem.

---

## 1. State management — the key mental shift

In Flutter, **Riverpod does everything**: server caching *and* local UI state. In React,
the enterprise-standard approach is to **split state into two kinds**, because one tool
isn't great at both.

| Kind of state | What it is | Tool | Riverpod analogy |
|---|---|---|---|
| **Server state** | Data that lives on the backend (lists, profiles) — needs caching, refetching, loading/error tracking | **TanStack Query** (React Query) | `FutureProvider` / `AsyncNotifier` caching |
| **Client / UI state** | Things only the frontend knows — modals open, theme, multi-step form progress, in-memory auth session | **Zustand** | `StateNotifierProvider` |
| **Validation / DTO parsing** | Shape + runtime validation of data crossing boundaries | **Zod** | `fromJson` + manual validation |
| **Forms** | Inputs, errors, submission | **React Hook Form** (+ Zod) | form controllers |

### Recommendation: TanStack Query + Zustand + Zod (+ React Hook Form)

**Why this over Redux Toolkit?** Redux is still valid for very large teams, but it's heavy
and verbose. **Zustand is the closest match to Riverpod's philosophy** — small, fine-grained,
testable stores with no boilerplate. And critically: **most of what you'd put in Redux is
actually *server* state, which TanStack Query handles far better** (it auto-manages
loading/success/error/empty — the exact states our Flutter `*_state.dart` files model by hand).

> **Big takeaway:** in Next.js, you write **far fewer explicit "state" classes** than in
> Flutter, because TanStack Query *gives you* `isLoading / isError / data / isFetching` for
> free. The `application/states` layer mostly disappears for server data and only survives
> for genuine client-only UI state.

---

## 2. Folder structure (feature-first)

```
src/
├── app/                          # Next.js App Router — ROUTES ONLY (thin)
│   ├── (dashboard)/
│   │   └── orders/
│   │       └── page.tsx          # imports a screen/view from the feature
│   └── layout.tsx
│
├── features/                     # ← feature-first home (like Flutter's lib/features)
│   └── orders/
│       │
│       ├── domain/               # A) DECLARE
│       │   ├── entities/
│       │   │   └── order.ts              # plain TS type/interface, readonly fields
│       │   └── repositories/
│       │       └── order-repository.ts   # INTERFACE only, no implementation
│       │
│       ├── infrastructure/       # B) DEFINE
│       │   ├── datasources/
│       │   │   ├── remote/
│       │   │   │   ├── order-api.ts              # axios/fetch client
│       │   │   │   ├── order-request.dto.ts      # + Zod schema
│       │   │   │   └── order-response.dto.ts     # + Zod schema, parse() = fromJson
│       │   │   └── local/
│       │   │       └── order-local-ds.ts         # localStorage/IndexedDB, ONLY if caching needed
│       │   └── repositories/
│       │       └── order-repository.impl.ts      # implements domain interface,
│       │                                          # joins remote+local, maps errors → Failure
│       │
│       ├── application/          # C) CALL
│       │   ├── usecases/
│       │   │   └── fetch-orders.ts               # thin: one action, calls repository
│       │   ├── stores/
│       │   │   └── order-ui.store.ts             # Zustand — client-only UI state
│       │   └── hooks/                            # ← THIS replaces Riverpod "providers"
│       │       ├── use-orders.ts                 # wraps TanStack Query + usecase
│       │       └── use-create-order.ts           # mutation hook
│       │
│       └── presentation/         # D) DISPLAY
│           ├── components/
│           │   └── order-card.tsx
│           └── views/
│               └── orders-screen.tsx             # the screen, used by app/.../page.tsx
│
├── core/                         # shared, cross-feature (like Flutter core/)
│   ├── error/
│   │   ├── failure.ts                    # Failure types (our Either<Failure,T>)
│   │   └── result.ts                     # Result type (neverthrow or custom)
│   ├── network/
│   │   ├── http-client.ts                # configured axios instance (= Dio)
│   │   └── network-exceptions.ts         # maps HTTP errors → Failure
│   └── config/
│       └── query-client.ts               # TanStack Query global config
│
└── components/                   # truly global, design-system UI (buttons, inputs)
```

---

## 3. Layer-by-layer mapping (Flutter → Next.js)

| Flutter | Next.js equivalent | What changes |
|---|---|---|
| `domain/entities` (immutable, `final`) | `domain/entities/*.ts` — `interface`/`type` with `readonly` | Same idea, just TypeScript |
| `domain/repositories` (abstract) | `domain/repositories/*.ts` — TS `interface` | Same — contracts only, no logic |
| `Future<Either<Failure, T>>` | `Promise<Result<T, Failure>>` (via **neverthrow**) | Same Result pattern; neverthrow gives `Ok`/`Err` |
| `data_sources/remote` (Dio/Retrofit) | `datasources/remote` (**axios** + functions) | Retrofit decorators → plain async functions |
| DTOs `fromJson/toJson` | `*.dto.ts` with **Zod** `.parse()` | Zod = runtime validation + type inference in one |
| `data_sources/local` (Hive) | `datasources/local` (localStorage/IndexedDB) | Caching only when truly needed (same rule) |
| `RepositoryImpl` | `*.repository.impl.ts` | Identical role: join remote+local, map errors |
| `application/states` (`*State`, freezed) | **Mostly gone** for server data (TanStack gives it free); Zustand store shape for UI state | Big simplification |
| `application/usecases` (one file per action) | `application/usecases/*.ts` (one fn per action) | Same — `fetch_x.dart` → `fetch-x.ts` |
| `application/providers` (Riverpod wiring) | `application/hooks/*.ts` (custom hooks) | **Custom hooks are the new "providers"** |
| `presentation/components` | `presentation/components` | Same |
| `presentation/screens` | `presentation/views` + thin `app/**/page.tsx` | Route file stays tiny, delegates to the view |

---

## 4. In simple English — what each layer is *for*

### A) `domain/` — the DECLARE layer (the "what")
This is the rulebook. It says *"an Order looks like this"* (entities) and *"here are the
things you can do with orders, but I'm not telling you how"* (repository interface). Zero
dependencies on axios, the network, or React. If you swapped the whole backend, this layer
wouldn't change.

### B) `infrastructure/` — the DEFINE layer (the "how / where data comes from")
This is the plumbing. `remote` talks to the API (axios) and validates the JSON with Zod.
`local` caches in the browser *only if the feature needs it*. The `repository.impl` is the
one class that actually *fulfills the promise* the domain made — it calls the API, falls
back to cache, and translates any failure into a clean `Failure` object so the UI never sees
a raw network error.

### C) `application/` — the CALL layer (the "orchestration")
- **usecases**: one tiny file per action ("fetch orders", "create order"). It just calls the
  repository. Keeps business actions named and testable.
- **stores (Zustand)**: pure client-side state — "is the filter sidebar open?", "which tab is
  selected?".
- **hooks (the Riverpod replacement)**: where it all wires together. `useOrders()` calls the
  usecase through **TanStack Query** and hands the component back `{ data, isLoading, isError }`.
  Components never touch the repository directly — they only call hooks.

### D) `presentation/` — the DISPLAY layer (the "screen")
Dumb, pure UI. `components` are reusable pieces; `views` are full screens. They call hooks
from the application layer and render. In Next.js, the actual route file
(`app/orders/page.tsx`) is *almost empty* — it just imports and renders the view. This keeps
routing separate from UI logic.

---

## 5. One feature flowing end-to-end (the "Orders" example)

```
User opens /orders
  → app/orders/page.tsx renders <OrdersScreen/>          (presentation)
  → OrdersScreen calls useOrders()                       (application/hooks)
  → useOrders() uses TanStack Query to run fetchOrders() (application/usecases)
  → fetchOrders() calls orderRepository.getOrders()      (domain interface)
  → OrderRepositoryImpl.getOrders():                     (infrastructure)
        - calls orderApi.list()  (axios + Zod parse)
        - on success: maybe cache to local
        - on error: maps to Failure via network-exceptions
        - returns Result<Order[], Failure>
  → TanStack Query exposes { data, isLoading, isError }
  → OrdersScreen renders loading / list / error state
```

**Dependency arrows only point inward** (presentation → application → domain ← infrastructure).
Domain knows nothing about the others — exactly like the Flutter setup.

---

## 6. Next.js-specific decisions to settle early

These have no Flutter equivalent and an enterprise team should agree on them up front:

- **Server Components vs Client Components**: Hooks (TanStack Query, Zustand) only run in
  **Client Components** (`"use client"`). For data you can fetch on the server, call the
  **usecase directly inside a Server Component** and skip the hook — or use TanStack Query's
  hydration to prefetch on the server and hydrate on the client (the enterprise pattern for
  SEO + speed). The Clean Architecture layers stay identical either way; only *where you call
  the usecase from* changes.
- **Result type library**: standardize on **neverthrow** for `Result<T, Failure>` so it
  mirrors the Dart `Either<Failure, T>` cleanly across the whole codebase.

---

## 7. Recommended dependencies

| Concern | Package |
|---|---|
| Server state / caching | `@tanstack/react-query` |
| Client / UI state | `zustand` |
| Validation + DTOs | `zod` |
| Forms | `react-hook-form` + `@hookform/resolvers` |
| HTTP client | `axios` |
| Result / Either type | `neverthrow` |
| Framework | `next`, `react`, `react-dom`, `typescript` |
