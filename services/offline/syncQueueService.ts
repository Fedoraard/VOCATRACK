import { LearningEvent, SyncLearningEventsResult } from '../../types/contracts';
import { storageService } from './storageService';

/**
 * SYNC QUEUE SERVICE (T-57)
 * Mengelola antrean aktivitas belajar saat offline atau koneksi terputus.
 * Menjamin event tidak hilang dan dikirimkan secara idempoten saat koneksi pulih.
 */

export interface QueueItem {
  id: string;
  event: LearningEvent;
  ownerId: string;
  status: 'LOCAL_PENDING' | 'SENDING' | 'ACKNOWLEDGED' | 'FAILED';
  retryCount: number;
}

export const syncQueueService = {
  /**
   * Menambahkan aktivitas belajar baru ke antrean offline akun
   */
  async enqueueEvent(ownerId: string, event: LearningEvent): Promise<void> {
    const existingQueue = await storageService.getOfflineQueue(ownerId);
    // Cek duplikasi eventId
    if (!existingQueue.some((e) => e.eventId === event.eventId)) {
      existingQueue.push(event);
      await storageService.saveOfflineQueue(ownerId, existingQueue);
    }
  },

  /**
   * Mengambil jumlah event yang masih tertunda untuk ditampilkan di badge UI
   */
  async getPendingCount(ownerId: string): Promise<number> {
    const queue = await storageService.getOfflineQueue(ownerId);
    return queue.length;
  },

  /**
   * Memproses sinkronisasi seluruh event tertunda ke server
   */
  async flushQueue(
    ownerId: string,
    syncFn: (events: LearningEvent[], idempotencyKey: string) => Promise<SyncLearningEventsResult>
  ): Promise<{ syncedCount: number; failedCount: number }> {
    const queue = await storageService.getOfflineQueue(ownerId);
    if (queue.length === 0) return { syncedCount: 0, failedCount: 0 };

    try {
      const idempotencyKey = `sync-${ownerId}-${Date.now()}`;
      const result = await syncFn(queue, idempotencyKey);

      // Filter event yang berhasil diterima server
      const remainingEvents = queue.filter(
        (e) => !result.acceptedEventIds.includes(e.eventId)
      );

      await storageService.saveOfflineQueue(ownerId, remainingEvents);

      return {
        syncedCount: result.acceptedEventIds.length,
        failedCount: remainingEvents.length,
      };
    } catch (err) {
      console.warn('Gagal memproses antrean sinkronisasi:', err);
      return { syncedCount: 0, failedCount: queue.length };
    }
  },
};

