import '../global.css';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { useAppStore } from '../store/useAppStore';

export default function RootLayout() {
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || 'dipagntg12@gmail.com',
          namaLengkap: session.user.user_metadata?.full_name || 'DIVA WAHYU',
          asalSekolah: session.user.user_metadata?.school || 'SMK Binaan VocaTrack',
          jurusanDiminati: session.user.user_metadata?.major || 'Teknik Komputer Jaringan',
          fotoProfil: session.user.user_metadata?.avatar_url || session.user.user_metadata?.foto_profil,
          totalXp: 0,
          level: 1,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || 'dipagntg12@gmail.com',
          namaLengkap: session.user.user_metadata?.full_name || 'DIVA WAHYU',
          asalSekolah: session.user.user_metadata?.school || 'SMK Binaan VocaTrack',
          jurusanDiminati: session.user.user_metadata?.major || 'Teknik Komputer Jaringan',
          fotoProfil: session.user.user_metadata?.avatar_url || session.user.user_metadata?.foto_profil,
          totalXp: 0,
          level: 1,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="materi/list"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="materi/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
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
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
