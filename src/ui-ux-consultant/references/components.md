# Angular Material 3 + CDK Component Catalog

A reference catalog for Angular Material 3 and CDK components. Each entry covers purpose, usage guidance, selector, key inputs/outputs, accessibility notes, and a minimal code example.

---

## Actions

### Button Variants (`mat-button`)

Angular Material provides six button variants mapped to M3 emphasis levels:

| Directive | M3 Variant | Emphasis | Use When |
|---|---|---|---|
| `mat-flat-button` | Filled | Highest | Primary CTA, one per screen |
| `mat-button` (with color) | Tonal | High | Secondary actions |
| `mat-raised-button` | Elevated | Medium | Actions needing separation from background |
| `mat-stroked-button` | Outlined | Low | Alternative actions, destructive confirmations |
| `mat-button` | Text | Lowest | Tertiary, inline, cancel buttons |
| `mat-icon-button` | Icon | — | Toolbar actions, compact spaces |
| `mat-fab` | FAB | — | Single primary action per view (mobile-first) |
| `mat-mini-fab` | Mini FAB | — | FAB in constrained spaces |

**M3 Emphasis Rule:** Use at most one filled button per screen region. Combine tonal + text for secondary + cancel. Never stack two filled buttons side by side.

**Key Inputs:**
- `color`: `'primary'` | `'accent'` | `'warn'`
- `disabled`: boolean
- `disableRipple`: boolean (avoid — ripple is an accessibility affordance)

**Accessibility:**
- All button variants are `<button>` elements — keyboard and screen reader accessible by default.
- `mat-icon-button` must have `aria-label` since it has no visible text.
- Never disable without explaining why (use `matTooltip` on the wrapper).

```html
<!-- Primary action -->
<button mat-flat-button color="primary" (click)="save()">
  <mat-icon>save</mat-icon> Save
</button>

<!-- Secondary action -->
<button mat-stroked-button (click)="cancel()">Cancel</button>

<!-- Icon-only toolbar button -->
<button mat-icon-button aria-label="Delete item" (click)="delete()">
  <mat-icon>delete</mat-icon>
</button>

<!-- FAB -->
<button mat-fab color="primary" aria-label="Add item" (click)="add()">
  <mat-icon>add</mat-icon>
</button>
```

```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
```

---

## Forms & Inputs

### `mat-form-field` + `matInput`

The universal wrapper for text inputs, textareas, and select. Always pair with `mat-label` and `mat-error`.

**Appearance variants:** `fill` (default M3), `outline`

**When to use:** Any text entry. Do not place `mat-select` or `mat-autocomplete` outside a form field.

**Key Inputs:**
- `appearance`: `'fill'` | `'outline'`
- `floatLabel`: `'always'` | `'auto'` (default)
- `subscriptSizing`: `'fixed'` | `'dynamic'` (dynamic avoids layout shift when no hint/error)
- `matInput` directive: standard HTML input attributes (`type`, `placeholder`, `required`, `minlength`)

**Accessibility:** `mat-label` is automatically linked via `aria-labelledby`. Always include `mat-error` with meaningful messages — screen readers announce them on blur.

```html
<mat-form-field appearance="outline">
  <mat-label>Email</mat-label>
  <input matInput type="email" [formControl]="emailCtrl" required />
  <mat-hint>We'll never share your email.</mat-hint>
  <mat-error *ngIf="emailCtrl.hasError('required')">Email is required.</mat-error>
  <mat-error *ngIf="emailCtrl.hasError('email')">Enter a valid email.</mat-error>
</mat-form-field>
```

---

### `mat-select` + `mat-option`

Dropdown select. Use for ≤10 options with known values. For search-as-you-type or >10 options, use `mat-autocomplete`.

**Key Inputs:**
- `multiple`: boolean — enables multi-select
- `[compareWith]`: function — for object values
- `panelClass`: string — style the dropdown panel

**Outputs:** `(selectionChange)`: `MatSelectChange`

**Accessibility:** Implements ARIA `listbox`/`option` roles. Always inside `mat-form-field`.

