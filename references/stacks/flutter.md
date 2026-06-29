# Flutter Reference

## When to Read
Read this file when building Flutter (Dart) apps — widgets, state management, navigation, theming, lists, animation, or accessibility.

---

## Recommended Libraries

| Library | Purpose | Install |
|---|---|---|
| Riverpod | Async state, testability | `flutter pub add flutter_riverpod` |
| GoRouter | Declarative navigation | `flutter pub add go_router` |
| Freezed | Immutable data classes | `flutter pub add freezed` |
| Dio | HTTP client | `flutter pub add dio` |
| Hive / Isar | Local storage | `flutter pub add hive_flutter` |
| flutter_hooks | React-hooks-style utilities | `flutter pub add flutter_hooks` |
| cached_network_image | Image caching | `flutter pub add cached_network_image` |

---

## Style Recommendations

- Material 3 (`useMaterial3: true`) for all new projects — M2 is legacy
- Use `ColorScheme.fromSeed` — never hardcode color roles
- `Inter` or `Plus Jakarta Sans` for modern sans-serif feel
- 8dp grid for spacing constants
- Avoid deeply nested `Padding`/`SizedBox` trees — extract sub-widgets

---

## State Management Options

| Approach | Best for |
|---|---|
| `setState` | Simple local state |
| Provider | App-wide state, medium complexity |
| Riverpod | Complex async state, testability |
| Bloc | Enterprise, strict unidirectional flow |
| GetX | Simple + routing (avoid in large apps) |

---

## Top UX Patterns (with Code)

### Stateless widget with const constructor
```dart
class UserCard extends StatelessWidget {
  const UserCard({ super.key, required this.user });
  final User user;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(child: Text(user.initials)),
        title: Text(user.name),
        subtitle: Text(user.email),
      ),
    );
  }
}
```

### Riverpod async data
```dart
final usersProvider = FutureProvider<List<User>>(
  (ref) => ref.watch(apiProvider).getUsers(),
);

// In widget:
final users = ref.watch(usersProvider);
return users.when(
  data: (list) => ListView.builder(
    itemCount: list.length,
    itemBuilder: (_, i) => UserCard(user: list[i]),
  ),
  loading: () => const CircularProgressIndicator(),
  error: (e, _) => Text('Error: $e'),
);
```

### Responsive layout
```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 600) {
      return Row(children: [Sidebar(), Expanded(child: Content())]);
    }
    return Column(children: [Content()]);
  },
)
```

### ListView.builder (lazy — always for lists > 20 items)
```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemTile(item: items[index]),
)
// NOT: ListView(children: items.map(...).toList())
```

### const constructors (prevents unnecessary rebuilds)
```dart
const Icon(Icons.star, color: Colors.amber)
const SizedBox(height: 16)
const Text('Static label')
```

### Navigation with GoRouter
```dart
final router = GoRouter(routes: [
  GoRoute(
    path: '/',
    builder: (ctx, state) => const HomeScreen(),
  ),
  GoRoute(
    path: '/users/:id',
    builder: (ctx, state) => UserScreen(
      id: state.pathParameters['id']!,
    ),
  ),
]);
```

### Material 3 theming
```dart
MaterialApp.router(
  theme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF2563EB),
    ),
    fontFamily: 'Inter',
  ),
  darkTheme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF2563EB),
      brightness: Brightness.dark,
    ),
  ),
  routerConfig: router,
)
```

### Accessible icon button
```dart
Semantics(
  label: 'Delete item',
  button: true,
  child: IconButton(
    icon: const Icon(Icons.delete),
    onPressed: onDelete,
  ),
)
```

### StatefulWidget with controller disposal
```dart
class SearchField extends StatefulWidget {
  const SearchField({super.key});

  @override
  State<SearchField> createState() => _SearchFieldState();
}

class _SearchFieldState extends State<SearchField> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose(); // always dispose
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(controller: _controller);
  }
}
```

### Animation with dispose
```dart
class FadeInWidget extends StatefulWidget {
  const FadeInWidget({super.key, required this.child});
  final Widget child;

  @override
  State<FadeInWidget> createState() => _FadeInWidgetState();
}

class _FadeInWidgetState extends State<FadeInWidget>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 300),
  )..forward();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _controller,
      child: widget.child,
    );
  }
}
```

