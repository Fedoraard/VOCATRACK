import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthInput } from '../../components/auth/AuthInput';
import { SocialLoginButton } from '../../components/auth/SocialLoginButton';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('siswa.vokasi@vocatrack.id');
  const [password, setPassword] = useState('vokasi2026');
  const { login, loginWithBiometrics, loading, errorMessage } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return;
    const success = await login(email, password);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const handleBiometricLogin = async () => {
    const success = await loginWithBiometrics();
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="school" size={28} color="#4F46E5" />
            </View>
            <Text style={styles.appName}>VOCATRACK</Text>
            <Text style={styles.appTagline}>
              Platform Navigasi Karir & Pembelajaran Vokasi Presisi
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Masuk ke Akun Anda</Text>
            <Text style={styles.cardSubtitle}>
              Lanjutkan perkembangan peta keahlian dan persiapan karir SMK/Politeknik.
            </Text>

            {errorMessage && (
              <View style={styles.alertBox}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.alertText}>{errorMessage}</Text>
              </View>
            )}

            {/* Modular Auth Inputs */}
            <AuthInput
              label="Alamat Email Siswa / NISN"
              value={email}
              onChangeText={setEmail}
              placeholder="nama@sekolah.sch.id"
              iconName="mail-outline"
              keyboardType="email-address"
            />

            <AuthInput
              label="Kata Sandi"
              value={password}
              onChangeText={setPassword}
              placeholder="Masukkan kata sandi akun"
              iconName="lock-closed-outline"
              isPassword
            />

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleLogin}
              disabled={loading}
              style={[styles.primaryButton, loading && styles.disabledButton]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Masuk ke VocaTrack</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau gunakan</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Modular Social & Biometric Buttons */}
            <SocialLoginButton
              provider="biometric"
              title="Masuk dengan Sidik Jari / Biometrik"
              onPress={handleBiometricLogin}
              disabled={loading}
            />

            <SocialLoginButton
              provider="google"
              title="Masuk dengan Akun Belajar.id / Google"
              onPress={handleLogin}
              disabled={loading}
            />
          </View>

          {/* Quick Guest Access */}
          <TouchableOpacity
            style={styles.guestLink}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.guestLinkText}>
              Eksplorasi Langsung sebagai Tamu →
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E1B4B',
    letterSpacing: 1.5,
  },
  appTagline: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 18,
    lineHeight: 18,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    gap: 8,
  },
  alertText: {
    fontSize: 12,
    color: '#DC2626',
    flex: 1,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94A3B8',
    paddingHorizontal: 10,
    fontWeight: '600',
  },
  guestLink: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8,
  },
  guestLinkText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '700',
  },
});
