import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RecommendationService } from '../../services/api/recommendationService';
import { RecommendationSnapshot, CareerScoreResult } from '../../types/contracts';
import { useAppStore } from '../../store/useAppStore';

/**
 * LAYAR REKOMENDASI 3 PROFESI (T-54, F-09, PP-03)
 * Menampilkan:
 * 1. Peringkat SAW 3 Profesi (Frontend, Backend, Mobile).
 * 2. Transparansi faktor bukti (30% Fondasi, 70% Modul Pengantar Profesi).
 * 3. Status kelengkapan bukti (minimal 6 modul inti terjawab >= 6 soal).
 * 4. Penanganan skor seri dan penguatan jika semua skor < 70.
 */

export default function RecommendationScreen() {
  const insets = useSafeAreaInsets();
  const user = useAppStore((state) => state.user);
  const setTargetCareer = useAppStore((state) => state.setTargetCareer);

  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<RecommendationSnapshot | null>(null);

  useEffect(() => {
    async function loadRec() {
      try {
        setLoading(true);
        const studentId = user?.id || 'user-001';
        const res = await RecommendationService.calculateRecommendation(studentId);
        setSnapshot(res);
      } catch (err) {
        console.error('Error calculating recommendation:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRec();
  }, [user]);

  if (loading || !snapshot) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#2B7BF6" />
        <Text style={styles.loadingText}>Menganalisis matriks kompetensi SAW...</Text>
      </View>
    );
  }

  const handleSelectRecommendation = (career: CareerScoreResult) => {
    setTargetCareer(career.careerId);
    router.replace('/(tabs)/skilltree');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Bar */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerSubtitle}>Model Rekomendasi SAW</Text>
          <Text style={styles.headerTitle}>Rekomendasi 3 Profesi RPL</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 32 },
        ]}
      >
        {/* Banner Bukti Kompetensi (Coverage Check) */}
        {!snapshot.isEligible ? (
          <View style={styles.warningBanner}>
            <Ionicons name="alert-circle" size={24} color="#D97706" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.warningBannerTitle}>Bukti Evaluasi Belum Lengkap</Text>
              <Text style={styles.warningBannerText}>
                {snapshot.interpretationNote}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.eligibleBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.eligibleBannerTitle}>Bukti Terverifikasi</Text>
              <Text style={styles.eligibleBannerText}>
                Seluruh 6 modul inti (FND-01..03, FE-01, BE-01, MO-01) telah memenuhi batas minimal evaluasi resmi.
              </Text>
            </View>
          </View>
        )}

        {/* Status Skor Seri atau Skor Rendah */}
        {snapshot.isTieScore && (
          <View style={styles.tieBanner}>
            <Ionicons name="git-compare-outline" size={20} color="#2563EB" />
            <Text style={styles.tieBannerText}>
              Terdeteksi Skor Seri: Potensi bakat Anda seimbang pada lebih dari satu profesi.
            </Text>
          </View>
        )}

        {snapshot.isAllScoresLow && snapshot.isEligible && (
          <View style={styles.lowScoreBanner}>
            <Ionicons name="school-outline" size={20} color="#DC2626" />
            <Text style={styles.lowScoreBannerText}>
              Seluruh skor pengantar saat ini berada di bawah batas kompetensi 70. Prioritaskan penguatan materi fondasi.
            </Text>
          </View>
        )}

        {/* Daftar Kartu Peringkat 3 Profesi */}
        <Text style={styles.sectionHeaderTitle}>Peringkat Kesesuaian Profesi</Text>

        <View style={styles.careerListCol}>
          {snapshot.careerResults.map((career) => {
            const isTopRank = career.rank === 1;
            return (
              <View
                key={career.careerId}
                style={[styles.careerCard, isTopRank && styles.careerCardTop]}
              >
                {/* Header Card */}
                <View style={styles.cardHeaderRow}>
                  <View
                    style={[
                      styles.rankPill,
                      isTopRank ? styles.rankPillTop : styles.rankPillNormal,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rankPillText,
                        isTopRank ? styles.rankPillTextTop : styles.rankPillTextNormal,
                      ]}
                    >
                      Peringkat #{career.rank}
                    </Text>
                  </View>

                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreNum}>{career.score}</Text>
                    <Text style={styles.scoreScale}>/100</Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.careerTitle}>{career.careerTitle}</Text>

                {/* Factor Breakdown */}
                <View style={styles.factorsBox}>
                  <Text style={styles.factorsHeader}>Faktor Pendukung SAW:</Text>
                  {career.supportingFactors.map((f, fIdx) => (
                    <Text key={fIdx} style={styles.factorItem}>
                      • {f}
                    </Text>
                  ))}
                </View>

                {/* Choose button */}
                <TouchableOpacity
                  style={[
                    styles.chooseCareerBtn,
                    isTopRank ? styles.chooseCareerBtnTop : styles.chooseCareerBtnNormal,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelectRecommendation(career)}
                >
                  <Text
                    style={[
                      styles.chooseCareerBtnText,
                      isTopRank && styles.chooseCareerBtnTextTop,
                    ]}
                  >
                    {isTopRank ? 'Pilih Jalur Rekomendasi Utama' : 'Pilih Jalur Ini'}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={isTopRank ? '#FFFFFF' : '#2B7BF6'}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Rekomendasi Langkah Belajar Selanjutnya */}
        <View style={styles.stepsCard}>
          <View style={styles.stepsHeader}>
            <Ionicons name="trail-sign-outline" size={22} color="#2B7BF6" />
            <Text style={styles.stepsTitle}>Rekomendasi Langkah Penguatan</Text>
          </View>

          <View style={styles.stepsList}>
            {snapshot.nextRecommendedSteps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepDesc}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 2,
  },
  warningBannerText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
  },
  eligibleBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  eligibleBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
    marginBottom: 2,
  },
  eligibleBannerText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
  },
  tieBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tieBannerText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
    flex: 1,
  },
  lowScoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  lowScoreBannerText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
    flex: 1,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  careerListCol: {
    gap: 14,
  },
  careerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  careerCardTop: {
    borderColor: '#2B7BF6',
    backgroundColor: '#FFFFFF',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rankPillTop: {
    backgroundColor: '#EFF6FF',
  },
  rankPillNormal: {
    backgroundColor: '#F1F5F9',
  },
  rankPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  rankPillTextTop: {
    color: '#2B7BF6',
  },
  rankPillTextNormal: {
    color: '#64748B',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNum: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  scoreScale: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
  },
  careerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  factorsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    gap: 4,
  },
  factorsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 2,
  },
  factorItem: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  chooseCareerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    paddingVertical: 12,
  },
  chooseCareerBtnTop: {
    backgroundColor: '#2B7BF6',
  },
  chooseCareerBtnNormal: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  chooseCareerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  chooseCareerBtnTextTop: {
    color: '#FFFFFF',
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepsList: {
    gap: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2B7BF6',
  },
  stepDesc: {
    fontSize: 12.5,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
});

