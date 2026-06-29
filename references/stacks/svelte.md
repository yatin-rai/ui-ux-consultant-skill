# Svelte 5 + SvelteKit — UI/UX Reference

## When to Read
Use this file when building UI with Svelte 5 (runes API) or SvelteKit. Covers reactivity, props, bindings, stores, transitions, routing, and form actions.

---

## Recommended Libraries

| Library | Best for | Install |
|---|---|---|
| Shadcn-svelte | Copy-paste components | `npx shadcn-svelte@latest init` |
| Skeleton UI | Tailwind component system | `npm install @skeletonlabs/skeleton` |
| Melt UI | Headless accessible primitives | `npm install @melt-ui/svelte` |
| Paneforge | Resizable pane layouts | `npm install paneforge` |
| Superforms | SvelteKit form handling | `npm install sveltekit-superforms` |
| Floating UI | Tooltips, popovers, dropdowns | `npm install @floating-ui/dom` |
| Motion One | Animations | `npm install motion` |

---

## Style Recommendations

- **Consumer / lifestyle apps:** Skeleton UI + Aurora UI aesthetic
- **Minimal SaaS:** Shadcn-svelte + Flat Design
- **Custom design system:** Tailwind utilities directly, no component lib
- **Documentation:** Minimalism, dark mode first
- **Marketing / landing:** Motion-Driven + subtle gradients

---

## Svelte 5 Runes — Core Patterns

### Reactive State

```svelte
<script lang="ts">
  // $state — reactive primitive (replaces let with reactivity)
  let count = $state(0);
  let items = $state<string[]>([]);
  let user = $state({ name: 'Alice', age: 30 });

  // $derived — computed value (replaces $: reactive statements)
  let doubled = $derived(count * 2);
  let total = $derived(items.length);
  let greeting = $derived(`Hello, ${user.name}`);

  // $effect — side effect after render (replaces onMount + reactive blocks)
  $effect(() => {
    document.title = `Count: ${count}`;
    return () => { document.title = 'App'; };  // cleanup on destroy
  });
</script>
```

### Props

```svelte
<script lang="ts">
  // Destructure $props() for typed props
  let {
    name,
    count = 0,                          // default value
    onchange,
    class: className = '',              // rename reserved words
    ...rest                             // pass-through props
  }: {
    name: string;
    count?: number;
    onchange: (v: string) => void;
    class?: string;
  } = $props();
</script>
```

### Bindings

```svelte
<script lang="ts">
  let value = $state('');
  let checked = $state(false);
  let selected = $state('option-a');
  let el = $state<HTMLDivElement>();    // bind:this
</script>

<input bind:value />
<input type="checkbox" bind:checked />
<select bind:value={selected}>
  <option value="option-a">A</option>
</select>
<div bind:this={el}>Reference</div>
```

### Two-Way Bindable Props (Svelte 5)

```svelte
<!-- Child.svelte -->
<script lang="ts">
  let { value = $bindable('') } = $props();
</script>
<input bind:value />

<!-- Parent.svelte -->
<Child bind:value={parentValue} />
```

---

## Top UX Patterns with Code

### 1. Conditional Rendering with Transitions

```svelte
<script lang="ts">
  import { fade, fly, slide, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  let visible = $state(true);
  let items = $state(['a', 'b', 'c']);
</script>

{#if visible}
  <div transition:fade={{ duration: 200 }}>Fades in/out</div>
  <div in:fly={{ y: -20, duration: 300 }} out:fade={{ duration: 150 }}>
    Flies in, fades out
  </div>
{/if}

<!-- List animations -->
{#each items as item (item)}
  <div animate:flip={{ duration: 200 }} transition:slide>
    {item}
  </div>
{/each}
```

### 2. Async Data with Loading States

```svelte
<script lang="ts">
  async function fetchUser(id: string) {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error('Not found');
    return res.json();
  }

  let userPromise = $state(fetchUser('1'));
</script>

{#await userPromise}
  <div class="skeleton h-8 w-48 rounded" />
{:then user}
  <h2>{user.name}</h2>
{:catch error}
  <p class="text-red-500">{error.message}</p>
{/await}
```

### 3. Reusable Modal Pattern

```svelte
<!-- Modal.svelte -->
<script lang="ts">
  let { open = $bindable(false), title, children } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <button class="absolute inset-0 bg-black/50" onclick={() => open = false} />
    <div class="relative z-10 bg-white rounded-xl p-6 shadow-xl max-w-md w-full"
         role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title" class="text-lg font-semibold">{title}</h2>
      {@render children?.()}
    </div>
  </div>
{/if}
```

### 4. Form Validation

```svelte
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { z } from 'zod';

  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
  });

  const { form, errors, enhance } = superForm(data.form, {
    validators: zod(schema),
  });
</script>

<form method="POST" use:enhance>
  <label>
    Email
    <input bind:value={$form.email} name="email" type="email" />
    {#if $errors.email}<span class="text-red-500">{$errors.email}</span>{/if}
  </label>
  <button type="submit">Submit</button>
</form>
```

### 5. Context API (Component Tree State)

```typescript
// context.ts
import { setContext, getContext } from 'svelte';

const THEME_KEY = Symbol('theme');

export function setTheme(theme: 'light' | 'dark') {
  setContext(THEME_KEY, { theme: $state(theme) });
}

export function getTheme() {
  return getContext<{ theme: 'light' | 'dark' }>(THEME_KEY);
}
```

### 6. Stores (Svelte 4 / cross-component interop)

