import { ModuleVersion, PrerequisiteStatus, CurriculumRelease } from '../../types/contracts';
import { FEDORA_MODULES } from '../../content/fedora/modules';

/**
 * CURRICULUM SERVICE ADAPTER (CT-02)
 * Bertanggung jawab menyediakan data 9 modul pilot VocaTrack,
 * graf prasyarat, dan validasi kelayakan belajar.
 * 
 * Modul Khusus Fedora: FE-01, FE-02, MO-01, MO-02 (berasal dari content/fedora/)
 * Modul Fondasi & Backend: Disertakan sebagai data sintetis kurikulum lengkap pilot.
 */

// Placeholder sintetis Fondasi & Backend (milik Mirza & Diva) untuk kebutuhan pengujian kurikulum lengkap
const SYNTHETIC_FOUNDATION_AND_BACKEND_MODULES: Record<string, ModuleVersion> = {
  'FND-01': {
    id: 'FND-01',
    title: 'Pengantar Pemrograman & Komputasi',
    subtitle: 'Konsep dasar variabel, tipe data, logika kontrol program, dan fungsi',
    category: 'FONDASI',
    order: 1,
    description: 'Modul fondasi esensial untuk memahami alur komputasi, pemikiran terstruktur, dan penulisan algoritma dasar.',
    readingContent: `### Pengantar Pemrograman & Komputasi
    
Pemrograman adalah cara kita memberikan instruksi terstruktur kepada komputer untuk menyelesaikan suatu masalah. Dalam komputasi modern, setiap program dibangun di atas pilar logika kontrol:
1. **Sekuensial**: Instruksi dieksekusi baris demi baris secara berurutan.
2. **Percabangan (Branching)**: Menentukan alur keputusan berdasarkan kondisi bernilai true atau false (if/else).
3. **Perulangan (Looping)**: Mengeksekusi blok kode berulang kali sampai kondisi terminasi tercapai (for/while).`,
    videoAssetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoDurationSeconds: 150,
    requiredSegments: [
      { startMs: 0, endMs: 50000, label: 'Konsep Komputasi & Variabel' },
      { startMs: 50000, endMs: 100000, label: 'Logika Percabangan & Loop' },
      { startMs: 100000, endMs: 150000, label: 'Struktur Fungsi & Modularitas' },
    ],
    prerequisiteModuleIds: [],
    isCoreRecommendation: true,
    xpReward: 150,
    version: '1.0.0',
    practiceItems: [
      {
        id: 'fnd01-p1',
        question: 'Struktur kontrol mana yang mengeksekusi instruksi berdasarkan terpenuhinya syarat boolean?',
        options: ['Sekuensial', 'Percabangan (if/else)', 'Deklarasi Variabel', 'Komentar Kode'],
        kunciIndex: 1,
        explanation: 'Percabangan menguji ekspresi logika dan menjalankan blok kode tertentu hanya jika kondisi terpenuhi.',
      },
      {
        id: 'fnd01-p2',
        question: 'Apa fungsi utama dari parameter pada sebuah subprogram atau fungsi?',
        options: ['Menghapus memori program', 'Menerima nilai masukan dari pemanggil fungsi', 'Menghentikan proses CPU', 'Menyimpan kode di hard disk'],
        kunciIndex: 1,
        explanation: 'Parameter bertindak sebagai variabel penampung masukan data dari kode pemanggil fungsi.',
      },
      {
        id: 'fnd01-p3',
        question: 'Kondisi apa yang menyebabkan sebuah perulangan while berjalan terus tanpa henti (infinite loop)?',
        options: ['Kondisi selalu bernilai false', 'Kondisi terminasi tidak pernah tercapai atau selalu bernilai true', 'CPU dimatikan', 'Program memiliki fungsi rekursif'],
        kunciIndex: 1,
        explanation: 'Infinite loop terjadi saat variabel pengontrol loop tidak pernah diubah menuju batas terminasi bernilai false.',
      },
    ],
    faqItems: [
      {
        id: 'fnd01-faq1',
        question: 'Mengapa kita harus membagi kode menjadi fungsi-fungsi kecil?',
        answer: 'Pembagian kode modular (fungsi) mempermudah pelacakan bug, pengujian mandiri, dan memungkinkan penggunaan ulang kode (DRY - Don\'t Repeat Yourself).',
      },
      {
        id: 'fnd01-faq2',
        question: 'Apa bedanya variabel lokal dan variabel global?',
        answer: 'Variabel lokal hanya dapat diakses di dalam blok fungsi tempat ia dideklarasikan, sedangkan variabel global dapat diakses di seluruh bagian program.',
      },
    ],
  },
  'FND-02': {
    id: 'FND-02',
    title: 'Algoritma & Struktur Data Dasar',
    subtitle: 'Array, Objek, Pencarian Linear, dan Pengurutan Data',
    category: 'FONDASI',
    order: 2,
    description: 'Mempelajari cara mengorganisir data dalam memori dan algoritma manipulasi data dasar secara efisien.',
    readingContent: 'Materi Struktur Data: Array, Linked List, Stack, Queue, Hash Map, dan algoritma sorting.',
    videoAssetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoDurationSeconds: 160,
    requiredSegments: [{ startMs: 0, endMs: 160000, label: 'Struktur Data Dasar' }],
    prerequisiteModuleIds: ['FND-01'],
    isCoreRecommendation: true,
    xpReward: 150,
    version: '1.0.0',
    practiceItems: [],
    faqItems: [],
  },
  'FND-03': {
    id: 'FND-03',
    title: 'Version Control & Kolaborasi Git',
    subtitle: 'Repository, Commit, Branching, Pull Request, dan Git Workflow',
    category: 'FONDASI',
    order: 3,
    description: 'Dasar kolaborasi tim menggunakan Git dan platform hosting repositori seperti GitHub.',
    readingContent: 'Materi Git: init, add, commit, branch, checkout, merge, dan remote collaboration.',
    videoAssetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 150,
    requiredSegments: [{ startMs: 0, endMs: 150000, label: 'Git Workflow' }],
    prerequisiteModuleIds: ['FND-01'],
    isCoreRecommendation: true,
    xpReward: 150,
    version: '1.0.0',
    practiceItems: [],
    faqItems: [],
  },
  'BE-01': {
    id: 'BE-01',
    title: 'Pengantar Backend: REST API',
    subtitle: 'Node.js, Express, Arsitektur HTTP, Status Code, & Routing',
    category: 'BACKEND',
    order: 6,
    description: 'Membangun antarmuka layanan backend berbasis RESTful API dengan format pertukaran JSON.',
    readingContent: 'Materi Backend: HTTP Methods (GET, POST, PUT, DELETE), header, status code, middleware.',
    videoAssetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoDurationSeconds: 180,
    requiredSegments: [{ startMs: 0, endMs: 180000, label: 'REST API Fundamental' }],
    prerequisiteModuleIds: ['FND-03'],
    isCoreRecommendation: true,
    xpReward: 200,
    version: '1.0.0',
    practiceItems: [],
    faqItems: [],
  },
  'BE-02': {
    id: 'BE-02',
    title: 'Backend Lanjutan: Database Relasional',
    subtitle: 'PostgreSQL, Skema Relasi, Query SQL, Indexing, & Transaksi',
    category: 'BACKEND',
    order: 7,
    description: 'Pengelolaan basis data relasional untuk sistem berskala produksi menggunakan PostgreSQL.',
    readingContent: 'Materi Database: DDL, DML, Primary Key, Foreign Key, Join, Transaction ACID.',
    videoAssetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoDurationSeconds: 200,
    requiredSegments: [{ startMs: 0, endMs: 200000, label: 'Database & SQL' }],
    prerequisiteModuleIds: ['BE-01'],
    isCoreRecommendation: false,
    xpReward: 200,
    version: '1.0.0',
    practiceItems: [],
    faqItems: [],
  },
};

