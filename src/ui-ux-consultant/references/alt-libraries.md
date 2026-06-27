# Angular UI Library Decision Guide

## Decision Matrix

| Criteria | Angular Material | NG-ZORRO | PrimeNG | Tailwind CSS |
|---|---|---|---|---|
| Best for | Consumer apps, Google-style | Enterprise admin, data-heavy | Data grids, charts, reports | Custom design systems |
| Component count | 35+ | 70+ | 90+ | 0 (utility only) |
| Design spec | Material Design 3 | Ant Design | Custom/Fluent-ish | None |
| Bundle size | Small | Medium | Large | Very small |
| Theming | M3 token-based | CSS vars + Less | CSS vars + styled-components | Tailwind config |
| Accessibility | Excellent (CDK) | Good | Good | Manual |
| Angular version | 17+ recommended | 17+/21+ | 17+ | Any |
| Data table | Basic mat-table | Advanced + virtual scroll | Most powerful | Manual |
| Tree/Hierarchical | CDK tree | Yes | Yes | Manual |
| Rich text / editors | No | No | Yes | No |

---

## Angular Material — When to Choose

- Consumer-facing apps, PWAs, mobile-first
- Google/Material aesthetic preferred
- Need best-in-class accessibility (Angular CDK underpins everything)
- Small team that wants a battle-tested system
- SSR / hydration support is important
- **Install:** `ng add @angular/material`

---

## NG-ZORRO — When to Choose

- Enterprise admin dashboards with complex layouts
- Need: advanced data tables, tree components, complex forms, rich menu systems
- Ant Design aesthetic (enterprise-grade, clean)
- Heavy data display requirements
- **Install:** `ng add ng-zorro-antd`

```typescript
// app.config.ts
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
providers: [provideNzI18n(en_US)]
```

Top NG-ZORRO components beyond Angular Material: `nz-table` (virtual scroll, expandable rows), `nz-tree-select`, `nz-transfer`, `nz-cascader`, `nz-date-picker` (range picker), `nz-upload`

---

## PrimeNG — When to Choose

- Heavy data analysis apps with charts + grids
- Need: advanced data table (filtering, grouping, frozen columns), `p-chart` (Chart.js), `p-tree`, rich text editor
- Large component variety needed quickly
- **Install:** `npm install primeng`

Top PrimeNG components: `p-table` (most feature-complete Angular data table), `p-chart`, `p-treeTable`, `p-fileUpload`, `p-calendar` (with time picker), `p-multiSelect`

---

## Tailwind CSS + Angular — When to Choose

- Custom brand design system (no Material/Ant aesthetic)
- Rapid prototyping or utility-first workflow
- Combining with headless UI (Angular CDK primitives)
- **Install:**

```bash
npm install tailwindcss @tailwindcss/vite
```

```typescript
// vite.config.ts (or angular.json for build-based setup)
import tailwindcss from '@tailwindcss/vite';
plugins: [tailwindcss()]
```

```css
/* styles.css */
@import "tailwindcss";
```

Pair with Angular CDK for accessible headless components (dialogs, listboxes, etc.)

---

## Mixing Libraries

- **Angular Material + Tailwind:** Works well. Material for complex components (dialogs, forms), Tailwind for layout and custom styling. Avoid using Tailwind on Material components (conflicts with `::ng-deep` warnings).
- **NG-ZORRO + custom Tailwind layout:** Common pattern. NG-ZORRO components, Tailwind for page layout.
- **Never mix Angular Material + NG-ZORRO + PrimeNG:** Bundle bloat, style conflicts, accessibility inconsistency.
