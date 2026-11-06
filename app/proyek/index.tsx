import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProjectService } from '../../services/api/projectService';
import { ProjectBrief, ProjectSubmission, CareerTrackId } from '../../types/contracts';
import { useAppStore } from '../../store/useAppStore';

/**
 * LAYAR PANDUAN & PENGUMPULAN PROYEK SISWA (T-67, CT-10, F-12)
 * Tema: Pengelola Tugas Belajar Siswa (D-28, D-29)
 * Memuat:
 * 1. Panduan brief proyek sesuai karir siswa.
 * 2. Checklist fitur wajib D-29.
 * 3. Formulir pengumpulan: URL Repo, Commit Hash, Petunjuk Run, Video Demo.
 * 4. Status pemeriksaan otomatis & feedback reviewer manusia.
 */

export default function ProjectSubmissionScreen() {
  const insets = useSafeAreaInsets();
  const user = useAppStore((state) => state.user);
  const targetCareer = useAppStore((state) => state.targetCareer);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);

  // Form Fields
  const [repoUrl, setRepoUrl] = useState('');
  const [commitHash, setCommitHash] = useState('');
  const [runInstructions, setRunInstructions] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const studentId = user?.id || 'user-001';
      const [bf, subs] = await Promise.all([
        ProjectService.getBrief(targetCareer),
        ProjectService.getStudentSubmissions(studentId, targetCareer),
      ]);
      setBrief(bf);
      setSubmissions(subs);
    } catch (err) {
      console.error('Error loading project data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [targetCareer, user]);

  const handleSubmit = async () => {
    if (!repoUrl.trim() || !commitHash.trim() || !runInstructions.trim() || !demoUrl.trim()) {
      Alert.alert('Form Belum Lengkap', 'Seluruh kolom (Repo, Commit, Petunjuk, Demo) wajib diisi.');
      return;
    }

    try {
      setSubmitting(true);
      const studentId = user?.id || 'user-001';
      const studentName = user?.namaLengkap || 'Siswa VocaTrack';

      await ProjectService.submitProject(
        studentId,
        studentName,
        targetCareer,
        repoUrl,
        commitHash,
        runInstructions,
        demoUrl
      );

      Alert.alert(
        'Pengumpulan Berhasil!',
        'Proyek Anda telah terkirim ke antrean pemeriksaan otomatis dan peninjauan reviewer internal.',
        [{ text: 'OK', onPress: () => loadProjectData() }]
      );

      // Reset form
      setRepoUrl('');
      setCommitHash('');
      setRunInstructions('');
      setDemoUrl('');
    } catch (err: any) {
      Alert.alert('Gagal Mengirimkan Proyek', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !brief) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#2B7BF6" />
        <Text style={styles.loadingText}>Memuat panduan proyek tugas belajar...</Text>
      </View>
    );
  }

  const latestSubmission = submissions.length > 0 ? submissions[submissions.length - 1] : null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerSubtitle}>Tugas Belajar Siswa</Text>
          <Text style={styles.headerTitle}>Proyek Akhir {brief.careerTitle}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 40 },
        ]}
      >
        {/* Status Kiriman Terakhir jika ada */}
        {latestSubmission && (
          <View style={styles.submissionStatusCard}>
            <View style={styles.statusHeaderRow}>
              <Text style={styles.statusHeaderLabel}>Status Pengumpulan Terakhir:</Text>
              <View
                style={[
                  styles.statusPill,
                  latestSubmission.status === 'PASSED'
                    ? styles.statusPillPassed
                    : latestSubmission.status === 'NEEDS_REVISION'
                    ? styles.statusPillRevision
                    : styles.statusPillReview,
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    latestSubmission.status === 'PASSED'
                      ? styles.statusTextPassed
                      : latestSubmission.status === 'NEEDS_REVISION'
                      ? styles.statusTextRevision
                      : styles.statusTextReview,
                  ]}
                >
                  {latestSubmission.status === 'PASSED'
                    ? 'LULUS PROYEK'
                    : latestSubmission.status === 'NEEDS_REVISION'
                    ? 'PERLU REVISI'
                    : 'SEDANG DITINJAU'}
                </Text>
              </View>
            </View>

            {latestSubmission.coreChecksSummary && (
              <View style={styles.coreChecksRow}>
                <Ionicons name="checkbox-outline" size={16} color="#16A34A" />
                <Text style={styles.coreChecksText}>
                  Pemeriksaan Otomatis: {latestSubmission.coreChecksSummary.passedChecksCount}/
                  {latestSubmission.coreChecksSummary.totalChecksCount} fitur lulus
                </Text>
              </View>
            )}

            {latestSubmission.humanReviewFeedback && (
              <View style={styles.feedbackBox}>
                <Text style={styles.feedbackTitle}>Catatan Reviewer ({latestSubmission.reviewerName}):</Text>
                <Text style={styles.feedbackText}>{latestSubmission.humanReviewFeedback}</Text>
              </View>
            )}
          </View>
        )}

        {/* Brief Overview */}
        <View style={styles.card}>
          <Text style={styles.themePill}>Tema: {brief.projectTheme}</Text>
          <Text style={styles.briefTitle}>Spesifikasi Tugas Belajar</Text>
          <Text style={styles.briefStack}>Tech Stack: {brief.technologyStack}</Text>

          <Text style={styles.featuresHeader}>Fitur Utama Wajib:</Text>
          <View style={styles.featuresList}>
            {brief.coreFeatures.map((feat, fIdx) => (
              <View key={fIdx} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#2B7BF6" />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Submission Guidelines */}
        <View style={styles.card}>
          <Text style={styles.guidelinesHeader}>Ketentuan Pengumpulan:</Text>
          {brief.submissionGuidelines.map((guide, gIdx) => (
            <Text key={gIdx} style={styles.guideText}>
              • {guide}
            </Text>
          ))}
        </View>

        {/* Submission Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Formulir Pengumpulan Proyek</Text>
          <Text style={styles.formSubtitle}>
            Pastikan seluruh data valid sebelum mengirimkan ke antrean peninjau internal.
          </Text>

          {/* Field 1: Repo URL */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tautan Repositori GitHub Publik *</Text>
            <TextInput
              value={repoUrl}
              onChangeText={setRepoUrl}
              placeholder="https://github.com/username/project-repo"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              style={styles.textInput}
            />
          </View>

          {/* Field 2: Commit Hash */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Commit Hash Terakhir *</Text>
            <TextInput
              value={commitHash}
              onChangeText={setCommitHash}
              placeholder="misal: 7a8b9c0d1e2f..."
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              style={styles.textInput}
            />
          </View>

          {/* Field 3: Run Instructions */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Petunjuk Menjalankan Proyek (README/Command) *</Text>
            <TextInput
              value={runInstructions}
              onChangeText={setRunInstructions}
              placeholder="misal: npm install && npm start di localhost:3000..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              style={[styles.textInput, styles.textArea]}
            />
          </View>

          {/* Field 4: Demo Video URL */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tautan Video Demo (YouTube / Google Drive) *</Text>
            <TextInput
              value={demoUrl}
              onChangeText={setDemoUrl}
              placeholder="https://youtu.be/... (video rekaman maks 3 menit)"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              style={styles.textInput}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            disabled={submitting}
            activeOpacity={0.88}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Kirimkan Proyek untuk Review</Text>
                <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
              </>
            )}
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
  submissionStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    gap: 8,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusHeaderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillPassed: {
    backgroundColor: '#DCFCE7',
  },
  statusPillRevision: {
    backgroundColor: '#FEF2F2',
  },
  statusPillReview: {
    backgroundColor: '#EFF6FF',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextPassed: {
    color: '#166534',
  },
  statusTextRevision: {
    color: '#991B1B',
  },
  statusTextReview: {
    color: '#1D4ED8',
  },
  coreChecksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  coreChecksText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  feedbackBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  feedbackTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  feedbackText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  themePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
    marginBottom: 8,
  },
  briefTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  briefStack: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  featuresHeader: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  featuresList: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 17,
  },
  guidelinesHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  guideText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2B7BF6',
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  formSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2B7BF6',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

