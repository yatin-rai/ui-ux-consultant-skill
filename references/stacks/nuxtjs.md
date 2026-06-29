# Nuxt.js UI/UX Guidelines

## When to read this
Read this file when building with Nuxt 3. Covers auto-imports, SSR-safe patterns, data fetching composables, server routes, state management, middleware, and performance for production Nuxt apps.

## Recommended UI Libraries

| Library | Best for | Install |
|---|---|---|
| Nuxt UI | Ready-made components (Tailwind-based) | `npx nuxi module add ui` |
| @pinia/nuxt | State management | `npx nuxi module add pinia` |
| @nuxt/image | Optimized images | `npx nuxi module add image` |
| @nuxt/content | Content / MDX pages | `npx nuxi module add content` |
| VueUse | Composable utilities (Nuxt-aware) | `npm install @vueuse/nuxt` |
| @nuxtjs/color-mode | Dark/light mode | `npx nuxi module add color-mode` |

## Style Recommendations by App Type

- **SaaS / product:** Nuxt UI + custom Tailwind color tokens
- **Marketing/content:** @nuxt/content + @nuxt/image + custom Tailwind
- **Dashboard:** Nuxt UI data table + sidebar layout + @pinia/nuxt
- **Enterprise:** Element Plus + custom Nuxt module for design tokens
- **E-commerce:** Custom Tailwind + @nuxt/image + Pinia cart store

## Top UX Patterns

### 1. useFetch for SSR-Aware Data Fetching
```typescript
// Preferred for simple API calls — SSR-aware, handles hydration automatically
const { data, pending, error, refresh } = await useFetch('/api/users');

// With options
const { data: posts } = await useFetch('/api/posts', {
  query: { page: 1, limit: 10 },
  pick: ['id', 'title', 'slug'],  // Only serialize needed fields
});
```

### 2. useAsyncData for Complex Fetching
```typescript
// More control — custom key, transform, watch, lazy
const { data, pending } = await useAsyncData(
  'users',                          // Cache key — must be unique per page
  () => $fetch('/api/users'),
  {
    watch: [page],                  // Re-fetch when page changes
    transform: data => data.users,  // Transform before caching
    lazy: true,                     // Don't block navigation
    default: () => [],              // Default value before fetch completes
  }
);
```

### 3. Server API Route
```typescript
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { page = 1, limit = 20 } = query;

  const users = await db.user.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  return { users, page, limit };
});

// server/api/users.post.ts — POST handler
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = await db.user.create({ data: body });
  return user;
});
```

### 4. SSR-Safe Shared State with useState
```typescript
// composables/useCounter.ts — shared across components, SSR-safe
export const useCounter = () => useState('counter', () => 0);

// Usage in any component — no hydration mismatch
const count = useCounter();
count.value++;
```

### 5. Pinia Store with Nuxt
```typescript
// stores/cart.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const total = computed(() => items.value.reduce((sum, i) => sum + i.price, 0));

  function addItem(product: Product) {
    const existing = items.value.find(i => i.id === product.id);
    if (existing) existing.qty++;
    else items.value.push({ ...product, qty: 1 });
  }

  function removeItem(id: string) {
    items.value = items.value.filter(i => i.id !== id);
  }

  return { items, total, addItem, removeItem };
});
```

### 6. Route Middleware for Auth
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useUser(); // useState-based composable
  if (!user.value) {
    return navigateTo('/login', { redirectCode: 302 });
  }
});

// pages/dashboard.vue — apply middleware
definePageMeta({
  middleware: 'auth',
});
```

### 7. Page with SEO Metadata
```vue
<script setup lang="ts">
const route = useRoute();
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`);

useSeoMeta({
  title: post.value?.title,
  description: post.value?.excerpt,
  ogTitle: post.value?.title,
  ogImage: post.value?.coverImage,
  twitterCard: 'summary_large_image',
});
</script>
```

### 8. Client-Only Component (avoids SSR)
```vue
<!-- Wrap browser-only content -->
<ClientOnly>
  <MapComponent />
  <template #fallback>
    <MapSkeleton />
  </template>
</ClientOnly>
```

### 9. Plugin for Global Setup
```typescript
// plugins/toast.client.ts — client-only plugin
export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: (message: string) => {
        // Initialize toast library here
        window.__toast?.show(message);
      },
    },
  };
});

// Usage in component
const { $toast } = useNuxtApp();
$toast('Saved successfully!');
```

