import {
  PlacementIndicator,
  PlacementAnswer,
  PlacementResult,
} from '../../types/contracts';
import { StorageService } from '../offline/storageService';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';

/**
 * PLACEMENT SERVICE ADAPTER (CT-04, F-02, T-52)
 * Bertanggung jawab mengelola 9 indikator pemeriksaan kemampuan awal,
 * opsi "Belum Tahu", serta penentuan titik mulai dan kelayakan evaluasi langsung.
 */

export const PLACEMENT_INDICATORS: PlacementIndicator[] = [
  {
    id: 'PLC-01',
    moduleId: 'FND-01',
    moduleTitle: 'Dasar Pemrograman & Komputasi',
    pertanyaan: 'Manakah struktur kontrol yang digunakan untuk mengeksekusi blok kode berulang kali selama kondisi bernilai benar?',
    pilihan: ['if - else', 'while / for loop', 'switch - case', 'try - catch'],
    kunciIndex: 1,
  },
  {
    id: 'PLC-02',
    moduleId: 'FND-02',
    moduleTitle: 'Algoritma & Struktur Data Dasar',
    pertanyaan: 'Struktur data apa yang beroperasi berdasarkan prinsip Last-In-First-Out (LIFO)?',
    pilihan: ['Queue (Antrean)', 'Stack (Tumpukan)', 'Array 1 Dimensi', 'Hash Map'],
    kunciIndex: 1,
  },
  {
    id: 'PLC-03',
    moduleId: 'FND-03',
    moduleTitle: 'Version Control & Git',
    pertanyaan: 'Perintah Git apa yang digunakan untuk membuat dan berpindah ke branch baru sekaligus?',
    pilihan: ['git checkout -b <nama-branch>', 'git commit -m "branch"', 'git branch -d <nama>', 'git merge main'],
    kunciIndex: 0,
  },
  {
    id: 'PLC-04',
    moduleId: 'FE-01',
    moduleTitle: 'Pengantar Frontend (HTML, CSS, JS DOM)',
    pertanyaan: 'Properti CSS apa yang digunakan untuk meratakan elemen anak secara horizontal pada flex container?',
    pilihan: ['align-items', 'justify-content', 'flex-direction', 'display-content'],
    kunciIndex: 1,
  },
  {
    id: 'PLC-05',
    moduleId: 'FE-02',
    moduleTitle: 'Frontend Lanjutan (React & State)',
    pertanyaan: 'Hook React apa yang digunakan untuk menjalankan side-effect seperti pemanggilan API saat komponen dimuat?',
    pilihan: ['useState', 'useEffect', 'useMemo', 'useRef'],
    kunciIndex: 1,
  },
  {
    id: 'PLC-06',
    moduleId: 'BE-01',
    moduleTitle: 'Pengantar Backend (REST API & Express)',
    pertanyaan: 'HTTP method apa yang lazim digunakan untuk memperbarui sebagian (partial update) data sumber daya?',
    pilihan: ['GET', 'POST', 'PATCH', 'DELETE'],
    kunciIndex: 2,
  },
  {
    id: 'PLC-07',
    moduleId: 'BE-02',
    moduleTitle: 'Backend Lanjutan (Database Relasional & SQL)',
    pertanyaan: 'Klausul SQL apa yang digunakan untuk menggabungkan baris dari dua tabel berdasarkan kolom relasi?',
    pilihan: ['GROUP BY', 'INNER JOIN', 'ORDER BY', 'HAVING'],
    kunciIndex: 1,
  },
  {
    id: 'PLC-08',
    moduleId: 'MO-01',
    moduleTitle: 'Pengantar Mobile (React Native & Navigasi)',
    pertanyaan: 'Komponen bawaan React Native apa yang digunakan untuk menampilkan teks pada layar ponsel?',
    pilihan: ['<p>', '<span>', '<Text>', '<Typography>'],
    kunciIndex: 2,
  },
  {
    id: 'PLC-09',
    moduleId: 'MO-02',
    moduleTitle: 'Mobile Lanjutan (Expo & Offline State)',
    pertanyaan: 'Metode apa yang paling aman untuk mencegah hilangnya data offline saat ponsel berganti pengguna?',
    pilihan: [
      'Menyimpan cache dengan prefix ownerId terisolasi',
      'Menyimpan seluruh data di variabel global memory',
      'Mengosongkan baterai ponsel',
      'Mematikan layar',
    ],
    kunciIndex: 0,
  },
];

