import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Redirect href="/(app)/(admin)" />;
    } else {
      return <Redirect href="/(app)/(student)" />;
    }
  }

  return <Redirect href="/(auth)" />;
}