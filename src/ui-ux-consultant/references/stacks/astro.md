# Astro 4+ — UI/UX Reference

## When to Read
Use this file when building with Astro. Covers islands architecture, hydration directives, Content Collections, View Transitions, data fetching, and UI library integration.

---

## Recommended Libraries

| Approach | Best for | Install |
|---|---|---|
| Tailwind CSS | Utility-first styling | `npx astro add tailwind` |
| shadcn/ui (React) | Copy-paste components | `npx astro add react` then shadcn |
| Starlight | Documentation sites | `npx create astro --template starlight` |
| DaisyUI | Tailwind component classes | `npm install daisyui` |
| Astro DB | SQLite-based database | `npx astro add db` |
| Nanostores | Cross-island state | `npm install nanostores` |
| Motion | Animations (islands) | `npm install motion` |

---

## Style Recommendations

- **Content / blog:** Minimalism + Swiss typographic style
- **Documentation:** Minimal + dark mode first (use Starlight)
- **Marketing / landing:** Aurora UI + Motion-Driven
- **Portfolio / creative:** Editorial, bold typography, large imagery
- **SaaS:** Flat Design + shadcn/ui React islands

---

## Core Concepts

- `.astro` files = **server-rendered by default** — zero JS shipped unless opted in
- **Islands:** interactive components get `client:*` directives to hydrate in browser
- **Content Collections:** type-safe content management for MDX/markdown
- **View Transitions:** `<ViewTransitions />` for SPA-like page transitions
- **Adapters:** SSR with Node, Vercel, Netlify, Cloudflare via `npx astro add <adapter>`

---

## Top UX Patterns with Code

### 1. Islands Hydration Directives

```astro
<!-- client:load — hydrate immediately (above fold, critical UI) -->
<ReactCounter client:load />

<!-- client:idle — hydrate when browser idle (non-critical, below fold) -->
<NewsletterForm client:idle />

<!-- client:visible — hydrate when scrolled into view (lazy hydration) -->
<CommentsSection client:visible />

<!-- client:media — hydrate only on matching media query -->
<MobileMenu client:media="(max-width: 768px)" />

<!-- client:only — skip SSR entirely (browser-API-dependent) -->
<ChatWidget client:only="react" />
<MapComponent client:only="svelte" />
```

**Rule:** default to no directive (static HTML), escalate only when interaction is needed.

### 2. Data Fetching in Frontmatter

```astro
---
// Runs server-side ONLY — never ships to browser
const [posts, featured] = await Promise.all([
  fetch('https://api.example.com/posts').then(r => r.json()),
  fetch('https://api.example.com/posts/featured').then(r => r.json()),
]);

const { slug } = Astro.params;
const user = Astro.locals.user;           // from middleware
const theme = Astro.cookies.get('theme'); // read cookies
---

<ul>
  {posts.map(post => (
    <li>
      <a href={`/posts/${post.slug}`}>{post.title}</a>
    </li>
  ))}
</ul>
```

### 3. Content Collections

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',  // MDX/markdown
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
  }),
});

const authors = defineCollection({
  type: 'data',     // JSON/YAML
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string().url(),
  }),
});

export const collections = { blog, authors };
```

```astro
---
// src/pages/blog/index.astro
import { getCollection, getEntry } from 'astro:content';

// Get all non-draft posts, sorted by date
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
---

{posts.map(post => (
  <article>
    <h2><a href={`/blog/${post.slug}`}>{post.data.title}</a></h2>
    <time>{post.data.publishDate.toLocaleDateString()}</time>
  </article>
))}
```

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

### 4. View Transitions

```astro
---
// src/layouts/Base.astro
import { ViewTransitions } from 'astro:transitions';
---
<html>
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

```astro
<!-- Shared element transitions with transition:name -->
<!-- In list page: -->
<img src={post.hero} transition:name={`hero-${post.slug}`} alt="" />
<h2 transition:name={`title-${post.slug}`}>{post.title}</h2>

<!-- In detail page — same transition:name creates morph animation -->
<img src={post.hero} transition:name={`hero-${post.slug}`} alt="" />
<h1 transition:name={`title-${post.slug}`}>{post.title}</h1>
```

```astro
<!-- Custom transition animations -->
<div transition:animate="slide">Slides between pages</div>
<div transition:animate="fade">Fades between pages</div>
<div transition:animate={{ old: fadeOut, new: fadeIn }}>Custom</div>
```

### 5. Cross-Island State with Nanostores

```typescript
// src/stores/cart.ts
import { atom, computed } from 'nanostores';

export interface CartItem { id: string; qty: number; price: number; }

export const cartItems = atom<CartItem[]>([]);
export const cartTotal = computed(cartItems, items =>
  items.reduce((sum, i) => sum + i.qty * i.price, 0)
);

export function addToCart(item: CartItem) {
  const current = cartItems.get();
  const existing = current.find(i => i.id === item.id);
  if (existing) {
    cartItems.set(current.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
  } else {
    cartItems.set([...current, item]);
  }
}
```

```tsx
// React island — src/components/CartIcon.tsx
import { useStore } from '@nanostores/react';
import { cartItems } from '../stores/cart';

export function CartIcon() {
  const items = useStore(cartItems);
  return <button>Cart ({items.length})</button>;
}
```

