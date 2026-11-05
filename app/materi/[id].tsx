import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomVideoPlayer } from '../../components/video/CustomVideoPlayer';
import { CurriculumService } from '../../services/api/curriculumService';
import { ProgressService } from '../../services/api/progressService';
import { AssessmentService } from '../../services/api/assessmentService';
import { ModuleVersion, PracticeItem } from '../../types/contracts';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

export default function MateriScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; title?: string }>();
  const user = useAppStore((state) => state.user);

  const moduleId = (params.id || 'FND-01').toUpperCase();
  const [moduleData, setModuleData] = useState<ModuleVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoCoverage, setVideoCoverage] = useState(0);
  const [isVideoDone, setIsVideoDone] = useState(false);
  const [activeTab, setActiveTab] = useState<'MATERI' | 'LATIHAN' | 'FAQ'>('MATERI');

  // Practice state
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<string, number>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, boolean>>({});

  // Status evaluasi resmi
  const [evalStatus, setEvalStatus] = useState<{
    hasPassedHistorically: boolean;
    latestScore: number | null;
  }>({ hasPassedHistorically: false, latestScore: null });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const mod = await CurriculumService.getModuleById(moduleId);
        if (mod) {
          setModuleData(mod);
        } else {
          // Fallback ke FND-01 jika modul tidak terdaftar
          const defaultMod = await CurriculumService.getModuleById('FND-01');
          setModuleData(defaultMod);
        }

        if (user) {
          const status = await AssessmentService.getModuleEvaluationStatus(user.id, moduleId);
          setEvalStatus({
            hasPassedHistorically: status.hasPassedHistorically,
            latestScore: status.latestResult ? status.latestResult.score : null,
          });
        }
      } catch (err) {
        console.error('Error loading module:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [moduleId, user]);

  const handleVideoCompletion = async () => {
    setIsVideoDone(true);
    if (user && moduleData) {
      await ProgressService.markVideoCompleted(user.id, moduleData.id);
    }
  };

  const handleAnswerPractice = async (item: PracticeItem, optionIdx: number) => {
    if (selectedPracticeAnswers[item.id] !== undefined) return; // Kunci setelah dijawab

    const isCorrect = optionIdx === item.kunciIndex;
    setSelectedPracticeAnswers((prev) => ({ ...prev, [item.id]: optionIdx }));
    setPracticeFeedback((prev) => ({ ...prev, [item.id]: isCorrect }));

    if (user && moduleData) {
      await ProgressService.incrementPracticeCount(user.id, moduleData.id);
    }
  };

  if (loading || !moduleData) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#2B7BF6" />
        <Text style={styles.loadingText}>Memuat materi pembelajaran...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header Video Custom Player (T-09) */}
      <View style={styles.videoContainer}>
        {/* Back Button Floating */}
        <TouchableOpacity
          style={[styles.backFloatingBtn, { top: Math.max(insets.top, 14) }]}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <CustomVideoPlayer
          moduleId={moduleData.id}
          videoTitle={moduleData.title}
          durationSeconds={moduleData.videoDurationSeconds || 180}
          requiredSegments={moduleData.requiredSegments}
          onCoverageUpdate={(cov, done) => {
            setVideoCoverage(cov);
            if (done) setIsVideoDone(true);
          }}
          onCompletion={handleVideoCompletion}
        />
      </View>

      {/* Sub-header Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'MATERI' && styles.tabItemActive]}
          onPress={() => setActiveTab('MATERI')}
        >
          <Text style={[styles.tabLabel, activeTab === 'MATERI' && styles.tabLabelActive]}>
            Materi Bacaan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'LATIHAN' && styles.tabItemActive]}
          onPress={() => setActiveTab('LATIHAN')}
        >
          <Text style={[styles.tabLabel, activeTab === 'LATIHAN' && styles.tabLabelActive]}>
            Latihan ({moduleData.practiceItems?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'FAQ' && styles.tabItemActive]}
          onPress={() => setActiveTab('FAQ')}
        >
          <Text style={[styles.tabLabel, activeTab === 'FAQ' && styles.tabLabelActive]}>
            FAQ & Kurasi
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
      >
        {/* Module Header Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{moduleData.category}</Text>
          </View>
          <View style={styles.orderPill}>
            <Text style={styles.orderPillText}>Modul {moduleData.id}</Text>
          </View>
          {evalStatus.hasPassedHistorically && (
            <View style={styles.passedPill}>
              <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
              <Text style={styles.passedPillText}>Lulus Resmi ({evalStatus.latestScore})</Text>
            </View>
          )}
        </View>

        <Text style={styles.materiTitle}>{moduleData.title}</Text>
        <Text style={styles.materiSubtitle}>{moduleData.subtitle}</Text>

        {/* TAB 1: MATERI BACAAN */}
        {activeTab === 'MATERI' && (
          <View style={styles.tabContent}>
            <View style={styles.cardBox}>
              <Text style={styles.cardHeaderTitle}>Deskripsi Kompetensi</Text>
              <Text style={styles.readingBody}>{moduleData.description}</Text>
            </View>

            <View style={styles.cardBox}>
              <Text style={styles.cardHeaderTitle}>Isi Modul Pembelajaran</Text>
              <Text style={styles.readingBody}>{moduleData.readingContent}</Text>
            </View>

            {/* Tombol Evaluasi Resmi */}
            <View style={styles.evalNoticeCard}>
              <View style={styles.evalNoticeHeader}>
                <Ionicons name="shield-checkmark" size={24} color="#2B7BF6" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.evalNoticeTitle}>Evaluasi Resmi 20 Menit</Text>
                  <Text style={styles.evalNoticeDesc}>
                    Ujian resmi berstandar server. Nilai kelulusan minimal 70.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.evalLaunchBtn}
                activeOpacity={0.85}
                onPress={() => router.push(`/evaluasi/${moduleData.id}`)}
              >
                <Text style={styles.evalLaunchBtnText}>
                  {evalStatus.hasPassedHistorically ? 'Ulang Evaluasi Resmi' : 'Mulai Evaluasi Resmi'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: LATIHAN FORMATIF (T-27) */}
        {activeTab === 'LATIHAN' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionHeaderTitle}>Latihan Soal Formatif</Text>
            <Text style={styles.sectionSubtitle}>
              Latihan mandiri untuk menguji pemahaman Anda sebelum evaluasi resmi.
            </Text>

            {moduleData.practiceItems && moduleData.practiceItems.length > 0 ? (
              moduleData.practiceItems.map((item, idx) => {
                const userSelected = selectedPracticeAnswers[item.id];
                const isAnswered = userSelected !== undefined;
                const isCorrect = practiceFeedback[item.id];

                return (
                  <View key={item.id} style={styles.practiceCard}>
                    <Text style={styles.practiceQNumber}>Soal Latihan #{idx + 1}</Text>
                    <Text style={styles.practiceQuestion}>{item.question}</Text>

                    <View style={styles.optionsList}>
                      {item.options.map((opt, optIdx) => {
                        const isChosen = userSelected === optIdx;
                        let optionStyle = styles.optionBtn;
                        if (isAnswered) {
                          if (optIdx === item.kunciIndex) {
                            optionStyle = styles.optionBtnCorrect;
                          } else if (isChosen && !isCorrect) {
                            optionStyle = styles.optionBtnWrong;
                          }
                        } else if (isChosen) {
                          optionStyle = styles.optionBtnSelected;
                        }

                        return (
                          <TouchableOpacity
                            key={optIdx}
                            style={optionStyle}
                            disabled={isAnswered}
                            onPress={() => handleAnswerPractice(item, optIdx)}
                          >
                            <Text style={styles.optionLetter}>
                              {String.fromCharCode(65 + optIdx)}.
                            </Text>
                            <Text style={styles.optionText}>{opt}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {isAnswered && (
                      <View
                        style={[
                          styles.feedbackBox,
                          isCorrect ? styles.feedbackBoxCorrect : styles.feedbackBoxWrong,
                        ]}
                      >
                        <View style={styles.feedbackHeader}>
                          <Ionicons
                            name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                            size={18}
                            color={isCorrect ? '#16A34A' : '#DC2626'}
                          />
                          <Text
                            style={[
                              styles.feedbackStatusText,
                              { color: isCorrect ? '#16A34A' : '#DC2626' },
                            ]}
                          >
                            {isCorrect ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat'}
                          </Text>
                        </View>
                        <Text style={styles.feedbackExplanation}>{item.explanation}</Text>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="document-text-outline" size={36} color="#94A3B8" />
                <Text style={styles.emptyText}>Belum ada latihan formatif pada modul ini.</Text>
              </View>
            )}
          </View>
        )}

        {/* TAB 3: FAQ & KURASI */}
        {activeTab === 'FAQ' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionHeaderTitle}>Tanya Jawab Terkurasi (FAQ)</Text>
            <Text style={styles.sectionSubtitle}>
              Pertanyaan umum seputar modul ini yang dijawab langsung oleh tim kurator.
            </Text>

            {moduleData.faqItems && moduleData.faqItems.length > 0 ? (
              moduleData.faqItems.map((faq) => (
                <View key={faq.id} style={styles.faqCard}>
                  <View style={styles.faqQRow}>
                    <Ionicons name="help-circle" size={20} color="#2B7BF6" />
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                  </View>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="chatbubbles-outline" size={36} color="#94A3B8" />
                <Text style={styles.emptyText}>Belum ada FAQ terkurasi untuk modul ini.</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.askVocabotBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/vocabot')}
            >
              <Ionicons name="hardware-chip-outline" size={20} color="#FFFFFF" />
              <Text style={styles.askVocabotBtnText}>Tanya VocaBot Tutor</Text>
            </TouchableOpacity>
          </View>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  videoContainer: {
    width: '100%',
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  backFloatingBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 99,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#2B7BF6',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#2B7BF6',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  orderPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  passedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  passedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  materiTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  materiSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  tabContent: {
    gap: 14,
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  readingBody: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  evalNoticeCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 8,
  },
  evalNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  evalNoticeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  evalNoticeDesc: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 2,
  },
  evalLaunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B7BF6',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  evalLaunchBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  practiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  practiceQNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  practiceQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    lineHeight: 20,
  },
  optionsList: {
    gap: 8,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionBtnSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2B7BF6',
  },
  optionBtnCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  optionBtnWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  optionLetter: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    width: 24,
  },
  optionText: {
    fontSize: 13,
    color: '#1E293B',
    flex: 1,
  },
  feedbackBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  feedbackBoxCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  feedbackBoxWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  feedbackStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  feedbackExplanation: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  faqQRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  faqAnswer: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    paddingLeft: 28,
  },
  askVocabotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
    gap: 8,
  },
  askVocabotBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
