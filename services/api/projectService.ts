import {
  ProjectBrief,
  ProjectSubmission,
  HumanReviewInput,
  CareerTrackId,
} from '../../types/contracts';
import { StorageService } from '../offline/storageService';

/**
 * PROJECT & REVIEW SERVICE ADAPTER (CT-10, CT-11, CT-12, F-12, F-13, T-67, T-70)
 * Mengelola panduan tugas belajar siswa, pengiriman proyek (repo, commit, demo),
 * serta antarmuka peninjauan reviewer internal (rubrik 4 aspek).
 */

export const PROJECT_BRIEFS: Record<CareerTrackId, ProjectBrief> = {
  FRONTEND: {
    briefId: 'brief-fe-01',
    careerId: 'FRONTEND',
    careerTitle: 'Frontend Web Developer',
    projectTheme: 'Pengelola Tugas Belajar Siswa (Web Client)',
    technologyStack: 'React / Next.js, HTML5/CSS3, Fetch API / Axios, TailwindCSS',
    coreFeatures: [
      'Menampilkan daftar tugas dengan filter status (Semua, Belum Selesai, Selesai)',
      'Menambah tugas baru dengan validasi judul dan tanggal tenggat waktu',
      'Mengubah status tugas (tandai selesai / belum selesai) secara responsif',
      'Menghapus tugas dengan dialog konfirmasi',
      'Integrasi dengan REST API backend dan penanganan status loading / error',
    ],
    submissionGuidelines: [
      'Repositori GitHub publik dengan riwayat commit rapi',
      'Menyertakan README.md dengan petunjuk instalasi dan cara menjalankan (`npm install`, `npm start`)',
      'Tautan rekaman video demo (maksimal 3 menit) yang memperlihatkan fungsionalitas utama',
    ],
  },
  BACKEND: {
    briefId: 'brief-be-01',
    careerId: 'BACKEND',
    careerTitle: 'Backend Developer',
    projectTheme: 'RESTful API Pengelola Tugas Belajar',
    technologyStack: 'Node.js, Express.js, PostgreSQL / Supabase, JWT Authentication',
    databaseTech: 'PostgreSQL Relational DB',
    coreFeatures: [
      'Endpoint CRUD tugas (/api/tasks) dengan validasi request payload',
      'Autentikasi pengguna berbasis JWT (Register, Login, Protected Routes)',
      'Penyimpanan persisten pada database relasional dengan skema terstruktur',
      'Penanganan error terpusat dengan HTTP status code yang semantik',
      'Dokumentasi API atau file Postman Collection / Swagger',
    ],
    submissionGuidelines: [
      'Repositori GitHub publik dengan file `.env.example`',
      'Skrip migrasi database atau skema SQL yang dapat dieksekusi',
      'Tautan video demo pengujian endpoint menggunakan Postman / curl',
    ],
  },
  MOBILE: {
    briefId: 'brief-mo-01',
    careerId: 'MOBILE',
    careerTitle: 'Mobile App Developer',
    projectTheme: 'Aplikasi Mobile Pengelola Tugas Belajar',
    technologyStack: 'React Native, Expo, AsyncStorage / SecureStore, NativeWind',
    coreFeatures: [
      'Tampilan antarmuka mobile responsif dengan FlatList performan',
      'Formulir input tugas dengan KeyboardAvoidingView dan validasi',
      'Penyimpanan lokal offline (AsyncStorage) yang diisolasi per akun',
      'Navigasi antarlayar (Expo Router Stack & Tabs)',
      'Penanganan kondisi offline dengan banner status jaringan',
    ],
    submissionGuidelines: [
      'Repositori GitHub publik dengan struktur modular',
      'Petunjuk menjalankan aplikasi di Expo Go atau Emulator Android',
      'Tautan video demo rekaman layar ponsel Android berdurasi 2-3 menit',
    ],
  },
};

export class ProjectService {
  public static readonly IS_MOCK = true;

  /**
   * Mengambil panduan brief proyek sesuai karir (CT-10)
   */
  public static async getBrief(careerId: CareerTrackId): Promise<ProjectBrief> {
    return PROJECT_BRIEFS[careerId] || PROJECT_BRIEFS.FRONTEND;
  }

