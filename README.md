# VOCATRACK MOBILE — FRONTEND DEVELOPMENT
**Aplikasi Pembelajaran & Pelacakan Keterampilan Vokasi Berbasis Android**  
**Frontend Developer:** Fedora  
**Dokumen Acuan:** `PRD.md` (v1.13), `SPESIFIKASI.md` (v1.0), `TASK_BREAKDOWN.md` (v1.0)  

---

## 1. Ringkasan Eksekutif & Identitas Peran

Proyek ini merupakan aplikasi mobile Android **VocaTrack** yang dikembangkan menggunakan **React Native** dan **Expo SDK 58**. Seluruh implementasi antarmuka dan logika klien dikerjakan secara eksklusif oleh **Fedora** dalam batasan peran sebagai *Frontend Developer*.

Aplikasi mengadopsi arsitektur modular berorientasi kontrak logis (**CT-01 sampai CT-12**), mematuhi prinsip larangan penentuan nilai mandiri di klien (**F-07, BR-G-02**), menerapkan kontrol video kustom anti-kecurangan (**T-09**), isolasi cache dan antrean offline per akun (**T-57**), serta integrasi 3 profesi pilot Rekayasa Perangkat Lunak (**Frontend Web Developer**, **Backend Developer**, dan **Mobile App Developer**).

---

## 2. Struktur Direktori Frontend

```
VOCATRACK/
├── app/
│   ├── (auth)/                 # Alur autentikasi (Login, Register, OTP Recovery)
│   ├── (tabs)/
│   │   ├── index.tsx           # Beranda siswa dengan progress & rekomendasi materi
│   │   ├── jurusan.tsx         # Pemilihan 3 Jalur Profesi RPL & Mode Belajar (T-52)
│   │   ├── skilltree.tsx       # Visualisasi pohon keterampilan 9 modul (T-52)
│   │   ├── komunitas.tsx       # Ruang interaksi siswa vokasi
│   │   └── profile.tsx         # Profil akun siswa & ringkasan XP/level
│   ├── evaluasi/
│   │   ├── [id].tsx            # Layar Evaluasi Resmi 20 Menit berbasis server (T-28)
│   │   └── result.tsx          # Riwayat hasil, status kelulusan & pembahasan (T-29)
│   ├── materi/
│   │   └── [id].tsx            # Pembelajaran modul, player kustom, latihan formatif (T-27)
│   ├── placement/
│   │   └── index.tsx           # Pemeriksaan kemampuan awal 9 indikator (T-52, F-02)
│   ├── proyek/
│   │   └── index.tsx           # Panduan brief & formulir kirim tugas belajar (T-67, F-12)
│   ├── reviewer/
│   │   └── index.tsx           # Layar internal reviewer Android & rubrik 4 aspek (T-70, F-13)
│   ├── recommendation/
│   │   └── index.tsx           # Penjelasan rekomendasi 3 profesi model SAW (T-54, F-09)
│   └── vocabot.tsx             # Tutor AI VocaBot dengan proteksi evaluasi aktif (T-61, F-10)
├── components/
│   ├── video/
│   │   └── CustomVideoPlayer.tsx   # Proof kontrol video Android kustom (T-09)
│   ├── skilltree/              # Komponen visualisasi node pohon keterampilan
│   └── common/                 # Komponen umum & latar belakang edukasi
├── content/
│   └── fedora/
│       ├── modules.ts          # Paket materi, video manifest, latihan & FAQ (FE-01, FE-02, MO-01, MO-02)
│       └── questionBanks.ts    # Bank 20 soal evaluasi resmi berindikator deterministik (T-42, T-43, T-46, T-47)
├── services/
│   ├── api/                    # Service Adapter Layer mengonsumsi kontrak backend
│   │   ├── assessmentService.ts    # Evaluasi server-based, timer 20 menit, ambang kelulusan 70
│   │   ├── curriculumService.ts    # 9 modul kurikulum pilot & graf prasyarat
│   │   ├── placementService.ts     # Evaluasi 9 indikator pemeriksaan awal
│   │   ├── progressService.ts      # Progres belajar, mode terarah vs eksplorasi
│   │   ├── projectService.ts       # Brief tugas belajar, kiriman proyek, reviewer rubrik
│   │   ├── recommendationService.ts# Perhitungan SAW (30% Fondasi, 70% Spesialisasi)
│   │   └── tutorService.ts         # Integrasi tutor AI, proteksi ujian aktif, kurasi fallback
│   └── offline/
│       ├── storageService.ts       # Cache terisolasi per ownerId & pembersihan logout
│       └── syncQueueService.ts     # Antrean aktivitas offline dengan TTL 7 hari & idempotensi
├── store/
│   └── useAppStore.ts          # State management Zustand (user, mode belajar, evaluasi aktif)
└── types/
    └── contracts.ts            # Tipe data resmi kontrak CT-01 s.d. CT-12
```

---

## 3. Matriks Pemenuhan Task Fedora (15 Task)

