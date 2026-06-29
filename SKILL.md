---
name: ui-ux-pro
description: >
  Multi-framework UI/UX design intelligence. Use when building UI with any framework or platform.
  Deep Angular coverage (Angular Material 3, signals, CDK, M3 theming, animations, accessibility).
  Also covers: React, Next.js, Vue, Nuxt.js, Nuxt UI, Svelte, Astro, shadcn/ui, HTML+Tailwind,
  Flutter, SwiftUI, React Native, Laravel, Jetpack Compose, Three.js.
  Triggers on: "angular", "react", "next.js", "nextjs", "vue", "nuxt", "svelte", "astro",
  "shadcn", "tailwind", "flutter", "swiftui", "react native", "laravel", "jetpack compose",
  "three.js", "threejs", "r3f", "material", "component", "UI library", "design system",
  "angular material", "ng-zorro", "primeng", "signals UI", "CDK", "hooks", "composable",
  "useState", "useEffect", "Pinia", "Riverpod", "Provider", "StatefulWidget", "@Observable",
  "app router", "server components", "blade", "livewire", "inertia", "webgl", "scene graph".
user-invokable: true
argument-hint: "[angular|react|vue|nextjs|svelte|astro|flutter|swiftui|react-native|laravel|jetpack|threejs|shadcn|nuxt|html-tailwind] [component|theme|layout|pattern|audit]"
---

## Framework Router

Detect the framework from context, then read the matching reference:

| Framework | Reference | Triggers |
|---|---|---|
| **Angular** | `references/` (7 files — deepest coverage) | angular, angular material, ng-zorro, primeng, signals, CDK, standalone component |
| **React** | `references/stacks/react.md` | react, jsx, useState, useEffect, vite+react, react hooks |
| **Next.js** | `references/stacks/nextjs.md` | next.js, nextjs, app router, RSC, server components, server actions |
| **Vue** | `references/stacks/vue.md` | vue, composition api, script setup, pinia, vue router |
| **Nuxt.js** | `references/stacks/nuxtjs.md` | nuxt, nuxt 3, auto-imports, useAsyncData, useFetch |
| **Nuxt UI** | `references/stacks/nuxt-ui.md` | nuxt ui, @nuxt/ui, u-button, u-card |
| **Svelte** | `references/stacks/svelte.md` | svelte, sveltekit, $state, $derived, $effect, runes |
| **Astro** | `references/stacks/astro.md` | astro, .astro, islands, content collections, astro components |
| **shadcn/ui** | `references/stacks/shadcn.md` | shadcn, radix ui, copy-paste components, cn(), cva() |
| **HTML+Tailwind** | `references/stacks/html-tailwind.md` | tailwind, utility css, no framework, vanilla html |
| **Flutter** | `references/stacks/flutter.md` | flutter, dart, widget, statelesswidget, provider, riverpod |
| **SwiftUI** | `references/stacks/swiftui.md` | swiftui, @state, @observable, navigationstack, xcode |
| **React Native** | `references/stacks/react-native.md` | react native, expo, flatlist, stylesheet, metro |
| **Laravel** | `references/stacks/laravel.md` | laravel, blade, livewire, inertia, eloquent |
| **Jetpack Compose** | `references/stacks/jetpack-compose.md` | jetpack compose, composable, remember, kotlin, android |
| **Three.js** | `references/stacks/threejs.md` | three.js, threejs, r3f, react three fiber, webgl, scene graph |

**For Angular requests:** Continue reading this SKILL.md — all Angular content is below.
**For other frameworks:** Read the matching stack file above, then return here for universal UX rules if needed.

---

## Design Catalog

Use these when the user needs aesthetic direction, color, typography, or product-type guidance:

| Catalog | File | Use when |
|---|---|---|
| **UI Styles** | `references/catalog/styles.md` | User asks for a visual style, aesthetic, or "what style fits X" — 23 named styles |
| **Color Palettes** | `references/catalog/colors.md` | User needs brand colors, theme colors, or palette recommendations — 35 palettes |
| **Font Pairings** | `references/catalog/fonts.md` | User needs typography, heading+body font combos — 31 pairings with Google Fonts imports |
| **Product Types** | `references/catalog/products.md` | User describes what they're building — 41 product types with UI patterns and layout guidance |

