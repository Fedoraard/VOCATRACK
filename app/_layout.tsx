import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="materi/[id]"
            options={{
              presentation: 'card',
              headerShown: true,
              headerTitle: 'Materi Pembelajaran',
              headerBackTitle: 'Kembali',
              headerTintColor: '#4F46E5',
            }}
          />
          <Stack.Screen
            name="quiz/[id]"
            options={{
              presentation: 'fullScreenModal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="vocabot"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'VocaBot AI Assistant',
              headerTintColor: '#4F46E5',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
