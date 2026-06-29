# Pure HTML + Tailwind CSS — UI/UX Reference

## When to Read
Use this file when building UI with plain HTML and Tailwind CSS — no JavaScript framework. Covers layout, components, dark mode, Tailwind v4 patterns, and minimal interactivity with Alpine.js or Vanilla JS.

---

## Recommended Libraries

| Library | Type | Install |
|---|---|---|
| DaisyUI | Pre-built Tailwind component classes | `npm install daisyui` |
| Flowbite | HTML components + JS behaviors | `npm install flowbite` |
| Preline | Copy-paste HTML blocks | Free on preline.co |
| Headless UI | Accessible JS behaviors (React/Vue) | `npm install @headlessui/react` |
| Alpine.js | Lightweight interactivity (no build step) | CDN or `npm install alpinejs` |
| Floating UI | Tooltips, dropdowns, popovers | `npm install @floating-ui/dom` |
| AOS | Scroll animations | `npm install aos` |

---

## Style Recommendations

- **Landing pages:** Aurora UI, Motion-Driven, Glassmorphism accents
- **Documentation:** Minimalism + dark mode first
- **Marketing / SaaS:** Bold Typography + Vibrant accent color
- **Dashboard:** Custom Tailwind grid, neutral palette, tight spacing
- **Portfolio / creative:** Large imagery, editorial typography, minimal UI chrome
- **E-commerce:** Clean white space, clear hierarchy, high-contrast CTAs

---

## Setup Options

### CDN (Prototype / No Build)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>My App</title>
</head>
<body class="bg-white text-gray-900 antialiased">
  <!-- content -->
</body>
</html>
```

### Vite (Recommended for Production)

```bash
npm create vite@latest my-app -- --template vanilla
cd my-app
npm install tailwindcss @tailwindcss/vite
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

```css
/* src/style.css */
@import "tailwindcss";
/* Tailwind v4: no tailwind.config.js needed */
```

### Tailwind v4 Custom Theme

```css
/* style.css */
@import "tailwindcss";

@theme {
  --color-brand: #2563EB;
  --color-brand-dark: #1D4ED8;
  --color-brand-50: #EFF6FF;
  --font-display: 'Cal Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  --radius-card: 0.75rem;
}

/* Usage: class="bg-brand text-brand font-display" */
```

---

## Top UX Patterns with Code

### 1. Navigation Bar

```html
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
  <nav class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 font-semibold text-gray-900">
      <svg class="w-6 h-6 text-blue-600" ...></svg>
      Brand
    </a>

    <!-- Desktop links -->
    <div class="hidden md:flex items-center gap-8 text-sm text-gray-600">
      <a href="/features" class="hover:text-gray-900 transition-colors">Features</a>
      <a href="/pricing" class="hover:text-gray-900 transition-colors">Pricing</a>
      <a href="/docs" class="hover:text-gray-900 transition-colors">Docs</a>
    </div>

    <!-- CTA -->
    <div class="flex items-center gap-3">
      <a href="/login" class="text-sm text-gray-600 hover:text-gray-900">Log in</a>
      <a href="/signup" class="px-4 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-700 transition-colors">
        Get started
      </a>
    </div>

    <!-- Mobile menu button -->
    <button class="md:hidden p-2" aria-label="Open menu">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </nav>
</header>
```

### 2. Hero Section

```html
<section class="py-24 md:py-32 px-6 text-center">
  <div class="max-w-4xl mx-auto">
    <!-- Badge -->
    <span class="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full mb-6">
      <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
      Now in public beta
    </span>

    <!-- Headline -->
    <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-none">
      Build something
      <span class="text-blue-600">great</span>
    </h1>

    <!-- Subtext -->
    <p class="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
      The toolkit for building modern web applications. Ship faster with
      less boilerplate and more focus on what matters.
    </p>

    <!-- CTAs -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="/get-started"
         class="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-700 transition-colors">
        Get started free
      </a>
      <a href="/demo"
         class="w-full sm:w-auto px-8 py-4 border border-gray-200 text-gray-700 rounded-full font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors">
        Watch demo →
      </a>
    </div>
  </div>
</section>
```

### 3. Card Components

