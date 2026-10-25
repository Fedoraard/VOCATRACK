import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MateriScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; title?: string }>();

  const title = params.title || 'Pengenalan Dasar: HTML Basic';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Video Thumbnail Header */}
      <View style={styles.videoWrapper}>
        <Image
          source={require('../../assets/materi_video_thumb.png')}
          style={styles.videoImage}
          resizeMode="cover"
        />

        {/* Back Button Overlay */}
        <TouchableOpacity
          style={[styles.backButton, { top: Math.max(insets.top, 16) }]}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Thin bottom blue border */}
        <View style={styles.videoBorderBottom} />
      </View>

      {/* Content Section */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 20 },
        ]}
      >
        {/* Title */}
        <Text style={styles.materiTitle}>{title}</Text>

        {/* Description */}
        <Text style={styles.materiDesc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>

        {/* Action 1: Latihan Soal */}
        <TouchableOpacity
          style={styles.actionRow}
          activeOpacity={0.8}
          onPress={() => router.push('/quiz/quiz-03')}
        >
          <View style={styles.actionIconBadge}>
            <Ionicons name="document-text-outline" size={26} color="#2B7BF6" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Latihan Soal</Text>
            <Text style={styles.actionSubtitle}>
              Ayo kerjakan latihan, untuk mengasah kemampuanmu
            </Text>
          </View>
        </TouchableOpacity>

        {/* Action 2: Lihat Rangkuman */}
        <TouchableOpacity style={styles.actionRow} activeOpacity={0.8}>
          <View style={styles.actionIconBadge}>
            <Ionicons name="reader-outline" size={26} color="#2B7BF6" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Lihat Rangkuman</Text>
            <Text style={styles.actionSubtitle}>
              Lihat rangkuman dari video yang kamu tonton
            </Text>
          </View>
        </TouchableOpacity>

        {/* Bottom Button: Materi Selanjutnya */}
        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.88}
          onPress={() => router.push('/quiz/quiz-03')}
        >
          <Text style={styles.nextButtonText}>Materi Selanjutnya</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  videoWrapper: {
    width: '100%',
    height: 220,
    backgroundColor: '#0F172A',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  playIconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBorderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#2B7BF6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  materiTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2B7BF6',
    marginBottom: 10,
  },
  materiDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'justify',
    fontWeight: '400',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  actionIconBadge: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2B7BF6',
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#2B7BF6',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