```html
<mat-form-field appearance="outline">
  <mat-label>Country</mat-label>
  <mat-select [formControl]="countryCtrl">
    <mat-option value="">-- Select --</mat-option>
    <mat-option *ngFor="let c of countries" [value]="c.code">
      {{ c.name }}
    </mat-option>
  </mat-select>
  <mat-error *ngIf="countryCtrl.hasError('required')">Required.</mat-error>
</mat-form-field>
```

---

### `mat-autocomplete`

Search-as-you-type dropdown. Requires `[matAutocomplete]` binding on an `matInput` and an `async` pipe or manual subscription to filter options.

**When to use:** >10 options, freeform + suggestion combined, or when options depend on search query.

**Key Inputs:**
- `[displayWith]`: function to convert option value to display string
- `autoSelectActiveOption`: boolean
- `panelWidth`: `'auto'` | string

**Outputs:** `(optionSelected)`: `MatAutocompleteSelectedEvent`

```html
<mat-form-field appearance="outline">
  <mat-label>City</mat-label>
  <input matInput [formControl]="cityCtrl" [matAutocomplete]="auto" />
  <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayCity">
    <mat-option *ngFor="let city of filteredCities$ | async" [value]="city">
      {{ city.name }}, {{ city.country }}
    </mat-option>
  </mat-autocomplete>
</mat-form-field>
```

```typescript
filteredCities$ = this.cityCtrl.valueChanges.pipe(
  startWith(''),
  map(v => this.filter(v ?? ''))
);
```

---

### `mat-checkbox`

Boolean form field. Use for independent true/false choices or multi-select lists.

**Do not use** for mutually exclusive choices — use `mat-radio-group` instead.

**Key Inputs:**
- `[checked]`: boolean
- `[indeterminate]`: boolean (for "select all" parent states)
- `[labelPosition]`: `'before'` | `'after'`
- `[formControl]`

**Outputs:** `(change)`: `MatCheckboxChange`

**Accessibility:** Renders as `<input type="checkbox">`. Indeterminate state is conveyed via `aria-checked="mixed"`.

```html
<mat-checkbox [formControl]="agreeCtrl" labelPosition="after">
  I agree to the <a href="/terms">Terms of Service</a>
</mat-checkbox>
```

---

### `mat-radio-group` + `mat-radio-button`

Exclusive selection from a small set. Use when choices are ≤5 and all options should be visible simultaneously.

**Key Inputs on group:**
- `[value]`: selected value
- `[formControl]`
- `name`: auto-generated but can be overridden

**Key Inputs on button:**
- `[value]`: option value
- `[disabled]`: boolean per option

**Accessibility:** Implements ARIA `radiogroup`/`radio`. Group must have an accessible name via `aria-label` or `aria-labelledby`.

```html
<label id="plan-label">Billing Plan</label>
<mat-radio-group [formControl]="planCtrl" aria-labelledby="plan-label">
  <mat-radio-button value="monthly">Monthly</mat-radio-button>
  <mat-radio-button value="annual">Annual (save 20%)</mat-radio-button>
  <mat-radio-button value="lifetime">Lifetime</mat-radio-button>
</mat-radio-group>
```

---

### `mat-slide-toggle`

Binary setting that takes effect immediately (no form submission needed). Distinguish from checkbox: use slide-toggle for settings panels, checkbox for form fields.

**Key Inputs:**
- `[formControl]`
- `[checked]`: boolean
- `color`: `'primary'` | `'accent'` | `'warn'`
- `labelPosition`: `'before'` | `'after'`

**Outputs:** `(change)`: `MatSlideToggleChange`

```html
<mat-slide-toggle [formControl]="notificationsCtrl" color="primary">
  Push notifications
</mat-slide-toggle>
```

---

### `mat-datepicker`

Date input with calendar popup. Always set `[min]` and `[max]` to guide users. Always include `mat-datepicker-toggle`.

**Key Inputs:**
- `[min]`: Date
- `[max]`: Date
- `[startView]`: `'month'` | `'year'` | `'multi-year'`
- `[dateFilter]`: function to disable specific dates
- `touchUi`: boolean (mobile-friendly full-screen picker)

