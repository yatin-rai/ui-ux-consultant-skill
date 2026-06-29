# React Native Reference

## When to Read
Read this file when building React Native apps with Expo — components, styling, navigation, lists, keyboard handling, accessibility, or performance.

---

## Recommended Libraries

| Library | Purpose | Install |
|---|---|---|
| React Navigation | Routing | `npm install @react-navigation/native` |
| NativeWind | Tailwind for RN | `npm install nativewind` |
| React Native Paper | Material components | `npm install react-native-paper` |
| MMKV | Fast local storage | `npm install react-native-mmkv` |
| Reanimated | 60fps animations (UI thread) | `npx expo install react-native-reanimated` |
| Zustand | Lightweight state management | `npm install zustand` |
| React Query / TanStack Query | Server state, caching | `npm install @tanstack/react-query` |
| Expo Image | Optimized image component | `npx expo install expo-image` |
| Zod | Schema validation | `npm install zod` |

---

## Style Recommendations

- `StyleSheet.create` for all styles — never inline objects in JSX
- Follow iOS 8pt grid / Android 8dp grid for spacing
- Minimum touch target: 44×44pt (iOS HIG) — use `minWidth`/`minHeight` or `hitSlop`
- System font scales: use `fontSize` values from a scale (12, 14, 16, 18, 24, 32)
- NativeWind for utility-first styling in Expo projects (Tailwind classes on RN components)
- Avoid hardcoded colors — use a theme object or `useTheme()` from React Navigation

---

## Expo vs Bare Workflow

Use **Expo managed workflow** for 95% of apps:
- Handles native builds, OTA updates (EAS Update), and device APIs
- `npx expo start` for instant dev iteration
- EAS Build for production `.ipa`/`.apk`

Go **bare** only when you need a custom native module not in Expo SDK.

---

## Top UX Patterns (with Code)

### StyleSheet (always — never inline objects)
```typescript
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#111' },
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
  },
});

export function MyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
}
```

### Responsive sizing
```typescript
import { useWindowDimensions } from 'react-native';

function ResponsiveLayout() {
  const { width, height } = useWindowDimensions(); // updates on rotation
  const isTablet = width >= 768;

  return isTablet ? <TabletLayout /> : <PhoneLayout />;
}
// Never use Dimensions.get() in render — it doesn't update on rotation
```

### FlatList (always for long lists)
```tsx
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemCard item={item} />}
  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
  ListEmptyComponent={<EmptyState />}
  ListHeaderComponent={<ListHeader />}
  onEndReached={loadMore}
  onEndReachedThreshold={0.3}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### Navigation (React Navigation — Stack + Tab)
```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Post" component={PostScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

### Minimum touch target (44×44pt)
```tsx
import { TouchableOpacity, StyleSheet } from 'react-native';

<TouchableOpacity
  style={styles.iconButton}
  onPress={handlePress}
  activeOpacity={0.7}
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
>
  <Icon name="heart" size={24} />
</TouchableOpacity>

// styles:
iconButton: {
  minWidth: 44,
  minHeight: 44,
  alignItems: 'center',
  justifyContent: 'center',
},
```

### Keyboard handling
```tsx
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    <TextInput
      placeholder="Email"
      keyboardType="email-address"
      autoCapitalize="none"
      returnKeyType="next"
    />
    <TextInput
      placeholder="Password"
      secureTextEntry
      returnKeyType="done"
      onSubmitEditing={handleLogin}
    />
  </ScrollView>
</KeyboardAvoidingView>
```

### Accessible touch target
```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Delete item"
  accessibilityRole="button"
  accessibilityHint="Double tap to delete this item permanently"
  onPress={handleDelete}
>
  <Icon name="trash" size={20} />
</TouchableOpacity>
```

### Zustand store
```typescript
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// In component:
const user = useAuthStore((state) => state.user); // subscribe to slice only
```

### TanStack Query for server state
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <ErrorState message={error.message} />;

  return (
    <FlatList
      data={data}
      keyExtractor={(u) => u.id}
      renderItem={({ item }) => <UserRow user={item} />}
    />
  );
}
```

### Reanimated animation (runs on UI thread)
```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

function ScaleButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
      >
        <Text>Press me</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
