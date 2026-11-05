import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AssessmentService } from '../../services/api/assessmentService';
import { CurriculumService } from '../../services/api/curriculumService';
import { OfficialResult, ModuleVersion } from '../../types/contracts';
import { useAppStore } from '../../store/useAppStore';

/**
 * LAYAR HASIL EVALUASI RESMI & PEMBAHASAN (T-29)
 * Memenuhi kriteria:
 * 1. Menampilkan skor resmi dari server (bukan hitungan klien).
 * 2. Membedakan kelulusan historis (pernah >= 70) vs nilai terbaru.
 * 3. Menampilkan riwayat percobaan dan pembahasan lengkap per butir soal.
 * 4. Menyajikan rekomendasi langkah belajar berikutnya.
 */

export default function AssessmentResultScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ attemptId?: string; moduleId?: string }>();
  const user = useAppStore((state) => state.user);

  const moduleId = (params.moduleId || 'FE-01').toUpperCase();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<OfficialResult | null>(null);
  const [moduleInfo, setModuleInfo] = useState<ModuleVersion | null>(null);
  const [historicalStatus, setHistoricalStatus] = useState<{
    hasPassedHistorically: boolean;
    highestScore: number;
    totalAttempts: number;
  }>({ hasPassedHistorically: false, highestScore: 0, totalAttempts: 1 });
  const [showExplanations, setShowExplanations] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      try {
        setLoading(true);
        const studentId = user?.id || 'user-001';

        const [history, mod, evalStatus] = await Promise.all([
          AssessmentService.getModuleResultHistory(studentId, moduleId),
          CurriculumService.getModuleById(moduleId),
          AssessmentService.getModuleEvaluationStatus(studentId, moduleId),
        ]);

        if (mod) setModuleInfo(mod);
        setHistoricalStatus({
          hasPassedHistorically: evalStatus.hasPassedHistorically,
          highestScore: evalStatus.highestScore,
          totalAttempts: evalStatus.totalAttempts,
        });

        // Cari result yang sesuai dengan attemptId, atau ambil yang terbaru
        if (params.attemptId) {
          const match = history.find((r) => r.attemptId === params.attemptId);
          setResult(match || (history.length > 0 ? history[history.length - 1] : null));
        } else if (history.length > 0) {
          setResult(history[history.length - 1]);
        }
      } catch (err) {
        console.error('Error fetching result:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [moduleId, params.attemptId, user]);

  if (loading || !result) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#2B7BF6" />
        <Text style={styles.loadingText}>Memuat hasil penilaian resmi...</Text>
      </View>
    );
  }

  const isPassed = result.isPassed;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header Banner */}
      <View
        style={[
          styles.headerBanner,
          { paddingTop: Math.max(insets.top, 16) + 10 },
          isPassed ? styles.headerBannerPass : styles.headerBannerFail,
        ]}
      >
        <TouchableOpacity
          style={styles.closeHeaderBtn}
          onPress={() => router.replace(`/materi/${moduleId}`)}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreNumber, isPassed ? styles.scorePass : styles.scoreFail]}>
            {result.score}
          </Text>
          <Text style={styles.scoreScale}>/ 100</Text>
        </View>

        <View style={styles.statusBadge}>
          <Ionicons
            name={isPassed ? 'checkmark-circle' : 'alert-circle'}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.statusBadgeText}>
            {isPassed ? 'KOMPETEN (LULUS RESMI)' : 'BELUM MEMENUHI AMBANG (>= 70)'}
          </Text>
        </View>

        <Text style={styles.headerSubtitle}>
          {isPassed
            ? 'Selamat! Anda telah menguasai kompetensi modul ini secara resmi.'
            : 'Jangan berkecil hati. Pelajari kembali materi dan coba evaluasi lagi.'}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
      >
        {/* Module Title Card */}
        <View style={styles.card}>
          <Text style={styles.cardModulePill}>Modul {moduleId}</Text>
          <Text style={styles.cardTitle}>{moduleInfo?.title || `Modul ${moduleId}`}</Text>
          <Text style={styles.cardDesc}>{moduleInfo?.subtitle}</Text>

          {/* Distinction: Historical Pass vs Latest Score (T-29) */}
          <View style={styles.historyComparisonRow}>
            <View style={styles.compItem}>
              <Text style={styles.compLabel}>Percobaan Ini</Text>
              <Text style={[styles.compValue, isPassed ? styles.textSuccess : styles.textDanger]}>
                {result.score} Poin
              </Text>
              <Text style={styles.compSub}>Percobaan #{result.attemptSequence}</Text>
            </View>

            <View style={styles.compDivider} />

            <View style={styles.compItem}>
              <Text style={styles.compLabel}>Status Historis</Text>
              <Text
                style={[
                  styles.compValue,
                  historicalStatus.hasPassedHistorically ? styles.textSuccess : styles.textDanger,
                ]}
              >
                {historicalStatus.hasPassedHistorically ? 'Pernah Lulus' : 'Belum Lulus'}
              </Text>
              <Text style={styles.compSub}>Nilai Tertinggi: {historicalStatus.highestScore}</Text>
            </View>
          </View>
        </View>

        {/* Statistics Breakdown */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="checkmark-done" size={20} color="#16A34A" />
            <Text style={styles.statNum}>{result.correctAnswersCount}</Text>
            <Text style={styles.statLabel}>Benar</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="close" size={20} color="#DC2626" />
            <Text style={styles.statNum}>
              {result.totalQuestions - result.correctAnswersCount}
            </Text>
            <Text style={styles.statLabel}>Salah</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="list" size={20} color="#2B7BF6" />
            <Text style={styles.statNum}>{result.answeredCount}</Text>
            <Text style={styles.statLabel}>Terjawab</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="speedometer-outline" size={20} color="#8B5CF6" />
            <Text style={styles.statNum}>{result.totalQuestions}</Text>
            <Text style={styles.statLabel}>Total Soal</Text>
          </View>
        </View>

        {/* Next Recommended Steps Card */}
        <View style={styles.nextStepsCard}>
          <View style={styles.nextStepsHeader}>
            <Ionicons name="compass-outline" size={22} color="#2B7BF6" />
            <Text style={styles.nextStepsTitle}>Langkah Belajar Selanjutnya</Text>
          </View>
          {isPassed ? (
            <View style={styles.stepsList}>
              <Text style={styles.stepItem}>
                • Prasyarat modul berikutnya telah terbuka. Anda dapat melanjutkan eksplorasi ke modul spesialisasi berikutnya.
              </Text>
              <Text style={styles.stepItem}>
                • Periksa rekomendasi 3 profesi untuk melihat kontribusi nilai ini terhadap skor keahlian Anda.
              </Text>
            </View>
          ) : (
            <View style={styles.stepsList}>
              <Text style={styles.stepItem}>
                • Buka tab pembahasan di bawah untuk memahami konsep dan kunci jawaban yang kurang tepat.
              </Text>
              <Text style={styles.stepItem}>
                • Tonton kembali segmen video pembelajaran yang belum sepenuhnya dipahami.
              </Text>
              <Text style={styles.stepItem}>
                • Anda dapat mengulang evaluasi resmi kapan saja untuk memperbarui nilai.
              </Text>
            </View>
          )}
        </View>

        {/* Toggle Pembahasan Soal */}
        <TouchableOpacity
          style={styles.toggleExplanationsBtn}
          activeOpacity={0.8}
          onPress={() => setShowExplanations(!showExplanations)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="document-text-outline" size={20} color="#2B7BF6" />
            <Text style={styles.toggleExplanationsText}>
              {showExplanations ? 'Sembunyikan Pembahasan Soal' : 'Lihat Pembahasan 20 Soal'}
            </Text>
          </View>
          <Ionicons
            name={showExplanations ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#2B7BF6"
          />
        </TouchableOpacity>

        {/* Pembahasan Detail Per Soal */}
        {showExplanations && (
          <View style={styles.explanationsContainer}>
            {result.explanations.map((exp, idx) => (
              <View
                key={exp.questionInstanceId}
                style={[
                  styles.expCard,
                  exp.isCorrect ? styles.expCardCorrect : styles.expCardWrong,
                ]}
              >
                <View style={styles.expHeader}>
                  <View style={styles.expNumBadge}>
                    <Text style={styles.expNumText}>#{exp.orderNumber}</Text>
                  </View>
                  <View
                    style={[
                      styles.expStatusPill,
                      exp.isCorrect ? styles.expStatusCorrect : styles.expStatusWrong,
                    ]}
                  >
                    <Ionicons
                      name={exp.isCorrect ? 'checkmark-circle' : 'close-circle'}
                      size={14}
                      color="#FFFFFF"
                    />
                    <Text style={styles.expStatusText}>
                      {exp.isCorrect ? 'Benar' : 'Salah'}
                    </Text>
                  </View>
                </View>

                <View style={styles.answerComparisonBox}>
                  <Text style={styles.ansText}>
                    Jawaban Anda:{' '}
                    <Text style={{ fontWeight: '700' }}>
                      {exp.userAnswerIndex !== null
                        ? `Pilihan ${String.fromCharCode(65 + exp.userAnswerIndex)}`
                        : 'Tidak Dijawab'}
                    </Text>
                  </Text>
                  <Text style={styles.ansText}>
                    Kunci Resmi:{' '}
                    <Text style={{ fontWeight: '700', color: '#16A34A' }}>
                      Pilihan {String.fromCharCode(65 + exp.kunciJawabanIndex)}
                    </Text>
                  </Text>
                </View>

                <Text style={styles.expTitle}>Penjelasan:</Text>
                <Text style={styles.expBody}>{exp.explanationText}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsCol}>
          <TouchableOpacity
            style={styles.actionPrimaryBtn}
            activeOpacity={0.85}
            onPress={() => router.replace(`/materi/${moduleId}`)}
          >
            <Ionicons name="book-outline" size={18} color="#FFFFFF" />
            <Text style={styles.actionPrimaryBtnText}>Kembali ke Materi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionSecondaryBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/recommendation')}
          >
            <Ionicons name="podium-outline" size={18} color="#2B7BF6" />
            <Text style={styles.actionSecondaryBtnText}>Lihat Rekomendasi Karir 3 Profesi</Text>
          </TouchableOpacity>
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
    fontSize: 14,
    color: '#64748B',
  },
  headerBanner: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
    position: 'relative',
  },
  headerBannerPass: {
    backgroundColor: '#0F766E', // Teal / Green
  },
  headerBannerFail: {
    backgroundColor: '#991B1B', // Dark Red
  },
  closeHeaderBtn: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: '900',
  },
  scorePass: {
    color: '#0F766E',
  },
  scoreFail: {
    color: '#DC2626',
  },
  scoreScale: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: -4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 18,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardModulePill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  historyComparisonRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  compItem: {
    flex: 1,
    alignItems: 'center',
  },
  compDivider: {
    width: 1,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  compLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  compValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  compSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  textSuccess: {
    color: '#16A34A',
  },
  textDanger: {
    color: '#DC2626',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNum: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  nextStepsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  nextStepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  nextStepsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  stepsList: {
    gap: 6,
  },
  stepItem: {
    fontSize: 12.5,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  toggleExplanationsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  toggleExplanationsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  explanationsContainer: {
    gap: 10,
  },
  expCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  expCardCorrect: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  expCardWrong: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expNumBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  expNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  expStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  expStatusCorrect: {
    backgroundColor: '#16A34A',
  },
  expStatusWrong: {
    backgroundColor: '#DC2626',
  },
  expStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  answerComparisonBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    gap: 2,
  },
  ansText: {
    fontSize: 12,
    color: '#334155',
  },
  expTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 2,
  },
  expBody: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 17,
  },
  actionButtonsCol: {
    gap: 10,
    marginTop: 8,
  },
  actionPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2B7BF6',
    borderRadius: 12,
    paddingVertical: 14,
  },
  actionPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 14,
  },
  actionSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B7BF6',
  },
});