**Accessibility:** Requires `MatDatepickerModule` and a `DateAdapter`. Calendar is keyboard navigable with arrow keys.

```html
<mat-form-field appearance="outline">
  <mat-label>Date of Birth</mat-label>
  <input matInput [matDatepicker]="picker" [formControl]="dobCtrl"
         [max]="maxDate" />
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker startView="multi-year" />
  <mat-error *ngIf="dobCtrl.hasError('matDatepickerMax')">
    Date must be in the past.
  </mat-error>
</mat-form-field>
```

---

### `mat-slider`

Numeric range input. Use for approximate values where exact input isn't critical (volume, opacity, price range). Always display the current value.

**Key Inputs:**
- `[min]`: number (default 0)
- `[max]`: number (default 100)
- `[step]`: number
- `discrete`: boolean (shows value bubble on drag)
- `showTickMarks`: boolean

**Accessibility:** Renders as `<input type="range">`. Always pair with a visible label.

```html
<label id="vol-label">Volume: {{ volumeCtrl.value }}</label>
<mat-slider min="0" max="100" step="5" discrete aria-labelledby="vol-label">
  <input matSliderThumb [formControl]="volumeCtrl" />
</mat-slider>
```

---

### `mat-chips` + `mat-chip-grid`

Tag input for multi-select with search. Use `mat-chip-grid` for interactive chip inputs; use `mat-chip-listbox` for selection chips; use `mat-chip-set` for display-only.

**Key Outputs:**
- `(removed)`: `MatChipEvent` on chip grid
- `(chipEnd)`: `MatChipInputEvent` from `[matChipInputFor]`

```html
<mat-form-field appearance="outline">
  <mat-label>Tags</mat-label>
  <mat-chip-grid #chipGrid>
    <mat-chip-row *ngFor="let tag of tags" (removed)="remove(tag)">
      {{ tag }}
      <button matChipRemove aria-label="Remove {{ tag }}">
        <mat-icon>cancel</mat-icon>
      </button>
    </mat-chip-row>
  </mat-chip-grid>
  <input placeholder="Add tag..." [matChipInputFor]="chipGrid"
         (matChipInputTokenEnd)="add($event)" />
</mat-form-field>
```

---

## Navigation

### `mat-toolbar`

App bar / top navigation bar. For persistent navigation, use `position: sticky; top: 0` in CSS.

**Key Inputs:**
- `color`: `'primary'` | `'accent'` | `'warn'`

```html
<mat-toolbar color="primary" class="app-toolbar">
  <button mat-icon-button aria-label="Open menu" (click)="sidenav.toggle()">
    <mat-icon>menu</mat-icon>
  </button>
  <span class="toolbar-title">My App</span>
  <span class="spacer"></span>
  <button mat-icon-button aria-label="User account">
    <mat-icon>account_circle</mat-icon>
  </button>
</mat-toolbar>
```

```scss
.app-toolbar { position: sticky; top: 0; z-index: 1000; }
.spacer { flex: 1; }
```

---

### `mat-sidenav-container` + `mat-sidenav` + `mat-sidenav-content`

Side navigation layout. Handles desktop persistent nav and mobile overlay nav.

**`mat-sidenav` Key Inputs:**
- `mode`: `'over'` (overlay, default mobile) | `'side'` (pushes content, desktop) | `'push'`
- `opened`: boolean
- `position`: `'start'` | `'end'`
- `fixedInViewport`: boolean (sticky sidenav regardless of scroll)

**Outputs:** `(opened)`, `(closed)`, `(openedChange)`

**Responsive pattern — switch mode based on viewport:**

```typescript
// component.ts
readonly isHandset$ = inject(BreakpointObserver)
  .observe(Breakpoints.Handset)
  .pipe(map(r => r.matches), shareReplay());
```

```html
<mat-sidenav-container>
  <mat-sidenav #sidenav
    [mode]="(isHandset$ | async) ? 'over' : 'side'"
    [opened]="!(isHandset$ | async)">
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <span matListItemTitle>Dashboard</span>
      </a>
      <a mat-list-item routerLink="/settings" routerLinkActive="active">
        <mat-icon matListItemIcon>settings</mat-icon>
        <span matListItemTitle>Settings</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content>
    <router-outlet />
  </mat-sidenav-content>
</mat-sidenav-container>
```