export class PlacementService {
  public static readonly IS_MOCK = true;

  /**
   * Mengambil daftar 9 indikator pemeriksaan awal
   */
  public static async getIndicators(): Promise<PlacementIndicator[]> {
    return PLACEMENT_INDICATORS;
  }

  /**
   * Mengevaluasi jawaban pemeriksaan awal siswa (CT-04)
   * Siswa dapat memilih "Belum Tahu" (selectedOptionIndex = -1).
   */
  public static async evaluatePlacement(
    studentId: string,
    answers: PlacementAnswer[]
  ): Promise<PlacementResult> {
    const answerMap = new Map<string, number>();
    for (const ans of answers) {
      answerMap.set(ans.indicatorId, ans.selectedOptionIndex);
    }

    const eligibleDirectEvaluations: string[] = [];
    const passedIndicatorModuleIds: string[] = [];

    for (const ind of PLACEMENT_INDICATORS) {
      const selected = answerMap.get(ind.id);
      // Jika siswa menjawab benar
      if (selected !== undefined && selected === ind.kunciIndex) {
        passedIndicatorModuleIds.push(ind.moduleId);
        eligibleDirectEvaluations.push(ind.moduleId);
      }
    }

    // Tentukan rekomendasi titik mulai:
    // Jika FND-01 belum dikuasai -> mulai dari FND-01
    // Jika FND-01 & FND-02 dikuasai -> mulai dari FND-03 atau modul spesialisasi
    let rekomendasiTitikMulai = 'FND-01';
    let summaryNote = 'Disarankan memulai dari Modul Fondasi Pemrograman untuk memperkuat logika komputasi dasar.';

    if (passedIndicatorModuleIds.includes('FND-01') && passedIndicatorModuleIds.includes('FND-02')) {
      if (passedIndicatorModuleIds.includes('FE-01')) {
        rekomendasiTitikMulai = 'FE-02';
        summaryNote = 'Kemampuan dasar web Anda terbukti kuat. Anda dapat langsung melanjutkan ke modul React (FE-02).';
      } else if (passedIndicatorModuleIds.includes('MO-01')) {
        rekomendasiTitikMulai = 'MO-02';
        summaryNote = 'Fondasi mobile Anda baik. Anda dapat langsung melompat ke Mobile Lanjutan (MO-02).';
      } else {
        rekomendasiTitikMulai = 'FND-03';
        summaryNote = 'Fondasi logika Anda sangat baik! Lanjutkan ke Version Control Git (FND-03).';
      }
    }

    const result: PlacementResult = {
      packageVersionId: 'plc-pkg-v1.0.0',
      rekomendasiTitikMulaiModuleId: rekomendasiTitikMulai,
      eligibleDirectEvaluationModuleIds: eligibleDirectEvaluations,
      summaryNote,
      evaluatedAt: new Date().toISOString(),
    };

    // Simpan hasil pemeriksaan awal di storage lokal akun
    await StorageService.setItem(studentId, 'placement_result', result);

    // Simpan ke Supabase jika terhubung
    if (isSupabaseConfigured) {
      try {
        await supabase.from('placement_results').insert({
          student_id: studentId,
          answers: answers,
          recommended_start_module_id: rekomendasiTitikMulai,
          eligible_module_ids: eligibleDirectEvaluations,
          evaluated_at: result.evaluatedAt,
        });
      } catch (err) {
        console.warn('Gagal simpan placement_results ke Supabase:', err);
      }
    }

    return result;
  }

  /**
   * Mengambil hasil pemeriksaan awal yang pernah disimpan
   */
  public static async getSavedPlacementResult(studentId: string): Promise<PlacementResult | null> {
    if (isSupabaseConfigured) {
      try {
        const { data: row } = await supabase
          .from('placement_results')
          .select('*')
          .eq('student_id', studentId)
          .order('evaluated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (row) {
          return {
            packageVersionId: 'plc-pkg-v1.0.0',
            rekomendasiTitikMulaiModuleId: row.recommended_start_module_id,
            eligibleDirectEvaluationModuleIds: row.eligible_module_ids || [],
            summaryNote: 'Hasil pemeriksaan kemampuan awal terverifikasi dari database.',
            evaluatedAt: row.evaluated_at,
          };
        }
      } catch {
        // Fallback ke penyimpanan lokal
      }
    }

    return StorageService.getItem<PlacementResult>(studentId, 'placement_result');
  }
}

