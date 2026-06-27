# Angular Material 3 Theming Guide

Comprehensive reference for theming Angular Material 3 applications. Covers the M3 theming architecture, complete setup, dark mode, typography, design token overrides, density, and custom brand colors.

---

## 1. M3 Theming Architecture

Angular Material 3 theming operates across three layers:

| Layer | Controls | API |
|---|---|---|
| **Color** | Primary, secondary, tertiary, neutral, error palettes | `color:` key in `define-theme()` |
| **Typography** | Font families, weights, and the 15-role type scale | `typography:` key in `define-theme()` |
| **Density** | Component spacing and size compactness | `density:` key in `define-theme()` |

**How it works:**
1. `mat.define-theme()` computes a complete M3 theme object from your configuration.
2. `mat.all-component-themes($theme)` (or individual `mat.*-theme()` mixins) emit CSS custom properties (`--mat-*`) scoped to the selector where you include them.
3. Every Material component reads those CSS custom properties at runtime — no Sass variables leak into component styles.

This means you can:
- Override any token by setting `--mat-*` in CSS without touching Sass.
- Scope a theme to a CSS class (e.g., `.dark-theme`) and toggle it dynamically.
- Apply different densities per section of the UI.

---

## 2. Complete Theme Setup

### Install Dependencies

```bash
ng add @angular/material
# or manual:
npm install @angular/material @angular/cdk
```

### `styles.scss` — Full Setup

```scss
@use '@angular/material' as mat;

// ─── Step 1: Include core styles once at root ───────────────────────────────
// Emits baseline resets and typography utilities. Must be called exactly once.
@include mat.core();

// ─── Step 2: Define your theme ──────────────────────────────────────────────
$my-theme: mat.define-theme((
  color: (
    theme-type: light,             // 'light' | 'dark'
    primary: mat.$azure-palette,   // Main brand color (buttons, links, focus rings)
    tertiary: mat.$orange-palette, // CTA / accent color (FAB, selected states)
    // 'secondary' defaults to a neutral tonal palette — usually leave unset
  ),
  typography: (
    brand-family: 'Inter, sans-serif',   // Display, Headline, Title roles
    plain-family: 'Inter, sans-serif',   // Body, Label roles
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ),
  density: (
    scale: 0,   // 0 = default; -1 = compact; -2 = very compact; -3 = minimum
  ),
));

// ─── Step 3: Apply theme to all components ──────────────────────────────────
html {
  @include mat.all-component-themes($my-theme);
}

// ─── Alternatively: apply only to components you use (smaller CSS output) ───
// html {
//   @include mat.core-theme($my-theme);
//   @include mat.button-theme($my-theme);
//   @include mat.form-field-theme($my-theme);
//   @include mat.input-theme($my-theme);
//   @include mat.select-theme($my-theme);
//   @include mat.dialog-theme($my-theme);
//   @include mat.snack-bar-theme($my-theme);
//   @include mat.table-theme($my-theme);
//   @include mat.paginator-theme($my-theme);
//   @include mat.card-theme($my-theme);
//   @include mat.toolbar-theme($my-theme);
//   @include mat.sidenav-theme($my-theme);
//   @include mat.list-theme($my-theme);
//   @include mat.tabs-theme($my-theme);
//   @include mat.progress-bar-theme($my-theme);
//   @include mat.progress-spinner-theme($my-theme);
//   @include mat.checkbox-theme($my-theme);
//   @include mat.radio-theme($my-theme);
//   @include mat.slide-toggle-theme($my-theme);
//   @include mat.chips-theme($my-theme);
//   @include mat.badge-theme($my-theme);
//   @include mat.icon-theme($my-theme);
//   @include mat.tooltip-theme($my-theme);
//   @include mat.menu-theme($my-theme);
//   @include mat.datepicker-theme($my-theme);
//   @include mat.autocomplete-theme($my-theme);
//   @include mat.stepper-theme($my-theme);
//   @include mat.expansion-theme($my-theme);
//   @include mat.tree-theme($my-theme);
//   @include mat.bottom-sheet-theme($my-theme);
// }
```

