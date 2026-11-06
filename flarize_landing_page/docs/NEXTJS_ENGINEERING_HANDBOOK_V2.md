# Frontend Engineering Handbook — Next.js SaaS

**Status:** Official standard · **Applies to:** all Next.js App Router applications
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · TanStack Query 5 · Zustand 5 · Zod 4 · React Hook Form · native `fetch` · Tailwind 4

> This is a fresh handbook. It is inspired by Clean Architecture but **not** a port of it.
> The App Router is already an architecture — our job is to add *discipline*, not *ceremony*.

---

## 0. The five principles (read this first)

Every rule in this document descends from one of these. When a rule and a principle
conflict, the principle wins and the rule is a bug.

1. **The framework is the architecture.** Server Components, the Server/Client boundary,
   colocated data fetching, and route files are our layers. We do not rebuild them in
   userland.
2. **One source of truth per piece of state.** Server data lives in the server cache (or
   TanStack Query). UI state lives in Zustand or `useState`. URL state lives in the URL.
   Never mirror one into another.
3. **Every abstraction must pay rent.** A file, folder, wrapper, or interface must remove
   more complexity than it adds. Delegation-only layers are deleted on sight.
4. **Validate at the boundary, trust within.** Untrusted data (network, `params`,
   `searchParams`, form input, `localStorage`) is parsed with Zod at the edge. Past the
   edge, types are believed.
5. **Optimize for the reader.** Code is read 10× more than written. Predictable structure,
   honest names, and colocation beat cleverness and DRY-for-its-own-sake.

---

## 1. Architecture: feature-first, layer-on-demand

### 1.1 Why feature-first (not layer-first)

Layer-first (`components/`, `hooks/`, `services/`, `types/` at the top) forces a developer
touching one feature to edit four distant folders, and makes deletion dangerous (what else
imports this?). **Feature-first colocates everything a feature owns**, so a feature is a
unit you can build, reason about, own, and *delete* as a whole.

### 1.2 The project skeleton

```
src/
├── app/                      # ROUTES ONLY. Thin. Composes features. (see §2)
│   ├── (marketing)/
│   ├── (app)/
│   │   └── orders/
│   │       ├── page.tsx          # Server Component: fetch + compose
│   │       ├── loading.tsx       # streaming fallback
│   │       ├── error.tsx         # route error boundary ('use client')
│   │       └── [id]/page.tsx                      
│   ├── layout.tsx
│   └── globals.css
│
├── features/                 # THE HOME OF PRODUCT CODE
│   └── orders/
│       ├── components/            # feature-local UI (server + client)
│       ├── hooks/                 # client hooks: useQuery/useMutation wrappers
│       ├── server/                # server-only: data access + Server Actions ('server-only')
│       │   ├── orders.queries.ts
│       │   └── orders.actions.ts
│       ├── schemas/               # Zod schemas + inferred types (the contract)
│       ├── store.ts               # Zustand — only if the feature has client UI state
│       └── index.ts               # PUBLIC API — the only legal import surface (§1.5)
│
├── shared/                   # cross-feature, non-design-system code
│   ├── api/                      # fetch client, error mapping, result helpers
│   ├── auth/                     # session helpers used by many features
│   ├── config/                   # env parsing, query-client, constants
│   ├── lib/                      # pure utilities (cn, formatters, date)
│   └── query/                    # query key registry, shared cache helpers
│
└── ui/                       # DESIGN SYSTEM — dumb, generic, feature-agnostic
    ├── button.tsx
    ├── input.tsx
    └── ...
```

**What changed from the old model, and why:**

| Old (v1) | New (v2) | Reason |
|---|---|---|
| 4 mandatory folders per feature | **Add a folder only when the feature needs it** | A "list one thing" feature is `schemas/ + server/ + components/`. No empty `domain/`. Principle #3. |
| `usecases/` | **deleted** | `fetchOrders()` that only calls a repo is a delegation tax. A hook or Server Component calls the data function directly. |
| `domain/repositories` interface + `infrastructure/*.impl.ts` class | **`server/*.queries.ts` — plain typed async functions** | TS has no runtime DI and you never ship a second implementation. Interfaces + singleton classes simulate a problem you don't have. Tests mock the module. |
| `presentation/views` + `presentation/components` | **`components/`** | The App Router's `page.tsx` *is* the view. A separate "view" file is one indirection too many. |

> **Rule:** the smallest legal feature is **one file** (`index.ts`) re-exporting a component.
> The largest grows folders as it earns them. Never scaffold empty folders "for later."

### 1.3 The layering that actually matters

We keep exactly **one** Clean-Architecture idea because it pays rent: **dependencies point
toward stability.** In frontend terms:

```
  app/ (routes)  ──▶  features/*  ──▶  shared/ + ui/
                          │
                          └── schemas/ (the contract) ◀── depended on by everything in the feature
```

- **`schemas/` is the stable core** of a feature — the Zod contract and inferred types.
  Everything else in the feature depends on it; it depends on nothing but Zod.
- **`server/` and `hooks/` and `components/` are the volatile shells.** They change often;
  that's fine, because nothing stable depends on their internals.
- **`app/` is disposable glue.** Routes compose features and own nothing.

This is Clean Architecture's *one* durable insight (stable things shouldn't depend on
volatile things) without the four-ring diagram, the DTOs-vs-entities double-typing, or the
interface-per-class ceremony.

### 1.4 DTO vs Entity: collapse it unless it earns its keep

v1 mandated separate DTO types and Entity types with a mapper in between. **Default to one
type — the Zod-inferred schema type — and only introduce a distinct domain entity when the
API shape genuinely fights the UI** (snake_case explosion, nested envelopes, fields the UI
must compute). When you do map, map in the `server/queries` function, once.

