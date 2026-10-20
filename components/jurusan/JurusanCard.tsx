import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JurusanVokasi } from '../../utils/types';

interface JurusanCardProps {
  jurusan: JurusanVokasi;
  onPress: (jurusan: JurusanVokasi) => void;
}

export const JurusanCard: React.FC<JurusanCardProps> = React.memo(({ jurusan, onPress }) => {
  const progressPercent = Math.round((jurusan.modulSelesai / Math.max(1, jurusan.totalModul)) * 100);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(jurusan)}
      style={styles.card}
    >
      {/* Header: Badge Kode, Category, Match Score */}
      <View style={styles.headerRow}>
        <View style={styles.codeAndCat}>
          <View style={[styles.codeBadge, { backgroundColor: `${jurusan.warnaTema}15` }]}>
            <Text style={[styles.codeText, { color: jurusan.warnaTema }]}>
              {jurusan.kode}
            </Text>
          </View>
          <Text style={styles.categoryText}>{jurusan.kategori}</Text>
        </View>

        {jurusan.tingkatKecocokan !== undefined && (
          <View style={styles.matchBadge}>
            <Ionicons name="sparkles" size={12} color="#4F46E5" />
            <Text style={styles.matchText}>{jurusan.tingkatKecocokan}% Cocok</Text>
          </View>
        )}
      </View>

      {/* Title & Description */}
      <Text style={styles.title}>{jurusan.nama}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {jurusan.deskripsi}
      </Text>

      {/* Career Tags */}
      <View style={styles.careerRow}>
        {jurusan.peluangKarir.slice(0, 3).map((karir, idx) => (
          <View key={idx} style={styles.careerChip}>
            <Text style={styles.careerChipText}>{karir}</Text>
          </View>
        ))}
      </View>

      {/* Footer: Progress and CTA */}
      <View style={styles.footerRow}>
        <View style={styles.progressInfo}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%`, backgroundColor: jurusan.warnaTema },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {jurusan.modulSelesai}/{jurusan.totalModul} Modul Selesai ({progressPercent}%)
          </Text>
        </View>

        <View style={styles.arrowIcon}>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </View>
      </View>
    </TouchableOpacity>
  );
});

JurusanCard.displayName = 'JurusanCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  codeAndCat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  categoryText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  matchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    marginBottom: 12,
  },
  careerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  careerChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  careerChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  progressInfo: {
    flex: 1,
    marginRight: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  arrowIcon: {
    backgroundColor: '#F8FAFC',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