### `angular.json` — Register the stylesheet

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "styles": ["src/styles.scss"]
          }
        }
      }
    }
  }
}
```

### `index.html` — Icon font

```html
<!-- Material Symbols (M3, variable font — recommended) -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />

<!-- If using a Google Font for typography, add it here too -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
```

---

## 3. Available M3 Color Palettes

All built-in palettes ship with `@angular/material`. Each generates a full M3 tonal palette (10 steps from 0–100 in HCT color space).

| Palette Variable | Color Family | Best For |
|---|---|---|
| `mat.$red-palette` | Red | Destructive actions, error states, alerts |
| `mat.$orange-palette` | Orange | CTA buttons, energy, warmth, food apps |
| `mat.$yellow-palette` | Yellow | Warnings, highlights |
| `mat.$green-palette` | Green | Success states, health, sustainability, finance |
| `mat.$teal-palette` | Teal | Healthcare, fintech, calm productivity |
| `mat.$cyan-palette` | Cyan | Tech, data, modern SaaS |
| `mat.$azure-palette` | Blue (lighter) | SaaS, productivity, trust |
| `mat.$blue-palette` | Blue (deeper) | Finance, enterprise, authority |
| `mat.$violet-palette` | Purple | Creative tools, premium, AI |
| `mat.$magenta-palette` | Pink/Magenta | Consumer, playful, fashion |

**Usage tip:** Set `primary` to your main brand color. Set `tertiary` to a complementary accent used for FABs, selected chips, and highlighted states. Never set all three (primary, secondary, tertiary) to the same palette — it will look flat.

```scss
// Example: Healthcare app
$health-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$teal-palette,
    tertiary: mat.$green-palette,
  ),
));

// Example: Creative / AI app
$creative-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$violet-palette,
    tertiary: mat.$magenta-palette,
  ),
));
```

---

## 4. Dark Mode Implementation

### Option A: CSS Class Toggle (Recommended)

Allows runtime switching without page reload. Works with SSR.

```scss
// styles.scss
$light-theme: mat.define-theme((
  color: (theme-type: light, primary: mat.$azure-palette)
));

$dark-theme: mat.define-theme((
  color: (theme-type: dark, primary: mat.$azure-palette)
));

html {
  @include mat.all-component-themes($light-theme);
}

