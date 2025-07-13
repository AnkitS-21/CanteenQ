import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/Feather"; // Feather icons

import Colors from "@/constants/colors";

export default function AdminTabLayout() {
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
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <Icon name="clipboard" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Icon name="menu" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Icon name="user" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="order-details/[orderId]"
        options={{
          title: "Order Details",
          headerShown: true,
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-item/[itemId]"
        options={{
          title: "Edit Item",
          headerShown: true,
          href: null,
        }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          title: "Add Item",
          headerShown: true,
          href: null,
        }}
      />
    </Tabs>
  );
}
