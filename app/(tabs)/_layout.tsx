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
          backgroundColor: '#13161C',
          borderTopColor: 'rgba(255,255,255,0.06)',
          height: 74,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="space-dashboard" size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Missões',
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="task-alt" size={size} />,
        }}
      />
    </Tabs>
  );
}