### RepaintBoundary for heavy widgets
```dart
RepaintBoundary(
  child: HeavyAnimatedChart(),
)
```

---

## Best Practices by Category

### Widgets
- Prefer `StatelessWidget`; reach for `StatefulWidget` only when local mutation is needed
- Always provide `super.key` in constructors
- Extract widgets into separate classes — not methods — for proper rebuild isolation
- Use `const` on every widget that doesn't reference mutable state
- Prefer `Column`/`Row` + `Expanded` over `Stack` for linear layouts

### State
- `setState` only for local UI state (toggle, text input)
- Lift state with Riverpod providers when 2+ widgets share it
- Avoid `setState` inside `initState` — schedule with `WidgetsBinding.instance.addPostFrameCallback`
- Keep Riverpod providers small and single-responsibility
- Use `ref.invalidate(provider)` to force refresh

### Layout & Sizing
- Use `MediaQuery.of(context).size` for screen dimensions
- `LayoutBuilder` for component-relative sizing
- 8dp spacing scale: 4, 8, 12, 16, 24, 32, 48
- Avoid hardcoded pixel sizes for text — use `Theme.of(context).textTheme`
- `SafeArea` wraps all top-level screens

### Lists
- `ListView.builder` for any list that might exceed ~20 items
- `SliverList` inside `CustomScrollView` for complex scrollable layouts
- `pageStorageKey` to preserve scroll position across tab switches
- `CachedNetworkImage` for list item images (caches aggressively)

### Navigation
- GoRouter for all routing — supports deep links and web
- Pass typed objects via `extra` parameter, not raw strings where possible
- `context.go()` replaces stack; `context.push()` adds to stack
- Handle `GoRouter.errorBuilder` for 404 screens

### Animation
- `AnimatedContainer`, `AnimatedOpacity` for simple implicit animations
- `AnimationController` + `AnimatedBuilder` for explicit control
- Always call `_controller.dispose()` in `dispose()`
- Use `Curves.easeInOut` as default — avoid linear for UI animations
- `Hero` for shared element transitions between routes

### Theming
- Never use raw `Color(0xFF...)` in widgets — use `colorScheme.primary` etc.
- `Theme.of(context).textTheme.bodyLarge` not hardcoded font sizes
- Define custom extensions on `ThemeData` for brand tokens

### Accessibility
- `Semantics` wrapper on any icon-only interactive element
- `excludeFromSemantics: true` on decorative images
- `MergeSemantics` to group related widgets for screen readers
- Support system font scaling — no `textScaleFactor` overrides

---

## Common Anti-Patterns

1. `ListView(children: longList.map(...).toList())` — renders all at once; use `ListView.builder`
2. Non-const constructors for static widgets — unnecessary rebuilds every parent rebuild
3. `setState` for deeply nested or shared state — prop drilling; use Provider/Riverpod
4. No `dispose()` for controllers, animations, streams — memory leaks accumulate over time
5. Hardcoded sizes without `MediaQuery` — breaks on different screen densities and tablets
6. Missing `Semantics` on icon buttons — invisible to screen readers; VoiceOver announces nothing
7. Logic inside `build()` — move to computed getters or provider selectors
8. `print()` in production — use a proper logger (`logger` package)
9. Catching `Exception` broadly without logging — hides bugs silently
10. Multiple `Scaffold` in a widget tree — only one per route

---

## Performance Checklist

- [ ] `const` on all widgets that don't depend on state
- [ ] `ListView.builder` (never `ListView` with full `children` list for long content)
- [ ] `dispose()` all `AnimationController`, `ScrollController`, `StreamSubscription`, `TextEditingController`
- [ ] `RepaintBoundary` around heavy animated widgets
- [ ] `useMaterial3: true` in ThemeData
- [ ] `flutter build apk --split-per-abi` for smaller Android bundles
- [ ] `cached_network_image` for remote images in lists
- [ ] Profile in `flutter run --profile` mode — never trust debug mode performance
- [ ] `const` constructors defined on all custom widgets
- [ ] `LayoutBuilder` not `MediaQuery` for responsive components inside flex layouts
