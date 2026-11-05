import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProjectService } from '../../services/api/projectService';
import { ProjectSubmission, RubricGrade, HumanReviewInput } from '../../types/contracts';

/**
 * LAYAR REVIEWER INTERNAL ANDROID (T-70, CT-12, F-13)
 * Memuat:
 * 1. Daftar tugas peninjauan proyek siswa berhalaman.
 * 2. Tampilan detail kiriman, commit hash, runner check summary.
 * 3. Modal penilaian rubrik 4 aspek (MET / NOT_MET).
 * 4. Pengiriman feedback dan status kelulusan resmi proyek.
 */

export default function ReviewerScreen() {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [selectedSub, setSelectedSub] = useState<ProjectSubmission | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Rubric State
  const [structureGrade, setStructureGrade] = useState<RubricGrade>('MET');
  const [implementationGrade, setImplementationGrade] = useState<RubricGrade>('MET');
  const [demoGrade, setDemoGrade] = useState<RubricGrade>('MET');
  const [fieldQualityGrade, setFieldQualityGrade] = useState<RubricGrade>('MET');
  const [feedbackText, setFeedbackText] = useState('');

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const list = await ProjectService.getReviewerSubmissions();
      setSubmissions(list);
    } catch (err) {
      console.error('Error loading reviewer submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const openReviewModal = (sub: ProjectSubmission) => {
    setSelectedSub(sub);
    setStructureGrade('MET');
    setImplementationGrade('MET');
    setDemoGrade('MET');
    setFieldQualityGrade('MET');
    setFeedbackText(sub.humanReviewFeedback || 'Proyek telah diuji dengan baik. Kode rapi dan fungsionalitas CRUD berjalan sesuai brief.');
    setModalVisible(true);
  };

  const handleSendReview = async () => {
    if (!selectedSub) return;
    if (!feedbackText.trim()) {
      Alert.alert('Catatan Wajib Diisi', 'Berikan catatan umpan balik yang konstruktif bagi siswa.');
      return;
    }

    try {
      setSubmittingReview(true);
      const input: HumanReviewInput = {
        submissionId: selectedSub.submissionId,
        rubricVersion: 'rb-v1.0.0',
        structureAndReadability: structureGrade,
        implementationAccuracy: implementationGrade,
        understandingThroughDemo: demoGrade,
        fieldSpecificQuality: fieldQualityGrade,
        feedbackText: feedbackText.trim(),
      };

      await ProjectService.submitHumanReview('Fedora Reviewer (Internal)', input);

      Alert.alert('Ulasan Terkirim', 'Keputusan peninjauan telah berhasil dicatat ke sistem.', [
        {
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            loadSubmissions();
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert('Gagal Mengirim Review', err.message || 'Terjadi kesalahan.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerSubtitle}>Antarmuka Internal Penilai (T-70)</Text>
          <Text style={styles.headerTitle}>Layar Reviewer Internal</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadSubmissions}>
          <Ionicons name="reload-outline" size={20} color="#2B7BF6" />
        </TouchableOpacity>
      </View>

      {/* Main List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2B7BF6" />
          <Text style={styles.loadingText}>Mengambil antrean tugas reviewer...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 24 },
          ]}
        >
          <Text style={styles.sectionHeaderTitle}>
            Daftar Tugas Peninjauan ({submissions.length})
          </Text>

          {submissions.map((sub) => {
            const isPassed = sub.status === 'PASSED';
            const isRevision = sub.status === 'NEEDS_REVISION';
            return (
              <View key={sub.submissionId} style={styles.subCard}>
                <View style={styles.subCardTop}>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{sub.studentName}</Text>
                    <Text style={styles.careerTrackPill}>{sub.careerId} Track</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      isPassed
                        ? styles.statusPillPass
                        : isRevision
                        ? styles.statusPillRev
                        : styles.statusPillWait,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isPassed
                          ? styles.statusTextPass
                          : isRevision
                          ? styles.statusTextRev
                          : styles.statusTextWait,
                      ]}
                    >
                      {sub.status}
                    </Text>
                  </View>
                </View>

                {/* Sub details */}
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Repo:</Text>
                  <Text style={styles.metaVal} numberOfLines={1}>
                    {sub.repositoryUrl}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Commit:</Text>
                  <Text style={styles.metaValMono}>{sub.commitHash.substring(0, 10)}</Text>
                </View>

                {sub.coreChecksSummary && (
                  <View style={styles.runnerBox}>
                    <Ionicons name="hardware-chip-outline" size={14} color="#16A34A" />
                    <Text style={styles.runnerText}>
                      Runner Otomatis: {sub.coreChecksSummary.passedChecksCount}/
                      {sub.coreChecksSummary.totalChecksCount} checklist lolos
                    </Text>
                  </View>
                )}

                {/* Action Button */}
                <TouchableOpacity
                  style={styles.reviewBtn}
                  activeOpacity={0.85}
                  onPress={() => openReviewModal(sub)}
                >
                  <Ionicons name="clipboard-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.reviewBtnText}>
                    {sub.reviewedAt ? 'Perbarui Ulasan Rubrik' : 'Beri Penilaian Rubrik (4 Aspek)'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* MODAL PENILAIAN RUBRIK 4 ASPEK (CT-12) */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Rubrik Evaluasi Proyek (CT-12)</Text>
                <Text style={styles.modalSub}>{selectedSub?.studentName} - {selectedSub?.careerId}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
              {/* ASPEK 1 */}
              <View style={styles.rubricGroup}>
                <Text style={styles.rubricTitle}>1. Struktur & Keterbacaan Kode</Text>
                <Text style={styles.rubricDesc}>Struktur folder modular, penamaan variabel semantik, dan kebersihan kode.</Text>
                <View style={styles.rubricToggleRow}>
                  <TouchableOpacity
                    style={[styles.rubricOption, structureGrade === 'MET' && styles.rubricOptionMet]}
                    onPress={() => setStructureGrade('MET')}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={structureGrade === 'MET' ? '#FFFFFF' : '#16A34A'} />
                    <Text style={[styles.rubricOptionText, structureGrade === 'MET' && styles.rubricOptionTextActive]}>MET (Memenuhi)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.rubricOption, structureGrade === 'NOT_MET' && styles.rubricOptionNotMet]}
                    onPress={() => setStructureGrade('NOT_MET')}
                  >
                    <Ionicons name="close-circle" size={16} color={structureGrade === 'NOT_MET' ? '#FFFFFF' : '#DC2626'} />
                    <Text style={[styles.rubricOptionText, structureGrade === 'NOT_MET' && styles.rubricOptionTextActive]}>NOT MET</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ASPEK 2 */}
              <View style={styles.rubricGroup}>
                <Text style={styles.rubricTitle}>2. Ketepatan Implementasi Fitur</Text>
                <Text style={styles.rubricDesc}>Fitur CRUD tugas, status todo/done, filter pencarian, dan validasi data.</Text>
                <View style={styles.rubricToggleRow}>
                  <TouchableOpacity
                    style={[styles.rubricOption, implementationGrade === 'MET' && styles.rubricOptionMet]}
                    onPress={() => setImplementationGrade('MET')}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={implementationGrade === 'MET' ? '#FFFFFF' : '#16A34A'} />
                    <Text style={[styles.rubricOptionText, implementationGrade === 'MET' && styles.rubricOptionTextActive]}>MET (Memenuhi)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.rubricOption, implementationGrade === 'NOT_MET' && styles.rubricOptionNotMet]}
                    onPress={() => setImplementationGrade('NOT_MET')}
                  >
                    <Ionicons name="close-circle" size={16} color={implementationGrade === 'NOT_MET' ? '#FFFFFF' : '#DC2626'} />
                    <Text style={[styles.rubricOptionText, implementationGrade === 'NOT_MET' && styles.rubricOptionTextActive]}>NOT MET</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ASPEK 3 */}
              <View style={styles.rubricGroup}>
                <Text style={styles.rubricTitle}>3. Pemahaman Konseptual lewat Demo</Text>
                <Text style={styles.rubricDesc}>Video demo menjelaskan alur kerja, penanganan kasus uji, dan kesesuaian brief.</Text>
                <View style={styles.rubricToggleRow}>
                  <TouchableOpacity
                    style={[styles.rubricOption, demoGrade === 'MET' && styles.rubricOptionMet]}
                    onPress={() => setDemoGrade('MET')}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={demoGrade === 'MET' ? '#FFFFFF' : '#16A34A'} />
                    <Text style={[styles.rubricOptionText, demoGrade === 'MET' && styles.rubricOptionTextActive]}>MET (Memenuhi)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.rubricOption, demoGrade === 'NOT_MET' && styles.rubricOptionNotMet]}
                    onPress={() => setDemoGrade('NOT_MET')}
                  >
                    <Ionicons name="close-circle" size={16} color={demoGrade === 'NOT_MET' ? '#FFFFFF' : '#DC2626'} />
                    <Text style={[styles.rubricOptionText, demoGrade === 'NOT_MET' && styles.rubricOptionTextActive]}>NOT MET</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ASPEK 4 */}
              <View style={styles.rubricGroup}>
                <Text style={styles.rubricTitle}>4. Kualitas Spesifik Bidang Profesi</Text>
                <Text style={styles.rubricDesc}>Penerapan standar khusus: State management React / Relasi SQL / Responsif Native.</Text>
                <View style={styles.rubricToggleRow}>
                  <TouchableOpacity
                    style={[styles.rubricOption, fieldQualityGrade === 'MET' && styles.rubricOptionMet]}
                    onPress={() => setFieldQualityGrade('MET')}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={fieldQualityGrade === 'MET' ? '#FFFFFF' : '#16A34A'} />
                    <Text style={[styles.rubricOptionText, fieldQualityGrade === 'MET' && styles.rubricOptionTextActive]}>MET (Memenuhi)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.rubricOption, fieldQualityGrade === 'NOT_MET' && styles.rubricOptionNotMet]}
                    onPress={() => setFieldQualityGrade('NOT_MET')}
                  >
                    <Ionicons name="close-circle" size={16} color={fieldQualityGrade === 'NOT_MET' ? '#FFFFFF' : '#DC2626'} />
                    <Text style={[styles.rubricOptionText, fieldQualityGrade === 'NOT_MET' && styles.rubricOptionTextActive]}>NOT MET</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Catatan Feedback */}
              <View style={styles.rubricGroup}>
                <Text style={styles.rubricTitle}>Catatan Feedback & Saran Konstruktif *</Text>
                <TextInput
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  placeholder="Tuliskan umpan balik untuk siswa..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  style={styles.feedbackInput}
                />
              </View>

              {/* Submit Review */}
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                disabled={submittingReview}
                onPress={handleSendReview}
              >
                {submittingReview ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.modalSubmitBtnText}>Kirim Keputusan Penilaian</Text>
                    <Ionicons name="send" size={16} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    color: '#059669',
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  subCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  careerTrackPill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillPass: {
    backgroundColor: '#DCFCE7',
  },
  statusPillRev: {
    backgroundColor: '#FEF2F2',
  },
  statusPillWait: {
    backgroundColor: '#EFF6FF',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextPass: {
    color: '#166534',
  },
  statusTextRev: {
    color: '#991B1B',
  },
  statusTextWait: {
    color: '#1D4ED8',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
  },
  metaLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    width: 50,
  },
  metaVal: {
    fontSize: 11.5,
    color: '#0F172A',
    flex: 1,
  },
  metaValMono: {
    fontSize: 11.5,
    color: '#0F172A',
    fontFamily: 'monospace',
  },
  runnerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  runnerText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 6,
  },
  reviewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  rubricGroup: {
    marginBottom: 16,
  },
  rubricTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  rubricDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 8,
  },
  rubricToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rubricOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rubricOptionMet: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  rubricOptionNotMet: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  rubricOptionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  rubricOptionTextActive: {
    color: '#FFFFFF',
  },
  feedbackInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 10,
    fontSize: 12.5,
    color: '#0F172A',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 20,
  },
  modalSubmitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

