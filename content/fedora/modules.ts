import { ModuleVersion } from '../../types/contracts';

/**
 * PAKET BELAJAR MODUL KHUSUS FEDORA (T-34, T-35, T-38, T-39)
 * Acuan: PP-01, PP-02, PP-06 SPESIFIKASI.md
 * Modul Frontend: FE-01, FE-02
 * Modul Mobile: MO-01, MO-02
 */

export const FEDORA_MODULES: Record<string, ModuleVersion> = {
  // ==========================================
  // 1. T-34: FE-01 — Pengantar Web Developer
  // ==========================================
  'FE-01': {
    id: 'FE-01',
    title: 'Pengantar Frontend: Web Fondasi',
    subtitle: 'HTML5 Semantik, CSS3 Flexbox/Grid, & Interaksi DOM JavaScript',
    category: 'FRONTEND',
    order: 4,
    description:
      'Mempelajari dasar pembuatan halaman web menggunakan tag HTML5 semantik, penataan tata letak responsif dengan CSS Flexbox, serta manipulasi Document Object Model (DOM) menggunakan JavaScript.',
    readingContent: `### Pengantar Web Frontend

Frontend development adalah proses membangun antarmuka pengguna (User Interface) pada sebuah aplikasi web. Tiga pilar utama web frontend meliputi:

1. **HTML (HyperText Markup Language)**: Kerangka struktur konten halaman web. Gunakan elemen semantik seperti \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, dan \`<footer>\` untuk aksesibilitas dan SEO yang baik.
2. **CSS (Cascading Style Sheets)**: Bahasa gaya untuk tata letak, warna, tipografi, dan responsivitas. Desain modern menggunakan CSS Flexbox (\`display: flex\`) untuk satu dimensi dan CSS Grid untuk dua dimensi.
3. **JavaScript**: Bahasa pemrograman interaktif yang berjalan di peramban (browser). JavaScript memungkinkan manipulasi DOM, penanganan event klik/input, dan komunikasi data asynchronous (AJAX/Fetch API).

\`\`\`html
<!-- Contoh Struktur Form Input Tugas -->
<form id="taskForm">
  <input type="text" id="taskTitle" placeholder="Judul tugas..." required />
  <button type="submit">Tambah Tugas</button>
</form>
\`\`\`

\`\`\`javascript
// Manipulasi DOM Sederhana
const form = document.getElementById('taskForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('taskTitle');
  console.log('Tugas baru:', input.value.trim());
  input.value = '';
});
\`\`\``,
    videoAssetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 180,
    requiredSegments: [
      { startMs: 0, endMs: 60000, label: 'Struktur HTML Semantik' },
      { startMs: 60000, endMs: 120000, label: 'CSS Flexbox Responsif' },
      { startMs: 120000, endMs: 180000, label: 'Interaksi JavaScript & DOM' },
    ],
    prerequisiteModuleIds: ['FND-03'],
    isCoreRecommendation: true, // Evaluasi inti rekomendasi
    xpReward: 200,
    version: '1.0.0',
    practiceItems: [
      {
        id: 'fe01-p1',
        question: 'Manakah tag HTML5 yang paling tepat untuk membungkus area konten utama suatu halaman web?',
        options: ['<div>', '<main>', '<section>', '<article>'],
        kunciIndex: 1,
        explanation: 'Elemen <main> secara semantik menandai area konten utama yang unik dalam suatu dokumen web.',
      },
      {
        id: 'fe01-p2',
        question: 'Properti CSS apa yang digunakan untuk mengatur perataan elemen anak secara horizontal pada container flex?',
        options: ['align-items', 'justify-content', 'flex-direction', 'align-content'],
        kunciIndex: 1,
        explanation: 'justify-content mengatur perataan item di sepanjang main axis (default horizontal saat flex-direction: row).',
      },
      {
        id: 'fe01-p3',
        question: 'Metode JavaScript apa yang paling tepat untuk menangani event submit pada elemen form agar halaman tidak reload?',
        options: ['event.stopPropagation()', 'event.preventDefault()', 'event.stopImmediatePropagation()', 'return true'],
        kunciIndex: 1,
        explanation: 'event.preventDefault() membatalkan perilaku default browser saat submit form yaitu memuat ulang halaman.',
      },
    ],
    faqItems: [
      {
        id: 'fe01-faq1',
        question: 'Apa perbedaan antara inline, block, dan inline-block pada CSS?',
        answer: 'Elemen block selalu memulai baris baru dan mengambil lebar penuh. Elemen inline hanya memakan lebar kontennya dan tidak bisa diatur height/width. Inline-block mengalir sebaris tetapi bisa diatur height dan width.',
      },
      {
        id: 'fe01-faq2',
        question: 'Mengapa kita harus menggunakan tag semantik seperti <nav> dan <article>?',
        answer: 'Tag semantik mempermudah screen reader (aksesibilitas bagi penyandang disabilitas) dan mesin pencari (SEO) memahami struktur halaman.',
      },
      {
        id: 'fe01-faq3',
        question: 'Apa perbedaan antara flex-direction: row dan column?',
        answer: 'Row menyusun anak elemen secara mendatar dari kiri ke kanan, sedangkan column menyusun anak elemen secara vertikal dari atas ke bawah.',
      },
      {
        id: 'fe01-faq4',
        question: 'Bagaimana cara menambahkan class baru pada elemen DOM via JavaScript?',
        answer: 'Gunakan element.classList.add("nama-class") untuk menambahkan class CSS secara dinamis.',
      },
      {
        id: 'fe01-faq5',
        question: 'Apakah CSS Flexbox sudah cukup untuk membuat layout responsif mobile?',
        answer: 'Flexbox sangat bagus untuk tata letak satu dimensi dan komponen responsif, biasanya dikombinasikan dengan media queries untuk breakpoint layar HP.',
      },
    ],
  },

  // ==========================================
  // 2. T-35: FE-02 — Frontend Lanjutan (React)
  // ==========================================
  'FE-02': {
    id: 'FE-02',
    title: 'Frontend Lanjutan: React & API Integration',
    subtitle: 'Komponen Deklaratif, State Hooks, Form, & Pengambilan Data Async',
    category: 'FRONTEND',
    order: 5,
    description:
      'Membangun aplikasi web interaktif menggunakan library React: pemecahan komponen modular, pengelolaan state lokal dengan useState, efek samping dengan useEffect, serta integrasi API pengelola tugas.',
    readingContent: `### React & Integrasi Data

React adalah library JavaScript untuk membangun antarmuka pengguna berbasis komponen (component-based).

1. **Komponen Fungsional**: Fungsi JavaScript yang mengembalikan JSX (JavaScript XML).
2. **State & Props**:
   - \`props\`: Data masukan yang dikirim dari komponen induk (bersifat read-only).
   - \`useState\`: Hook untuk menyimpan data dinamis internal komponen.
3. **Penanganan Efek Samping (useEffect)**: Hook untuk sinkronisasi dengan sistem luar, seperti mengambil data dari API saat komponen pertama kali dimuat.
4. **State Siklus Hidup API**:
   - Loading state: Menampilkan indikator saat data sedang diambil.
   - Empty state: Menampilkan pesan informatif jika belum ada data.
   - Error state: Menampilkan pesan kesalahan dan tombol coba lagi jika koneksi gagal.

\`\`\`jsx
// Contoh Komponen Daftar Tugas React
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/practice-v1/tasks')
      .then(res => res.json())
      .then(data => { setTasks(data.items); setLoading(false); })
      .catch(err => { setError('Gagal memuat tugas'); setLoading(false); });
  }, []);

  if (loading) return <p>Memuat tugas...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;
  if (tasks.length === 0) return <p>Belum ada tugas belajar.</p>;

  return (
    <ul>
      {tasks.map(t => <li key={t.id}>{t.title} - {t.status}</li>)}
    </ul>
  );
}
\`\`\``,
    videoAssetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 180,
    requiredSegments: [
      { startMs: 0, endMs: 60000, label: 'Komponen & State React' },
      { startMs: 60000, endMs: 120000, label: 'Pengelolaan Form & Event' },
      { startMs: 120000, endMs: 180000, label: 'Integrasi API & Siklus Data' },
    ],
    prerequisiteModuleIds: ['FE-01'],
    isCoreRecommendation: false, // Modul pendalaman menuju proyek
    xpReward: 250,
    version: '1.0.0',
    practiceItems: [
      {
        id: 'fe02-p1',
        question: 'Hook manakah yang digunakan untuk mengelola data lokal yang berubah di dalam komponen fungsional React?',
        options: ['useEffect', 'useMemo', 'useState', 'useRef'],
        kunciIndex: 2,
        explanation: 'useState digunakan untuk mendeklarasikan variabel state dan fungsi setter pengubahnya di dalam komponen fungsional.',
      },
      {
        id: 'fe02-p2',
        question: 'Bagaimana cara menjalankan fetch data API hanya sekali saat komponen React pertama kali dipasang (mount)?',
        options: ['useEffect(fn, [])', 'useEffect(fn)', 'useEffect(fn, [data])', 'useCallback(fn)'],
        kunciIndex: 0,
        explanation: 'Array dependensi kosong [] menandakan efek hanya dieksekusi sekali saat komponen pertama kali mount.',
      },
      {
        id: 'fe02-p3',
        question: 'Mengapa atribut "key" wajib diberikan saat me-render daftar elemen dengan fungsi .map() di React?',
        options: ['Untuk mengubah warna elemen', 'Untuk membantu algoritma rekonsiliasi React mengidentifikasi item yang berubah/dihapus', 'Untuk mengurutkan array secara alfabetis', 'Sebagai pengganti ID database'],
        kunciIndex: 1,
        explanation: 'Atribut key memberikan identitas stabil pada setiap elemen sehingga React Virtual DOM dapat melakukan pembaruan secara efisien.',
      },
    ],
    faqItems: [
      {
        id: 'fe02-faq1',
        question: 'Apa perbedaan antara state dan props di React?',
        answer: 'Props adalah data yang diteruskan oleh parent component ke child component (read-only), sedangkan state adalah data internal yang dikelola dan diubah oleh komponen itu sendiri.',
      },
      {
        id: 'fe02-faq2',
        question: 'Kenapa kita tidak boleh mengubah state langsung seperti state.count = 5?',
        answer: 'Mengubah state langsung tidak akan memicu re-render pada UI. Selalu gunakan fungsi setter yang disediakan oleh useState (misal: setCount(5)).',
      },
      {
        id: 'fe02-faq3',
        question: 'Apa fungsi dari controlled component pada form input?',
        answer: 'Controlled component menghubungkan nilai input form secara langsung ke state React, sehingga setiap ketukan karakter dikendalikan oleh state.',
      },
      {
        id: 'fe02-faq4',
        question: 'Kapan kita harus menampilkan loading indicator?',
        answer: 'Loading indicator wajib ditampilkan saat aplikasi sedang menunggu respon dari server (network request) agar pengguna tahu proses sedang berlangsung.',
      },
      {
        id: 'fe02-faq5',
        question: 'Bagaimana cara menangani kondisi ketika server API mati / gagal terhubung?',
        answer: 'Tangkap error dalam blok catch, lalu ubah state error untuk menampilkan pesan kesalahan yang ramah dan sediakan tombol retry (coba lagi).',
      },
    ],
  },

  // ==========================================
  // 3. T-38: MO-01 — Pengantar Mobile Developer
  // ==========================================
  'MO-01': {
    id: 'MO-01',
    title: 'Pengantar Mobile: Native Components & Navigasi',
    subtitle: 'Arsitektur React Native, Komponen UI Dasar, & Alur Layar Android',
    category: 'MOBILE',
    order: 8,
    description:
      'Mempelajari konsep dasar pengembangan aplikasi mobile berbasis React Native dan Expo: perbedaan komponen web vs native (View, Text, Image, TouchableOpacity), sistem layout Flexbox mobile, serta navigasi antar layar.',
    readingContent: `### Fondasi Aplikasi Mobile dengan React Native

React Native memungkinkan pengembang membuat aplikasi mobile Android dan iOS menggunakan JavaScript dan React.

1. **Komponen Inti Native**:
   - Menggantikan elemen HTML dengan komponen native wrapper:
     - \`<div>\` digantikan oleh \`<View>\`
     - \`<p>\` / \`<h1>\` digantikan oleh \`<Text>\`
     - \`<img>\` digantikan oleh \`<Image>\`
     - \`<button>\` digantikan oleh \`<TouchableOpacity>\` atau \`<Pressable>\`
2. **Flexbox pada Mobile**:
   - Berbeda dari web, pada React Native nilai default \`flexDirection\` adalah **'column'** (dari atas ke bawah).
   - Seluruh dimensi angka di React Native adalah density-independent pixels (dp).
3. **Penanganan Area Layar Aman**:
   - Perangkat modern memiliki notch, kamera punch-hole, dan gestur navigasi. Gunakan \`SafeAreaView\` untuk memastikan antarmuka tidak terpotong.
4. **Navigasi Layar**:
   - Menggunakan Expo Router (file-based routing) atau Stack Navigation untuk berpindah antar halaman secara mulus.

\`\`\`jsx
// Contoh Komponen Card Tugas Mobile
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function TaskCard({ title, isDone, onToggle }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.title, isDone && styles.doneText]}>{title}</Text>
      <TouchableOpacity style={styles.btn} onPress={onToggle}>
        <Text style={styles.btnText}>{isDone ? 'Selesai' : 'Belum'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 10 },
  title: { fontSize: 16, color: '#0F172A', fontWeight: '600' },
  doneText: { textDecorationLine: 'line-through', color: '#94A3B8' },
  btn: { marginTop: 8, padding: 8, backgroundColor: '#2B7BF6', borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold' },
});
\`\`\``,
    videoAssetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 180,
    requiredSegments: [
      { startMs: 0, endMs: 60000, label: 'Pengantar Native Components' },
      { startMs: 60000, endMs: 120000, label: 'Flexbox & Tata Letak Mobile' },
      { startMs: 120000, endMs: 180000, label: 'Navigasi Antar Layar' },
    ],
    prerequisiteModuleIds: ['FND-03'],
    isCoreRecommendation: true, // Evaluasi inti rekomendasi
    xpReward: 200,
    version: '1.0.0',
    practiceItems: [
      {
        id: 'mo01-p1',
        question: 'Apakah nilai default dari properti flexDirection pada React Native?',
        options: ['row', 'column', 'row-reverse', 'none'],
        kunciIndex: 1,
        explanation: 'Pada React Native, nilai default flexDirection adalah "column", berbeda dari CSS web yang default-nya "row".',
      },
      {
        id: 'mo01-p2',
        question: 'Komponen manakah yang wajib digunakan untuk menampilkan teks tulisan di layar pada React Native?',
        options: ['<View>', '<Label>', '<Text>', '<span>'],
        kunciIndex: 2,
        explanation: 'Di React Native, semua teks harus berada di dalam komponen <Text>, jika diletakkan di dalam <View> tanpa <Text> akan menyebabkan error.',
      },
      {
        id: 'mo01-p3',
        question: 'Komponen apa yang digunakan untuk membungkus elemen interaktif agar memberikan umpan balik visual saat disentuh?',
        options: ['<TouchableOpacity>', '<View>', '<ScrollView>', '<TouchableNone>'],
        kunciIndex: 0,
        explanation: '<TouchableOpacity> merespons sentuhan dengan mengurangi opasitas (transparansi) elemen secara halus saat ditekan.',
      },
    ],
    faqItems: [
      {
        id: 'mo01-faq1',
        question: 'Bisakah kita menggunakan tag HTML seperti <div> dan <h1> di React Native?',
        answer: 'Tidak bisa. React Native merender komponen native Android/iOS, sehingga kita harus menggunakan komponen bawaan seperti <View> dan <Text>.',
      },
      {
        id: 'mo01-faq2',
        question: 'Apa fungsi SafeAreaView di Android dan iOS?',
        answer: 'SafeAreaView mencegah konten tertutup oleh notch kamera, status bar sistem, atau garis gestur navigasi bawah.',
      },
      {
        id: 'mo01-faq3',
        question: 'Bagaimana cara menambahkan scroll pada layar di React Native?',
        answer: 'Bungkus konten dengan <ScrollView> untuk konten statis/sedang, atau gunakan <FlatList> untuk daftar data panjang agar efisien memori.',
      },
      {
        id: 'mo01-faq4',
        question: 'Apakah satuan piksel di React Native sama dengan piksel layar HP?',
        answer: 'Angka ukuran di React Native menggunakan density-independent pixels (dp), yang otomatis diskalakan sesuai kerapatan layar HP.',
      },
      {
        id: 'mo01-faq5',
        question: 'Bagaimana cara melakukan navigasi ke layar lain menggunakan Expo Router?',
        answer: 'Import { router } from "expo-router", lalu panggil router.push("/nama-layanan") atau router.replace("/nama-layanan").',
      },
    ],
  },

  // ==========================================
  // 4. T-39: MO-02 — Mobile Lanjutan (Expo & API)
  // ==========================================
  'MO-02': {
    id: 'MO-02',
    title: 'Mobile Lanjutan: CRUD & Offline Resilience',
    subtitle: 'Integrasi API Latihan, Siklus Data, & Ketahanan Jaringan Android',
    category: 'MOBILE',
    order: 9,
    description:
      'Membangun fitur aplikasi mobile lengkap: operasi CRUD tugas melalui API latihan tim, pengelolaan state daftar dan filter kategori, penanganan loading, empty state, serta penanganan kegagalan koneksi internet pada perangkat Android.',
    readingContent: `### Mobile CRUD & Penanganan Gangguan Jaringan

Aplikasi mobile berjalan di lingkungan yang tidak stabil (koneksi seluler sering terputus, masuk terowongan, atau kuota habis). Aplikasi mobile yang baik harus tangguh (*resilient*).

1. **Paket Fungsi Inti Proyek (D-29)**:
   - Tambah tugas baru dengan judul, deskripsi, dan kategori.
   - Menampilkan daftar tugas dengan status (TODO / DONE).
   - Fitur pencarian kata kunci dan filter kategori.
   - Mengubah status tugas menjadi selesai atau mengedit data.
   - Menghapus tugas dengan konfirmasi.
2. **Penanganan Tiga Keadaan UI**:
   - **Loading State**: Tampilkan skeleton atau \`<ActivityIndicator>\` berwarna biru.
   - **Empty State**: Jika data tugas kosong, tampilkan ilustrasi dan pesan ajakan membuat tugas baru.
   - **Error State**: Jika koneksi jaringan gagal, tampilkan pesan informatif dan tombol "Coba Lagi" (Retry).
3. **Penyimpanan Lokal untuk Offline**:
   - Simpan data penting ke penyimpanan lokal agar pengguna tetap dapat melihat data saat internet mati.

\`\`\`jsx
// Contoh Pola Penanganan Jaringan pada React Native
export function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOfflineError, setIsOfflineError] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    setIsOfflineError(false);
    try {
      const response = await fetch('https://api.vocatrack.id/practice-v1/tasks');
      const json = await response.json();
      setTasks(json.items);
    } catch (err) {
      setIsOfflineError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  if (loading) return <ActivityIndicator size="large" color="#2B7BF6" />;
  if (isOfflineError) {
    return (
      <View style={styles.center}>
        <Text>Koneksi internet terputus.</Text>
        <TouchableOpacity onPress={loadTasks} style={styles.retryBtn}>
          <Text style={{color: '#fff'}}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return <FlatList data={tasks} renderItem={renderItem} keyExtractor={item => item.id} />;
}
\`\`\``,
    videoAssetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 180,
    requiredSegments: [
      { startMs: 0, endMs: 60000, label: 'Operasi CRUD pada Mobile' },
      { startMs: 60000, endMs: 120000, label: 'Filter & Pencarian FlatList' },
      { startMs: 120000, endMs: 180000, label: 'Penanganan Offline & Error' },
    ],
    prerequisiteModuleIds: ['MO-01'],
    isCoreRecommendation: false, // Modul pendalaman menuju proyek
    xpReward: 250,
    version: '1.0.0',
    practiceItems: [
      {
        id: 'mo02-p1',
        question: 'Komponen mana yang paling efisien digunakan untuk me-render daftar tugas dengan ratusan item di React Native?',
        options: ['<ScrollView>', '<FlatList>', '<View>', '<SectionStatic>'],
        kunciIndex: 1,
        explanation: '<FlatList> hanya me-render item yang terlihat di layar (lazy rendering), sehingga sangat hemat memori pada perangkat mobile.',
      },
      {
        id: 'mo02-p2',
        question: 'Komponen indikator bawaan React Native apa yang digunakan untuk menampilkan animasi pemuatan (loading spinner)?',
        options: ['<ProgressBar>', '<Spinner>', '<ActivityIndicator>', '<LoadingCircle>'],
        kunciIndex: 2,
        explanation: '<ActivityIndicator> adalah komponen bawaan React Native untuk menampilkan loading spinner platform native.',
      },
      {
        id: 'mo02-p3',
        question: 'Apa langkah terbaik saat pemanggilan API gagal karena jaringan mati pada aplikasi mobile?',
        options: ['Tutup aplikasi secara paksa', 'Tampilkan pesan error yang ramah dan sediakan tombol retry tanpa merusak state lokal', 'Hapus semua data tersimpan', 'Ulangi request tanpa jeda terus menerus'],
        kunciIndex: 1,
        explanation: 'Memberikan umpan balik yang jelas dengan tombol coba lagi (retry) menjaga user experience yang baik saat jaringan terganggu.',
      },
    ],
    faqItems: [
      {
        id: 'mo02-faq1',
        question: 'Mengapa FlatList lebih disukai daripada ScrollView untuk data dinamis?',
        answer: 'ScrollView merender seluruh item sekaligus di memori, sedangkan FlatList hanya merender item yang muncul di viewport layar sehingga performa tetap lancar.',
      },
      {
        id: 'mo02-faq2',
        question: 'Bagaimana cara menambahkan fitur Refresh (Tarik ke Bawah) pada daftar tugas?',
        answer: 'Gunakan properti refreshing dan onRefresh pada komponen <FlatList> untuk mengaktifkan pull-to-refresh bawaan Android.',
      },
      {
        id: 'mo02-faq3',
        question: 'Bagaimana cara memvalidasi input judul tugas agar tidak boleh kosong atau spasi saja?',
        answer: 'Gunakan string.trim(). Jika title.trim().length === 0, tampilkan pesan validasi kesalahan dan batalkan pengiriman data.',
      },
      {
        id: 'mo02-faq4',
        question: 'Apakah tombol hapus tugas perlu konfirmasi alert?',
        answer: 'Ya, tindakan destruktif seperti hapus tugas wajib memiliki dialog konfirmasi (Alert.alert) untuk mencegah ketidaksengajaan pengguna.',
      },
      {
        id: 'mo02-faq5',
        question: 'Apa yang harus dilakukan jika ada tugas yang baru saja dibuat saat offline?',
        answer: 'Tandai status tugas sebagai "pending" di antrean lokal, dan kirimkan ke server saat koneksi internet terhubung kembali.',
      },
    ],
  },
};