---

# Angular UI/UX Design Intelligence

Angular-specific design guidance for building production-quality UIs. All examples use Angular 17+ standalone component syntax with signals-first patterns.

---

## Section 1: Decision Tree — What Are You Building?

> These routes apply to **Angular** projects. For other frameworks see the Framework Router above.

Use this routing guide to load the right reference file before implementing:

| Building... | Read this |
|---|---|
| A new component (card, list, form, dialog, toolbar) | `references/components.md` |
| Design system / color theming / dark mode / typography | `references/theming.md` |
| Signals patterns, smart/dumb components, routing UX, state flows | `references/patterns.md` |
| Motion, page transitions, list animations, micro-interactions | `references/animations.md` |
| Performance: lazy loading, deferring, image optimization, SSR | `references/performance.md` |
| Accessibility audit, ARIA, keyboard navigation, screen readers | `references/accessibility.md` |
| Choosing between Angular Material, NG-ZORRO, PrimeNG, custom | `references/alt-libraries.md` |

When in doubt: start with `references/components.md`, then `references/patterns.md`.

---

## Section 2: Design Philosophy

### Component-First Architecture
Angular's core mental model is composition of focused, testable components with clear `input()` / `output()` signal contracts. Good UI design in Angular means good component decomposition — each component should own a single visual responsibility and surface its API through typed signal inputs. Avoid "god components" that manage multiple concerns (e.g., a dashboard that owns its own HTTP calls, layout, and child state simultaneously). Aim for components under 200 lines of template and under 100 lines of class. When a template grows beyond two levels of conditional nesting, extract the inner content into a sub-component.

### Angular Material 3 as Default
Angular Material is the default recommendation for virtually all Angular UIs. It is the only Angular component library that is officially maintained by the Angular team, ships with full Material Design 3 spec compliance, and has first-class accessibility built in. Deviations — choosing NG-ZORRO for data-dense enterprise UIs, PrimeNG for e-commerce richness, or a fully custom system — require a deliberate justification. When in doubt, use Material. When the design spec calls for something Material cannot do, layer CDK primitives underneath your own components rather than pulling in a second library.

### Signals-First Reactive UI (Angular 17+)
`signal()`, `computed()`, and `effect()` replace most `subscribe()` patterns for local UI state. RxJS remains essential for async data pipelines (HTTP, WebSockets, complex event merging) but should terminate at the component boundary via `toSignal()`. Never expose `Observable` subscriptions that outlive component teardown — use `takeUntilDestroyed()` if you must subscribe manually, or prefer `toSignal()` which handles teardown automatically. Template control flow (`@if`, `@for`, `@switch`, `@defer`) replaces `*ngIf`, `*ngFor`, `*ngSwitch` structural directives and is more readable and slightly more efficient.

### OnPush by Default
Every new component should be created with `changeDetection: ChangeDetectionStrategy.OnPush`. Combined with signals, this eliminates virtually all unnecessary re-renders. Zone.js-based default change detection (the pre-17 default) runs on every async event in the entire application — a click handler, a setTimeout, an HTTP response. OnPush narrows updates to when inputs change or signals emit. This is not a micro-optimization; at scale it is the difference between a snappy UI and a laggy one. Set OnPush at component creation time — retrofitting it later is painful and error-prone.

### Standalone Components and Lazy Loading
Angular 17+ defaults to standalone components (`standalone: true` is now implicit). No NgModules means the `imports` array on each component is its explicit dependency list — this is a design asset, not boilerplate. It makes lazy-loaded routes trivial (`loadComponent: () => import('./page').then(m => m.PageComponent)`), keeps bundle splitting automatic, and keeps the mental model simple. Never reintroduce NgModules unless integrating a library that still requires them.

