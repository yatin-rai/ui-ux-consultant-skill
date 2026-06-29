# Laravel — UI/UX Reference

## When to Read
Use this file when building UI with Laravel. Covers three approaches: Blade + Livewire (reactive SSR), Inertia.js + Vue/React (SPA feel), and Blade + Alpine.js (simple interactivity). Includes Filament for admin panels.

---

## Three UI Approaches

| Approach | When to Use | Stack |
|---|---|---|
| **Blade + Livewire 3** | Reactive UI without SPA overhead | Livewire 3, Alpine.js, Tailwind CSS |
| **Inertia.js + Vue 3** | SPA feel with Laravel backend | Inertia.js, Vue 3, Vite |
| **Inertia.js + React** | SPA feel, React ecosystem | Inertia.js, React 18, shadcn/ui |
| **Blade + Alpine.js** | Simple interactivity, no reactive backend | Alpine.js, Tailwind CSS |
| **Filament** | Admin panels and dashboards | Filament 3 (built on Livewire) |

---

## Recommended Packages

| Package | Purpose | Install |
|---|---|---|
| Livewire 3 | Reactive server-side components | `composer require livewire/livewire` |
| Inertia.js | SPA with Laravel backend | `composer require inertiajs/inertia-laravel` |
| Laravel Breeze | Auth scaffolding (Blade/Inertia/API) | `php artisan breeze:install` |
| Laravel Jetstream | Full auth + teams (Livewire or Inertia) | `composer require laravel/jetstream` |
| Filament | Admin panels, CRUD, resources | `composer require filament/filament` |
| Wire Elements | Pre-built Livewire modal component | `composer require wire-elements/modal` |
| Spatie Permission | Roles and permissions | `composer require spatie/laravel-permission` |
| Laravel Horizon | Queue monitoring UI | `composer require laravel/horizon` |

---

## Style Recommendations

- **Admin / dashboard:** Filament (built-in design system) or custom Tailwind grid
- **Marketing / landing:** Tailwind CSS + Minimalism or Aurora UI aesthetic
- **SaaS application:** Livewire + Tailwind + Flat Design
- **Content-heavy:** Blade + Tailwind Typography plugin
- **Internal tools:** Filament or Breeze + Tailwind

---

## Approach 1: Livewire 3

### Basic Component

```php
// app/Livewire/UserSearch.php
namespace App\Livewire;

use App\Models\User;
use Livewire\Component;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Url;

class UserSearch extends Component
{
    #[Url]  // Sync with URL query string
    public string $query = '';
    public string $sortBy = 'name';

    #[Computed]
    public function users()
    {
        return User::query()
            ->when($this->query, fn($q) => $q->where('name', 'like', "%{$this->query}%"))
            ->orderBy($this->sortBy)
            ->paginate(15);
    }

    public function render()
    {
        return view('livewire.user-search');
    }
}
```

```html
{{-- resources/views/livewire/user-search.blade.php --}}
<div>
    {{-- Search input with debounce --}}
    <input
        wire:model.live.debounce.300ms="query"
        type="search"
        placeholder="Search users..."
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    />

    {{-- Results --}}
    <div class="mt-4 space-y-2">
        @foreach($this->users as $user)
            <div class="flex items-center justify-between p-4 bg-white border rounded-lg">
                <div>
                    <p class="font-medium">{{ $user->name }}</p>
                    <p class="text-sm text-gray-500">{{ $user->email }}</p>
                </div>
                <button wire:click="impersonate({{ $user->id }})" class="text-sm text-blue-600 hover:underline">
                    Impersonate
                </button>
            </div>
        @endforeach
    </div>

    {{ $this->users->links() }}
</div>
```

### Livewire Loading States

```html
{{-- Loading spinner on button --}}
<button wire:click="save" wire:loading.attr="disabled" class="btn-primary">
    <span wire:loading.remove>Save changes</span>
    <span wire:loading class="flex items-center gap-2">
        <svg class="animate-spin h-4 w-4" ...></svg>
        Saving...
    </span>
</button>

{{-- Loading overlay on a section --}}
<div class="relative">
    <div wire:loading.flex class="absolute inset-0 bg-white/70 items-center justify-center z-10">
        <svg class="animate-spin h-6 w-6 text-blue-600" ...></svg>
    </div>
    <div wire:loading.class="opacity-50">
        {{-- Content --}}
    </div>
</div>

{{-- Target specific actions --}}
<button wire:click="delete({{ $id }})" wire:loading.attr="disabled" wire:target="delete({{ $id }})">
    Delete
</button>
```

### Livewire Form with Validation

