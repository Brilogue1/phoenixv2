import { Tabs, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  // IMPORTANT: All hooks must be called at the top, before any conditional returns
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await AsyncStorage.getItem('logged_in_user');
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.replace('/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
  screenOptions={{
    tabBarActiveTintColor: PhoenixColors.phoenixBlue, // '#8AB4F8'
    tabBarInactiveTintColor: PhoenixColors.mutedText, // Gray
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarStyle: {
      paddingBottom: insets.bottom,
      height: 49 + insets.bottom,
      backgroundColor: '#0A0A0A', // Slightly lighter black
      borderTopColor: 'rgba(138, 180, 248, 0.3)', // Phoenix blue top border
      borderTopWidth: 1,
    },
  }}
>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "house.fill" : "house"} 
              color={color || '#8B5CF6'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="survey"
        options={{
          title: "Survey",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "list.clipboard.fill" : "list.clipboard"} 
              color={color || '#8B5CF6'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "number.square.fill" : "number.square"} 
              color={color || '#8B5CF6'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "dollarsign.circle.fill" : "dollarsign.circle"} 
              color={color || '#8B5CF6'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="payroll"
        options={{
          title: "Payroll",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "creditcard.fill" : "creditcard"} 
              color={color || '#8B5CF6'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Sales",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "chart.bar.fill" : "chart.bar"} 
              color={color || '#8B5CF6'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
