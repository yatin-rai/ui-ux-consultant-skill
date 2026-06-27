# Next.js UI/UX Guidelines

## When to read this
Read this file when building with Next.js 14+ App Router. Covers server vs client components, data fetching patterns, routing, images, metadata, and performance for production Next.js apps.

## Recommended UI Libraries

| Library | Best for | Install |
|---|---|---|
| shadcn/ui | UI components | `npx shadcn@latest init` |
| next-auth v5 | Authentication | `npm install next-auth@beta` |
| TanStack Query | Client-side caching | `npm install @tanstack/react-query` |
| Prisma | Database ORM | `npm install prisma` |
| Zod | Schema validation | `npm install zod` |
| nuqs | URL search params state | `npm install nuqs` |

## Style Recommendations by App Type

- **SaaS product:** shadcn/ui + custom color tokens in `globals.css`
- **Marketing site:** shadcn/ui + Tailwind animations + dark mode
- **Dashboard/admin:** shadcn/ui data table + sidebar layout
- **E-commerce:** Custom product cards, cart drawer, optimistic updates

## Top UX Patterns

### 1. Streaming Loading UI with loading.tsx
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}
// Automatically shown while page.tsx's async data resolves
// No extra code needed in page.tsx
```

### 2. Server Action with Error Handling
```tsx
'use server';
import { revalidatePath } from 'next/cache';

export async function createItem(formData: FormData) {
  const title = formData.get('title') as string;
  try {
    await db.item.create({ data: { title } });
    revalidatePath('/items');
    return { success: true };
  } catch {
    return { error: 'Failed to create item' };
  }
}

// Client component usage
function ItemForm() {
  const [state, formAction] = useFormState(createItem, null);
  return (
    <form action={formAction}>
      <input name="title" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button type="submit">Create</button>
    </form>
  );
}
```

### 3. Route-Level Data Fetching (Server Component)
```tsx
// app/users/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) notFound();
  return <UserProfile user={user} />;
}
```

### 4. Parallel Data Fetching
```tsx
// BAD: sequential — each awaits the previous (slow)
const user = await getUser(id);
const posts = await getPosts(id);

// GOOD: parallel — both fire simultaneously
const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);
```

### 5. Intercepting Route Modal Pattern
```
app/
  photos/
    page.tsx                  ← gallery page
    [id]/
      page.tsx                ← full photo page (direct navigation)
    @modal/
      (.)photos/[id]/
        page.tsx              ← modal (shown when navigating from gallery)
  layout.tsx                  ← renders both {children} and {modal}
```

### 6. Dynamic Metadata for SEO
```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [{ url: post.coverImage }],
    },
  };
}
```

### 7. Suspense Boundary for Slow Component
```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <StaticHeader />
      <Suspense fallback={<ChartSkeleton />}>
        <SlowAnalyticsChart />  {/* streams in separately */}
      </Suspense>
    </div>
  );
}
```

### 8. Optimistic UI with useOptimistic (React 19 / Next.js 14+)
```tsx
'use client';
import { useOptimistic } from 'react';

function LikeButton({ post }) {
  const [optimisticPost, addOptimisticLike] = useOptimistic(
    post,
    (state) => ({ ...state, likes: state.likes + 1 })
  );
  return (
    <form action={async () => {
      addOptimisticLike(null);
      await likePost(post.id);
    }}>
      <button type="submit">Like ({optimisticPost.likes})</button>
    </form>
  );
}
```

### 9. next/image with Priority and Sizes
```tsx
import Image from 'next/image';

// Hero image (LCP) — always use priority
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>

// Responsive fill image
<div className="relative h-64 w-full">
  <Image
    src={product.image}
    alt={product.name}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover"
  />
</div>
```

### 10. URL State with nuqs
```tsx
'use client';
import { useQueryState } from 'nuqs';