```ts
// schemas/order.schema.ts
export const OrderSchema = z.object({
  id: z.string(),
  total: z.number(),
  status: z.enum(['pending', 'paid', 'failed']),
  createdAt: z.iso.datetime(),
});
export type Order = z.infer<typeof OrderSchema>;   // this IS the entity, 90% of the time
```

**Why:** double-typing every model doubles the maintenance and creates two things that drift.
Introduce the second type only when the mapping does real work. Principle #3.

### 1.5 Public API per feature (`index.ts`)

A feature exposes a **deliberate public surface**; its internals are private.

```ts
// features/orders/index.ts
export { OrderList } from './components/order-list';
export { useOrders } from './hooks/use-orders';
export type { Order } from './schemas/order.schema';
// server actions/queries are imported by app/ via deep path ON PURPOSE (see below)
```

- **Client code imports features only through the barrel:** `import { OrderList } from '@/features/orders'`.
- **Cross-feature deep imports are forbidden** (`@/features/orders/components/internal-thing`).
  Enforce with ESLint `no-restricted-imports`. If feature A needs B's internals, either B
  should export it, or the shared thing belongs in `shared/`.
- **Server files are the exception:** `server/*.actions.ts` and `server/*.queries.ts` are
  imported by `app/` via their real path, because barrel-exporting server-only code risks
  pulling `'server-only'` modules into a client bundle. Keep the server surface explicit.

> **Why not barrel *everything*?** Barrels defeat tree-shaking when they re-export server
> code into client graphs and can create import cycles. Barrel the *client* API; keep the
> *server* API on explicit paths.

---

## 2. Next.js: Server-first by default

This is the chapter the old handbook was missing. Internalize the decision tree.

### 2.1 The default is a Server Component

Every component is a **Server Component** until it proves it needs the client. Server
Components render on the server, ship **zero JS** for themselves, can `await` data directly,
and keep secrets server-side.

```tsx
// app/(app)/orders/page.tsx — Server Component (no 'use client')
import { getOrders } from '@/features/orders/server/orders.queries';
import { OrderList } from '@/features/orders';

export default async function OrdersPage() {
  const orders = await getOrders();      // runs on the server, no client fetch, no waterfall
  return <OrderList orders={orders} />;
}
```

Compare to v1's `auth-screen.tsx`, which was `'use client'` and fetched over the network from
the browser. That pattern throws away SSR, streaming, and cache dedup, and ships the data
layer to users. **Do not do that.**

### 2.2 When to reach for `'use client'`

Add `'use client'` **only** when the component needs one of:

- React state/effects (`useState`, `useReducer`, `useEffect`)
- Event handlers (`onClick`, `onChange`, …)
- Browser-only APIs (`window`, `localStorage`, `IntersectionObserver`)
- Client-only libraries (TanStack Query hooks, Zustand, charting libs, RHF)

**Push the boundary to the leaves.** Mark the interactive button, not the page that contains
it. A `'use client'` file makes its whole import subtree client code.

```
❌ 'use client' on OrdersPage        → entire page + children shipped to browser
✅ Server OrdersPage
     └─ Server OrderList
          └─ 'use client' AddToCartButton   ← only the interactive leaf is client
```

**The composition escape hatch:** a Client Component can render Server Components passed as
`children`/props. Use this to keep server content inside a client shell (e.g. a client tab
container wrapping server-rendered panels).

### 2.3 Where each special file belongs

| File | Runs as | Purpose | Rule |
|---|---|---|---|
| `page.tsx` | Server (default) | Fetch + compose a route | Thin. No business logic, no markup libraries — delegate to feature components. |
| `layout.tsx` | Server (default) | Shared shell, providers | Keep stable across navigations; don't put per-page data here. Client providers go in a small `'use client'` `providers.tsx` rendered by the root layout. |
| `template.tsx` | Server | Like layout but **remounts** per navigation | Rare. Use only when you need fresh state/effects on every navigation (e.g. enter animations). |
| `loading.tsx` | Server | Suspense fallback for the segment | Provide skeletons for any segment that awaits data. This is how you stream. |
| `error.tsx` | **Client** (required) | Segment error boundary | Must be `'use client'`; receives `error` + `reset`. Keep one per meaningful segment. |
| `not-found.tsx` | Server | 404 UI; triggered by `notFound()` | Call `notFound()` from a query when an entity is missing. |
| `route.ts` | Server | HTTP endpoint (Route Handler) | **We don't use these** — frontend-only, no `app/api/` (§2.7). Only for external webhooks/OAuth if ever needed. |
| `metadata` / `generateMetadata` | Server | SEO/OG tags | Prefer static `metadata`; use `generateMetadata` for dynamic titles. Never set `<title>` by hand. (§2.8) |
| `sitemap.ts` / `robots.ts` / `opengraph-image.tsx` | Server | SEO file conventions | Dynamic SEO assets — file conventions, **not** Route Handlers (§2.8). |

### 2.4 Streaming and Suspense (the performance superpower)

Don't block the whole page on the slowest query. Wrap slow, independent sections in
`<Suspense>` so the shell streams instantly and each section fills in as its data resolves.

```tsx
export default function DashboardPage() {
  return (
    <>
      <Header />                                   {/* instant */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />                                  {/* awaits its own data, streams in */}
      </Suspense>
      <Suspense fallback={<FeedSkeleton />}>
        <ActivityFeed />                           {/* independent; streams separately */}
      </Suspense>
    </>
  );
}
```

