import { JurusanVokasi, NodeBab, QuizData } from './types';

export const MOCK_JURUSAN: JurusanVokasi[] = [
  {
    id: 'jur-01',
    kode: 'RPL',
    nama: 'Rekayasa Perangkat Lunak',
    kategori: 'Teknologi Informasi',
    deskripsi: 'Mempelajari pemrograman aplikasi web, mobile, basis data, dan arsitektur cloud untuk industri software modern.',
    peluangKarir: ['Mobile App Developer', 'Frontend Engineer', 'Fullstack Developer', 'QA Tester'],
    durasiTahun: 3,
    tingkatKecocokan: 94.5,
    iconName: 'code-slash-outline',
    warnaTema: '#4F46E5',
    totalModul: 18,
    modulSelesai: 7,
  },
  {
    id: 'jur-02',
    kode: 'TKJ',
    nama: 'Teknik Komputer & Jaringan',
    kategori: 'Teknologi Informasi',
    deskripsi: 'Spesialisasi instalasi infrastruktur jaringan, keamanan cyber, administrasi server Linux, dan cloud computing.',
    peluangKarir: ['Network Administrator', 'DevOps Specialist', 'Cybersecurity Analyst'],
    durasiTahun: 3,
    tingkatKecocokan: 88.0,
    iconName: 'hardware-chip-outline',
    warnaTema: '#06B6D4',
    totalModul: 16,
    modulSelesai: 4,
  },
  {
    id: 'jur-03',
    kode: 'DKV',
    nama: 'Desain Komunikasi Visual',
    kategori: 'Seni & Industri Kreatif',
    deskripsi: 'Pengembangan identitas visual merek, UI/UX design, animasi 2D/3D, fotografi, dan produksi konten digital.',
    peluangKarir: ['UI/UX Designer', 'Motion Graphic Designer', 'Brand Strategist'],
    durasiTahun: 3,
    tingkatKecocokan: 82.3,
    iconName: 'color-palette-outline',
    warnaTema: '#EC4899',
    totalModul: 15,
    modulSelesai: 2,
  },
  {
    id: 'jur-04',
    kode: 'MM',
    nama: 'Teknik Otomasi Industri & Mekatronika',
    kategori: 'Rekayasa & Manufaktur',
    deskripsi: 'Integrasi mekanik presisi, PLC, mikrokontroler, robotika industri, dan sistem IoT otomatisasi pabrik modern.',
    peluangKarir: ['Automation Engineer', 'PLC Programmer', 'Robotics Technician'],
    durasiTahun: 4,
    tingkatKecocokan: 78.5,
    iconName: 'construct-outline',
    warnaTema: '#F59E0B',
    totalModul: 20,
    modulSelesai: 0,
  },
  {
    id: 'jur-05',
    kode: 'BDM',
    nama: 'Bisnis Digital & Marketing',
    kategori: 'Bisnis & Manajemen',
    deskripsi: 'Strategi pemasaran digital omni-channel, riset pasar data-driven, SEO, performance marketing, dan e-commerce operation.',
    peluangKarir: ['Digital Marketer', 'E-commerce Specialist', 'Growth Hacker'],
    durasiTahun: 3,
    tingkatKecocokan: 72.0,
    iconName: 'trending-up-outline',
    warnaTema: '#10B981',
    totalModul: 14,
    modulSelesai: 0,
  },
];

export const MOCK_SKILL_TREE_NODES: NodeBab[] = [
  {
    id: 'node-01',
    jurusanId: 'jur-01',
    title: 'Fondasi Logika & Algoritma',
    subtitle: 'Flowchart, pseudocode, dan dasar percabangan',
    tier: 1,
    order: 1,
    status: 'active',
    xpReward: 150,
    materiId: 'mat-01',
    quizId: 'quiz-01',
    x: 170,
    y: 60,
    connectedTo: ['node-02', 'node-03'],
  },
  {
    id: 'node-02',
    jurusanId: 'jur-01',
    title: 'Struktur Data Dasar',
    subtitle: 'Array, Objek, dan manipulasi memori',
    tier: 1,
    order: 2,
    status: 'locked',
    xpReward: 200,
    materiId: 'mat-02',
    quizId: 'quiz-02',
    x: 90,
    y: 190,
    connectedTo: ['node-04'],
  },
  {
    id: 'node-03',
    jurusanId: 'jur-01',
    title: 'Dasar Pemrograman Web (DOM & JS)',
    subtitle: 'Interaktivitas antarmuka browser',
    tier: 1,
    order: 3,
    status: 'locked',
    xpReward: 250,
    materiId: 'mat-03',
    quizId: 'quiz-03',
    x: 250,
    y: 190,
    connectedTo: ['node-04', 'node-05'],
  },
  {
    id: 'node-04',
    jurusanId: 'jur-01',
    title: 'Komponen & State React Native',
    subtitle: 'JSX, Props, useState & useEffect',
    tier: 2,
    order: 4,
    status: 'locked',
    xpReward: 300,
    materiId: 'mat-04',
    quizId: 'quiz-04',
    x: 130,
    y: 330,
    connectedTo: ['node-06'],
  },
  {
    id: 'node-05',
    jurusanId: 'jur-01',
    title: 'Integrasi REST API & Supabase',
    subtitle: 'Asynchronous fetch, auth token, & DB client',
    tier: 2,
    order: 5,
    status: 'locked',
    xpReward: 350,
    materiId: 'mat-05',
    quizId: 'quiz-05',
    x: 260,
    y: 330,
    connectedTo: ['node-06'],
  },
  {
    id: 'node-06',
    jurusanId: 'jur-01',
    title: 'Capstone: Aplikasi Mobile Vokasi',
    subtitle: 'Deployment & Optimasi Performa',
    tier: 3,
    order: 6,
    status: 'locked',
    xpReward: 500,
    materiId: 'mat-06',
    quizId: 'quiz-06',
    x: 170,
    y: 470,
    connectedTo: [],
  },
];

