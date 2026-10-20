import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SearchBar } from '../../components/common/SearchBar';
import { JurusanCard } from '../../components/jurusan/JurusanCard';
import { useJurusanSearch } from '../../hooks/useJurusanSearch';
import { useAppStore } from '../../store/useAppStore';
import { JurusanVokasi } from '../../utils/types';

export default function JurusanScreen() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredJurusan,
    handleClearSearch,
    totalCount,
  } = useJurusanSearch();

  const setSelectedJurusanId = useAppStore((state) => state.setSelectedJurusanId);

  // Terapkan useCallback pada onPress item jurusan agar referensi fungsi stabil
  const handlePressJurusan = useCallback(
    (jurusan: JurusanVokasi) => {
      setSelectedJurusanId(jurusan.id);
      // Navigasi ke Peta Keterampilan (Skill-Tree) untuk jurusan yang dipilih
      router.push('/(tabs)/skilltree');
    },
    [setSelectedJurusanId]
  );

  const renderItem = useCallback(
    ({ item }: { item: JurusanVokasi }) => (
      <JurusanCard jurusan={item} onPress={handlePressJurusan} />
    ),
    [handlePressJurusan]
  );

  const keyExtractor = useCallback((item: JurusanVokasi) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Eksplorasi Keahlian Vokasi</Text>
          <Text style={styles.headerTitle}>Pilihan Jurusan & Karir</Text>
        </View>

        {/* SearchBar dengan Filter Chips */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          placeholder="Cari jurusan, keahlian, atau karir..."
        />

        {/* Info Count */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            Menampilkan <Text style={styles.countHighlight}>{totalCount}</Text> program keahlian
          </Text>
        </View>

        {/* Optimized FlatList with memoized items and stable callback */}
        <FlatList
          data={filteredJurusan}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={5}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Jurusan Tidak Ditemukan</Text>
              <Text style={styles.emptyDesc}>
                Coba gunakan kata kunci lain seperti "IT", "Jaringan", "Desain", atau "Mesin".
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 10,
    marginBottom: 14,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  countRow: {
    marginBottom: 8,
  },
  countText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  countHighlight: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
