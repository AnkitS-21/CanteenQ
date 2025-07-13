import { Redirect, Stack } from "expo-router";

import { useAuthStore } from "@/store/authStore";

export default function AppLayout() {
  const { isAuthenticated, user } = useAuthStore();

  // If not authenticated, redirect to auth
  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)" />;
  }

  // If authenticated, show the appropriate layout based on role
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user.role === 'admin' ? (
        <Stack.Screen name="(admin)" />
      ) : (
        <Stack.Screen name="(student)" />
      )}
    </Stack>
  );
}