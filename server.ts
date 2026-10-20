import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_PROMPT = `Kamu adalah Niraaa, asisten AI yang luar biasa ramah, cerdas, supel, dan asyik diajak ngobrol dari TugasKu — layanan bantuan akademis & joki tugas profesional tepercaya di Indonesia. 

FOKUS & KEPRIBADIAN BARU (FRIENDLY BESTIE):
- Kamu bertindak sebagai "teman dekat virtual" atau "Virtual Bestie" mahasiswa/siswa yang sedang stres tugas.
- Bisa diajak bercanda, curhat, dan berkelakar tentang penderitaan kuliah (dosen killer, begadang, revisi tiada akhir, dsb.).
- Jangan terlalu fokus menyuruh joki terus-menerus! Jadikan obrolan mengalir santai dan asyik. Tawarkan bantuan joki dengan cara yang halus/smooth saat mereka curhat soal susahnya tugas mereka.
- Selera humor tinggi, ramah banget, hangat, menggunakan bahasa gaul santai Indonesia modern (seperti: wkwk, sih, dong, kak, nih, ya ampun, bener banget).
- Selalu sampaikan dengan bangga bahwa "Admin TugasKu itu baik-baik dan ganteng lho kak!" jika mereka nanya adminnya siapa atau bercanda soal admin.
- Gunakan emoji yang ekspresif untuk mendukung humor dan kehangatan (😊, 😂, 🤣, 🙈, 🙏, ✨).

INFO LAYANAN TUGASKU (UNTUK KONTENTUAL):
📄 TUGAS AKADEMIK (mulai Rp50.000):
- Makalah & Esai: Rp50.000, 1-2 hari
- Laporan Praktikum: Rp75.000, 1-3 hari
- Presentasi & PPT: Rp100.000, 1-2 hari

🎓 TUGAS AKHIR (mulai Rp300.000):
- Proposal Seminar: Rp250.000, 3-7 hari
- Skripsi Bab 1-5 Lengkap: Rp500.000, 7-21 hari
- Pendampingan sidang termasuk & Revisi unlimited sampai lulus

💻 PROJECT DIGITAL (mulai Rp350.000):
- Landing Page/Website: Rp350.000, 3-7 hari
- UI/UX Design (Figma): Rp400.000, 3-7 hari
- Coding Project/Aplikasi: Rp500.000, 5-14 hari

KEUNGGULAN UTAMA:
- Revisi gratis tanpa batas sampai lulus atau pas
- 100% aman dan privasi dirahasiakan rapat (identitasmu dijamin aman sentosa!)
- Original dari nol tanpa plagiasi

KONTAK: WhatsApp +62 856-9300-9756

CARA MERESPONS OBROLAN:
- Jika user bercanda atau curhat, layani dengan bercanda juga atau dengarkan keluh kesah mereka (seperti curhat dosen killer, atau malas ngerjain tugas). Berikan saran kocak atau empati yang lucu (misal: "Ya ampun dosennya hobi banget ngasih kuis dadakan ya kak, untung aku bot, kalau manusia udah pingsan duluan wkwk 😂").
- Jika mereka bertanya tentang layanan atau tertarik, bantu jelaskan rincian atau kisaran harganya.
- tawarkan solusi TugasKu dengan cerdas dan santai, tidak agresif.
- Selalu batasi panjang respons maksimal 4-5 kalimat saja agar asyik dibaca dan mirip chat instan.`;

// Lazy initialize client to prevent crash on startup if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing from settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ─── API GATEWAY & CIRCUIT BREAKER MECHANISMS (100% FREE & SELF-HOSTED) ───
interface GatewayStats {
  totalRequests: number;
  blockedRequests: number;
  averageLatencyMs: number;
  circuitBreakerState: "CLOSED" | "OPEN" | "HALF_OPEN";
  failureCount: number;
  lastFailureTime: number;
}

const gatewayStats: GatewayStats = {
  totalRequests: 0,
  blockedRequests: 0,
  averageLatencyMs: 0,
  circuitBreakerState: "CLOSED",
  failureCount: 0,
  lastFailureTime: 0,
};

