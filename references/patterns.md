# Angular UI/UX Patterns Reference

Angular UI/UX patterns for signals, forms, routing, and component architecture.

---

## Section 1: Signals-Based UI Patterns (Angular 17+)

### Pattern: Signal-Driven List with Loading/Empty/Error States

```typescript
@Component({
  selector: 'app-user-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressBarModule, MatListModule, CommonModule],
  template: `
    @if (loading()) {
      <mat-progress-bar mode="indeterminate" />
    } @else if (error()) {
      <div class="error">{{ error() }}</div>
    } @else if (users().length === 0) {
      <p class="empty">No users found.</p>
    } @else {
      <mat-list>
        @for (user of users(); track user.id) {
          <mat-list-item>{{ user.name }}</mat-list-item>
        }
      </mat-list>
    }
  `,
})
export class UserListComponent {
  private userService = inject(UserService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly users = signal<User[]>([]);

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.users.set(await this.userService.getAll());
    } catch (e) {
      this.error.set('Failed to load users. Try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
```

### Pattern: Optimistic UI with Rollback

```typescript
async toggleFavorite(item: Item) {
  const snapshot = this.items();
  // Optimistic update
  this.items.update(list =>
    list.map(i => i.id === item.id ? { ...i, isFavorite: !i.isFavorite } : i)
  );
  try {
    await this.api.toggleFavorite(item.id);
  } catch {
    this.items.set(snapshot); // rollback
    this.snackBar.open('Update failed. Changes reverted.', 'OK', { duration: 5000 });
  }
}
```

### Pattern: Derived/Computed State

```typescript
readonly searchQuery = signal('');
readonly allItems = signal<Item[]>([]);
readonly filteredItems = computed(() => {
  const q = this.searchQuery().toLowerCase();
  return q ? this.allItems().filter(i => i.name.toLowerCase().includes(q)) : this.allItems();
});
readonly totalCount = computed(() => this.filteredItems().length);
```

### Pattern: RxJS to Signals Bridge

```typescript
private destroy$ = inject(DestroyRef);

// Convert Observable to signal (use in constructor or ngOnInit)
readonly currentUser = toSignal(this.authService.currentUser$, { initialValue: null });

// Subscribe with auto-cleanup
this.someObservable$
  .pipe(takeUntilDestroyed(this.destroy$))
  .subscribe(value => this.mySignal.set(value));
```

---

## Section 2: Smart/Dumb Component Pattern

### Smart (Container) Component

```typescript
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardStatsComponent, RecentActivityComponent],
  template: `
    <app-dashboard-stats [stats]="stats()" (refresh)="loadStats()" />
    <app-recent-activity [activities]="activities()" />
  `,
})
export class DashboardPageComponent {
  private dashboardService = inject(DashboardService);
  readonly stats = toSignal(this.dashboardService.stats$);
  readonly activities = toSignal(this.dashboardService.recentActivities$);
  loadStats() { this.dashboardService.refresh(); }
}
```

### Dumb (Presentation) Component

```typescript
@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // No injected services — pure input/output
  template: `...`,
})
export class DashboardStatsComponent {
  readonly stats = input<Stats | undefined>();
  readonly refresh = output<void>();
}
```

**Rules:**
- Dumb components have zero injected services.
- All data comes via `input()`.
- All events go via `output()`.
- Easy to test, easy to reuse.

---

## Section 3: Angular Router UX Patterns

### Lazy Loading with Loading UX

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.routes').then(m => m.SETTINGS_ROUTES),
  },
];
```

### Route-Level Loading Indicator

```typescript
// app.component.ts
readonly isNavigating = signal(false);

constructor() {
  const router = inject(Router);
  router.events.pipe(
    takeUntilDestroyed(),
  ).subscribe(event => {
    if (event instanceof NavigationStart) this.isNavigating.set(true);
    if (event instanceof NavigationEnd || event instanceof NavigationCancel) this.isNavigating.set(false);
  });
}
```

```html
<!-- app.component.html -->
@if (isNavigating()) {
  <mat-progress-bar mode="indeterminate" class="nav-loader" />
}
<router-outlet />
```

### Data Prefetch with Resolvers

```typescript
// dashboard.resolver.ts
export const dashboardResolver: ResolveFn<DashboardData> = (route, state) => {
  return inject(DashboardService).getData();
};

