# Nuxt UI (nuxt/ui) UI/UX Guidelines

## When to read this
Read this file when building UI with the `@nuxt/ui` component library in a Nuxt 3 project. Covers component usage, theming, form patterns, toast notifications, modals, and accessibility built into the library.

## Setup
```bash
npx nuxi module add ui
# Automatically installs and configures:
# - Tailwind CSS
# - Headless UI (accessibility primitives)
# - Heroicons (default icon set)
# - Color mode support
# - All components are auto-imported
```

## Core Components Reference

| Component | Selector | Best for |
|---|---|---|
| UButton | `<UButton>` | Actions — color, variant, icon, size, loading props |
| UInput | `<UInput>` | Text fields — placeholder, icon, trailing, disabled |
| UTextarea | `<UTextarea>` | Multi-line text input |
| USelect | `<USelect>` | Dropdown select with options array |
| UCard | `<UCard>` | Content containers with header/footer slots |
| UModal | `<UModal>` | Dialogs — v-model for open/close, accessible by default |
| USlideover | `<USlideover>` | Side panels / drawers |
| UDropdown | `<UDropdown>` | Menus — :items array prop |
| UTable | `<UTable>` | Data tables — :rows, :columns, sorting, pagination |
| UBadge | `<UBadge>` | Status indicators — color, variant, size |
| UAlert | `<UAlert>` | Feedback messages — icon, color, description |
| UCommandPalette | `<UCommandPalette>` | Search / command palette with built-in filtering |
| UNotifications | `<UNotifications>` | Toast notification stack — pair with useToast() |
| UFormGroup | `<UFormGroup>` | Form field wrapper with label, hint, and error |
| UForm | `<UForm>` | Form with schema validation (Zod or Yup) |
| UTabs | `<UTabs>` | Tab navigation — :items array |
| UAccordion | `<UAccordion>` | Collapsible sections |
| UAvatar | `<UAvatar>` | User avatars with fallback initials |
| UProgress | `<UProgress>` | Progress bar with value and animation |
| UTooltip | `<UTooltip>` | Hover tooltips with text prop |
| UPopover | `<UPopover>` | Click-triggered overlay panels |
| UPagination | `<UPagination>` | Page navigation — v-model, :total, :page-count |
| URange | `<URange>` | Slider input |
| UToggle | `<UToggle>` | Boolean on/off switch |
| UCheckbox | `<UCheckbox>` | Checkbox with label |
| URadio | `<URadio>` | Radio button |

## Top UX Patterns

### 1. Button Variants and States
```vue
<!-- Primary action -->
<UButton color="primary" variant="solid" size="md" @click="save">
  Save changes
</UButton>

<!-- With icon and loading state -->
<UButton
  color="primary"
  variant="solid"
  icon="i-heroicons-check"
  :loading="saving"
  :disabled="saving"
  @click="save"
>
  Save changes
</UButton>

<!-- Destructive action -->
<UButton color="red" variant="soft" icon="i-heroicons-trash" @click="remove">
  Delete
</UButton>

<!-- Ghost / subtle -->
<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="cancel">
  Cancel
</UButton>
```

### 2. Form with Schema Validation
```vue
<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

type Schema = z.output<typeof schema>;

const state = reactive({ email: '', password: '' });

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await login(event.data);
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
    <UFormGroup label="Email" name="email" required>
      <UInput v-model="state.email" type="email" placeholder="you@example.com" />
    </UFormGroup>

    <UFormGroup label="Password" name="password" required>
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit" color="primary" block>Sign in</UButton>
  </UForm>
</template>
```

### 3. Toast Notifications
```typescript
const toast = useToast();

// Success
toast.add({
  title: 'Saved!',
  description: 'Your changes have been saved.',
  icon: 'i-heroicons-check-circle',
  color: 'green',
});

// Error
toast.add({
  title: 'Error',
  description: 'Failed to save. Please try again.',
  icon: 'i-heroicons-x-circle',
  color: 'red',
  timeout: 5000,
});

// Info with action
toast.add({
  title: 'New version available',
  actions: [{ label: 'Refresh', click: () => window.location.reload() }],
});
```

```vue
<!-- Place once in app.vue -->
<template>
  <div>
    <NuxtPage />
    <UNotifications />
  </div>
</template>
```

### 4. Modal Dialog
```vue
<script setup lang="ts">
const isOpen = ref(false);
</script>

<template>
  <UButton @click="isOpen = true">Open dialog</UButton>

  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Edit item</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="isOpen = false" />
        </div>
      </template>

      <p>Modal content goes here.</p>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="ghost" @click="isOpen = false">Cancel</UButton>
          <UButton color="primary" @click="save">Save</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
```

### 5. Data Table with Columns
```vue
<script setup lang="ts">
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'actions', label: '' },
];

const { data: users } = await useFetch('/api/users');
</script>

<template>
  <UTable
    :rows="users"
    :columns="columns"
    :loading="pending"
    :empty-state="{ icon: 'i-heroicons-users', label: 'No users found.' }"
  >
    <template #actions-data="{ row }">
      <UDropdown :items="[[{ label: 'Edit', click: () => edit(row) }, { label: 'Delete', click: () => remove(row) }]]">
        <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost" />
      </UDropdown>
    </template>
  </UTable>
</template>
```