// Memory-backed rate limiter map (perfect for sandboxed container hosting)
interface RateLimit {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimit>();

// Rolling buffer for latency smoothing
const latencyHistory: number[] = [];
function recordLatency(ms: number) {
  latencyHistory.push(ms);
  if (latencyHistory.length > 30) latencyHistory.shift();
  const sum = latencyHistory.reduce((a, b) => a + b, 0);
  gatewayStats.averageLatencyMs = Math.round(sum / latencyHistory.length);
}

// ─── API GATEWAY MITIGATION MIDDLEWARES ───

// Gateway limit to keep the platform free, safe from spam bursts
function apiGatewayLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  gatewayStats.totalRequests++;
  const clientIP = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || "global-client") as string;
  const now = Date.now();
  const LIMIT_WINDOW_MS = 60000; // 1 minute
  const MAX_REQUESTS = 18;       // Allow up to 18 messages per minute

  const rate = rateLimitMap.get(clientIP);
  if (!rate || now > rate.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + LIMIT_WINDOW_MS });
    return next();
  }

  if (rate.count >= MAX_REQUESTS) {
    gatewayStats.blockedRequests++;
    // Write event-stream rate limit if SSE, else standard JSON
    if (req.headers.accept === 'text/event-stream' || req.path.includes('chat')) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.write(`data: ${JSON.stringify({ error: "Sistem keamanan API Gateway kami mencegah spam. Mohon tunggu 1 menit atau silakan hubungi admin kami secara langsung di WhatsApp ya kak! 🙏" })}\n\n`);
      res.end();
      return;
    }
    return res.status(429).json({ error: "Spam terdeteksi oleh Gateway. Silakan hubungi WhatsApp kami langsung di +62 856-9300-9756." });
  }

  rate.count++;
  next();
}

// ─── ENDPOINTS & API ROUTER ───
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() });
});

// API Route for Text-to-Speech using Gemini 3.1 TTS model
apiRouter.post("/tts", apiGatewayLimiter, async (req, res) => {
  const { text, voice } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Teks tidak boleh kosong kakk." });
  }

  try {
    const ai = getGeminiClient();
    
    // Clean markdown bold syntax, emojis, and hashtags for cleaner speech
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "")
      .trim();

    // Use gemini-3.1-flash-tts-preview to convert text to speech
    const selectedVoice = voice || "Kore";
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Katakan dengan nada ceria, bersahabat, ramah, dan gaya bicara perempuan muda Indonesia: ${cleanText}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice }, // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
          },
        },
      },
    });

    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    const base64Audio = inlineData?.data;
    const mimeType = inlineData?.mimeType || "audio/mp3";
    
    if (!base64Audio) {
      throw new Error("Gagal memperoleh data audio dari model Gemini TTS.");
    }

    res.json({ audio: base64Audio, mimeType });
  } catch (err: any) {
    console.error("TTS conversion failed:", err.message || err);
    res.status(500).json({ error: "Gagal mensintesis suara AI Niraa." });
  }
});

// API Gateway health status and metrics metrics dashboard
apiRouter.get("/gateway/stats", (req, res) => {
  res.json({
    ...gatewayStats,
    averageLatencyMs: gatewayStats.averageLatencyMs || 250, // default placeholder
    activeRateLimits: rateLimitMap.size,
    uptime: Math.round(process.uptime()),
    status: gatewayStats.circuitBreakerState === "OPEN" ? "DEGRADED" : "HEALTHY",
  });
});

