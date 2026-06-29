# Angular Performance Patterns with UX Implications

## Section 1: @defer — Deferred Loading Blocks (Angular 17+)

`@defer` is Angular's built-in lazy loading for template sections. It's a design decision as much as a technical one.

**Trigger types and when to use:**
```html
<!-- Load when element enters viewport — use for below-fold sections -->
@defer (on viewport) {
  <app-analytics-charts />
} @placeholder {
  <div class="chart-skeleton" style="height: 300px;"></div>
}

<!-- Load on first user interaction — use for non-critical widgets -->
@defer (on interaction) {
  <app-comments-section />
} @placeholder {
  <button>Load comments</button>
}

<!-- Load after browser is idle — use for very low-priority content -->
@defer (on idle) {
  <app-recommendations />
} @placeholder {
  <div class="rec-placeholder">Loading recommendations...</div>
}

<!-- Load after a timer — use to prioritize above-fold paint -->
@defer (on timer(2s)) {
  <app-chat-widget />
}

<!-- Conditional defer — load when a signal/condition is true -->
@defer (when isLoggedIn()) {
  <app-user-panel />
}
```

**Always provide @placeholder:** Shows while deferred block hasn't loaded. Keep placeholder lightweight (skeleton or simple div).

**@loading block** (shows during actual chunk fetch):
```html
@defer (on viewport) {
  <app-heavy-chart />
} @loading (minimum 200ms) {
  <mat-spinner />
} @placeholder {
  <div class="skeleton"></div>
} @error {
  <p>Failed to load. <button (click)="retry()">Retry</button></p>
}
```

`minimum 200ms` prevents flash of loading spinner for fast connections.

---

## Section 2: OnPush + Signals — Zero-Overhead Change Detection

**Why OnPush:** Default change detection checks every component on every browser event. OnPush checks only when:
- An `input()` reference changes
- An event originates from within the component
- `markForCheck()` is called
- An `async` pipe receives a new value
- A signal read in the template emits a new value

**With signals, OnPush is essentially free** — Angular's signal-based change detection only re-renders what changed.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,  // ALWAYS
  template: `<p>Count: {{ count() }}</p>`,
})
export class MyComponent {
  count = signal(0);  // template re-renders only when count changes
}
```

**Rule:** Set `ChangeDetectionStrategy.OnPush` on every component. Make it a team standard.

---

## Section 3: trackBy in @for

Without `track`, Angular re-creates DOM nodes when list order changes. With `track`, it reuses nodes.

```html
<!-- BAD — re-creates all DOM on any change -->
@for (item of items(); ) { ... }

<!-- GOOD — reuses DOM nodes by ID -->
@for (item of items(); track item.id) { ... }

<!-- For primitive arrays -->
@for (name of names(); track name) { ... }

<!-- For index (last resort — less efficient) -->
@for (item of items(); track $index) { ... }
```

---

## Section 4: NgOptimizedImage

Replace every `<img>` with `NgOptimizedImage` directives:
```html
<!-- OLD -->
<img src="/hero.jpg" alt="Hero" />

<!-- NEW — import NgOptimizedImage -->
<img ngSrc="/hero.jpg" alt="Hero" width="1200" height="600" />

<!-- LCP image (above fold) — add priority -->
<img ngSrc="/hero.jpg" alt="Hero" width="1200" height="600" priority />

<!-- Responsive image -->
<img ngSrc="/photo.jpg" alt="Photo" fill sizes="(max-width: 768px) 100vw, 50vw" />
```

`NgOptimizedImage` automatically: sets `loading="lazy"` (except `priority`), generates `srcset`, adds `fetchpriority="high"` on priority images, warns on missing dimensions.

**Setup:**
```typescript
import { NgOptimizedImage } from '@angular/common';
@Component({ imports: [NgOptimizedImage] })
```

---

## Section 5: Route-Level Code Splitting

Every lazy route = separate JS chunk = faster initial load:
```typescript
// All routes should use loadComponent or loadChildren
{ path: 'dashboard', loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent) }
{ path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES) }
```

**Preloading strategy for UX** (load next likely routes after idle):
```typescript
// app.config.ts
provideRouter(routes, withPreloading(PreloadAllModules))
// or selective: withPreloading(QuicklinkStrategy) from ngx-quicklink
```

---

## Section 6: SSR / Angular Universal UX Patterns

**Hydration (Angular 17+):** Enable for fast initial paint + SEO:
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),  // add this
    provideRouter(routes),
  ],
};
```

**Avoid SSR breaking patterns:**
```typescript
// BAD — crashes on server (no window)
constructor() { window.addEventListener('scroll', ...) }

// GOOD — use afterRender() (client-only)
constructor() {
  afterRender(() => { window.addEventListener('scroll', ...) });
}

// Or inject PLATFORM_ID
readonly isPlatformBrowser = isPlatformBrowser(inject(PLATFORM_ID));
```

**Defer client-only UI:**
```html
@defer (on idle) {
  <app-chat-widget />  <!-- No SSR needed for this -->
}
```

---

## Section 7: Performance Checklist

| Check | Implementation |
|---|---|
| OnPush everywhere | `changeDetection: ChangeDetectionStrategy.OnPush` |
| trackBy in all @for | `track item.id` |
| Lazy routes | `loadComponent()` / `loadChildren()` |
| @defer for below-fold | `@defer (on viewport)` with `@placeholder` |
| NgOptimizedImage | Replace all `<img>` tags; `priority` on LCP |
| toSignal not subscribe | `toSignal(obs$)` in components |
| provideAnimationsAsync | Not `provideAnimations()` |
| Hydration enabled | `provideClientHydration()` in SSR apps |
| No window in constructor | Use `afterRender()` or `PLATFORM_ID` |