### 6. Command Palette
```vue
<script setup lang="ts">
const isOpen = ref(false);
const { metaSymbol } = useShortcuts();

defineShortcuts({
  meta_k: { usingInput: false, handler: () => { isOpen.value = !isOpen.value; } },
});

const groups = [
  {
    key: 'pages',
    label: 'Pages',
    commands: [
      { id: 'home', label: 'Home', icon: 'i-heroicons-home', to: '/' },
      { id: 'dashboard', label: 'Dashboard', icon: 'i-heroicons-squares-2x2', to: '/dashboard' },
    ],
  },
];
</script>

<template>
  <UModal v-model="isOpen">
    <UCommandPalette :groups="groups" @update:model-value="isOpen = false" />
  </UModal>
</template>
```

### 7. Slideover Side Panel
```vue
<template>
  <USlideover v-model="isOpen" side="right">
    <UCard class="h-full rounded-none">
      <template #header>
        <div class="flex items-center justify-between">
          <h3>Filter options</h3>
          <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="isOpen = false" />
        </div>
      </template>
      <FilterForm />
    </UCard>
  </USlideover>
</template>
```

### 8. Dropdown Menu
```vue
<script setup lang="ts">
const items = [
  [
    { label: 'Profile', icon: 'i-heroicons-user', to: '/profile' },
    { label: 'Settings', icon: 'i-heroicons-cog-6-tooth', to: '/settings' },
  ],
  [
    { label: 'Sign out', icon: 'i-heroicons-arrow-right-on-rectangle', click: signOut },
  ],
];
</script>

<template>
  <UDropdown :items="items">
    <UAvatar :src="user.avatar" :alt="user.name" />
  </UDropdown>
</template>
```

## Theming (app.config.ts)

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: 'indigo',           // Primary color — any Tailwind color
    gray: 'slate',               // Gray scale — slate, cool, zinc, neutral, stone

    // Component-level defaults
    button: {
      default: {
        size: 'md',
        color: 'primary',
        variant: 'solid',
      },
    },

    input: {
      default: {
        size: 'md',
      },
    },

    // Custom variant example
    badge: {
      variant: {
        custom: 'bg-{color}-100 text-{color}-700 ring-1 ring-{color}-300',
      },
    },
  },
});
```

## Icons

Nuxt UI uses Heroicons by default. Icons are accessed via CSS class names:

```vue
<!-- Outline (default) -->
<UIcon name="i-heroicons-home" class="w-5 h-5" />

<!-- Solid variant -->
<UIcon name="i-heroicons-home-solid" />

<!-- In components -->
<UButton icon="i-heroicons-plus" />
<UInput icon="i-heroicons-magnifying-glass" />
```

Install additional icon sets:
```bash
npm install @iconify-json/lucide      # Lucide icons — i-lucide-*
npm install @iconify-json/ph          # Phosphor icons — i-ph-*
npm install @iconify-json/tabler      # Tabler icons — i-tabler-*
```

## Best Practices by Category

### Components
- Always use `<UFormGroup>` around form inputs — it wires up the label/input association, hint text, and error display automatically
- Use `<UModal>` and `<USlideover>` instead of building custom overlays — they handle focus trap, Escape key, scroll lock, and ARIA out of the box
- Use the `color` prop with theme values (`primary`, `gray`, `red`, `green`) — never hardcode hex colors
- Use `variant` prop to convey hierarchy: `solid` for primary, `soft` or `outline` for secondary, `ghost` for tertiary

### Forms
- `<UForm>` with `:schema` (Zod) handles validation automatically on submit and on change
- `<UFormGroup name="fieldName">` matches the Zod schema key — errors display automatically
- Use `:loading` on submit button — never disable the button without visual feedback

### Notifications
- `useToast()` is the only notification system — do not build a custom one
- Place `<UNotifications />` once in `app.vue`
- Use `color` prop to convey meaning: `green` for success, `red` for error, `yellow` for warning

### Accessibility
- All Nuxt UI components are built on Headless UI — ARIA roles, keyboard navigation, and focus management are handled automatically
- Do not suppress the built-in focus ring — it is essential for keyboard users
- Use `aria-label` on icon-only buttons: `<UButton icon="i-heroicons-x-mark" aria-label="Close" />`

### State
- `v-model` on `<UModal>` and `<USlideover>` for open/close state
- `useToast()` composable — auto-imported, no import needed
- `useShortcuts()` for keyboard shortcuts that interact with UI

## Common Anti-Patterns

1. Not using `<UFormGroup>` — input loses label association, hint text, and auto error display
2. Building a custom modal — `<UModal>` and `<USlideover>` handle all accessibility automatically (focus trap, Escape key, scroll lock)
3. Hardcoded colors in `class` or `style` — use `color` prop so theming works correctly
4. Building a custom toast/notification system — `useToast()` + `<UNotifications />` is already provided
5. Importing components manually — all Nuxt UI components are auto-imported
6. Not passing `aria-label` on icon-only buttons — screen readers cannot identify the action
7. Using `disabled` on form submit without `:loading` — users see no feedback that something is happening
8. Nested `<UCard>` inside `<UModal>` without removing the ring — creates double border; use `:ui="{ ring: '' }"`

## Performance Checklist

- [ ] `<UTable>` with `:rows` for all data tables — has built-in empty state and loading state
- [ ] `<UCommandPalette>` for app-wide search — built-in filtering and keyboard navigation
- [ ] `<UModal>` content only renders when open — no hidden DOM overhead when closed
- [ ] `<UNotifications />` placed once at app root — not duplicated per page
- [ ] Icon sets installed only as needed — each `@iconify-json/*` adds to bundle
- [ ] Theme configured in `app.config.ts` — avoids runtime style computation
- [ ] `<UButton :loading="true">` used during async operations — prevents double-submit
