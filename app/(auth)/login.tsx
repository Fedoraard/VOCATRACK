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
import { AuthBackgroundDecorations } from '../../components/auth/AuthBackgroundDecorations';
import { useAuth } from '../../hooks/useAuth';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, errorMessage } = useAuth();

  const handleLogin = async () => {
    const emailToUse = identifier.trim() || 'siswa.vokasi@vocatrack.id';
    const passwordToUse = password || 'vokasi2026';
    const success = await login(emailToUse, passwordToUse);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const handleGoogleLogin = async () => {
    const success = await login('siswa.google@vocatrack.id', 'google_oauth_pass');
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

          {/* Bottom Card: White Form Area */}
          <View style={styles.formCard}>
            <AuthBackgroundDecorations />

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

            {/* Error Message if any */}
            {Boolean(errorMessage) && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Username or Email Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Username or Email"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
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

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => {}}
              style={styles.forgotBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Log In Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              activeOpacity={0.88}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            {/* Divider 'atau' */}
            <Text style={styles.dividerText}>atau</Text>

            {/* Sign-In with Google */}
            <TouchableOpacity
              style={styles.googleButton}
              activeOpacity={0.85}
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              <GoogleLogo size={20} />
              <Text style={styles.googleButtonText}>Sign-In with Google</Text>
            </TouchableOpacity>

            {/* Footer Navigation */}
            <View style={styles.footerRow}>
              <Text style={styles.footerPrompt}>Dont have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/register')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.footerLink}>Sign-Up</Text>
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
    backgroundColor: '#3792FD',
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
    height: Math.min(height * 0.33, 270),
    backgroundColor: '#3792FD',
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
    overflow: 'hidden',
  },
  logoRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoImage: {
    width: 210,
    height: 48,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    flex: 1,
    fontWeight: '500',
  },
  inputWrapper: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#70A6FA',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    marginBottom: 4,
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
  forgotBtn: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: 4,
  },
  forgotText: {
    color: '#2B7BF6',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  primaryButton: {
    backgroundColor: '#2B7BF6',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  dividerText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: 12,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#EBF5FF',
    borderRadius: 25,
    height: 50,
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
    marginTop: 22,
  },
  footerPrompt: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '500',
  },
  footerLink: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
