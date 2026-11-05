import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EducationAppBackground } from '../../components/common/EducationAppBackground';
import { useAppStore } from '../../store/useAppStore';
import { CurriculumService, ALL_CURRICULUM_MODULES } from '../../services/api/curriculumService';
import { ProgressService } from '../../services/api/progressService';
import { ModuleVersion, ProgressProjection, LearningMode, CareerTrackId } from '../../types/contracts';

/**
 * PETA KETERAMPILAN / SKILL-TREE (T-52, F-03, F-04, F-05)
 * Mendukung 2 Mode:
 * 1. Mode Terarah: Memetakan 1 jalur profesi pilihan (Fondasi -> Modul Spesialisasi -> Proyek Siswa).
 * 2. Mode Eksplorasi: Menampilkan visualisasi graf 9 modul lengkap lintas cabang dengan status prasyarat.
 * 
 * 4 Status Resmi:
 * - Terkunci (Locked)
 * - Belum Dikuasai (Unlocked / Belum lulus)
 * - Sedang Dipelajari (In Progress)
 * - Sudah Lulus (Passed Historically >= 70)
 */

export default function SkillTreeScreen() {
  const user = useAppStore((state) => state.user);
  const learningMode = useAppStore((state) => state.learningMode);
  const targetCareer = useAppStore((state) => state.targetCareer);
  const setLearningMode = useAppStore((state) => state.setLearningMode);
  const setTargetCareer = useAppStore((state) => state.setTargetCareer);

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<ModuleVersion[]>([]);
  const [progress, setProgress] = useState<ProgressProjection | null>(null);

  const loadTreeData = useCallback(async () => {
    try {
      setLoading(true);
      const studentId = user?.id || 'user-001';
      const [mods, prog] = await Promise.all([
        CurriculumService.getModules(),
        ProgressService.getProgress(studentId),
      ]);
      setModules(mods);
      setProgress(prog);
    } catch (err) {
      console.error('Error loading skill tree:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTreeData();
  }, [loadTreeData]);

  const handleNodePress = (mod: ModuleVersion, isLocked: boolean) => {
    if (isLocked) return;
    router.push({
      pathname: '/materi/[id]',
      params: { id: mod.id, title: mod.title },
    });
  };

  // Filter modul jika dalam Mode Terarah
  const displayedModules =
    learningMode === 'DIRECTED'
      ? CurriculumService.getModulesForCareer(targetCareer)
      : modules;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <EducationAppBackground />

      {/* Header Bar */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSubtitle}>Peta Keterampilan (Skill-Tree)</Text>
          <Text style={styles.headerTitle}>
            {learningMode === 'DIRECTED'
              ? `Jalur ${targetCareer === 'FRONTEND' ? 'Frontend Web' : targetCareer === 'BACKEND' ? 'Backend' : 'Mobile'}`
              : 'Eksplorasi Kurikulum Lengkap'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.placementBtn}
          onPress={() => router.push('/placement')}
        >
          <Ionicons name="sparkles" size={14} color="#FFFFFF" />
          <Text style={styles.placementBtnText}>Tes Awal</Text>
        </TouchableOpacity>
      </View>

      {/* Mode Switcher Banner (F-03) */}
      <View style={styles.modeBar}>
        <View style={styles.modeToggleGroup}>
          <TouchableOpacity
            style={[styles.modeBtn, learningMode === 'DIRECTED' && styles.modeBtnActive]}
            onPress={() => setLearningMode('DIRECTED')}
          >
            <Ionicons
              name="navigate"
              size={14}
              color={learningMode === 'DIRECTED' ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[
                styles.modeBtnText,
                learningMode === 'DIRECTED' && styles.modeBtnTextActive,
              ]}
            >
              Mode Terarah
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, learningMode === 'EXPLORATION' && styles.modeBtnActive]}
            onPress={() => setLearningMode('EXPLORATION')}
          >
            <Ionicons
              name="compass"
              size={14}
              color={learningMode === 'EXPLORATION' ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[
                styles.modeBtnText,
                learningMode === 'EXPLORATION' && styles.modeBtnTextActive,
              ]}
            >
              Mode Eksplorasi
            </Text>
          </TouchableOpacity>
        </View>

        {/* Jika Mode Terarah, Tampilkan Pilihan Karir Fokus */}
        {learningMode === 'DIRECTED' && (
          <View style={styles.careerTrackPillRow}>
            {(['FRONTEND', 'BACKEND', 'MOBILE'] as CareerTrackId[]).map((cr) => {
              const isAct = targetCareer === cr;
              return (
                <TouchableOpacity
                  key={cr}
                  style={[styles.careerPill, isAct && styles.careerPillActive]}
                  onPress={() => setTargetCareer(cr)}
                >
                  <Text style={[styles.careerPillText, isAct && styles.careerPillTextActive]}>
                    {cr === 'FRONTEND' ? 'Frontend' : cr === 'BACKEND' ? 'Backend' : 'Mobile'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Konten Pohon Keterampilan */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#2B7BF6" />
          <Text style={styles.loadingText}>Memuat graf kurikulum...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.treeScrollContainer}
        >
          {/* Legenda 4 Status Resmi */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#16A34A' }]} />
              <Text style={styles.legendText}>{'Lulus (>= 70)'}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2B7BF6' }]} />
              <Text style={styles.legendText}>Terbuka</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.legendText}>Sedang Belajar</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#94A3B8' }]} />
              <Text style={styles.legendText}>Terkunci</Text>
            </View>
          </View>

          {/* Node Modul Berurutan dengan Prasyarat */}
          <View style={styles.nodesWrapper}>
            {displayedModules.map((mod, idx) => {
              const modProg = progress?.modules[mod.id];
              const isPassed = Boolean(modProg?.hasPassedHistorically);
              const isUnlocked = Boolean(modProg?.isUnlocked);
              const isRead = Boolean(modProg?.isReadCompleted);
              const isVideo = Boolean(modProg?.isVideoCompleted100);
              const isInProgress = !isPassed && isUnlocked && (isRead || isVideo);
              const isLocked = !isUnlocked;

              let nodeThemeColor = '#2B7BF6'; // Default blue
              let statusLabel = 'Belum Dikuasai';
              let statusIcon: keyof typeof Ionicons.glyphMap = 'play';

              if (isPassed) {
                nodeThemeColor = '#16A34A';
                statusLabel = `Lulus (${modProg?.latestScore || 100})`;
                statusIcon = 'checkmark-circle';
              } else if (isLocked) {
                nodeThemeColor = '#94A3B8';
                statusLabel = 'Terkunci';
                statusIcon = 'lock-closed';
              } else if (isInProgress) {
                nodeThemeColor = '#F59E0B';
                statusLabel = 'Sedang Dipelajari';
                statusIcon = 'time';
              }

              return (
                <View key={mod.id} style={styles.nodeItemRow}>
                  {/* Garis Penghubung Alur (Connecting Spine) */}
                  {idx > 0 && <View style={styles.connectingSpine} />}

                  <TouchableOpacity
                    style={[
                      styles.nodeCard,
                      isLocked && styles.nodeCardLocked,
                      isPassed && styles.nodeCardPassed,
                    ]}
                    activeOpacity={isLocked ? 1 : 0.85}
                    onPress={() => handleNodePress(mod, isLocked)}
                  >
                    {/* Status Circle Icon */}
                    <View style={[styles.nodeIconCircle, { backgroundColor: nodeThemeColor }]}>
                      <Ionicons name={statusIcon} size={20} color="#FFFFFF" />
                    </View>

                    {/* Node Info */}
                    <View style={styles.nodeInfo}>
                      <View style={styles.nodeHeaderRow}>
                        <View style={styles.modCodePill}>
                          <Text style={styles.modCodeText}>{mod.id}</Text>
                        </View>
                        <Text style={styles.modCategoryText}>{mod.category}</Text>
                        <View
                          style={[
                            styles.nodeStatusBadge,
                            { backgroundColor: `${nodeThemeColor}18` },
                          ]}
                        >
                          <Text style={[styles.nodeStatusBadgeText, { color: nodeThemeColor }]}>
                            {statusLabel}
                          </Text>
                        </View>
                      </View>

                      <Text style={[styles.nodeTitle, isLocked && styles.nodeTitleLocked]}>
                        {mod.title}
                      </Text>
                      <Text style={styles.nodeSubtitle} numberOfLines={2}>
                        {mod.subtitle}
                      </Text>

                      {/* Prasyarat Info */}
                      {mod.prerequisiteModuleIds.length > 0 && (
                        <View style={styles.prereqRow}>
                          <Ionicons name="link-outline" size={13} color="#64748B" />
                          <Text style={styles.prereqText}>
                            Prasyarat: {mod.prerequisiteModuleIds.join(', ')}
                          </Text>
                        </View>
                      )}
                    </View>

                    {!isLocked && (
                      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Node Capstone Project di Ujung Mode Terarah */}
            {learningMode === 'DIRECTED' && (
              <View style={styles.nodeItemRow}>
                <View style={styles.connectingSpine} />
                <TouchableOpacity
                  style={[styles.nodeCard, styles.projectNodeCard]}
                  activeOpacity={0.88}
                  onPress={() => router.push('/proyek')}
                >
                  <View style={[styles.nodeIconCircle, { backgroundColor: '#7C3AED' }]}>
                    <Ionicons name="trophy" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.nodeInfo}>
                    <View style={styles.nodeHeaderRow}>
                      <View style={[styles.modCodePill, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={[styles.modCodeText, { color: '#7C3AED' }]}>PROYEK AKHIR</Text>
                      </View>
                    </View>
                    <Text style={styles.nodeTitle}>Proyek Pengelola Tugas Belajar</Text>
                    <Text style={styles.nodeSubtitle}>
                      Tugas belajar mandiri sesuai spesifikasi karir {targetCareer}.
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#7C3AED" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    marginTop: 1,
  },
  placementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2B7BF6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  placementBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modeBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modeToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 8,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modeBtnActive: {
    backgroundColor: '#2B7BF6',
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  careerTrackPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  careerPill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  careerPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2B7BF6',
  },
  careerPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  careerPillTextActive: {
    color: '#2B7BF6',
    fontWeight: '700',
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
  },
  treeScrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },
  nodesWrapper: {
    gap: 12,
  },
  nodeItemRow: {
    position: 'relative',
  },
  connectingSpine: {
    width: 2,
    height: 12,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: -2,
    marginTop: -10,
  },
  nodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  nodeCardLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.75,
  },
  nodeCardPassed: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  projectNodeCard: {
    borderColor: '#C4B5FD',
    backgroundColor: '#FAF5FF',
  },
  nodeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  modCodePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modCodeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2B7BF6',
  },
  modCategoryText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  nodeStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  nodeStatusBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  nodeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  nodeTitleLocked: {
    color: '#64748B',
  },
  nodeSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 4,
  },
  prereqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  prereqText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
});