**Why:** perceived performance. TTFB stays low, the user sees structure immediately, and a
slow widget never holds the fast ones hostage. `loading.tsx` is Suspense for the whole
segment; explicit `<Suspense>` is for intra-page granularity.

### 2.5 Next 16 / React 19 realities you must know

These differ from older Next and from most training data — get them right:

- **Async request APIs.** `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()`
  are **Promises**. `await` them.
  ```tsx
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  }
  ```
- **`fetch` is not cached by default.** Opt into caching explicitly per request:
  `fetch(url, { cache: 'force-cache' })` or `fetch(url, { next: { revalidate: 60, tags: ['orders'] } })`.
  Reason about every fetch's freshness on purpose.
- **`use cache` directive** marks a function/component's result as cacheable — use it for
  expensive server computations, paired with `revalidateTag`.
- **`use(promise)`** unwraps a promise in a Client Component (with Suspense). Pass a promise
  from a Server Component to a Client Component and `use()` it instead of a fetch-on-mount.
- **Actions & form state:** `useActionState`, `useOptimistic`, `useFormStatus`, and `<form action={serverAction}>` are the React 19 form primitives (§4.4).
- **Ref is a prop.** No `forwardRef` in React 19 — accept `ref` directly in props.

### 2.6 Server Actions (the default mutation path)

Mutations go through **Server Actions** — server functions callable from the client without
you hand-writing an endpoint or a client fetch.

```ts
// features/orders/server/orders.actions.ts
'use server';
import { CreateOrderSchema } from '../schemas/order.schema';
import { revalidateTag } from 'next/cache';

export async function createOrder(input: unknown) {
  const parsed = CreateOrderSchema.safeParse(input);          // validate at the boundary
  if (!parsed.success) return { ok: false as const, error: 'INVALID', issues: parsed.error.flatten() };

  const order = await apiFetch('/orders', {                    // POST to YOUR external API
    method: 'POST', body: JSON.stringify(parsed.data), schema: OrderSchema,
  });
  revalidateTag('orders');                                     // refresh Next's server cache
  return { ok: true as const, data: order };
}
```

**Rules for Server Actions:**
- Always `'use server'` at the top of the module (or inline).
- **Re-validate every input with Zod inside the action.** A Server Action is a public HTTP
  endpoint — treat args as hostile.
- **Return a Result-shaped value** (`{ ok, data } | { ok, error }`) rather than throwing for
  *expected* failures (validation, business rules). This is the one place Result-as-value is
  correct, because the form needs to render the error. Throw only for *unexpected* failures.
- Call `revalidatePath`/`revalidateTag` to sync the server cache; call
  `queryClient.invalidateQueries` on the client when the same data also lives in Query.

### 2.7 We do not have an `app/api/` folder

**This is a frontend project.** The real backend — database, auth, domain logic, the API at
`env.API_BASE_URL` — is owned elsewhere. We consume it; we do not build it. Concretely:

- **Reads:** Server Components `await` a query function that calls the external API (§3.2).
- **Writes:** Server Actions call the external API and revalidate the cache (§2.6).

Neither needs a Route Handler, so **there is no `app/api/` folder.** Building `route.ts`
endpoints to feed our own React UI would reintroduce the client-fetch waterfall Server
Components exist to remove — the browser calling *our* endpoint that calls *their* API — for
no benefit.

> **When would that change?** Only if something that is **not our React app** must reach us
> over raw HTTP — a payment/auth **webhook** (Stripe, Clerk) or an **OAuth callback** posting
> to a URL we own. Those are the *only* reasons to add `app/api/`, and until we integrate one,
> the folder simply doesn't exist. Note: dynamic `sitemap`/`robots`/`og-image` are **not**
> Route Handlers — they use dedicated `sitemap.ts` / `robots.ts` / `opengraph-image` file
> conventions (§2.8).

### 2.8 SEO (a first-class reason we render on the server)

SEO is not a plugin we bolt on — it is a *consequence* of §2.1. A client SPA ships an empty
`<div id="root">` to crawlers; our Server Components ship fully-rendered HTML with real
content, titles, and links. Going Server-first *is* the SEO strategy. The rules below make it
deliberate.

#### Index the right routes, `noindex` the rest

The single most important SEO decision in a SaaS: **public marketing pages must be indexable;
authenticated app pages must not be.** Google indexing your logged-out dashboard shell is a
bug, not a win.

| Route group | Indexed? | How |
|---|---|---|
| `(marketing)/` — home, pricing, blog, features | ✅ Yes | full metadata, canonical, in `sitemap.ts` |
| `(app)/` — dashboard, settings, anything behind auth | ❌ No | `robots: { index: false }` in the group's `layout.tsx` metadata |
| Legal/utility — `/reset-password`, `/verify` | ❌ No | `noindex` |

```ts
// app/(app)/layout.tsx — one place turns off indexing for the whole authed app
export const metadata: Metadata = { robots: { index: false, follow: false } };
```

#### Metadata: typed, per-route, never hand-rolled `<head>`

- Export a static `metadata: Metadata` for fixed pages; use `async generateMetadata()` when
  the title/description depend on data (e.g. a blog post).
- **Never write `<title>`/`<meta>` in JSX.** The Metadata API dedupes, merges with parent
  layouts, and streams correctly; manual tags fight it.
- Set a **`metadataBase`** once in the root layout so relative OG image URLs resolve to
  absolute ones.
- Always provide `title`, `description`, `alternates.canonical`, and `openGraph` +
  `twitter` for public pages.

