import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';

interface FloatingVocaBotButtonProps {
  onPress?: () => void;
}

export const FloatingVocaBotButton: React.FC<FloatingVocaBotButtonProps> = ({
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/vocabot');
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={styles.circleButton}
      accessibilityLabel="Tanya VocaBot AI Assistant"
      accessibilityRole="button"
    >
      <Image
        source={require('../../assets/vocabot_head_white.png')}
        style={styles.botIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3480FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 8,
  },
  botIcon: {
    width: 28,
    height: 30,
  },
});
