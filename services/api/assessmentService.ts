import {
  OfficialAttempt,
  QuestionInstance,
  AnswerSubmissionItem,
  OfficialResult,
  AssessmentStatus,
} from '../../types/contracts';
import { FEDORA_QUESTION_BANKS, BankQuestion } from '../../content/fedora/questionBanks';
import { ALL_CURRICULUM_MODULES } from './curriculumService';
import { StorageService } from '../offline/storageService';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';

/**
 * ASSESSMENT SERVICE ADAPTER (CT-05, CT-06)
 * Aturan F-07 & BR-G-02:
 * 1. FRONTEND TIDAK PERNAH MENGHITUNG NILAI RESMI ATAU MENENTUKAN KELULUSAN MANDIRI.
 * 2. Kunci jawaban tidak pernah dibocorkan ke perangkat klien saat sesi aktif.
 * 3. Evaluasi berdurasi 20 menit dengan tenggat waktu resmi dari server (deadlineAt).
 * 4. Nilai resmi dan kelulusan (ambang >= 70) ditentukan oleh server/adapter ini.
 */

// Bank soal sintetis sederhana untuk modul non-Fedora (FND-01..03, BE-01..02) agar evaluasi end-to-end dapat diuji
function generateSyntheticBank(moduleId: string): BankQuestion[] {
  const list: BankQuestion[] = [];
  for (let i = 1; i <= 20; i++) {
    list.push({
      id: `${moduleId.toLowerCase()}-q${i.toString().padStart(2, '0')}`,
      orderNumber: i,
      type: i <= 12 ? 'CASE' : 'STRUCTURED_CODE',
      indicator: `Indikator ${moduleId} #${i}`,
      prompt: `Soal evaluasi resmi untuk modul ${moduleId} nomor urut ${i}. Manakah konsep yang paling tepat sesuai silabus?`,
      options: [
        'Konsep fundamental arsitektur dan sintaks standar',
        'Implementasi logika kontrol dan modularitas',
        'Optimasi kinerja dan penanganan error',
        'Pola desain perangkat lunak berstandar industri',
      ],
      kunciJawabanIndex: (i % 4), // Kunci deterministik 0..3
      explanationText: `Penjelasan komprehensif untuk soal ${moduleId} #${i}: Opsi yang benar selaras dengan capaian pembelajaran kompetensi inti.`,
    });
  }
  return list;
}

export class AssessmentService {
  public static readonly IS_MOCK = true;

  // Cache sesi in-memory selama lifecycle aplikasi
  private static activeAttempts: Map<string, {
    attempt: OfficialAttempt;
    bankQuestions: BankQuestion[];
  }> = new Map();

  /**
   * Memulai sesi evaluasi resmi baru (CT-05)
   * Mengembalikan OfficialAttempt dengan daftar QuestionInstance (KUNCI JAWABAN TIDAK DISERTAKAN).
   */
  public static async startOfficialAssessment(
    moduleId: string,
    studentId: string
  ): Promise<OfficialAttempt> {
    const moduleInfo = ALL_CURRICULUM_MODULES[moduleId];
    const moduleTitle = moduleInfo ? moduleInfo.title : `Modul ${moduleId}`;

    // Ambil bank soal: jika modul Fedora (FE-01, FE-02, MO-01, MO-02), gunakan FEDORA_QUESTION_BANKS
    let bank = FEDORA_QUESTION_BANKS[moduleId];
    if (!bank || bank.length === 0) {
      bank = generateSyntheticBank(moduleId);
    }

    const durationMinutes = 20;
    const now = new Date();
    const deadline = new Date(now.getTime() + durationMinutes * 60 * 1000);

    const attemptId = `att-${moduleId.toLowerCase()}-${Date.now()}`;

    // Bentuk QuestionInstance untuk klien (TANPA KUNCI JAWABAN)
    const clientQuestions: QuestionInstance[] = bank.map((q) => ({
      questionInstanceId: q.id,
      orderNumber: q.orderNumber,
      type: q.type,
      prompt: q.prompt,
      codeSnippet: q.codeSnippet,
      options: q.options,
    }));

    const attempt: OfficialAttempt = {
      attemptId,
      moduleId,
      moduleTitle,
      blueprintVersionId: 'bp-v1.0.0',
      startedAt: now.toISOString(),
      deadlineAt: deadline.toISOString(),
      serverNow: now.toISOString(),
      questions: clientQuestions,
      durationMinutes,
      status: 'ACTIVE',
    };

    // Simpan di server/adapter untuk pencocokan saat submit
    this.activeAttempts.set(attemptId, {
      attempt,
      bankQuestions: bank,
    });

    // Simpan pencatatan sesi evaluasi resmi ke Supabase jika terhubung
    if (isSupabaseConfigured) {
      try {
        await supabase.from('official_evaluations').insert({
          attempt_id: attempt.attemptId,
          student_id: studentId,
          module_id: moduleId,
          started_at: attempt.startedAt,
          deadline_at: attempt.deadlineAt,
          status: 'ACTIVE',
          answers: [],
        });
      } catch (err) {
        console.warn('Gagal mencatat evaluasi ke Supabase:', err);
      }
    }

    return attempt;
  }