```ts
// app/(marketing)/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;                 // Next 16: params is a Promise
  const post = await getPost(slug);              // reuse the same query the page uses
  if (!post) return {};                          // page will notFound()
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },  // avoid duplicate-content penalties
    openGraph: { title: post.title, description: post.excerpt, type: 'article', images: [post.cover] },
    twitter: { card: 'summary_large_image', title: post.title },
  };
}
```

#### Canonical URLs

Set `alternates.canonical` on every indexable page. It's the fix for duplicate content from
query strings, trailing slashes, and pagination — the most common silent SEO leak in SaaS
marketing sites.

#### `sitemap.ts` and `robots.ts` (file conventions, not endpoints)

Generate these from the same query functions that build your pages, so the sitemap never
drifts from reality. They are **not** `app/api/` Route Handlers (§2.7).

```ts
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();       // only public, indexable content
  return [
    { url: 'https://clozr.com', changeFrequency: 'weekly', priority: 1 },
    ...posts.map((p) => ({ url: `https://clozr.com/blog/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
// app/robots.ts — allow marketing, disallow the app surface
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/settings', '/api'] }, sitemap: 'https://clozr.com/sitemap.xml' };
}
```

#### Structured data (JSON-LD)

For content that earns rich results — articles, products, FAQs, breadcrumbs — emit JSON-LD
from the **Server Component** so crawlers get it in the initial HTML.

```tsx
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: post.title }) }} />
```

Validate against Google's Rich Results Test. Keep the object typed via `schema-dts` if it
grows.

#### Social preview images

Use the **`opengraph-image.tsx`** file convention (static file, or `ImageResponse` for
dynamic per-page cards). Colocate it in the route segment; Next wires the `og:image` tag
automatically — no manual meta tags.

#### Core Web Vitals are an SEO ranking factor

SEO isn't just tags — Google ranks on real UX. The performance rules in §7 are therefore SEO
rules too: `next/image` (LCP + CLS), `next/font` (CLS), streaming/Suspense (LCP/TTFB), and a
lean client bundle (INP). Measure with Lighthouse on the **marketing** routes specifically.

#### SEO checklist (public/marketing routes)

- [ ] `metadata`/`generateMetadata` with title, description, canonical, OG, Twitter
- [ ] `metadataBase` set once in the root layout
- [ ] Page content rendered by a **Server Component** (real HTML for crawlers)
- [ ] Included in `sitemap.ts`; allowed in `robots.ts`
- [ ] Authed/utility routes explicitly `noindex`
- [ ] JSON-LD where rich results apply; `opengraph-image` present
- [ ] Semantic headings in order, descriptive `alt`, meaningful link text (overlaps §10 a11y)
- [ ] Core Web Vitals green in Lighthouse

---

## 3. Data layer

### 3.1 The fetch client (replace Axios with typed `fetch`)

**Why not Axios?** Axios can't run inside Server Components against Next's cache, doesn't
integrate with `revalidateTag`/`revalidate`, adds ~13KB to client bundles, and in v1 leaked
the API base URL via `NEXT_PUBLIC_`. Native `fetch` is server-capable, cache-aware, and free.
Wrap it thinly for auth headers, base URL, and error normalization.

```ts
// shared/api/client.ts  — server-usable typed fetch
import 'server-only';                       // guarantees this never enters a client bundle
import { env } from '@/shared/config/env';
import { ApiError } from './errors';

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { schema: z.ZodType<T> } & { next?: NextFetchRequestConfig },
): Promise<T> {
  const res = await fetch(`${env.API_BASE_URL}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(await authHeaders()), ...init.headers },
  });
  if (!res.ok) throw ApiError.fromResponse(res);   // typed, mapped once (see §3.4)
  return init.schema.parse(await res.json());       // validate at the boundary (§Principle 4)
}
```

- `API_BASE_URL` is **server-only** (no `NEXT_PUBLIC_`). The browser never sees it.
- Every call passes a Zod `schema`; parsing is not optional.
- For client-side needs (rare), expose only what the browser must call, through a Server
  Action or a minimal client wrapper.

### 3.2 Query functions (the data access layer — no repositories, no usecases)

```ts
// features/orders/server/orders.queries.ts
import 'server-only';
import { apiFetch } from '@/shared/api/client';
import { OrderSchema } from '../schemas/order.schema';
import { notFound } from 'next/navigation';

export async function getOrders() {
  return apiFetch('/orders', { schema: OrderSchema.array(), next: { tags: ['orders'], revalidate: 60 } });
}

export async function getOrder(id: string) {
  const order = await apiFetch(`/orders/${id}`, { schema: OrderSchema.nullable(), next: { tags: [`order:${id}`] } });
  if (!order) notFound();
  return order;
}
```

This **one file** replaces v1's `domain/repositories/order-repository.ts` (interface) +
`infrastructure/repositories/order-repository.impl.ts` (class) + `datasources/remote/order-api.ts`
+ `application/usecases/fetch-orders.ts`. Four files → one, with no loss of testability
(§8 mocks the module) and a large gain in readability. Principle #3 in action.

### 3.3 Error strategy: throw typed errors, Result only at form boundaries

v1 wrapped every repository call in `neverthrow` `Result`, then admitted hooks must *unwrap
and re-throw* for TanStack Query. That's ceremony with negative value. Our policy:

| Context | Strategy | Why |
|---|---|---|
| Server Component / `queries.ts` | **Throw** a typed `ApiError` | `error.tsx` and Suspense catch it. Throwing *is* the framework's error channel. |
| TanStack Query `queryFn` | **Throw** | Query wants a throw to populate `isError`. Wrapping in Result just to unwrap is pure tax. |
| Server Action → form | **Return `{ ok, error }`** (Result-shaped value) | The form must *render* the error; an error you display is a value, not an exception. |
| Truly unexpected (bug, 500) | **Throw / let it bubble** | Global `error.tsx` + logging. Don't swallow. |

We do **not** adopt `neverthrow` as a project-wide dependency. A plain discriminated union
(`{ ok: true; data } | { ok: false; error }`) covers the form case with zero library weight.

### 3.4 Typed errors

```ts
// shared/api/errors.ts
export type ApiErrorCode = 'network' | 'unauthorized' | 'forbidden' | 'notFound' | 'validation' | 'server' | 'unknown';

export class ApiError extends Error {
  constructor(readonly code: ApiErrorCode, message: string, readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
  static fromResponse(res: Response): ApiError {
    const map: Record<number, ApiErrorCode> = { 401: 'unauthorized', 403: 'forbidden', 404: 'notFound', 422: 'validation' };
    return new ApiError(map[res.status] ?? (res.status >= 500 ? 'server' : 'unknown'), res.statusText, res.status);
  }
}
```

Map HTTP → `ApiErrorCode` in **one place** (`fromResponse`). Components branch on
`error.code`, never on raw status numbers. This preserves v1's best error idea (one mapping
site, a closed set of failure categories) without the Result overhead.

---

## 4. State management — the complete decision system

### 4.1 The decision tree

```
Where does this state's source of truth live?

├─ On the server (DB/API)?
│    ├─ Read in a Server Component only?      → await a query function. No client state at all.
│    └─ Needs client interactivity/refetch/optimistic?
│                                             → TanStack Query (hydrated from the server)
│
├─ In the URL? (filters, tab, page, sort, search)
│                                             → searchParams / useSearchParams. The URL IS the state.
│
├─ Ephemeral to one component? (input focus, hover, local toggle)
│                                             → useState / useReducer
│
├─ Shared client UI across components? (sidebar open, theme, command palette)
│                                             → Zustand (small, per-domain store)
│
├─ A form?                                    → React Hook Form + zodResolver
│
└─ Derivable from the above?                  → COMPUTE it. Never store it. (§4.6)
```

### 4.2 Server data — TanStack Query, hydrated (not client-fetched)

Default to reading server data in Server Components. Reach for TanStack Query when the client
must **refetch, paginate, mutate, or optimistically update**. When you do, **hydrate from the
server** so there's no client fetch waterfall and the first paint has data:

```tsx
// app/(app)/orders/page.tsx (Server Component)
export default async function Page() {
  const qc = getQueryClient();
  await qc.prefetchQuery({ queryKey: orderKeys.list(), queryFn: getOrders });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <OrdersClient />        {/* useOrders() reads from the hydrated cache — no refetch */}
    </HydrationBoundary>
  );
}
```

**Iron rule (kept from v1, sharpened):** *never copy server data into Zustand or
`useState`.* No `useEffect(() => setState(query.data))`. The Query cache is the source of
truth; mirroring it creates two states that drift. If you need a derived view, derive it
(§4.6).

### 4.3 Global UI state — Zustand, small and sliced

Zustand is for **client-only** UI that several components share.

```ts
// features/orders/store.ts
export const useOrderUiStore = create<OrderUiState>()((set) => ({
  selectedIds: new Set<string>(),
  toggle: (id) => set((s) => { const n = new Set(s.selectedIds); n.has(id) ? n.delete(id) : n.add(id); return { selectedIds: n }; }),
}));
```

- **One store per domain concern**, not one global mega-store (a Redux smell).
- **Select narrowly:** `useOrderUiStore((s) => s.selectedIds)` — not the whole store — to
  avoid re-rendering on unrelated changes.
- **Never** put server data, form state, or URL-derivable state here.

### 4.4 Forms — React Hook Form + Zod (+ Server Actions)

- One schema drives **both** the client form and the server validation. Define it in
  `schemas/`, use `zodResolver` on the client and `.safeParse` in the Server Action. The form
  and the API can never disagree.
- For simple forms, prefer React 19 `<form action={serverAction}>` + `useActionState` +
  `useFormStatus` (progressive enhancement, works without JS).
- For complex, highly-interactive forms (dynamic fields, cross-field validation, wizards),
  use RHF for client UX and still submit to a Server Action that re-validates.

```tsx
'use client';
const [state, formAction, pending] = useActionState(createOrder, null);
// render state?.issues under fields; disable submit while `pending`
```

### 4.5 URL as state (the underused option)

Filters, pagination, active tab, sort, and search queries belong in the **URL**, not
`useState`/Zustand. Benefits: shareable/bookmarkable, survives refresh, back-button works,
and Server Components can read `searchParams` to fetch the right data server-side. Parse
`searchParams` with Zod like any other boundary input.

### 4.6 Derived state — compute, never store

If a value can be computed from existing state, compute it during render. Store only inputs.

```ts
// ❌ storing derived state → drifts, needs syncing effects
const [total, setTotal] = useState(0);
useEffect(() => setTotal(items.reduce((s, i) => s + i.price, 0)), [items]);

// ✅ derive it
const total = items.reduce((s, i) => s + i.price, 0);
```

Wrap in `useMemo` **only** when the computation is measurably expensive (§7). Cheap
derivations don't need memoization.

### 4.7 Persisted state

Use Zustand's `persist` middleware for genuine client persistence (theme, dismissed banners,
draft-in-progress). **Validate on rehydrate with Zod** (`localStorage` is untrusted input —
schema versions change, users edit it). Never persist server data (Query owns its own
persistence via `persistQueryClient` if you need offline).

