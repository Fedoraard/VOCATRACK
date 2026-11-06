import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { CareerTargetModal } from '../../components/jurusan/CareerTargetModal';
import { EducationAppBackground } from '../../components/common/EducationAppBackground';
import { LearningMode, CareerTrackId } from '../../types/contracts';

interface JurusanItem {
  id: string;
  code: string;
  name: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const JURUSAN_LIST: JurusanItem[] = [
  { id: 'jur-05', code: 'RPL', name: 'Rekayasa Perangkat Lunak (Pilot 3 Profesi)', iconName: 'desktop-outline' },
  { id: 'jur-01', code: 'TKJ', name: 'Teknik Komputer Jaringan', iconName: 'globe-outline' },
  { id: 'jur-02', code: 'DKV', name: 'Desain Komunikasi Visual', iconName: 'color-palette-outline' },
  { id: 'jur-03', code: 'TKR', name: 'Teknik Kendaraan Ringan', iconName: 'car-outline' },
  { id: 'jur-04', code: 'TEI', name: 'Teknik Elektronika Industri', iconName: 'hardware-chip-outline' },
  { id: 'jur-06', code: 'TITL', name: 'Teknik Instalasi Tenaga Listrik', iconName: 'flash-outline' },
];

interface CareerTrackItem {
  id: CareerTrackId;
  title: string;
  subtitle: string;
  modules: string[];
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const CAREER_TRACKS: CareerTrackItem[] = [
  {
    id: 'FRONTEND',
    title: 'Frontend Web Developer',
    subtitle: 'HTML5/CSS3, JavaScript DOM, React, & State Management',
    modules: ['FND-01', 'FND-02', 'FND-03', 'FE-01', 'FE-02'],
    icon: 'browsers-outline',
    color: '#2563EB',
  },
  {
    id: 'BACKEND',
    title: 'Backend Developer',
    subtitle: 'Node.js, Express, REST API, & Database PostgreSQL Relasional',
    modules: ['FND-01', 'FND-02', 'FND-03', 'BE-01', 'BE-02'],
    icon: 'server-outline',
    color: '#059669',
  },
  {
    id: 'MOBILE',
    title: 'Mobile App Developer',
    subtitle: 'React Native, Expo, State Offline, & Custom Video Controls',
    modules: ['FND-01', 'FND-02', 'FND-03', 'MO-01', 'MO-02'],
    icon: 'phone-portrait-outline',
    color: '#7C3AED',
  },
];

export default function JurusanScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState('RPL');

  const learningMode = useAppStore((state) => state.learningMode);
  const targetCareer = useAppStore((state) => state.targetCareer);
  const setLearningMode = useAppStore((state) => state.setLearningMode);
  const setTargetCareer = useAppStore((state) => state.setTargetCareer);
  const setSelectedJurusanId = useAppStore((state) => state.setSelectedJurusanId);

