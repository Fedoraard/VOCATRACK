import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AppState,
  AppStateStatus,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RequiredVideoSegment, WatchLearningEvent } from '../../types/contracts';

interface CustomVideoPlayerProps {
  moduleId: string;
  videoTitle: string;
  durationSeconds: number;
  requiredSegments?: RequiredVideoSegment[];
  onCoverageUpdate?: (coveragePercentage: number, isComplete: boolean) => void;
  onCompletion?: (event: WatchLearningEvent) => void;
}

/**
 * CUSTOM VIDEO PLAYER COMPONENT (T-09, F-05)
 * Memenuhi kriteria proof teknis T-09:
 * 1. Pencegahan seek mendahului segmen yang belum ditonton.
 * 2. Pengulangan bagian yang sudah ditonton diizinkan bebas.
 * 3. Otomatis jeda (pause) ketika aplikasi berada di latar belakang (AppState change).
 * 4. Perhitungan cakupan 100% berdasarkan durasi pembelajaran yang benar-benar dilalui.
 */
export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  moduleId,
  videoTitle,
  durationSeconds,
  requiredSegments = [],
  onCoverageUpdate,
  onCompletion,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPositionSeconds, setCurrentPositionSeconds] = useState(0);
  const [maxReachedSeconds, setMaxReachedSeconds] = useState(0);
  const [watchedIntervals, setWatchedIntervals] = useState<Array<{ start: number; end: number }>>([]);
  const [isCompleted100, setIsCompleted100] = useState(false);

  const timerRef = useRef<any>(null);

  // 1. Tangani jeda otomatis saat aplikasi di latar belakang
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setIsPlaying(false);
      }
    });

    return () => {
      subscription.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 2. Simulasi playback timer & akumulasi cakupan segmen
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentPositionSeconds((prev) => {
          const next = prev + 1;
          if (next >= durationSeconds) {
            setIsPlaying(false);
            return durationSeconds;
          }

          // Perbarui titik terjauh yang sah
          setMaxReachedSeconds((prevMax) => Math.max(prevMax, next));

          // Catat interval tontonan
          setWatchedIntervals((intervals) => {
            const currentSec = next;
            const updated = [...intervals, { start: currentSec - 1, end: currentSec }];
            return mergeIntervals(updated);
          });

          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, durationSeconds]);

  // 3. Hitung cakupan gabungan (union) tontonan
  useEffect(() => {
    const totalCoveredSec = calculateTotalCovered(watchedIntervals);
    const coveragePercentage = Math.min(100, Math.round((totalCoveredSec / durationSeconds) * 100));
    const complete = coveragePercentage >= 100;

    if (onCoverageUpdate) {
      onCoverageUpdate(coveragePercentage, complete);
    }

    if (complete && !isCompleted100) {
      setIsCompleted100(true);
      if (onCompletion) {
        const watchEvent: WatchLearningEvent = {
          eventId: `watch-${moduleId}-${Date.now()}`,
          moduleId,
          kind: 'WATCH',
          timestamp: new Date().toISOString(),
          watchedRanges: watchedIntervals.map((i) => ({ startMs: i.start * 1000, endMs: i.end * 1000 })),
          totalCoveredMs: totalCoveredSec * 1000,
          isCompleted100Percent: true,
        };
        onCompletion(watchEvent);
      }
    }
  }, [watchedIntervals, durationSeconds, moduleId, isCompleted100, onCoverageUpdate, onCompletion]);

  // 4. Validasi Seek: Jangan izinkan melompati segmen wajib yang belum tercapai!
  const handleSeek = useCallback(
    (targetSeconds: number) => {
      if (targetSeconds > maxReachedSeconds + 2) {
        Alert.alert(
          'Segmen Belum Terbuka',
          'Sesuai ketentuan pembelajaran, Anda tidak dapat melompati segmen video yang belum pernah ditonton. Silakan tonton secara berurutan.',
          [{ text: 'Mengerti' }]
        );
        return;
      }

      // Replay bagian lama diizinkan bebas
      setCurrentPositionSeconds(targetSeconds);
    },
    [maxReachedSeconds]
  );

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentPositionSeconds(0);
    setIsPlaying(true);
  };

  const coveragePercent = Math.min(
    100,
    Math.round((calculateTotalCovered(watchedIntervals) / durationSeconds) * 100)
  );

  return (
    <View style={styles.container}>
      {/* Video Viewport / Canvas */}
      <View style={styles.viewport}>
        <View style={styles.videoPlaceholder}>
          <Ionicons
            name={isPlaying ? 'videocam' : 'videocam-outline'}
            size={48}
            color="#3480FF"
          />
          <Text style={styles.videoTitleText} numberOfLines={2}>
            {videoTitle}
          </Text>
          <Text style={styles.videoTimeText}>
            {formatTime(currentPositionSeconds)} / {formatTime(durationSeconds)}
          </Text>
        </View>

        {/* Coverage Badge */}
        <View style={[styles.coverageBadge, isCompleted100 && styles.coverageBadgeComplete]}>
          <Ionicons
            name={isCompleted100 ? 'checkmark-circle' : 'time-outline'}
            size={14}
            color="#FFFFFF"
          />
          <Text style={styles.coverageBadgeText}>
            {isCompleted100 ? 'Selesai 100%' : `Cakupan: ${coveragePercent}%`}
          </Text>
        </View>
      </View>

      {/* Progress Bar & Seek Tracks */}
      <View style={styles.progressContainer}>
        {/* Full track */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.progressBarBg}
          onPress={(e) => {
            const clickX = e.nativeEvent.locationX;
            // approximate seek based on container width ratio
            // will be handled proportionally
          }}
        >
          {/* Watched Progress Fill */}
          <View
            style={[
              styles.progressBarFill,
              { width: `${(currentPositionSeconds / durationSeconds) * 100}%` },
            ]}
          />
          {/* Max Unlocked Track (Dapat di-seek) */}
          <View
            style={[
              styles.maxReachedTrack,
              { width: `${(maxReachedSeconds / durationSeconds) * 100}%` },
            ]}
          />
        </TouchableOpacity>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.controlBtnSecondary}
          onPress={() => handleSeek(Math.max(0, currentPositionSeconds - 10))}
          accessibilityLabel="Mundur 10 detik"
        >
          <Ionicons name="play-back-outline" size={20} color="#2B7BF6" />
          <Text style={styles.controlBtnSecText}>-10s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseBtn}
          onPress={togglePlay}
          accessibilityLabel={isPlaying ? 'Jeda video' : 'Putar video'}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtnSecondary}
          onPress={() => handleSeek(Math.min(maxReachedSeconds, currentPositionSeconds + 10))}
          accessibilityLabel="Maju 10 detik ke bagian yang sudah dibuka"
        >
          <Ionicons name="play-forward-outline" size={20} color="#2B7BF6" />
          <Text style={styles.controlBtnSecText}>+10s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtnSecondary}
          onPress={handleRestart}
          accessibilityLabel="Ulangi dari awal"
        >
          <Ionicons name="refresh-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Seek Notice Indicator */}
      <View style={styles.noticeRow}>
        <Ionicons name="information-circle-outline" size={14} color="#64748B" />
        <Text style={styles.noticeText}>
          Lompat maju dibatasi. Seluruh bagian wajib harus ditonton 100% untuk menyelesaikan materi.
        </Text>
      </View>
    </View>
  );
};

// Helper: Gabungkan rentang tontonan
function mergeIntervals(intervals: Array<{ start: number; end: number }>): Array<{ start: number; end: number }> {
  if (intervals.length <= 1) return intervals;
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const result: Array<{ start: number; end: number }> = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = result[result.length - 1];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      result.push(current);
    }
  }

  return result;
}

// Helper: Hitung total detik cakupan tontonan unik
function calculateTotalCovered(intervals: Array<{ start: number; end: number }>): number {
  return intervals.reduce((acc, curr) => acc + (curr.end - curr.start), 0);
}

// Helper: Format detik ke MM:SS
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  viewport: {
    height: 180,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoPlaceholder: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  videoTitleText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  videoTimeText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  coverageBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  coverageBadgeComplete: {
    backgroundColor: '#10B981',
  },
  coverageBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  progressContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  maxReachedTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#CBD5E1',
    opacity: 0.5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2B7BF6',
    borderRadius: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 16,
  },
  playPauseBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2B7BF6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  controlBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  controlBtnSecText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  noticeText: {
    fontSize: 10.5,
    color: '#64748B',
    flex: 1,
    lineHeight: 14,
  },
});
