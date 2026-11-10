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
  const setIsAuthReady = useAppStore((state) => state.setIsAuthReady);

  useEffect(() => {
    async function syncUserProfile(sessionUser: any) {
      if (!sessionUser) {
        setUser(null);
        return;
      }

      let fullName = sessionUser.user_metadata?.full_name || '';
      let school = sessionUser.user_metadata?.school || '';
      let major = sessionUser.user_metadata?.major || '';
      let avatarUrl = sessionUser.user_metadata?.avatar_url || sessionUser.user_metadata?.foto_profil || '';
      let totalXp = 0;
      let level = 1;

      // Coba ambil dari tabel public.profiles di Supabase jika ada
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .maybeSingle();

        if (profile) {
          fullName = profile.full_name || profile.nama_lengkap || fullName;
          school = profile.school || profile.asal_sekolah || school;
          major = profile.major || profile.jurusan || major;
          avatarUrl = profile.avatar_url || profile.foto_profil || avatarUrl;
          if (typeof profile.total_xp === 'number') totalXp = profile.total_xp;
          if (typeof profile.level === 'number') level = profile.level;
        }
      } catch {
        // Abaikan jika tabel profiles belum dibuat di database
      }

      if (!fullName) {
        const emailPrefix = sessionUser.email ? sessionUser.email.split('@')[0] : 'Siswa Vokasi';
        fullName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      }

      setUser({
        id: sessionUser.id,
        email: sessionUser.email || '',
        namaLengkap: fullName,
        asalSekolah: school || '',
        jurusanDiminati: major || '',
        fotoProfil: avatarUrl,
        totalXp,
        level,
      });
    }

    if (!isSupabaseConfigured) {
      setIsAuthReady(true);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await syncUserProfile(session.user);
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    }).catch(() => {
      setIsAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await syncUserProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsAuthReady]);
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
