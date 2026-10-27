import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SkillTreeNode } from '../../components/skilltree/SkillTreeNode';
import { useAppStore } from '../../store/useAppStore';
import { NodeBab } from '../../utils/types';
import { EducationAppBackground } from '../../components/common/EducationAppBackground';

export default function SkillTreeScreen() {
  const nodes = useAppStore((state) => state.nodes);
  const jurusanList = useAppStore((state) => state.jurusanList);
  const selectedJurusanId = useAppStore((state) => state.selectedJurusanId);

  const currentJurusan =
    jurusanList.find((j) => j.id === selectedJurusanId) || jurusanList[0];

  // Reanimated shared values untuk Pan (geser) dan Pinch (zoom)
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Pan Gesture
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Pinch Gesture (Zoom)
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const nextScale = savedScale.value * e.scale;
      // Batasi zoom antara 0.75x hingga 1.6x
      if (nextScale >= 0.75 && nextScale <= 1.6) {
        scale.value = nextScale;
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleResetZoom = useCallback(() => {
    scale.value = withSpring(1);
    savedScale.value = 1;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  }, [scale, savedScale, translateX, translateY, savedTranslateX, savedTranslateY]);

  const handleNodePress = useCallback((node: NodeBab) => {
    router.push({
      pathname: '/materi/[id]',
      params: { id: node.materiId, nodeTitle: node.title, quizId: node.quizId || 'quiz-03' },
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <EducationAppBackground />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Peta Keterampilan (Skill-Tree)</Text>
          <Text style={styles.headerTitle}>{currentJurusan.nama}</Text>
        </View>

        <TouchableOpacity
          onPress={handleResetZoom}
          style={styles.resetButton}
          accessibilityLabel="Reset posisi kanvas"
        >
          <Ionicons name="scan-outline" size={18} color="#4F46E5" />
          <Text style={styles.resetText}>Fokus</Text>
        </TouchableOpacity>
      </View>

      {/* Guide Banner */}
      <View style={styles.guideBanner}>
        <Ionicons name="hand-left-outline" size={14} color="#64748B" />
        <Text style={styles.guideText}>
          Gunakan 2 jari untuk zoom & geser kanvas bebas untuk melihat cabang pohon skill
        </Text>
      </View>

      {/* Interactive Canvas */}
      <View style={styles.canvasContainer}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[styles.canvasSurface, animatedStyle]}>
            {nodes.map((node) => (
              <SkillTreeNode
                key={node.id}
                node={node}
                onPress={handleNodePress}
              />
            ))}
          </Animated.View>
        </GestureDetector>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  guideBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  guideText: {
    fontSize: 11,
    color: '#64748B',
  },
  canvasContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  canvasSurface: {
    padding: 20,
    minHeight: '100%',
  },
});