### Performance as UX
`@defer` blocks, `NgOptimizedImage`, and route-level code splitting are UX decisions as much as engineering ones. A dashboard that defers its chart section until it enters the viewport delivers perceived performance that no visual design trick can replicate. `NgOptimizedImage` automatically generates `srcset`, enforces `width`/`height` to prevent layout shift, and lazy-loads non-priority images. SSR hydration (Angular Universal / `provideClientHydration()`) is the right choice for any content-heavy or SEO-sensitive page. These are design choices that should be made in the planning phase, not retrofitted.

---

## Section 3: Top 20 Angular Material 3 Components

| Component | Selector | Best Used For | Don't Use When |
|---|---|---|---|
| Filled Button | `mat-flat-button` | Primary CTA, form submit, main action | Secondary actions — use `mat-button` or `mat-stroked-button` |
| Text Button | `mat-button` | Low-emphasis actions, inline links, cancel | The only action on screen — use filled for primary |
| Icon Button | `mat-icon-button` | Toolbar actions, compact controls, toggles | The action needs a visible label for clarity |
| FAB | `mat-fab` / `mat-mini-fab` | Single primary action per screen (add, compose) | Multiple competing CTAs exist; use filled button instead |
| Card | `mat-card` | Grouping related content, entity summaries | Laying out a page — use structural layout, not cards for everything |
| List | `mat-list` / `mat-nav-list` | Vertical item sequences, navigation drawers | Tabular data with multiple columns — use `mat-table` |
| Table | `mat-table` | Structured tabular data with sorting/filtering | Simple key-value display — use `mat-list` or definition list |
| Paginator | `mat-paginator` | Paging large mat-table datasets | Small datasets under 20 items — show all and use filter |
| Form Field | `mat-form-field` | Wrapping all text inputs, selects, autocompletes | Checkboxes, radios, toggles — those are standalone |
| Input | `matInput` directive | Text, number, email, search fields inside form field | Multi-line — use `textarea matInput` with `cdkTextareaAutosize` |
| Select | `mat-select` | Choosing one (or many) from a fixed short list | Lists over ~8 items — use `mat-autocomplete` instead |
| Autocomplete | `mat-autocomplete` | Searchable select, tag input, typeahead | Fixed short lists — `mat-select` is simpler |
| Checkbox | `mat-checkbox` | Multi-select, boolean toggles in lists | Confirming destructive actions — use a dialog with buttons |
| Radio Group | `mat-radio-group` | Mutually exclusive options (3–5 choices) | Binary yes/no — use `mat-slide-toggle` |
| Slide Toggle | `mat-slide-toggle` | Binary settings that take effect immediately | Actions requiring confirmation — use checkbox + button |
| Dialog | `MatDialog` | Confirmations, focused sub-tasks, complex forms | Simple alerts or notifications — use `mat-snack-bar` |
| Snackbar | `MatSnackBar` | Transient success/error feedback, undo prompts | Errors requiring user action — use inline error or dialog |
| Progress Bar | `mat-progress-bar` | Page-level loading, step progress, file upload | Indeterminate local widget loading — use `mat-spinner` |
| Spinner | `mat-spinner` | Inline / button loading states, small areas | Full-page loading — use `mat-progress-bar` at top |
| Sidenav | `mat-sidenav` | Persistent navigation drawer, responsive shell | Simple page layouts — overhead is not worth it |
| Toolbar | `mat-toolbar` | App header, page-level title + action bar | Section headers inside content — use `<h2>` or card header |

---

## Section 4: Angular-Specific UX Anti-Patterns

### Rule 1: Don't nest `@if` more than 2 levels deep
**DON'T:**
```html
@if (user()) {
  @if (user()!.isAdmin) {
    @if (user()!.permissions.includes('edit')) {
      <button>Edit</button>
    }
  }
}
```
**DO:** Extract a `canEdit = computed(() => ...)` signal and use it in a single `@if`, or extract the inner content to a sub-component that receives the resolved data as an input.

---

### Rule 2: Don't `subscribe()` in the component body without cleanup
**DON'T:**
```typescript
ngOnInit() {
  this.userService.getUser().subscribe(u => this.user = u); // memory leak
}
```
**DO:** Use `toSignal()` for simple cases, or `takeUntilDestroyed()` for complex pipelines:
```typescript
readonly user = toSignal(this.userService.getUser());
// OR, when you need the Observable pipeline:
private destroyRef = inject(DestroyRef);
ngOnInit() {
  this.userService.getUser()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(u => this.user.set(u));
}
```