---

### `mat-tab-group` + `mat-tab`

Horizontal tabs for switching between related views. Keep ≤5 tabs visible; use `mat-tab-nav-bar` for router-linked tabs.

**Key Inputs on group:**
- `[selectedIndex]`
- `animationDuration`: `'0ms'` to disable animation
- `mat-stretch-tabs`: boolean (fills full width)
- `color`, `backgroundColor`

**Outputs:** `(selectedTabChange)`: `MatTabChangeEvent`

```html
<mat-tab-group [selectedIndex]="activeTab" (selectedIndexChange)="activeTab = $event">
  <mat-tab label="Overview">
    <ng-template matTabContent> <!-- lazy loaded -->
      <app-overview />
    </ng-template>
  </mat-tab>
  <mat-tab label="Analytics">
    <ng-template matTabContent>
      <app-analytics />
    </ng-template>
  </mat-tab>
</mat-tab-group>
```

---

### `mat-stepper`

Multi-step wizard. Use `linear` for guided flows where each step must be completed before proceeding.

**Key Inputs:**
- `linear`: boolean — validates before allowing next step
- `orientation`: `'horizontal'` | `'vertical'`
- `[selectedIndex]`

**Step Inputs:**
- `[stepControl]`: AbstractControl — form group for step validation
- `label`: string or `matStepLabel` template
- `optional`: boolean
- `editable`: boolean

```html
<mat-stepper linear orientation="vertical" #stepper>
  <mat-step [stepControl]="accountForm" label="Account">
    <form [formGroup]="accountForm">
      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email" />
      </mat-form-field>
      <div>
        <button mat-flat-button color="primary" matStepperNext>Next</button>
      </div>
    </form>
  </mat-step>
  <mat-step [stepControl]="profileForm" label="Profile">
    <form [formGroup]="profileForm">
      <!-- fields -->
      <button mat-stroked-button matStepperPrevious>Back</button>
      <button mat-flat-button color="primary" matStepperNext>Next</button>
    </form>
  </mat-step>
  <mat-step label="Confirm">
    <button mat-flat-button color="primary" (click)="submit()">Submit</button>
  </mat-step>
</mat-stepper>
```

---

### `mat-menu` + `mat-menu-item`

Contextual menus triggered by user action. Never use for primary navigation.

**Key Inputs on menu:**
- `xPosition`: `'before'` | `'after'`
- `yPosition`: `'above'` | `'below'`
- `overlapTrigger`: boolean

**Trigger directive:** `[matMenuTriggerFor]="menu"` on any element.

**Accessibility:** Implements ARIA `menu`/`menuitem`. Keyboard: Enter/Space to open, arrows to navigate, Escape to close.

```html
<button mat-icon-button [matMenuTriggerFor]="actionsMenu" aria-label="More actions">
  <mat-icon>more_vert</mat-icon>
</button>

<mat-menu #actionsMenu>
  <button mat-menu-item (click)="edit()">
    <mat-icon>edit</mat-icon> Edit
  </button>
  <button mat-menu-item (click)="duplicate()">
    <mat-icon>content_copy</mat-icon> Duplicate
  </button>
  <mat-divider />
  <button mat-menu-item class="danger" (click)="delete()">
    <mat-icon>delete</mat-icon> Delete
  </button>
</mat-menu>
```

---

## Data Display

### `mat-table` + `matColumnDef`

Feature-rich data table. Always implement `trackBy` for performance. Provide loading and empty states.

**Directives:**
- `matColumnDef`: defines a column
- `matHeaderCellDef`, `matCellDef`, `matFooterCellDef`: cell templates
- `matHeaderRowDef`, `matRowDef`: row templates
- `matSort`: add to table for sortable columns
- `mat-sort-header`: add to `<th>` to make sortable

**Key Inputs:**
- `[dataSource]`: array, Observable, or `MatTableDataSource`
- `[trackBy]`: function
- `multiTemplateDataRows`: boolean (expandable rows)