// dashboard.routes.ts
{ path: 'dashboard', component: DashboardComponent, resolve: { data: dashboardResolver } }

// dashboard.component.ts
readonly data = toSignal(inject(ActivatedRoute).data.pipe(map(d => d['data'])));
```

### Functional Route Guards

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
```

### Skeleton Loaders During Route Transition

Show skeleton UI immediately, replace with real content when data arrives:

```html
@if (data(); as d) {
  <app-dashboard-content [data]="d" />
} @else {
  <app-dashboard-skeleton />  <!-- CSS skeleton shimmer -->
}
```

---

## Section 4: Dialog & Sheet Patterns

### Opening a Dialog

```typescript
private dialog = inject(MatDialog);
private destroyRef = inject(DestroyRef);

openEditDialog(item: Item) {
  const ref = this.dialog.open(EditItemDialogComponent, {
    width: '480px',
    maxWidth: '95vw',
    data: { item },
  });

  ref.afterClosed().pipe(
    filter(result => !!result),
    takeUntilDestroyed(this.destroyRef),
  ).subscribe(updatedItem => this.updateItem(updatedItem));
}
```

### Dialog Component

```typescript
@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Edit Item</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline">
        <mat-label>Name</mat-label>
        <input matInput [formControl]="nameControl" />
        <mat-error>Name is required</mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="!nameControl.valid" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
})
export class EditItemDialogComponent {
  private dialogRef = inject(MatDialogRef<EditItemDialogComponent>);
  private data = inject<{ item: Item }>(MAT_DIALOG_DATA);

  readonly nameControl = new FormControl(this.data.item.name, Validators.required);

  save() {
    if (this.nameControl.valid) {
      this.dialogRef.close({ ...this.data.item, name: this.nameControl.value });
    }
  }
}
```

### Bottom Sheet Pattern

```typescript
private bottomSheet = inject(MatBottomSheet);

openOptions(item: Item) {
  const ref = this.bottomSheet.open(ItemOptionsSheetComponent, { data: { item } });
  ref.afterDismissed().pipe(
    filter(action => !!action),
  ).subscribe(action => this.handleAction(action, item));
}
```

---

## Section 5: Reactive Forms Patterns

### Typed Form Group

```typescript
interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<'admin' | 'user'>;
}

readonly form = new FormGroup<UserForm>({
  name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  role: new FormControl('user', { nonNullable: true }),
});
```

### Form Validation with Signal-Driven Error Display

```typescript
// In component
readonly nameError = computed(() => {
  const ctrl = this.form.controls.name;
  if (ctrl.hasError('required')) return 'Name is required';
  if (ctrl.hasError('minlength')) return 'Name must be at least 2 characters';
  return null;
});
```

```html
<mat-form-field appearance="outline">
  <mat-label>Name</mat-label>
  <input matInput formControlName="name" />
  @if (nameError()) {
    <mat-error>{{ nameError() }}</mat-error>
  }
</mat-form-field>
```

### Async Validator (e.g., Check Username Availability)

```typescript
const usernameAvailable: AsyncValidatorFn = (ctrl) => {
  return inject(UserService).checkUsername(ctrl.value).pipe(
    map(available => available ? null : { usernameTaken: true }),
    catchError(() => of(null)),
  );
};
```

### Form Submit with Loading State

```typescript
readonly saving = signal(false);

async submit() {
  if (this.form.invalid || this.saving()) return;
  this.saving.set(true);
  try {
    await this.service.save(this.form.getRawValue());
    this.snackBar.open('Saved!', undefined, { duration: 3000 });
    this.dialogRef.close(true);
  } catch {
    this.snackBar.open('Save failed. Please try again.', 'OK', { duration: 5000 });
  } finally {
    this.saving.set(false);
  }
}
```

```html
<button mat-flat-button color="primary" [disabled]="form.invalid || saving()" (click)="submit()">
  @if (saving()) { <mat-spinner diameter="18" /> } @else { Save }
</button>
```

---

## Section 6: Responsive Layout Pattern

### Adaptive Sidenav

