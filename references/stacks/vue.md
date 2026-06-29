# Vue UI/UX Guidelines

## When to read this
Read this file when building UI with Vue 3 and the Composition API. Covers reactivity, composables, Pinia state, routing, forms, and component patterns for modern Vue apps.

## Recommended UI Libraries

| Library | Best for | Install |
|---|---|---|
| Vuetify 3 | Material Design components | `npm install vuetify` |
| PrimeVue | Rich component set | `npm install primevue` |
| Element Plus | Enterprise UI | `npm install element-plus` |
| Pinia | State management | `npm install pinia` |
| VueUse | Composable utilities | `npm install @vueuse/core` |
| Vee-Validate | Form validation | `npm install vee-validate` |

## Style Recommendations by App Type

- **Enterprise/admin:** Element Plus + minimal custom style
- **Consumer product:** Vuetify 3 + Material Design tokens
- **Custom brand:** PrimeVue + custom design tokens via CSS variables
- **Documentation/content:** Headless + custom Tailwind

## Top UX Patterns

### 1. Async Data with Loading and Error States
```vue
<script setup lang="ts">
const { data, pending, error } = await useFetch('/api/users');
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <UserList v-else :users="data" />
</template>
```

### 2. Pinia Store with Composition API Style
```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => !!user.value);

  async function login(creds: Credentials) {
    user.value = await api.login(creds);
  }

  function logout() {
    user.value = null;
  }

  return { user, isLoggedIn, login, logout };
});
```

### 3. Composable for Reusable Logic
```typescript
// composables/useSearch.ts
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

export function useSearch<T>(items: Ref<T[]>, key: keyof T) {
  const query = ref('');
  const filtered = computed(() =>
    query.value
      ? items.value.filter(i => String(i[key]).toLowerCase().includes(query.value.toLowerCase()))
      : items.value
  );
  return { query, filtered };
}

// Usage in component
const { query, filtered } = useSearch(products, 'name');
```

### 4. Optimistic Update with Rollback
```typescript
async function toggleFavorite(id: string) {
  const store = useProductStore();
  const prev = [...store.products];
  store.products = store.products.map(p =>
    p.id === id ? { ...p, favorite: !p.favorite } : p
  );
  try {
    await api.toggleFavorite(id);
  } catch {
    store.products = prev;
    toast.error('Update failed');
  }
}
```

### 5. Template Ref and Lifecycle
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputRef.value?.focus();
});
</script>

<template>
  <input ref="inputRef" placeholder="Auto-focused on mount" />
</template>
```

### 6. Controlled Form with Vee-Validate and Zod
```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const schema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(8),
}));

const { defineField, handleSubmit, errors } = useForm({ validationSchema: schema });
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(values => console.log(values));
</script>

<template>
  <form @submit="onSubmit">
    <input v-bind="emailAttrs" v-model="email" type="email" />
    <span>{{ errors.email }}</span>
    <input v-bind="passwordAttrs" v-model="password" type="password" />
    <span>{{ errors.password }}</span>
    <button type="submit">Login</button>
  </form>
</template>
```

### 7. Dynamic Component with defineAsyncComponent
```typescript
import { defineAsyncComponent } from 'vue';

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: ChartSkeleton,
  errorComponent: ErrorFallback,
  delay: 200,
});
```

### 8. Provide / Inject for Deep Prop Passing
```typescript
// Parent component
import { provide, ref } from 'vue';

const theme = ref('light');
provide('theme', theme); // Provide reactive value

// Deep child component
import { inject } from 'vue';

const theme = inject<Ref<string>>('theme', ref('light')); // With default
```

### 9. Watch with Cleanup
```typescript
import { watch, ref } from 'vue';

const query = ref('');

watch(query, async (newQuery, _, onCleanup) => {
  const controller = new AbortController();
  onCleanup(() => controller.abort()); // Cancel previous fetch on change
  results.value = await fetch(`/api/search?q=${newQuery}`, {
    signal: controller.signal,
  }).then(r => r.json());
});
```

### 10. Transition for Animated List
```vue
<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </TransitionGroup>
</template>

<style>
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(30px); }
</style>
```

## Best Practices by Category

### State
- `ref()` for primitives and single values
- `reactive()` for complex objects — never destructure (loses reactivity)
- `computed()` for derived state — do not duplicate in `ref`
- `watch()` for side effects triggered by specific reactive sources
- `watchEffect()` for effects that auto-track all used reactive values
- Pinia for shared application state — use `storeToRefs()` when destructuring

### Components
- `<script setup>` for all new components — less boilerplate, better TS support
- Composition API exclusively in new code — not Options API
- TypeScript with `defineProps<Props>()` and `defineEmits<Emits>()`
- Single-file `.vue` components — PascalCase names
- Composables over mixins for reusable logic
- `defineExpose()` only for intentional public component APIs

### Routing
- `useRouter()` and `useRoute()` composables — not `this.$router`
- Lazy-load all routes: `component: () => import('./Page.vue')`
- Navigation guards for authentication — `router.beforeEach`
- Named routes for programmatic navigation — avoid hardcoded path strings

### Performance
- `v-once` for static content that truly never changes
- `v-memo` for expensive list items with stable deps
- `shallowReactive()` / `shallowRef()` for large objects that don't need deep reactivity
- `defineAsyncComponent()` for heavy components not needed on initial render
- `:key="item.id"` on all `v-for` — never use index as key for dynamic lists

### Forms
- `v-model` for two-way binding on all inputs
- `@submit.prevent` on form element — prevents full page reload
- Vee-Validate + Zod for schema-driven validation
- Separate composable for complex form logic

### Accessibility
- Use native HTML elements: `<button>`, `<a>`, `<input>`, `<select>`
- `aria-live="polite"` for dynamically updated regions
- `:key` on all `v-for` for correct DOM reconciliation
- Focus management after route changes and modal close

### Props and Emits
- `defineProps` with TypeScript generics for type safety
- Never mutate props — emit an event or use a local `ref` copy
- Use `v-model` pattern for two-way component bindings: emit `update:modelValue`

## Common Anti-Patterns

1. Destructuring `reactive()` object — loses reactivity: `const { name } = reactive(user)` breaks
2. Mutating props directly — always emit or create a local copy with `ref`
3. Options API in new Vue 3 code — use Composition API with `<script setup>`
4. `this.$refs` in Composition API — use template `ref()` instead
5. Large single-file components over 300 lines — split into composables and sub-components
6. `:key="index"` on `v-for` with dynamic lists — breaks reconciliation on reorder
7. Not using `storeToRefs()` when destructuring Pinia store — loses reactivity
8. `v-if` and `v-for` on the same element — always put `v-if` on a parent wrapper
9. Storing non-reactive data in `reactive()` — use plain variables for constants
10. Missing `onUnmounted` cleanup for event listeners and timers

## Performance Checklist

- [ ] `v-once` on static content that never changes after first render
- [ ] `v-memo` for expensive list items where deps rarely change
- [ ] `shallowReactive()` for large flat objects that don't need deep reactivity
- [ ] `defineAsyncComponent()` for heavy third-party components
- [ ] `storeToRefs()` when destructuring any Pinia store
- [ ] `:key="item.id"` on all `v-for` loops — no index keys on mutable lists
- [ ] Route-level lazy loading for all page components
- [ ] `watch` with `{ lazy: true }` when you don't need immediate execution
- [ ] Bundle analysis with Vite's `rollup-plugin-visualizer`
- [ ] Avoid large watcher chains — prefer `computed` for derived values
