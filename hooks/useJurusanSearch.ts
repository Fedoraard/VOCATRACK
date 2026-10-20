import { useState, useMemo, useCallback } from 'react';
import { JurusanVokasi } from '../utils/types';
import { useAppStore } from '../store/useAppStore';

export function useJurusanSearch() {
  const jurusanList = useAppStore((state) => state.jurusanList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Ekstrak daftar kategori unik untuk tombol chip filter
  const categories = useMemo(() => {
    const list = Array.from(new Set(jurusanList.map((j) => j.kategori)));
    return ['Semua', ...list];
  }, [jurusanList]);

  // Logika pencarian & filter dengan useMemo agar FlatList tidak re-render sia-sia
  const filteredJurusan = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return jurusanList.filter((item) => {
      const matchQuery =
        !query ||
        item.nama.toLowerCase().includes(query) ||
        item.kode.toLowerCase().includes(query) ||
        item.deskripsi.toLowerCase().includes(query) ||
        item.peluangKarir.some((karir) => karir.toLowerCase().includes(query));

      const matchCategory =
        selectedCategory === 'Semua' || item.kategori === selectedCategory;

      return matchQuery && matchCategory;
    });
  }, [jurusanList, searchQuery, selectedCategory]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredJurusan,
    handleClearSearch,
    totalCount: filteredJurusan.length,
  };
}
