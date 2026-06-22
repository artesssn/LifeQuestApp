import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';

import { lifeQuestTheme } from '@/constants/lifequest-theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: lifeQuestTheme.colors.text,
        tabBarInactiveTintColor: lifeQuestTheme.colors.muted,
        tabBarStyle: {
          display: 'none',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Painel',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} name="space-dashboard" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Missoes',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} name="task-alt" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="arena"
        options={{
          title: 'Foco',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} name="sports-esports" size={size} />
          ),
        }}
      />
      <Tabs.Screen name="validations" options={{ href: null }} />
      <Tabs.Screen name="rewards" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
