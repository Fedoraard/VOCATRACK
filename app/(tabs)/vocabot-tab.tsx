import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

export default function VocaBotTabPlaceholder() {
  useEffect(() => {
    router.replace('/vocabot');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" color="#4F46E5" />
    </View>
  );
}
