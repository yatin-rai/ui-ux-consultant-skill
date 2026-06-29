# SwiftUI Reference

## When to Read
Read this file when building SwiftUI apps (iOS, macOS, watchOS, tvOS) — views, state, navigation, lists, forms, async data, animation, or accessibility.

---

## Recommended Libraries

| Library | Purpose |
|---|---|
| Alamofire | HTTP networking |
| Kingfisher | Async image loading/caching |
| SwiftData (iOS 17+) | Local persistence (replaces CoreData) |
| The Composable Architecture (TCA) | Strict unidirectional state |
| Nuke | High-performance image pipeline |
| swift-collections | Ordered/deque collections |

---

## Style Recommendations

- Follow Apple HIG spacing: 8, 16, 20, 24pt increments
- Use SF Symbols everywhere — native, scales with Dynamic Type, supports multicolor
- Prefer system colors (`Color.primary`, `.secondary`, `.accentColor`) for automatic dark mode
- `.font(.headline)` / `.font(.body)` — not hardcoded point sizes
- `cornerRadius(12)` on cards; `cornerRadius(10)` on buttons — matches native iOS feel
- Avoid custom navigation bars when Apple's is sufficient — saves maintenance

---

## State Property Wrappers

| Wrapper | Use |
|---|---|
| `@State` | Local mutable state (owned by this view) |
| `@Binding` | Passed-down mutable reference |
| `@StateObject` | Owned ObservableObject (created once, survives body recompute) |
| `@ObservedObject` | Injected ObservableObject |
| `@EnvironmentObject` | App-wide injected object |
| `@Environment` | System values (colorScheme, locale, sizeClass) |
| `@Observable` (iOS 17+) | Modern replacement for ObservableObject |

---

## Top UX Patterns (with Code)

### Modern ViewModel with @Observable (iOS 17+)
```swift
@Observable class UserStore {
    var users: [User] = []
    var isLoading = false
    var errorMessage: String?

    func load() async {
        isLoading = true
        defer { isLoading = false }
        do {
            users = try await api.getUsers()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

struct UserListView: View {
    @State private var store = UserStore()

    var body: some View {
        Group {
            if store.isLoading {
                ProgressView("Loading users…")
            } else if let error = store.errorMessage {
                ContentUnavailableView(error, systemImage: "exclamationmark.triangle")
            } else {
                List(store.users) { user in
                    UserRow(user: user)
                }
            }
        }
        .task { await store.load() }
    }
}
```

### NavigationStack with typed destinations (iOS 16+)
```swift
@State private var path = NavigationPath()

NavigationStack(path: $path) {
    List(items) { item in
        NavigationLink(value: item) {
            ItemRow(item: item)
        }
    }
    .navigationTitle("Items")
    .navigationDestination(for: Item.self) { item in
        ItemDetailView(item: item)
    }
    .navigationDestination(for: UserProfile.self) { profile in
        ProfileView(profile: profile)
    }
}
```

### Async data loading with .task
```swift
struct ContentView: View {
    @State private var posts: [Post] = []

    var body: some View {
        List(posts) { post in PostRow(post: post) }
            .task {
                // auto-cancels when view disappears
                posts = (try? await api.fetchPosts()) ?? []
            }
    }
}
// .task is always preferred over .onAppear + Task { } — cancellation is automatic
```

### Swipe actions on List rows
```swift
List {
    ForEach(items) { item in
        ItemRow(item: item)
            .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                Button(role: .destructive) {
                    delete(item)
                } label: {
                    Label("Delete", systemImage: "trash")
                }
            }
            .swipeActions(edge: .leading) {
                Button {
                    archive(item)
                } label: {
                    Label("Archive", systemImage: "archivebox")
                }
                .tint(.blue)
            }
    }
}
```

### Form with validation
```swift
struct EditProfileForm: View {
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""

    private var isValid: Bool {
        !name.isEmpty && email.contains("@") && password.count >= 8
    }

    var body: some View {
        Form {
            Section("Account") {
                TextField("Name", text: $name)
                TextField("Email", text: $email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocorrectionDisabled()
                SecureField("Password", text: $password)
                    .textContentType(.newPassword)
            }

            Section {
                Button("Save") { save() }
                    .disabled(!isValid)
            }
        }
        .navigationTitle("Edit Profile")
    }
}
```

### Animation respecting reduced motion
```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion

Button("Toggle") {
    withAnimation(reduceMotion ? .none : .spring(duration: 0.3)) {
        isExpanded.toggle()
    }
}

// Conditional animation modifier
.animation(reduceMotion ? .none : .easeInOut, value: isExpanded)
```

### Accessibility labels and hints
```swift
Button(action: delete) {
    Image(systemName: "trash")
}
.accessibilityLabel("Delete item")
.accessibilityHint("Double tap to permanently delete this item")

// Group related elements
HStack {
    Text(user.name)
    Text(user.email).foregroundStyle(.secondary)
}
.accessibilityElement(children: .combine)
```