// Override colors when .dark-theme class is on html or body
.dark-theme {
  @include mat.all-component-colors($dark-theme);
  // Note: use all-component-colors (not all-component-themes) to avoid
  // re-emitting typography and density tokens unnecessarily.
}
```

```typescript
// theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  constructor() {
    // Persist preference
    const saved = localStorage.getItem('theme');
    if (saved) this.isDark.set(saved === 'dark');

    // Apply on change
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle('dark-theme', dark);
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
  }

  toggle() {
    this.isDark.update(v => !v);
  }
}
```

```html
<!-- Theme toggle button in toolbar -->
<button mat-icon-button (click)="themeService.toggle()"
  [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
  <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
</button>
```

### Option B: CSS Media Query (System preference only)

```scss
// styles.scss
html {
  @include mat.all-component-themes($light-theme);
}

@media (prefers-color-scheme: dark) {
  html {
    @include mat.all-component-colors($dark-theme);
  }
}
```

### Option C: Separate stylesheets (lazy-loaded)

For very large apps where dark mode CSS size matters:

```typescript
// In app bootstrap or a service
function loadDarkTheme() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'dark-theme.css';  // Built as separate stylesheet
  document.head.appendChild(link);
}
```

---

## 5. Typography Scale

Angular Material 3 defines 15 typographic roles. Apply them as CSS classes or use the Sass typography functions.

| Role | CSS Class | Typical Size | Usage |
|---|---|---|---|
| Display Large | `.mat-display-large` | 57px | Marketing hero headlines |
| Display Medium | `.mat-display-medium` | 45px | Large section titles |
| Display Small | `.mat-display-small` | 36px | Feature section titles |
| Headline Large | `.mat-headline-large` | 32px | Page H1 |
| Headline Medium | `.mat-headline-medium` | 28px | Section H2 |
| Headline Small | `.mat-headline-small` | 24px | Card or panel H2 |
| Title Large | `.mat-title-large` | 22px | Dialog titles, drawer headers |
| Title Medium | `.mat-title-medium` | 16px | List item primary text |
| Title Small | `.mat-title-small` | 14px | Chip labels, tab labels |
| Body Large | `.mat-body-large` | 16px | Primary body copy |
| Body Medium | `.mat-body-medium` | 14px | Secondary body, descriptions |
| Body Small | `.mat-body-small` | 12px | Captions, metadata |
| Label Large | `.mat-label-large` | 14px | Button text (built-in) |
| Label Medium | `.mat-label-medium` | 12px | Form field labels |
| Label Small | `.mat-label-small` | 11px | Helper text, overlines |

**Usage in templates:**

```html
<h1 class="mat-display-small">Welcome Back</h1>
<h2 class="mat-headline-medium">Recent Activity</h2>
<p class="mat-body-large">Your account summary for this month.</p>
<span class="mat-body-small mat-hint">Last updated 2 minutes ago</span>
```

**Customizing the type scale in your theme:**

```scss
$my-theme: mat.define-theme((
  typography: (
    brand-family: '"Playfair Display", serif',  // Display, Headline roles
    plain-family: '"Inter", sans-serif',         // Body, Label, Title roles
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ),
));
```

**Applying typography separately** (when you want to update fonts without re-emitting colors):

```scss
html {
  @include mat.all-component-typographies($my-theme);
}
```

---

## 6. CSS Custom Properties (Design Token Overrides)

Angular Material emits hundreds of `--mat-*` custom properties. Override them directly in CSS for fine-grained control without touching Sass. This is the recommended approach for one-off adjustments.

**Token naming pattern:** `--mat-{component}-{slot}`

### App-level tokens

```scss
html {
  // Background and surface colors
  --mat-app-background-color: #F8FAFC;
  --mat-app-on-background-color: #1E293B;
  --mat-app-surface-color: #FFFFFF;
  --mat-app-on-surface-color: #1E293B;
}
```

### Button tokens

```scss
html {
  // Filled button
  --mat-filled-button-container-color: #2563EB;
  --mat-filled-button-label-text-color: #FFFFFF;
  --mat-filled-button-container-shape: 8px;  // Override pill shape

  // Outlined button
  --mat-outlined-button-outline-color: #CBD5E1;

  // Text button
  --mat-text-button-label-text-color: #2563EB;
}
```

### Form field tokens

```scss
html {
  --mat-form-field-container-height: 48px;
  --mat-form-field-container-vertical-padding: 12px;
  --mat-outlined-form-field-outline-color: #CBD5E1;
  --mat-outlined-form-field-focus-outline-color: #2563EB;
  --mat-form-field-label-text-size: 14px;
}
```

### Card tokens

```scss
html {
  --mat-card-elevated-container-color: #FFFFFF;
  --mat-card-elevated-container-elevation: 1;
  --mat-card-outlined-container-color: #FFFFFF;
  --mat-card-outlined-outline-color: #E2E8F0;
  --mat-card-title-text-size: 18px;
}
```

### Table tokens

```scss
html {
  --mat-table-background-color: #FFFFFF;
  --mat-table-header-headline-color: #64748B;
  --mat-table-header-headline-size: 12px;
  --mat-table-header-headline-weight: 600;
  --mat-table-row-item-label-text-color: #1E293B;
  --mat-table-row-item-outline-color: #F1F5F9;
}
```

### Toolbar tokens

```scss
html {
  --mat-toolbar-container-background-color: #FFFFFF;
  --mat-toolbar-container-text-color: #1E293B;
}
```

### Dialog tokens

```scss
html {
  --mat-dialog-container-color: #FFFFFF;
  --mat-dialog-container-elevation: 3;
  --mat-dialog-container-shape: 16px;
}
```

### Snackbar tokens

```scss
html {
  --mat-snack-bar-button-color: #93C5FD;  // Action button color in dark snackbar
  --mdc-snackbar-container-color: #1E293B;
  --mdc-snackbar-supporting-text-color: #F8FAFC;
}
```

**How to find token names:** Open DevTools, inspect a Material component, and look for `--mat-*` properties in the computed styles. The Angular Material source also documents tokens per component at `https://material.angular.io`.

