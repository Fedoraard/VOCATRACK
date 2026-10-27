import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { EducationAppBackground } from '../../components/common/EducationAppBackground';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const displayName = user?.namaLengkap || 'dipdut';
  const displayEmail = user?.email || 'dipagntg12@gmail.com';
  const displayMajor = user?.jurusanDiminati || user?.asalSekolah || 'Teknik Komputer Jaringan';

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
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <EducationAppBackground />

      {/* Decorative background shapes */}
      <View style={styles.faintCircleTop} />
      <View style={styles.faintCircleMid} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Card 1: User Profile Header */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={40} color="#2B7BF6" />
              </View>
              {/* Camera Icon Badge */}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={13} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.userInfoCol}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{displayEmail}</Text>

              <View style={styles.majorBadge}>
                <Ionicons name="school" size={13} color="#2B7BF6" />
                <Text style={styles.majorText}>{displayMajor}</Text>
              </View>
            </View>
          </View>

          {/* Card 2: Lengkapi Profilmu */}
          <TouchableOpacity style={styles.completeProfileCard} activeOpacity={0.85}>
            <View style={styles.completeProfileHeader}>
              <Text style={styles.completeProfileTitle}>Lengkapi Profilmu</Text>
              <View style={styles.completeProfileRight}>
                <Text style={styles.completeProfileFraction}>3 dari 5 selesai</Text>
                <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </TouchableOpacity>

          {/* Card 3: Menu List */}
          <View style={styles.menuCard}>
            {/* Menu 1: Informasi Pribadi */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuIconCircle}>
                <Ionicons name="person" size={18} color="#2B7BF6" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Informasi Pribadi</Text>
                <Text style={styles.menuSubtitle}>Kelola data diri dan akunmu</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Menu 2: Minat dan Preferensi */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuIconCircle}>
                <Ionicons name="bookmark" size={18} color="#2B7BF6" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Minat dan Preferensi</Text>
                <Text style={styles.menuSubtitle}>
                  Atur minat jurusan dan bidang yang kamu suka
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Menu 3: Notifikasi */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuIconCircle}>
                <Ionicons name="notifications" size={18} color="#2B7BF6" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Notifikasi</Text>
                <Text style={styles.menuSubtitle}>
                  Atur jenis notifikasi yang ingin kamu terima
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Menu 4: Keamanan Akun */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuIconCircle}>
                <Ionicons name="shield-checkmark" size={18} color="#2B7BF6" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Keamanan Akun</Text>
                <Text style={styles.menuSubtitle}>
                  Ubah kata sandi dan pengaturan keamanan
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Card 4: Logout Button */}
          <TouchableOpacity
            style={styles.logoutCard}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <View style={styles.logoutIconCircle}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            </View>
            <Text style={styles.logoutText}>Keluar dari Akun</Text>
            <Ionicons name="chevron-forward" size={16} color="#EF4444" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCEBFE',
  },
  faintCircleTop: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  faintCircleMid: {
    position: 'absolute',
    top: 260,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E0F0FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2B7BF6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoCol: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  majorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 6,
  },
  majorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  completeProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  completeProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completeProfileTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  completeProfileRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completeProfileFraction: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#2B7BF6',
    borderRadius: 3,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 50,
  },
  logoutCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  logoutIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
});
