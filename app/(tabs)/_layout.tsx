import { Tabs, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#8AB4F8" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8AB4F8',
        tabBarInactiveTintColor: '#9BA1A6',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingBottom: insets.bottom,
          height: 49 + insets.bottom,
          backgroundColor: '#0A0A0A',
          borderTopColor: 'rgba(138, 180, 248, 0.3)',
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={28} 
              name="house"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="survey"
        options={{
          title: "Survey",
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={28} 
              name="doc.text"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={28} 
              name="plus.forwardslash.minus"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={28} 
              name="dollarsign.circle"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="payroll"
        options={{
          title: "Payroll",
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={28} 
              name="banknote"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Sales",
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={28} 
              name="chart.bar"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