function ProductFilter() {
  const [category, setCategory] = useQueryState('category');
  const [sort, setSort] = useQueryState('sort', { defaultValue: 'popular' });

  return (
    <div>
      <select value={category ?? ''} onChange={e => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="shoes">Shoes</option>
      </select>
    </div>
  );
}
// URL: /products?category=shoes&sort=popular — shareable, bookmarkable
```

## Best Practices by Category

### Rendering
- Server Components by default — no `'use client'` unless you need browser APIs, event handlers, or hooks
- Push `'use client'` to leaf nodes — not layouts or high-level wrappers
- Use Suspense for progressive streaming of slow data sections
- Static generation (`cache: 'force-cache'`) where data does not change per request

### Data Fetching
- Fetch in Server Components — no `useEffect` for initial data load
- `cache: 'force-cache'` for static data, `cache: 'no-store'` for always-fresh data
- Server Actions for all mutations (create, update, delete)
- `revalidatePath` or `revalidateTag` for ISR cache invalidation after mutations
- `Promise.all` for all parallel fetches — never sequential `await` for independent calls

### Routing
- App Router as default for all new Next.js projects
- File-based routing: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` per segment
- Parallel routes (`@slot`) for split views and modal overlays
- Intercepting routes for modal patterns without losing deep-link capability

### Images
- `next/image` on every `<img>` — automatic format optimization and lazy loading
- `priority` prop on the LCP (largest contentful paint) image
- Explicit `width`/`height` or `fill` + `sizes` — prevents layout shift
- `next/font` for all custom fonts — zero layout shift, self-hosted automatically

### Performance
- `next/dynamic` for client-heavy third-party components (maps, editors, charts)
- Bundle analyzer: `ANALYZE=true npm run build` with `@next/bundle-analyzer`
- Avoid large `'use client'` subtrees — keep server boundary as low as possible
- Cache expensive DB queries with `unstable_cache` or React `cache()`

### Forms
- Server Actions as form `action` prop — no API route needed
- `useFormState` for server action response feedback
- `useFormStatus` for pending state on submit button
- Zod for schema validation in Server Actions before DB writes

### Accessibility
- Semantic HTML in all Server Components
- `loading.tsx` skeleton should mirror the layout of real content — reduces layout shift
- Focus management after navigation — Next.js handles this automatically
- Error pages (`error.tsx`) must have a recovery action (retry button)

### State
- URL state (`nuqs`) for filters, pagination, search — shareable and bookmarkable
- `useState`/`useReducer` for ephemeral UI state (modals, toggles)
- TanStack Query for client-side caching of server data after initial load
- Avoid `localStorage` for critical state — use cookies or DB for SSR compatibility

## Common Anti-Patterns

1. `'use client'` on a layout or high-level wrapper — makes the entire subtree client-side, losing all Server Component benefits
2. `useEffect` for data that could be fetched in a Server Component — unnecessary client waterfall
3. Fetching in client components without caching — re-fetches on every mount
4. Missing `loading.tsx` — no streaming feedback during server data loading
5. `<img>` instead of `next/image` — no optimization, causes layout shift
6. Sequential `await` for independent data fetches — use `Promise.all`
7. No `generateMetadata` on dynamic pages — poor SEO, missing OG tags
8. Putting secrets in client components — environment variables without `NEXT_PUBLIC_` are server-only
9. Mutating data without `revalidatePath` — stale cache shown to users after update
10. Not using `notFound()` — returning null causes blank pages instead of proper 404

## Performance Checklist

- [ ] Server Components used for all non-interactive UI
- [ ] `next/image` on every image, with `priority` on LCP image
- [ ] `next/font` for all custom fonts — no `@font-face` in CSS
- [ ] `loading.tsx` on every dynamic route segment
- [ ] `Promise.all` for all parallel data fetches in Server Components
- [ ] Bundle analyzer run: `ANALYZE=true npm run build`
- [ ] Suspense boundaries around individually-slow components
- [ ] `generateStaticParams` for known dynamic routes (static generation)
- [ ] No large third-party libraries in Server Components (they ship to client via `'use client'` boundary)
- [ ] `revalidateTag` strategy defined for all cached data
