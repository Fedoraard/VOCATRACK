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

      {/* Background Decorative Circle */}
      <View style={styles.decorativeCircle} />

      {/* Upper Blue Section */}
      <SafeAreaView style={styles.topSafeArea} edges={['top', 'left', 'right']}>
        {/* Top Brand Logo */}
        <View style={styles.topBar}>
          <Image
            source={require('../../assets/vocatrack_logo_white.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Heading Section */}
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

          {/* Prominent billowing clouds leading smoothly into the white bottom */}
          <View style={styles.cloudForeground}>
            <CloudHighlights height={85} fadeBottom={false} />
          </View>
        </View>
      </SafeAreaView>

      {/* Lower White Section with Action Buttons (Matching Image 1) */}
      <View style={[styles.whiteBottomSection, { paddingBottom: Math.max(insets.bottom, 20) + 12 }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F80ED',
  },
  decorativeCircle: {
    position: 'absolute',
    top: 80,
    left: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  topSafeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 4,
  },
  logo: {
    width: 140,
    height: 32,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 14,
    marginBottom: 4,
  },
  titleLine: {
    fontSize: 34,
    fontWeight: '800',
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
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.94)',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  illustrationContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    marginTop: 2,
  },
  heroImage: {
    width: width * 0.98,
    height: Math.min(height * 0.36, 275),
    zIndex: 2,
    marginBottom: -4,
  },
  cloudForeground: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  whiteBottomSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logInButton: {
    backgroundColor: '#2B7BF6',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  logInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2B7BF6',
    marginTop: 12,
  },
  signUpButtonText: {
    color: '#2B7BF6',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