```html
<!-- Basic card -->
<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
    <svg class="w-5 h-5 text-blue-600" ...></svg>
  </div>
  <h3 class="font-semibold text-gray-900 mb-2">Card Title</h3>
  <p class="text-sm text-gray-600 leading-relaxed">
    Description text with good line length and comfortable spacing.
  </p>
</div>

<!-- Feature grid -->
<section class="py-24 px-6">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Card repeated -->
  </div>
</section>

<!-- Pricing card (highlighted) -->
<div class="relative rounded-2xl bg-gray-900 text-white p-8">
  <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
    Most popular
  </span>
  <h3 class="text-2xl font-bold mb-2">Pro</h3>
  <p class="text-gray-400 mb-6">For growing teams</p>
  <div class="text-4xl font-bold mb-8">$49<span class="text-lg font-normal text-gray-400">/mo</span></div>
  <a href="/signup" class="block text-center py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors">
    Start free trial
  </a>
</div>
```

### 4. Form Elements

```html
<form class="space-y-6 max-w-md">
  <!-- Text input with label -->
  <div class="space-y-2">
    <label for="email" class="block text-sm font-medium text-gray-700">
      Email address
    </label>
    <input
      id="email" name="email" type="email"
      placeholder="you@example.com"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
             placeholder:text-gray-400 transition-colors"
    />
    <p class="text-xs text-gray-500">We'll never share your email.</p>
  </div>

  <!-- Select -->
  <div class="space-y-2">
    <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
    <select id="role" name="role"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">Select a role</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>
  </div>

  <!-- Checkbox -->
  <label class="flex items-start gap-3 cursor-pointer">
    <input type="checkbox" class="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600
                                  focus:ring-blue-500" />
    <span class="text-sm text-gray-600">
      I agree to the <a href="/terms" class="text-blue-600 hover:underline">Terms of Service</a>
    </span>
  </label>

  <!-- Submit button -->
  <button type="submit"
    class="w-full py-3 px-6 bg-gray-900 text-white text-sm font-medium rounded-lg
           hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
           transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
    Create account
  </button>
</form>
```

### 5. Dark Mode

```html
<!-- Toggle class="dark" on <html> element -->
<html lang="en" class="dark">
<body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">

<!-- Components with dark variants -->
<div class="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6">
  <h2 class="text-gray-900 dark:text-white font-semibold">Title</h2>
  <p class="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

```javascript
// Dark mode toggle
const toggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// On load: check saved preference
if (localStorage.theme === 'dark' ||
    (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.classList.add('dark');
}

toggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
});
```

### 6. Alpine.js Interactivity

```html
<!-- Install: <script src="//unpkg.com/alpinejs" defer></script> -->

<!-- Dropdown -->
<div x-data="{ open: false }" class="relative">
  <button @click="open = !open" @keydown.escape="open = false"
          class="px-4 py-2 border rounded-lg flex items-center gap-2">
    Options
    <svg class="w-4 h-4 transition-transform" :class="open && 'rotate-180'" ...></svg>
  </button>
  <div x-show="open" x-transition @click.outside="open = false"
       class="absolute top-full mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-10">
    <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-50">Edit</a>
    <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</a>
  </div>
</div>

<!-- Tabs -->
<div x-data="{ tab: 'overview' }">
  <div class="flex border-b">
    <button @click="tab = 'overview'"
            :class="tab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'"
            class="px-4 py-2 text-sm font-medium -mb-px">Overview</button>
    <button @click="tab = 'settings'"
            :class="tab === 'settings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'"
            class="px-4 py-2 text-sm font-medium -mb-px">Settings</button>
  </div>
  <div x-show="tab === 'overview'" class="py-4">Overview content</div>
  <div x-show="tab === 'settings'" class="py-4">Settings content</div>
</div>
```

### 7. Responsive Layout Patterns

```html
<!-- Sidebar + content -->
<div class="flex flex-col md:flex-row min-h-screen">
  <aside class="w-full md:w-64 border-b md:border-b-0 md:border-r bg-gray-50 p-6">
    Sidebar
  </aside>
  <main class="flex-1 p-6">
    Content
  </main>
</div>

<!-- Dashboard grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
  <!-- Stat cards -->
  <div class="bg-white rounded-xl border p-4">...</div>
</div>

<!-- Masonry-like with CSS columns -->
<div class="columns-1 md:columns-2 lg:columns-3 gap-4">
  <div class="break-inside-avoid mb-4 rounded-xl border p-4">...</div>