---

### Rule 3: Don't use `ViewChild` to read state
**DON'T:**
```typescript
@ViewChild('myInput') inputRef!: ElementRef;
getInputValue() { return this.inputRef.nativeElement.value; }
```
**DO:** Bind to a `FormControl` or `signal()` — let Angular own the state, not the DOM:
```typescript
readonly inputValue = signal('');
// In template: <input [value]="inputValue()" (input)="inputValue.set($event.target.value)" />
// Or with reactive forms: this.form.controls.field.value
```

---

### Rule 4: Don't use default (Zone.js) change detection for new components
**DON'T:**
```typescript
@Component({ selector: 'app-card', ... })
export class CardComponent { ... }  // defaults to CheckAlways
```
**DO:**
```typescript
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  ...
})
export class CardComponent { ... }
```

---

### Rule 5: Don't use inline styles for theming
**DON'T:**
```html
<button mat-flat-button style="background-color: #2563EB; color: white;">Save</button>
```
**DO:** Use Angular Material's CSS custom properties or the theming API:
```scss
// In component SCSS:
:host {
  --mat-filled-button-container-color: var(--primary-brand);
}
// Or override globally in styles.scss:
html {
  --mat-toolbar-container-background-color: #1e293b;
}
```

---

### Rule 6: Don't block routing with synchronous guards
**DON'T:**
```typescript
canActivate(): boolean {
  return this.authService.isLoggedIn; // sync property read — fragile
}
```
**DO:** Use functional guards with async resolution:
```typescript
export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated$.pipe(
    take(1),
    map(ok => ok ? true : router.createUrlTree(['/login']))
  );
};
```

---

### Rule 7: Don't omit `track` in `@for` with mutable lists
**DON'T:**
```html
@for (item of items()) {
  <app-item [item]="item" />
}
```
**DO:**
```html
@for (item of items(); track item.id) {
  <app-item [item]="item" />
}
```
Without `track`, Angular destroys and recreates DOM nodes on every list mutation, causing flicker and destroying component state (form values, animation state, focus).

---

### Rule 8: Don't use `::ng-deep` for component styling
**DON'T:**
```scss
::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
```
**DO:** Use Angular Material's CSS custom properties, the `MAT_FORM_FIELD_DEFAULT_OPTIONS` injection token, or wrap the component in a host element with a class and target that:
```scss
// styles.scss — globally, intentionally:
html {
  --mat-form-field-subscript-overflow: hidden;
}
// Or in component SCSS with a host selector:
:host {
  --mat-form-field-container-height: 48px;
}
```
`::ng-deep` is deprecated and will be removed. It also breaks style encapsulation silently.

---

## Section 5: Style Recommendations by App Category