### 4.8 State ownership summary

| State | Tool | Source of truth | Never do |
|---|---|---|---|
| Server data (read-only render) | Server Component `await` | Server cache | fetch on client |
| Server data (interactive) | TanStack Query (hydrated) | Query cache | mirror into Zustand |
| Filters/tab/page/search | URL `searchParams` | The URL | duplicate in `useState` |
| Shared client UI | Zustand (sliced) | The store | store server data |
| Local ephemeral | `useState`/`useReducer` | The component | lift prematurely |
| Forms | RHF + Zod | RHF | hand-roll validation |
| Derived | compute in render | its inputs | store + sync via effect |

---

## 5. Caching strategy (two caches, one discipline)

You are managing **two** caches: **Next's server cache** (Data Cache / Full Route Cache,
keyed by `fetch` tags/paths) and **TanStack Query's client cache** (keyed by query keys).
Know which owns each piece of data.

### 5.1 Query key registry (per feature, single source)

```ts
// features/orders/hooks/order-keys.ts
export const orderKeys = {
  all:    ['orders'] as const,
  lists:  () => [...orderKeys.all, 'list'] as const,
  list:   (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};
```

- **Hierarchical arrays**, defined **once** per feature, most-general → most-specific. This
  makes invalidation surgical: `invalidateQueries({ queryKey: orderKeys.lists() })` clears
  every list without touching details.