```typescript
readonly isHandset = toSignal(
  inject(BreakpointObserver).observe(Breakpoints.Handset).pipe(map(r => r.matches)),
  { initialValue: false }
);
```

```html
<mat-sidenav-container>
  <mat-sidenav
    [mode]="isHandset() ? 'over' : 'side'"
    [opened]="!isHandset()"
  >
    <mat-nav-list>...</mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content>
    <router-outlet />
  </mat-sidenav-content>
</mat-sidenav-container>
```

### Responsive Grid with CSS Grid

```scss
.card-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}
```

### Breakpoint Constants (Angular CDK)

```typescript
import { Breakpoints } from '@angular/cdk/layout';
// Breakpoints.Handset       — phones portrait + landscape
// Breakpoints.Tablet        — tablets portrait + landscape
// Breakpoints.Web           — desktops
// Breakpoints.HandsetPortrait
// Breakpoints.TabletLandscape
```

---

## Section 7: Infinite Scroll with CDK Virtual Scroll

```typescript
// Use CdkVirtualScrollViewport for large lists
import { ScrollingModule } from '@angular/cdk/scrolling';
```

```html
<cdk-virtual-scroll-viewport itemSize="64" class="list-viewport">
  <mat-list-item *cdkVirtualFor="let item of items; trackBy: trackById">
    {{ item.name }}
  </mat-list-item>
</cdk-virtual-scroll-viewport>
```

```scss
.list-viewport { height: 400px; }
```

For paginated infinite scroll (load-more on scroll):

```typescript
readonly page = signal(0);
readonly allItems = signal<Item[]>([]);
readonly hasMore = signal(true);

async loadMore() {
  if (!this.hasMore()) return;
  const next = await this.service.getPage(this.page());
  this.allItems.update(prev => [...prev, ...next.items]);
  this.hasMore.set(next.hasMore);
  this.page.update(p => p + 1);
}
```

---

## Section 8: Error Boundary & Global Error Handling

### Global HTTP Error Interceptor

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const snackBar = inject(MatSnackBar);
      if (error.status === 401) {
        inject(Router).navigate(['/login']);
      } else if (error.status >= 500) {
        snackBar.open('Server error. Please try again later.', 'OK', { duration: 5000 });
      }
      return throwError(() => error);
    }),
  );
};

// app.config.ts
providers: [provideHttpClient(withInterceptors([errorInterceptor]))]
```

### Component-Level Error State

```typescript
readonly error = signal<string | null>(null);

async load() {
  this.error.set(null);
  try {
    this.data.set(await this.service.get());
  } catch (e: unknown) {
    if (e instanceof HttpErrorResponse && e.status === 404) {
      this.error.set('Item not found.');
    } else {
      this.error.set('Something went wrong. Please try again.');
    }
  }
}
```

---

## Section 9: Accessibility Patterns

### Focus Management After Dialog Close

```typescript
// Store focused element before opening, restore after close
openDialog(triggerEl: HTMLElement) {
  const ref = this.dialog.open(MyDialogComponent);
  ref.afterClosed().subscribe(() => triggerEl.focus());
}
```

### ARIA Live Regions for Dynamic Content

```html
<!-- Announce async updates to screen readers -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  @if (statusMessage()) { {{ statusMessage() }} }
</div>
```

```scss
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Keyboard Navigation in Custom Components

```typescript
@HostListener('keydown', ['$event'])
onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown': this.focusNext(); break;
    case 'ArrowUp': this.focusPrev(); break;
    case 'Enter':
    case ' ': this.select(); event.preventDefault(); break;
    case 'Escape': this.close(); break;
  }
}
```

---

## Section 10: Performance Patterns

### OnPush + Signals (Default for All New Components)

Always use `ChangeDetectionStrategy.OnPush` with signals. Angular's signal-based reactivity only triggers re-render when signal values change — no zone.js overhead.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // signals automatically schedule re-renders
})
```

### trackBy in @for

Always provide `track` in `@for` to avoid full list re-renders:

```html
@for (item of items(); track item.id) {
  <app-item [item]="item" />
}
```

### Defer Block for Below-the-Fold Content

```html
@defer (on viewport) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div class="chart-placeholder">Loading chart...</div>
} @loading (minimum 500ms) {
  <mat-spinner />
}
```
