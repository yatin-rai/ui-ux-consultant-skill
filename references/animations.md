# Angular Animations Reference

Angular Animations module guide with motion design principles.

---

## Section 1: Setup

```typescript
// main.ts or app.config.ts
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimationsAsync()],
};
```

`provideAnimationsAsync()` is preferred over `provideAnimations()` — it defers animation loading until first interaction, improving initial load performance.

---

## Section 2: Core Animation API

### Imports

```typescript
import {
  trigger, state, style, transition, animate,
  keyframes, query, stagger, group, sequence,
} from '@angular/animations';
```

### Building Blocks

| Function | Purpose |
|---|---|
| `trigger(name, [...])` | Named animation attached to a template element |
| `state(name, style)` | A named style state the element can be in |
| `transition('a => b', [...])` | Animation to run when moving between two states |
| `animate('timing', style)` | The actual tween — duration, easing, target styles |
| `query(selector, [...])` | Target child elements within an animation |
| `stagger(delay, [...])` | Add incremental delays to a group of animated elements |
| `group([...])` | Run multiple animations in parallel |
| `sequence([...])` | Run multiple animations one after another |
| `keyframes([...])` | Define multi-step animations within a single animate() |

### Timing Syntax

```
'200ms'                          — 200ms linear
'200ms ease-out'                 — 200ms with easing
'200ms 50ms ease-in'             — 200ms, delayed 50ms, with easing
'200ms cubic-bezier(0.4,0,0.2,1)'  — custom cubic bezier
```

### Special Transition Aliases

| Alias | Meaning |
|---|---|
| `:enter` | Element added to DOM (`void => *`) |
| `:leave` | Element removed from DOM (`* => void`) |
| `* <=> *` | Any state change in either direction |
| `void => *` | Explicit enter (same as `:enter`) |
| `* => void` | Explicit leave (same as `:leave`) |

---

## Section 3: Common Animations (Copy-Paste Ready)

### Fade In/Out

```typescript
export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('150ms ease-out', style({ opacity: 0 })),
  ]),
]);
```

### Slide In from Right

```typescript
export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('200ms cubic-bezier(0.4, 0, 0.6, 1)', style({ transform: 'translateX(100%)', opacity: 0 })),
  ]),
]);
```

### Slide In from Bottom

```typescript
export const slideInBottom = trigger('slideInBottom', [
  transition(':enter', [
    style({ transform: 'translateY(24px)', opacity: 0 }),
    animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('200ms cubic-bezier(0.4, 0, 0.6, 1)', style({ transform: 'translateY(24px)', opacity: 0 })),
  ]),
]);
```

### Expand/Collapse (Accordion)

```typescript
export const expandCollapse = trigger('expandCollapse', [
  state('collapsed', style({ height: '0', overflow: 'hidden', opacity: 0 })),
  state('expanded', style({ height: '*', overflow: 'hidden', opacity: 1 })),
  transition('collapsed <=> expanded', animate('250ms cubic-bezier(0.4, 0, 0.2, 1)')),
]);
```

Usage in template:
```html
<div [@expandCollapse]="isExpanded() ? 'expanded' : 'collapsed'">
  <ng-content />
</div>
```

### Scale In (for cards, modals, popovers)

```typescript
export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ transform: 'scale(0.95)', opacity: 0 }),
    animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'scale(1)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('150ms cubic-bezier(0.4, 0, 0.6, 1)', style({ transform: 'scale(0.95)', opacity: 0 })),
  ]),
]);
```

### List Stagger (animate items entering a list)

```typescript
export const listStagger = trigger('listStagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-8px)' }),
      stagger(60, [
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ], { optional: true }),
  ]),
]);
```

Usage:
```html
<!-- Apply trigger to the container, not individual items -->
<ul [@listStagger]="items().length">
  @for (item of items(); track item.id) {
    <li>{{ item.name }}</li>
  }
</ul>
```

### Route Transition

```typescript
export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    query(':enter', [style({ opacity: 0, transform: 'translateY(8px)' })], { optional: true }),
    query(':leave', [animate('150ms ease-in', style({ opacity: 0 }))], { optional: true }),
    query(':enter', [animate('200ms 50ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))], { optional: true }),
  ]),
]);
```

App component setup:
```typescript
// app.component.ts
getRouteAnimationData(outlet: RouterOutlet) {
  return outlet?.activatedRouteData?.['animation'];
}
```

```html
<!-- app.component.html -->
<div [@routeTransition]="getRouteAnimationData(outlet)">
  <router-outlet #outlet="outlet" />
</div>
```

Route data:
```typescript
{ path: 'home', component: HomeComponent, data: { animation: 'home' } }
```

### Shake (validation error feedback)

```typescript
export const shake = trigger('shake', [
  transition('* => shake', [
    animate('400ms', keyframes([
      style({ transform: 'translateX(0)',    offset: 0    }),
      style({ transform: 'translateX(-8px)', offset: 0.2  }),
      style({ transform: 'translateX(8px)',  offset: 0.4  }),
      style({ transform: 'translateX(-6px)', offset: 0.6  }),
      style({ transform: 'translateX(6px)',  offset: 0.8  }),
      style({ transform: 'translateX(0)',    offset: 1    }),
    ])),
  ]),
]);
```

Usage:
```html
<form [@shake]="shakeState()" (@shake.done)="shakeState.set('idle')">
```

