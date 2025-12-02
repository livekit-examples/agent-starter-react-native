import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { registerGlobals } from '@livekit/react-native';
import { ConnectionProvider } from '@/hooks/useConnection';

// Do required setup for LiveKit React-Native
registerGlobals();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ConnectionProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(start)" options={{ headerShown: false }} />
          <Stack.Screen name="assistant" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ConnectionProvider>
  );
}
