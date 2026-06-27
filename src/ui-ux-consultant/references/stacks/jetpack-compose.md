# Jetpack Compose Reference

## When to Read
Read this file when building Android apps with Jetpack Compose (Kotlin) — composables, state, ViewModel, LazyColumn, navigation, Material 3 theming, or accessibility.

---

## Recommended Libraries

| Library | Purpose |
|---|---|
| Coil | Image loading (`AsyncImage`) |
| Hilt | Dependency injection |
| Room | Local database with Flow |
| Retrofit + OkHttp | HTTP networking |
| Accompanist | Compose utilities (pager, permissions) |
| Voyager | Alternative navigation library |
| DataStore | Preferences persistence (replaces SharedPreferences) |
| Kotlin Serialization | JSON parsing |

---

## Style Recommendations

- Material 3 everywhere — not M2; `MaterialTheme` from `androidx.compose.material3`
- Dynamic color (`dynamicColorScheme`) on Android 12+ — fallback for older devices
- 8dp spacing scale: 4, 8, 12, 16, 24, 32, 48
- `MaterialTheme.typography` tokens — not hardcoded `sp` values
- `MaterialTheme.colorScheme` tokens — not raw `Color(0xFF...)` in composables
- Shape: `MaterialTheme.shapes.medium` for cards, `.small` for chips

---

## Core Paradigm

UI = composable functions. State hoisting: lift state up to the lowest common ancestor that needs it. `remember` for local ephemeral state; `ViewModel` + `StateFlow` for lifecycle-aware state.

---

## Top UX Patterns (with Code)

### ViewModel with StateFlow
```kotlin
class UserViewModel : ViewModel() {
    private val _users = MutableStateFlow<List<User>>(emptyList())
    val users: StateFlow<List<User>> = _users.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    fun loadUsers() = viewModelScope.launch {
        _isLoading.value = true
        try {
            _users.value = userRepository.getAll()
        } finally {
            _isLoading.value = false
        }
    }
}

// In composable:
@Composable
fun UserListScreen(viewModel: UserViewModel = hiltViewModel()) {
    val users by viewModel.users.collectAsStateWithLifecycle()
    val isLoading by viewModel.isLoading.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) { viewModel.loadUsers() }

    if (isLoading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
    } else {
        UserList(users = users)
    }
}
```

### Scaffold + TopAppBar + FAB
```kotlin
Scaffold(
    topBar = {
        TopAppBar(
            title = { Text("Dashboard") },
            navigationIcon = {
                IconButton(onClick = { navController.navigateUp() }) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
            },
            actions = {
                IconButton(onClick = { /* open settings */ }) {
                    Icon(Icons.Default.Settings, contentDescription = "Settings")
                }
            }
        )
    },
    floatingActionButton = {
        FloatingActionButton(onClick = onAdd) {
            Icon(Icons.Default.Add, contentDescription = "Add item")
        }
    }
) { paddingValues ->
    LazyColumn(
        modifier = Modifier.padding(paddingValues),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(users, key = { it.id }) { user ->
            UserCard(user = user)
        }
    }
}
```

### LazyColumn (always for long lists)
```kotlin
LazyColumn(
    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
    verticalArrangement = Arrangement.spacedBy(8.dp)
) {
    items(items = users, key = { it.id }) { user ->
        UserCard(user = user)
    }
    item {
        Spacer(Modifier.height(80.dp)) // clearance for FAB
    }
}
// Never use Column for long lists — renders all items eagerly
```

### Material 3 theming with dynamic color
```kotlin
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context)
            else dynamicLightColorScheme(context)
        }
        darkTheme -> darkColorScheme(primary = Color(0xFF2563EB))
        else -> lightColorScheme(primary = Color(0xFF2563EB))
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(),
        content = content
    )
}
```

### Navigation (Compose Navigation)
```kotlin
val navController = rememberNavController()

NavHost(navController = navController, startDestination = "home") {
    composable("home") {
        HomeScreen(
            onNavigateToDetail = { id -> navController.navigate("detail/$id") }
        )
    }
    composable(
        route = "detail/{id}",
        arguments = listOf(navArgument("id") { type = NavType.StringType })
    ) { backStackEntry ->
        val id = backStackEntry.arguments?.getString("id") ?: return@composable
        DetailScreen(id = id, onBack = { navController.navigateUp() })
    }
}
```

### State hoisting pattern
```kotlin
// Stateful (screen-level)
@Composable
fun SearchScreen(viewModel: SearchViewModel = hiltViewModel()) {
    val query by viewModel.query.collectAsStateWithLifecycle()
    SearchBar(
        query = query,
        onQueryChange = viewModel::onQueryChange,
        onSearch = viewModel::search
    )
}

// Stateless (reusable)
@Composable
fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    onSearch: () -> Unit,
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier.fillMaxWidth(),
        placeholder = { Text("Search…") },
        trailingIcon = {
            IconButton(onClick = onSearch) {
                Icon(Icons.Default.Search, contentDescription = "Search")
            }
        },
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
        keyboardActions = KeyboardActions(onSearch = { onSearch() })
    )
}
```