```typescript
// stores/cart.ts
import { writable, derived, get } from 'svelte/store';

interface CartItem { id: string; qty: number; price: number; }

const items = writable<CartItem[]>([]);
const total = derived(items, $items =>
  $items.reduce((sum, i) => sum + i.qty * i.price, 0)
);

function add(item: CartItem) {
  items.update(current => {
    const existing = current.find(i => i.id === item.id);
    if (existing) return current.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
    return [...current, item];
  });
}

export const cart = { subscribe: items.subscribe, total, add };
```

```svelte
<!-- Auto-subscribes and unsubscribes with $ prefix -->
<p>Items: {$cart.length}</p>
<p>Total: ${$cart.total}</p>
```

---

## SvelteKit Routing

```
src/routes/
  +page.svelte          # route component
  +layout.svelte        # wraps all child routes
  +page.server.ts       # server-only load + actions
  +layout.server.ts     # server-only layout load
  +server.ts            # API endpoint (GET/POST/etc.)
  [slug]/               # dynamic segment
  (group)/              # route group (no URL segment)
  [[optional]]/         # optional segment
```

### Data Loading

```typescript
// +page.server.ts — runs server-side only
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, locals, cookies }) => {
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) error(404, 'User not found');
  return { user };
};
```

```svelte
<!-- +page.svelte — typed data from load() -->
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>
<h1>{data.user.name}</h1>
```

### Form Actions

```typescript
// +page.server.ts
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const data = await request.formData();
    const title = data.get('title') as string;

    if (!title) return fail(400, { error: 'Title required' });

    await db.post.create({ data: { title, userId: locals.user.id } });
    redirect(303, '/posts');
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    await db.post.delete({ where: { id: data.get('id') as string } });
  },
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props();   // ActionData from failed actions
</script>

<form method="POST" action="?/create" use:enhance>
  <input name="title" required />
  {#if form?.error}<p class="text-red-500">{form.error}</p>{/if}
  <button type="submit">Create</button>
</form>
```

### API Routes

```typescript
// src/routes/api/users/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  const users = await db.user.findMany();
  return json(users);
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return json(user, { status: 201 });
};
```

---

## Best Practices by Category

### Reactivity
- Use `$state` for all mutable values in Svelte 5
- Use `$derived` for computed values — never `$effect` for derivations
- `$effect` is for side effects only (logging, DOM manipulation, subscriptions)
- Always return cleanup from `$effect` when subscribing to events
- Prefer `$state` arrays/objects — they are deeply reactive via proxies

### Component Design
- Keep components under 150 lines; extract sub-components early
- Use `$props()` destructuring with TypeScript types always
- Use `$bindable()` sparingly — only for true two-way binding needs
- Prefer composition with `{@render children?.()}` over slots where possible
- Co-locate component logic in `<script>` not in separate stores

### Accessibility
- Always use semantic HTML: `<button>`, `<nav>`, `<main>`, `<article>`
- Add `role` and `aria-*` to custom interactive elements
- Ensure keyboard navigation: `on:keydown` handlers for custom widgets
- Use `transition:` instead of display toggling for screen reader compat
- Test with `svelte-check` — it catches a11y issues at compile time

### SvelteKit Specifics
- Use `+page.server.ts` for data that should never reach the client
- Prefer form actions over fetch for mutations (progressive enhancement)
- Use `locals` in `hooks.server.ts` for auth/session data
- `$app/navigation`: `goto()`, `invalidate()`, `preloadData()` for SPA feel
- Enable `prerender = true` on static pages for performance

### Styling
- Scoped styles in `<style>` block are local by default
- Use `:global()` sparingly for third-party component overrides
- Tailwind + shadcn-svelte is the recommended production pairing
- CSS custom properties work well with Svelte's scoped styles

---

## Common Anti-Patterns

1. **Mutating arrays without reassignment (Svelte 4)** — `items.push(x)` doesn't trigger reactivity in Svelte 4; use `items = [...items, x]`. In Svelte 5, `$state` arrays are proxy-wrapped and reactive to mutations.

2. **Using `$effect` for derived values** — `$effect` runs asynchronously after render. Use `$derived` for synchronous computed state.

3. **`export let` without defaults (Svelte 4)** — props may arrive as `undefined`. Always provide defaults or use TypeScript optional types.

4. **Missing `{#key}` when reusing components with different data** — without a key, Svelte reuses the DOM node and the component won't re-initialize. Use `{#key item.id}<Component />{/key}`.

5. **DOM manipulation in `onMount` when a binding suffices** — use `bind:this`, `bind:value`, `bind:clientWidth` instead of querySelector.

6. **Fetching in `+page.svelte` instead of `+page.server.ts`** — client-side fetch loses SSR, caching, and auth context benefits.

7. **`client:*` directives on every component (Astro crossover)** — in SvelteKit, all components are server-rendered by default; no directives needed.

8. **Large inline event handlers** — extract to named functions for readability and testability.

9. **Not using `use:enhance`** on forms — without it, SvelteKit forms do full page reloads and lose progressive enhancement.

10. **Reactive store values without `$` prefix in templates** — `{count}` renders the store object, not its value; use `{$count}`.

---

## Performance Checklist

- [ ] Use `{#key item.id}` when component identity matters across data changes
- [ ] `svelte:options immutable={true}` for components receiving large immutable objects
- [ ] Lazy-load heavy routes: `import('./HeavyComponent.svelte')` with dynamic import
- [ ] Use built-in `svelte/transition` instead of JS animation libraries where possible
- [ ] `$derived` not `$effect` for computed values (avoids async render cycle)
- [ ] `loading="lazy"` on below-fold images
- [ ] SvelteKit prerendering: `export const prerender = true` for static pages
- [ ] `invalidate()` instead of full `goto()` for partial data refresh
- [ ] Avoid reactive statements that trigger on every keystroke without debounce
- [ ] Profile with Svelte DevTools — check for unnecessary re-renders
