import {
  ProgressProjection,
  ModuleProgress,
  LearningMode,
  CareerTrackId,
} from '../../types/contracts';
import { StorageService } from '../offline/storageService';
import { CurriculumService, ALL_CURRICULUM_MODULES } from './curriculumService';
import { AssessmentService } from './assessmentService';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';

/**
 * PROGRESS SERVICE ADAPTER (CT-07, F-03, F-04, F-08)
 * Mengelola preferensi mode belajar (Mode Terarah vs Eksplorasi),
 * target karir, serta proyeksi status penguasaan 9 modul kurikulum.
 * Terhubung langsung ke Supabase dengan fallback penyimpanan lokal (offline-first).
 */

export class ProgressService {
  public static readonly IS_MOCK = !isSupabaseConfigured;

  /**
   * Mengambil proyeksi progres lengkap siswa
   */
  public static async getProgress(studentId: string): Promise<ProgressProjection> {
    const key = 'student_progress';
    let stored = await StorageService.getItem<ProgressProjection>(studentId, key);

    // Coba sinkronisasi dari Supabase jika terhubung
    if (isSupabaseConfigured) {
      try {
        const { data: rows, error } = await supabase
          .from('student_progress')
          .select('*')
          .eq('student_id', studentId);

        if (!error && rows && rows.length > 0) {
          const initial = stored || this.buildInitialProgress(studentId);
          for (const row of rows) {
            if (initial.modules[row.module_id]) {
              initial.modules[row.module_id] = {
                moduleId: row.module_id,
                isUnlocked: Boolean(row.is_unlocked),
                isReadCompleted: Boolean(row.is_read_completed),
                isVideoCompleted100: Boolean(row.is_video_completed),
                practiceAnsweredCount: row.practice_answered_count || 0,
                hasPassedHistorically: Boolean(row.has_passed_historically),
                latestScore: typeof row.latest_score === 'number' ? row.latest_score : null,
                totalAttempts: row.total_attempts || 0,
              };
            }
          }
          await this.recalculateUnlocks(studentId, initial);
          await StorageService.setItem(studentId, key, initial);
          return initial;
        }
      } catch (err) {
        console.warn('Gagal membaca progress dari Supabase, menggunakan cache lokal:', err);
      }
    }

    if (!stored) {
      stored = this.buildInitialProgress(studentId);
      await StorageService.setItem(studentId, key, stored);
      // Simpan baseline awal ke Supabase jika memungkinkan
      if (isSupabaseConfigured) {
        this.syncAllModulesToSupabase(studentId, stored).catch(() => {});
      }
    } else {
      // Re-evaluasi unlocked status berdasarkan modul yang telah lulus secara historis
      await this.recalculateUnlocks(studentId, stored);
    }

    return stored;
  }

  /**
   * Mengubah preferensi mode belajar (Mode Terarah vs Mode Eksplorasi) (F-03)
   */
  public static async setLearningMode(
    studentId: string,
    mode: LearningMode,
    targetCareer?: CareerTrackId
  ): Promise<ProgressProjection> {
    const current = await this.getProgress(studentId);
    current.mode = mode;
    if (targetCareer) {
      current.targetCareerId = targetCareer;
    }
    current.version += 1;
    current.updatedAt = new Date().toISOString();

    await this.recalculateUnlocks(studentId, current);
    await StorageService.setItem(studentId, 'student_progress', current);

    // Sync preferensi karir ke profiles di Supabase jika ada
    if (isSupabaseConfigured && targetCareer) {
      try {
        await supabase
          .from('profiles')
          .update({ major: targetCareer === 'FRONTEND' ? 'Frontend Web Developer' : targetCareer === 'BACKEND' ? 'Backend Developer' : 'Mobile App Developer' })
          .eq('id', studentId);
      } catch {
        // Abaikan
      }
    }

    return current;
  }

  /**
   * Memperbarui status baca modul
   */
  public static async markReadCompleted(
    studentId: string,
    moduleId: string
  ): Promise<ProgressProjection> {
    const current = await this.getProgress(studentId);
    if (current.modules[moduleId]) {
      current.modules[moduleId].isReadCompleted = true;
      current.version += 1;
      current.updatedAt = new Date().toISOString();
      await StorageService.setItem(studentId, 'student_progress', current);
      await this.syncModuleToSupabase(studentId, current.modules[moduleId]);
    }
    return current;
  }

  /**
   * Memperbarui status video selesai 100% (T-09, CT-03)
   */
  public static async markVideoCompleted(
    studentId: string,
    moduleId: string
  ): Promise<ProgressProjection> {
    const current = await this.getProgress(studentId);
    if (current.modules[moduleId]) {
      current.modules[moduleId].isVideoCompleted100 = true;
      current.version += 1;
      current.updatedAt = new Date().toISOString();
      await StorageService.setItem(studentId, 'student_progress', current);
      await this.syncModuleToSupabase(studentId, current.modules[moduleId]);
    }
    return current;
  }

