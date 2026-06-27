# React UI/UX Guidelines

## When to read this
Read this file when building UI with React 18+ and hooks. Covers state management, rendering optimization, accessibility, and component patterns for modern React apps.

## Recommended UI Libraries

| Library | Best for | Install |
|---|---|---|
| shadcn/ui | Copy-paste accessible components | `npx shadcn@latest init` |
| Radix UI | Headless accessible primitives | `npm install @radix-ui/react-*` |
| React Hook Form | Performant forms | `npm install react-hook-form` |
| Zustand | Simple global state | `npm install zustand` |
| TanStack Query | Server state / data fetching | `npm install @tanstack/react-query` |
| Framer Motion | Animations | `npm install framer-motion` |

## Style Recommendations by App Type

- **Consumer SaaS:** Flat Design + Glassmorphism (shadcn/ui default theme)
- **Dashboard:** Data-Dense + Dark Mode
- **E-commerce:** Vibrant + Block-based
- **Developer tool:** Minimalist + Dark Mode First

## Top UX Patterns

### 1. Loading / Error / Data State Pattern
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch('/api/data')
    .then(r => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <DataView data={data} />;
```

### 2. Optimistic Update
```jsx
async function toggleFavorite(id) {
  const prev = items;
  setItems(items.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i));
  try {
    await api.toggle(id);
  } catch {
    setItems(prev);
    toast.error('Update failed');
  }
}
```

### 3. Debounced Search with useDeferredValue
```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
const filtered = useMemo(
  () => items.filter(i => i.name.includes(deferredQuery)),
  [items, deferredQuery]
);
```

### 4. Custom Data Fetching Hook
```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    setState(s => ({ ...s, loading: true }));
    fetch(url)
      .then(r => r.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }));
  }, [url]);
  return state;
}
```

### 5. Context with Memoized Value
```jsx
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

### 6. Controlled Form with React Hook Form
```jsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: 'Email is required' })} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### 7. Lazy-Loaded Route Component
```jsx
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

### 8. Error Boundary
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logError(error, info); }
  render() {
    if (this.state.hasError) return <FallbackUI />;
    return this.props.children;
  }
}
// Usage
<ErrorBoundary><FeatureComponent /></ErrorBoundary>
```

### 9. Virtualized Long List
```jsx
import { FixedSizeList as List } from 'react-window';

function VirtualList({ items }) {
  return (
    <List height={600} itemCount={items.length} itemSize={60} width="100%">
      {({ index, style }) => (
        <div style={style}>
          <ItemRow item={items[index]} />
        </div>
      )}
    </List>
  );
}
```

### 10. Focus Management for Modal
```jsx
function Modal({ isOpen, onClose, children }) {
  const firstFocusRef = useRef(null);
  useEffect(() => {
    if (isOpen) firstFocusRef.current?.focus();
  }, [isOpen]);
  return isOpen ? (
    <div role="dialog" aria-modal="true">
      <button ref={firstFocusRef} onClick={onClose} aria-label="Close">X</button>
      {children}
    </div>
  ) : null;
}
```

## Best Practices by Category

### State
- `useState` for local component state
- `useReducer` for complex state with multiple sub-values or transition logic
- Lift shared state to the nearest common ancestor
- Compute derived values in render — do not store them in state
- Lazy initialize expensive state: `useState(() => compute())`

### Components
- Small and focused — single responsibility per component
- Composition over inheritance
- Use fragments (`<>...</>`) to avoid extra DOM nodes
- Colocate related code (state, handlers, JSX) in the same file
- `React.memo` for pure components that receive stable props

### Rendering
- Stable keys: `item.id` not `index` on dynamic lists
- `useMemo` for expensive calculations — only when profiler confirms it helps
- `useCallback` for handlers passed as props to memoized children
- Avoid creating new objects or arrays inline in JSX — extract to variables

### Effects
- Always cleanup subscriptions: `return () => unsubscribe()`
- Correct deps array — eslint-plugin-react-hooks enforces this
- Do not use effects for derived data; compute in render
- `useRef` for mutable values that should not trigger re-renders

### Routing
- Use React Router v6 with `createBrowserRouter`
- Lazy-load all route components with `React.lazy`
- Use `<Suspense>` with a skeleton fallback per route
- Use `useNavigate` hook — not imperative `history.push`

### Performance
- `React.lazy` + `Suspense` for code splitting at route boundaries
- Virtualize long lists with react-window (> 100 items)
- Use React DevTools Profiler to find actual bottlenecks before optimizing
- Do not premature-optimize with `useMemo`/`useCallback` everywhere

### Forms
- Controlled components: `value` + `onChange` on all inputs
- `event.preventDefault()` on form submit handlers
- `useDeferredValue` for search input debounce
- Use React Hook Form for complex forms — avoids re-render on every keystroke

### Accessibility
- Semantic HTML: `<button>` not `<div onClick>`, `<nav>`, `<main>`, `<header>`
- Focus management for modals and drawers
- ARIA live regions for dynamic content: `aria-live="polite"`
- `htmlFor` on `<label>` linked to input `id`
- Keyboard navigation: all interactive elements reachable with Tab/Enter/Escape

### Props
- Destructure props at the top of the component
- Provide default values for optional props
- Avoid prop drilling past 2-3 levels — use Context or Zustand
- TypeScript interfaces for all prop shapes

### Events
- Pass handler references: `onClick={handleClick}` — not `onClick={handleClick()}`
- Avoid `.bind()` in render — creates new function every render

## Common Anti-Patterns

1. `key={index}` for dynamic lists — breaks reconciliation on reorder/delete
2. Missing cleanup in `useEffect` — memory leaks when component unmounts
3. `onClick={handleClick()}` — calls the function immediately instead of passing a reference
4. Storing derivable values in state — causes sync bugs and extra renders
5. Prop drilling past 3 levels — use Context or Zustand instead
6. Inline object/array in JSX props — breaks `React.memo` (`style={{ margin: 10 }}` → extract to constant)
7. No error boundary — a single thrown error crashes the entire component tree
8. Large context that updates frequently — split context by concern/update frequency
9. `useEffect` for data that could be fetched on the server — use TanStack Query or a framework
10. Mutating state directly — always return new references from state updates

## Performance Checklist

- [ ] `React.lazy` + `Suspense` on all route-level components
- [ ] `react-window` for lists with more than 100 items
- [ ] `useMemo`/`useCallback` only where React DevTools Profiler confirms a bottleneck
- [ ] React DevTools Profiler run against real data before optimizing
- [ ] Stable keys (`item.id`) on all dynamic lists
- [ ] Context split by update frequency — separate auth context from theme context
- [ ] `<img>` elements have explicit `width` and `height` to prevent layout shift
- [ ] Bundle size checked with `source-map-explorer` or Vite bundle visualizer
- [ ] No anonymous functions in frequently-rendered list items
- [ ] Error boundaries wrapping all major feature subtrees