---

## 7. Component-Level Color Overrides

Use the `color` input on individual components to apply the primary, accent (tertiary), or warn color from your theme.

```html
<!-- Buttons -->
<button mat-flat-button color="primary">Primary Action</button>
<button mat-flat-button color="accent">Accent (Tertiary)</button>
<button mat-flat-button color="warn">Destructive</button>

<!-- Progress indicators -->
<mat-progress-bar color="primary" mode="indeterminate" />
<mat-progress-spinner color="accent" mode="indeterminate" diameter="40" />

<!-- Form controls -->
<mat-checkbox color="primary" [formControl]="ctrl">Agree</mat-checkbox>
<mat-slide-toggle color="primary" [formControl]="ctrl">Enable</mat-slide-toggle>
<mat-radio-button color="primary" value="a">Option A</mat-radio-button>

<!-- Toolbar (sets background from palette) -->
<mat-toolbar color="primary">App Name</mat-toolbar>
```

**M3 note:** `color="accent"` maps to the tertiary palette in M3 (not a separate "accent" concept). `color="warn"` maps to the error palette.

---

## 8. Density

Density scale controls the minimum height and padding of interactive components. Useful for data-dense admin UIs.

| Scale | Effect | Use Case |
|---|---|---|
| `0` | Default M3 sizing | Consumer apps, landing pages |
| `-1` | Slightly compact | Productivity tools |
| `-2` | Compact | Admin dashboards |
| `-3` | Very compact (minimum) | Data grids, developer tools |

### Global density

```scss
$compact-theme: mat.define-theme((
  color: (theme-type: light, primary: mat.$azure-palette),
  density: (scale: -2),
));

html {
  @include mat.all-component-themes($compact-theme);
}
```

### Scoped density (recommended for admin panels)

Apply compact density only to specific sections, keeping content areas readable:

```scss
// Global theme at default density
html {
  @include mat.all-component-themes($default-theme);
}

// Compact density only inside .data-table-section
$compact-theme: mat.define-theme((
  color: (theme-type: light, primary: mat.$azure-palette),
  density: (scale: -2),
));

.data-table-section {
  @include mat.table-density($compact-theme);
  @include mat.paginator-density($compact-theme);
  @include mat.form-field-density($compact-theme);
  @include mat.button-density($compact-theme);
}
```

### Per-component density mixins

```scss
// Apply density to individual component types
@include mat.button-density($compact-theme);
@include mat.form-field-density($compact-theme);
@include mat.table-density($compact-theme);
@include mat.paginator-density($compact-theme);
@include mat.list-density($compact-theme);
@include mat.checkbox-density($compact-theme);
@include mat.radio-density($compact-theme);
@include mat.slide-toggle-density($compact-theme);
@include mat.select-density($compact-theme);
@include mat.autocomplete-density($compact-theme);
@include mat.datepicker-density($compact-theme);
@include mat.tabs-density($compact-theme);
@include mat.stepper-density($compact-theme);
@include mat.expansion-density($compact-theme);
@include mat.toolbar-density($compact-theme);
@include mat.tree-density($compact-theme);
```

---

## 9. Custom Color Palette (Brand Colors)

When your brand color isn't in the built-in palettes, generate an M3 tonal palette from it.

### Option A: Material Theme Builder (No-code)

1. Go to https://m3.material.io/theme-builder
2. Enter your brand hex color.
3. Export as CSS or Web (tokens).
4. Paste the generated `--md-sys-color-*` custom properties into your `styles.scss`.

```scss
// Paste generated tokens directly:
html {
  --md-sys-color-primary: #6366F1;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #E0E7FF;
  --md-sys-color-on-primary-container: #1E1B4B;
  /* ... all generated tokens ... */
}
```

### Option B: `@material/material-color-utilities` (Programmatic)

