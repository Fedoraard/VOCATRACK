import { useState, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { useAppStore } from '../store/useAppStore';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const setUser = useAppStore((state) => state.setUser);
  const logoutStore = useAppStore((state) => state.logout);

  // Login via Email/Password (Supabase with Mock Fallback)
  const login = useCallback(
    async (email: string, pass: string) => {
      setLoading(true);
      setErrorMessage(null);

      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            setUser({
              id: data.user.id,
              email: data.user.email || email,
              namaLengkap: data.user.user_metadata?.full_name || 'Siswa Vokasi',
              asalSekolah: data.user.user_metadata?.school || 'SMK Binaan VocaTrack',
              totalXp: 850,
              level: 3,
            });
            return true;
          }
        } else {
          // Mock login simulator untuk Fase 2
          await new Promise((res) => setTimeout(res, 600));
          setUser({
            id: 'user-001',
            email,
            namaLengkap: 'Ahmad Faiz Al-Rasyid',
            asalSekolah: 'SMKN 1 Cimahi',
            jurusanDiminati: 'Rekayasa Perangkat Lunak',
            totalXp: 850,
            level: 3,
          });
          return true;
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser]
  );

  // Login via Native Biometrics (Fingerprint / FaceID)
  const loginWithBiometrics = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setErrorMessage('Sensor biometrik tidak tersedia atau belum didaftarkan.');
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentikasi Akun VocaTrack',
        fallbackLabel: 'Gunakan Kata Sandi',
        cancelLabel: 'Batal',
      });

      if (result.success) {
        setUser({
          id: 'user-001',
          email: 'siswa.vokasi@vocatrack.id',
          namaLengkap: 'Ahmad Faiz Al-Rasyid',
          asalSekolah: 'SMKN 1 Cimahi',
          jurusanDiminati: 'Rekayasa Perangkat Lunak',
          totalXp: 850,
          level: 3,
        });
        return true;
      }
      return false;
    } catch (err: any) {
      setErrorMessage(err.message || 'Autentikasi biometrik gagal.');
      return false;
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    logoutStore();
  }, [logoutStore]);

  return {
    user,
    isAuthenticated,
    loading,
    errorMessage,
    login,
    loginWithBiometrics,
    logout,
  };
}