- Filters are part of the key. Never build keys ad hoc at call sites.

### 5.2 Cache timing policy (defaults, override with intent)

| Data volatility | `staleTime` | `gcTime` | Example |
|---|---|---|---|
| Static / reference | `Infinity` | `Infinity` | countries, plan tiers |
| Slow-changing | `5–10 min` | `30 min` | user profile, settings |
| Normal | `30–60 s` | `5 min` (default) | lists, dashboards |
| Real-time-ish | `0` (+ refetch interval) | `5 min` | live counters, presence |

- **`staleTime`** = how long data is "fresh" (no background refetch). Set it deliberately per
  query; the global default (`60s`) is a starting point, not a law.
- **`gcTime`** = how long unused data stays in memory before garbage collection.
- **`retry`:** default `1` for queries; **`0` for mutations** (retrying a POST can
  double-submit). Never retry `4xx`.

### 5.3 Invalidation vs. optimistic updates

- **Default: invalidate on success.** After a mutation, `invalidateQueries` the affected keys
  and let Query refetch the truth. Simple, correct, hard to get wrong.
- **Optimistic updates: only when latency is user-visible and the update is safe to reverse**
  (toggles, likes, reorder, checkbox). Implement the full `onMutate`/`onError` rollback /
  `onSettled` invalidate triangle — a half-done optimistic update is worse than none.

```ts
useMutation({
  mutationFn: toggleStar,
  onMutate: async (id) => {
    await qc.cancelQueries({ queryKey: orderKeys.detail(id) });
    const prev = qc.getQueryData(orderKeys.detail(id));
    qc.setQueryData(orderKeys.detail(id), (o) => o && { ...o, starred: !o.starred });
    return { prev };                                   // rollback context
  },
  onError: (_e, id, ctx) => qc.setQueryData(orderKeys.detail(id), ctx?.prev),
  onSettled: (_d, _e, id) => qc.invalidateQueries({ queryKey: orderKeys.detail(id) }),
});
```

### 5.4 Prefetching, pagination, infinite

- **Prefetch** on the server (`prefetchQuery` + `HydrationBoundary`, §4.2) or on
  intent (hover/focus of a link) with `queryClient.prefetchQuery`.
- **Pagination:** keep `placeholderData: keepPreviousData` so the page doesn't flash empty
  while the next page loads. Page/cursor is part of the query key.
- **Infinite lists:** `useInfiniteQuery` with a `getNextPageParam`; drive fetches with an
  `IntersectionObserver` sentinel, not a scroll listener.

### 5.5 Cache ownership rules

- **A piece of server data is owned by exactly one cache layer.** If a route reads it in a
  Server Component with `revalidateTag`, that's the owner. If the client mutates/refetches it
  interactively, TanStack Query owns it. When both are involved (hydrated pattern), the
  Server Action must invalidate **both**: `revalidateTag('orders')` *and* the client
  `invalidateQueries`.
- **Tags are the coordination key.** Name them consistently (`'orders'`, `` `order:${id}` ``)
  and treat them as constants (§9), not inline strings.

---

## 6. Component design

### 6.1 Smart vs. dumb, expressed as server vs. client + container vs. presentational

| | Fetches/mutates | Pure props → UI |
|---|---|---|
| **Server** | `page.tsx`, server "container" components (default home for data) | server presentational (most `ui/` and feature display) |
| **Client** | `'use client'` containers using hooks (Query/Zustand/RHF) | `'use client'` leaves with interactivity but no data logic |

- **Containers** own data/state and pass plain props down. **Presentational** components take
  props and render — no hooks beyond local UI, no data access. Keep them separable so
  presentational components stay trivially testable and reusable.
- Business logic lives in `server/` (queries/actions) and `hooks/`. Components **orchestrate
  and render**; they don't compute business rules inline.

### 6.2 Composition over configuration

Prefer composing small components and passing `children` over a component with 15 boolean
props. A `<Card>` with `<Card.Header>`/`<Card.Body>` beats `<Card showHeader headerBold ...>`.
This also enables the server-in-client pattern (§2.2).

### 6.3 Props

- **Explicit prop types**, named `<Component>Props`. No `any`, no `object`.
- **Accept `ref` as a prop** (React 19 — no `forwardRef`).
- **Booleans read like adjectives** (`isDisabled`, `hasError`). Handlers are `onX` props,
  bound to `handleX` implementations (kept from v1 — good convention).
