import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import { EducationAppBackground } from '../../components/common/EducationAppBackground';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
];

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const displayName = user?.namaLengkap || 'dipdut';
  const displayEmail = user?.email || 'dipagntg12@gmail.com';
  const displayMajor = user?.jurusanDiminati || user?.asalSekolah || 'Teknik Komputer Jaringan';

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formName, setFormName] = useState(displayName);
  const [formSchool, setFormSchool] = useState(user?.asalSekolah || 'SMK Binaan VocaTrack');
  const [formMajor, setFormMajor] = useState(displayMajor);
  const [formPhoto, setFormPhoto] = useState(user?.fotoProfil || '');
  const [saving, setSaving] = useState(false);

  const openEditModal = () => {
    setFormName(user?.namaLengkap || displayName);
    setFormSchool(user?.asalSekolah || 'SMK Binaan VocaTrack');
    setFormMajor(user?.jurusanDiminati || displayMajor);
    setFormPhoto(user?.fotoProfil || '');
    setIsEditModalVisible(true);
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Izin Diperlukan', 'Izinkan aplikasi mengakses galeri foto untuk memilih gambar profil.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFormPhoto(result.assets[0].uri);
      }
    } catch (err: any) {
      console.warn('Gagal memilih gambar:', err);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({
      namaLengkap: formName.trim() || displayName,
      asalSekolah: formSchool.trim(),
      jurusanDiminati: formMajor.trim(),
      fotoProfil: formPhoto,
    });
    setSaving(false);
    setIsEditModalVisible(false);
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
            <TouchableOpacity
              style={styles.avatarWrapper}
              activeOpacity={0.8}
              onPress={openEditModal}
            >
              {user?.fotoProfil ? (
                <Image source={{ uri: user.fotoProfil }} style={styles.avatarCircleImage} />
              ) : (
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={40} color="#2B7BF6" />
                </View>
              )}
              {/* Camera Icon Badge */}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={13} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

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
          <TouchableOpacity
            style={styles.completeProfileCard}
            activeOpacity={0.85}
            onPress={openEditModal}
          >
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
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={openEditModal}
            >
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

      {/* Modal Lengkapi Profil & Ganti Foto */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lengkapi Profil & Foto</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              {/* Avatar Preview & Change Button */}
              <View style={styles.modalAvatarSection}>
                <TouchableOpacity activeOpacity={0.8} onPress={pickImage} style={styles.modalAvatarWrapper}>
                  {formPhoto ? (
                    <Image source={{ uri: formPhoto }} style={styles.modalAvatarLarge} />
                  ) : (
                    <View style={[styles.modalAvatarLarge, styles.modalAvatarFallback]}>
                      <Ionicons name="person" size={48} color="#2B7BF6" />
                    </View>
                  )}
                  <View style={styles.modalCameraIcon}>
                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.pickPhotoBtn} onPress={pickImage} activeOpacity={0.8}>
                  <Ionicons name="image-outline" size={16} color="#2B7BF6" />
                  <Text style={styles.pickPhotoBtnText}>Pilih Foto dari Galeri / File</Text>
                </TouchableOpacity>

                {/* Preset Avatars */}
                <Text style={styles.presetLabel}>Atau pilih avatar siap pakai:</Text>
                <View style={styles.presetRow}>
                  {PRESET_AVATARS.map((url, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setFormPhoto(url)}
                      style={[
                        styles.presetThumbWrapper,
                        formPhoto === url && styles.presetThumbActive,
                      ]}
                    >
                      <Image source={{ uri: url }} style={styles.presetThumb} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Form Inputs */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Nama Lengkap</Text>
                <TextInput
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="Nama Lengkap Kamu"
                  placeholderTextColor="#94A3B8"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Asal Sekolah</Text>
                <TextInput
                  value={formSchool}
                  onChangeText={setFormSchool}
                  placeholder="Nama SMK / Sekolah Kamu"
                  placeholderTextColor="#94A3B8"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Jurusan Diminati</Text>
                <TextInput
                  value={formMajor}
                  onChangeText={setFormMajor}
                  placeholder="Contoh: Rekayasa Perangkat Lunak, TKJ, DKV"
                  placeholderTextColor="#94A3B8"
                  style={styles.modalInput}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSaveProfile}
                disabled={saving}
                activeOpacity={0.88}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  avatarCircleImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalAvatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAvatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  modalAvatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  modalAvatarFallback: {
    backgroundColor: '#E0F0FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2B7BF6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 6,
  },
  pickPhotoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 14,
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  presetThumbWrapper: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetThumbActive: {
    borderColor: '#2B7BF6',
  },
  presetThumb: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  formGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  saveBtn: {
    backgroundColor: '#2B7BF6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
