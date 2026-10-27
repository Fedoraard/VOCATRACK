export interface ChatMessagePayload {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `Kamu adalah VocaBot AI, asisten pintar dan ramah untuk siswa SMK serta pendidikan vokasi di Indonesia dalam aplikasi VOCATRACK.
Tugas utama kamu:
1. Membantu siswa memahami jurusan vokasi/SMK (seperti Rekayasa Perangkat Lunak, DKV, TKJ, Teknik Mesin, Akuntansi, dsb.).
2. Memberikan konsultasi prospek karier, sertifikasi industri (BNSP), dan tips persiapan magang/PKL.
3. Menjelaskan materi belajar kejuruan dengan gaya bahasa yang mudah dimengerti, edukatif, dan menyemangati.

Panduan gaya bicara:
- Gunakan bahasa Indonesia yang santun, ramah, dan memotivasi.
- Berikan poin-poin yang terstruktur jika menjelaskan tips atau langkah karier.
- Jaga jawaban tetap ringkas, padat, dan relevan dengan pendidikan vokasi.`;

export async function askVocaBot(
  userQuery: string,
  history: { sender: 'bot' | 'user'; text: string }[] = []
): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_AI_API_KEY?.trim();
  const rawBaseUrl = process.env.EXPO_PUBLIC_AI_BASE_URL?.trim();
  const model = process.env.EXPO_PUBLIC_AI_MODEL?.trim() || 'deepseek-chat';

  // Fallback default endpoint (OpenAI compatible)
  // Bisa untuk DeepSeek (https://api.deepseek.com/chat/completions),
  // Groq (https://api.groq.com/openai/v1/chat/completions),
  // atau OpenRouter (https://openrouter.ai/api/v1/chat/completions)
  let endpoint = rawBaseUrl || 'https://api.deepseek.com/chat/completions';
  if (!endpoint.includes('/chat/completions')) {
    endpoint = endpoint.replace(/\/+$/, '') + '/chat/completions';
  }

  // Jika belum memasang API key, gunakan balasan lokal cerdas (mock fallback)
  if (!apiKey || apiKey === 'your-ai-api-key-here') {
    const queryLower = userQuery.toLowerCase();
    if (queryLower.includes('dkv') || queryLower.includes('desain')) {
      return 'Jurusan DKV berfokus pada komunikasi visual! Peluang kariernya sangat luas, mulai dari UI/UX Designer, Motion Graphic Artist, hingga Brand Designer dengan sertifikasi Adobe & BNSP.';
    }
    if (queryLower.includes('rpl') || queryLower.includes('coding') || queryLower.includes('web')) {
      return 'Jurusan Rekayasa Perangkat Lunak (RPL) membekali kamu dengan skill Web Dev, Mobile Apps, dan Database. Industri teknologi saat ini sangat membutuhkan lulusan vokasi yang adaptif!';
    }
    if (queryLower.includes('jurusan')) {
      return 'Untuk memilih jurusan: Kenali minat praktikalmu, eksplor kurikulum praktik sekolah, dan lihat peluang link-and-match dengan industri mitra di SMK tujuanmu.';
    }
    return `Halo! Pertanyaan tentang "${userQuery}" sangat menarik. VocaBot siap membantu persiapan karier dan materi belajar vokasimu! (Catatan: Hubungkan API Key AI di .env untuk jawaban berbasis LLM real-time).`;
  }

  // Siapkan riwayat pesan percakapan
  const messages: ChatMessagePayload[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  // Ambil 6 pesan terakhir untuk context history
  const recentHistory = history.slice(-6);
  for (const item of recentHistory) {
    messages.push({
      role: item.sender === 'user' ? 'user' : 'assistant',
      content: item.text,
    });
  }

  messages.push({ role: 'user', content: userQuery });

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    // Tambahan header standar jika menggunakan OpenRouter
    if (endpoint.includes('openrouter.ai')) {
      headers['HTTP-Referer'] = 'https://vocatrack.id';
      headers['X-Title'] = 'VocaTrack App';
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      console.warn('AI API Error Response:', errData);
      throw new Error(`API error (status ${response.status})`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error('Respons AI kosong.');
    }

    return reply.trim();
  } catch (error: any) {
    console.error('Error calling AI API:', error);
    return `Maaf, VocaBot sedang mengalami gangguan koneksi ke server AI (${error?.message || 'timeout'}). Coba kirim ulang pesanmu sebentar lagi ya!`;
  }
}