  /**
   * Mengirimkan proyek siswa (CT-10)
   */
  public static async submitProject(
    studentId: string,
    studentName: string,
    careerId: CareerTrackId,
    repositoryUrl: string,
    commitHash: string,
    runInstructions: string,
    demoVideoUrl: string
  ): Promise<ProjectSubmission> {
    const brief = await this.getBrief(careerId);

    const submission: ProjectSubmission = {
      submissionId: `sub-${studentId}-${Date.now()}`,
      studentId,
      studentName,
      careerId,
      briefId: brief.briefId,
      repositoryUrl: repositoryUrl.trim(),
      commitHash: commitHash.trim(),
      runInstructions: runInstructions.trim(),
      demoVideoUrl: demoVideoUrl.trim(),
      status: 'TECHNICAL_REVIEW', // Masuk antrean peninjauan teknis
      submittedAt: new Date().toISOString(),
      coreChecksSummary: {
        passedChecksCount: 5,
        totalChecksCount: 5,
        isCoreFeaturesAllPassed: true,
      },
    };

    // Simpan ke storage akun siswa
    const key = `submissions_${careerId}`;
    const existing = (await StorageService.getItem<ProjectSubmission[]>(studentId, key)) || [];
    existing.push(submission);
    await StorageService.setItem(studentId, key, existing);

    // Simpan juga ke antrean reviewer internal global mock
    await this.addGlobalReviewQueue(submission);

    return submission;
  }

  /**
   * Mengambil riwayat pengumpulan proyek siswa
   */
  public static async getStudentSubmissions(
    studentId: string,
    careerId: CareerTrackId
  ): Promise<ProjectSubmission[]> {
    const key = `submissions_${careerId}`;
    const stored = await StorageService.getItem<ProjectSubmission[]>(studentId, key);
    return stored || [];
  }

  /**
   * Mengambil daftar tugas review untuk Layar Reviewer Internal (T-70)
   */
  public static async getReviewerSubmissions(): Promise<ProjectSubmission[]> {
    const globalQueue = (await StorageService.getItem<ProjectSubmission[]>('SYSTEM_REVIEWER', 'review_queue')) || [];
    if (globalQueue.length === 0) {
      // Mock data sintetis untuk pengujian layar reviewer
      return [
        {
          submissionId: 'sub-sample-001',
          studentId: 'user-002',
          studentName: 'Budi Pratama',
          careerId: 'FRONTEND',
          briefId: 'brief-fe-01',
          repositoryUrl: 'https://github.com/budipratama/task-manager-web',
          commitHash: 'a1b2c3d',
          runInstructions: 'npm install && npm start di port 3000',
          demoVideoUrl: 'https://youtube.com/watch?v=sample123',
          status: 'TECHNICAL_REVIEW',
          submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          coreChecksSummary: {
            passedChecksCount: 5,
            totalChecksCount: 5,
            isCoreFeaturesAllPassed: true,
          },
        },
        {
          submissionId: 'sub-sample-002',
          studentId: 'user-003',
          studentName: 'Siti Rahma',
          careerId: 'MOBILE',
          briefId: 'brief-mo-01',
          repositoryUrl: 'https://github.com/sitirahma/vocatrack-mobile-task',
          commitHash: 'f4e5d6c',
          runInstructions: 'npx expo start --android',
          demoVideoUrl: 'https://youtube.com/watch?v=sample456',
          status: 'TECHNICAL_REVIEW',
          submittedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          coreChecksSummary: {
            passedChecksCount: 4,
            totalChecksCount: 5,
            isCoreFeaturesAllPassed: false,
          },
        },
      ];
    }
    return globalQueue;
  }

  /**
   * Mengirimkan hasil penilaian rubrik oleh Reviewer Internal (CT-12, T-70)
   */
  public static async submitHumanReview(
    reviewerName: string,
    input: HumanReviewInput
  ): Promise<ProjectSubmission> {
    const isAllMet =
      input.structureAndReadability === 'MET' &&
      input.implementationAccuracy === 'MET' &&
      input.understandingThroughDemo === 'MET' &&
      input.fieldSpecificQuality === 'MET';

    const newStatus = isAllMet ? 'PASSED' : 'NEEDS_REVISION';

    const submissions = await this.getReviewerSubmissions();
    const target = submissions.find((s) => s.submissionId === input.submissionId);

    if (target) {
      target.status = newStatus;
      target.reviewedAt = new Date().toISOString();
      target.reviewerName = reviewerName;
      target.humanReviewFeedback = input.feedbackText;

      await StorageService.setItem('SYSTEM_REVIEWER', 'review_queue', submissions);
      return target;
    }

    throw new Error(`Kiriman proyek ${input.submissionId} tidak ditemukan.`);
  }

  private static async addGlobalReviewQueue(submission: ProjectSubmission): Promise<void> {
    const list = await this.getReviewerSubmissions();
    list.unshift(submission);
    await StorageService.setItem('SYSTEM_REVIEWER', 'review_queue', list);
  }
}