  /**
   * Memperbarui jumlah latihan soal yang telah dijawab
   */
  public static async incrementPracticeCount(
    studentId: string,
    moduleId: string
  ): Promise<ProgressProjection> {
    const current = await this.getProgress(studentId);
    if (current.modules[moduleId]) {
      current.modules[moduleId].practiceAnsweredCount += 1;
      current.version += 1;
      current.updatedAt = new Date().toISOString();
      await StorageService.setItem(studentId, 'student_progress', current);
      await this.syncModuleToSupabase(studentId, current.modules[moduleId]);
    }
    return current;
  }

  /**
   * Menyegarkan status modul setelah evaluasi resmi selesai
   */
  public static async refreshAfterEvaluation(
    studentId: string,
    moduleId: string
  ): Promise<ProgressProjection> {
    const evalStatus = await AssessmentService.getModuleEvaluationStatus(studentId, moduleId);
    const current = await this.getProgress(studentId);

    if (current.modules[moduleId]) {
      current.modules[moduleId].hasPassedHistorically = evalStatus.hasPassedHistorically;
      current.modules[moduleId].latestScore = evalStatus.latestResult ? evalStatus.latestResult.score : null;
      current.modules[moduleId].totalAttempts = evalStatus.totalAttempts;
      current.version += 1;
      current.updatedAt = new Date().toISOString();

      await this.recalculateUnlocks(studentId, current);
      await StorageService.setItem(studentId, 'student_progress', current);
      await this.syncModuleToSupabase(studentId, current.modules[moduleId]);
    }

    return current;
  }

  /**
   * Helper sinkronisasi satu modul ke Supabase
   */
  private static async syncModuleToSupabase(
    studentId: string,
    mod: ModuleProgress
  ): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('student_progress').upsert(
        {
          student_id: studentId,
          module_id: mod.moduleId,
          is_unlocked: mod.isUnlocked,
          is_read_completed: mod.isReadCompleted,
          is_video_completed: mod.isVideoCompleted100,
          practice_answered_count: mod.practiceAnsweredCount,
          has_passed_historically: mod.hasPassedHistorically,
          latest_score: mod.latestScore,
          total_attempts: mod.totalAttempts,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,module_id' }
      );
    } catch (err) {
      console.warn(`Gagal sync modul ${mod.moduleId} ke Supabase:`, err);
    }
  }

  /**
   * Helper sinkronisasi seluruh modul awal ke Supabase
   */
  private static async syncAllModulesToSupabase(
    studentId: string,
    projection: ProgressProjection
  ): Promise<void> {
    if (!isSupabaseConfigured) return;
    const records = Object.values(projection.modules).map((m) => ({
      student_id: studentId,
      module_id: m.moduleId,
      is_unlocked: m.isUnlocked,
      is_read_completed: m.isReadCompleted,
      is_video_completed: m.isVideoCompleted100,
      practice_answered_count: m.practiceAnsweredCount,
      has_passed_historically: m.hasPassedHistorically,
      latest_score: m.latestScore,
      total_attempts: m.totalAttempts,
      updated_at: new Date().toISOString(),
    }));

    try {
      await supabase.from('student_progress').upsert(records, { onConflict: 'student_id,module_id' });
    } catch (err) {
      console.warn('Gagal sync baseline modul ke Supabase:', err);
    }
  }

  private static buildInitialProgress(studentId: string): ProgressProjection {
    const modules: Record<string, ModuleProgress> = {};
    for (const modId of Object.keys(ALL_CURRICULUM_MODULES)) {
      modules[modId] = {
        moduleId: modId,
        isUnlocked: modId === 'FND-01', // FND-01 terbuka secara baku
        isReadCompleted: false,
        isVideoCompleted100: false,
        practiceAnsweredCount: 0,
        latestScore: null,
        hasPassedHistorically: false,
        totalAttempts: 0,
      };
    }

    return {
      ownerId: studentId,
      mode: 'DIRECTED',
      targetCareerId: 'FRONTEND',
      modules,
      version: 1,
      updatedAt: new Date().toISOString(),
    };
  }

  private static async recalculateUnlocks(
    studentId: string,
    progress: ProgressProjection
  ): Promise<void> {
    // Kumpulkan modul yang sudah lulus secara historis
    const passedModuleIds: string[] = [];
    for (const [modId, p] of Object.entries(progress.modules)) {
      if (p.hasPassedHistorically) {
        passedModuleIds.push(modId);
      }
    }

    // Periksa status keterbukaan setiap modul
    for (const modId of Object.keys(ALL_CURRICULUM_MODULES)) {
      const status = CurriculumService.checkPrerequisites(modId, passedModuleIds);
      if (progress.modules[modId]) {
        progress.modules[modId].isUnlocked = status.isUnlocked;
      }
    }
  }
}