```php
// app/Livewire/CreatePost.php
use Livewire\Attributes\Rule;

class CreatePost extends Component
{
    #[Rule('required|min:3|max:100')]
    public string $title = '';

    #[Rule('required|min:10')]
    public string $body = '';

    #[Rule('required|exists:categories,id')]
    public ?int $categoryId = null;

    public function save()
    {
        $validated = $this->validate();

        Post::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        $this->reset();
        $this->dispatch('post-created');
        session()->flash('message', 'Post created successfully.');
    }
}
```

```html
<form wire:submit="save" class="space-y-4">
    <div>
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input wire:model="title" type="text"
               class="mt-1 w-full border rounded-lg px-3 py-2 @error('title') border-red-500 @enderror" />
        @error('title')
            <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
        @enderror
    </div>

    @if(session('message'))
        <div class="p-3 bg-green-50 text-green-700 rounded-lg">{{ session('message') }}</div>
    @endif

    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Create post
    </button>
</form>
```

### Livewire Lazy Loading

```php
// Defer rendering until user scrolls to it
use Livewire\Attributes\Lazy;

#[Lazy]
class ExpensiveReport extends Component
{
    public function placeholder()
    {
        return <<<HTML
        <div class="animate-pulse h-48 bg-gray-100 rounded-xl"></div>
        HTML;
    }

    public function render()
    {
        return view('livewire.expensive-report', [
            'data' => $this->generateReport(),
        ]);
    }
}
```

### Event System

```php
// Dispatch from child component
$this->dispatch('user-updated', id: $user->id);

// Listen in parent component
use Livewire\Attributes\On;

#[On('user-updated')]
public function refreshUser(int $id): void
{
    $this->user = User::find($id);
}
```

---

## Approach 2: Inertia.js + Vue 3

### Controller

```php
// app/Http/Controllers/UsersController.php
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Users/Index', [
            'users' => User::query()
                ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
                ->paginate(15)
                ->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        User::create($request->validated());
        return redirect()->route('users.index')->with('success', 'User created.');
    }
}
```

### Vue 3 Page Component

```vue
<!-- resources/js/Pages/Users/Index.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import { router, Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import Pagination from '@/Components/Pagination.vue';

interface User { id: number; name: string; email: string; }
interface Props {
  users: { data: User[]; links: object[] };
  filters: { search?: string };
}

const props = defineProps<Props>();
const search = ref(props.filters.search ?? '');

// Debounced search — updates URL without full reload
watch(search, (value) => {
  router.get(route('users.index'), { search: value }, {
    preserveState: true,
    replace: true,
    debounce: 300,
  });
});
</script>

<template>
  <AppLayout title="Users">
    <div class="max-w-4xl mx-auto p-6 space-y-6">
      <input v-model="search" type="search" placeholder="Search users..."
             class="w-full px-4 py-2 border rounded-lg" />

      <div class="bg-white rounded-xl border overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users.data" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 text-right">
                <Link :href="route('users.edit', user.id)"
                      class="text-sm text-blue-600 hover:underline">Edit</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination :links="users.links" />
    </div>
  </AppLayout>
</template>
```

### Inertia Form Handling

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';

const form = useForm({
  name: '',
  email: '',
  role: 'user',
});

function submit() {
  form.post(route('users.store'), {
    onSuccess: () => form.reset(),
  });
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Name</label>
      <input v-model="form.name" type="text"
             :class="form.errors.name && 'border-red-500'"
             class="mt-1 w-full border rounded-lg px-3 py-2" />
      <p v-if="form.errors.name" class="mt-1 text-sm text-red-500">{{ form.errors.name }}</p>
    </div>

    <button type="submit" :disabled="form.processing"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
      {{ form.processing ? 'Creating...' : 'Create user' }}
    </button>
  </form>
</template>
```

---

## Approach 3: Blade + Alpine.js

```html
{{-- Simple dropdown --}}
<div x-data="{ open: false }" class="relative">
    <button @click="open = !open" @keydown.escape="open = false"
            class="flex items-center gap-2 px-4 py-2 border rounded-lg">
        Options
        <svg class="w-4 h-4" :class="open && 'rotate-180 transition-transform'" ...></svg>
    </button>
    <div x-show="open" x-transition @click.outside="open = false"
         class="absolute top-full mt-1 w-48 bg-white border rounded-lg shadow-lg py-1 z-10">
        <a href="{{ route('settings') }}" class="block px-4 py-2 text-sm hover:bg-gray-50">Settings</a>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                Log out
            </button>
        </form>
    </div>
</div>

{{-- Tabs --}}
<div x-data="{ activeTab: 'overview' }">
    <nav class="flex border-b">
        <button @click="activeTab = 'overview'"
                :class="activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'"
                class="px-4 py-2 text-sm font-medium">Overview</button>
        <button @click="activeTab = 'activity'"
                :class="activeTab === 'activity' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'"
                class="px-4 py-2 text-sm font-medium">Activity</button>
    </nav>
    <div x-show="activeTab === 'overview'" class="py-4">
        @include('partials.overview')
    </div>
    <div x-show="activeTab === 'activity'" class="py-4">
        @include('partials.activity')
    </div>
</div>
```

---

## Filament Admin Panels

```php
// app/Filament/Resources/UserResource.php
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-users';

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('name')->required()->maxLength(255),
            TextInput::make('email')->email()->required()->unique(ignoreRecord: true),
            Select::make('role')
                ->options(['admin' => 'Admin', 'user' => 'User'])
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('email')->searchable(),
                TextColumn::make('role')->badge()->color(fn($state) => match($state) {
                    'admin' => 'danger',
                    default => 'gray',
                }),
                TextColumn::make('created_at')->dateTime()->sortable()->toggleable(),
            ])
            ->filters([TrashedFilter::make()])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