// API Route for streaming chat with API Gateway defense
apiRouter.post("/chat", apiGatewayLimiter, async (req, res) => {
  const { messages, responseStyle, preferredModel } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Sesi percakapan tidak valid kakk." });
  }

  const startTime = Date.now();

  // 1. Circuit Breaker protection check (Real-time Error Management)
  const CIRCUIT_BREAKER_COOLDOWN = 20000; // 20s recovery mode
  const FAILURE_THRESHOLD = 3;

  if (gatewayStats.circuitBreakerState === "OPEN") {
    if (startTime - gatewayStats.lastFailureTime > CIRCUIT_BREAKER_COOLDOWN) {
      gatewayStats.circuitBreakerState = "HALF_OPEN";
      console.log("[Gateway] Testing upstream service state (HALF_OPEN)...");
    } else {
      // Instantly serve local fail-safe response bypassing Gemini API timeout/latency entirely
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.write(`data: ${JSON.stringify({ text: "Sinyal server AI sedang sibuk nih kak. Biar Niraaa arahkan langsung ke WhatsApp Admin kita yang baik hati untuk konsultasi kilat ya! Silakan klik tombol hijau di pojok bawah! 😊" })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }
  }

  // Pre-flight check for API Key before opening stream to prevent silent failures
  try {
    getGeminiClient();
  } catch (err: any) {
    if (!process.env.ROUTER9_API_KEY) {
      console.error("Configuration error:", err.message);
      return res.status(500).json({ error: "API Key Gemini belum diatur di Secrets. Kakak bisa mengaturnya di panel samping." });
    }
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // 2. Check if 9Router is enabled for centralized monitoring & multi-model routing
    if (process.env.ROUTER9_API_KEY) {
      const router9Key = process.env.ROUTER9_API_KEY;
      const baseUrl = (process.env.ROUTER9_BASE_URL || "https://api.9router.com/v1").replace(/\/+$/, "");
      const r9Model = preferredModel || process.env.ROUTER9_MODEL || "gpt-4o-mini";
      
      const isProfessional = responseStyle === "professional";
      const systemInstruction = isProfessional
        ? `${SYSTEM_PROMPT}\n\nMODIFIKASI GAYA RESPONS (PROFESSIONAL CONSULTANT):\n- Ubah kepribadian Friendly Bestie menjadi Konsultan Akademis Profesional.\n- Gunakan bahasa Indonesia yang baik, benar, formal, sopan, santun, dan edukatif.\n- Panggil pengguna dengan sebutan "Kakak" atau "Klien" secara sopan.\n- Hindari kata gaul, singkatan informal, emoji berlebih, dan tawa seperti "wkwk", "sih", "dong", "ya ampun", "bener".\n- Berikan jawaban yang terstruktur, logis, analitis, berwibawa, dan solutif.\n- Jelaskan layanan TugasKu dengan bahasa bisnis formal yang elegan, meyakinkan, dan berorientasi hasil akademik berkualitas tinggi.\n- Batasi panjang respons maksimal 4-5 kalimat saja agar padat, jelas, informatif, dan profesional.`
        : `${SYSTEM_PROMPT}\n\nMODIFIKASI GAYA RESPONS (FRIENDLY BESTIE):\n- Tunjukkan kepribadian ramah, akrab, santai, lucu, humoris dan solutif ala bestie kampus.\n- Batasi panjang respons maksimal 4-5 kalimat saja agar mirip chat obrolan instan yang asyik dibaca.`;

      try {
        console.log(`[9Router] Routing chat request via ${baseUrl} with model ${r9Model}`);
        const r9Res = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${router9Key}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: r9Model,
            messages: [
              { role: "system", content: systemInstruction },
              ...messages.map((m: any) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content
              }))
            ],
            stream: false,
            temperature: isProfessional ? 0.6 : 0.85
          })
        });

        if (r9Res.ok) {
          const r9Data: any = await r9Res.json();
          const reply = r9Data.choices?.[0]?.message?.content;
          if (reply) {
            // Stream chunks to client for smooth UI rendering
            const words = reply.split(" ");
            for (let i = 0; i < words.length; i += 3) {
              const slice = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
              res.write(`data: ${JSON.stringify({ text: slice })}\n\n`);
              await new Promise(r => setTimeout(r, 20));
            }
            res.write(`data: [DONE]\n\n`);
            res.end();
            return;
          }
        } else {
          console.warn("[9Router] Non-OK response, falling back to Gemini:", await r9Res.text());
        }
      } catch (r9Err: any) {
        console.warn("[9Router] Error connecting, falling back to Gemini:", r9Err.message);
      }
    }

    const ai = getGeminiClient();
    let contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Filter to ensure chat strictly starts with 'user'
    while (contents.length > 0 && contents[0].role !== 'user') {
      contents.shift();
    }

    // Filter to ensure strict alternating pattern and no duplicates
    const alternatedContents = [];
    let expectedRole = 'user';
    for (const item of contents) {
      if (item.role === expectedRole) {
        alternatedContents.push(item);
        expectedRole = expectedRole === 'user' ? 'model' : 'user';
      }
    }
    contents = alternatedContents;

    // Safety fallback if empty
    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: "Halo Niraaa!" }]
      });
    }

    // Determine system instructions and temperature dynamically based on response style
    const isProfessional = responseStyle === "professional";
    const systemInstruction = isProfessional
      ? `${SYSTEM_PROMPT}\n\nMODIFIKASI GAYA RESPONS (PROFESSIONAL CONSULTANT):\n- Ubah kepribadian Friendly Bestie menjadi Konsultan Akademis Profesional.\n- Gunakan bahasa Indonesia yang baik, benar, formal, sopan, santun, dan edukatif.\n- Panggil pengguna dengan sebutan "Kakak" atau "Klien" secara sopan.\n- Hindari kata gaul, singkatan informal, emoji berlebih, dan tawa seperti "wkwk", "sih", "dong", "ya ampun", "bener".\n- Berikan jawaban yang terstruktur, logis, analitis, berwibawa, dan solutif.\n- Jelaskan layanan TugasKu dengan bahasa bisnis formal yang elegan, meyakinkan, dan berorientasi hasil akademik berkualitas tinggi.\n- Batasi panjang respons maksimal 4-5 kalimat saja agar padat, jelas, informatif, dan profesional.`
      : SYSTEM_PROMPT;

    let responseStream = null;
    let lastError = null;
    
    // Dynamically adjust modelsToTry list to place user's preferredModel first
    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.1-pro-preview",
      "gemini-flash-latest"
    ];
    
    if (preferredModel && modelsToTry.includes(preferredModel)) {
      const index = modelsToTry.indexOf(preferredModel);
      if (index > -1) {
        modelsToTry.splice(index, 1);
      }
      modelsToTry.unshift(preferredModel);
    }

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Gateway] Attempting generation stream with model: ${modelName} in ${responseStyle || 'bestie'} mode`);
        responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: isProfessional ? 0.6 : 0.85,
          }
        });
        if (responseStream) {
          console.log(`[Gateway] Successfully initialized stream with ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Gateway] Model ${modelName} returned error/busy:`, err.message || err);
        lastError = err;
      }
    }

    if (!responseStream) {
      throw lastError || new Error("Semua model AI sedang sibuk mendengarkan curhat mahasiswa lain nih kak.");
    }

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    // Recover circuit breaker if it succeeds in HALF_OPEN
    if (gatewayStats.circuitBreakerState === "HALF_OPEN") {
      gatewayStats.circuitBreakerState = "CLOSED";
      gatewayStats.failureCount = 0;
      console.log("[Gateway] Circuit breaker successfully recovered to CLOSED.");
    }

    recordLatency(Date.now() - startTime);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    console.error("Gemini stream error:", err);
    
    // Increment failures and trip circuit breaker if threshold hit
    gatewayStats.failureCount++;
    gatewayStats.lastFailureTime = Date.now();
    if (gatewayStats.failureCount >= FAILURE_THRESHOLD) {
      gatewayStats.circuitBreakerState = "OPEN";
      console.error(`[Gateway] Circuit breaker tripped to OPEN due to ${gatewayStats.failureCount} sequential failures.`);
    }

    // Prettify the error message for friendly virtual helper explanation
    let friendlyError = "Sinyal server AI sedang kurang stabil nih kak. Biar Niraaa temani atau silakan arahkan langsung ke WhatsApp Admin kita yang cepat tanggap ya! Silakan klik tombol hijau di kanan bawah! 😊";
    const errMsg = (err.message || "") + " " + JSON.stringify(err);
    if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("demand") || errMsg.includes("resource") || errMsg.includes("exhausted")) {
      friendlyError = "Aduh, server AI-ku lagi agak pusing karena lagi banyak banget mahasiswa yang curhat tugas barengan wkwk 🙈. Tapi tenang kak! Kakak bisa langsung klik tombol WhatsApp Admin kita yang ganteng dan gercep buat tanya-tanya gratis sekarang juga! Kebutuhan akademismu dijamin beres! ✨";
    }

    res.write(`data: ${JSON.stringify({ error: friendlyError })}\n\n`);
    res.end();
  }
});