**Accessibility:** Renders as `<table>` with proper `<thead>`, `<tbody>`. Sort headers announce direction changes.

```typescript
// component.ts
dataSource = new MatTableDataSource<User>();
displayedColumns = ['name', 'email', 'role', 'actions'];
isLoading = signal(true);

@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatPaginator) paginator!: MatPaginator;

ngAfterViewInit() {
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}

trackByUserId = (_: number, user: User) => user.id;
```

```html
<div class="table-container">
  <!-- Loading -->
  <mat-progress-bar *ngIf="isLoading()" mode="indeterminate" />

  <table mat-table [dataSource]="dataSource" matSort [trackBy]="trackByUserId">

    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
      <td mat-cell *matCellDef="let row">{{ row.name }}</td>
    </ng-container>

    <!-- Email Column -->
    <ng-container matColumnDef="email">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
      <td mat-cell *matCellDef="let row">{{ row.email }}</td>
    </ng-container>

    <!-- Actions Column -->
    <ng-container matColumnDef="actions" stickyEnd>
      <th mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let row">
        <button mat-icon-button (click)="edit(row)" aria-label="Edit">
          <mat-icon>edit</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"
        [class.selected]="selectedRow === row"
        (click)="select(row)"></tr>

    <!-- Empty state -->
    <tr class="mat-row" *matNoDataRow>
      <td class="mat-cell empty-state" [attr.colspan]="displayedColumns.length">
        No records found.
      </td>
    </tr>
  </table>

  <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons />
</div>
```

---

### `mat-paginator`

Pagination controls. Always pair with `MatTableDataSource` or handle `(page)` events manually for server-side pagination.

**Key Inputs:**
- `[length]`: total item count (required for server-side)
- `[pageSize]`: default page size
- `[pageSizeOptions]`: number[]
- `showFirstLastButtons`: boolean
- `[pageIndex]`: current page (0-based)

**Outputs:** `(page)`: `PageEvent`

---

### `mat-list` + `mat-list-item`

Simple item lists. Use `mat-nav-list` for lists of links. Use `mat-action-list` for clickable non-link items.

**Slot directives on list-item:**
- `matListItemTitle`: primary text
- `matListItemLine`: secondary/tertiary text (up to 3)
- `matListItemIcon`: leading icon
- `matListItemAvatar`: leading avatar
- `[matListItemMeta]`: trailing content

```html
<mat-list>
  <mat-list-item *ngFor="let file of files">
    <mat-icon matListItemIcon>insert_drive_file</mat-icon>
    <span matListItemTitle>{{ file.name }}</span>
    <span matListItemLine>{{ file.size | filesize }} · {{ file.modified | date }}</span>
    <button matListItemMeta mat-icon-button aria-label="Download">
      <mat-icon>download</mat-icon>
    </button>
  </mat-list-item>
</mat-list>
```

---

### `mat-card`

Content container. Use for grouping related information. Do not overuse — cards add visual weight.

**Sub-components:**
- `mat-card-header`: title row (use `mat-card-title`, `mat-card-subtitle`)
- `mat-card-content`: main body (padded)
- `mat-card-actions`: button row (use `align="end"`)
- `mat-card-footer`: bottom metadata

**Inputs:** `appearance`: `'raised'` | `'outlined'` | `'filled'`

```html
<mat-card appearance="outlined">
  <mat-card-header>
    <img mat-card-avatar src="{{ user.avatar }}" alt="{{ user.name }}" />
    <mat-card-title>{{ user.name }}</mat-card-title>
    <mat-card-subtitle>{{ user.role }}</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <p>{{ user.bio }}</p>
  </mat-card-content>
  <mat-card-actions align="end">
    <button mat-stroked-button>View Profile</button>
    <button mat-flat-button color="primary">Message</button>
  </mat-card-actions>
</mat-card>
```

---

### `mat-expansion-panel`

Accordion panels for progressive disclosure. Group with `mat-accordion` to enforce single-open behavior.