- **Don't spread unknown props** (`{...rest}`) except in thin `ui/` primitives wrapping a DOM
  element, where you *do* forward native attributes intentionally.

### 6.4 Size & one-component-per-file

- A component file over **~150 lines** is a smell — extract sub-components or a hook.
- One **exported** component per file; private sub-components in the same file are fine if
  they're only used there. Promote to their own file when reused.

### 6.5 Custom hooks

- Extract a hook when logic is **stateful and reused**, or when a component's hook soup
  obscures its render. A hook that's used once and isn't stateful is often better inlined.
- Hooks are `use`-prefixed, live in the feature's `hooks/`, and return a **stable, named
  object** (`{ orders, isLoading, error }`), not a positional tuple (except simple
  `[value, setValue]` pairs).

### 6.6 Barrel exports & public API — recap

Client-facing feature API through `index.ts` (§1.5). Server code on explicit paths. Never
deep-import another feature.

---

## 7. Performance

Measure first (React DevTools Profiler, `next build` bundle output, Lighthouse). Optimize the
thing that's slow, not the thing that looks slow.

- **Server Components are your #1 perf tool.** Every component you *don't* mark `'use client'`
  is JS you don't ship. Audit the client boundary regularly.
- **Memoization is a scalpel, not a default.** `useMemo`/`useCallback`/`React.memo` add
  complexity and their own cost. Reach for them when the Profiler shows a real re-render
  problem or a genuinely expensive computation — not preemptively. (React 19's compiler
  reduces the need further.)
- **Stabilize what crosses a memo boundary:** if you `React.memo` a child, its object/array/
  function props must be stable, or the memo does nothing.
- **Dynamic import** heavy, below-the-fold, or conditional client components:
  `next/dynamic` (`{ ssr: false }` for browser-only libs like charts/maps/editors). Keeps
  them out of the initial bundle.
- **Streaming + Suspense** (§2.4) for perceived performance on data-heavy routes.
- **Images:** always `next/image` — automatic sizing, lazy-loading, modern formats. Set
  `sizes` for responsive images; `priority` only for the LCP image.
- **Fonts:** `next/font` — self-hosted, zero layout shift, no render-blocking external
  request.
- **Bundle discipline:** watch `next build` output; investigate any client chunk over budget.
  Prefer smaller libs (`date-fns` over `moment`), import sub-paths, avoid barrels that pull
  whole libraries.
- **Lists:** stable `key` = entity id, never array index for reorderable/mutable lists (kept
  from v1). Virtualize (`@tanstack/react-virtual`) lists beyond a few hundred rows.

---

## 8. Testing

Test **behavior a user can observe**, not implementation details. Assert on rendered output
and interactions, not on internal function calls.

| Layer | What to test | Tools |
|---|---|---|
| `schemas/` | schema accepts valid / rejects invalid; edge cases | Vitest |
| `server/queries` | mapping + error mapping; parses real API shapes | Vitest + **MSW** (mock at the network, not the client) |
| `server/actions` | validation branches, revalidation, Result shape | Vitest (mock data layer) |
| `hooks/` | query/mutation states, optimistic rollback | Vitest + Testing Library + MSW |
| `components/` | the four UI states render; interactions fire; **a11y** | Testing Library + `jest-axe` |
| Critical flows | signup, checkout, core loop | Playwright (E2E, few but real) |

- **Mock at the network boundary (MSW), not by stubbing your own modules,** so tests exercise
  parsing + mapping + error handling for real. This is why we don't need repository
  interfaces to test — the seam is the network, and MSW owns it.
