export type SkillStatus = 'locked' | 'active' | 'completed';

export interface JurusanVokasi {
  id: string;
  kode: string;
  nama: string;
  kategori: string; // e.g. Rekayasa & IT, Bisnis & Manajemen, Seni & Kreatif
  deskripsi: string;
  peluangKarir: string[];
  durasiTahun: number;
  tingkatKecocokan?: number; // Nilai SAW (0-100%)
  iconName: string;
  warnaTema: string;
  totalModul: number;
  modulSelesai: number;
}

export interface NodeBab {
  id: string;
  jurusanId: string;
  title: string;
  subtitle: string;
  tier: number; // 1 (Dasar), 2 (Menengah), 3 (Mahir)
  order: number;
  status: SkillStatus;
  xpReward: number;
  materiId: string;
  quizId?: string;
  x: number; // koordinat kanvas peta
  y: number;
  connectedTo?: string[]; // ID node tujuan
}

export interface QuizQuestion {
  id: string;
  pertanyaan: string;
  pilihan: string[];
  kunciJawaban: number; // index 0-3
  pembahasan: string;
}

export interface QuizData {
  id: string;
  nodeBabId: string;
  judul: string;
  durasiDetik: number; // default 20-30 detik per soal
  questions: QuizQuestion[];
}

export interface ProgresBelajar {
  id: string;
  userId: string;
  nodeBabId: string;
  skorQuiz: number;
  status: SkillStatus;
  selesaiPada?: string;
}

export interface SAWCriteriaScore {
  minatBakat: number;      // C1 (Bobot: 0.35)
  nilaiAkademik: number;   // C2 (Bobot: 0.25)
  prospekKerja: number;    // C3 (Bobot: 0.25)
  dayaTampung: number;     // C4 (Bobot: 0.15)
  hasilPreferensi?: number; // Vi
}

export interface UserProfile {
  id: string;
  email: string;
  namaLengkap: string;
  asalSekolah: string;
  jurusanDiminati?: string;
  totalXp: number;
  level: number;
}
