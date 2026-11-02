import React, { useState, useEffect, useRef } from 'react';
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

const { width } = Dimensions.get('window');
const OTP_LENGTH = 6;

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export default function VerificationCodeScreen() {
  const insets = useSafeAreaInsets();
  const { user, sendOtpCode, verifyOtpCode, updatePassword, loading, errorMessage } = useAuth();

  // Current flow step
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState(user?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Resend Countdown Timer
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputRef = useRef<any>(null);

  // Countdown effect when in OTP step
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Focus OTP input when entering OTP step
  useEffect(() => {
    if (step === 'OTP') {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 300);
    }
  }, [step]);

  // Step 1: Send Code to Email
  const handleSendCode = async () => {
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

    const success = await sendOtpCode(cleanEmail);
    if (success) {
      setStep('OTP');
      setCountdown(60);
      setCanResend(false);
      setOtpCode('');
    }
  };

  // Resend Code
  const handleResendCode = async () => {
    if (!canResend || loading) return;
    setLocalError(null);
    const success = await sendOtpCode(email.trim());
    if (success) {
      setCountdown(60);
      setCanResend(false);
      setOtpCode('');
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async () => {
    setLocalError(null);
    const cleanCode = otpCode.trim();

    if (cleanCode.length < OTP_LENGTH) {
      setLocalError(`Masukkan ${OTP_LENGTH} digit kode verifikasi lengkap.`);
      return;
    }

    const success = await verifyOtpCode(email.trim(), cleanCode);
    if (success) {
      setStep('NEW_PASSWORD');
    }
  };

  // Step 3: Save New Password
  const handleSavePassword = async () => {
    setLocalError(null);

    if (!newPassword || newPassword.length < 6) {
      setLocalError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const success = await updatePassword(newPassword);
    if (success) {
      setStep('SUCCESS');
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
          {/* Top Hero: Students on Clouds with Smooth Sky Transition */}
          <View
            style={[
              styles.heroSection,
              { height: Math.round(width / 1.292 + (insets.top || 24)) },
            ]}
          >
            {/* Back Button Floating on Sky */}
            <TouchableOpacity
              onPress={() => {
                if (step === 'OTP') {
                  setStep('EMAIL');
                } else if (step === 'NEW_PASSWORD') {
                  setStep('OTP');
                } else {
                  router.back();
                }
              }}
              style={[styles.backFloatingBtn, { top: Math.max(insets.top, 16) + 6 }]}
              activeOpacity={0.8}
              accessibilityLabel="Kembali"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <Image
              source={require('../../assets/hero_students.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Smooth sky gradient transition */}
            <Svg
              width="100%"
              height={45}
              style={styles.topGradientFade}
              pointerEvents="none"
            >
              <Defs>
                <SvgLinearGradient id="verifySkyFade" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#3A93FD" stopOpacity={1} />
                  <Stop offset="35%" stopColor="#3A93FD" stopOpacity={0.85} />
                  <Stop offset="70%" stopColor="#3A93FD" stopOpacity={0.35} />
                  <Stop offset="100%" stopColor="#3A93FD" stopOpacity={0} />
                </SvgLinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height={45} fill="url(#verifySkyFade)" />
            </Svg>
          </View>

          {/* Bottom Card Form Area */}
          <View style={styles.formCard}>
            {/* Brand Logo */}
            <View style={styles.logoRow}>
              <Image
                source={require('../../assets/vocatrack_logo_blue.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* ================= STEP 1: INPUT EMAIL ================= */}
            {step === 'EMAIL' && (
              <>
                <Text style={styles.formTitle}>Kode Verifikasi</Text>
                <Text style={styles.subtitle}>
                  Masukkan email akun VocaTrack kamu untuk menerima kode verifikasi.
                </Text>

                {Boolean(activeError) && (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={16} color="#DC2626" />
                    <Text style={styles.errorText}>{activeError}</Text>
                  </View>
                )}

                {/* Email Input */}
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
                  onPress={handleSendCode}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Kirim Kode Verifikasi</Text>
                  )}
                </TouchableOpacity>

                {/* Footer Back to Login */}
                <View style={styles.footerRow}>
                  <Text style={styles.footerPrompt}>Sudah memiliki akun? </Text>
                  <TouchableOpacity
                    onPress={() => router.back()}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.footerLink}>Masuk</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ================= STEP 2: ENTER OTP CODE ================= */}
            {step === 'OTP' && (
              <>
                <Text style={styles.formTitle}>Kode Verifikasi</Text>
                <Text style={styles.subtitle}>
                  Masukkan {OTP_LENGTH} digit kode yang telah dikirimkan ke alamat email:
                </Text>

                {/* Email Pill Badge */}
                <TouchableOpacity
                  style={styles.emailPill}
                  activeOpacity={0.7}
                  onPress={() => setStep('EMAIL')}
                >
                  <Ionicons name="mail" size={14} color="#2B7BF6" />
                  <Text style={styles.emailPillText} numberOfLines={1}>
                    {email.trim()}
                  </Text>
                  <Ionicons name="pencil" size={13} color="#64748B" style={{ marginLeft: 2 }} />
                </TouchableOpacity>

                {Boolean(activeError) && (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={16} color="#DC2626" />
                    <Text style={styles.errorText}>{activeError}</Text>
                  </View>
                )}

                {/* OTP Digit Boxes */}
                <View style={styles.otpBoxesContainer}>
                  {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                    const digit = otpCode[index] || '';
                    const isCurrent = index === otpCode.length;
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={1}
                        onPress={() => otpInputRef.current?.focus()}
                        style={[
                          styles.otpBox,
                          digit ? styles.otpBoxFilled : null,
                          isCurrent ? styles.otpBoxActive : null,
                        ]}
                      >
                        <Text style={styles.otpDigitText}>{digit}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Hidden Real TextInput for cross-platform typing & paste */}
                <TextInput
                  ref={otpInputRef}
                  value={otpCode}
                  onChangeText={(val) => {
                    const clean = val.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
                    setOtpCode(clean);
                    if (localError) setLocalError(null);
                  }}
                  keyboardType="number-pad"
                  maxLength={OTP_LENGTH}
                  style={styles.hiddenOtpInput}
                  autoFocus
                />

                {/* Verify Button */}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (loading || otpCode.length < OTP_LENGTH) && styles.disabledButton,
                  ]}
                  activeOpacity={0.88}
                  onPress={handleVerifyCode}
                  disabled={loading || otpCode.length < OTP_LENGTH}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Verifikasi Kode</Text>
                  )}
                </TouchableOpacity>

                {/* Countdown & Resend Code */}
                <View style={styles.resendSection}>
                  {countdown > 0 ? (
                    <Text style={styles.countdownText}>
                      Kirim ulang kode dalam{' '}
                      <Text style={styles.countdownHighlight}>
                        00:{countdown < 10 ? `0${countdown}` : countdown}
                      </Text>
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={handleResendCode}
                      activeOpacity={0.7}
                      disabled={loading}
                    >
                      <Text style={styles.resendLinkText}>Belum menerima kode? Kirim Ulang</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}

            {/* ================= STEP 3: SET NEW PASSWORD ================= */}
            {step === 'NEW_PASSWORD' && (
              <>
                <Text style={styles.formTitle}>Atur Kata Sandi Baru</Text>
                <Text style={styles.subtitle}>
                  Kode berhasil diverifikasi. Silakan masukkan kata sandi baru untuk akun Anda.
                </Text>

                {Boolean(activeError) && (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={16} color="#DC2626" />
                    <Text style={styles.errorText}>{activeError}</Text>
                  </View>
                )}

                {/* New Password Input */}
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={19} color="#70A6FA" style={styles.inputIcon} />
                  <TextInput
                    value={newPassword}
                    onChangeText={(val) => {
                      setNewPassword(val);
                      if (localError) setLocalError(null);
                    }}
                    placeholder="Kata Sandi Baru (min. 6 karakter)"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={19}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={19} color="#70A6FA" style={styles.inputIcon} />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(val) => {
                      setConfirmPassword(val);
                      if (localError) setLocalError(null);
                    }}
                    placeholder="Konfirmasi Kata Sandi Baru"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={19}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>

                {/* Save Password Button */}
                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.disabledButton]}
                  activeOpacity={0.88}
                  onPress={handleSavePassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Simpan Kata Sandi</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* ================= STEP 4: SUCCESS ================= */}
            {step === 'SUCCESS' && (
              <View style={styles.successContainer}>
                <View style={styles.successIconBadge}>
                  <Ionicons name="checkmark-circle" size={48} color="#2B7BF6" />
                </View>

                <Text style={styles.formTitle}>Verifikasi Berhasil</Text>
                <Text style={styles.subtitle}>
                  Kata sandi baru akun Anda telah berhasil diperbarui dan tersimpan dengan aman.
                </Text>

                <TouchableOpacity
                  style={styles.primaryButton}
                  activeOpacity={0.88}
                  onPress={() => router.replace('/(auth)/login')}
                >
                  <Text style={styles.primaryButtonText}>Kembali ke Halaman Masuk</Text>
                </TouchableOpacity>
              </View>
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
    opacity: 0.65,
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
  emailPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 18,
    gap: 6,
    maxWidth: '90%',
  },
  emailPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    marginTop: 4,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: '#70A6FA',
    backgroundColor: '#FFFFFF',
  },
  otpBoxActive: {
    borderColor: '#2B7BF6',
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
  },
  otpDigitText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  hiddenOtpInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  resendSection: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  countdownHighlight: {
    color: '#2B7BF6',
    fontWeight: '700',
  },
  resendLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B7BF6',
    textDecorationLine: 'underline',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  successIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