Generates the full tonal palette at runtime from a source color. Useful for user-customizable themes.

```bash
npm install @material/material-color-utilities
```

```typescript
// theme-generator.service.ts
import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
  hexFromArgb
} from '@material/material-color-utilities';

@Injectable({ providedIn: 'root' })
export class ThemeGeneratorService {

  applyBrandColor(hexColor: string, isDark = false) {
    const argb = argbFromHex(hexColor);
    const theme = themeFromSourceColor(argb);

    applyTheme(theme, {
      target: document.documentElement,
      isDark,
    });
  }

  // Get specific tonal values from a color
  getPalette(hexColor: string) {
    const theme = themeFromSourceColor(argbFromHex(hexColor));
    const { primary } = theme.palettes;
    return {
      tone10: hexFromArgb(primary.tone(10)),
      tone20: hexFromArgb(primary.tone(20)),
      tone40: hexFromArgb(primary.tone(40)),
      tone80: hexFromArgb(primary.tone(80)),
      tone90: hexFromArgb(primary.tone(90)),
    };
  }
}
```

```typescript
// In a component or app init
readonly #themeGen = inject(ThemeGeneratorService);

// Apply a custom brand color on startup
ngOnInit() {
  this.#themeGen.applyBrandColor('#6366F1', false);
}

// Let users pick their brand color
onColorChange(hex: string) {
  this.#themeGen.applyBrandColor(hex, this.isDark());
}
```

### Option C: Sass map (static custom palette)

Define tonal values manually as a Sass map for use with `mat.define-theme()`:

```scss
// _custom-palette.scss
// Generate tones using https://m3.material.io/theme-builder or material-color-utilities
$indigo-palette: (
  0:   #000000,
  10:  #1B0060,
  20:  #2D0086,
  25:  #360099,
  30:  #4000AD,
  35:  #4A12BB,
  40:  #5424C9,
  50:  #6D3DE5,
  60:  #8A5EFF,
  70:  #A882FF,
  80:  #C5A8FF,
  90:  #E6DEFF,
  95:  #F4EEFF,
  98:  #FDF7FF,
  99:  #FFFBFF,
  100: #FFFFFF,
);

// styles.scss
@use './custom-palette' as custom;

$my-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: custom.$indigo-palette,
  ),
));
```

---

## 10. Multi-Theme Support

For applications requiring per-tenant or per-section theming:

```scss
// Theme A: Default (blue)
$theme-a: mat.define-theme((color: (theme-type: light, primary: mat.$azure-palette)));

// Theme B: Green (e.g., a different product)
$theme-b: mat.define-theme((color: (theme-type: light, primary: mat.$green-palette)));

// Theme C: Dark violet
$theme-c: mat.define-theme((color: (theme-type: dark, primary: mat.$violet-palette)));

html {
  @include mat.all-component-themes($theme-a);  // Default
}

[data-theme="b"] {
  @include mat.all-component-colors($theme-b);
}

[data-theme="c"] {
  @include mat.all-component-colors($theme-c);
}
```

```typescript
// Apply theme to root element
setTheme(theme: 'a' | 'b' | 'c') {
  document.documentElement.dataset['theme'] = theme;
}
```

---

## 11. Common Theming Mistakes

| Mistake | Fix |
|---|---|
| Calling `@include mat.core()` more than once | Call it once in `styles.scss`, never in component styles |
| Using `mat.define-light-theme()` (v14 API) | Use `mat.define-theme()` with `theme-type: light` |
| Importing `MatNativeDateModule` and `MatMomentDateModule` both | Pick one date adapter and import it once in app config |
| Setting `color="primary"` on `mat-icon` to get brand color | Use `--mat-icon-color` token or a CSS class instead |
| Overriding `--mdc-*` tokens directly | Prefer `--mat-*` tokens; MDC tokens are lower-level and less stable |
| Not including component themes (components look unstyled in M3) | Ensure `mat.all-component-themes()` is called or each component's theme mixin is included |
| Forgetting `@include mat.core-theme($theme)` when using selective includes | `core-theme` is required alongside component themes — it emits ripple and option styles |
