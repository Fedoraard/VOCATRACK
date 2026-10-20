import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';

export default function DashboardScreen() {
  const user = useAppStore((state) => state.user);
  const jurusanList = useAppStore((state) => state.jurusanList);
  const selectedJurusanId = useAppStore((state) => state.selectedJurusanId);
  const setSelectedJurusanId = useAppStore((state) => state.setSelectedJurusanId);

  const currentJurusan =
    jurusanList.find((j) => j.id === selectedJurusanId) || jurusanList[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Bar: Profile Greeting & XP Level */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetingText}>Halo, Siswa Vokasi 👋</Text>
            <Text style={styles.userName}>
              {user?.namaLengkap || 'Ahmad Faiz Al-Rasyid'}
            </Text>
            <Text style={styles.schoolName}>
              {user?.asalSekolah || 'SMKN 1 Cimahi'}
            </Text>
          </View>

          <View style={styles.levelBadge}>
            <View style={styles.xpRow}>
              <Ionicons name="flash" size={14} color="#F59E0B" />
              <Text style={styles.xpText}>{user?.totalXp || 850} XP</Text>
            </View>
            <Text style={styles.levelText}>Level {user?.level || 3}</Text>
          </View>
        </View>

        {/* Active Track Card: Resume Learning */}
        <View style={styles.activeTrackCard}>
          <View style={styles.activeTrackHeader}>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>SEDANG DIPELAJARI</Text>
            </View>
            <Text style={styles.trackCode}>{currentJurusan.kode}</Text>
          </View>

          <Text style={styles.trackTitle}>{currentJurusan.nama}</Text>
          <Text style={styles.trackDesc}>
            {currentJurusan.deskripsi}
          </Text>

          <View style={styles.trackStatsRow}>
            <View style={styles.trackStatItem}>
              <Ionicons name="layers-outline" size={16} color="#6366F1" />
              <Text style={styles.trackStatText}>
                {currentJurusan.modulSelesai}/{currentJurusan.totalModul} Modul Selesai
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/skilltree')}
            style={styles.resumeButton}
          >
            <Text style={styles.resumeButtonText}>Buka Peta Keahlian</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* SAW Recommendation Section (SCR-06) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Rekomendasi Karir Vokasi (SAW)</Text>
            <Text style={styles.sectionSubtitle}>
              Dihitung berdasarkan Minat, Nilai Akademik & Peluang Industri
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/jurusan')}>
            <Text style={styles.seeAllText}>Semua →</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal SAW Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sawScroll}
        >
          {jurusanList.slice(0, 3).map((jurusan, index) => (
            <TouchableOpacity
              key={jurusan.id}
              activeOpacity={0.88}
              onPress={() => {
                setSelectedJurusanId(jurusan.id);
                router.push('/(tabs)/skilltree');
              }}
              style={styles.sawCard}
            >
              <View style={styles.sawBadgeRow}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1} Cocok</Text>
                </View>
                <Text style={styles.scoreText}>{jurusan.tingkatKecocokan}%</Text>
              </View>

              <Text style={styles.sawTitle}>{jurusan.nama}</Text>
              <Text style={styles.sawCategory}>{jurusan.kategori}</Text>

              <View style={styles.careerList}>
                {jurusan.peluangKarir.slice(0, 2).map((karir, i) => (
                  <Text key={i} style={styles.sawCareerItem}>
                    • {karir}
                  </Text>
                ))}
              </View>

              <View style={styles.sawFooter}>
                <Text style={styles.exploreText}>Jelajahi Kurikulum</Text>
                <Ionicons name="chevron-forward" size={14} color="#4F46E5" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* VocaBot Floating Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/vocabot')}
          style={styles.vocaBotBanner}
        >
          <View style={styles.vocaBotIcon}>
            <Ionicons name="sparkles" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.vocaBotContent}>
            <Text style={styles.vocaBotTitle}>Konsultasi dengan VocaBot AI</Text>
            <Text style={styles.vocaBotDesc}>
              Bingung memilih peminatan atau butuh penjelasan materi bab? Tanya sekarang.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  schoolName: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  levelBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 2,
  },
  activeTrackCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  activeTrackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeTag: {
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeTagText: {
    color: '#A5B4FC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  trackCode: {
    color: '#06B6D4',
    fontSize: 13,
    fontWeight: '800',
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  trackDesc: {
    fontSize: 13,
    color: '#C7D2FE',
    lineHeight: 18,
    marginBottom: 14,
  },
  trackStatsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  trackStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trackStatText: {
    color: '#E0E7FF',
    fontSize: 12,
    fontWeight: '600',
  },
  resumeButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '700',
  },
  sawScroll: {
    gap: 12,
    paddingBottom: 16,
  },
  sawCard: {
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sawBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  rankText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '700',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  sawTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  sawCategory: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  careerList: {
    marginBottom: 12,
    gap: 2,
  },
  sawCareerItem: {
    fontSize: 11,
    color: '#475569',
  },
  sawFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  exploreText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '700',
  },
  vocaBotBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    marginTop: 10,
    gap: 12,
  },
  vocaBotIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vocaBotContent: {
    flex: 1,
  },
  vocaBotTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  vocaBotDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
});
