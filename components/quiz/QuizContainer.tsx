import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import { Ionicons } from '@expo/vector-icons';

interface QuizContainerProps {
  children: React.ReactNode;
  enableAntiScreenshot?: boolean;
}

export const QuizContainer: React.FC<QuizContainerProps> = ({
  children,
  enableAntiScreenshot = true,
}) => {
  useEffect(() => {
    let isMounted = true;

    async function activateSecurity() {
      if (enableAntiScreenshot && Platform.OS !== 'web') {
        try {
          // Mengaktifkan proteksi FLAG_SECURE mencegah perekaman layar & screenshot
          await ScreenCapture.preventScreenCaptureAsync();
        } catch (error) {
          console.warn('Gagal mengaktifkan anti-screenshot:', error);
        }
      }
    }

    activateSecurity();

    return () => {
      isMounted = false;
      if (enableAntiScreenshot && Platform.OS !== 'web') {
        // Kembalikan ke izin normal saat keluar dari layar kuis
        ScreenCapture.allowScreenCaptureAsync().catch(() => {});
      }
    };
  }, [enableAntiScreenshot]);

  return (
    <View style={styles.container}>
      {/* Security Shield Banner */}
      <View style={styles.securityBanner}>
        <Ionicons name="shield-checkmark" size={14} color="#059669" />
        <Text style={styles.securityText}>
          Mode Ujian Aman: Anti-Screenshot & Proteksi Soal Aktif
        </Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
    gap: 6,
  },
  securityText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
});
