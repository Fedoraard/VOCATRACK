import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../store/useAppStore';

export default function ProfileScreen() {
  const { logout, loginWithBiometrics } = useAuth();
  const user = useAppStore((state) => state.user);

  const handleTestBiometrics = async () => {
    const success = await loginWithBiometrics();
    if (success) {
      Alert.alert('Sukses', 'Sensor biometrik aktif dan terverifikasi!');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun VocaTrack?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>AF</Text>
          </View>
          <Text style={styles.userName}>{user?.namaLengkap || 'Ahmad Faiz Al-Rasyid'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'siswa.vokasi@vocatrack.id'}</Text>
          <View style={styles.schoolBadge}>
            <Ionicons name="school" size={13} color="#4F46E5" />
            <Text style={styles.schoolText}>{user?.asalSekolah || 'SMKN 1 Cimahi'}</Text>
          </View>
        </View>

        {/* Milestone Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Level {user?.level || 3}</Text>
            <Text style={styles.statLabel}>Peringkat Siswa</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user?.totalXp || 850}</Text>
            <Text style={styles.statLabel}>Total Poin XP</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Modul Tuntas</Text>
          </View>
        </View>

        {/* Security & Settings Section */}
        <Text style={styles.sectionHeader}>Keamanan & Preferensi Native</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleTestBiometrics}
          activeOpacity={0.8}
        >
          <View style={styles.settingIconContainer}>
            <Ionicons name="finger-print" size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Uji Autentikasi Biometrik</Text>
            <Text style={styles.settingSubtitle}>
              Gunakan sensor sidik jari / FaceID perangkat Anda
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Perlindungan Layar (FLAG_SECURE)</Text>
            <Text style={styles.settingSubtitle}>
              Mencegah tangkapan layar ilegal saat evaluasi & kuis
            </Text>
          </View>
          <Text style={styles.activeStatusText}>Aktif</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  schoolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    marginTop: 10,
  },
  schoolText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  settingSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  activeStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 24,
    gap: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
});
