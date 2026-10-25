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

interface JurusanItem {
  id: string;
  code: string;
  name: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const JURUSAN_LIST: JurusanItem[] = [
  {
    id: 'jur-01',
    code: 'TKJ',
    name: 'Teknik Komputer Jaringan',
    iconName: 'globe-outline',
  },
  {
    id: 'jur-02',
    code: 'DKV',
    name: 'Desain Komunikasi Visual',
    iconName: 'color-palette-outline',
  },
  {
    id: 'jur-03',
    code: 'TKR',
    name: 'Teknik Kendaraan Ringan',
    iconName: 'car-outline',
  },
  {
    id: 'jur-04',
    code: 'TEI',
    name: 'Teknik Elektronika Industri',
    iconName: 'hardware-chip-outline',
  },
  {
    id: 'jur-05',
    code: 'RPL',
    name: 'Rekayasa Perangkat Lunak',
    iconName: 'desktop-outline',
  },
  {
    id: 'jur-06',
    code: 'TITL',
    name: 'Teknik Instalasi Tenaga Listrik',
    iconName: 'flash-outline',
  },
];

export default function JurusanScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState('TKJ');
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Title */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Pilih <Text style={styles.blueHighlight}>Jurusanmu</Text>, Tentukan
            </Text>
            <Text style={styles.headerTitle}>
              Arah <Text style={styles.blueHighlight}>Kariermu</Text>
            </Text>
            <Text style={styles.headerSubtitle}>
              Temukan jurusan yang sesuai denganmu dan lihat peluang karier,
              skill yang dibutuhkan, serta jalur belajar yang harus kamu tempuh.
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#2B7BF6"
              style={styles.searchIcon}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari jurusan..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchButton} activeOpacity={0.85}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Jurusan Cards List */}
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

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#94A3B8"
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Target Career Popup Modal (Image 2 & 5) */}
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
    paddingBottom: 32,
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
    marginTop: 8,
    fontWeight: '500',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 48,
    paddingLeft: 14,
    paddingRight: 6,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#2B7BF6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardsList: {
    gap: 10,
  },
  jurusanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardCode: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  cardName: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  chevronIcon: {
    marginLeft: 8,
  },
});