export const MOCK_QUIZ_DATA: Record<string, QuizData> = {
  'quiz-03': {
    id: 'quiz-03',
    nodeBabId: 'node-03',
    judul: 'Uji Pemahaman: Dasar Javascript & DOM',
    durasiDetik: 25,
    questions: [
      {
        id: 'q1',
        pertanyaan: 'Manakah metode yang digunakan untuk mengubah isi teks elemen HTML melalui DOM di JavaScript?',
        pilihan: [
          'element.textContent = "Baru"',
          'element.changeText("Baru")',
          'element.innerHTMLText("Baru")',
          'element.setHtmlContent("Baru")',
        ],
        kunciJawaban: 0,
        pembahasan: '`textContent` atau `innerText` merupakan properti standar W3C untuk menetapkan atau mengambil teks dari sebuah node.',
      },
      {
        id: 'q2',
        pertanyaan: 'Apa perbedaan mendasar antara deklarasi variabel `const` dan `let` pada JavaScript ES6?',
        pilihan: [
          'const hanya berlaku di global scope',
          'const tidak dapat di-reassign nilai referensinya',
          'let hanya dapat menyimpan tipe data number',
          'let tidak memiliki sifat block-scope',
        ],
        kunciJawaban: 1,
        pembahasan: '`const` membuat variabel yang mengunci referensi assignment, sehingga tidak dapat ditimpa dengan operator assignment (=).',
      },
      {
        id: 'q3',
        pertanyaan: 'Metode array manakah yang mengembalikan array baru berisi elemen yang memenuhi kondisi logika filter?',
        pilihan: [
          'array.map()',
          'array.forEach()',
          'array.filter()',
          'array.reduce()',
        ],
        kunciJawaban: 2,
        pembahasan: 'Metode `.filter()` mengevaluasi setiap item dengan fungsi predicate dan menghasilkan array baru dari elemen yang bernilai true.',
      },
    ],
  },
};

export const MOCK_MATERI = {
  'mat-03': {
    id: 'mat-03',
    judul: 'Dasar Pemrograman Web: JavaScript Modern & DOM',
    jurusan: 'Rekayasa Perangkat Lunak',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    durasiVideo: '12:45 Menit',
    penulis: 'Tim Kurikulum VocaTrack',
    rangkuman: `
### Pengantar JavaScript Modern (ES6+)
JavaScript merupakan bahasa komputasi utama yang memungkinkan interaktivitas dinamis pada peramban web maupun aplikasi seluler (melalui React Native).

#### 1. Konsep Variabel: Let vs Const
- Gunakan \`const\` sebagai opsi *default* untuk mencegah modifikasi referensi yang tidak disengaja.
- Gunakan \`let\` hanya jika nilai variabel memang dirancang untuk diperbarui di dalam perulangan (*loop*) atau logika kondisi.

#### 2. Arrow Functions & Ekspresi Singkat
Sintaksis fungsi panah (\`() => {}\`) menyederhanakan penulisan kode dan mempertahankan konteks \`this\` secara leksikal:
\`\`\`javascript
const hitungNilaiSAW = (bobot, skor) => bobot * skor;
\`\`\`

#### 3. Manipulasi DOM & Event Listener
- Mengakses node: \`document.querySelector('#tombol-aksi')\`
- Menangkap interaksi: \`elemen.addEventListener('click', handler)\`

#### 4. Kesiapan Menuju React
Di React dan React Native, kita tidak memanipulasi DOM secara imperatif melainkan secara deklaratif melalui *State* dan *Props*. Pemahaman kokoh atas array methods (\`map\`, \`filter\`, \`reduce\`) sangat krusial!
    `,
  },
};
