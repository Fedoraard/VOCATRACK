import {
  ProgressProjection,
  ModuleProgress,
  LearningMode,
  CareerTrackId,
} from '../../types/contracts';
import { StorageService } from '../offline/storageService';
import { CurriculumService, ALL_CURRICULUM_MODULES } from './curriculumService';
import { AssessmentService } from './assessmentService';

/**
 * PROGRESS SERVICE ADAPTER (CT-07, F-03, F-04, F-08)
 * Mengelola preferensi mode belajar (Mode Terarah vs Eksplorasi),
 * target karir, serta proyeksi status penguasaan 9 modul kurikulum.
 */

export class ProgressService {
  public static readonly IS_MOCK = true;

  /**
   * Mengambil proyeksi progres lengkap siswa
   */
  public static async getProgress(studentId: string): Promise<ProgressProjection> {
    const key = 'student_progress';
    let stored = await StorageService.getItem<ProgressProjection>(studentId, key);

    if (!stored) {
      stored = this.buildInitialProgress(studentId);
      await StorageService.setItem(studentId, key, stored);
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
    }

    return current;
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