```svelte
<!-- Svelte island — src/components/AddToCart.svelte -->
<script>
  import { cartItems, addToCart } from '../stores/cart';
  export let product;
</script>
<button on:click={() => addToCart(product)}>Add to Cart</button>
```

### 6. API Endpoints

```typescript
// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json();

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await addToMailingList(email);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### 7. Middleware for Auth/Sessions

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const session = context.cookies.get('session')?.value;
  if (session) {
    context.locals.user = await validateSession(session);
  }

  // Protect routes
  if (context.url.pathname.startsWith('/dashboard') && !context.locals.user) {
    return context.redirect('/login');
  }

  return next();
});
```

### 8. Image Optimization

```astro
---
import { Image, Picture } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- Optimized, prevents layout shift -->
<Image src={heroImage} alt="Hero" width={800} height={400} />

<!-- Multiple formats + responsive -->
<Picture
  src={heroImage}
  formats={['avif', 'webp']}
  sizes="(max-width: 640px) 100vw, 800px"
  alt="Hero"
/>

<!-- Remote images require domain allowlist in astro.config -->
<Image src="https://example.com/image.jpg" alt="Remote" width={400} height={300} inferSize />
```

---

## Best Practices by Category

### Architecture
- Default to static rendering; add SSR adapter only when needed
- Use `getStaticPaths` for all dynamic routes in SSG mode
- Prefer Content Collections over manual file reads for structured content
- Co-locate component assets: put images/styles next to components that use them
- Use `src/layouts/` for page shells, `src/components/` for islands

### Islands Strategy
- Start with zero islands; add only when user interaction requires it
- `client:visible` for any component that loads below the fold
- `client:only` for components using browser APIs (window, localStorage, WebGL)
- Keep island bundle sizes small — one island per logical widget, not per page
- Share state between islands via nanostores, not props (islands are isolated)

### Content & SEO
- Use Content Collections for all structured content — never parse frontmatter manually
- Define schemas with zod — catch content errors at build time, not runtime
- Add `<meta>` tags in layouts with Astro.props passthrough
- Generate `sitemap.xml` with `@astrojs/sitemap` integration
- Use `canonical` meta tag for paginated collections

### Performance
- Zero-JS by default — confirm with browser DevTools network tab
- `<Image>` from `astro:assets` for all images (auto-generates width/height)
- Preload critical assets: `<link rel="preload">` in `<head>`
- Prefetch internal links: `<a href="/page" data-astro-prefetch>`
- Enable compression: handled automatically on Vercel/Netlify adapters

### Accessibility
- Use semantic HTML in `.astro` files — no framework overhead means no excuse for divs
- `<Image>` requires `alt` — enforced at build time
- View Transitions: respect `prefers-reduced-motion` (Astro handles automatically)
- Landmark regions: `<header>`, `<main>`, `<nav>`, `<footer>` in layouts

---

## Common Anti-Patterns

1. **`client:load` on everything** — defeats Astro's zero-JS default. Most content is static; only interactive widgets need hydration.

2. **Fetching in client components instead of frontmatter** — `fetch()` in a React island runs in the browser, missing SSG/SSR, caching, and auth context. Fetch in frontmatter and pass as props.

3. **Not using Content Collections for typed content** — manual frontmatter parsing produces runtime errors from typos or missing fields. Collections validate at build time.

4. **Missing `transition:name` on shared elements** — without matching names, View Transitions default to a cross-fade. Named transitions create the morphing/hero animation.

5. **React islands for simple interactive UI** — Svelte/Vue/Lit islands are smaller. For minimal interactions (toggle, dropdown), use Alpine.js or plain `<script>` with a dataset.

6. **Putting large JS libraries in frontmatter** — frontmatter runs server-side only; importing a 500KB charting lib just for data transform is wasteful. Use it in an island if really needed, or transform data server-side and pass numbers as props.

7. **Skipping `getStaticPaths` for dynamic routes** — causes 404s in SSG mode. Every dynamic segment needs `getStaticPaths` to enumerate valid paths.

8. **Remote images without domain allowlist** — `astro.config.mjs` requires `image.domains` or `image.remotePatterns` for `<Image>` to optimize remote sources.

9. **Using `document` or `window` in `.astro` scripts** — `.astro` files run server-side. Use `<script>` tags (which run client-side) or islands for browser APIs.

10. **One giant `.astro` page file** — extract repeated HTML into components in `src/components/`. Even static, non-interactive components benefit from extraction.

---

## Performance Checklist

- [ ] No `client:*` directive by default (pure HTML output)
- [ ] `client:visible` for all below-fold interactive islands
- [ ] `client:only` for browser-API-dependent widgets (maps, canvas, WebGL)
- [ ] Content Collections for all MDX/markdown content (type-safe at build)
- [ ] `<Image>` from `astro:assets` for all images (auto-optimize, prevent CLS)
- [ ] ViewTransitions enabled in base layout for SPA-like navigation
- [ ] `data-astro-prefetch` on key internal links
- [ ] `@astrojs/sitemap` for SEO
- [ ] SSR adapter (Vercel/Netlify) only when dynamic data requires it
- [ ] Audit bundle size: `npx astro build --verbose` shows per-island sizes
