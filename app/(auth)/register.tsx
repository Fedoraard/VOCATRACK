import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoogleLogo } from '../../components/auth/GoogleLogo';
import { CloudHighlights } from '../../components/common/CloudHighlights';
import { useAuth } from '../../hooks/useAuth';

const { height } = Dimensions.get('window');

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, loading, errorMessage } = useAuth();

  const handleRegister = async () => {
    setLocalError(null);
    if (!fullName.trim() && !email.trim()) {
      setLocalError('Mohon isi nama lengkap dan email.');
      return;
    }

    if (!email.trim()) {
      setLocalError('Mohon masukkan alamat email.');
      return;
    }

    if (!password) {
      setLocalError('Mohon masukkan kata sandi.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Kata sandi minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const emailToUse = email.trim();
    const passwordToUse = password;
    const nameToUse = fullName.trim();
    const success = await register(emailToUse, passwordToUse, nameToUse);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const handleGoogleRegister = async () => {
    const success = await register('siswa.google@vocatrack.id', 'google_oauth_pass', 'Siswa Google');
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 16 },
          ]}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Hero: Students on Clouds */}
          <View style={styles.heroSection}>
            <Image
              source={require('../../assets/hero_students.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Bottom Card: White Form Area (Clean White matching Image 3) */}
          <View style={styles.formCard}>
            {/* Logo */}
            <View style={styles.logoRow}>
              <Image
                source={require('../../assets/vocatrack_logo_blue.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Ayo Mulai Belajar dan Temukan Arah Karirmu!
            </Text>

            {/* Error message */}
            {Boolean(localError || errorMessage) && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{localError || errorMessage}</Text>
              </View>
            )}

            {/* Full Name Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>

            {/* Email Address Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Password Input */}
            <View style={[styles.inputWrapper, styles.passwordWrapper]}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={styles.inputWithIcon}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={[styles.inputWrapper, styles.passwordWrapper]}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                style={styles.inputWithIcon}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIconBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              activeOpacity={0.88}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Continue with Google */}
            <TouchableOpacity
              style={styles.googleButton}
              activeOpacity={0.85}
              onPress={handleGoogleRegister}
              disabled={loading}
            >
              <GoogleLogo size={20} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Footer Navigation */}
            <View style={styles.footerRow}>
              <Text style={styles.footerPrompt}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.footerLink}>Sign-In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A93FD',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    width: '100%',
    height: Math.min(height * 0.32, 260),
    backgroundColor: '#3A93FD',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 12,
    flex: 1,
    position: 'relative',
  },
  logoRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoImage: {
    width: 200,
    height: 44,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    flex: 1,
    fontWeight: '500',
  },
  inputWrapper: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#70A6FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 11,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  input: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  eyeIconBtn: {
    padding: 6,
  },
  primaryButton: {
    backgroundColor: '#2B7BF6',
    borderRadius: 25,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 12,
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  googleButton: {
    backgroundColor: '#EBF5FF',
    borderRadius: 25,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleButtonText: {
    color: '#2B7BF6',
    fontSize: 15,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerPrompt: {
    color: '#2B7BF6',
    fontSize: 13,
    fontWeight: '500',
  },
  footerLink: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
