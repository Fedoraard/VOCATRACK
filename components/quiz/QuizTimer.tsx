import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuizTimerProps {
  durationSeconds?: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  durationSeconds = 25,
  onTimeUp,
  isPaused = false,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds);

  useEffect(() => {
    setSecondsRemaining(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (isPaused) return;

    if (secondsRemaining <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsRemaining, isPaused, onTimeUp]);

  const percentage = (secondsRemaining / durationSeconds) * 100;

  const getTimerColor = () => {
    if (secondsRemaining <= 5) return '#EF4444'; // Red
    if (secondsRemaining <= 10) return '#F59E0B'; // Amber
    return '#4F46E5'; // Indigo
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.iconAndText}>
          <Ionicons name="timer-outline" size={16} color={getTimerColor()} />
          <Text style={[styles.timerText, { color: getTimerColor() }]}>
            Sisa Waktu: {secondsRemaining} detik
          </Text>
        </View>
        <Text style={styles.totalDurationText}>{durationSeconds}s</Text>
      </View>

      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${percentage}%`, backgroundColor: getTimerColor() },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
  },
  totalDurationText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
