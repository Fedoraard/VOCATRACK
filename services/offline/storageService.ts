import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressProjection, LearningEvent } from '../../types/contracts';

/**
 * STORAGE SERVICE (T-57)
 * Memastikan cache dan antrean terisolasi penuh berdasarkan `ownerId` (akun siswa).
 * Data akun lama tidak boleh bocor atau diakses oleh akun lain di perangkat yang sama.
 */

const PREFIX_CACHE = '@vocatrack:cache:';
const PREFIX_QUEUE = '@vocatrack:queue:';
const PREFIX_META = '@vocatrack:meta:';

export const storageService = {
  /**
   * Menyimpan item generic terisolasi per akun
   */
  async setItem<T>(ownerId: string, key: string, value: T): Promise<void> {
    try {
      const fullKey = `${PREFIX_CACHE}${ownerId}:${key}`;
      await AsyncStorage.setItem(fullKey, JSON.stringify(value));
    } catch (e) {
      console.warn(`Gagal menyimpan item ${key}:`, e);
    }
  },

  /**
   * Mengambil item generic terisolasi per akun
   */
  async getItem<T>(ownerId: string, key: string): Promise<T | null> {
    try {
      const fullKey = `${PREFIX_CACHE}${ownerId}:${key}`;
      const data = await AsyncStorage.getItem(fullKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Menghapus item generic terisolasi per akun
   */
  async removeItem(ownerId: string, key: string): Promise<void> {
    try {
      const fullKey = `${PREFIX_CACHE}${ownerId}:${key}`;
      await AsyncStorage.removeItem(fullKey);
    } catch (e) {
      console.warn(`Gagal menghapus item ${key}:`, e);
    }
  },

  /**
   * Menyimpan cache progres belajar untuk akun tertentu
   */
  async saveProgressCache(ownerId: string, progress: ProgressProjection): Promise<void> {
    try {
      const key = `${PREFIX_CACHE}${ownerId}:progress`;
      await AsyncStorage.setItem(key, JSON.stringify(progress));
    } catch (e) {
      console.warn('Gagal menyimpan cache progres:', e);
    }
  },

  /**
   * Mengambil cache progres belajar milik akun tertentu
   */
  async getProgressCache(ownerId: string): Promise<ProgressProjection | null> {
    try {
      const key = `${PREFIX_CACHE}${ownerId}:progress`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Menyimpan antrean aktivitas offline milik akun tertentu
   */
  async saveOfflineQueue(ownerId: string, queue: LearningEvent[]): Promise<void> {
    try {
      const key = `${PREFIX_QUEUE}${ownerId}:events`;
      await AsyncStorage.setItem(key, JSON.stringify(queue));
      // Catat timestamp antrean disimpan (untuk proteksi TTL 7 hari sesuai PP-04)
      await AsyncStorage.setItem(`${PREFIX_META}${ownerId}:queue_timestamp`, Date.now().toString());
    } catch (e) {
      console.warn('Gagal menyimpan antrean offline:', e);
    }
  },

  /**
   * Mengambil antrean aktivitas offline milik akun tertentu (memvalidasi TTL 7 hari)
   */
  async getOfflineQueue(ownerId: string): Promise<LearningEvent[]> {
    try {
      const timeKey = `${PREFIX_META}${ownerId}:queue_timestamp`;
      const savedTime = await AsyncStorage.getItem(timeKey);
      
      if (savedTime) {
        const diffDays = (Date.now() - parseInt(savedTime, 10)) / (1000 * 60 * 60 * 24);
        if (diffDays > 7) {
          // Antrean sudah melewati batas 7 hari, bersihkan sesuai kebijakan PP-04
          await storageService.clearOfflineQueue(ownerId);
          return [];
        }
      }

      const key = `${PREFIX_QUEUE}${ownerId}:events`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Menghapus antrean offline milik akun tertentu setelah berhasil disinkronkan
   */
  async clearOfflineQueue(ownerId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${PREFIX_QUEUE}${ownerId}:events`);
      await AsyncStorage.removeItem(`${PREFIX_META}${ownerId}:queue_timestamp`);
    } catch (e) {
      console.warn('Gagal menghapus antrean offline:', e);
    }
  },

  /**
   * Membersihkan data cache pribadi saat logout (antrean offline tetap dipertahankan terlindungi per akun)
   */
  async handleLogoutCleanup(ownerId: string): Promise<void> {
    try {
      // Hapus data sesi & cache privat
      await AsyncStorage.removeItem(`${PREFIX_CACHE}${ownerId}:progress`);
      await AsyncStorage.removeItem(`${PREFIX_CACHE}${ownerId}:tutor_chat`);
    } catch (e) {
      console.warn('Gagal membersihkan cache logout:', e);
    }
  },
};

export const StorageService = storageService;
