import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DualTabSwitcher, ContentTabType } from '../../components/common/DualTabSwitcher';
import { MOCK_MATERI } from '../../utils/mockData';

export default function MateriScreen() {
  const params = useLocalSearchParams<{ id: string; nodeTitle?: string; quizId?: string }>();
  const [activeTab, setActiveTab] = useState<ContentTabType>('video');

  const materi = MOCK_MATERI['mat-03'];
  const quizId = params.quizId || 'quiz-03';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.jurusanBadge}>{materi.jurusan}</Text>
          <Text style={styles.title}>{params.nodeTitle || materi.judul}</Text>
          <Text style={styles.authorText}>Disusun oleh: {materi.penulis}</Text>
        </View>

        {/* 2-Tab Switcher Component (SCR-04) */}
        <DualTabSwitcher
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          videoDuration={materi.durasiVideo}
        />

        {/* Tab 1: Video Terpandu */}
        {activeTab === 'video' ? (
          <View style={styles.videoSection}>
            <View style={styles.videoPlayerCard}>
              <View style={styles.playIconCircle}>
                <Ionicons name="play" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.videoPlayerNotice}>
                Modul Video Interaktif Vokasi
              </Text>
              <Text style={styles.videoDurationBadge}>{materi.durasiVideo}</Text>
            </View>

            <View style={styles.videoNotesBox}>
              <View style={styles.noteTitleRow}>
                <Ionicons name="bulb-outline" size={18} color="#4F46E5" />
                <Text style={styles.noteTitle}>Poin Kunci dari Video:</Text>
              </View>
              <Text style={styles.noteBullet}>
                1. Pemahaman mendalam tentang siklus event loop di JavaScript.
              </Text>
              <Text style={styles.noteBullet}>
                2. Menghindari mutating state secara langsung di arsitektur komponen React.
              </Text>
              <Text style={styles.noteBullet}>
                3. Praktik terbaik struktur data modular untuk sistem pendukung keputusan (SAW).
              </Text>
            </View>
          </View>
        ) : (
          /* Tab 2: Rangkuman Bacaan */
          <View style={styles.readingSection}>
            <View style={styles.readingCard}>
              <Text style={styles.readingText}>
                {materi.rangkuman.trim()}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom CTA for Quiz */}
      <View style={styles.bottomBar}>
        <View style={styles.quizInfo}>
          <Text style={styles.quizInfoTitle}>Evaluasi Pemahaman</Text>
          <Text style={styles.quizInfoSubtitle}>3 Soal Pilihan Ganda (Anti-Screenshot)</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: quizId } })}
          style={styles.quizButton}
        >
          <Text style={styles.quizButtonText}>Mulai Kuis</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 8,
  },
  jurusanBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  authorText: {
    fontSize: 12,
    color: '#64748B',
  },
  videoSection: {
    marginTop: 8,
  },
  videoPlayerCard: {
    height: 200,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  playIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  videoPlayerNotice: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  videoDurationBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '700',
  },
  videoNotesBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 14,
  },
  noteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  noteBullet: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 4,
  },
  readingSection: {
    marginTop: 8,
  },
  readingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  readingText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
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
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizInfo: {
    flex: 1,
    marginRight: 12,
  },
  quizInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  quizInfoSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  quizButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quizButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