### LazyVStack inside ScrollView (for custom layouts)
```swift
ScrollView {
    LazyVStack(spacing: 12) {
        ForEach(items) { item in
            ItemCard(item: item)
        }
    }
    .padding(.horizontal, 16)
}
// Use List for interactive rows; LazyVStack for custom card layouts
```

### Conditional view without branching in body
```swift
// Prefer computed properties over inline if/else trees
private var contentView: some View {
    if items.isEmpty {
        return AnyView(EmptyStateView())
    }
    return AnyView(ItemGrid(items: items))
}

// Even better — use @ViewBuilder
@ViewBuilder
private var contentView: some View {
    if items.isEmpty {
        EmptyStateView()
    } else {
        ItemGrid(items: items)
    }
}
```

### Sheet / fullScreenCover
```swift
@State private var showingDetail = false
@State private var selectedItem: Item?

.sheet(item: $selectedItem) { item in
    ItemDetailView(item: item)
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
}
```

---

## Best Practices by Category

### Views
- Keep `body` under ~40 lines — extract sub-views or use `@ViewBuilder` helpers
- Prefer computed properties for conditional logic over inline ternaries in body
- Use `Group { }` to apply modifiers to multiple views without adding layout container
- `ViewModifier` for reusable style bundles (card style, section header style)

### State
- `@State` is private — never pass it across views directly; use `@Binding` for child writes
- `@StateObject` owns the object — use when the view creates the ViewModel
- `@ObservedObject` does NOT own — use for injected ViewModels (won't survive view recreation)
- `@Observable` (iOS 17+) is simpler: no `@Published` needed, just mark class `@Observable`
- Avoid storing the same state in multiple places — single source of truth

### Navigation
- `NavigationStack` replaces `NavigationView` (iOS 16+)
- Use typed `NavigationPath` for programmatic deep linking
- `.navigationDestination` decouples routing from row UI
- For tab apps: `TabView` at root, `NavigationStack` inside each tab

### Lists & Performance
- `List` for interactive rows — cell reuse built in
- `LazyVStack` in `ScrollView` for custom card UIs
- `ForEach` requires `Identifiable` items or explicit `id:` parameter
- Avoid heavy computation in row `body` — cache in ViewModel

### Async
- `.task { }` for view-lifecycle async work — cancels automatically on disappear
- `.task(id:)` re-runs when the id value changes (replaces `.onChange` + `Task`)
- `async let` for parallel fetches within a single task

### Forms
- `textContentType` on every text field — enables autofill
- `keyboardType` matches expected input (`.emailAddress`, `.numberPad`, `.URL`)
- `.submitLabel(.next)` and `FocusState` for keyboard tab order
- Disable submit button (`disabled(!isValid)`) — never rely only on server validation

### Animation
- `withAnimation` for state-driven animations
- `.matchedGeometryEffect` for hero-style transitions between views
- Always check `accessibilityReduceMotion` before animating
- `.transition(.scale.combined(with: .opacity))` for enter/exit

### Accessibility
- Every icon-only button needs `.accessibilityLabel`
- `.accessibilityHint` for non-obvious actions
- `.accessibilityElement(children: .combine)` for grouped content
- Test with VoiceOver on device — simulator is insufficient
- Support Dynamic Type — never override `.font` with fixed sizes

---

## Common Anti-Patterns

1. `@StateObject` for injected objects — use `@ObservedObject`; `@StateObject` creates/owns the instance and will recreate it
2. `@ObservableObject` + `@Published` for new iOS 17+ code — use `@Observable` macro (cleaner, faster)
3. `.onAppear + Task { }` — use `.task { }` instead (auto-cancels on disappear, preventing data races)
4. Force-unwrapping optionals in views — use `if let` or `guard let`; crashes are not recoverable in SwiftUI previews
5. Complex logic in `body` — extract to computed properties or ViewModels; body re-evaluates frequently
6. Missing `accessibilityLabel` on icon buttons — VoiceOver reads "button" with no context
7. `NavigationView` in new code — deprecated; use `NavigationStack`
8. Storing `@EnvironmentObject` locally with `@State` — breaks injection; access via `@EnvironmentObject` directly
9. Deeply nested closures in body — extract to `@ViewBuilder` functions
10. Ignoring `task` cancellation — long tasks should check `Task.isCancelled`

---

## Performance Checklist

- [ ] `.task` not `.onAppear + Task { }` for async loading
- [ ] `@Observable` (iOS 17+) for ViewModels — finer-grained updates than `@ObservableObject`
- [ ] `LazyVStack`/`LazyHStack` inside `ScrollView` for long custom content
- [ ] `List` for interactive rows (reuses cells natively), `ScrollView + LazyVStack` for custom cards
- [ ] `accessibilityReduceMotion` check before any auto-animation
- [ ] `Equatable` conformance on views with complex bodies to skip unnecessary redraws
- [ ] `.id(item.id)` on list items when reordering is possible
- [ ] Profile in Instruments (SwiftUI template) — not just in simulator
- [ ] `nonisolated` on pure functions to avoid main-actor overhead
- [ ] `@MainActor` on ViewModels that update UI — prevents threading bugs