**Key Inputs on panel:**
- `expanded`: boolean
- `disabled`: boolean
- `hideToggle`: boolean

**Key Inputs on accordion:**
- `multi`: boolean (allow multiple panels open; default false)
- `displayMode`: `'default'` | `'flat'`

**Outputs:** `(opened)`, `(closed)`, `(expandedChange)`

```html
<mat-accordion>
  <mat-expansion-panel *ngFor="let section of sections">
    <mat-expansion-panel-header>
      <mat-panel-title>{{ section.title }}</mat-panel-title>
      <mat-panel-description>{{ section.summary }}</mat-panel-description>
    </mat-expansion-panel-header>
    <p>{{ section.content }}</p>
  </mat-expansion-panel>
</mat-accordion>
```

---

### `mat-badge`

Notification count overlaid on icons or buttons. Use for unread counts, cart quantities, or status indicators.

**Directive:** `[matBadge]` applied to host element.

**Key Inputs:**
- `[matBadge]`: string | number (the badge content)
- `matBadgeColor`: `'primary'` | `'accent'` | `'warn'`
- `matBadgePosition`: `'above after'` | `'above before'` | `'below after'` | `'below before'`
- `[matBadgeHidden]`: boolean (hide when count is 0)
- `matBadgeSize`: `'small'` | `'medium'` | `'large'`

**Accessibility:** Set `matBadgeDescription` for screen readers (e.g., `"3 unread notifications"`).

```html
<button mat-icon-button
  [matBadge]="unreadCount"
  [matBadgeHidden]="unreadCount === 0"
  matBadgeColor="warn"
  matBadgeDescription="{{ unreadCount }} unread notifications"
  aria-label="Notifications">
  <mat-icon>notifications</mat-icon>
</button>
```

---

### `mat-chip` (Display)

Read-only tags/categories. For interactive chips, use `mat-chip-listbox`; for input, use `mat-chip-grid`.

```html
<!-- Category tags -->
<mat-chip-set aria-label="Article categories">
  <mat-chip *ngFor="let tag of article.tags">{{ tag }}</mat-chip>
</mat-chip-set>

<!-- Status chip with icon -->
<mat-chip color="primary" highlighted>
  <mat-icon matChipAvatar>check_circle</mat-icon>
  Active
</mat-chip>
```

---

### `mat-divider`

Visual separator. Use sparingly — whitespace is usually preferable. Use `inset` for list dividers that align with text.

```html
<mat-divider />                    <!-- full-width -->
<mat-divider inset />              <!-- inset (aligns with list text) -->
<mat-divider vertical />           <!-- vertical (in flex containers) -->
```

---

## Feedback & Overlays

### `MatDialog`

Modal dialogs for focused user tasks. Inject `MatDialog` service. Pass data via `MAT_DIALOG_DATA` token. Receive results via `afterClosed()`.

**`dialog.open()` Config:**
- `data`: any — passed to dialog component
- `width`, `maxWidth`, `height`: string
- `disableClose`: boolean (prevent backdrop click / Escape close)
- `autoFocus`: `'first-tabbable'` | `'dialog'` | `false`
- `panelClass`: string | string[] — add CSS classes to overlay

**Accessibility:** Focus is trapped inside the dialog. Escape closes by default. Dialog role is `dialog` with `aria-labelledby` pointing to title.

```typescript
// Caller component
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

readonly #dialog = inject(MatDialog);

openConfirm() {
  const ref = this.#dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: { message: 'Delete this item permanently?' }
  });

  ref.afterClosed().subscribe(confirmed => {
    if (confirmed) this.delete();
  });
}
```

```typescript
// Dialog component
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  readonly data = inject<{ message: string }>(MAT_DIALOG_DATA);
}
```

---

### `MatSnackBar`

Brief, non-disruptive notifications. Max 2 lines of text. Use action button for undo patterns.

**Duration guidance:**
- Informational: `3000ms`
- Success with undo: `5000ms`
- Errors with action: `10000ms` or `0` (manual dismiss)

