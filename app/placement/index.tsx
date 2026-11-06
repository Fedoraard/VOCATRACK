import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PlacementService, PLACEMENT_INDICATORS } from '../../services/api/placementService';
import { PlacementIndicator, PlacementResult } from '../../types/contracts';
import { useAppStore } from '../../store/useAppStore';

/**
 * LAYAR PEMERIKSAAN KEMAMPUAN AWAL (T-52, F-02, CT-04)
 * 9 Indikator awal dengan opsi eksplisit "Belum Tahu".
 * Menentukan titik mulai belajar dan kelayakan evaluasi langsung.
 */

export default function PlacementScreen() {
  const insets = useSafeAreaInsets();
  const user = useAppStore((state) => state.user);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);

  const indicators = PLACEMENT_INDICATORS;
  const currentIndicator = indicators[currentIndex];

  const handleSelectOption = (indicatorId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [indicatorId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < indicators.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishPlacement();
    }
  };

  const handleFinishPlacement = async () => {
    try {
      setEvaluating(true);
      const studentId = user?.id || 'user-001';

      const payload = indicators.map((ind) => ({
        indicatorId: ind.id,
        selectedOptionIndex: answers[ind.id] !== undefined ? answers[ind.id] : -1,
      }));

      const res = await PlacementService.evaluatePlacement(studentId, payload);
      setResult(res);
    } catch (err: any) {
      Alert.alert('Gagal Memproses', err.message || 'Terjadi kesalahan.');
    } finally {
      setEvaluating(false);
    }
  };

  if (evaluating) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#2B7BF6" />
        <Text style={styles.centerTitle}>Menganalisis Kemampuan Awal Anda...</Text>
        <Text style={styles.centerSubtitle}>Menentukan peta rekomendasi belajar terbaik</Text>
      </View>
    );
  }

  // Tampilan Hasil Rekomendasi Titik Mulai
  if (result) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={[styles.resultHeader, { paddingTop: Math.max(insets.top, 16) + 10 }]}>
          <View style={styles.resultBadgeIcon}>
            <Ionicons name="sparkles" size={32} color="#2B7BF6" />
          </View>
          <Text style={styles.resultTitle}>Hasil Pemeriksaan Awal</Text>
          <Text style={styles.resultSubtitle}>
            Peta rekomendasi pembelajaran Anda telah disusun berdasarkan analisis 9 indikator.
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
        >
          {/* Card Rekomendasi Titik Mulai */}
          <View style={styles.startPointCard}>
            <Text style={styles.startPointLabel}>Rekomendasi Titik Mulai Belajar</Text>
            <View style={styles.startPointModuleRow}>
              <View style={styles.startPointPill}>
                <Text style={styles.startPointPillText}>{result.rekomendasiTitikMulaiModuleId}</Text>
              </View>
              <Text style={styles.startPointNote}>{result.summaryNote}</Text>
            </View>
          </View>

          {/* Card Kelayakan Evaluasi Langsung */}
          <View style={styles.eligibleCard}>
            <View style={styles.eligibleHeader}>
              <Ionicons name="flash-outline" size={20} color="#16A34A" />
              <Text style={styles.eligibleTitle}>Kelayakan Evaluasi Langsung</Text>
            </View>
            <Text style={styles.eligibleDesc}>
              Berdasarkan jawaban Anda, modul berikut dinilai layak untuk langsung diambil evaluasi resminya tanpa harus menyelesaikan seluruh video:
            </Text>

            {result.eligibleDirectEvaluationModuleIds.length > 0 ? (
              <View style={styles.eligibleList}>
                {result.eligibleDirectEvaluationModuleIds.map((mId) => (
                  <View key={mId} style={styles.eligibleItemPill}>
                    <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                    <Text style={styles.eligibleItemText}>Modul {mId}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noEligibleText}>
                Belum ada modul yang memenuhi kelayakan lompat langsung. Ikuti jalur belajar terarah dari fondasi dasar.
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.goToLearningBtn}
            activeOpacity={0.88}
            onPress={() => router.replace(`/materi/${result.rekomendasiTitikMulaiModuleId}`)}
          >
            <Text style={styles.goToLearningBtnText}>
              Mulai Belajar di Modul {result.rekomendasiTitikMulaiModuleId}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.goToTreeBtn}
            activeOpacity={0.88}
            onPress={() => router.replace('/(tabs)/jurusan')}
          >
            <Ionicons name="git-network-outline" size={18} color="#2B7BF6" />
            <Text style={styles.goToTreeBtnText}>Lihat Peta Skill-Tree 3 Profesi</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Tampilan Pertanyaan 1 s.d. 9
  const currentAnswer = answers[currentIndicator.id];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Pemeriksaan Awal (9 Indikator)</Text>
          <Text style={styles.headerStep}>
            Indikator {currentIndex + 1} dari {indicators.length}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            { width: `${((currentIndex + 1) / indicators.length) * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 70 }]}
      >
        <View style={styles.indicatorBadgeRow}>
          <View style={styles.indicatorPill}>
            <Text style={styles.indicatorPillText}>Indikator #{currentIndex + 1}</Text>
          </View>
          <Text style={styles.indicatorModuleText}>{currentIndicator.moduleTitle}</Text>
        </View>

        <Text style={styles.indicatorQuestion}>{currentIndicator.pertanyaan}</Text>

        {/* 4 Pilihan Jawaban Standar */}
        <View style={styles.optionsList}>
          {currentIndicator.pilihan.map((pilihan, optIdx) => {
            const isSelected = currentAnswer === optIdx;
            return (
              <TouchableOpacity
                key={optIdx}
                activeOpacity={0.8}
                style={[styles.optBtn, isSelected && styles.optBtnSelected]}
                onPress={() => handleSelectOption(currentIndicator.id, optIdx)}
              >
                <View style={[styles.optRadio, isSelected && styles.optRadioSelected]}>
                  <Text style={[styles.optRadioText, isSelected && styles.optRadioTextSelected]}>
                    {String.fromCharCode(65 + optIdx)}
                  </Text>
                </View>
                <Text style={[styles.optText, isSelected && styles.optTextSelected]}>
                  {pilihan}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* OPSI EKSPLISIT: "BELUM TAHU" (F-02) */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.optUnknownBtn, currentAnswer === -1 && styles.optUnknownBtnSelected]}
            onPress={() => handleSelectOption(currentIndicator.id, -1)}
          >
            <View style={[styles.optUnknownRadio, currentAnswer === -1 && styles.optUnknownRadioSelected]}>
              <Ionicons
                name="help"
                size={16}
                color={currentAnswer === -1 ? '#FFFFFF' : '#64748B'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.optUnknownText, currentAnswer === -1 && styles.optUnknownTextSelected]}>
                Saya Belum Tahu / Belum Pernah Mempelajari Ini
              </Text>
              <Text style={styles.optUnknownSub}>
                Memilih ini membantu kami merekomendasikan materi mulai dari dasar.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.navBackBtn, currentIndex === 0 && styles.navBackBtnDisabled]}
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
        >
          <Ionicons name="arrow-back" size={18} color={currentIndex === 0 ? '#94A3B8' : '#2B7BF6'} />
          <Text style={[styles.navBackBtnText, currentIndex === 0 && styles.navBackBtnTextDisabled]}>
            Sebelumnya
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navNextBtn, currentAnswer === undefined && styles.navNextBtnDisabled]}
          disabled={currentAnswer === undefined}
          onPress={handleNext}
        >
          <Text style={styles.navNextBtnText}>
            {currentIndex === indicators.length - 1 ? 'Selesai & Analisis' : 'Selanjutnya'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  centerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
  },
  centerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerStep: {
    fontSize: 12,
    color: '#2B7BF6',
    fontWeight: '600',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2B7BF6',
  },
  scrollContent: {
    padding: 16,
  },
  indicatorBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  indicatorPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  indicatorPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2B7BF6',
  },
  indicatorModuleText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  indicatorQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 23,
    marginBottom: 20,
  },
  optionsList: {
    gap: 10,
  },
  optBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  optBtnSelected: {
    borderColor: '#2B7BF6',
    backgroundColor: '#EFF6FF',
  },
  optRadio: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optRadioSelected: {
    backgroundColor: '#2B7BF6',
  },
  optRadioText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  optRadioTextSelected: {
    color: '#FFFFFF',
  },
  optText: {
    fontSize: 13.5,
    color: '#1E293B',
    flex: 1,
    lineHeight: 19,
  },
  optTextSelected: {
    fontWeight: '700',
    color: '#1E40AF',
  },
  optUnknownBtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginTop: 6,
  },
  optUnknownBtnSelected: {
    borderColor: '#64748B',
    backgroundColor: '#F1F5F9',
  },
  optUnknownRadio: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  optUnknownRadioSelected: {
    backgroundColor: '#475569',
  },
  optUnknownText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  optUnknownTextSelected: {
    color: '#0F172A',
  },
  optUnknownSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  navBackBtnDisabled: {
    borderColor: '#F1F5F9',
  },
  navBackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  navBackBtnTextDisabled: {
    color: '#94A3B8',
  },
  navNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2B7BF6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navNextBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  navNextBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  resultBadgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: '90%',
  },
  startPointCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 14,
  },
  startPointLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  startPointModuleRow: {
    gap: 8,
  },
  startPointPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#2B7BF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  startPointPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  startPointNote: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 19,
  },
  eligibleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  eligibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  eligibleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  eligibleDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 12,
  },
  eligibleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  eligibleItemPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  eligibleItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  noEligibleText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  goToLearningBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2B7BF6',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  goToLearningBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  goToTreeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 14,
    borderRadius: 12,
  },
  goToTreeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B7BF6',
  },
});