### 10. Error Handling with createError
```typescript
// server/api/posts/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const post = await db.post.findUnique({ where: { id } });

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }

  return post;
});

// pages/posts/[id].vue — handle errors from useFetch
const { data: post, error } = await useFetch(`/api/posts/${route.params.id}`);
if (error.value) throw createError({ fatal: true, statusCode: error.value.statusCode });
```

## Best Practices by Category

### Auto-Imports
- Components in `components/` — auto-imported with PascalCase name
- Composables in `composables/` — auto-imported, use `use` prefix
- Utilities in `utils/` — auto-imported
- Pinia stores in `stores/` — auto-imported with `@pinia/nuxt`
- Do not import Vue primitives manually (`ref`, `computed`) — auto-imported

### Data Fetching
- `useFetch` for simple, declarative API calls in components and pages
- `useAsyncData` when you need a custom cache key, transform, or `watch` deps
- `$fetch` only in event handlers (click, submit) — not in setup() for initial data
- Always provide a unique cache key to `useAsyncData` — avoid collisions between pages
- `lazy: true` for non-critical data that should not block navigation

### SSR Safety
- Never access `window`, `document`, or `localStorage` in composables or setup — wrap in `if (import.meta.client)`
- Use `useLocalStorage` from VueUse (`@vueuse/nuxt`) — handles SSR safely
- `useState` for shared state that must survive SSR hydration
- `<ClientOnly>` for components that only work in the browser

### State Management
- `useState` for simple cross-component state — SSR-safe, no extra package
- Pinia (`@pinia/nuxt`) for complex state with actions and getters
- `storeToRefs()` when destructuring Pinia stores — preserves reactivity

### Routing
- `definePageMeta` for page-level config: middleware, layout, keepalive, head
- `useRouter()` / `useRoute()` for navigation — not `$router`
- Named middleware files in `middleware/` — applied via `definePageMeta`
- `navigateTo()` for programmatic navigation — handles SSR and client

### Performance
- `lazy: true` on `useAsyncData` for data that does not affect initial render
- `@nuxt/image` on every image — automatic optimization and lazy loading
- `defineAsyncComponent` for heavy client-side components
- Server-side rendering for all public pages — avoid `ssr: false` unless absolutely needed

### Forms
- Server API routes as form targets — no separate API service needed
- Vee-Validate + Zod for schema validation
- `useFormData` pattern with server-side validation in API route
- Return structured errors from API routes: `{ error: { field: 'message' } }`

### Accessibility
- Use Nuxt UI components — built on Headless UI with ARIA baked in
- `useSeoMeta` on every public page — title, description, OG tags
- Consistent `<NuxtLink>` for internal navigation — renders as `<a>` with prefetch
- ARIA live regions for async content updates

## Common Anti-Patterns

1. `localStorage` in `setup()` — crashes SSR; use `useLocalStorage` from VueUse
2. `window` or `document` in composables without `if (import.meta.client)` guard
3. `$fetch` in component `setup()` without `useAsyncData` — no SSR, no caching, no deduplication
4. Manual `<head>` tags via `useHead` when `useSeoMeta` is simpler and safer
5. Heavy components without `<ClientOnly>` — SSR attempts to render browser-only APIs
6. Sequential `await useFetch` calls — use `Promise.all` with `useAsyncData`
7. Duplicate `useAsyncData` keys across pages — causes cache collisions and stale data
8. `ssr: false` on entire app — loses SEO and initial load performance
9. Missing `lazy: true` on non-critical data — blocks navigation unnecessarily
10. Not using `definePageMeta` for middleware — results in unprotected routes

## Performance Checklist

- [ ] `useAsyncData` with `lazy: true` for non-critical, below-fold data
- [ ] `@nuxt/image` module installed and used on all `<img>` tags
- [ ] Route-level `definePageMeta({ middleware: 'auth' })` for protected routes
- [ ] SSR data fetching via `useFetch` / `useAsyncData` — avoids client waterfalls
- [ ] `useState` for cross-component shared state (SSR-safe, no hydration mismatch)
- [ ] `<ClientOnly>` wrapping all browser-only components
- [ ] `useSeoMeta` on every public-facing page
- [ ] Server API routes return only the fields needed (use `pick` option)
- [ ] Pinia store persisted with `pinia-plugin-persistedstate` if needed across reloads
- [ ] `nitro.compressPublicAssets: true` in `nuxt.config.ts` for production