**`snackBar.open()` Config:**
- `duration`: ms (0 = no auto-dismiss)
- `horizontalPosition`: `'start'` | `'center'` | `'end'` | `'left'` | `'right'`
- `verticalPosition`: `'top'` | `'bottom'`
- `panelClass`: string[]

```typescript
readonly #snackBar = inject(MatSnackBar);

showSuccess(message: string) {
  this.#snackBar.open(message, 'Dismiss', {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    panelClass: ['snack-success']
  });
}

showUndo(message: string, undoFn: () => void) {
  const ref = this.#snackBar.open(message, 'Undo', { duration: 5000 });
  ref.onAction().subscribe(undoFn);
}
```

---

### `mat-progress-bar`

Linear progress indicator. Use `indeterminate` for unknown duration operations; `determinate` when progress percentage is known.

**Key Inputs:**
- `mode`: `'determinate'` | `'indeterminate'` | `'buffer'` | `'query'`
- `[value]`: 0–100 (for determinate)
- `[bufferValue]`: 0–100 (for buffer mode)
- `color`: `'primary'` | `'accent'` | `'warn'`

**Accessibility:** Has `role="progressbar"` with `aria-valuenow` for determinate mode. Add `aria-label`.

```html
<!-- Page-level loading bar (top of content) -->
<mat-progress-bar *ngIf="isLoading" mode="indeterminate" aria-label="Loading..." />

<!-- Upload progress -->
<mat-progress-bar mode="determinate" [value]="uploadProgress" aria-label="Upload progress" />
```

---

### `mat-spinner` / `mat-progress-spinner`

Circular progress. `mat-spinner` is shorthand for `mode="indeterminate"`. Use inside buttons for async action feedback.

**Key Inputs:**
- `mode`: `'determinate'` | `'indeterminate'`
- `[value]`: 0–100
- `[diameter]`: number (px, default 100)
- `[strokeWidth]`: number

```html
<!-- Button loading state -->
<button mat-flat-button color="primary" [disabled]="isSaving" (click)="save()">
  <mat-spinner *ngIf="isSaving" diameter="20" strokeWidth="2" />
  <span *ngIf="!isSaving">Save</span>
</button>

<!-- Full-page spinner -->
<div class="spinner-overlay" *ngIf="isLoading" role="status" aria-label="Loading">
  <mat-spinner />
</div>
```

---

### `mat-tooltip`

Hover/focus hints for supplementary information. Never place critical information only in tooltips (not accessible on touch devices).

**Key Inputs:**
- `[matTooltip]`: string — tooltip text
- `matTooltipPosition`: `'above'` | `'below'` | `'left'` | `'right'` | `'before'` | `'after'`
- `[matTooltipDisabled]`: boolean
- `matTooltipShowDelay`, `matTooltipHideDelay`: ms

**Accessibility:** Content is exposed via `aria-describedby`. Does not work for touch-only users — always provide alternative text.

```html
<button mat-icon-button
  aria-label="Delete item"
  matTooltip="Delete this item permanently"
  matTooltipPosition="above"
  (click)="delete()">
  <mat-icon>delete</mat-icon>
</button>

<!-- Disabled button with tooltip on wrapper -->
<span matTooltip="You don't have permission to edit">
  <button mat-flat-button disabled>Edit</button>
</span>
```

---

### `MatBottomSheet`

Mobile-first action sheets from the bottom of the screen. Use instead of dialogs on mobile for action menus.

```typescript
readonly #bottomSheet = inject(MatBottomSheet);

openActions() {
  const ref = this.#bottomSheet.open(ActionsSheetComponent, {
    data: { item: this.selectedItem }
  });
  ref.afterDismissed().subscribe(action => {
    if (action) this.handleAction(action);
  });
}
```

---

## Layout (CDK)

### `CdkVirtualScrollViewport` — Virtual Scrolling

Renders only visible items. Essential for lists exceeding 100 items.

**Import:** `ScrollingModule` from `@angular/cdk/scrolling`

**Key Inputs:**
- `itemSize`: number (px, required for fixed-size strategy)
- `orientation`: `'vertical'` | `'horizontal'`
- `minBufferPx`, `maxBufferPx`: render buffer sizes

