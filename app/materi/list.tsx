import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface ModuleItem {
  id: string;
  title: string;
  duration: string;
}

const MODULES: ModuleItem[] = [
  { id: 'm-1', title: 'Pengenalan Dasar: HTML Basic', duration: '10 Menit' },
  { id: 'm-2', title: 'Pengenalan Dasar: HTML Basic', duration: '10 Menit' },
  { id: 'm-3', title: 'Pengenalan Dasar: HTML Basic', duration: '10 Menit' },
  { id: 'm-4', title: 'Pengenalan Dasar: HTML Basic', duration: '10 Menit' },
  { id: 'm-5', title: 'Pengenalan Dasar: HTML Basic', duration: '10 Menit' },
  { id: 'm-6', title: 'Pengenalan Dasar: HTML Basic', duration: '10 Menit' },
  { id: 'm-7', title: 'Pengenalan Dasar: HTML Basic', duration: '10 Menit' },
];

export default function MateriListScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Back Button Pill */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backPill}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={14} color="#FFFFFF" />
            <Text style={styles.backPillText}>Kembali</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Title */}
          <Text style={styles.title}>
            Daftar <Text style={styles.blueHighlight}>Materi</Text> Pembelajaran
          </Text>
          <Text style={styles.subtitle}>
            Pelajari materi yang sesuai dengan jurusanmu dan tingkatkan skill untuk
            mencapai karier yang kamu inginkan.
          </Text>

          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>Progress Pembelajaran:</Text>
              <Text style={styles.progressPercentage}>12%</Text>
            </View>

            <View style={styles.progressBarTrack}>
              <View style={styles.progressBarFill} />
            </View>

            <View style={styles.careerTrackBadge}>
              <Text style={styles.careerTrackBadgeText}>
                WEB DEVELOPER - TITL BASIC
              </Text>
            </View>
          </View>

          {/* Modules List */}
          <View style={styles.modulesList}>
            {MODULES.map((item, index) => (
              <TouchableOpacity
                key={`${item.id}-${index}`}
                style={styles.moduleCard}
                activeOpacity={0.85}
                onPress={() => router.push(`/materi/${item.id}`)}
              >
                <View style={styles.codeIconCircle}>
                  <Ionicons name="code-slash" size={18} color="#2B7BF6" />
                </View>

                <View style={styles.moduleInfo}>
                  <Text style={styles.moduleTitle}>{item.title}</Text>
                  <View style={styles.durationRow}>
                    <Ionicons name="time-outline" size={12} color="#64748B" />
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                </View>

                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#2B7BF6"
                  style={styles.docIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E8FE',
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B7BF6',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    gap: 4,
  },
  backPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  blueHighlight: {
    color: '#2B7BF6',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 14,
    fontWeight: '500',
  },
  progressCard: {
    backgroundColor: '#2B7BF6',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    marginBottom: 10,
  },
  progressBarFill: {
    width: '12%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  careerTrackBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  careerTrackBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modulesList: {
    gap: 10,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  codeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  durationText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  docIcon: {
    marginLeft: 8,
  },
});
