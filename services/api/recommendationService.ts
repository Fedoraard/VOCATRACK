import {
  RecommendationSnapshot,
  CareerScoreResult,
  EvidenceCoverage,
  CareerTrackId,
} from '../../types/contracts';
import { AssessmentService } from './assessmentService';

/**
 * RECOMMENDATION SERVICE ADAPTER (CT-08, F-09, PP-03, T-54)
 * Menghitung rekomendasi 3 profesi RPL pilot menggunakan model Simple Additive Weighting (SAW).
 * 
 * Aturan Model (PP-03):
 * 1. 6 Modul Inti: FND-01, FND-02, FND-03, FE-01, BE-01, MO-01.
 * 2. Syarat Bukti Minimum: Keenam modul inti harus pernah dicoba dengan >= 6 soal terjawab per modul.
 * 3. Bobot SAW:
 *    - 30% Rata-rata Fondasi (FND-01 + FND-02 + FND-03)
 *    - 70% Nilai Modul Pengantar Profesi Spesialisasi (FE-01, BE-01, MO-01)
 * 4. Penanganan Skor Seri & Kurang Bukti (F-09).
 */

const CORE_MODULE_IDS = ['FND-01', 'FND-02', 'FND-03', 'FE-01', 'BE-01', 'MO-01'];

export class RecommendationService {
  public static readonly IS_MOCK = true;