```html
<cdk-virtual-scroll-viewport itemSize="72" class="list-viewport">
  <mat-list-item *cdkVirtualFor="let item of items; trackBy: trackById">
    <span matListItemTitle>{{ item.name }}</span>
  </mat-list-item>
</cdk-virtual-scroll-viewport>
```

```scss
.list-viewport {
  height: 400px;    /* Must have fixed height */
  width: 100%;
}
```

---

### `CdkDragDrop` — Drag and Drop

Reorderable lists and kanban-style boards.

**Import:** `DragDropModule` from `@angular/cdk/drag-drop`

**Key Directives:**
- `cdkDropList`: container
- `cdkDrag`: draggable item
- `[cdkDropListConnectedTo]`: link multiple lists for cross-list drag

**Outputs:** `(cdkDropListDropped)`: `CdkDragDrop<T>`

```html
<div cdkDropList class="task-list" (cdkDropListDropped)="drop($event)">
  <div class="task-card" *ngFor="let task of tasks" cdkDrag>
    <mat-icon cdkDragHandle>drag_indicator</mat-icon>
    {{ task.title }}
    <div *cdkDragPlaceholder class="drag-placeholder"></div>
  </div>
</div>
```

```typescript
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

drop(event: CdkDragDrop<Task[]>) {
  moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
}
```

---

### `BreakpointObserver`

Responsive layout decisions in TypeScript. Prefer CSS media queries for styling; use `BreakpointObserver` only when layout changes require component logic.

**Import:** `LayoutModule` from `@angular/cdk/layout`

**Built-in breakpoints:** `Breakpoints.Handset`, `Breakpoints.Tablet`, `Breakpoints.Web`, `Breakpoints.HandsetPortrait`, etc.

```typescript
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

readonly #bp = inject(BreakpointObserver);

readonly isHandset$ = this.#bp
  .observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay(1)
  );

readonly isMediumUp$ = this.#bp
  .observe(['(min-width: 768px)'])
  .pipe(map(r => r.matches));
```

---

### `CdkPortal` — Portal / Teleport

Render a template or component in a different location in the DOM (e.g., inject content into a header from a child route).

**Import:** `PortalModule` from `@angular/cdk/portal`

```typescript
// Child component provides a portal
@ViewChild('actionButtons') actionButtonsPortal!: TemplatePortal;

ngAfterViewInit() {
  this.headerService.setPortal(this.actionButtonsPortal);
}
```

```html
<ng-template #actionButtons>
  <button mat-flat-button color="primary">Save</button>
</ng-template>
```

---

## Icons

### `mat-icon`

Display Material icons. Angular Material v15+ defaults to Material Symbols (variable font), which supports optical size, weight, fill, and grade axes.

**Setup in `index.html`:**
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
```

**Key Inputs:**
- `fontSet`: `'material-symbols-outlined'` | `'material-icons'`
- `fontIcon`: icon name (alternative to text content)
- `[inline]`: boolean (sizes to surrounding text)
- `[color]`: `'primary'` | `'accent'` | `'warn'`

**Custom SVG icons via `MatIconRegistry`:**
```typescript
// app.config.ts or component
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const iconRegistry = inject(MatIconRegistry);
const sanitizer = inject(DomSanitizer);

iconRegistry.addSvgIcon(
  'custom-logo',
  sanitizer.bypassSecurityTrustResourceUrl('assets/icons/logo.svg')
);
```

```html
<!-- Material Symbol -->
<mat-icon fontSet="material-symbols-outlined">rocket_launch</mat-icon>

<!-- Custom SVG -->
<mat-icon svgIcon="custom-logo" aria-hidden="true" />

<!-- Decorative (hide from screen readers) -->
<mat-icon aria-hidden="true">star</mat-icon>

<!-- Meaningful (describe to screen readers) -->
<mat-icon aria-label="Starred">star</mat-icon>
```

**Accessibility:** Set `aria-hidden="true"` on decorative icons. For meaningful standalone icons, add `aria-label`.

---

## Import Reference

```typescript
// Commonly needed imports (standalone component style)
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { PortalModule } from '@angular/cdk/portal';
```
