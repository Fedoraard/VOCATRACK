import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AssessmentService } from '../../services/api/assessmentService';
import { ProgressService } from '../../services/api/progressService';
import { OfficialAttempt, AnswerSubmissionItem, QuestionInstance } from '../../types/contracts';
import { useAppStore } from '../../store/useAppStore';

/**
 * LAYAR PENGERJAAN EVALUASI RESMI (T-28, CT-05, CT-06, F-07)
 * Memenuhi aturan:
 * 1. Timer 20 menit berbasis tenggat waktu server (deadlineAt).
 * 2. Navigasi bebas 20 butir soal, penandaan "Tinjau Nanti".
 * 3. Tidak ada penentuan skor atau kelulusan di sisi klien.
 * 4. Proteksi sesi aktif: Mengunci akses tutor VocaBot selama ujian.
 */

export default function OfficialAssessmentScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const user = useAppStore((state) => state.user);
  const setActiveAssessment = useAppStore((state) => state.setActiveAssessment);

  const moduleId = (params.id || 'FE-01').toUpperCase();

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<OfficialAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { optionIndex: number | null; version: number }>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(1200); // 20 Menit = 1200 Detik
  const [submitting, setSubmitting] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);

  const timerRef = useRef<any>(null);

  // 1. Inisialisasi Sesi Evaluasi Resmi Server
  useEffect(() => {
    let isMounted = true;
    async function startSession() {
      try {
        setLoading(true);
        const studentId = user?.id || 'user-001';
        const session = await AssessmentService.startOfficialAssessment(moduleId, studentId);

        if (!isMounted) return;
        setAttempt(session);

        // Kunci status aktif di store untuk memblokir VocaBot (T-61)
        setActiveAssessment({
          attemptId: session.attemptId,
          moduleId: session.moduleId,
          moduleTitle: session.moduleTitle,
        });

        // Hitung sisa detik berdasarkan deadlineAt server
        const deadlineMs = new Date(session.deadlineAt).getTime();
        const nowMs = Date.now();
        const diffSec = Math.max(0, Math.floor((deadlineMs - nowMs) / 1000));
        setRemainingSeconds(diffSec);

        // Inisialisasi peta jawaban
        const initialAnswers: Record<string, { optionIndex: number | null; version: number }> = {};
        for (const q of session.questions) {
          initialAnswers[q.questionInstanceId] = { optionIndex: null, version: 1 };
        }
        setAnswers(initialAnswers);
      } catch (err: any) {
        Alert.alert('Gagal Memulai Evaluasi', err.message || 'Terjadi kesalahan sistem.');
        router.back();
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    startSession();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [moduleId, user]);

  // 2. Countdown Timer Berbasis Server
  useEffect(() => {
    if (!attempt || loading) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeCutoff();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempt, loading]);

  // 3. Tangani Hardware Back Button di Android
  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        'Evaluasi Sedang Berlangsung',
        'Apakah Anda yakin ingin keluar? Sisa waktu akan terus berjalan di server dan jawaban yang belum diserahkan tidak akan dinilai.',
        [
          { text: 'Lanjutkan Ujian', style: 'cancel' },
          {
            text: 'Keluar',
            style: 'destructive',
            onPress: () => {
              setActiveAssessment(null);
              router.back();
            },
          },
        ]
      );
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, []);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Pilih Jawaban
  const handleSelectOption = (qId: string, optIndex: number) => {
    setAnswers((prev) => {
      const current = prev[qId] || { optionIndex: null, version: 0 };
      return {
        ...prev,
        [qId]: { optionIndex: optIndex, version: current.version + 1 },
      };
    });
  };

  // Toggle Ragu-ragu / Tinjau Nanti
  const toggleReviewMark = (qId: string) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Submit Penyerahan ke Server
  const handleFinalSubmit = useCallback(async () => {
    if (!attempt || submitting) return;

    try {
      setSubmitting(true);
      const studentId = user?.id || 'user-001';

      // Bentuk snapshot array jawaban untuk dikirim ke server (CT-06)
      const payload: AnswerSubmissionItem[] = Object.entries(answers).map(([qId, ans]) => ({
        questionInstanceId: qId,
        selectedOptionIndex: ans.optionIndex,
        answerVersion: ans.version,
      }));

      // Server menilai evaluasi resmi secara objektif (F-07)
      const officialResult = await AssessmentService.submitOfficialAssessment(
        attempt.attemptId,
        studentId,
        payload
      );

      // Refresh proyeksi progres & lepas penguncian VocaBot
      await ProgressService.refreshAfterEvaluation(studentId, attempt.moduleId);
      setActiveAssessment(null);

      // Arahkan ke layar Hasil Evaluasi Resmi (T-29)
      router.replace({
        pathname: '/evaluasi/result',
        params: {
          attemptId: attempt.attemptId,
          moduleId: attempt.moduleId,
        },
      });
    } catch (err: any) {
      Alert.alert('Gagal Mengirim Jawaban', err.message || 'Periksa koneksi internet Anda.');
      setSubmitting(false);
    }
  }, [attempt, answers, submitting, user]);

  const handleTimeCutoff = () => {
    Alert.alert(
      'Waktu Habis!',
      'Waktu 20 menit evaluasi resmi telah berakhir. Jawaban Anda akan otomatis dikirim ke server untuk dinilai.',
      [{ text: 'Kirim Sekarang', onPress: handleFinalSubmit }],
      { cancelable: false }
    );
  };

  const confirmSubmit = () => {
    const totalQ = attempt?.questions.length || 20;
    const answeredCount = Object.values(answers).filter((a) => a.optionIndex !== null).length;
    const reviewCount = Object.values(markedForReview).filter(Boolean).length;
    const unansweredCount = totalQ - answeredCount;

    Alert.alert(
      'Konfirmasi Pengumpulan',
      `Rincian pengerjaan Anda:\n• Terjawab: ${answeredCount} soal\n• Belum dijawab: ${unansweredCount} soal\n• Ditandai ragu-ragu: ${reviewCount} soal\n\nApakah Anda yakin ingin menyerahkan evaluasi sekarang? Nilai kelulusan resmi minimal 70.`,
      [
        { text: 'Periksa Kembali', style: 'cancel' },
        { text: 'Kirim Jawaban', style: 'default', onPress: handleFinalSubmit },
      ]
    );
  };

  if (loading || !attempt) {
    return (
      <View style={[styles.loadingScreen, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#2B7BF6" />
        <Text style={styles.loadingTitle}>Mempersiapkan Sesi Ujian Resmi...</Text>
        <Text style={styles.loadingSubtitle}>Mengunduh bank soal terenkripsi dari server</Text>
      </View>
    );
  }

  const currentQ: QuestionInstance = attempt.questions[currentIndex];
  const currentAnswer = answers[currentQ.questionInstanceId]?.optionIndex ?? null;
  const isCurrentMarked = Boolean(markedForReview[currentQ.questionInstanceId]);
  const totalQuestions = attempt.questions.length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header Evaluasi */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topBarModule}>{attempt.moduleId}</Text>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {attempt.moduleTitle}
          </Text>
        </View>

        {/* Timer Badge Countdown 20 Menit */}
        <View
          style={[
            styles.timerBadge,
            remainingSeconds < 300 && styles.timerBadgeWarning, // Kuning/Merah jika < 5 menit
          ]}
        >
          <Ionicons
            name="time-outline"
            size={16}
            color={remainingSeconds < 300 ? '#DC2626' : '#2B7BF6'}
          />
          <Text
            style={[
              styles.timerText,
              remainingSeconds < 300 && styles.timerTextWarning,
            ]}
          >
            {formatTime(remainingSeconds)}
          </Text>
        </View>
      </View>

      {/* Secondary Bar: Question Counter & Grid Toggle */}
      <View style={styles.subBar}>
        <Text style={styles.questionCounterText}>
          Soal <Text style={styles.questionCounterBold}>{currentIndex + 1}</Text> dari {totalQuestions}
        </Text>

        <View style={styles.subBarRight}>
          <TouchableOpacity
            style={[styles.reviewToggleBtn, isCurrentMarked && styles.reviewToggleBtnActive]}
            onPress={() => toggleReviewMark(currentQ.questionInstanceId)}
          >
            <Ionicons
              name={isCurrentMarked ? 'flag' : 'flag-outline'}
              size={15}
              color={isCurrentMarked ? '#D97706' : '#64748B'}
            />
            <Text style={[styles.reviewToggleText, isCurrentMarked && styles.reviewToggleTextActive]}>
              {isCurrentMarked ? 'Ragu-ragu' : 'Tandai'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridModalToggleBtn}
            onPress={() => setShowGridModal(!showGridModal)}
          >
            <Ionicons name="grid-outline" size={16} color="#2B7BF6" />
            <Text style={styles.gridModalToggleText}>Peta Soal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid Modal Overlay (Navigasi Bebas Nomor Soal) */}
      {showGridModal && (
        <View style={styles.gridContainer}>
          <View style={styles.gridHeaderRow}>
            <Text style={styles.gridHeaderTitle}>Navigasi 20 Butir Soal</Text>
            <TouchableOpacity onPress={() => setShowGridModal(false)}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 220 }} contentContainerStyle={styles.gridScrollView}>
            {attempt.questions.map((q, idx) => {
              const ansState = answers[q.questionInstanceId];
              const isAns = ansState && ansState.optionIndex !== null;
              const isMarked = markedForReview[q.questionInstanceId];
              const isCur = idx === currentIndex;

              let btnStyle = styles.gridNumBtn;
              if (isCur) btnStyle = { ...btnStyle, ...styles.gridNumBtnCurrent };
              else if (isMarked) btnStyle = { ...btnStyle, ...styles.gridNumBtnMarked };
              else if (isAns) btnStyle = { ...btnStyle, ...styles.gridNumBtnAnswered };

              return (
                <TouchableOpacity
                  key={q.questionInstanceId}
                  style={btnStyle}
                  onPress={() => {
                    setCurrentIndex(idx);
                    setShowGridModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.gridNumText,
                      isAns && styles.gridNumTextAnswered,
                      isMarked && styles.gridNumTextMarked,
                      isCur && styles.gridNumTextCurrent,
                    ]}
                  >
                    {idx + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.gridLegendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#2B7BF6' }]} />
              <Text style={styles.legendLabel}>Terjawab</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B', borderWidth: 1 }]} />
              <Text style={styles.legendLabel}>Ragu-ragu</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#F1F5F9' }]} />
              <Text style={styles.legendLabel}>Kosong</Text>
            </View>
          </View>
        </View>
      )}

      {/* Main Question & Options Section */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.mainQuestionContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 80 },
        ]}
      >
        {/* Type Badge */}
        <View style={styles.typeBadgeRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {currentQ.type === 'CASE' ? 'Studi Kasus' : 'Struktur & Kode'}
            </Text>
          </View>
        </View>

        {/* Prompt */}
        <Text style={styles.questionPrompt}>{currentQ.prompt}</Text>

        {/* Code Snippet if applicable */}
        {currentQ.codeSnippet && (
          <View style={styles.codeSnippetBox}>
            <Text style={styles.codeSnippetText}>{currentQ.codeSnippet}</Text>
          </View>
        )}

        {/* Options A, B, C, D */}
        <View style={styles.optionsWrapper}>
          {currentQ.options.map((option, optIdx) => {
            const isSelected = currentAnswer === optIdx;
            return (
              <TouchableOpacity
                key={optIdx}
                activeOpacity={0.8}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => handleSelectOption(currentQ.questionInstanceId, optIdx)}
              >
                <View style={[styles.optionRadio, isSelected && styles.optionRadioSelected]}>
                  <Text style={[styles.optionRadioLetter, isSelected && styles.optionRadioLetterSelected]}>
                    {String.fromCharCode(65 + optIdx)}
                  </Text>
                </View>
                <Text style={[styles.optionCardText, isSelected && styles.optionCardTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Floating Navigation Bar */}
      <View style={[styles.bottomActionBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.navNavBtn, currentIndex === 0 && styles.navNavBtnDisabled]}
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
        >
          <Ionicons name="arrow-back" size={18} color={currentIndex === 0 ? '#94A3B8' : '#2B7BF6'} />
          <Text style={[styles.navNavBtnText, currentIndex === 0 && styles.navNavBtnTextDisabled]}>
            Sebelumnya
          </Text>
        </TouchableOpacity>

        {currentIndex < totalQuestions - 1 ? (
          <TouchableOpacity
            style={styles.navNextBtn}
            onPress={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
          >
            <Text style={styles.navNextBtnText}>Berikutnya</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.navSubmitBtn}
            disabled={submitting}
            onPress={confirmSubmit}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.navSubmitBtnText}>Selesai & Kumpulkan</Text>
                <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  topBar: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarLeft: {
    flex: 1,
    marginRight: 12,
  },
  topBarModule: {
    fontSize: 11,
    fontWeight: '700',
    color: '#60A5FA',
    textTransform: 'uppercase',
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timerBadgeWarning: {
    backgroundColor: '#FEF2F2',
    borderColor: '#F87171',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#60A5FA',
    fontVariant: ['tabular-nums'],
  },
  timerTextWarning: {
    color: '#DC2626',
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  questionCounterText: {
    fontSize: 13,
    color: '#64748B',
  },
  questionCounterBold: {
    fontWeight: '800',
    color: '#0F172A',
    fontSize: 15,
  },
  subBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  reviewToggleBtnActive: {
    backgroundColor: '#FEF3C7',
  },
  reviewToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  reviewToggleTextActive: {
    color: '#D97706',
    fontWeight: '700',
  },
  gridModalToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  gridModalToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  gridContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#2B7BF6',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  gridHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  gridScrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  gridNumBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridNumBtnCurrent: {
    borderWidth: 2,
    borderColor: '#2B7BF6',
    backgroundColor: '#EFF6FF',
  },
  gridNumBtnAnswered: {
    backgroundColor: '#2B7BF6',
  },
  gridNumBtnMarked: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  gridNumText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  gridNumTextAnswered: {
    color: '#FFFFFF',
  },
  gridNumTextMarked: {
    color: '#B45309',
  },
  gridNumTextCurrent: {
    color: '#2B7BF6',
  },
  gridLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  mainQuestionContent: {
    padding: 16,
  },
  typeBadgeRow: {
    marginBottom: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  questionPrompt: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 14,
  },
  codeSnippetBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  codeSnippetText: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  optionsWrapper: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  optionCardSelected: {
    borderColor: '#2B7BF6',
    backgroundColor: '#EFF6FF',
  },
  optionRadio: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionRadioSelected: {
    backgroundColor: '#2B7BF6',
  },
  optionRadioLetter: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  optionRadioLetterSelected: {
    color: '#FFFFFF',
  },
  optionCardText: {
    fontSize: 13.5,
    color: '#1E293B',
    flex: 1,
    lineHeight: 19,
  },
  optionCardTextSelected: {
    fontWeight: '700',
    color: '#1E40AF',
  },
  bottomActionBar: {
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
  navNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  navNavBtnDisabled: {
    borderColor: '#F1F5F9',
  },
  navNavBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  navNavBtnTextDisabled: {
    color: '#94A3B8',
  },
  navNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2B7BF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navNextBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#16A34A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navSubmitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