// Gabungan 9 modul kurikulum pilot
export const ALL_CURRICULUM_MODULES: Record<string, ModuleVersion> = {
  ...SYNTHETIC_FOUNDATION_AND_BACKEND_MODULES,
  ...FEDORA_MODULES,
};

export const CURRENT_CURRICULUM_RELEASE: CurriculumRelease = {
  releaseId: 'rel-2026-v1.0.0',
  version: '1.0.0',
  modules: Object.values(ALL_CURRICULUM_MODULES).sort((a, b) => a.order - b.order),
};

export class CurriculumService {
  public static readonly IS_MOCK = true; // Penanda adapter terstruktur

  /**
   * Mengambil seluruh modul kurikulum yang aktif
   */
  public static async getModules(): Promise<ModuleVersion[]> {
    return CURRENT_CURRICULUM_RELEASE.modules;
  }

  /**
   * Mengambil satu modul berdasarkan ID
   */
  public static async getModuleById(moduleId: string): Promise<ModuleVersion | null> {
    return ALL_CURRICULUM_MODULES[moduleId] || null;
  }

  /**
   * Memeriksa status prasyarat sebuah modul terhadap riwayat kelulusan siswa
   * Sesuai F-04: Siswa harus lulus (score >= 70) pada seluruh modul prasyarat.
   */
  public static checkPrerequisites(
    moduleId: string,
    passedModuleIds: string[]
  ): PrerequisiteStatus {
    const targetModule = ALL_CURRICULUM_MODULES[moduleId];
    if (!targetModule) {
      return { moduleId, isUnlocked: false, missingPrerequisiteTitles: ['Modul tidak ditemukan'] };
    }

    if (targetModule.prerequisiteModuleIds.length === 0) {
      return { moduleId, isUnlocked: true, missingPrerequisiteTitles: [] };
    }

    const missingTitles: string[] = [];
    for (const prereqId of targetModule.prerequisiteModuleIds) {
      if (!passedModuleIds.includes(prereqId)) {
        const prereqModule = ALL_CURRICULUM_MODULES[prereqId];
        missingTitles.push(prereqModule ? `${prereqId} - ${prereqModule.title}` : prereqId);
      }
    }

    return {
      moduleId,
      isUnlocked: missingTitles.length === 0,
      missingPrerequisiteTitles: missingTitles,
    };
  }

  /**
   * Mengambil daftar modul yang relevan untuk target karir tertentu
   * (Mode Terarah F-03)
   */
  public static getModulesForCareer(career: 'FRONTEND' | 'BACKEND' | 'MOBILE'): ModuleVersion[] {
    const careerCategoryMap: Record<string, string> = {
      FRONTEND: 'FRONTEND',
      BACKEND: 'BACKEND',
      MOBILE: 'MOBILE',
    };

    const targetCategory = careerCategoryMap[career];
    return CURRENT_CURRICULUM_RELEASE.modules.filter(
      (m) => m.category === 'FONDASI' || m.category === targetCategory
    );
  }
}

