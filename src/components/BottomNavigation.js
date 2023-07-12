import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "../screens/FeedScreen";
import SharePostScreen from "../screens/SharePostScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const BottomNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#7161ef" },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({focused}) => <Ionicons name={focused ? "home" : "home-outline"} color={"white"} size={24} />,
        }}
      />
      <Tab.Screen
        name="Share"
        component={SharePostScreen}
        options={{
          tabBarActiveTintColor: "#7161ef",
          tabBarInactiveTintColor: "#957fef",
          tabBarIcon: ({focused}) => (
            <AntDesign name={focused ? "plussquare" : "plussquareo"} size={24} color="white" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarActiveTintColor: "#7161ef",
          tabBarInactiveTintColor: "#957fef",
          tabBarIcon: ({focused}) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={24} color="white" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