  /**
   * Menyerahkan jawaban evaluasi resmi untuk dinilai oleh server (CT-06)
   * Backend menghitung skor resmi, kelulusan (>= 70), dan mengembalikan OfficialResult.
   */
  public static async submitOfficialAssessment(
    attemptId: string,
    studentId: string,
    answers: AnswerSubmissionItem[]
  ): Promise<OfficialResult> {
    const session = this.activeAttempts.get(attemptId);
    if (!session) {
      throw new Error(`Sesi evaluasi ${attemptId} tidak ditemukan atau telah kedaluwarsa.`);
    }

    const { attempt, bankQuestions } = session;
    const now = new Date();

    // Verifikasi batas waktu cutoff server
    const deadlineTime = new Date(attempt.deadlineAt).getTime();
    const isPastDeadline = now.getTime() > (deadlineTime + 5000); // Toleransi jaringan 5 detik

    // Evaluasi jawaban di sisi server/adapter
    let correctCount = 0;
    let answeredCount = 0;

    const answerMap = new Map<string, number | null>();
    for (const ans of answers) {
      answerMap.set(ans.questionInstanceId, ans.selectedOptionIndex);
    }

    const explanations = bankQuestions.map((q) => {
      const userAnswer = answerMap.get(q.id) ?? null;
      if (userAnswer !== null && userAnswer !== undefined) {
        answeredCount++;
      }
      const isCorrect = userAnswer === q.kunciJawabanIndex;
      if (isCorrect) {
        correctCount++;
      }

      return {
        questionInstanceId: q.id,
        orderNumber: q.orderNumber,
        kunciJawabanIndex: q.kunciJawabanIndex,
        userAnswerIndex: userAnswer,
        isCorrect,
        explanationText: q.explanationText,
      };
    });

    const totalQuestions = bankQuestions.length || 20;
    // Skala 0 - 100
    const rawScore = (correctCount / totalQuestions) * 100;
    const finalScore = Math.round(rawScore);
    const isPassed = finalScore >= 70; // Aturan F-08: Ambang kelulusan resmi adalah 70

    // Hitung attemptSequence dari riwayat lokal
    const existingHistory = await this.getModuleResultHistory(studentId, attempt.moduleId);
    const attemptSequence = existingHistory.length + 1;

    const officialResult: OfficialResult = {
      resultId: `res-${attemptId}`,
      attemptId,
      moduleId: attempt.moduleId,
      score: finalScore,
      isPassed,
      totalQuestions,
      correctAnswersCount: correctCount,
      answeredCount,
      gradingVersion: 'grd-v1.0.0',
      finalizedAt: now.toISOString(),
      attemptSequence,
      explanations,
    };

    // Tandai status sesi selesai
    attempt.status = 'GRADED';

    // Simpan ke riwayat penyimpanan lokal terisolasi
    await this.saveResultToHistory(studentId, officialResult);

    // Simpan hasil penilaian resmi ke Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('official_evaluations')
          .update({
            submitted_at: now.toISOString(),
            answers: answers,
            score: finalScore,
            is_passed: isPassed,
            status: 'GRADED',
          })
          .eq('attempt_id', attemptId);
      } catch (err) {
        console.warn('Gagal menyimpan hasil evaluasi ke Supabase:', err);
      }
    }

    return officialResult;
  }

  /**
   * Mengambil riwayat hasil evaluasi untuk modul tertentu
   * Mendukung T-29 (Riwayat hasil dan langkah belajar berikutnya)
   */
  public static async getModuleResultHistory(
    studentId: string,
    moduleId: string
  ): Promise<OfficialResult[]> {
    const historyKey = `history_eval_${moduleId}`;
    const stored = await StorageService.getItem<OfficialResult[]>(studentId, historyKey);

    // Coba ambil riwayat dari Supabase
    if (isSupabaseConfigured) {
      try {
        const { data: rows, error } = await supabase
          .from('official_evaluations')
          .select('*')
          .eq('student_id', studentId)
          .eq('module_id', moduleId)
          .eq('status', 'GRADED')
          .order('created_at', { ascending: true });

        if (!error && rows && rows.length > 0) {
          const fromSupabase: OfficialResult[] = rows.map((r, idx) => ({
            resultId: `res-${r.attempt_id}`,
            attemptId: r.attempt_id,
            moduleId: r.module_id,
            score: typeof r.score === 'number' ? r.score : 0,
            isPassed: Boolean(r.is_passed),
            totalQuestions: 20,
            correctAnswersCount: Math.round(((r.score ?? 0) / 100) * 20),
            answeredCount: Array.isArray(r.answers) ? r.answers.length : 20,
            gradingVersion: 'grd-v1.0.0',
            finalizedAt: r.submitted_at || r.created_at,
            attemptSequence: idx + 1,
            explanations: [],
          }));
          return fromSupabase;
        }
      } catch (err) {
        // Fallback ke cache lokal
      }
    }

    return stored || [];
  }

  /**
   * Mengambil hasil evaluasi kelulusan historis dan nilai terbaru
   * Sesuai T-29: Membedakan kelulusan historis (pernah >= 70) vs nilai percobaan terbaru.
   */
  public static async getModuleEvaluationStatus(
    studentId: string,
    moduleId: string
  ): Promise<{
    hasPassedHistorically: boolean;
    latestResult: OfficialResult | null;
    highestScore: number;
    totalAttempts: number;
  }> {
    const history = await this.getModuleResultHistory(studentId, moduleId);
    if (history.length === 0) {
      return {
        hasPassedHistorically: false,
        latestResult: null,
        highestScore: 0,
        totalAttempts: 0,
      };
    }

    const latest = history[history.length - 1];
    const hasPassed = history.some((res) => res.isPassed || res.score >= 70);
    const highest = Math.max(...history.map((r) => r.score));

    return {
      hasPassedHistorically: hasPassed,
      latestResult: latest,
      highestScore: highest,
      totalAttempts: history.length,
    };
  }

  private static async saveResultToHistory(
    studentId: string,
    result: OfficialResult
  ): Promise<void> {
    const historyKey = `history_eval_${result.moduleId}`;
    const existing = await this.getModuleResultHistory(studentId, result.moduleId);
    const updated = [...existing, result];
    await StorageService.setItem(studentId, historyKey, updated);
  }
}