  const filteredList = JURUSAN_LIST.filter(
    (item) =>
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectJurusan = (item: JurusanItem) => {
    setSelectedJurusanId(item.id);
    setSelectedCode(item.code);
    setModalVisible(true);
  };

  const handleSelectCareerTrack = (career: CareerTrackId) => {
    setTargetCareer(career);
    router.push('/(tabs)/skilltree');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <EducationAppBackground />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Title */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Pilih <Text style={styles.blueHighlight}>Jalur Profesi</Text> &
            </Text>
            <Text style={styles.headerTitle}>
              Arah <Text style={styles.blueHighlight}>Kariermu</Text>
            </Text>
            <Text style={styles.headerSubtitle}>
              Pilih mode belajar dan fokus pada salah satu dari 3 profesi RPL pilot VocaTrack.
            </Text>
          </View>

          {/* Banner Pemeriksaan Awal (T-52, F-02) */}
          <TouchableOpacity
            style={styles.placementBanner}
            activeOpacity={0.88}
            onPress={() => router.push('/placement')}
          >
            <View style={styles.placementIconCircle}>
              <Ionicons name="sparkles" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.placementTextWrapper}>
              <Text style={styles.placementBannerTitle}>Pemeriksaan Kemampuan Awal</Text>
              <Text style={styles.placementBannerSubtitle}>
                9 Indikator awal untuk rekomendasi titik mulai & kelayakan langsung evaluasi.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#2B7BF6" />
          </TouchableOpacity>

          {/* Mode Belajar Switcher (Mode Terarah vs Mode Eksplorasi) (F-03) */}
          <View style={styles.modeSectionCard}>
            <View style={styles.modeSectionHeader}>
              <Ionicons name="options-outline" size={18} color="#2B7BF6" />
              <Text style={styles.modeSectionTitle}>Mode Pembelajaran Siswa (F-03)</Text>
            </View>

            <View style={styles.modeToggleGroup}>
              <TouchableOpacity
                style={[
                  styles.modeToggleBtn,
                  learningMode === 'DIRECTED' && styles.modeToggleBtnActive,
                ]}
                onPress={() => setLearningMode('DIRECTED')}
              >
                <Ionicons
                  name="navigate"
                  size={16}
                  color={learningMode === 'DIRECTED' ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.modeToggleText,
                    learningMode === 'DIRECTED' && styles.modeToggleTextActive,
                  ]}
                >
                  Mode Terarah
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeToggleBtn,
                  learningMode === 'EXPLORATION' && styles.modeToggleBtnActive,
                ]}
                onPress={() => setLearningMode('EXPLORATION')}
              >
                <Ionicons
                  name="compass"
                  size={16}
                  color={learningMode === 'EXPLORATION' ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.modeToggleText,
                    learningMode === 'EXPLORATION' && styles.modeToggleTextActive,
                  ]}
                >
                  Mode Eksplorasi
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modeExplainer}>
              {learningMode === 'DIRECTED'
                ? 'Mode Terarah: Memfokuskan alur pada 1 profesi pilihan Anda (Fondasi -> Modul Spesialisasi -> Proyek Akhir).'
                : 'Mode Eksplorasi: Membuka visualisasi graf menyeluruh untuk mempelajari materi lintas profesi sesuai prasyarat.'}
            </Text>
          </View>

          {/* 3 Profesi Utama RPL (Pilot) */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>3 Jalur Profesi Unggulan (RPL)</Text>
            <TouchableOpacity onPress={() => router.push('/recommendation')}>
              <Text style={styles.sectionLink}>Rekomendasi Karir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.careerCardsCol}>
            {CAREER_TRACKS.map((track) => {
              const isSelected = targetCareer === track.id;
              return (
                <TouchableOpacity
                  key={track.id}
                  style={[styles.careerCard, isSelected && styles.careerCardSelected]}
                  activeOpacity={0.88}
                  onPress={() => handleSelectCareerTrack(track.id)}
                >
                  <View style={[styles.careerIconBox, { backgroundColor: track.color }]}>
                    <Ionicons name={track.icon} size={24} color="#FFFFFF" />
                  </View>

                  <View style={styles.careerInfo}>
                    <View style={styles.careerTitleRow}>
                      <Text style={styles.careerTitle}>{track.title}</Text>
                      {isSelected && (
                        <View style={styles.selectedPill}>
                          <Text style={styles.selectedPillText}>Fokus Saat Ini</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.careerSubtitle}>{track.subtitle}</Text>

                    <View style={styles.modulePillsRow}>
                      {track.modules.map((m) => (
                        <View key={m} style={styles.trackModulePill}>
                          <Text style={styles.trackModulePillText}>{m}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Akses Pintas Proyek Akhir & Reviewer */}
          <View style={styles.shortcutsRow}>
            <TouchableOpacity
              style={styles.shortcutCard}
              activeOpacity={0.85}
              onPress={() => router.push('/proyek')}
            >
              <Ionicons name="construct-outline" size={20} color="#2B7BF6" />
              <View style={{ flex: 1 }}>
                <Text style={styles.shortcutTitle}>Proyek Siswa (T-67)</Text>
                <Text style={styles.shortcutSub}>Brief & Pengumpulan</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutCard}
              activeOpacity={0.85}
              onPress={() => router.push('/reviewer')}
            >
              <Ionicons name="clipboard-outline" size={20} color="#059669" />
              <View style={{ flex: 1 }}>
                <Text style={styles.shortcutTitle}>Layar Reviewer (T-70)</Text>
                <Text style={styles.shortcutSub}>Penilaian Rubrik Internal</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Daftar Jurusan SMK Konvensional */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>
            Daftar Jurusan Kejuruan Lainnya
          </Text>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <Ionicons name="search-outline" size={18} color="#2B7BF6" style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari jurusan SMK..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />
          </View>

          <View style={styles.cardsList}>
            {filteredList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.jurusanCard}
                activeOpacity={0.85}
                onPress={() => handleSelectJurusan(item)}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={item.iconName} size={22} color="#2B7BF6" />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardCode}>{item.code}</Text>
                  <Text style={styles.cardName}>{item.name}</Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Modal Target Karir Jurusan */}
        <CareerTargetModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          jurusanCode={selectedCode}
        />
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 28,
  },
  blueHighlight: {
    color: '#2B7BF6',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    fontWeight: '500',
  },
  placementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  placementIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2B7BF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  placementTextWrapper: {
    flex: 1,
  },
  placementBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  placementBannerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  modeSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  modeSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  modeToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 8,
  },
  modeToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
  },
  modeToggleBtnActive: {
    backgroundColor: '#2B7BF6',
  },
  modeToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modeExplainer: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  careerCardsCol: {
    gap: 12,
    marginBottom: 16,
  },
  careerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  careerCardSelected: {
    borderColor: '#2B7BF6',
    backgroundColor: '#F8FAFC',
  },
  careerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  careerInfo: {
    flex: 1,
  },
  careerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  careerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  selectedPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  selectedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  careerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
    lineHeight: 15,
  },
  modulePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  trackModulePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trackModulePillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  shortcutCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shortcutTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  shortcutSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  cardsList: {
    gap: 8,
  },
  jurusanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2B7BF6',
  },
  cardName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 1,
  },
});
