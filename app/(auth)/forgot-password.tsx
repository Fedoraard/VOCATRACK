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
import { useAuth } from '../../hooks/useAuth';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { user, resetPassword, loading, errorMessage } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleResetPassword = async () => {
    setLocalError(null);
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setLocalError('Silakan masukkan alamat email akun Anda.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setLocalError('Format email tidak valid. Periksa kembali.');
      return;
    }

    const success = await resetPassword(cleanEmail);
    if (success) {
      setIsSuccess(true);
    }
  };

  const activeError = localError || errorMessage;

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
          {/* Top Hero: Students on Clouds with Smooth Transition */}
          <View
            style={[
              styles.heroSection,
              { height: Math.round(width / 1.292 + (insets.top || 24)) },
            ]}
          >
            {/* Back Button Floating on Blue Sky */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.backFloatingBtn, { top: Math.max(insets.top, 16) + 6 }]}
              activeOpacity={0.8}
              accessibilityLabel="Kembali ke Halaman Login"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>

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
                <SvgLinearGradient id="forgotSkyFade" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#3A93FD" stopOpacity={1} />
                  <Stop offset="35%" stopColor="#3A93FD" stopOpacity={0.85} />
                  <Stop offset="70%" stopColor="#3A93FD" stopOpacity={0.35} />
                  <Stop offset="100%" stopColor="#3A93FD" stopOpacity={0} />
                </SvgLinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height={45} fill="url(#forgotSkyFade)" />
            </Svg>
          </View>

          {/* Bottom Card: White Form Area matching Login & Register */}
          <View style={styles.formCard}>
            {/* Logo */}
            <View style={styles.logoRow}>
              <Image
                source={require('../../assets/vocatrack_logo_blue.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.formTitle}>Lupa Kata Sandi?</Text>
            <Text style={styles.subtitle}>
              {isSuccess
                ? 'Instruksi pemulihan telah dikirim. Silakan periksa kotak masuk atau spam email Anda.'
                : 'Masukkan email akun VocaTrack kamu untuk menerima instruksi pemulihan kata sandi.'}
            </Text>

            {/* Error Message if any */}
            {Boolean(activeError) && !isSuccess && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{activeError}</Text>
              </View>
            )}

            {isSuccess ? (
              /* Success Confirmation Box */
              <View style={styles.successContainer}>
                <View style={styles.successIconBadge}>
                  <Ionicons name="mail-unread-outline" size={36} color="#2B7BF6" />
                </View>

                <View style={styles.emailPill}>
                  <Ionicons name="at" size={14} color="#64748B" />
                  <Text style={styles.emailPillText} numberOfLines={1}>
                    {email.trim()}
                  </Text>
                </View>

                <Text style={styles.successHint}>
                  Klik tautan yang terdapat di dalam email untuk membuat kata sandi baru.
                </Text>

                {/* Back to Login Button */}
                <TouchableOpacity
                  style={styles.primaryButton}
                  activeOpacity={0.88}
                  onPress={() => router.replace('/(auth)/login')}
                >
                  <Text style={styles.primaryButtonText}>Kembali ke Login</Text>
                </TouchableOpacity>

                {/* Resend Link Button */}
                <TouchableOpacity
                  style={styles.resendBtn}
                  activeOpacity={0.7}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#2B7BF6" size="small" />
                  ) : (
                    <Text style={styles.resendText}>Belum menerima email? Kirim Ulang</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              /* Input Form State */
              <>
                {/* Email Address Input */}
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={19} color="#70A6FA" style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (localError) setLocalError(null);
                    }}
                    placeholder="Alamat Email Terdaftar"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    style={styles.input}
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.disabledButton]}
                  activeOpacity={0.88}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Kirim Instruksi Reset</Text>
                  )}
                </TouchableOpacity>

                {/* Footer Navigation Back to Login */}
                <View style={styles.footerRow}>
                  <Text style={styles.footerPrompt}>Sudah ingat kata sandi? </Text>
                  <TouchableOpacity
                    onPress={() => router.back()}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.footerLink}>Masuk</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  backFloatingBtn: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
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
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 19,
    paddingHorizontal: 8,
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
    height: 48,
    borderWidth: 1.5,
    borderColor: '#70A6FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#2B7BF6',
    borderRadius: 25,
    height: 48,
    width: '100%',
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
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
  successContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  successIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
    gap: 6,
    maxWidth: '90%',
  },
  emailPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  successHint: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 12,
  },
  resendBtn: {
    marginTop: 12,
    paddingVertical: 6,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B7BF6',
    textDecorationLine: 'underline',
  },
});
