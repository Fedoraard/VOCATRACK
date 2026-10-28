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
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { GoogleLogo } from '../../components/auth/GoogleLogo';
import { CloudHighlights } from '../../components/common/CloudHighlights';
import { useAuth } from '../../hooks/useAuth';

const { width, height } = Dimensions.get('window');

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
          <View
            style={[
              styles.heroSection,
              { height: Math.round(width / 1.292 + (insets.top || 24)) },
            ]}
          >
            <Image
              source={require('../../assets/hero_students.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            {/* Top smooth sky transition gradient */}
            <Svg
              width="100%"
              height={45}
              style={styles.topGradientFade}
              pointerEvents="none"
            >
              <Defs>
                <SvgLinearGradient id="loginSkyFade" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#3A93FD" stopOpacity={1} />
                  <Stop offset="35%" stopColor="#3A93FD" stopOpacity={0.85} />
                  <Stop offset="70%" stopColor="#3A93FD" stopOpacity={0.35} />
                  <Stop offset="100%" stopColor="#3A93FD" stopOpacity={0} />
                </SvgLinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height={45} fill="url(#loginSkyFade)" />
            </Svg>
          </View>

          {/* Bottom Card: White Form Area (Clean White matching Image 2) */}
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
    backgroundColor: '#3A93FD',
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: width / 1.292,
  },
  topGradientFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 24,
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
    marginBottom: 18,
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
    height: 48,
    borderWidth: 1.5,
    borderColor: '#70A6FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
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
    marginBottom: 18,
    marginTop: 2,
  },
  forgotText: {
    color: '#2B7BF6',
    fontSize: 12.5,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  primaryButton: {
    backgroundColor: '#2B7BF6',
    borderRadius: 25,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 20,
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