---

## Section 4: Applying Animations in Components

```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut, listStagger, slideInRight, scaleIn],
  template: `
    @if (visible()) {
      <div @fadeInOut class="panel">Content</div>
    }

    <ul [@listStagger]="items().length">
      @for (item of items(); track item.id) {
        <li>{{ item.name }}</li>
      }
    </ul>

    @if (showPanel()) {
      <aside @slideInRight class="side-panel">
        Details...
      </aside>
    }
  `,
})
export class MyComponent {
  readonly visible = signal(true);
  readonly showPanel = signal(false);
  readonly items = signal<Item[]>([]);
}
```

### Disabling Animations Programmatically

```typescript
// Useful for tests or reduced-motion
@HostBinding('@.disabled')
get animationsDisabled() {
  return this.prefersReducedMotion;
}
```

---

## Section 5: Respecting `prefers-reduced-motion`

### CSS Approach (Global — Recommended)

```scss
// styles.scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### TypeScript Approach (Per Component)

```typescript
// Check preference at component level
readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// React to OS setting changes at runtime
private motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
readonly reducedMotion = signal(this.motionQuery.matches);

constructor() {
  this.motionQuery.addEventListener('change', e => {
    this.reducedMotion.set(e.matches);
  });
}

// Use in template
animationDuration() {
  return this.reducedMotion() ? '0ms' : '250ms';
}
```

### Angular Animation with Reduced Motion Guard

```typescript
export const safeFadeIn = trigger('safeFadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('{{ duration }}ms ease-in', style({ opacity: 1 })),
  ], { params: { duration: 200 } }),
]);
```

```html
<div [@safeFadeIn]="{ value: '', params: { duration: reducedMotion() ? 0 : 200 } }">
```

---

## Section 6: Motion Design Rules

| Rule | Guideline |
|---|---|
| Duration: micro | 100–150ms — immediate feedback (tap, hover) |
| Duration: standard | 200–300ms — most UI transitions |
| Duration: complex | 300–500ms — route changes, modals, large reveals |
| Never exceed | 500ms for UI transitions (feels sluggish) |
| Easing: enter | `ease-out` — `cubic-bezier(0, 0, 0.2, 1)` — starts fast, decelerates |
| Easing: exit | `ease-in` — `cubic-bezier(0.4, 0, 1, 1)` — starts slow, accelerates |
| Easing: standard | `ease-in-out` — `cubic-bezier(0.4, 0, 0.2, 1)` — Material standard |
| Spatial motion | Enter from direction of origin; exit toward destination |
| Avoid | Simultaneous enter + leave in the same space (stagger them) |
| Avoid | Animating `width`/`height` directly (causes layout thrash); use `transform` and `opacity` |
| Prefer | `transform` and `opacity` — GPU-composited, no layout reflow |
| Always | Test with `prefers-reduced-motion: reduce` |

### Easing Cheat Sheet

```
ease-out (decelerate — for entering elements):
  cubic-bezier(0, 0, 0.2, 1)

ease-in (accelerate — for exiting elements):
  cubic-bezier(0.4, 0, 1, 1)

ease-in-out (standard — for elements changing state):
  cubic-bezier(0.4, 0, 0.2, 1)

spring-like (bouncy, expressive):
  cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Distance Guidelines

| Element size | Recommended travel distance |
|---|---|
| Small (icon, chip) | 4–8px |
| Medium (card, panel) | 8–16px |
| Large (page, modal) | 16–32px or 100% (slide in from edge) |

---

## Section 7: Angular Material Built-in Animations

Angular Material components already have animations baked in. Do not re-animate them.

| Component | Built-in animation |
|---|---|
| `MatDialog` | Scale + fade on open/close |
| `MatSnackBar` | Slide up from bottom |
| `MatSidenav` | Slide in from side |
| `MatExpansionPanel` | Height expand/collapse |
| `MatTooltip` | Fade in/out |
| `MatMenu` | Scale + fade |
| `MatSelect` | Dropdown expand |
| `MatProgressBar` | Indeterminate shimmer |
| `MatChip` | Scale on add/remove |

These all respect `provideAnimationsAsync()` and `prefers-reduced-motion` automatically via Angular Material's internal animation config.

---

## Section 8: Animation Testing

### Disable in Unit Tests

```typescript
// In TestBed setup
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

TestBed.configureTestingModule({
  imports: [NoopAnimationsModule],  // replaces BrowserAnimationsModule
});
```

### Flush Animations in Tests

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

it('should show element after animation', fakeAsync(() => {
  component.visible.set(true);
  fixture.detectChanges();
  tick(200); // advance past animation duration
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('.panel')).toBeTruthy();
}));
```

---

## Section 9: Reusable Animation File Pattern

Centralize all animations to avoid duplication:

```
src/
  app/
    shared/
      animations/
        fade.animations.ts
        slide.animations.ts
        list.animations.ts
        route.animations.ts
        index.ts          ← barrel export
```

```typescript
// shared/animations/index.ts
export * from './fade.animations';
export * from './slide.animations';
export * from './list.animations';
export * from './route.animations';
```

```typescript
// In any component
import { fadeInOut, slideInRight, listStagger } from '@shared/animations';

@Component({
  animations: [fadeInOut, slideInRight, listStagger],
})
```