</div>
```

---

## Best Practices by Category

### Layout
- Always design mobile-first: base styles → `md:` → `lg:` → `xl:`
- Use `max-w-7xl mx-auto px-6` for consistent page-width containers
- `gap` on flex/grid parents, not `margin` on children
- Sticky headers: `sticky top-0 z-50 bg-white/80 backdrop-blur-md`
- Use CSS Grid for 2D layouts, Flexbox for 1D (nav, button groups, cards in a row)

### Typography
- Body text: `text-base` (16px) minimum, `leading-relaxed` for paragraphs
- Headings: `tracking-tight` for large display type, `font-bold` or `font-semibold`
- Muted text: `text-gray-500` or `text-gray-600` — never below 4.5:1 contrast ratio
- Limit line length: `max-w-prose` (65ch) for reading comfort
- Use `text-balance` on headlines to prevent orphaned words

### Color & Contrast
- Primary actions: high-contrast (`bg-gray-900 text-white` or brand color)
- Destructive actions: `bg-red-600 text-white`
- Disabled states: `opacity-50 cursor-not-allowed pointer-events-none`
- Borders: `border-gray-200` (light) / `border-gray-800` (dark) — subtle, not harsh
- Focus rings: `focus:ring-2 focus:ring-blue-500 focus:outline-none` on all interactive elements

### Spacing
- Use Tailwind spacing scale consistently: 4 (1rem) = base unit
- Card padding: `p-6` (desktop) or `p-4` (mobile)
- Section vertical padding: `py-16` to `py-32`
- Button padding: `px-4 py-2` (default), `px-6 py-3` (large)

---

## Common Anti-Patterns

1. **Utility string duplication** — repeated `class="px-4 py-2 bg-blue-600 text-white rounded-lg..."` across HTML. Extract with `@layer components { .btn-primary { @apply ... } }` or a template partial.

2. **Arbitrary values everywhere** — `w-[347px]`, `mt-[13px]`, `text-[15px]`. Use the spacing/type scale. Arbitrary values signal a design inconsistency, not a Tailwind limitation.

3. **No responsive prefixes** — never write desktop-only Tailwind. Start with mobile layout, then add `md:` and `lg:` prefixes. Mobile-first is not optional.

4. **Skipping focus styles** — removing `outline` without replacing it (`focus:outline-none` alone) breaks keyboard navigation. Always add `focus:ring-*`.

5. **Tailwind v3 config in v4 projects** — `tailwind.config.js` is not used in Tailwind v4. Use `@theme { }` in CSS for customization.

6. **Dynamic classes from JS that get purged** — Tailwind can't detect `'bg-' + color` string concatenation. Use a full class map: `{ red: 'bg-red-500', blue: 'bg-blue-500' }`.

7. **Fixed pixel widths on containers** — use `max-w-*` with `mx-auto`, not `width: 1200px`. Fixed widths break on unusual viewports.

8. **Missing `width` + `height` on images** — without explicit dimensions, images cause layout shift (CLS). Always specify dimensions or use `aspect-ratio`.

9. **Overusing `absolute` positioning** — most layouts are achievable with Flexbox/Grid. Absolute should be for overlays, badges, and decorative elements only.

10. **No `:hover` feedback on interactive elements** — every clickable element needs a hover state. At minimum: `hover:opacity-80` or `hover:bg-gray-50`.

---

## Performance Checklist

- [ ] Production build: unused Tailwind classes removed via tree-shaking (zero config needed in v4)
- [ ] `@layer components` for repeated patterns (avoids duplication, kept in CSS layer order)
- [ ] `loading="lazy"` on all below-fold images
- [ ] `width` + `height` attributes on all `<img>` to prevent layout shift
- [ ] `fetchpriority="high"` on LCP (Largest Contentful Paint) image
- [ ] Preconnect to font origins: `<link rel="preconnect" href="https://fonts.gstatic.com">`
- [ ] Alpine.js via CDN for minimal interactivity (no build step, ~15KB gzipped)
- [ ] Minimal JavaScript: prefer CSS transitions over JS animations where possible
- [ ] `font-display: swap` in font CSS for system fallback during load
- [ ] Audit with Lighthouse — target 90+ Performance on mobile