### Accessible icon
```kotlin
Icon(
    imageVector = Icons.Default.Delete,
    contentDescription = "Delete item",  // never null on interactive icons
    modifier = Modifier
        .clickable(
            role = Role.Button,
            onClickLabel = "Delete this item"
        ) { onDelete() }
)
```

### derivedStateOf for expensive computation
```kotlin
val filteredItems by remember {
    derivedStateOf {
        // Only recomputes when searchQuery or items changes
        items.filter { it.name.contains(searchQuery, ignoreCase = true) }
    }
}
```

### Pull-to-refresh
```kotlin
val pullRefreshState = rememberPullRefreshState(
    refreshing = isRefreshing,
    onRefresh = { viewModel.refresh() }
)

Box(Modifier.pullRefresh(pullRefreshState)) {
    LazyColumn { /* items */ }
    PullRefreshIndicator(
        refreshing = isRefreshing,
        state = pullRefreshState,
        modifier = Modifier.align(Alignment.TopCenter)
    )
}
```

---

## Best Practices by Category

### Composables
- Keep composables small and single-purpose — extract at ~30 lines
- Stateless composables take data + callbacks — easier to test and preview
- `modifier: Modifier = Modifier` as last parameter on every composable
- `@Preview` annotations with realistic data — not empty states only
- `@Stable` or `@Immutable` on data classes passed to composables for skipping recomposition

### State
- `remember { mutableStateOf() }` only for local transient state (toggle, input draft)
- ViewModel + `StateFlow` for anything that survives config changes
- `collectAsStateWithLifecycle()` not `collectAsState()` — stops collection in background
- `rememberSaveable` for state that must survive process death (text field drafts)
- Single source of truth: don't duplicate state between ViewModel and composable

### Lists
- `LazyColumn` / `LazyRow` for any list that might scroll
- `key = { item.id }` in `items()` — stable keys prevent unnecessary recomposition on reorder
- `contentPadding` on lazy lists to avoid clipping at edges
- `Arrangement.spacedBy(dp)` instead of per-item `Spacer`
- `StickyHeader` inside `LazyColumn` for grouped lists

### Navigation
- One `NavHost` at the root of the app
- Pass only IDs between destinations — fetch data in the destination's ViewModel
- `popUpTo` + `saveState` for bottom nav tabs (preserve back stacks)
- `BackHandler` for custom back behavior in leaf screens

### Material 3 Components
- `Card` not `Surface` + manual shape/elevation — `Card` handles semantics
- `FilledButton` for primary action, `OutlinedButton` secondary, `TextButton` tertiary
- `SnackbarHostState` + `Scaffold`'s `snackbarHost` for feedback messages
- `AlertDialog` for confirmations — not custom dialogs
- `ModalBottomSheet` for secondary flows (not navigation)

### Accessibility
- `contentDescription` on every `Icon` that's interactive — `null` only for decorative icons
- `Modifier.semantics { role = Role.Button }` when using `clickable` on non-Button
- `Modifier.clearAndSetSemantics { }` to replace auto-generated semantics
- Min touch target: 48dp × 48dp — use `Modifier.minimumInteractiveComponentSize()`
- Test with TalkBack on real device

### Animation
- `AnimatedVisibility` for enter/exit transitions
- `animateContentSize()` for layout size changes
- `updateTransition` for state-machine animations
- `Crossfade` for content swapping
- `spring()` for natural motion; `tween()` for controlled duration

---

## Common Anti-Patterns

1. `Column` with long lists — renders all items eagerly; freezes UI; use `LazyColumn`
2. No `key` in `items()` — poor diff performance on reorder/insert; React-like index issues
3. Heavy computation in composable body — runs on every recomposition; use `remember { derivedStateOf { } }`
4. `mutableStateListOf` in ViewModel — doesn't survive config change; use `StateFlow<List<T>>`
5. Missing `contentDescription` on icons — TalkBack announces "unlabeled button"
6. `collectAsState()` without lifecycle awareness — continues collection in background, wastes battery
7. State inside `LazyListScope` lambdas — `remember` doesn't work inside `items {}` blocks
8. `navController` passed deep into composables — pass lambdas instead; keeps composables testable
9. Hardcoded colors/dimensions — breaks theming; use `MaterialTheme.colorScheme` / `MaterialTheme.spacing`
10. Missing `modifier` parameter on reusable composables — callers can't adjust layout

---

## Performance Checklist

- [ ] `LazyColumn`/`LazyRow` for lists (not `Column`/`Row`)
- [ ] `key = { item.id }` in all `items()` calls
- [ ] `collectAsStateWithLifecycle()` not `collectAsState()` (lifecycle-aware)
- [ ] `remember { derivedStateOf { } }` for expensive computations
- [ ] `@Stable` or `@Immutable` on data classes passed to composables
- [ ] `Modifier.fillMaxWidth()` before `weight()` in nested layouts
- [ ] `rememberSaveable` for user input that must survive process death
- [ ] `minimumInteractiveComponentSize()` on all clickable elements (48dp min)
- [ ] Profile with Layout Inspector + Composition trace in Android Studio
- [ ] Baseline Profiles configured for startup performance
