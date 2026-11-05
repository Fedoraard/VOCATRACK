import {
  TutorReplyResult,
  TutorResponseMode,
} from '../../types/contracts';
import { ALL_CURRICULUM_MODULES } from './curriculumService';

/**
 * TUTOR SERVICE ADAPTER (CT-09, F-10, T-61)
 * Bertanggung jawab melayani percakapan VocaBot.
 * 
 * Aturan F-10 & T-61:
 * 1. Proteksi Evaluasi Aktif: Tutor DITUTUP ketika siswa sedang berada dalam sesi evaluasi resmi (TUTOR_UNAVAILABLE_DURING_ASSESSMENT).
 * 2. Label Transparan: Menandai setiap respons secara eksplisit sebagai AI atau CURATED.
 * 3. Fallback Offline/Kuota: Menyediakan jawaban kurasi manusia dari FAQ modul ketika layanan AI tidak tersedia atau offline.
 */

export class TutorService {
  public static readonly IS_MOCK = true;

  private static dailyQuota = 15; // Kuota 15 interaksi per hari

  /**
   * Mengirim pertanyaan ke VocaBot
   */
  public static async askTutor(
    studentId: string,
    question: string,
    isAssessmentActive: boolean,
    currentModuleId?: string
  ): Promise<TutorReplyResult> {
    // 1. Cek Proteksi Evaluasi Aktif (F-10)
    if (isAssessmentActive) {
      const err: any = new Error(
        'Tutor VocaBot dinonaktifkan demi integritas selama evaluasi resmi sedang berlangsung.'
      );
      err.code = 'TUTOR_UNAVAILABLE_DURING_ASSESSMENT';
      throw err;
    }

    const cleanQ = question.trim().toLowerCase();
    if (!cleanQ) {
      throw new Error('Pertanyaan tidak boleh kosong.');
    }

    // 2. Cek apakah ada kecocokan jawaban kurasi manusia (CURATED FAQ)
    const curatedMatch = this.findCuratedFaqMatch(cleanQ, currentModuleId);
    if (curatedMatch) {
      return {
        messageId: `msg-curated-${Date.now()}`,
        replyText: curatedMatch.answer,
        mode: 'CURATED',
        remainingDailyQuota: this.dailyQuota,
        sourceReferences: [`FAQ Modul: ${curatedMatch.moduleId}`],
      };
    }

    // 3. Cek kuota AI harian
    if (this.dailyQuota <= 0) {
      return {
        messageId: `msg-curated-fallback-${Date.now()}`,
        replyText:
          'Kuota harian interaksi AI Anda telah tercapai untuk hari ini. Berikut jawaban rekomendasi kurasi kami: Silakan pelajari ringkasan materi modul dan konsultasikan latihan formatif dengan guru pembimbing.',
        mode: 'CURATED',
        remainingDailyQuota: 0,
        sourceReferences: ['Kurasi Standar Kurikulum'],
      };
    }

    // 4. Mode AI (Synthesized / Mock AI respons adaptif)
    this.dailyQuota = Math.max(0, this.dailyQuota - 1);
    await new Promise((res) => setTimeout(res, 800)); // Simulasi berpikir AI

    const aiReply = this.generateAiResponse(question, currentModuleId);

    return {
      messageId: `msg-ai-${Date.now()}`,
      replyText: aiReply,
      mode: 'AI',
      remainingDailyQuota: this.dailyQuota,
      sourceReferences: [
        currentModuleId ? `Modul ${currentModuleId} VocaTrack` : 'Panduan Kurikulum RPL SMK',
      ],
    };
  }

  private static findCuratedFaqMatch(
    query: string,
    currentModuleId?: string
  ): { answer: string; moduleId: string } | null {
    // Cari di FAQ modul yang sedang aktif terlebih dahulu
    const targetModules = currentModuleId
      ? [ALL_CURRICULUM_MODULES[currentModuleId]].filter(Boolean)
      : Object.values(ALL_CURRICULUM_MODULES);

    for (const mod of targetModules) {
      for (const faq of mod.faqItems || []) {
        const qWords = faq.question.toLowerCase().split(' ');
        const matches = qWords.filter((w) => w.length > 3 && query.includes(w));
        if (matches.length >= 2) {
          return { answer: faq.answer, moduleId: mod.id };
        }
      }
    }

    return null;
  }

  private static generateAiResponse(query: string, moduleId?: string): string {
    const qLower = query.toLowerCase();

    if (qLower.includes('flexbox') || qLower.includes('flex')) {
      return 'CSS Flexbox dirancang untuk penataan satu dimensi. Gunakan `justify-content` untuk mengatur perataan di sepanjang sumbu utama (main axis), dan `align-items` untuk sumbu silang (cross axis). Pada React Native, arah bawaannya adalah vertical (column).';
    }

    if (qLower.includes('state') || qLower.includes('usestate')) {
      return 'Di React dan React Native, State bersifat immutable. Selalu gunakan fungsi updater seperti `setCount(prev => prev + 1)` atau buat salinan objek baru dengan spread operator `[...items, newItem]` agar React dapat mendeteksi perubahan referensi memori.';
    }

    if (qLower.includes('prasyarat') || qLower.includes('syarat') || qLower.includes('kunci')) {
      return 'Modul pembelajaran VocaTrack mengadopsi sistem prasyarat kompetensi. Anda harus lulus evaluasi resmi dengan skor minimal 70 pada modul sebelumnya sebelum modul lanjutan terbuka secara otomatis.';
    }

    if (qLower.includes('proyek') || qLower.includes('tugas')) {
      return 'Proyek siswa bertema "Pengelola Tugas Belajar". Pastikan repositori GitHub Anda bersifat publik, menyertakan panduan menjalankan (README), dan tautan video demo yang mendemonstrasikan fitur CRUD utama.';
    }

    return `Halo! Terkait materi ${moduleId || 'kejuruan'}, fokuslah pada pemahaman konsep dasar dan implementasi terapan. Pastikan Anda menyelesaikan tontonan video materi hingga 100% dan mencoba latihan soal formatif sebelum mengambil evaluasi resmi. Ada yang ingin Anda tanyakan lebih lanjut?`;
  }
}