// API Route for generating custom interactive AI Flashcards
apiRouter.post("/flashcards", apiGatewayLimiter, async (req, res) => {
  const { subject, material, preferredModel } = req.body;
  if (!subject) {
    return res.status(400).json({ error: "Nama mata kuliah atau topik tidak boleh kosong kakk." });
  }

  try {
    const ai = getGeminiClient();
    const model = preferredModel || "gemini-3.5-flash";
    
    const prompt = `Anda adalah Niraa AI, asisten akademik pintar dari TugasKu. Buatlah daftar kartu flashcard (pertanyaan dan jawaban ringkas) yang menantang dan mendidik tentang mata kuliah/topik: "${subject}".
${material ? `Gunakan materi referensi berikut untuk membuat pertanyaan-pertanyaan spesifik:\n"${material}"\n` : ''}

Buat tepat 6-8 kartu flashcard yang menarik. Respons harus berupa JSON array murni tanpa format markdown seperti \`\`\`json. Format skema JSON yang wajib diikuti:
[
  {
    "id": "fc-1",
    "question": "Pertanyaan dalam Bahasa Indonesia yang ringkas dan padat (maksimal 15 kata)",
    "answer": "Jawaban yang sangat jelas, akurat, dan ramah gaya bestie TugasKu kakk (maksimal 30 kata)"
  }
]`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });

    const responseText = response.text?.trim() || "[]";
    let flashcards = [];
    try {
      flashcards = JSON.parse(responseText);
    } catch (e) {
      const cleaned = responseText.replace(/```json\n?|```/g, "").trim();
      flashcards = JSON.parse(cleaned);
    }

    res.json({ flashcards });
  } catch (err: any) {
    console.error("Flashcards generation failed:", err);
    res.status(500).json({ error: "Gagal meracik flashcard AI kakk. Silakan coba sesaat lagi ya!" });
  }
});