  public static async calculateRecommendation(
    studentId: string
  ): Promise<RecommendationSnapshot> {
    const answeredCounts: Record<string, number> = {};
    const moduleScores: Record<string, number> = {};
    const missingEvidence: string[] = [];

    // Kumpulkan data percobaan dari 6 modul inti
    for (const modId of CORE_MODULE_IDS) {
      const history = await AssessmentService.getModuleResultHistory(studentId, modId);
      if (history.length === 0) {
        answeredCounts[modId] = 0;
        moduleScores[modId] = 0;
        missingEvidence.push(modId);
      } else {
        const latest = history[history.length - 1];
        answeredCounts[modId] = latest.answeredCount;
        moduleScores[modId] = latest.score;

        // Syarat minimum: >= 6 butir soal terjawab
        if (latest.answeredCount < 6) {
          missingEvidence.push(modId);
        }
      }
    }

    const isEligible = missingEvidence.length === 0;

    // Hitung rata-rata fondasi (30%)
    const fndAvg = (
      (moduleScores['FND-01'] || 0) +
      (moduleScores['FND-02'] || 0) +
      (moduleScores['FND-03'] || 0)
    ) / 3;

    // Hitung skor SAW 3 Profesi
    const frontendRaw = (0.3 * (fndAvg / 100) + 0.7 * ((moduleScores['FE-01'] || 0) / 100)) * 100;
    const backendRaw = (0.3 * (fndAvg / 100) + 0.7 * ((moduleScores['BE-01'] || 0) / 100)) * 100;
    const mobileRaw = (0.3 * (fndAvg / 100) + 0.7 * ((moduleScores['MO-01'] || 0) / 100)) * 100;

    const frontendScore = Math.round(frontendRaw);
    const backendScore = Math.round(backendRaw);
    const mobileScore = Math.round(mobileRaw);

    // Bentuk hasil untuk masing-masing karir
    const careers: Array<{
      careerId: CareerTrackId;
      careerTitle: string;
      score: number;
      supportingFactors: string[];
    }> = [
      {
        careerId: 'FRONTEND',
        careerTitle: 'Frontend Web Developer',
        score: frontendScore,
        supportingFactors: [
          `Pengantar Web (FE-01): ${moduleScores['FE-01'] || 0}/100`,
          `Rata-rata Fondasi: ${Math.round(fndAvg)}/100`,
          'Keunggulan pada manipulasi antarmuka visual dan logika interaksi browser',
        ],
      },
      {
        careerId: 'BACKEND',
        careerTitle: 'Backend Developer',
        score: backendScore,
        supportingFactors: [
          `Pengantar Backend (BE-01): ${moduleScores['BE-01'] || 0}/100`,
          `Rata-rata Fondasi: ${Math.round(fndAvg)}/100`,
          'Keunggulan pada perancangan logika bisnis API dan pemrosesan data',
        ],
      },
      {
        careerId: 'MOBILE',
        careerTitle: 'Mobile App Developer',
        score: mobileScore,
        supportingFactors: [
          `Pengantar Mobile (MO-01): ${moduleScores['MO-01'] || 0}/100`,
          `Rata-rata Fondasi: ${Math.round(fndAvg)}/100`,
          'Keunggulan pada komponen gawai seluler dan arsitektur responsif native',
        ],
      },
    ];

    // Urutkan berdasarkan skor tertinggi (Rank)
    careers.sort((a, b) => b.score - a.score);
    const rankedCareers: CareerScoreResult[] = careers.map((c, idx) => ({
      ...c,
      rank: idx + 1,
    }));

    // Cek kondisi seri (peringkat 1 dan 2 bernilai sama)
    const isTieScore = rankedCareers[0].score === rankedCareers[1].score && rankedCareers[0].score > 0;
    // Cek apakah seluruh skor pengantar < 70
    const isAllScoresLow = rankedCareers.every((c) => c.score < 70);

    // Buat catatan interpretasi
    let interpretationNote = '';
    const nextRecommendedSteps: string[] = [];

    if (!isEligible) {
      interpretationNote = `Bukti kompetensi belum lengkap (${missingEvidence.length} modul inti belum memenuhi batas minimal 6 soal terjawab). Lengkapi evaluasi pada modul: ${missingEvidence.join(', ')} untuk mengaktifkan rekomendasi tervalidasi.`;
      nextRecommendedSteps.push(`Kerjakan evaluasi resmi modul ${missingEvidence[0]} minimal 6 butir soal.`);
      nextRecommendedSteps.push('Pelajari materi fondasi dan lakukan latihan mandiri.');
    } else if (isAllScoresLow) {
      interpretationNote = 'Seluruh skor profesi berada di bawah ambang batas kompetensi 70. Disarankan melakukan penguatan konsep fondasi dan mengulang evaluasi modul pengantar.';
      nextRecommendedSteps.push('Tinjau kembali pembahasan evaluasi FND-01 dan modul spesialisasi.');
      nextRecommendedSteps.push('Gunakan VocaBot untuk menanyakan konsep yang belum dipahami.');
    } else if (isTieScore) {
      interpretationNote = `Terdapat skor yang sama kuat antara ${rankedCareers[0].careerTitle} dan ${rankedCareers[1].careerTitle} (${rankedCareers[0].score} poin). Anda memiliki bakat setara pada kedua bidang ini.`;
      nextRecommendedSteps.push(`Pertimbangkan minat pribadi Anda antara ${rankedCareers[0].careerTitle} atau ${rankedCareers[1].careerTitle}.`);
      nextRecommendedSteps.push('Ambil proyek terapan tingkat lanjut untuk menguji preferensi kerja nyata.');
    } else {
      interpretationNote = `Berdasarkan pembobotan ilmiah SAW, Anda memiliki kesesuaian tertinggi pada bidang ${rankedCareers[0].careerTitle} (${rankedCareers[0].score} poin).`;
      nextRecommendedSteps.push(`Lanjutkan paket belajar tingkat lanjut ${rankedCareers[0].careerTitle}.`);
      nextRecommendedSteps.push('Persiapkan diri untuk pengerjaan Proyek Akhir Siswa.');
    }

    const coverage: EvidenceCoverage = {
      isEligible,
      missingEvidenceModuleIds: missingEvidence,
      answeredCountsByScope: answeredCounts,
    };

    return {
      snapshotId: `rec-${studentId}-${Date.now()}`,
      modelVersionId: 'saw-v1.0.0',
      isEligible,
      coverage,
      careerResults: rankedCareers,
      isTieScore,
      isAllScoresLow,
      interpretationNote,
      nextRecommendedSteps,
      calculatedAt: new Date().toISOString(),
    };
  }
}