| App Type | Primary Style | Secondary Style | Color Focus | Recommended Library |
|---|---|---|---|---|
| SaaS / B2B Dashboard | Flat + Material | Glassmorphism cards | Trust blue / Indigo (#2563EB) | Angular Material |
| Enterprise Admin Panel | Data-Dense Material | Minimal borders | Neutral grey + brand accent | NG-ZORRO or Material |
| Analytics Dashboard | Dark Material | Data-dense grids | Dark bg (#0F172A) + vivid accents | Material + CDK virtual scroll |
| E-commerce Storefront | Vibrant + Block | Aurora gradient hero | Brand primary + success green | PrimeNG or Material |
| Developer Tool / IDE | Minimalist / Monochrome | Dark mode first | Monochrome + single accent | Material or fully custom |
| Consumer Mobile (PWA) | Material You / Soft UI | Rounded, tactile | M3 dynamic color | Angular Material (M3) |
| Healthcare / Medical | Clean + Trustworthy | High contrast | Green (#059669) + blue | Angular Material |
| Fintech / Banking | Formal + Structured | Dark sidebar | Dark navy (#1E3A5F) + teal | Angular Material or custom |

---

## Section 6: Angular Material 3 Color Palettes

These palettes are starting points for `mat.define-theme()`. Use the `mat.$*-palette` named palettes or supply a custom tonal palette with `mat.define-palette()`.

| App Type | Primary | Secondary | Tertiary | Surface | Notes |
|---|---|---|---|---|---|
| SaaS / B2B | #2563EB (Indigo 600) | #6366F1 (Violet) | #EA580C (Orange CTA) | #F8FAFC | Use `mat.$azure-palette` as primary |
| Healthcare | #059669 (Emerald) | #0891B2 (Cyan) | #7C3AED (Purple) | #F0FDF4 | Conveys calm, trust, health |
| Fintech / Banking | #1E3A5F (Dark Navy) | #0F766E (Teal 700) | #B45309 (Amber) | #F1F5F9 | Formal, stable, trustworthy |
| E-commerce | #16A34A (Green) | #EA580C (Orange) | #7C3AED (Purple) | #FFFFFF | Energetic; orange = sale/CTA |
| Developer Tool | #6B7280 (Grey) | #374151 (Dark Grey) | #3B82F6 (Blue accent) | #111827 | Dark mode first; minimal saturation |
| Analytics / BI | #6366F1 (Violet) | #06B6D4 (Cyan) | #F59E0B (Amber) | #0F172A | Dark surface; vivid data colors |
| Consumer / Social | #EC4899 (Pink) | #8B5CF6 (Purple) | #06B6D4 (Cyan) | #FAFAFA | Playful; Material You dynamic color |
| Education | #2563EB (Blue) | #16A34A (Green) | #F59E0B (Amber) | #EFF6FF | Primary blue = trust; amber = gamification |

---

## Section 7: Angular Material 3 Theming Quick Reference

### Core Theming API

```scss
// styles.scss
@use '@angular/material' as mat;

// Include core styles once (resets, tokens)
@include mat.core();

// Define the theme
$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,      // M3 tonal palette
    tertiary: mat.$orange-palette,    // Accent/CTA color role
  ),
  typography: (
    brand-family: 'Inter, system-ui, sans-serif',
    plain-family: 'Inter, system-ui, sans-serif',
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ),
  density: (
    scale: 0,   // 0 = default, -1 = compact, -2 = very compact
  ),
));

// Apply to root
html {
  @include mat.all-component-themes($theme);
  // Or selectively:
  // @include mat.button-theme($theme);
  // @include mat.form-field-theme($theme);
}

// Dark mode via class toggle
.dark-theme {
  $dark-theme: mat.define-theme((
    color: (
      theme-type: dark,
      primary: mat.$azure-palette,
      tertiary: mat.$orange-palette,
    ),
  ));
  @include mat.all-component-colors($dark-theme);
}
```

### Available Named M3 Palettes
`mat.$red-palette`, `mat.$pink-palette`, `mat.$purple-palette`, `mat.$violet-palette`,
`mat.$indigo-palette`, `mat.$blue-palette`, `mat.$azure-palette`, `mat.$cyan-palette`,
`mat.$teal-palette`, `mat.$green-palette`, `mat.$olive-palette`, `mat.$yellow-palette`,
`mat.$orange-palette`, `mat.$brown-palette`, `mat.$rose-palette`, `mat.$chartreuse-palette`

### CSS Custom Property Overrides
Use `--mat-*` properties for targeted overrides without re-defining the full theme:

```scss
html {
  // Toolbar
  --mat-toolbar-container-background-color: #1e293b;
  --mat-toolbar-container-text-color: #f8fafc;

  // Buttons
  --mat-filled-button-container-color: #2563eb;
  --mat-filled-button-label-text-color: #ffffff;

  // Cards
  --mat-card-elevated-container-color: #ffffff;
  --mat-card-elevated-container-elevation: 0 1px 3px rgba(0,0,0,0.1);

  // Form fields
  --mat-form-field-container-height: 52px;

  // Sidenav
  --mat-sidenav-container-width: 260px;
}
```

### Angular Material Typography Scale (M3)
```scss
$theme: mat.define-theme((
  typography: (
    brand-family: 'Geist, Inter, sans-serif',
    plain-family: 'Geist, Inter, sans-serif',
    // M3 type scale roles: display-large → label-small
    // Override individual roles:
  ),
));
```
Reference type roles: `display-large`, `display-medium`, `display-small`,
`headline-large`, `headline-medium`, `headline-small`,
`title-large`, `title-medium`, `title-small`,
`body-large`, `body-medium`, `body-small`,
`label-large`, `label-medium`, `label-small`

---

## Section 8: Signals-First UI Patterns

### Local UI State
```typescript
import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>Count: {{ count() }} — Doubled: {{ doubled() }}</p>
    <button mat-stroked-button (click)="increment()">+1</button>
    <button mat-stroked-button (click)="reset()">Reset</button>
  `,
})
export class CounterComponent {
  readonly count = signal(0);
  readonly doubled = computed(() => this.count() * 2);

  increment() { this.count.update(n => n + 1); }
  reset() { this.count.set(0); }
}
```

### Async Loading State Pattern
```typescript
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { ItemService } from './item.service';

interface Item { id: number; name: string; }

@Component({
  selector: 'app-item-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <mat-progress-bar mode="indeterminate" />
    } @else if (error()) {
      <p class="error">{{ error() }}</p>
      <button mat-button (click)="load()">Retry</button>
    } @else {
      @for (item of data(); track item.id) {
        <app-item-card [item]="item" />
      } @empty {
        <p class="empty-state">No items found.</p>
      }
    }
  `,
})
export class ItemListComponent {
  private service = inject(ItemService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly data = signal<Item[]>([]);

  async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.data.set(await this.service.getItems());
    } catch (e) {
      this.error.set('Failed to load items. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
```

### Converting Observable to Signal (toSignal)
```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';

@Component({ ... })
export class UserComponent {
  private userService = inject(UserService);

  // Automatically subscribes and unsubscribes; initial value is undefined
  readonly user = toSignal(this.userService.currentUser$);

  // With initial value to avoid undefined checks:
  readonly items = toSignal(this.itemService.items$, { initialValue: [] as Item[] });
}
```

### Optimistic UI Updates
```typescript
async toggleItem(item: Item) {
  const previous = this.items(); // snapshot for rollback

  // Immediately update UI
  this.items.update(list =>
    list.map(i => i.id === item.id ? { ...i, done: !i.done } : i)
  );

  try {
    await this.api.toggleItem(item.id);
  } catch {
    // Rollback on failure
    this.items.set(previous);
    this.snackBar.open('Update failed — changes reverted', 'Dismiss', { duration: 4000 });
  }
}
```

### Derived State with computed()
```typescript
readonly searchQuery = signal('');
readonly allItems = signal<Item[]>([]);
readonly statusFilter = signal<'all' | 'active' | 'done'>('all');

readonly filteredItems = computed(() => {
  const q = this.searchQuery().toLowerCase();
  const status = this.statusFilter();
  return this.allItems()
    .filter(item => !q || item.name.toLowerCase().includes(q))
    .filter(item => status === 'all' || (status === 'done' ? item.done : !item.done));
});

readonly resultCount = computed(() => this.filteredItems().length);
```

### Input Signals (Angular 17.1+)
```typescript
import { input, output, model } from '@angular/core';

@Component({ selector: 'app-item-card', ... })
export class ItemCardComponent {
  // Required input — type-safe, signal-based
  readonly item = input.required<Item>();

  // Optional input with default
  readonly variant = input<'compact' | 'full'>('full');

  // Two-way binding (model signal)
  readonly selected = model(false);

  // Output
  readonly deleted = output<Item>();

  delete() { this.deleted.emit(this.item()); }
}

// Usage:
// <app-item-card [item]="item" [(selected)]="isSelected" (deleted)="onDelete($event)" />
```

---

## Section 9: Angular Form UX

### Typed Reactive Forms
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface SignupForm {
  email: FormControl<string>;
  password: FormControl<string>;
  displayName: FormControl<string>;
}

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput [formControl]="form.controls.email" type="email" autocomplete="email" />
        <mat-error>{{ emailError }}</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Password</mat-label>
        <input matInput [formControl]="form.controls.password" type="password" />
        <mat-hint>At least 8 characters</mat-hint>
        <mat-error>{{ passwordError }}</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Display Name</mat-label>
        <input matInput [formControl]="form.controls.displayName" autocomplete="name" />
        <mat-error *ngIf="form.controls.displayName.hasError('required')">
          Name is required
        </mat-error>
      </mat-form-field>

      <button mat-flat-button type="submit" [disabled]="form.invalid || submitting()">
        @if (submitting()) {
          <mat-spinner diameter="20" />
        } @else {
          Create Account
        }
      </button>
    </form>
  `,
})
export class SignupFormComponent {
  submitting = signal(false);

  readonly form = new FormGroup<SignupForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
      updateOn: 'blur',  // Validate on blur, not on every keystroke
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
      updateOn: 'blur',
    }),
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: 'blur',
    }),
  });

  get emailError(): string {
    const ctrl = this.form.controls.email;
    if (!ctrl.touched) return '';
    if (ctrl.hasError('required')) return 'Email is required';
    if (ctrl.hasError('email')) return 'Enter a valid email address';
    return '';
  }

  get passwordError(): string {
    const ctrl = this.form.controls.password;
    if (!ctrl.touched) return '';
    if (ctrl.hasError('required')) return 'Password is required';
    if (ctrl.hasError('minlength')) return 'Password must be at least 8 characters';
    return '';
  }

  async submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    try {
      await this.authService.signup(this.form.getRawValue());
    } finally {
      this.submitting.set(false);
    }
  }
}
```

### Form UX Rules
1. Use `updateOn: 'blur'` — never validate on every keystroke for non-search fields.
2. Call `markAllAsTouched()` on submit attempt to surface all errors at once.
3. Always show `<mat-hint>` for format expectations before the user types, `<mat-error>` after touched.
4. Disable the submit button while `submitting()` is true and show a spinner inside it.
5. Use `nonNullable: true` on FormControl to get properly typed `.value` (non-undefined).
6. Prefer `FormGroup<T>` typed form groups for type-safe `.controls` access.
7. For long multi-step forms, use Angular CDK Stepper (`mat-stepper`) and validate per-step.
8. Autocomplete attributes (`autocomplete="email"`, `autocomplete="current-password"`) are UX, not optional.

### Search / Filter UX with Debounce
```typescript
readonly searchControl = new FormControl('', { nonNullable: true });

// In constructor or ngOnInit:
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  takeUntilDestroyed(),
).subscribe(query => this.searchQuery.set(query));
```

---

## Section 10: Performance Design Checklist

- [ ] **OnPush on every component** — set `changeDetection: ChangeDetectionStrategy.OnPush` at component creation
- [ ] **`track item.id` in every `@for`** — prevents full DOM reconstruction on list mutation
- [ ] **`@defer (on viewport)`** for below-fold sections — e.g. charts, secondary panels, comment sections
- [ ] **`NgOptimizedImage`** on all `<img>` tags — add `priority` attribute to the LCP image
- [ ] **Lazy-loaded routes** with `loadComponent: () => import('./page').then(m => m.PageComponent)`
- [ ] **`toSignal()`** instead of `.subscribe()` in components — automatic teardown, no leaks
- [ ] **SSR-aware code** — no `window`/`document`/`localStorage` in constructors; use `afterRender()` or `isPlatformBrowser()`
- [ ] **`@defer (on idle)`** for non-critical UI loaded after page is interactive
- [ ] **`provideClientHydration()`** in app.config.ts for SSR + hydration
- [ ] **`trackBy` on mat-table** — provide `trackBy` function to `<mat-table [dataSource]>`
- [ ] **Virtual scrolling** for long lists (500+ items) — use `cdk-virtual-scroll-viewport`
- [ ] **Bundle size** — check `ng build --stats-json` + `webpack-bundle-analyzer`; no library imported in root if only used in one lazy route

### @defer Patterns

```html
<!-- Defer chart section until it enters viewport -->
@defer (on viewport) {
  <app-analytics-chart [data]="chartData()" />
} @placeholder {
  <div class="chart-skeleton" style="height: 300px; background: #f1f5f9; border-radius: 8px;"></div>
} @loading (minimum 500ms) {
  <mat-progress-bar mode="indeterminate" />
} @error {
  <p>Chart failed to load.</p>
}

<!-- Defer non-critical panel until browser is idle -->
@defer (on idle) {
  <app-recommendations-panel />
}

<!-- Conditional defer — only load when user triggers it -->
@defer (on interaction(triggerEl)) {
  <app-heavy-modal />
}
<button #triggerEl mat-button>Show Details</button>
```

### NgOptimizedImage
```typescript
// In component imports:
import { NgOptimizedImage } from '@angular/common';

// In template:
// LCP image — add priority:
<img ngSrc="/hero.webp" width="1200" height="600" priority alt="Hero banner" />

// Standard lazy-loaded image:
<img ngSrc="/thumbnail.webp" width="300" height="200" alt="Product photo" />

// Dynamic from CDN with loader:
<img [ngSrc]="product.imageUrl" width="400" height="400" alt="{{ product.name }}" />
```

---

## Section 11: Reference Files

These files contain expanded catalogs, code patterns, and decision matrices. Instruct Claude to read them when the task requires deeper detail:

| File | When to Read |
|---|---|
| `references/components.md` | Full Angular Material 3 + CDK component catalog with annotated code examples, inputs/outputs, and common patterns for each component |
| `references/theming.md` | Complete M3 theming system: custom tonal palettes, dark/light switching, per-component theme overrides, CSS custom property reference, typography scale, density |
| `references/patterns.md` | Signals patterns (effect, resource, linkedSignal), smart/dumb component split, routing UX (skeleton screens, route transitions, breadcrumbs), state management patterns |
| `references/animations.md` | Angular Animations module, route transition animations, list stagger/reorder, micro-interactions, `@keyframes` vs Angular `animate()`, reduced-motion media query |
| `references/performance.md` | `@defer` reference, `NgOptimizedImage` loader setup, SSR hydration patterns, virtual scrolling, bundle splitting, Core Web Vitals measurement in Angular |
| `references/accessibility.md` | CDK `A11yModule` (LiveAnnouncer, FocusTrap, FocusMonitor), ARIA roles with Angular Material, keyboard navigation patterns, color contrast in M3, screen reader testing |
| `references/alt-libraries.md` | NG-ZORRO vs PrimeNG vs Angular Material decision matrix: when each wins, migration notes, bundle size comparison, Angular version compatibility |

### Quick Access Prompts
When helping with a specific task, pre-load context with:
- `Read references/components.md for the mat-table section` — for sortable/filterable table UX
- `Read references/theming.md for the dark mode section` — for dark/light toggle implementation
- `Read references/patterns.md for the smart/dumb split` — for component decomposition guidance
- `Read references/animations.md for route transitions` — for page-to-page motion design
- `Read references/accessibility.md for keyboard nav` — for ARIA and CDK FocusTrap patterns

---

## Quick Reference: Angular 17+ Standalone Component Template

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  output,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-my-component' },
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ title() }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (loading()) {
          <mat-progress-bar mode="indeterminate" />
        } @else {
          <p>{{ content() }}</p>
        }
      </mat-card-content>
      <mat-card-actions>
        <button mat-flat-button (click)="confirm.emit()">Confirm</button>
        <button mat-button (click)="cancel.emit()">Cancel</button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class MyComponent {
  // Inputs
  readonly title = input.required<string>();
  readonly content = input<string>('');

  // Outputs
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  // Local state
  readonly loading = signal(false);

  // Derived state
  readonly hasContent = computed(() => this.content().length > 0);

  // Services
  private myService = inject(MyService);
}
```

---

*This skill covers Angular 17+ with standalone components, signals, and Angular Material 3. For Angular 14–16 NgModule-based patterns, note that the core UX guidance remains valid but syntax differs (use `ngOnDestroy` + `Subject` for cleanup, `*ngIf`/`*ngFor` directives, and `@NgModule` imports arrays).*
