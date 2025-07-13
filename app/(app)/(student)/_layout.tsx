import { Tabs } from "expo-router";
import Feather from "react-native-vector-icons/Feather";

import Colors from "@/constants/colors";

export default function StudentTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grayDark,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu/[canteenId]"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => <Feather name="shopping-bag" size={22} color={color} />,
          href: null, // Hide this tab, it will be navigated to from the home screen
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <Feather name="clock" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: true,
          href: null, // Hide this tab, it will be navigated to from the menu screen
        }}
      />
      <Tabs.Screen
        name="order-details/[orderId]"
        options={{
          title: "Order Details",
          headerShown: true,
          href: null, // Hide this tab, it will be navigated to from the orders screen
        }}
      />
    </Tabs>
  );
}