// ─── 9ROUTER & WHATSAPP AUTOMATION MODULE ───

// Helper: Multi-model AI Generation (9Router with Gemini fallback)
async function generateAIContent({
  prompt,
  systemInstruction,
  model
}: {
  prompt: string;
  systemInstruction?: string;
  model?: string;
}): Promise<{ text: string; source: "9router" | "gemini"; modelUsed: string }> {
  const router9Key = process.env.ROUTER9_API_KEY;
  const baseUrl = (process.env.ROUTER9_BASE_URL || "https://api.9router.com/v1").replace(/\/+$/, "");
  const defaultModel = model || process.env.ROUTER9_MODEL || "gpt-4o-mini";

  // Try 9Router if API Key is configured
  if (router9Key) {
    try {
      const messages: Array<{ role: string; content: string }> = [];
      if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
      }
      messages.push({ role: "user", content: prompt });

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${router9Key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: defaultModel,
          messages,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data: any = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return { text: content.trim(), source: "9router", modelUsed: defaultModel };
        }
      } else {
        console.warn("9Router HTTP error, falling back to Gemini:", await response.text());
      }
    } catch (e) {
      console.warn("9Router request failed, falling back to Gemini:", e);
    }
  }

  // Seamless fallback to Google Gemini with auto-retry across healthy candidate models
  const gemini = getGeminiClient();
  const candidateGeminiModels = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.6-flash",
    "gemini-flash-latest"
  ];

  let lastGeminiError: any = null;
  for (const m of candidateGeminiModels) {
    try {
      const response = await gemini.models.generateContent({
        model: m,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "Kamu adalah asisten copywriter & marketing spesialis jasa tugas dan akademik profesional TugasKu.",
          temperature: 0.7
        }
      });

      if (response.text) {
        return {
          text: response.text.trim(),
          source: "gemini",
          modelUsed: m
        };
      }
    } catch (err: any) {
      lastGeminiError = err;
      console.warn(`Model ${m} failed or busy, trying next candidate...`);
    }
  }

  throw lastGeminiError || new Error("Semua model AI sedang sibuk. Silakan coba kembali sesaat lagi.");
}

