import { AssessmentQuestionType } from '../../types/contracts';

/**
 * BANK SOAL EVALUASI RESMI KHUSUS FEDORA (T-42, T-43, T-46, T-47)
 * Acuan: PP-04 SPESIFIKASI.md
 * Modul Frontend: FE-01 (T-42), FE-02 (T-43)
 * Modul Mobile: MO-01 (T-46), MO-02 (T-47)
 * 
 * Aturan Konten:
 * - Tepat 20 butir per modul (12 soal kasus kontekstual, 8 soal struktur/kode).
 * - 4 pilihan jawaban per butir (A, B, C, D) dengan 1 kunci jawaban pasti.
 * - Pembahasan lengkap per butir untuk umpan balik pasca evaluasi (CT-06).
 */

export interface BankQuestion {
  id: string;
  orderNumber: number;
  type: AssessmentQuestionType;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  kunciJawabanIndex: number; // 0, 1, 2, atau 3
  explanationText: string;
  indicator: string;
}

export const FEDORA_QUESTION_BANKS: Record<string, BankQuestion[]> = {
  // ==========================================
  // 1. T-42: FE-01 — Pengantar Web Developer
  // ==========================================
  'FE-01': [
    // 12 Soal Kasus (CASE)
    {
      id: 'fe01-q01',
      orderNumber: 1,
      type: 'CASE',
      indicator: 'Struktur HTML Semantik',
      prompt: 'Sebuah website berita ingin memastikan artikel utama dapat diindeks dengan optimal oleh mesin pencari dan terbaca jelas oleh teknologi pembaca layar. Tag kontainer semantik apa yang paling tepat membungkus badan artikel tersebut?',
      options: ['<div>', '<article>', '<section>', '<aside>'],
      kunciJawabanIndex: 1,
      explanationText: '<article> dirancang khusus untuk memuat konten independen yang dapat didistribusikan secara mandiri seperti posting blog atau artikel berita.',
    },
    {
      id: 'fe01-q02',
      orderNumber: 2,
      type: 'CASE',
      indicator: 'Aksesibilitas Gambar',
      prompt: 'Siswa SMK membuat landing page produk UMKM. Beberapa pengunjung tunanetra menggunakan screen reader untuk menjelajah. Atribut apa pada tag <img> yang wajib diisi untuk mendeskripsikan konten visual tersebut?',
      options: ['title', 'alt', 'caption', 'name'],
      kunciJawabanIndex: 1,
      explanationText: 'Atribut alt menyediakan teks alternatif bagi mesin pencari dan teknologi asistif ketika gambar tidak dapat dilihat.',
    },
    {
      id: 'fe01-q03',
      orderNumber: 3,
      type: 'CASE',
      indicator: 'CSS Flexbox Alignment',
      prompt: 'Anda diminta membuat bilah navigasi dengan logo di sisi kiri layar dan menu profil di sisi paling kanan layar. Pengaturan CSS Flexbox apa yang paling efisien diterapkan pada navbar container?',
      options: [
        'display: flex; justify-content: space-between; align-items: center;',
        'display: flex; justify-content: center; align-items: stretch;',
        'display: flex; justify-content: flex-start; align-content: center;',
        'display: flex; justify-content: space-around; flex-direction: column;',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'justify-content: space-between mendistribusikan elemen pertama di ujung awal dan elemen terakhir di ujung akhir main axis.',
    },
    {
      id: 'fe01-q04',
      orderNumber: 4,
      type: 'CASE',
      indicator: 'CSS Box Model',
      prompt: 'Sebuah card produk memiliki width: 200px, padding: 20px, dan border: 2px solid #ccc. Secara default (box-sizing: content-box), berapakah total lebar fisik elemen card tersebut di layar?',
      options: ['200px', '222px', '244px', '240px'],
      kunciJawabanIndex: 2,
      explanationText: 'Pada content-box: Total lebar = width (200) + padding kiri-kanan (40) + border kiri-kanan (4) = 244px.',
    },
    {
      id: 'fe01-q05',
      orderNumber: 5,
      type: 'CASE',
      indicator: 'Form Submission Event',
      prompt: 'Saat pengguna menekan tombol "Simpan Data", halaman web tiba-tiba memuat ulang (refresh) dan nilai form hilang. Mengapa hal ini terjadi?',
      options: [
        'JavaScript error terjadi sebelum event listener dipasang',
        'Tombol submit tidak memiliki atribut type="button"',
        'Fungsi listener belum memanggil event.preventDefault() untuk mencegah aksi default browser',
        'Input form tidak memiliki atribut autocomplete="off"',
      ],
      kunciJawabanIndex: 2,
      explanationText: 'Perilaku baku peramban saat form disubmit adalah mengirim HTTP request dan mereload halaman. event.preventDefault() mencegah reload ini.',
    },
    {
      id: 'fe01-q06',
      orderNumber: 6,
      type: 'CASE',
      indicator: 'CSS Specificity Hierarchy',
      prompt: 'Suatu elemen <p id="desc" class="info text-blue"> memiliki beberapa aturan CSS. Aturan manakah yang memiliki bobot spesifisitas paling tinggi?',
      options: ['p { color: red; }', '.info { color: green; }', '#desc { color: purple; }', '.text-blue.info { color: yellow; }'],
      kunciJawabanIndex: 2,
      explanationText: 'Selektor ID (#desc) bernilai spesifisitas (0,1,0,0) yang mengalahkan class (0,0,1,0) maupun elemen tag tunggal.',
    },
    {
      id: 'fe01-q07',
      orderNumber: 7,
      type: 'CASE',
      indicator: 'JavaScript Scope & Variable Declaration',
      prompt: 'Dalam sebuah perulangan for, variabel pencacah i perlu dibatasi hanya berada dalam cakupan blok loop tersebut. Kata kunci deklarasi apa yang paling tepat digunakan?',
      options: ['var', 'let', 'global', 'window'],
      kunciJawabanIndex: 1,
      explanationText: 'let dan const memiliki block scope, sedangkan var memiliki function scope sehingga membocorkan variabel ke luar blok for.',
    },
    {
      id: 'fe01-q08',
      orderNumber: 8,
      type: 'CASE',
      indicator: 'DOM Manipulation Performance',
      prompt: 'Sebuah aplikasi menerima daftar 500 barang belanjaan dan ingin menampilkannya ke dalam <ul>. Praktik manipulasi DOM apa yang paling ramah performa menghindari 500 kali browser reflow?',
      options: [
        'Memanggil ul.appendChild() di dalam setiap iterasi loop',
        'Menggunakan DocumentFragment sebagai penampung sementara sebelum 1 kali append ke DOM',
        'Mengubah document.body.innerHTML secara berulang di setiap iterasi',
        'Menambahkan elemen secara asynchronous menggunakan setTimeout 1ms',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'DocumentFragment menyimpan node di memori tanpa memicu render tree reflow sebelum dimasukkan sekaligus ke DOM.',
    },
    {
      id: 'fe01-q09',
      orderNumber: 9,
      type: 'CASE',
      indicator: 'Responsive Viewport Meta',
      prompt: 'Ketika halaman dibuka pada smartphone Android, seluruh teks mengecil seperti tampilan desktop yang diperkecil. Tag HTML apa yang lupa dipasang di dalam <head>?',
      options: [
        '<meta name="screen-orientation" content="portrait">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="mobile-web-app-capable" content="yes">',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Tag meta viewport dengan width=device-width memerintahkan peramban seluler mengatur lebar viewport sesuai lebar fisik layar gawai.',
    },
    {
      id: 'fe01-q10',
      orderNumber: 10,
      type: 'CASE',
      indicator: 'CSS Media Queries',
      prompt: 'Desain web mengharuskan sidebar disembunyikan hanya ketika lebar layar pengguna di bawah 768px. Sintaks media query apa yang benar?',
      options: [
        '@media (min-width: 768px) { .sidebar { display: none; } }',
        '@media (max-width: 767.98px) { .sidebar { display: none; } }',
        '@media screen and (orientation: landscape) { .sidebar { display: none; } }',
        '@media only-phone { .sidebar { display: none; } }',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'max-width: 767.98px menargetkan semua layar yang memiliki lebar maksimum di bawah 768px (viewport mobile/tablet kecil).',
    },
    {
      id: 'fe01-q11',
      orderNumber: 11,
      type: 'CASE',
      indicator: 'Asynchronous JavaScript & Promises',
      prompt: 'Aplikasi web memanggil REST API cuaca menggunakan fetch(). Mengapa pemanggilan response.json() memerlukan await atau .then()?',
      options: [
        'Karena response.json() membaca stream body respons secara asynchronous dan mengembalikan Promise',
        'Karena data JSON dienkripsi oleh server',
        'Karena fetch() tidak mendukung JSON secara langsung',
        'Karena browser memblokir konversi objek secara synchronous',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'response.json() mengembalikan Promise yang diselesaikan saat seluruh body response HTTP telah diterima dan di-parse.',
    },
    {
      id: 'fe01-q12',
      orderNumber: 12,
      type: 'CASE',
      indicator: 'Web Storage API',
      prompt: 'Siswa ingin menyimpan preferensi tema gelap/terang pengguna agar tetap tersimpan meskipun browser ditutup dan dibuka kembali esok hari. Web Storage API mana yang paling tepat?',
      options: ['sessionStorage', 'localStorage', 'cookies tanpa expiry', 'memoryCache'],
      kunciJawabanIndex: 1,
      explanationText: 'localStorage menyimpan data berpasangan key-value secara persisten tanpa batas waktu sampai dihapus oleh kode atau pengguna.',
    },

    // 8 Soal Kode Terstruktur (STRUCTURED_CODE)
    {
      id: 'fe01-q13',
      orderNumber: 13,
      type: 'STRUCTURED_CODE',
      indicator: 'Analisis Kode DOM Event Listener',
      prompt: 'Perhatikan potongan kode JavaScript berikut. Apakah hasil output pada console ketika pengguna mengklik elemen tombol?',
      codeSnippet: `const btn = document.querySelector('#actionBtn');
btn.addEventListener('click', () => {
  console.log('Klik 1');
});
btn.addEventListener('click', () => {
  console.log('Klik 2');
});`,
      options: [
        'Hanya mencetak "Klik 2" karena event listener kedua menimpa yang pertama',
        'Mencetak "Klik 1" lalu "Klik 2"',
        'Terjadi runtime TypeError karena tombol hanya boleh memiliki 1 event listener',
        'Tidak mencetak apa pun karena querySelector membutuhkan tanda koma',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'addEventListener menambahkan handler baru ke daftar pendengar event tanpa menimpa handler yang sudah terdaftar sebelumnya.',
    },
    {
      id: 'fe01-q14',
      orderNumber: 14,
      type: 'STRUCTURED_CODE',
      indicator: 'Struktur Array Method Chaining',
      prompt: 'Diberikan array data produk berikut. Apakah nilai dari variabel totalHarga?',
      codeSnippet: `const items = [
  { nama: 'Buku', harga: 20000, beli: true },
  { nama: 'Pena', harga: 5000, beli: false },
  { nama: 'Penggaris', harga: 10000, beli: true },
];
const totalHarga = items
  .filter(item => item.beli)
  .reduce((acc, curr) => acc + curr.harga, 0);`,
      options: ['35000', '30000', '25000', '20000'],
      kunciJawabanIndex: 1,
      explanationText: 'Filter hanya meloloskan Buku (20000) dan Penggaris (10000). Total akumulasi reduce = 30000.',
    },
    {
      id: 'fe01-q15',
      orderNumber: 15,
      type: 'STRUCTURED_CODE',
      indicator: 'CSS Flex Shorthand',
      prompt: 'Perhatikan properti CSS flex berikut pada sebuah item: flex: 1 0 200px;. Apa makna angka-angka tersebut secara berurutan?',
      codeSnippet: `.card-item {
  flex: 1 0 200px;
}`,
      options: [
        'flex-grow: 1, flex-shrink: 0, flex-basis: 200px',
        'flex-order: 1, flex-wrap: 0, flex-basis: 200px',
        'flex-shrink: 1, flex-grow: 0, flex-basis: 200px',
        'flex-basis: 1, flex-grow: 0, flex-shrink: 200px',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Shorthand flex menerima tiga nilai: flex-grow, flex-shrink, dan flex-basis secara berturut-turut.',
    },
    {
      id: 'fe01-q16',
      orderNumber: 16,
      type: 'STRUCTURED_CODE',
      indicator: 'Penanganan Error Asynchronous (try-catch)',
      prompt: 'Perhatikan fungsi fetch di bawah ini. Apa yang terjadi jika server mengembalikan status code 404 Not Found?',
      codeSnippet: `async function muatData() {
  try {
    const res = await fetch('https://api.example.com/invalid');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return null;
  }
}`,
      options: [
        'Langsung melompat ke blok catch karena status 404 otomatis melempar error',
        'Tidak melompat ke blok catch; fetch hanya melempar error jika terjadi network failure, kecuali dicek if (!res.ok)',
        'Fungsi mengembalikan null secara synchronous',
        'Peramban akan memunculkan dialog alert sistem',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'fetch() Promise tidak me-reject status HTTP 404 atau 500. Developer harus memeriksa properti res.ok secara manual.',
    },
    {
      id: 'fe01-q17',
      orderNumber: 17,
      type: 'STRUCTURED_CODE',
      indicator: 'Manipulasi Kelas DOM (classList)',
      prompt: 'Manakah baris kode JavaScript yang benar untuk menambahkan kelas "active" dan menghapus kelas "hidden" pada elemen target?',
      codeSnippet: `const el = document.getElementById('modalBox');`,
      options: [
        'el.className = "active !hidden";',
        'el.classList.add("active"); el.classList.remove("hidden");',
        'el.classList.toggle("active", "hidden");',
        'el.style.class = "active";',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'classList.add() dan classList.remove() adalah metode standar DOMTokenList untuk memanipulasi kelas CSS secara aman.',
    },
    {
      id: 'fe01-q18',
      orderNumber: 18,
      type: 'STRUCTURED_CODE',
      indicator: 'Selektor Turunan CSS',
      prompt: 'Pada aturan CSS berikut, elemen mana saja yang akan diberi warna teks biru?',
      codeSnippet: `ul > li.special {
  color: blue;
}`,
      options: [
        'Semua elemen dengan kelas .special di dalam halaman',
        'Hanya elemen <li> dengan kelas .special yang merupakan anak langsung (direct child) dari <ul>',
        'Semua elemen <ul> yang berada di dalam elemen berkelas .special',
        'Semua elemen turunan berkedalaman bebas di dalam <ul>',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Kombinator child selector (>) hanya menargetkan anak langsung tingkat pertama, bukan cucu (descendant sembarang).',
    },
    {
      id: 'fe01-q19',
      orderNumber: 19,
      type: 'STRUCTURED_CODE',
      indicator: 'Pemeriksaan Tipe Data JavaScript',
      prompt: 'Apakah hasil evaluasi ekspresi berikut pada JavaScript modern?',
      codeSnippet: `console.log(typeof null, Array.isArray([]));`,
      options: [
        '"null" true',
        '"object" true',
        '"undefined" false',
        '"object" false',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'typeof null adalah keanehan historis JavaScript yang menghasilkan "object", sedangkan Array.isArray([]) bernilai true.',
    },
    {
      id: 'fe01-q20',
      orderNumber: 20,
      type: 'STRUCTURED_CODE',
      indicator: 'Event Delegation pada DOM List',
      prompt: 'Perhatikan pola Event Delegation berikut. Mengapa e.target.closest("button") digunakan?',
      codeSnippet: `document.querySelector('#todoList').addEventListener('click', (e) => {
  const btn = e.target.closest('button.delete-btn');
  if (btn) {
    hapusItem(btn.dataset.id);
  }
});`,
      options: [
        'Agar event tetap tertangkap meskipun pengguna mengklik ikon SVG atau teks yang berada di dalam tombol',
        'Untuk mencegah event bubbling ke elemen window',
        'Karena querySelector tidak mendukung tag button',
        'Agar tombol terhapus otomatis dari memory DOM',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Jika tombol berisi elemen anak (seperti icon <i> atau <span>), e.target mungkin berupa icon tersebut. closest() mencari parent button terdekat.',
    },
  ],

  // ==========================================
  // 2. T-43: FE-02 — Frontend Lanjutan (React)
  // ==========================================
  'FE-02': [
    // 12 Soal Kasus (CASE)
    {
      id: 'fe02-q01',
      orderNumber: 1,
      type: 'CASE',
      indicator: 'React Component Immutability',
      prompt: 'Seorang developer pemula mengubah array tugas di React dengan memanggil tasks.push(newTask) lalu memanggil setTasks(tasks). Namun tampilan tidak kunjung terbarui. Apa penyebab utamanya?',
      options: [
        'push() merusak sintaks JSX komponen',
        'React membandingkan referensi state lama dan baru; karena referensi objek array sama, re-render tidak dipicu',
        'setTasks() harus dijalankan di dalam setTimeout',
        'Fungsi push() hanya boleh digunakan pada objek primitif',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'React menggunakan shallow comparison referensi memori. Untuk memicu re-render, buat array baru: setTasks([...tasks, newTask]).',
    },
    {
      id: 'fe02-q02',
      orderNumber: 2,
      type: 'CASE',
      indicator: 'useEffect Dependency Array',
      prompt: 'Sebuah efek memuat detail data saat prop userId berubah. Pengembang menulis useEffect(() => { fetchUser(); }, []). Masalah apa yang akan timbul?',
      options: [
        'Komponen mengalami infinite loop',
        'Efek hanya berjalan sekali saat komponen mount, sehingga saat prop userId berganti data pengguna tidak diperbarui',
        'Terjadi crash memory leak di peramban',
        'useEffect menolak array kosong',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Dependency array kosong [] hanya mengeksekusi callback saat initial mount. Masukkan [userId] agar efek bereaksi terhadap pergantian user.',
    },
    {
      id: 'fe02-q03',
      orderNumber: 3,
      type: 'CASE',
      indicator: 'Controlled Component vs Uncontrolled',
      prompt: 'Pada formulir login React, setiap karakter yang diketikkan pengguna disimpan ke dalam state username melalui onChange={e => setUsername(e.target.value)} dan value={username}. Disebut apakah pola ini?',
      options: ['Uncontrolled Component', 'Controlled Component', 'Shadow DOM Form', 'Stateless Element'],
      kunciJawabanIndex: 1,
      explanationText: 'Controlled component adalah pola di mana nilai input form dikendalikan sepenuhnya oleh React state.',
    },
    {
      id: 'fe02-q04',
      orderNumber: 4,
      type: 'CASE',
      indicator: 'State Lifting',
      prompt: 'Dua komponen bersaudara (DaftarSiswa dan StatistikSiswa) membutuhkan data daftar murid yang sama. Di manakah state daftar murid tersebut harus ditempatkan?',
      options: [
        'Di dalam DaftarSiswa lalu dipaksa kirim ke StatistikSiswa via DOM',
        'Di dalam parent component terdekat yang membungkus kedua komponen tersebut (Lifting State Up)',
        'Di dalam file CSS global',
        'Di dalam tag <head> dokumen',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Lifting state up adalah memindahkan state ke komponen induk terdekat agar dapat diteruskan ke anak-anaknya melalui props.',
    },
    {
      id: 'fe02-q05',
      orderNumber: 5,
      type: 'CASE',
      indicator: 'Penanganan Status Asynchronous (Loading & Error)',
      prompt: 'Ketika melakukan fetch data API daftar kursus, UX terbaik mengharuskan aplikasi menangani tiga kondisi utama. Kondisi apa sajakah itu?',
      options: [
        'Tampil, Sembunyi, Restart',
        'Loading (memuat), Error (kegagalan/offline), dan Success (tampilan data atau empty state)',
        'Draft, Pending, Expired',
        'Submit, Reset, Blur',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'State machine sederhana untuk HTTP request wajib memiliki kondisi Loading (spinner/skeleton), Error (pesan retry), dan Success.',
    },
    {
      id: 'fe02-q06',
      orderNumber: 6,
      type: 'CASE',
      indicator: 'React Key Prop pada Daftar',
      prompt: 'Mengapa React memberikan peringatan di console "Each child in a list should have a unique key prop" saat menggunakan .map()?',
      options: [
        'Key membantu algoritma rekonsiliasi Virtual DOM mengenali item mana yang ditambah, dihapus, atau dipindahkan urutannya secara efisien',
        'Key diwajibkan oleh mesin browser HTML',
        'Key digunakan untuk enkripsi data di sisi klien',
        'Key mencegah data list dibaca oleh CSS',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Virtual DOM Diffing memerlukan key stabil dan unik untuk melacak identitas elemen tanpa me-render ulang seluruh daftar.',
    },
    {
      id: 'fe02-q07',
      orderNumber: 7,
      type: 'CASE',
      indicator: 'Custom Hooks Reusability',
      prompt: 'Sebuah tim menemukan bahwa logika validasi formulir dan penanganan pesan error berulang di 5 halaman berbeda. Solusi arsitektur React apa yang paling bersih?',
      options: [
        'Menyalin-menempel (copy-paste) kode fungsi ke setiap halaman',
        'Membuat Custom Hook (misal useFormValidation) untuk mengekstrak logika state yang dapat digunakan kembali',
        'Menyimpan seluruh form di localStorage secara statis',
        'Mengubah komponen fungsi menjadi komponen kelas lama',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Custom hook memungkinkan ekstraksi logika stateful agar dapat digunakan kembali secara modular antarkomponen.',
    },
    {
      id: 'fe02-q08',
      orderNumber: 8,
      type: 'CASE',
      indicator: 'Cleanup Function pada useEffect',
      prompt: 'Sebuah komponen memasang window.addEventListener("resize", handleResize) di dalam useEffect. Kapan fungsi pembersih (cleanup function) yang di-return oleh useEffect akan dieksekusi?',
      options: [
        'Hanya saat window browser diminimize',
        'Tepat sebelum komponen di-unmount atau sebelum efek dijalankan kembali pada render berikutnya',
        'Saat terjadi unhandled exception di JavaScript',
        'Setiap kali pengguna mengklik tombol mouse',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Fungsi return dari useEffect bertindak sebagai pembersih (cleanup) untuk mencegah memory leak saat komponen unmount.',
    },
    {
      id: 'fe02-q09',
      orderNumber: 9,
      type: 'CASE',
      indicator: 'Pencegahan Prop Drilling',
      prompt: 'Sebuah variabel userTheme harus diakses oleh tombol yang berada 6 lapis komponen di bawah App root. Cara elegan apa yang disediakan React tanpa memecah arsitektur?',
      options: ['React Context API atau State Manager seperti Zustand', 'Global window.userTheme variable', 'Menyimpan di tag meta HTML', 'Menduplikasi komponen 6 kali'],
      kunciJawabanIndex: 0,
      explanationText: 'Context API atau Zustand menyediakan mekanisme data sharing global ke seluruh pohon komponen tanpa prop drilling bertingkat.',
    },
    {
      id: 'fe02-q10',
      orderNumber: 10,
      type: 'CASE',
      indicator: 'Optimasi Performa Re-render (React.memo)',
      prompt: 'Sebuah komponen tabel grafik besar sering me-render ulang padahal prop data miliknya tidak pernah berubah saat input teks pencarian diketik. Solusi apa yang tepat?',
      options: [
        'Membungkus komponen tabel dengan React.memo() atau menggunakan useMemo untuk kalkulasi berat',
        'Menghapus state input pencarian',
        'Mengubah seluruh state menjadi ref',
        'Menggunakan tag <iframe> terpisah',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'React.memo melakukan shallow comparison terhadap props; jika props sama persis, React melompati proses render komponen tersebut.',
    },
    {
      id: 'fe02-q11',
      orderNumber: 11,
      type: 'CASE',
      indicator: 'useRef vs useState',
      prompt: 'Kapan seorang developer sebaiknya menggunakan useRef daripada useState?',
      options: [
        'Ketika ingin menyimpan nilai yang perubahannya tidak boleh memicu proses re-render tampilan komponen',
        'Ketika ingin menampilkan data teks dinamis kepada pengguna',
        'Ketika ingin membuat animasi CSS otomatis',
        'Ketika ingin mengubah routing halaman',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'useRef menyimpan objek mutabel { current: val } yang nilainya bertahan antarender tanpa memicu render ulang saat diubah.',
    },
    {
      id: 'fe02-q12',
      orderNumber: 12,
      type: 'CASE',
      indicator: 'Form Input Sanitization & XSS',
      prompt: 'Aplikasi menampilkan komentar pengguna. Mengapa kita tidak boleh menggunakan dangerouslySetInnerHTML={{ __html: userComment }} secara sembarangan?',
      options: [
        'Karena dapat membuka celah keamanan Cross-Site Scripting (XSS) dari script berbahaya yang disusupi pengguna',
        'Karena dangerouslySetInnerHTML memperlambat koneksi internet',
        'Karena sintaks tersebut dilarang oleh HTML5',
        'Karena React akan otomatis mematikan server',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Menyuntikkan HTML mentah dari input pengguna tanpa sanitasi ketat memungkinkan eksekusi script injeksi (XSS) di peramban korban.',
    },

    // 8 Soal Kode Terstruktur (STRUCTURED_CODE)
    {
      id: 'fe02-q13',
      orderNumber: 13,
      type: 'STRUCTURED_CODE',
      indicator: 'Analisis State Update Berurutan',
      prompt: 'Perhatikan kode React berikut. Berapakah nilai count setelah pengguna mengklik tombol satu kali?',
      codeSnippet: `function Counter() {
  const [count, setCount] = useState(0);
  const handleAdd = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };
  return <button onClick={handleAdd}>{count}</button>;
}`,
      options: ['3', '1', '0', 'undefined'],
      kunciJawabanIndex: 1,
      explanationText: 'Karena penutupan closure membaca snapshot count = 0 pada render saat ini, ketiga panggilan setCount(0 + 1) menetapkan nilai 1. Gunakan setCount(prev => prev + 1) jika ingin bernilai 3.',
    },
    {
      id: 'fe02-q14',
      orderNumber: 14,
      type: 'STRUCTURED_CODE',
      indicator: 'Analisis Dependency useEffect dengan Objek',
      prompt: 'Perhatikan kode di bawah. Mengapa efek ini berjalan terus-menerus tanpa henti (infinite loop)?',
      codeSnippet: `function Profil() {
  const [data, setData] = useState(null);
  const filter = { status: 'aktif' };

  useEffect(() => {
    api.fetchUser(filter).then(res => setData(res));
  }, [filter]);
}`,
      options: [
        'Karena objek filter dibuat ulang dengan referensi memori baru pada setiap re-render',
        'Karena status aktif ditolak oleh JavaScript',
        'Karena fetchUser adalah fungsi synchronous',
        'Karena useEffect tidak mendukung objek di dalam array dependensinya',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Setiap kali setData memicu re-render, objek filter dialokasikan baru di memori. React menganggap dependensi berubah dan menjalankan efek kembali.',
    },
    {
      id: 'fe02-q15',
      orderNumber: 15,
      type: 'STRUCTURED_CODE',
      indicator: 'Pemberian Nilai Awal Form Input',
      prompt: 'Pengembang melihat peringatan: "A component is changing an uncontrolled input to be controlled". Apa kesalahan pada kode berikut?',
      codeSnippet: `const [nama, setNama] = useState(undefined);
return <input value={nama} onChange={e => setNama(e.target.value)} />;`,
      options: [
        'Nilai awal state adalah undefined sehingga input dianggap uncontrolled saat mount, lalu menjadi controlled saat bernilai string',
        'Tag input harus menggunakan placeholder bukan value',
        'Fungsi setNama tidak boleh menerima string',
        'onChange wajib ditaruh di dalam tag <form>',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Nilai awal input controlled harus string kosong "" bukan undefined atau null, agar peramban mengetahuinya sebagai controlled sejak awal.',
    },
    {
      id: 'fe02-q16',
      orderNumber: 16,
      type: 'STRUCTURED_CODE',
      indicator: 'Conditional Rendering dengan Operator &&',
      prompt: 'Apakah yang akan tampil pada layar jika items adalah array kosong []?',
      codeSnippet: `function Keranjang({ items }) {
  return (
    <div>
      {items.length && <p>Jumlah item: {items.length}</p>}
    </div>
  );
}`,
      options: [
        'Tidak menampilkan apa pun (kosong bersih)',
        'Menampilkan angka 0 pada layar karena 0 adalah falsy value di JavaScript dan dirender oleh JSX',
        'Menampilkan teks "false"',
        'Terjadi crash error compile',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Di JavaScript: 0 && <JSX> menghasilkan 0. Karena 0 adalah angka yang valid, React me-rendernya ke layar. Gunakan items.length > 0 && <JSX>.',
    },
    {
      id: 'fe02-q17',
      orderNumber: 17,
      type: 'STRUCTURED_CODE',
      indicator: 'Optimasi Callback dengan useCallback',
      prompt: 'Perhatikan fungsi di bawah ini. Kapan referensi fungsi handleClick akan diperbarui oleh React?',
      codeSnippet: `const handleClick = useCallback(() => {
  kirimData(id, status);
}, [id, status]);`,
      options: [
        'Pada setiap kali komponen induk di-render ulang',
        'Hanya ketika nilai variabel id atau status mengalami perubahan',
        'Hanya saat pertama kali komponen di-mount ke layar',
        'Secara acak saat garbage collection',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'useCallback meng-cache referensi fungsi dan hanya meregenerasi instance fungsi jika salah satu nilai dependensi berubah.',
    },
    {
      id: 'fe02-q18',
      orderNumber: 18,
      type: 'STRUCTURED_CODE',
      indicator: 'Custom Hook Structure',
      prompt: 'Manakah penulisan Custom Hook yang benar untuk membaca status online koneksi internet?',
      codeSnippet: `// Opsi implementasi custom hook`,
      options: [
        'function useOnlineStatus() { const [isOnline, setIsOnline] = useState(navigator.onLine); useEffect(() => { /* listener */ }, []); return isOnline; }',
        'const checkOnline = () => { if (window.navigator) return true; }',
        'class UseNetwork extends React.Component { render() { return true; } }',
        'function isNetworkAvailable() { return navigator.connection.downlink; }',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Custom hook diawali dengan awalan kata "use", memanfaatkan hook bawaan React (useState, useEffect), dan mengembalikan data atau state.',
    },
    {
      id: 'fe02-q19',
      orderNumber: 19,
      type: 'STRUCTURED_CODE',
      indicator: 'Penyimpanan State dengan Zustand Store',
      prompt: 'Perhatikan store Zustand sederhana berikut. Bagaimanakah cara menambahkan tugas baru secara immutable?',
      codeSnippet: `const useTaskStore = create((set) => ({
  tasks: [],
  addTask: (newTask) => set((state) => (/* lengkapi */)),
}));`,
      options: [
        '{ tasks: state.tasks.push(newTask) }',
        '{ tasks: [...state.tasks, newTask] }',
        '{ tasks: Object.assign(state.tasks, newTask) }',
        '{ tasks: state.tasks.concat(null) }',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Spread operator [...state.tasks, newTask] membuat array baru tanpa memutasi array lama di state.',
    },
    {
      id: 'fe02-q20',
      orderNumber: 20,
      type: 'STRUCTURED_CODE',
      indicator: 'Fungsi Cleanup Timer di Komponen React',
      prompt: 'Perhatikan efek interval waktu berikut. Mengapa baris return () => clearInterval(timer) sangat penting?',
      codeSnippet: `useEffect(() => {
  const timer = setInterval(() => {
    setDetik((prev) => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);`,
      options: [
        'Untuk mematikan interval ketika komponen dilepas dari DOM sehingga tidak memakan memori dan terus berjalan di latar',
        'Agar interval berganti menjadi 10 detik',
        'Untuk memaksa peramban merestart tab',
        'Agar fungsi setDetik hanya berjalan 1 kali',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Tanpa clearInterval di fungsi pembersih, interval akan terus berjalan di memori JavaScript (memory leak) meskipun komponen telah ditutup.',
    },
  ],

  // ==========================================
  // 3. T-46: MO-01 — Pengantar Mobile Developer
  // ==========================================
  'MO-01': [
    // 12 Soal Kasus (CASE)
    {
      id: 'mo01-q01',
      orderNumber: 1,
      type: 'CASE',
      indicator: 'React Native Primitive Elements',
      prompt: 'Seorang web developer ingin menampilkan teks deskripsi di React Native. Dia menggunakan tag <p>Deskripsi</p> dan aplikasi langsung mengalami error merah. Komponen bawaan apa yang seharusnya digunakan?',
      options: ['<Span>', '<Label>', '<Text>', '<Typography>'],
      kunciJawabanIndex: 2,
      explanationText: 'React Native tidak merender tag HTML browser melainkan komponen native bridge. Teks wajib dibungkus dengan komponen <Text>.',
    },
    {
      id: 'mo01-q02',
      orderNumber: 2,
      type: 'CASE',
      indicator: 'Default Flexbox Direction di Mobile',
      prompt: 'Di CSS web, container display: flex memiliki flex-direction bawaan row. Apakah nilai bawaan (default) flexDirection pada React Native View?',
      options: ['row', 'column', 'row-reverse', 'wrap'],
      kunciJawabanIndex: 1,
      explanationText: 'React Native mendesain tata letak antarmuka seluler secara vertikal, sehingga nilai bawaan flexDirection adalah "column".',
    },
    {
      id: 'mo01-q03',
      orderNumber: 3,
      type: 'CASE',
      indicator: 'Safe Area Insets pada Ponsel Berponi',
      prompt: 'Pada ponsel Android dan iPhone modern dengan kamera lubang (punch-hole) atau poni layar (notch), konten aplikasi tertutup status bar. Komponen atau hook apa yang digunakan untuk memberi padding aman?',
      options: ['<StatusBarPadding>', '<SafeAreaView> atau hook useSafeAreaInsets dari react-native-safe-area-context', '<ScreenProtect>', '<ViewportFix>'],
      kunciJawabanIndex: 1,
      explanationText: 'SafeAreaView dan useSafeAreaInsets menghitung margin aman secara dinamis berdasarkan dimensi perangkat keras ponsel.',
    },
    {
      id: 'mo01-q04',
      orderNumber: 4,
      type: 'CASE',
      indicator: 'Sentuhan & Umpan Balik (Touchables)',
      prompt: 'Untuk membuat tombol khusus dengan efek animasi meredup saat ditekan di React Native, komponen sentuh apa yang paling tepat digunakan?',
      options: ['<TouchableOpacity>', '<TouchableBounce>', '<ClickArea>', '<HoverView>'],
      kunciJawabanIndex: 0,
      explanationText: 'TouchableOpacity memberikan umpan balik sentuhan visual dengan mengurangi opacity elemen saat pengguna menekan.',
    },
    {
      id: 'mo01-q05',
      orderNumber: 5,
      type: 'CASE',
      indicator: 'Performa Daftar Data Panjang (FlatList vs ScrollView)',
      prompt: 'Aplikasi memuat 1.000 log aktivitas siswa. Jika menggunakan <ScrollView>, memori ponsel langsung melonjak drastis dan scrolling patah-patah. Mengapa <FlatList> menyelesaikan masalah ini?',
      options: [
        'FlatList mengompresi gambar secara otomatis',
        'FlatList hanya merender item yang saat itu terlihat di viewport layar (virtualisasi list berbasis windowing)',
        'FlatList menyimpan data langsung di prosesor grafis GPU',
        'FlatList menonaktifkan fitur scroll',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'FlatList menggunakan teknik virtualization: item di luar jendela pandang layar dilepas dari pohon render untuk menghemat memori perangkat.',
    },
    {
      id: 'mo01-q06',
      orderNumber: 6,
      type: 'CASE',
      indicator: 'Expo Router File-based Routing',
      prompt: 'Dalam proyek Expo Router, Anda membuat file pada path `src/app/jurusan/detail.tsx`. Bagaimanakah rute URL navigasi yang terbentuk secara otomatis?',
      options: ['/jurusan-detail', '/jurusan/detail', '/app/jurusan/detail.html', '/detail?kategori=jurusan'],
      kunciJawabanIndex: 1,
      explanationText: 'Expo Router memetakan struktur file di dalam direktori app langsung menjadi segmen tautan navigasi (/jurusan/detail).',
    },
    {
      id: 'mo01-q07',
      orderNumber: 7,
      type: 'CASE',
      indicator: 'Dynamic Route Parameter',
      prompt: 'Untuk menangkap parameter ID modul dinamis pada rute `app/materi/[id].tsx` di Expo Router, hook apa yang digunakan?',
      options: ['useNavigationParam()', 'useLocalSearchParams()', 'useRouterQuery()', 'useRouteId()'],
      kunciJawabanIndex: 1,
      explanationText: 'useLocalSearchParams() dari expo-router mengembalikan objek parameter rute termasuk slug dinamis [id].',
    },
    {
      id: 'mo01-q08',
      orderNumber: 8,
      type: 'CASE',
      indicator: 'Keyboard Dismissal UX',
      prompt: 'Ketika pengguna mengetik di form registrasi, keyboard bawaan Android menutupi tombol "Daftar". Komponen pembungkus apa yang standar digunakan untuk mengatasi hal ini?',
      options: ['<KeyboardAvoidingView>', '<NoKeyboardScroll>', '<AutoLiftView>', '<InputShield>'],
      kunciJawabanIndex: 0,
      explanationText: 'KeyboardAvoidingView secara otomatis menyesuaikan tinggi atau padding container saat keyboard virtual muncul.',
    },
    {
      id: 'mo01-q09',
      orderNumber: 9,
      type: 'CASE',
      indicator: 'Dimensi Layar Relatif',
      prompt: 'Jika ingin mendesain modal pop-up selebar 90% dari lebar layar ponsel pengguna secara konsisten di semua ukuran gawai, pendekatan styling apa yang paling ideal?',
      options: [
        'width: 360 (angka statis)',
        'width: "90%" atau menggunakan useWindowDimensions().width * 0.9',
        'width: 1000px',
        'width: auto',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Menggunakan persentase ("90%") atau hook useWindowDimensions memastikan tata letak beradaptasi dengan berbagai resolusi layar.',
    },
    {
      id: 'mo01-q10',
      orderNumber: 10,
      type: 'CASE',
      indicator: 'Aset Gambar Lokal vs Jaringan',
      prompt: 'Siswa ingin menampilkan gambar lokal logo yang disimpan di folder `assets/logo.png`. Sintaks penulisan prop source yang benar pada <Image> adalah?',
      options: [
        'source={{ url: "./assets/logo.png" }}',
        'source={require("../../assets/logo.png")}',
        'source="assets/logo.png"',
        'src={require("assets/logo.png")}',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Aset gambar statis lokal di React Native dipanggil melalui fungsi require("path/to/image") di prop source.',
    },
    {
      id: 'mo01-q11',
      orderNumber: 11,
      type: 'CASE',
      indicator: 'Navigasi Stack vs Tabs',
      prompt: 'Sebuah aplikasi memiliki 4 menu utama di baris bawah layar (Beranda, Jurusan, Komunitas, Profil). Navigasi jenis apa yang digunakan untuk pola UI ini?',
      options: ['Stack Navigator', 'Drawer Navigator', 'Bottom Tabs Navigator (misal Tabs dari Expo Router)', 'Modal Navigator'],
      kunciJawabanIndex: 2,
      explanationText: 'Bottom Tabs Navigator menyajikan navigasi baris bawah persisten untuk berpindah antarbagian utama aplikasi.',
    },
    {
      id: 'mo01-q12',
      orderNumber: 12,
      type: 'CASE',
      indicator: 'Pengaturan StatusBar Android',
      prompt: 'Aplikasi menggunakan latar belakang header berwarna biru tua. Agar teks jam dan ikon baterai status bar berwarna putih terang, konfigurasi <StatusBar> apa yang tepat?',
      options: ['barStyle="light-content"', 'barStyle="dark-content"', 'barStyle="white-text"', 'color="bright"'],
      kunciJawabanIndex: 0,
      explanationText: 'barStyle="light-content" membuat teks dan indikator status bar berwarna putih terang untuk kontras di atas latar gelap.',
    },

    // 8 Soal Kode Terstruktur (STRUCTURED_CODE)
    {
      id: 'mo01-q13',
      orderNumber: 13,
      type: 'STRUCTURED_CODE',
      indicator: 'Analisis Kode StyleSheet React Native',
      prompt: 'Perhatikan kode style berikut. Mengapa penulisan border: "1px solid red" akan memicu error di React Native?',
      codeSnippet: `const styles = StyleSheet.create({
  box: {
    border: '1px solid red',
  },
});`,
      options: [
        'React Native tidak mendukung shorthand string CSS seperti "1px solid red"; harus dipecah menjadi borderWidth: 1, borderColor: "red", borderStyle: "solid"',
        'Karena warna red harus menggunakan format RGBA saja',
        'Karena StyleSheet hanya menerima angka',
        'Karena tanda petik satu dilarang di JavaScript',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'StyleSheet React Native adalah objek JavaScript bertipe ketat tanpa parsing CSS shorthand majemuk.',
    },
    {
      id: 'mo01-q14',
      orderNumber: 14,
      type: 'STRUCTURED_CODE',
      indicator: 'Sintaks Pemanggilan Navigasi Imperatif',
      prompt: 'Manakah baris kode Expo Router yang benar untuk berpindah halaman ke rute `/evaluasi/FE-01` secara imperatif saat tombol ditekan?',
      codeSnippet: `import { router } from 'expo-router';`,
      options: [
        'router.push("/evaluasi/FE-01");',
        'window.location.href = "/evaluasi/FE-01";',
        'router.navigateScreen("FE-01");',
        'history.forward("/evaluasi/FE-01");',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'router.push("/path") adalah API navigasi resmi Expo Router untuk menambahkan rute ke navigation stack.',
    },
    {
      id: 'mo01-q15',
      orderNumber: 15,
      type: 'STRUCTURED_CODE',
      indicator: 'FlatList KeyExtractor & RenderItem',
      prompt: 'Perhatikan struktur komponen FlatList berikut. Parameter apa yang diterima oleh fungsi renderItem?',
      codeSnippet: `<FlatList
  data={modulList}
  keyExtractor={(item) => item.id}
  renderItem={({ item, index }) => (
    <CardTitle title={item.title} />
  )}
/>`,
      options: [
        'Objek wrapper yang berisi properti item, index, dan separators',
        'Hanya array data modulList langsung',
        'Nomor ID unik string saja',
        'Objek response HTTP backend',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'renderItem menerima objek { item, index, separators } sehingga pengembang mendestruktur { item } untuk merender tampilan.',
    },
    {
      id: 'mo01-q16',
      orderNumber: 16,
      type: 'STRUCTURED_CODE',
      indicator: 'Platform-specific Code',
      prompt: 'Perhatikan kode deteksi platform berikut. Kode di dalam blok if akan dieksekusi hanya pada gawai apa?',
      codeSnippet: `import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  console.log('Spesifik OS Google');
}`,
      options: [
        'Hanya perangkat sistem operasi Android',
        'Perangkat Android dan iOS sekaligus',
        'Hanya emulator web',
        'Semua perangkat mobile layar sentuh',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Platform.OS mengembalikan string "android", "ios", "windows", "macos", atau "web".',
    },
    {
      id: 'mo01-q17',
      orderNumber: 17,
      type: 'STRUCTURED_CODE',
      indicator: 'NativeWind Tailwind Styling di Komponen Mobile',
      prompt: 'Dengan library NativeWind, bagaimana cara memberikan rounded corner, padding horizontal 4, dan warna latar belakang biru pada komponen View?',
      codeSnippet: `<View className="bg-blue-500 px-4 rounded-xl">
  <Text className="text-white font-bold">Tombol Aksi</Text>
</View>`,
      options: [
        'Menggunakan prop className dengan utilitas Tailwind CSS',
        'Menggunakan tag <style> di dalam file JSX',
        'Menuliskan selector CSS di file terpisah style.css',
        'Memasukkan class di dalam array styles',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'NativeWind mengompilasi utility class Tailwind di prop className menjadi StyleSheet React Native secara native.',
    },
    {
      id: 'mo01-q18',
      orderNumber: 18,
      type: 'STRUCTURED_CODE',
      indicator: 'BackHandler Hardware Android',
      prompt: 'Saat pengguna menekan tombol fisik Back pada Android, aplikasi ingin memunculkan dialog konfirmasi keluar. Hook atau API apa yang harus didengar?',
      codeSnippet: `BackHandler.addEventListener('hardwareBackPress', () => {
  /* tampilkan konfirmasi */
  return true;
});`,
      options: [
        'BackHandler dari react-native; me-return true untuk mencegah aksi keluar default sistem',
        'window.onpopstate',
        'document.onkeydown dengan keyCode 27',
        'Navigation.goBackOverride()',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'BackHandler.addEventListener("hardwareBackPress") menangani tombol back fisik Android; return true mengonsumsi event dan mencegah keluar.',
    },
    {
      id: 'mo01-q19',
      orderNumber: 19,
      type: 'STRUCTURED_CODE',
      indicator: 'Pressable Component State',
      prompt: 'Perhatikan komponen <Pressable> modern berikut. Bagaimanakah cara mengubah opacity hanya ketika tombol sedang ditekan jari?',
      codeSnippet: `<Pressable
  style={({ pressed }) => [
    styles.btn,
    { opacity: pressed ? 0.7 : 1.0 }
  ]}
>
  <Text>Tekan Saya</Text>
</Pressable>`,
      options: [
        'Memanfaatkan fungsi style yang menerima argumen interaktif { pressed }',
        'Memasang event onMouseEnter dan onMouseLeave',
        'Menggunakan CSS pseudo-class :hover',
        'Menambahkan state isPressed secara manual dengan useEffect',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Pressable style prop menerima fungsi callback dengan parameter status sentuhan seperti pressed.',
    },
    {
      id: 'mo01-q20',
      orderNumber: 20,
      type: 'STRUCTURED_CODE',
      indicator: 'ActivityIndicator Spinner',
      prompt: 'Komponen apakah yang disediakan React Native untuk menampilkan roda animasi putar pemuatan data (loading spinner) bawaan platform?',
      codeSnippet: `<ActivityIndicator size="large" color="#0284c7" />`,
      options: [
        '<ActivityIndicator>',
        '<LoadingCircle>',
        '<SpinnerWheel>',
        '<ProgressBarCircular>',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'ActivityIndicator menampilkan indikator pemuatan melingkar native (ProgressBar di Android dan UIActivityIndicatorView di iOS).',
    },
  ],

  // ==========================================
  // 4. T-47: MO-02 — Mobile Lanjutan (Offline & Data)
  // ==========================================
  'MO-02': [
    // 12 Soal Kasus (CASE)
    {
      id: 'mo02-q01',
      orderNumber: 1,
      type: 'CASE',
      indicator: 'Penyimpanan Offline Berbasis Akun (Multi-user Isolation)',
      prompt: 'Pada ponsel SMK yang dipinjam bergantian oleh siswa, Siswa A logout dan Siswa B login. Jika cache disimpan dengan key global seperti `CACHE_MATERI`, apa risiko fatal yang terjadi?',
      options: [
        'Siswa B dapat melihat dan mencemari data progres atau evaluasi pribadi milik Siswa A karena cache tidak diisolasi per akun',
        'Ponsel Android akan restart otomatis',
        'Kamera ponsel tidak dapat berfungsi',
        'Aplikasi akan meminta izin lokasi baru',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Sesuai aturan arsitektur privat (T-57), cache lokal wajib memiliki namespace unik berbasis ownerId (misal `cache_${ownerId}_progress`) agar data antar-pengguna tidak bocor.',
    },
    {
      id: 'mo02-q02',
      orderNumber: 2,
      type: 'CASE',
      indicator: 'Antrean Offline & Idempotensi',
      prompt: 'Siswa menyelesaikan latihan soal saat berada di mode offline (tanpa sinyal). Aplikasi memasukkan event ke antrean lokal. Ketika sinyal kembali, bagaimana cara mencegah pencatatan event ganda di server jika terjadi retry request?',
      options: [
        'Menyertakan Idempotency-Key unik (UUID) pada setiap payload antrean sehingga backend mengabaikan eksekusi duplikat',
        'Menghapus antrean tanpa mengirim ke server',
        'Mengirim data sebanyak 10 kali agar pasti masuk',
        'Menonaktifkan pengiriman data offline',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Kunci idempotensi (Idempotency Key / UUID) menjamin operasi yang dikirim ulang beberapa kali akibat jaringan tidak menimbulkan duplikasi efek samping di backend.',
    },
    {
      id: 'mo02-q03',
      orderNumber: 3,
      type: 'CASE',
      indicator: 'App Lifecycle & Video Pause Otomatis',
      prompt: 'Siswa sedang menonton video pembelajaran wajib di Android. Tiba-tiba masuk panggilan telepon WhatsApp dan aplikasi VocaTrack berpindah ke latar belakang (background). Perilaku apa yang wajib diterapkan player video?',
      options: [
        'Memutar video terus di latar belakang',
        'Mendengarkan event AppState dan otomatis mem-pause playback video untuk mencegah kecurangan tontonan dan pemborosan kuota',
        'Mempercepat kecepatan video menjadi 4x',
        'Menutup aplikasi secara paksa (crash)',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Sesuai spesifikasi T-09, pemutar video wajib mendeteksi perubahan status AppState dan segera menghentikan (pause) pemutaran saat aplikasi tidak aktif/background.',
    },
    {
      id: 'mo02-q04',
      orderNumber: 4,
      type: 'CASE',
      indicator: 'Pencegahan Manipulasi Waktu Ujian di Klien',
      prompt: 'Pada saat evaluasi resmi 20 menit berlangsung di aplikasi mobile, siswa mengubah jam di pengaturan ponsel Android-nya agar waktu ujian bertambah. Mengapa hal ini tidak boleh berhasil?',
      options: [
        'Karena penghitungan sisa waktu ujian dihitung berdasarkan perbandingan serverNow dan deadlineAt resmi dari server, bukan semata-mata jam lokal perangkat',
        'Karena Android melarang pengubahan jam saat aplikasi terbuka',
        'Karena Expo menonaktifkan jam ponsel',
        'Karena ponsel otomatis terputus dari WiFi',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Sesuai aturan F-07 & CT-05, tenggat waktu dan status cutoff dikendalikan oleh server. Manipulasi jam lokal klien tidak memperpanjang tenggat resmi di backend.',
    },
    {
      id: 'mo02-q05',
      orderNumber: 5,
      type: 'CASE',
      indicator: 'Deteksi Status Jaringan (NetInfo)',
      prompt: 'Aplikasi ingin menampilkan banner peringatan "Koneksi Offline - Perubahan disimpan di antrean lokal" saat ponsel kehilangan koneksi internet. Library apa yang standar digunakan di ekosistem Expo/React Native?',
      options: ['@react-native-community/netinfo', 'expo-bluetooth', 'react-native-wifi-manager', 'window.navigator.onlineService'],
      kunciJawabanIndex: 0,
      explanationText: 'NetInfo menyediakan event listener untuk memantau status keterhubungan internet (isConnected) dan tipe koneksi seluler/WiFi.',
    },
    {
      id: 'mo02-q06',
      orderNumber: 6,
      type: 'CASE',
      indicator: 'Penyimpanan Kunci Kredensial Sensitif',
      prompt: 'Aplikasi mobile membutuhkan penyimpanan token autentikasi sesi JWT yang aman dari akses pembacaan tidak sah. Penyimpanan apa yang paling direkomendasikan di React Native / Expo?',
      options: [
        'AsyncStorage biasa dalam bentuk plain text',
        'Expo SecureStore (menggunakan Android Keystore dan iOS Keychain)',
        'Menyimpan token di file teks publik downloads',
        'Menyimpan token di variabel global window',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Expo SecureStore mengenkripsi data secara native menggunakan hardware-backed keystore/keychain gawai.',
    },
    {
      id: 'mo02-q07',
      orderNumber: 7,
      type: 'CASE',
      indicator: 'Batas Retensi Antrean Offline (TTL)',
      prompt: 'Sesuai spesifikasi T-57, berapakah batas masa kedaluwarsa (Time To Live / TTL) untuk antrean aktivitas offline siswa sebelum dinyatakan usang?',
      options: ['1 jam', '24 jam', '7 hari (604.800 detik)', '30 hari'],
      kunciJawabanIndex: 2,
      explanationText: 'Spesifikasi T-57 menetapkan TTL antrean offline selama 7 hari untuk memberi kesempatan siswa di area minim sinyal melakukan sinkronisasi.',
    },
    {
      id: 'mo02-q08',
      orderNumber: 8,
      type: 'CASE',
      indicator: 'Penanganan Konflik Sinkronisasi (Optimistic UI)',
      prompt: 'Saat sinkronisasi antrean lokal dijalankan, server menolak salah satu event karena versi progres server lebih tinggi daripada versi lokal. Pendekatan apa yang harus diambil aplikasi mobile?',
      options: [
        'Menerima status penolakan server, mencatat rejectedEventIds, lalu memperbarui proyeksi lokal ke versi progres terbaru server',
        'Menghapus seluruh akun pengguna dari ponsel',
        'Mengirimkan paket perusak ke server',
        'Menyimpan error di galeri foto',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Kontrak CT-03 mendefinisikan respons acceptedEventIds dan rejectedEventIds beserta progressVersion resmi untuk memperbarui state klien secara konsisten.',
    },
    {
      id: 'mo02-q09',
      orderNumber: 9,
      type: 'CASE',
      indicator: 'Pengelolaan Kuota Chatbot AI di Klien',
      prompt: 'Siswa mengajukan pertanyaan ke VocaBot tutor. Backend mengembalikan status 429 atau kuota harian habis. Tampilan seperti apa yang harus disajikan kepada siswa?',
      options: [
        'Pesan error crash berwarna merah',
        'Menampilkan penjelasan bahwa kuota AI habis beserta kartu jawaban FAQ kurasi (CURATED) yang relevan dengan modul yang dipelajari',
        'Menutup aplikasi secara paksa',
        'Menyuruh siswa membeli pulsa',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Sesuai spesifikasi F-10 & T-61, jika kuota AI harian habis atau offline, sistem menyajikan konten kurasi manusia (CURATED) sebagai fallback yang bermanfaat.',
    },
    {
      id: 'mo02-q10',
      orderNumber: 10,
      type: 'CASE',
      indicator: 'Pembersihan Sesi Logout Bersih',
      prompt: 'Saat tombol "Keluar Akun" ditekan oleh siswa di aplikasi, langkah apa saja yang wajib dieksekusi oleh service layer?',
      options: [
        'Menghapus sesi auth Supabase, menghapus cache privat akun di lokal storage, dan mereset store state ke kondisi awal tamu',
        'Hanya mengganti tampilan layar tanpa menghapus token auth',
        'Menghapus aplikasi dari ponsel Android',
        'Memformat kartu memori SD Card',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Logout yang aman membersihkan kredensial sesi jaringan dan membuang memori state/cache privat pengguna dari perangkat.',
    },
    {
      id: 'mo02-q11',
      orderNumber: 11,
      type: 'CASE',
      indicator: 'Stabilitas Panggilan API di Area Sinyal Lemah',
      prompt: 'Aplikasi sering mengalami request timeout saat berada di daerah blank spot. Pola retry apa yang paling ramah server untuk menangani percobaan ulang panggilan API?',
      options: [
        'Loop tak hingga setiap 10 milidetik',
        'Exponential Backoff dengan Jitter (penundaan waktu bertingkat secara acak)',
        'Membuat 100 HTTP connection paralel bersamaan',
        'Menonaktifkan timeout koneksi',
      ],
      kunciJawabanIndex: 1,
      explanationText: 'Exponential backoff dengan jitter mencegah terjadinya gelombang beban serentak (thundering herd problem) ke backend.',
    },
    {
      id: 'mo02-q12',
      orderNumber: 12,
      type: 'CASE',
      indicator: 'Pemisahan Tanggung Jawab Penilaian (Frontend vs Backend)',
      prompt: 'Mengapa kode frontend mobile VocaTrack DILARANG menghitung nilai resmi evaluasi dan menentukan kelulusan siswa secara mandiri di komponen React Native?',
      options: [
        'Karena kode klien berjalan di perangkat pengguna yang rentan direkayasa atau dimodifikasi; backend adalah satu-satunya otoritas penentu kelulusan dan nilai resmi',
        'Karena React Native tidak bisa menghitung operasi perkalian',
        'Karena aturan dari Google Play Store melarang rumus matematika',
        'Karena kalkulasi nilai membuat baterai ponsel cepat habis',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Sesuai prinsip F-07 & BR-G-02: integritas evaluasi resmi hanya diakui jika dinilai oleh server secara terpusat dengan log audit yang sah.',
    },

    // 8 Soal Kode Terstruktur (STRUCTURED_CODE)
    {
      id: 'mo02-q13',
      orderNumber: 13,
      type: 'STRUCTURED_CODE',
      indicator: 'Analisis Serialisasi AsyncStorage',
      prompt: 'Perhatikan kode penyimpanan AsyncStorage berikut. Mengapa data profil tidak tersimpan dengan benar jika disimpan langsung tanpa JSON.stringify?',
      codeSnippet: `const profil = { nama: 'Budi', kelas: 'XII RPL 1' };
await AsyncStorage.setItem('USER_PROFILE', profil);`,
      options: [
        'Karena AsyncStorage hanya menerima data string; mengirimkan objek langsung akan menghasilkan "[object Object]" di penyimpanan lokal',
        'Karena nama siswa mengandung spasi',
        'Karena AsyncStorage hanya menerima angka boolean',
        'Karena variabel profil belum di-freeze',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'AsyncStorage berbasis key-value string murni. Objek wajib diserialisasi menggunakan JSON.stringify(obj) saat simpan dan JSON.parse(str) saat baca.',
    },
    {
      id: 'mo02-q14',
      orderNumber: 14,
      type: 'STRUCTURED_CODE',
      indicator: 'Perhitungan Cakupan Tontonan Video (Union of Intervals)',
      prompt: 'Siswa menonton video dari detik 0-30, lalu meloncat dan menonton detik 60-90. Mengapa total cakupan tontonan bernilai 60 detik (bukan 90 detik)?',
      codeSnippet: `const intervals = [
  { start: 0, end: 30 },
  { start: 60, end: 90 },
];
const coverage = calculateUnionDuration(intervals);`,
      options: [
        'Karena algoritma union of intervals hanya menjumlahkan durasi segmen yang benar-benar ditonton tanpa menghitung gap/celah yang dilompati',
        'Karena video otomatis di-reset ke detik 0',
        'Karena durasi maksimum dipotong setengah',
        'Karena format detiknya adalah heksadesimal',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Sesuai T-09, cakupan tontonan 100% mengharuskan penggabungan interval (union) segmen nyata yang ditonton siswa untuk mencegah kecurangan seek.',
    },
    {
      id: 'mo02-q15',
      orderNumber: 15,
      type: 'STRUCTURED_CODE',
      indicator: 'Manajemen Status Antrean Offline di UI',
      prompt: 'Perhatikan badge status aktivitas lokal berikut. Manakah status yang menandakan bahwa data telah tersimpan di ponsel namun sedang menunggu jaringan internet untuk dikirim?',
      codeSnippet: `type SyncBadgeStatus = 'LOCAL' | 'PENDING' | 'SYNCED' | 'FAILED';`,
      options: [
        'PENDING',
        'SYNCED',
        'FAILED',
        'LOCAL',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Status PENDING menandakan antrean aktivitas sedang menunggu giliran pengiriman sinkronisasi ke backend.',
    },
    {
      id: 'mo02-q16',
      orderNumber: 16,
      type: 'STRUCTURED_CODE',
      indicator: 'Pembacaan Error Envelope API Standar',
      prompt: 'Server mengembalikan respons error berstandar CT-01 s.d CT-12. Bagaimanakah cara komponen UI membaca pesan ramah pengguna dari struktur error tersebut?',
      codeSnippet: `interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string>;
  };
}`,
      options: [
        'Membaca properti err.response.data.error.message',
        'Membaca err.toString() secara mentah',
        'Membaca err.code saja',
        'Membaca status teks peramban',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Format API error envelope membungkus rincian kegagalan dalam objek error yang berisi kode dan pesan kontekstual.',
    },
    {
      id: 'mo02-q17',
      orderNumber: 17,
      type: 'STRUCTURED_CODE',
      indicator: 'Struktur Snapshot Jawaban Klien Evaluasi Resmi',
      prompt: 'Saat mengirim jawaban evaluasi resmi (CT-06), mengapa dikirim dalam bentuk array snapshot dengan answerVersion?',
      codeSnippet: `const payload: AnswerSubmissionItem[] = [
  { questionInstanceId: 'q-01', selectedOptionIndex: 2, answerVersion: 1 },
  { questionInstanceId: 'q-02', selectedOptionIndex: null, answerVersion: 1 },
];`,
      options: [
        'Untuk memfasilitasi deteksi urutan revisi jawaban dan rekonsiliasi yang aman dari latensi jaringan',
        'Karena server membutuhkan format XML',
        'Agar jawaban langsung didekripsi di klien',
        'Karena nomor soal tidak boleh dikirim',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'AnswerVersion dan snapshot array memungkinkan backend memastikan urutan revisi jawaban terbaru yang sah dari klien.',
    },
    {
      id: 'mo02-q18',
      orderNumber: 18,
      type: 'STRUCTURED_CODE',
      indicator: 'Parsing Tanggal ISO 8601 di Mobile',
      prompt: 'Server mengirimkan deadline evaluasi dalam string ISO: "2026-11-05T04:30:00.000Z". Cara manakah yang paling aman untuk menghitung sisa detik di JavaScript?',
      codeSnippet: `const deadlineMs = new Date(deadlineString).getTime();
const nowMs = Date.now();
const sisaDetik = Math.max(0, Math.floor((deadlineMs - nowMs) / 1000));`,
      options: [
        'Mengonversi ke timestamp milidetik dengan new Date().getTime() lalu menghitung selisih dan membulatkannya dengan Math.max(0)',
        'Memotong string dengan substring(11, 19)',
        'Menambahkan 20 ke jam ponsel',
        'Menggunakan perulangan for sampai 1200',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Konversi string ISO ke epoch timestamp (milidetik) adalah metode standar tahan zona waktu untuk kalkulasi hitung mundur sisa detik.',
    },
    {
      id: 'mo02-q19',
      orderNumber: 19,
      type: 'STRUCTURED_CODE',
      indicator: 'Penanganan Deep Link pada Skema URL Mobile',
      prompt: 'Aplikasi VocaTrack mendukung tautan pemulihan kata sandi via email dengan skema `vocatrack://reset-password?token=XYZ`. Hook Expo Router apa yang menangani tautan masuk ini?',
      options: [
        'Expo Router menangani skema URL secara otomatis dan mengarahkan ke file route `app/reset-password.tsx` dengan parameter dibaca via useLocalSearchParams()',
        'window.addEventListener("hashchange")',
        'LinkingManager.overrideAndroidApp()',
        'ExpoRouter.clearHistory()',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Expo Router mendukung universal dan deep linking secara native sesuai konfigurasi scheme di app.json.',
    },
    {
      id: 'mo02-q20',
      orderNumber: 20,
      type: 'STRUCTURED_CODE',
      indicator: 'Pemeriksaan Versi Rilis Kurikulum (Release ID)',
      prompt: 'Mengapa setiap modul kurikulum dan bank soal evaluasi wajib menyertakan atribut version dan packageVersionId?',
      codeSnippet: `interface CurriculumRelease {
  releaseId: string;
  version: string;
  modules: ModuleVersion[];
}`,
      options: [
        'Untuk memastikan bahwa riwayat evaluasi masa lalu dinilai berdasarkan versi silabus yang berlaku saat siswa mengerjakannya (auditabilitas)',
        'Agar siswa tidak dapat mengunduh materi baru',
        'Sebagai syarat registrasi domain web',
        'Untuk mengganti warna logo aplikasi',
      ],
      kunciJawabanIndex: 0,
      explanationText: 'Versioning silabus menjamin data historis nilai siswa tetap konsisten dan dapat diaudit meskipun kurikulum di masa depan diperbarui.',
    },
  ],
};

