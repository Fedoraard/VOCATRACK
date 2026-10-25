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
      style={styles.container}
      accessibilityLabel="Tanya VocaBot AI Assistant"
      accessibilityRole="button"
    >
      <Image
        source={require('../../assets/center_bot_btn.png')}
        style={styles.buttonImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    marginTop: -20,
  },
  buttonImage: {
    width: 64,
    height: 64,
  },
});
