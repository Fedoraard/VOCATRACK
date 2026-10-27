import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloudHighlights } from '../../components/common/CloudHighlights';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background Decorative Circles */}
      <View style={styles.decorativeCircle} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Brand Logo - Shifted downward */}
        <View style={styles.topBar}>
          <Image
            source={require('../../assets/vocatrack_logo_white.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Heading Section - Centered in upper area */}
        <View style={styles.headerSection}>
          <Text style={styles.titleLine}>Temukan Jalur</Text>
          <Text style={styles.titleLine}>Karier dari</Text>

          <View style={styles.jurusanRow}>
            {/* Left accent lines */}
            <View style={styles.accentGroup}>
              <View style={[styles.accentLine, styles.accentLineTopLeft]} />
              <View style={[styles.accentLine, styles.accentLineBottomLeft]} />
            </View>

            <Text style={styles.jurusanText}>Jurusanmu</Text>

            {/* Right accent lines */}
            <View style={styles.accentGroup}>
              <View style={[styles.accentLine, styles.accentLineTopRight]} />
              <View style={[styles.accentLine, styles.accentLineBottomRight]} />
            </View>
          </View>

          <Text style={styles.subtitle}>
            VocaTrack membantu kamu memahami peluang karier, skill yang dibutuhkan,
            dan langkah belajar berdasarkan jurusan yang kamu pilih.
          </Text>
        </View>

        {/* Center 3D Characters with Foreground Prominent Clouds */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/hero_students.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />

          {/* Prominent billowing clouds placed IN FRONT of avatar */}
          <View style={styles.cloudForeground}>
            <CloudHighlights height={115} fadeBottom={true} />
          </View>
        </View>

        {/* Bottom Action Buttons (Directly on Blue Background) */}
        <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 22) + 6 }]}>
          <TouchableOpacity
            style={styles.logInButton}
            activeOpacity={0.88}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.logInButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            activeOpacity={0.88}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3792FD',
  },
  decorativeCircle: {
    position: 'absolute',
    top: 90,
    left: -100,
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 4,
  },
  logo: {
    width: 145,
    height: 33,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 8,
  },
  titleLine: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 40,
    textAlign: 'center',
  },
  jurusanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    gap: 8,
  },
  accentGroup: {
    justifyContent: 'center',
    gap: 5,
  },
  accentLine: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 2,
  },
  accentLineTopLeft: {
    width: 14,
    transform: [{ rotate: '15deg' }],
  },
  accentLineBottomLeft: {
    width: 16,
    transform: [{ rotate: '15deg' }],
  },
  accentLineTopRight: {
    width: 14,
    transform: [{ rotate: '-15deg' }],
  },
  accentLineBottomRight: {
    width: 16,
    transform: [{ rotate: '-15deg' }],
  },
  jurusanText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.94)',
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  illustrationContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: -8,
  },
  heroImage: {
    width: width * 0.96,
    height: Math.min(height * 0.35, 275),
    zIndex: 2,
    marginBottom: 6,
  },
  cloudForeground: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 6,
    backgroundColor: 'transparent',
  },
  logInButton: {
    backgroundColor: '#2563EB',
    borderRadius: 26,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2563EB',
    marginTop: 12,
  },
  signUpButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
