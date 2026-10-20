import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialLoginButtonProps {
  provider: 'google' | 'apple' | 'biometric';
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  title,
  onPress,
  disabled = false,
}) => {
  const getIcon = () => {
    switch (provider) {
      case 'google':
        return <Ionicons name="logo-google" size={20} color="#EA4335" />;
      case 'apple':
        return <Ionicons name="logo-apple" size={20} color="#000000" />;
      case 'biometric':
        return <Ionicons name="finger-print" size={22} color="#4F46E5" />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        provider === 'biometric' && styles.biometricButton,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <Text
        style={[
          styles.text,
          provider === 'biometric' && styles.biometricText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    height: 50,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  biometricButton: {
    borderColor: '#C7D2FE',
    backgroundColor: '#EEF2FF',
  },
  disabled: {
    opacity: 0.6,
  },
  iconContainer: {
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  biometricText: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});