| ID Task | Milestone | Deskripsi Implementasi | Bukti File / Layar |
|---|---|---|---|
| **T-05** | M-01 | Build Android dasar yang dapat dijalankan | `app/_layout.tsx`, Expo SDK 58, Android Pixel 4 |
| **T-09** | M-02 | Proof kontrol video kustom Android (seek restraint, pause background, 100% coverage) | `components/video/CustomVideoPlayer.tsx` |
| **T-26** | M-03 | Alur akun siswa Android (Login, Register, OTP Recovery, Session management) | `app/(auth)/`, `hooks/useAuth.ts`, `services/offline/storageService.ts` |
| **T-27** | M-03 | Materi, video kustom, dan 3 latihan formatif FND-01 dengan umpan balik | `app/materi/[id].tsx`, `services/api/curriculumService.ts` |
| **T-28** | M-03 | Pengerjaan evaluasi resmi Android (Timer server 20m, navigasi bebas, no client scoring) | `app/evaluasi/[id].tsx`, `services/api/assessmentService.ts` |
| **T-29** | M-03 | Riwayat hasil evaluasi (Kelulusan historis vs nilai terbaru, pembahasan per butir) | `app/evaluasi/result.tsx` |
| **T-34** | M-04 | Paket belajar FE-01 (HTML5, CSS Flexbox/Grid, JS DOM, latihan formatif & FAQ) | `content/fedora/modules.ts` |
| **T-35** | M-04 | Paket belajar FE-02 (React, State Immutability, Hooks, API, latihan & FAQ) | `content/fedora/modules.ts` |
| **T-38** | M-04 | Paket belajar MO-01 (React Native primitives, Flexbox column, Expo Router) | `content/fedora/modules.ts` |
| **T-39** | M-04 | Paket belajar MO-02 (Expo, CRUD API, AsyncStorage terisolasi, offline state) | `content/fedora/modules.ts` |
| **T-42** | M-04 | Bank evaluasi resmi FE-01 (20 soal privat: 12 studi kasus, 8 analisis kode) | `content/fedora/questionBanks.ts` |
| **T-43** | M-04 | Bank evaluasi resmi FE-02 (20 soal privat: 12 studi kasus, 8 analisis kode) | `content/fedora/questionBanks.ts` |
| **T-46** | M-04 | Bank evaluasi resmi MO-01 (20 soal privat: 12 studi kasus, 8 analisis kode) | `content/fedora/questionBanks.ts` |
| **T-47** | M-04 | Bank evaluasi resmi MO-02 (20 soal privat: 12 studi kasus, 8 analisis kode) | `content/fedora/questionBanks.ts` |
| **T-52** | M-04 | Pemeriksaan awal (9 indikator) & Peta 2 Mode (Terarah vs Eksplorasi) pada Android | `app/placement/index.tsx`, `app/(tabs)/jurusan.tsx`, `app/(tabs)/skilltree.tsx` |
| **T-54** | M-04 | Rekomendasi 3 profesi (SAW 30% Fondasi/70% Spesialisasi, cakupan 6 modul, penanganan seri) | `app/recommendation/index.tsx`, `services/api/recommendationService.ts` |
| **T-57** | M-05 | Cache belajar & antrean privat Android (isolasi ownerId, TTL 7 hari, pembersihan logout) | `services/offline/storageService.ts`, `services/offline/syncQueueService.ts` |
| **T-61** | M-05 | Tutor AI & bantuan offline Android (Proteksi ujian aktif TUTOR_UNAVAILABLE, label AI/CURATED) | `app/vocabot.tsx`, `services/api/tutorService.ts` |
| **T-67** | M-06 | Panduan & pengumpulan proyek siswa Android (Brief D-28/D-29, form repo/commit/demo, status) | `app/proyek/index.tsx`, `services/api/projectService.ts` |
| **T-70** | M-06 | Layar reviewer internal Android (Daftar kiriman, rubrik 4 aspek MET/NOT_MET, kirim ulasan) | `app/reviewer/index.tsx`, `services/api/projectService.ts` |
| **T-72** | M-07 | Pengujian internal Android (Pixel 4, typecheck 0 error, expo-doctor 20/20 checks passed) | `npm test`, `npx tsc --noEmit`, `npx expo-doctor` |
| **T-78** | M-08 | Penyerahan paket build, source code, dan dokumentasi teknis | `README.md`, file artefak audit |

---

## 4. Cara Instalasi dan Menjalankan Aplikasi

### Kebutuhan Lingkungan:
- Node.js LTS (v20+ / v22+)
- Android SDK & Android Emulator (misal Pixel 4 API 34/35)
- Paket dependensi terpasang via Expo CLI

### Langkah Menjalankan:
```bash
# 1. Pasang dependensi
npm install

# 2. Periksa kompatibilitas SDK dan integritas konfigurasi
npx expo-doctor

# 3. Jalankan typecheck TypeScript
npx tsc --noEmit

# 4. Jalankan aplikasi pada emulator Android
npx expo start --android -c
```

---

## 5. Kepatuhan Keamanan & Aturan Integrasi

1. **Bebas Secret Key**: Aplikasi tidak menyimpan service-role key, admin token, atau kredensial database privat. Semua environment variable publik menggunakan prefix `EXPO_PUBLIC_`.
2. **Tanpa Scoring Klien (Client Grading Forbidden)**: Penentuan skor resmi, status kelulusan (ambang 70), dan pemotongan tenggat evaluasi dikendalikan 100% oleh adapter/server.
3. **Isolasi Akun Multi-Pengguna**: Setiap penyimpanan lokal dienkapsulasi dengan namespace `ownerId` unik untuk mencegah kebocoran data antar-siswa pada gawai sekolah bersama.
4. **Proteksi Integritas Ujian**: Tutor VocaBot dikunci otomatis saat status `activeAssessment` aktif di aplikasi, mencegah kecurangan selama pengerjaan evaluasi resmi.

