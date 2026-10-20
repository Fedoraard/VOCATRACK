import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface FloatingVocaBotButtonProps {
  size?: 'normal' | 'compact';
  onPress?: () => void;
}

export const FloatingVocaBotButton: React.FC<FloatingVocaBotButtonProps> = ({
  size = 'normal',
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/vocabot');
    }
  };

  const isNormal = size === 'normal';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={[styles.container, isNormal ? styles.normalSize : styles.compactSize]}
      accessibilityLabel="Tanya VocaBot AI Assistant"
      accessibilityRole="button"
    >
      <View style={styles.gradientBg}>
        <Ionicons name="sparkles" size={isNormal ? 26 : 22} color="#FFFFFF" />
      </View>
      {isNormal && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AI</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  normalSize: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginTop: -24,
  },
  compactSize: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  gradientBg: {
    width: '100%',
    height: '100%',
    borderRadius: 31,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#06B6D4',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
