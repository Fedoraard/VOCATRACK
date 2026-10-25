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

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background Decorative Circles */}
      <View style={styles.decorativeCircle} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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

        {/* Center 3D Characters Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/hero_students.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Bottom Action Buttons */}
        <View style={[styles.bottomCard, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity
            style={styles.logInButton}
            activeOpacity={0.85}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.logInButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            activeOpacity={0.85}
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
    paddingTop: 8,
    paddingBottom: 4,
  },
  logo: {
    width: 140,
    height: 32,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 6,
  },
  titleLine: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 38,
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
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  illustrationContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: height * 0.32,
    marginBottom: -1,
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logInButton: {
    backgroundColor: '#2B7BF6',
    borderRadius: 26,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
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
    borderColor: '#2B7BF6',
    marginTop: 12,
  },
  signUpButtonText: {
    color: '#2B7BF6',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