```

---

## Best Practices by Category

### Styling
- Always `StyleSheet.create` — objects are frozen and bridged once, not every render
- Avoid `style={[styles.base, condition && styles.variant]}` with long arrays — extract a helper
- Use `flex: 1` on container screens to fill SafeArea
- `Platform.select({ ios: ..., android: ... })` for platform-specific styles

### Lists
- `FlatList` for everything with 20+ items — never `ScrollView` + `.map`
- `SectionList` for grouped data
- `keyExtractor` must return a stable unique string — not index
- `getItemLayout` for known-height rows (significant performance boost)
- `removeClippedSubviews={true}` on Android for very long lists

### Navigation
- `@react-navigation/native-stack` (uses native UINavigationController) — not JS stack
- Pass typed params using TypeScript generic: `Stack.Screen<StackParamList, 'PostDetail'>`
- `useNavigation` hook inside screen components; avoid `navigation.navigate` from non-screen components
- Deep linking: configure `linking` prop on `NavigationContainer`

### State Management
- Zustand for client state — minimal boilerplate, no Provider needed
- TanStack Query for server state — handles caching, refetching, background updates
- MMKV for persisted state — 10× faster than AsyncStorage
- Avoid prop drilling beyond 2 levels — use Zustand slice or Context

### Keyboard & Input
- `KeyboardAvoidingView` wraps every screen with inputs
- `keyboardShouldPersistTaps="handled"` on `ScrollView` — taps dismiss keyboard only outside inputs
- `returnKeyType="next"` and `onSubmitEditing` to move focus between fields
- `textContentType` for iOS autofill; `autoComplete` for Android

### Touch & Gestures
- `activeOpacity={0.7}` on all `TouchableOpacity` — default 0.2 looks broken
- `hitSlop` for small icons — increases tap area without changing layout
- `Pressable` for more complex press states (hover, focus on web)
- Minimum 44pt touch targets everywhere — enforce with `minWidth`/`minHeight`

### Accessibility
- `accessibilityRole` on every interactive element
- `accessibilityLabel` describes what it is; `accessibilityHint` describes what happens
- `accessibilityState={{ disabled: true }}` for disabled controls
- Test with iOS VoiceOver and Android TalkBack on real devices

### Performance
- `React.memo` on list item components — prevents re-render when parent updates
- `useCallback` on `renderItem` — stable reference prevents FlatList re-renders
- `useMemo` for expensive transforms on large datasets
- Avoid anonymous functions in JSX (`onPress={() => fn(item)}`) in hot render paths — use `useCallback`

---

## Common Anti-Patterns

1. `ScrollView` with long lists — freezes UI thread rendering all items; use `FlatList`
2. Inline style objects `style={{ padding: 16 }}` — creates new object every render; use `StyleSheet.create`
3. Missing `keyExtractor` — React Native warns and degrades diff performance
4. `Dimensions.get('window')` in render — doesn't update on rotation; use `useWindowDimensions`
5. `activeOpacity` omitted — default `0.2` makes buttons feel unresponsive
6. `onPress` without `hitSlop` on small icons — nearly impossible to tap accurately
7. Storing server state in Zustand manually — use TanStack Query (handles stale/loading/error)
8. `console.log` in production — remove or use a logger that strips in release builds
9. No `accessibilityLabel` on icon buttons — VoiceOver announces nothing useful
10. Expo Go for production testing — use EAS Build; Expo Go skips native build steps

---

## Performance Checklist

- [ ] `FlatList` for all lists (never `ScrollView` + `.map`)
- [ ] `StyleSheet.create` for all styles
- [ ] `keyExtractor` returning stable unique string (not index)
- [ ] `useWindowDimensions` not `Dimensions.get` in render
- [ ] `React.memo` on `renderItem` components
- [ ] `useCallback` wrapping `renderItem` and event handlers
- [ ] Hermes engine enabled (default in Expo SDK 48+)
- [ ] `react-native-reanimated` for smooth 60fps animations (runs on UI thread)
- [ ] EAS Build for production — not Expo Go
- [ ] `getItemLayout` for fixed-height list items
- [ ] MMKV for persisted state (not AsyncStorage)
