import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { LifeQuestDemoProvider } from '@/contexts/lifequest-demo-context';

export default function RootLayout() {
  return (
    <LifeQuestDemoProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack
          screenOptions={{
            animation: 'fade',
            animationDuration: 260,
            headerShown: false,
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="escolha-classe/[tipo]" />
          <Stack.Screen name="cadastro" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </LifeQuestDemoProvider>
  );
}
