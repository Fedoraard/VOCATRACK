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
  const updateStoreProfile = useAppStore((state) => state.updateProfile);
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
              totalXp: 0,
              level: 1,
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

  // Register via Email/Password (Supabase with Mock Fallback)
  const register = useCallback(
    async (email: string, pass: string, fullName?: string, school?: string) => {
      setLoading(true);
      setErrorMessage(null);

      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
              data: {
                full_name: fullName || 'Siswa Vokasi',
                school: school || 'SMK Binaan VocaTrack',
              },
            },
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            setUser({
              id: data.user.id,
              email: data.user.email || email,
              namaLengkap: data.user.user_metadata?.full_name || fullName || 'Siswa Vokasi',
              asalSekolah: data.user.user_metadata?.school || school || 'SMK Binaan VocaTrack',
              totalXp: 0,
              level: 1,
            });
            return true;
          }
        } else {
          // Mock register simulator
          await new Promise((res) => setTimeout(res, 600));
          setUser({
            id: 'user-001',
            email,
            namaLengkap: fullName || 'Ahmad Faiz Al-Rasyid',
            asalSekolah: school || 'SMKN 1 Cimahi',
            jurusanDiminati: 'Rekayasa Perangkat Lunak',
            totalXp: 850,
            level: 3,
          });
          return true;
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal mendaftar. Periksa kembali data Anda.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser]
  );

  // Send OTP Verification Code to Email
  const sendOtpCode = useCallback(
    async (email: string) => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const cleanEmail = email.trim();
        if (!cleanEmail || !cleanEmail.includes('@')) {
          throw new Error('Masukkan alamat email yang valid.');
        }

        if (isSupabaseConfigured) {
          // Attempt OTP via Supabase
          const { error } = await supabase.auth.signInWithOtp({
            email: cleanEmail,
            options: { shouldCreateUser: false },
          });
          if (error) {
            // Fallback to reset password OTP if sign-in with OTP has specific constraints
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail);
            if (resetError) throw resetError;
          }
          return true;
        } else {
          // Mock OTP simulator
          await new Promise((res) => setTimeout(res, 700));
          return true;
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal mengirim kode verifikasi. Periksa kembali email Anda.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Verify OTP Code
  const verifyOtpCode = useCallback(
    async (email: string, code: string) => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const cleanCode = code.trim();
        if (cleanCode.length < 4) {
          throw new Error('Masukkan kode verifikasi lengkap.');
        }

        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.verifyOtp({
            email: email.trim(),
            token: cleanCode,
            type: 'recovery',
          });
          if (error) {
            // Also try email type
            const { error: emailOtpError } = await supabase.auth.verifyOtp({
              email: email.trim(),
              token: cleanCode,
              type: 'email',
            });
            if (emailOtpError) throw emailOtpError;
          }
          return true;
        } else {
          // Mock verification simulator
          await new Promise((res) => setTimeout(res, 600));
          // Accept any 4-6 digit code in mock mode, or 123456
          if (cleanCode === '000000' || cleanCode === '0000') {
            throw new Error('Kode verifikasi salah atau kedaluwarsa.');
          }
          return true;
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Kode verifikasi tidak valid atau telah kedaluwarsa.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Set / Update Password after verification
  const updatePassword = useCallback(
    async (newPassword: string) => {
      setLoading(true);
      setErrorMessage(null);

      try {
        if (!newPassword || newPassword.length < 6) {
          throw new Error('Kata sandi baru minimal 6 karakter.');
        }

        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });
          if (error) throw error;
          return true;
        } else {
          // Mock password update
          await new Promise((res) => setTimeout(res, 600));
          return true;
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal memperbarui kata sandi baru.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Reset Password via Email (backward compatibility)
  const resetPassword = useCallback(
    async (email: string) => {
      return sendOtpCode(email);
    },
    [sendOtpCode]
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

  const updateProfile = useCallback(
    async (updates: { namaLengkap?: string; asalSekolah?: string; jurusanDiminati?: string; fotoProfil?: string }) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.updateUser({
            data: {
              ...(updates.namaLengkap && { full_name: updates.namaLengkap }),
              ...(updates.asalSekolah && { school: updates.asalSekolah }),
              ...(updates.jurusanDiminati && { major: updates.jurusanDiminati }),
              ...(updates.fotoProfil && { avatar_url: updates.fotoProfil }),
            },
          });
          if (error) throw error;
        }
        updateStoreProfile(updates);
        return true;
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal memperbarui profil.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [updateStoreProfile]
  );

  return {
    user,
    isAuthenticated,
    loading,
    errorMessage,
    login,
    register,
    sendOtpCode,
    verifyOtpCode,
    updatePassword,
    resetPassword,
    updateProfile,
    loginWithBiometrics,
    logout,
  };
}
