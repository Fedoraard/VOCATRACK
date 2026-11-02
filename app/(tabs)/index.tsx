import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { ExerciseGraphCard } from '../../components/dashboard/ExerciseGraphCard';
import { useAppStore } from '../../store/useAppStore';

export default function DashboardScreen() {
  const user = useAppStore((state) => state.user);

  // Match the Figma reference image exact details:
  // "Halo Galuh!", "Teknik Instalasi Tenaga Listrik", "25 Materi", "12%", "Lanjut Belajar Yuk!"
  const displayName = user?.namaLengkap && user.namaLengkap !== 'DIVA WAHYU' ? user.namaLengkap : 'Galuh';
  const displayMajor =
    user?.jurusanDiminati && user.jurusanDiminati !== 'Teknik Komputer Jaringan'
      ? user.jurusanDiminati
      : 'Teknik Instalasi Tenaga Listrik';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Atmospheric Sky Blue Background Gradient matching Figma */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgLinearGradient id="bgSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#3A93FD" />
            <Stop offset="45%" stopColor="#5CA8FD" />
            <Stop offset="100%" stopColor="#96CBFD" />
          </SvgLinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgSkyGrad)" />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Card 1: Greeting & Progress (Soft Light Blue Card) */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeHeaderRow}>
              <View style={styles.welcomeTextCol}>
                <Text style={styles.greetingTitle}>
                  Halo <Text style={styles.userNameHighlight}>{displayName}!</Text>
                </Text>
                <Text style={styles.userMajor}>{displayMajor}</Text>

                <Text style={styles.congratsText}>
                  Selamat! Kamu Sudah Menyelsaikan
                </Text>
                <View style={styles.materiCountRow}>
                  <Text style={styles.materiNumber}>25</Text>
                  <Text style={styles.materiLabel}>Materi</Text>
                </View>
              </View>

              {/* Student Photo */}
              <Image
                source={
                  user?.fotoProfil
                    ? { uri: user.fotoProfil }
                    : require('../../assets/galuh_avatar.png')
                }
                style={styles.avatarPhoto}
                resizeMode="cover"
              />
            </View>

            {/* Blue Progress Bar Container (Generous & Prominent) */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTextRow}>
                <Text style={styles.progressLabel}>Progress Pembelajaran:</Text>
                <Text style={styles.progressPercentage}>12%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '18%' }]} />
              </View>
            </View>

            {/* Golden Orange Action Button (More compact than progress box) */}
            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.88}
              onPress={() => router.push('/(tabs)/jurusan')}
            >
              <Text style={styles.continueButtonText}>Lanjut Belajar Yuk!</Text>
            </TouchableOpacity>
          </View>

          {/* Card 2: Smooth Curved Line Chart */}
          <ExerciseGraphCard hasData={true} />

          {/* Card 3: Rekomendasi Materi (Soft Light Blue Card) */}
          <View style={styles.recommendationCard}>
            <Text style={styles.recTitle}>Rekomendasi Materi</Text>
            <Text style={styles.recSubtitle}>
              3 Saran materi yang bisa kamu perbaiki.
            </Text>

            <TouchableOpacity
              style={styles.materialItem}
              activeOpacity={0.85}
              onPress={() => router.push('/materi/fisika-dasar')}
            >
              <Image
                source={require('../../assets/fisika_icon.png')}
                style={styles.materialIcon}
                resizeMode="cover"
              />
              <View style={styles.materialInfo}>
                <Text style={styles.materialTitle}>Fisika</Text>
                <Text style={styles.materialDesc}>
                  Ya Itulah Intinya Ya Itulah Intinya
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A93FD',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 95,
  },
  welcomeCard: {
    backgroundColor: '#EBF4FE',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  welcomeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  welcomeTextCol: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  greetingTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  userNameHighlight: {
    color: '#2B7BF6',
  },
  userMajor: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2B7BF6',
    marginTop: 2,
    marginBottom: 8,
  },
  congratsText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
    marginBottom: 3,
  },
  materiCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  materiNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 40,
  },
  materiLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  avatarPhoto: {
    width: 106,
    height: 106,
    borderRadius: 22,
  },
  progressContainer: {
    backgroundColor: '#2575FC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  continueButton: {
    backgroundColor: '#F39200',
    borderRadius: 20,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F39200',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  recommendationCard: {
    backgroundColor: '#EBF4FE',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  recTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  recSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
    fontWeight: '500',
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  materialIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  materialDesc: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
});
