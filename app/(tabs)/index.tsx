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
import { ExerciseGraphCard } from '../../components/dashboard/ExerciseGraphCard';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Decorative gradient / sky background */}
      <View style={styles.topSkyGradient} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Card 1: Greeting & Progress */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeHeaderRow}>
              <View style={styles.welcomeTextCol}>
                <Text style={styles.greetingTitle}>
                  Halo <Text style={styles.userNameHighlight}>Galuh!</Text>
                </Text>
                <Text style={styles.userMajor}>
                  Teknik Instalasi Tenaga Listrik
                </Text>

                <Text style={styles.congratsText}>
                  Selamat! Kamu Sudah Menyelesaikan
                </Text>
                <View style={styles.materiCountRow}>
                  <Text style={styles.materiNumber}>25</Text>
                  <Text style={styles.materiLabel}>Materi</Text>
                </View>
              </View>

              <Image
                source={require('../../assets/galuh_avatar.png')}
                style={styles.avatarPhoto}
                resizeMode="cover"
              />
            </View>

            {/* Blue Progress Bar Container */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTextRow}>
                <Text style={styles.progressLabel}>Progress Pembelajaran:</Text>
                <Text style={styles.progressPercentage}>12%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={styles.progressBarFill} />
              </View>
            </View>

            {/* Action Button: Lanjut Belajar Yuk! */}
            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.88}
              onPress={() => router.push('/(tabs)/jurusan')}
            >
              <Text style={styles.continueButtonText}>Lanjut Belajar Yuk!</Text>
            </TouchableOpacity>
          </View>

          {/* Card 2: Smooth Curved Line Chart */}
          <ExerciseGraphCard />

          {/* Card 3: Rekomendasi Materi */}
          <View style={styles.recommendationCard}>
            <Text style={styles.recTitle}>Rekomendasi Materi</Text>
            <Text style={styles.recSubtitle}>
              3 Saran materi yang bisa kamu perbaiki.
            </Text>

            <TouchableOpacity
              style={styles.materialItem}
              activeOpacity={0.8}
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
    backgroundColor: '#EDF5FF',
  },
  topSkyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: '#3792FD',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  welcomeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  welcomeTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  userNameHighlight: {
    color: '#2B7BF6',
  },
  userMajor: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
    marginTop: 2,
    marginBottom: 6,
  },
  congratsText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  materiCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
    gap: 4,
  },
  materiNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },
  materiLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  avatarPhoto: {
    width: 78,
    height: 78,
    borderRadius: 14,
  },
  progressContainer: {
    backgroundColor: '#2B7BF6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '12%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  continueButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 22,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  recTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  recSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
    fontWeight: '500',
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  materialIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  materialDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
});