```

---

## Best Practices by Category

### Livewire
- Use `#[Computed]` for derived data — cached per request, not re-queried on every re-render
- Use `#[Url]` to sync component state with URL — enables bookmarkable filtered views
- Use `wire:model.live.debounce.300ms` for search inputs — never `.live` alone
- Use `#[Lazy]` for below-fold components and heavy data processing
- Break large Livewire components into smaller ones with event communication
- Use `$this->dispatch()` instead of the old `$this->emit()` (deprecated in v3)

### Inertia.js
- Use `useForm` from `@inertiajs/vue3` — provides `errors`, `processing`, `reset()` automatically
- `preserveState: true` on router visits to keep scroll position and form state
- Use `<Link preserve-scroll>` for pagination links to avoid scroll-to-top
- Share global data via `HandleInertiaRequests` middleware (auth user, flash messages)
- Type `defineProps` with TypeScript interfaces for IDE support on all page props

### Database / Eloquent
- Always eager load relationships: `User::with(['posts', 'roles'])->get()`
- Use Eloquent scopes for reusable query logic: `User::active()->verified()->paginate()`
- Cache expensive queries: `Cache::remember('stats', 3600, fn() => computeStats())`
- Use `paginate()` not `get()` for lists — never load unbounded result sets

### Security
- Always use `@csrf` in Blade forms
- Validate all input in Form Requests, not controllers
- Use Laravel's authorization (`$this->authorize()`, policies) not manual checks
- Never expose Eloquent models directly — use API Resources or explicit arrays

---

## Common Anti-Patterns

1. **N+1 queries in Livewire** — Livewire re-renders on every state change. A query inside `@foreach` with a relationship access creates N+1. Always eager load: `User::with('posts')->get()`.

2. **`wire:model` without `.debounce` on search inputs** — `.live` fires on every keystroke. Use `wire:model.live.debounce.300ms` for text inputs.

3. **Mixing Livewire and Inertia on the same page** — they are fundamentally different rendering paradigms. Pick one per page. Inertia pages cannot contain Livewire components.

4. **Large Blade components (> 150 lines)** — extract repeated HTML into Blade components (`x-card`, `x-modal`) or Livewire components. Monolithic Blade templates are hard to test.

5. **Client-side routing in Blade without Inertia** — manually managing SPA navigation in Blade + Fetch is fragile. Use Inertia.js for SPA behavior or accept full-page navigation in Blade.

6. **Returning data directly from controllers without authorization** — check policies before returning resources. `$this->authorize('view', $user)` before `return Inertia::render(...)`.

7. **Using `session()->flash()` with Inertia** — flash messages in Inertia require sharing them in `HandleInertiaRequests::share()`. Raw session flashes are not auto-passed to Vue/React.

8. **No `withQueryString()` on paginator** — without it, Eloquent pagination links lose current search/filter parameters.

9. **`wire:click` on non-button elements** — use `<button>` elements for actions, not `<div wire:click>`. Screen readers and keyboard users expect buttons for interactive elements.

10. **Filament without proper authorization** — Filament resources are accessible to all authenticated users by default. Implement `canAccess()`, `canCreate()`, `canEdit()`, `canDelete()` methods.

---

## Performance Checklist

- [ ] `wire:model.live.debounce.300ms` for all search/filter inputs
- [ ] Eager load Eloquent relationships (`with()`) in all Livewire computed properties
- [ ] `#[Lazy]` attribute for below-fold or expensive Livewire components
- [ ] `Cache::remember()` for queries that don't change frequently
- [ ] Inertia `<Link preserve-scroll>` to avoid scroll-to-top on pagination
- [ ] `withQueryString()` on all paginators
- [ ] Laravel Horizon for queue monitoring (async jobs for emails, reports)
- [ ] Database indexes on all filtered/sorted columns
- [ ] `php artisan optimize` in production (caches config, routes, views)
- [ ] Vite asset bundling with `npm run build` — not `mix` (deprecated)