- **The four UI states are mandatory coverage** for any data-driven component: loading, error,
  empty, success (kept from v1 — it's excellent).
- **Every bug fix ships a regression test** that fails without the fix.
- **Include an a11y assertion** (`jest-axe` / Testing Library queries by role/label) in
  component tests — accessibility isn't a separate phase (§10).

---

## 9. Code style & conventions

### 9.1 Naming

| Thing | Convention | Example |
|---|---|---|
| Folders & files | `kebab-case` | `order-card.tsx`, `orders.queries.ts` |
| Components | `PascalCase` fn in kebab file | `OrderCard` in `order-card.tsx` |
| Hooks | `use` + camelCase | `useOrders`, `useCreateOrder` |
| Zustand stores | `use<X>Store` | `useOrderUiStore` |
| Server queries/actions | verb-first fn | `getOrders`, `createOrder` |
| Types/interfaces | `PascalCase`, no `I` prefix | `Order`, `OrderFilters` |
| Zod schemas | `<Name>Schema` | `OrderSchema` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_PAGE_SIZE` |
| Booleans | `is/has/can/should` | `isPending`, `hasError` |
| Handlers | `handleX` (impl) / `onX` (prop) | `handleSubmit` / `onSubmit` |

**Why kebab-case files?** Case-insensitive filesystems (macOS/Windows) turn `OrderCard.tsx`
vs `ordercard.tsx` into silent Git conflicts. Kebab-case removes the class of bug entirely.
(Kept from v1 — correct.)

### 9.2 TypeScript

- **`strict: true`.** Non-negotiable. Also enable `noUncheckedIndexedAccess` — it catches a
  whole class of "undefined is not an object" bugs.
- **No `any`.** Use `unknown` + narrowing or a Zod parse. Unavoidable `any` gets a
  `// eslint-disable` **with a reason**.
- **No `enum`** — use union literals or `as const` objects. They tree-shake, narrow better,
  and interop cleanly with Zod. (Kept from v1.)
- **`interface` for object shapes, `type` for unions/utilities.**
- **Explicit return types on exported functions.** Inference is fine for locals.
- **`readonly` for entity fields**; prefer immutable updates.
- **`@/*` alias** for cross-feature/shared imports; relative paths only *within* a feature.

### 9.3 Imports

- Order: node/external → `@/shared` & `@/ui` → feature-relative → styles. Enforced by
  `eslint-plugin-import` / Prettier plugin — don't hand-sort.
- **`import 'server-only'`** at the top of any module that must never reach the client
  (queries, secrets, DB). **`import 'client-only'`** for browser-only modules. These turn a
  boundary mistake into a build error instead of a runtime leak.
- Ban cross-feature deep imports and `../../..` climbing out of a feature via
  `no-restricted-imports`.

### 9.4 Constants, magic values, env, logging

- **No magic strings/numbers.** Routes, cache tags, query keys, storage keys, limits →
  named constants (`shared/config/` or a feature `constants.ts`). (Kept from v1.)
- **Env vars are parsed once with Zod** in `shared/config/env.ts` and imported from there —
  never read `process.env` scattered across the app. Server secrets stay un-prefixed;
  `NEXT_PUBLIC_*` only when the browser truly needs the value (and never for API base URLs or
  secrets).
  ```ts
  export const env = EnvSchema.parse({ API_BASE_URL: process.env.API_BASE_URL, /* ... */ });
  ```
- **No `console.log` in committed code.** Use a structured logger (`shared/lib/logger`) that
  no-ops appropriately per environment. Server logs and client logs are different sinks.
- **Delete dead code.** Don't comment it out "for later" — Git remembers. (Kept from v1.)

### 9.5 Tooling is law

- **ESLint + Prettier + `tsc --noEmit`** run in CI; failures block merge. Inline rule
  disables require a justifying comment.
- **Tailwind 4** is the styling standard (CSS-first `@theme` config). Design tokens live in
  the theme layer — never hardcode hex/spacing in components. Repeated class clusters become
  a **component**, not a copied string. Conditional classes via `cn()`
  (`clsx` + `tailwind-merge`), never string concatenation. (Refined from v1.)
- **File length:** ~150 lines for components, ~200 for modules, is a *hint* to split — a
  guideline, not a linter gate.

---

## 10. Accessibility (a baseline, not an afterthought)

Accessibility is a correctness requirement, enforced in review and tests (§8).

- **Semantic HTML first.** `<button>` for actions, `<a>`/`<Link>` for navigation, `<nav>`,
  `<main>`, `<header>`, headings in order. A `<div onClick>` is a bug — it's not focusable or
  keyboard-operable and screen readers ignore it.
- **Everything interactive is keyboard-operable.** Tab to reach, Enter/Space to activate,
  Esc to dismiss overlays. Visible focus states — never `outline: none` without a replacement.
- **Every input has a `<label>`** (or `aria-label` when visually impossible). Associate errors
  with `aria-describedby`.
- **ARIA only to fill gaps semantic HTML can't.** The first rule of ARIA is: don't use ARIA if
  a native element does the job. Wrong ARIA is worse than none.
- **Images:** meaningful `alt`; decorative images `alt=""`.
- **Color isn't the only signal** (error = red *and* an icon/text); meet WCAG AA contrast via
  design tokens.
- **Respect `prefers-reduced-motion`** for animations.

---

## 11. Pull request checklist

- [ ] Files/folders kebab-case; names follow §9.1
- [ ] Server Component by default; `'use client'` only at interactive leaves; `page.tsx` thin
- [ ] Server data read on the server (or hydrated Query); **no client fetch waterfalls**
- [ ] No feature added an empty layer folder "for later"; no deep cross-feature imports
- [ ] Every boundary input Zod-parsed (API, `params`, `searchParams`, form, storage)
- [ ] Mutations via Server Actions that **re-validate**; correct `revalidateTag` + cache invalidation
- [ ] One source of truth per state; no server data mirrored into Zustand/`useState`; derived state computed
- [ ] Query keys from the registry; `staleTime`/`retry` chosen deliberately; optimistic updates complete or absent
- [ ] `server-only`/`client-only` guards on boundary modules; no secrets in `NEXT_PUBLIC_`
- [ ] No `any`, no `enum`, no magic strings, no `console.log`; `tsc`/lint/format clean
- [ ] Four UI states handled; loading/error/not-found files present where needed
- [ ] Tests for the change (incl. a11y assertion); regression test for any bug fix
- [ ] Keyboard-operable, labeled, semantic HTML; `next/image` + `next/font`

---

## 12. The handbook in one paragraph

Organize by **feature**, and give a feature only the folders it earns — a Zod contract in
`schemas/`, server data functions and Server Actions in `server/`, client hooks in `hooks/`,
and colocated `components/`, exposed through a deliberate `index.ts`. Let the **framework be
the architecture**: Server Components are the default and the data layer, `'use client'` marks
only interactive leaves, mutations are Server Actions, and Route Handlers exist only for
outside consumers. Keep **one source of truth per piece of state** — server data in the server
cache or hydrated TanStack Query, filters in the URL, shared UI in small Zustand slices, forms
in RHF, and everything derivable *computed*, never stored. **Validate every byte at the
boundary** with Zod and trust types within; **throw typed errors** and reserve Result-as-value
for the one place it belongs — Server Actions returning to forms. Delete every abstraction that
doesn't pay rent: no delegation-only usecases, no interface-plus-singleton repositories, no
blanket `neverthrow`, no Axios. What remains is a codebase that a new engineer can navigate by
feature, reason about by boundary, and extend without asking permission — predictable no matter
how many features or developers you add.
```

