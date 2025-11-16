# HabitTracker Mobile - React Native Setup

This doc outlines how to bootstrap the native mobile apps (iOS/Android) using React Native with TypeScript and the libraries referenced in Week 8.

## 1) Initialize Project

```bash
npx react-native init HabitTrackerMobile --template react-native-template-typescript
cd HabitTrackerMobile
```

## 2) Install Dependencies

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install react-native-push-notification
npm install react-native-biometrics
npm install react-native-haptic-feedback
npm install @tanstack/react-query
npm install zustand
```

Follow each library's linking/installation steps (Android/iOS manifests, AppDelegate, etc.).

## 3) Suggested Structure

```
/mobile
  /src
    /screens
      HomeScreen.tsx
      HabitsScreen.tsx
      CheckInScreen.tsx
      SquadsScreen.tsx
      ProfileScreen.tsx
    /components
      HabitCard.tsx
      StreakCounter.tsx
      CheckInButton.tsx
    /navigation
      AppNavigator.tsx
      TabNavigator.tsx
    /store
      habitStore.ts
      userStore.ts
    /services
      api.ts
      storage.ts
      notifications.ts
    /utils
      haptics.ts
      biometrics.ts
```

## 4) API Layer

Point the mobile `api.ts` at your Next.js backend base URL (dev: `http://localhost:3002`). Use React Query for caching and `AsyncStorage` for offline support.

## 5) Offline & Sync

- Queue check-ins in `storage.ts` when offline; attempt sync when connectivity resumes (NetInfo).
- Cache the latest habits for offline display.

## 6) Notifications

- Configure `react-native-push-notification` channels.
- Schedule daily reminders per habit, cancel/reschedule on changes.

## 7) Haptics & Biometrics

- Use `react-native-haptic-feedback` on check-in success and primary CTA actions.
- Gate sensitive actions via `react-native-biometrics` prompt when enabled by the user.

## 8) Navigation

- Bottom tabs: Home, Habits, Squads, Profile.
- Stack for details/modals.

## 9) State

- Use Zustand for lightweight local app state.
- Use React Query for server state.

## 10) Build & Run

```bash
npx react-native run-ios
npx react-native run-android
```

Troubleshoot with Xcode/Android Studio logs as needed.