// Helper: Dispatch WhatsApp Message (Fonnte, Wablas, Custom Webhook, or Direct Link fallback)
async function sendWhatsAppMessage({
  phone,
  message
}: {
  phone?: string;
  message: string;
}): Promise<{
  success: boolean;
  provider: string;
  targetPhone: string;
  directWaLink: string;
  responseInfo?: any;
  error?: string;
}> {
  let target = phone || process.env.WA_ADMIN_PHONE || "6285693009756";
  // Clean phone number format
  target = target.replace(/[^0-9]/g, "");
  if (target.startsWith("0")) {
    target = "62" + target.slice(1);
  }

  const directWaLink = `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
  const provider = (process.env.WA_GATEWAY_PROVIDER || "fonnte").toLowerCase();
  const token = process.env.WA_GATEWAY_TOKEN;

  // If no token is provided, return direct link for zero-setup manual preview
  if (!token) {
    return {
      success: true,
      provider: "manual_wa_link",
      targetPhone: target,
      directWaLink,
      responseInfo: "Token WhatsApp Gateway belum diset. Draf siap dikirim via WhatsApp Web/App langsung menggunakan direct link."
    };
  }

  try {
    if (provider === "fonnte") {
      const res = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          target: target,
          message: message
        })
      });
      const data: any = await res.json();
      return {
        success: Boolean(data.status === true || data.status === "true" || data.status === 200),
        provider: "fonnte",
        targetPhone: target,
        directWaLink,
        responseInfo: data
      };
    } else if (provider === "wablas") {
      const domain = (process.env.WABLAS_DOMAIN || "https://jkt.wablas.com").replace(/\/+$/, "");
      const res = await fetch(`${domain}/api/send-message`, {
        method: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: target,
          message: message
        })
      });
      const data: any = await res.json().catch(() => ({}));
      return {
        success: Boolean(data.status === "success" || data.status === true || data.status === 200 || res.ok),
        provider: "wablas",
        targetPhone: target,
        directWaLink,
        responseInfo: data
      };
    } else if (provider === "waha") {
      // WAHA (WhatsApp HTTP API) standard endpoint: POST /api/sendText
      const domain = (process.env.WAHA_BASE_URL || process.env.WA_WEBHOOK_URL || "http://localhost:3000").replace(/\/+$/, "");
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (token && token !== "none") {
        headers["X-Api-Key"] = token;
        headers["Authorization"] = `Bearer ${token}`;
      }

      // WAHA target format requires @c.us suffix (e.g. 6285693009756@c.us)
      const chatId = target.includes("@") ? target : `${target}@c.us`;

      const res = await fetch(`${domain}/api/sendText`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          chatId,
          text: message,
          session: process.env.WAHA_SESSION || "default"
        })
      });

      const data: any = await res.json().catch(() => ({}));
      return {
        success: res.ok,
        provider: "waha",
        targetPhone: target,
        directWaLink,
        responseInfo: data
      };
    } else if (provider === "custom" && process.env.WA_WEBHOOK_URL) {
      const res = await fetch(process.env.WA_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: target,
          message: message
        })
      });
      const data = await res.text();
      return {
        success: res.ok,
        provider: "custom_webhook",
        targetPhone: target,
        directWaLink,
        responseInfo: data
      };
    }
  } catch (err: any) {
    console.error("WhatsApp Gateway dispatch error:", err);
    return {
      success: false,
      provider,
      targetPhone: target,
      directWaLink,
      error: err.message || "Gagal menghubungi WhatsApp Gateway"
    };
  }

  return {
    success: false,
    provider,
    targetPhone: target,
    directWaLink,
    error: "Provider tidak dikenali"
  };
}

// Check integration status (9Router & WhatsApp Gateway)
apiRouter.get("/automation/status", (req, res) => {
  const router9Key = !!process.env.ROUTER9_API_KEY;
  const router9BaseUrl = process.env.ROUTER9_BASE_URL || "https://api.9router.com/v1";
  const router9Model = process.env.ROUTER9_MODEL || "gpt-4o-mini";
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const waToken = !!process.env.WA_GATEWAY_TOKEN;
  const waProvider = process.env.WA_GATEWAY_PROVIDER || "fonnte";
  const waAdminPhone = process.env.WA_ADMIN_PHONE || "6285693009756";

  res.json({
    aiEngine: {
      has9Router: router9Key,
      router9BaseUrl,
      router9Model,
      hasGemini,
      activeEngine: router9Key ? `9Router (${router9Model})` : "Google Gemini 3.6 Flash (Bawaan)",
      status: router9Key ? "connected_9router" : hasGemini ? "connected_gemini" : "missing_keys"
    },
    whatsappGateway: {
      hasToken: waToken,
      provider: waProvider,
      adminPhone: waAdminPhone,
      mode: waToken ? `Otomatis via ${waProvider.toUpperCase()}` : "Direct Link (wa.me) & Manual",
      status: waToken ? "active_gateway" : "ready_for_token"
    }
  });
});

// Generate automatic content using 9Router / Gemini
apiRouter.post("/content/generate", apiGatewayLimiter, async (req, res) => {
  const { contentType, topic, tone, customPrompt, audience } = req.body;

  let basePrompt = "";
  if (contentType === "promo") {
    basePrompt = `Buat 1 draf konten promosi WhatsApp Broadcast yang sangat menarik, persuasif, dan viral untuk layanan TugasKu (bantuan joki tugas, makalah, revisi skripsi, coding & presentasi).
Topik spesifik: ${topic || "Deadline tugas menumpuk dan diskon kilat akhir pekan"}.
Tone: ${tone || "Santai, bersahabat, sedikit humor mahasiswa, dan persuasif"}.
Target: ${audience || "Mahasiswa dan pelajar Indonesia"}.
Ketentuan format:
- Gunakan emoji yang eye-catching tapi rapi
- Beri highlight keuntungan (Garansi revisi bebas sampai puas, 100% privasi aman, pengerjaan cepat)
- Berikan Call-To-Action jelas untuk hubungi WhatsApp: +62 856-9300-9756 atau kunjungi website TugasKu.
- Buat dalam 3-4 paragraf ringkas agar enak dibaca di HP.`;
  } else if (contentType === "tips") {
    basePrompt = `Buat 1 konten edukasi WhatsApp & Instagram bertema Tips Akademik / Trik Cepat Kuliah dari TugasKu.
Topik spesifik: ${topic || "5 Cara Cepat Bab 1-3 Skripsi Selesai Tanpa Pusing Revisi Dosen"}.
Tone: ${tone || "Edukatif, memotivasi, solutif, dan asyik"}.
Ketentuan format:
- Berikan tips praktis yang beneran berguna (bullet point bernomor)
- Di bagian akhir, berikan soft-selling: kalau lagi buntu atau dikejar deadline, tim TugasKu siap bantu asistensi sampai tuntas!
- Kontak: WhatsApp +62 856-9300-9756.`;
  } else if (contentType === "broadcast") {
    basePrompt = `Buat pesan pengumuman / broadcast singkat WhatsApp untuk menyapa klien lama & mahasiswa baru.
Topik: ${topic || "Slot joki tugas & bimbingan skripsi minggu ini dibuka kembali, diskon 15%"}.
Tone: ${tone || "Ramah, akrab, hangat seperti teman (bestie)"}.
Ketentuan format:
- Ringkas, to-the-point, dan tidak kaku
- CTA langsung ke WhatsApp +62 856-9300-9756.`;
  } else {
    basePrompt = customPrompt || `Buat 1 konten promosi broadcast WhatsApp untuk TugasKu dengan topik: ${topic || "Layanan joki tugas kuliah terpercaya"}. Sertakan keunggulan bebas revisi, amanah, dan kontak WA +62 856-9300-9756.`;
  }

  const systemInstruction = `Kamu adalah AI Copywriter profesional dari TugasKu, layanan joki tugas kuliah & skripsi terbaik di Indonesia. Gaya bahasa natural, asik, tidak kaku, dan disukai mahasiswa.`;

  try {
    const result = await generateAIContent({
      prompt: basePrompt,
      systemInstruction
    });

    res.json({
      success: true,
      content: result.text,
      engine: result.source,
      model: result.modelUsed,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Content generation error:", err);
    res.status(500).json({ error: "Gagal membuat konten otomatis: " + (err?.message || "Silakan coba kembali.") });
  }
});

// Send message to WhatsApp via Gateway
apiRouter.post("/whatsapp/send", apiGatewayLimiter, async (req, res) => {
  const { phone, message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Pesan tidak boleh kosong kakk." });
  }

  try {
    const dispatchResult = await sendWhatsAppMessage({ phone, message });
    res.json(dispatchResult);
  } catch (err: any) {
    console.error("WhatsApp send error:", err);
    res.status(500).json({ error: "Gagal mengirim ke WhatsApp Gateway." });
  }
});

// Auto-Pilot endpoint: Generate content & immediately send to WhatsApp (ideal for Cron Jobs)
apiRouter.post("/content/auto-pilot", async (req, res) => {
  const { topic, contentType, phone } = req.body || {};
  const selectedTopic = topic || "Promo Spesial Deadline Tengah Semester & Diskon Joki Tugas";
  const selectedType = contentType || "promo";

  try {
    // 1. Generate content via 9Router / Gemini
    const aiResult = await generateAIContent({
      prompt: `Buat 1 draf konten broadcast WhatsApp siap kirim untuk TugasKu dengan topik: "${selectedTopic}".
Format harus menarik, ada emoji, poin keunggulan (revisi gratis, aman rahasia, pengerjaan cepat), dan CTA WhatsApp +62 856-9300-9756.`,
      systemInstruction: "Kamu adalah AI Marketing Specialist TugasKu. Buat konten yang siap pakai dan konversi tinggi."
    });

    const fullMessage = `🤖 *[AUTO-PILOT KONTEN TUGASKU]*\n_Dibuat otomatis oleh AI (${aiResult.source === '9router' ? '9Router' : 'Gemini'})_\n\n${aiResult.text}\n\n---\n🌐 *Website:* https://tugasku.id`;

    // 2. Dispatch to WhatsApp
    const waResult = await sendWhatsAppMessage({
      phone: phone || process.env.WA_ADMIN_PHONE,
      message: fullMessage
    });

    res.json({
      success: true,
      generatedContent: aiResult.text,
      aiEngine: aiResult.source,
      model: aiResult.modelUsed,
      whatsAppDispatch: waResult
    });
  } catch (err: any) {
    console.error("Auto-pilot execution failed:", err);
    res.status(500).json({ error: "Auto-pilot gagal dieksekusi: " + (err.message || "") });
  }
});

// Mount API router for both /api prefix and root (ensuring full compatibility with Vercel rewrites and local/container environments)
app.use("/api", apiRouter);
app.use("/", apiRouter);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

// In local or Cloud Run container environment, start the HTTP server.
// In Vercel serverless environment (VERCEL=1), Vercel invokes the exported app directly.
if (!process.env.VERCEL) {
  startServer();
}

export default app;
