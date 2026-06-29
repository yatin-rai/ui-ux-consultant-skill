# Angular CDK A11y and Accessibility Patterns

## Section 1: Angular CDK A11y Module

```typescript
import { A11yModule } from '@angular/cdk/a11y';
// or individual:
import { FocusTrap, FocusMonitor, LiveAnnouncer } from '@angular/cdk/a11y';
```

---

## Section 2: Focus Management

**Trap focus inside modals/dialogs:**
```html
<div cdkTrapFocus cdkTrapFocusAutoCapture>
  <h2>Dialog Title</h2>
  <button cdkFocusInitial>First focused element</button>
  <!-- Tab cycles within this div -->
</div>
```
Note: `MatDialog` handles this automatically. Use `cdkTrapFocus` for custom overlays.

**FocusMonitor — detect keyboard vs mouse focus:**
```typescript
private focusMonitor = inject(FocusMonitor);
private elementRef = inject(ElementRef);

ngAfterViewInit() {
  this.focusMonitor.monitor(this.elementRef, true).subscribe(origin => {
    // origin: 'keyboard' | 'mouse' | 'touch' | 'program' | null
    if (origin === 'keyboard') {
      // Show visible focus indicator
    }
  });
}
```

**LiveAnnouncer — announce dynamic content to screen readers:**
```typescript
private announcer = inject(LiveAnnouncer);

async save() {
  await this.saveData();
  this.announcer.announce('Changes saved successfully', 'polite');
}

async delete() {
  await this.deleteItem();
  this.announcer.announce('Item deleted', 'assertive');  // immediate
}
```

---

## Section 3: ARIA Patterns

**Current page in nav:**
```html
<mat-nav-list>
  @for (link of navLinks; track link.path) {
    <a mat-list-item [routerLink]="link.path" routerLinkActive="active"
       [attr.aria-current]="isActive(link.path) ? 'page' : null">
      {{ link.label }}
    </a>
  }
</mat-nav-list>
```

**Loading states:**
```html
<div role="status" aria-live="polite" aria-label="Loading content">
  @if (loading()) { <mat-spinner /> }
</div>
```

**Buttons that toggle:**
```html
<button mat-icon-button [attr.aria-expanded]="isOpen()" [attr.aria-label]="isOpen() ? 'Collapse menu' : 'Expand menu'"
  (click)="isOpen.update(v => !v)">
  <mat-icon>{{ isOpen() ? 'expand_less' : 'expand_more' }}</mat-icon>
</button>
```

**Icon buttons need labels:**
```html
<!-- BAD -->
<button mat-icon-button><mat-icon>delete</mat-icon></button>

<!-- GOOD -->
<button mat-icon-button aria-label="Delete item"><mat-icon>delete</mat-icon></button>
<!-- or: -->
<button mat-icon-button [matTooltip]="'Delete'" [attr.aria-label]="'Delete'">
  <mat-icon>delete</mat-icon>
</button>
```

**Data tables:**
```html
<table mat-table [dataSource]="data()" aria-label="Users list">
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef scope="col">Name</th>
    <td mat-cell *matCellDef="let row">{{ row.name }}</td>
  </ng-container>
</table>
```

---

## Section 4: Keyboard Navigation

**Skip links** (first element on page):
```html
<!-- app.component.html - very first element -->
<a href="#main-content" class="skip-link">Skip to main content</a>
<mat-sidenav-container>
  <mat-sidenav>...</mat-sidenav>
  <mat-sidenav-content>
    <main id="main-content">
      <router-outlet />
    </main>
  </mat-sidenav-content>
</mat-sidenav-container>
```
```scss
.skip-link {
  position: absolute; transform: translateY(-100%);
  &:focus { transform: translateY(0); }
}
```

**Manage focus on route change:**
```typescript
constructor() {
  inject(Router).events.pipe(
    filter(e => e instanceof NavigationEnd),
    takeUntilDestroyed(),
  ).subscribe(() => {
    // Move focus to main heading after navigation
    const heading = document.querySelector('h1');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
  });
}
```

---

## Section 5: Color Contrast Requirements

| Text Type | Minimum Contrast | Enhanced |
|---|---|---|
| Normal text (< 18pt) | 4.5:1 (AA) | 7:1 (AAA) |
| Large text (≥ 18pt bold or ≥ 24pt) | 3:1 (AA) | 4.5:1 (AAA) |
| UI components / icons | 3:1 (AA) | — |
| Decorative elements | No requirement | — |

Angular Material 3 palettes are designed to meet AA by default. Always verify when using custom colors. Use: https://webaim.org/resources/contrastchecker/

---

## Section 6: Accessibility Checklist

| Check | Implementation |
|---|---|
| All icon buttons have aria-label | `[attr.aria-label]="'Action description'"` |
| Form fields have labels | `<mat-label>` inside `<mat-form-field>` |
| Errors are associated | `<mat-error>` auto-associates with input |
| Images have alt text | `alt="..."` always; `alt=""` for decorative |
| Focus is visible | Angular Material handles this; test with keyboard |
| Skip link present | First element in app.component.html |
| Dynamic content announced | `LiveAnnouncer` for async updates |
| Color not sole indicator | Icons + text + pattern alongside color |
| Reduced motion respected | CSS `prefers-reduced-motion` media query |
| ARIA current on nav | `[attr.aria-current]="isActive ? 'page' : null"` |
