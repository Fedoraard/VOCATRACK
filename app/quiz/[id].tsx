import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

/**
 * REDIRECTOR LEGACY: Mengalihkan kuis lokal usang ke Evaluasi Resmi Server (T-28)
 */
export default function LegacyQuizRedirectScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  
  useEffect(() => {
    // Petakan quiz-01..03 ke modul kurikulum resmi (misal FND-01 atau FE-01)
    const quizId = params.id || 'FE-01';
    let targetModule = 'FE-01';
    if (quizId.includes('fnd') || quizId.includes('01')) targetModule = 'FND-01';
    else if (quizId.includes('fe-02')) targetModule = 'FE-02';
    else if (quizId.includes('mo')) targetModule = 'MO-01';

    router.replace(`/evaluasi/${targetModule}`);
  }, [params.id]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2B7BF6" />
      <Text style={styles.text}>Mengalihkan ke Evaluasi Resmi Server...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
  },
});
